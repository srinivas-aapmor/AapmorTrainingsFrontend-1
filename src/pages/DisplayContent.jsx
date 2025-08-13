import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Radio,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Tooltip from "@mui/material/Tooltip";
import { useEndUser } from "../context/endUserContextProvider";
import { getTraining } from "../services/getTraining";
import { useUser } from "../context/userProvider";
import { axiosInstance } from "../utils/axios";
import trophy from "../assets/trophy.gif";

export default function DisplayContent() {
  const [training, setTraining] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedSlides, setCompletedSlides] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgess] = useState(0);
  const [status, setStatus] = useState("due");
  const [isRestarting, setIsRestarting] = useState(false);
  const [lastContentSlide, setLastContentSlide] = useState(0);
  const { setTrainings, setDue, setAssigned, setCompleted } = useEndUser();
  const location = useLocation();
  const navigate = useNavigate();
  const trainingId = location.state?.id;
  const { user } = useUser();

  // console.log(user)

  useEffect(() => {
    async function getdata() {
      if (!trainingId) return;
      try {
        const res = await getTraining(trainingId, user.emp_id);
        const trainingData = res.trainings;
        setTraining(trainingData);

        const savedIndex = trainingData.assigned_to[0].lastContentSlide ?? 0;
        const savedProgress = trainingData.assigned_to[0].progress ?? 0;
        setProgess(savedProgress);
        setCurrentIndex(savedIndex + 1);
        setLastContentSlide(savedIndex);

        const completed = Array.from({ length: savedIndex + 1 }, (_, i) => i);
        setCompletedSlides(completed);
        setAnswers({});
        setScore(0);
        setShowResults(false);
        setStatus("due");
      } catch (err) {
        console.error("API Error:", err);
      }
    }
    getdata();
  }, [trainingId, isRestarting]);

  if (!training) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  // console.log(training);

  const blocks = training?.ppt_data || [];
  const currentBlock = blocks[currentIndex];
  const totalSlides = blocks.length;

  const handleNext = async () => {
    let newCompletedSlides = completedSlides;
    if (!completedSlides.includes(currentIndex)) {
      newCompletedSlides = [...completedSlides, currentIndex];
      setCompletedSlides(newCompletedSlides);
    }
    let updatedLastContentSlide = lastContentSlide;
    if (currentBlock.type === "content") {
      setLastContentSlide(currentIndex);
      updatedLastContentSlide = currentIndex;
    }

    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStatus("due");

      const updatedProgress = Math.round(
        ((newCompletedSlides.includes(currentIndex)
          ? newCompletedSlides.length
          : newCompletedSlides.length + 1) /
          totalSlides) *
          100
      );

      await updateTrainingStatus(
        "due",
        updatedProgress,
        updatedLastContentSlide
      );
    } else if (currentIndex === totalSlides - 1) {
      await calculateScore();
      setShowResults(true);
    }
  };

  const handleAnswer = (question, idx, isMultiple) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const selected = prev[question] || [];
        if (selected.includes(idx)) {
          return { ...prev, [question]: selected.filter((i) => i !== idx) };
        } else {
          return { ...prev, [question]: [...selected, idx] };
        }
      } else {
        return { ...prev, [question]: idx };
      }
    });
  };

  const handleDoneClick = () => {
    navigate("/");
  };

  const calculateScore = async () => {
    let totalQuestions = 0;
    let correct = 0;
    blocks.forEach((block) => {
      if (block.type === "question") {
        totalQuestions++;
        const userAnswer = answers[block.question];
        const correctAnswer = block.answers;
        if (block.question_type === "single") {
          const correctIndex = block.options.findIndex((opt) =>
            opt.startsWith(correctAnswer)
          );
          if (correctIndex === userAnswer) {
            correct++;
          }
        } else {
          if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
            const userSorted = [...userAnswer].sort();
            const correctSorted = correctAnswer
              .map((a) => block.options.findIndex((opt) => opt.startsWith(a)))
              .sort();
            if (JSON.stringify(correctSorted) === JSON.stringify(userSorted)) {
              correct++;
            }
          }
        }
      }
    });
    const finalScore =
      totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    setScore(finalScore);
    if (finalScore >= 70) {
      setStatus("completed");
      setProgess(100);
      setDue((prev) => prev - 1);
      setCompleted((prev) => prev + 1);
      await updateTrainingStatus("completed", 100, lastContentSlide);
    } else {
      setStatus("due");
      const currentProgress = Math.round(
        (completedSlides.length / totalSlides) * 100
      );
      setProgess(currentProgress);
      await updateTrainingStatus("due", currentProgress, lastContentSlide);
    }
  };

  const updateTrainingStatus = async (
    newStatus,
    newProgress,
    lastSlide = 0
  ) => {
    if (!trainingId) return;
    try {
      const body = {
        emp_id: user.emp_id,
        training_id: trainingId,
        status: newStatus,
        progress: newProgress,
        lastContentSlide: lastSlide,
      };

      const response = await axiosInstance.post("update-training-status", body);

      if (response && response.status === 200) {
        setTrainings((prev) => {
          if (!prev) return prev;
          return prev.map((t) =>
            t.id === trainingId
              ? {
                  ...t,
                  status: newStatus,
                  progress: newProgress,
                  lastContentSlide: lastSlide ?? t.lastContentSlide,
                }
              : t
          );
        });
      }
    } catch (err) {
      console.error("Failed to update training status", err);
    }
  };

  const progressPercentage = Math.round(
    (completedSlides.length / totalSlides) * 100
  );

  const handleGoBack = async () => {
    let newStatus = status;
    let newProgress = progress;
    if (status !== "completed") {
      newStatus = "due";
      newProgress = Math.round((completedSlides.length / totalSlides) * 100);
    } else {
      newStatus = "completed";
      newProgress = 100;
    }
    setStatus(newStatus);
    setProgess(newProgress);
    if (newStatus !== "completed")
      await updateTrainingStatus(newStatus, newProgress, lastContentSlide);
    navigate(-1);
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    setCurrentIndex(0);
    setCompletedSlides([]);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setStatus("due");
    setProgess(0);
    await updateTrainingStatus("due", 0, 0);
    setTimeout(() => setIsRestarting(false), 100);
  };

  return (
    <Box>
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          height={64}
          mb={0}
          px={2}
          position="relative"
        >
          <Tooltip title="Go to Assigned Training" placement="bottom" arrow>
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{
                backgroundColor: "#C95343",
                textTransform: "none",
                px: 1.2,
                py: 0.5,
                gap: 1,
                mt: 3,
                borderRadius: 1,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                  md: "1rem",
                },
                minWidth: "fit-content",
                "&:hover": {
                  backgroundColor: "#b04134",
                },
              }}
            >
              <ArrowCircleLeftIcon
                sx={{
                  fontSize: {
                    xs: 18,
                    sm: 20,
                    md: 24,
                  },
                }}
              />
              Back
            </Button>
          </Tooltip>

          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
              fontSize: {
                xs: "1.2rem",
                sm: "1.5rem",
                md: "2rem",
              },
            }}
          >
            {training.title || "Training Session"}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            textAlign="center"
          >
            Progress: {progressPercentage}%
          </Typography>
          <LinearProgress variant="determinate" value={progressPercentage} />
        </Box>
        {showResults ? (
          <Card
            variant="outlined"
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <img
                src={trophy}
                alt="Trophy"
                style={{ width: 120, marginBottom: 16, color: "red" }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                color="primary"
                gutterBottom
              >
                Training Completed
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Your Score: {score}%
              </Typography>
              <Button
                variant="contained"
                onClick={handleDoneClick}
                sx={{
                  backgroundColor: "#0c905dff",
                  textTransform: "none",
                  px: 1.2,
                  py: 0.5,
                  gap: 1,
                  mt: 3,
                  borderRadius: 1,
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                  },
                  minWidth: "fit-content",
                  "&:hover": {
                    backgroundColor: "#b04134",
                  },
                }}
              >
                <ArrowCircleLeftIcon
                  sx={{
                    fontSize: {
                      xs: 18,
                      sm: 20,
                      md: 24,
                    },
                  }}
                />
                Back to Home
              </Button>
              {score < 70 && (
                <>
                  <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                    You need at least 70% to complete this training. Please
                    restart and try again.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2, textTransform: "none" }}
                    onClick={handleRestart}
                  >
                    Restart Training
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 3,
              }}
            >
              {currentBlock.type === "title" && (
                <Box
                  sx={{
                    textAlign: "center",
                    my: 8,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="primary"
                    gutterBottom
                  >
                    {currentBlock.title || "Untitled Training"}
                  </Typography>
                </Box>
              )}

              {currentBlock.type === "content" && (
                <Box>
                  {currentBlock.heading &&
                    currentBlock.heading !== "Untitled" && (
                      <Typography variant="h5" fontWeight={700}>
                        {currentBlock.heading}
                      </Typography>
                    )}

                  {currentBlock.subheadings?.map(
                    (sub, idx) =>
                      (sub.subheading !== "Untitled" ||
                        sub.content.length > 0 ||
                        sub.images?.length > 0) && (
                        <Box key={idx} mb={1}>
                          {sub.subheading !== "Untitled" && (
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              {sub.subheading}
                            </Typography>
                          )}

                          <List dense>
                            {sub.content.map((line, i) => (
                              <ListItem
                                key={i}
                                sx={{ py: 0.2, minHeight: "unset" }}
                              >
                                <ListItemText primary={line} />
                              </ListItem>
                            ))}
                          </List>

                          {sub.images?.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                              {sub.images.map((imgUrl, imgIdx) => (
                                <img
                                  key={imgIdx}
                                  src={imgUrl}
                                  alt={`slide-${currentBlock.slide_number}-img-${imgIdx}`}
                                  style={{
                                    width: "100%",
                                    maxWidth: 500,
                                    maxHeight: 300,
                                    objectFit: "contain",
                                    borderRadius: 8,
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      )
                  )}
                </Box>
              )}

              {currentBlock.type === "question" && (
                <Box>
                  <Typography variant="h6" fontWeight={500} gutterBottom>
                    {currentBlock.question}
                  </Typography>
                  <List>
                    {currentBlock.options.map((opt, idx) => {
                      const isMultiple =
                        currentBlock.question_type === "multiple";
                      //   const selected =
                      //     answers[currentBlock.question] ||
                      //     (isMultiple ? [] : null);
                      const selected =
                        answers[currentBlock.question] !== undefined
                          ? answers[currentBlock.question]
                          : isMultiple
                          ? []
                          : null;

                      const isChecked = isMultiple
                        ? selected.includes(idx)
                        : selected === idx;

                      return (
                        <ListItem key={idx}>
                          <FormControlLabel
                            control={
                              isMultiple ? (
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() =>
                                    handleAnswer(
                                      currentBlock.question,
                                      idx,
                                      true
                                    )
                                  }
                                />
                              ) : (
                                <Radio
                                  checked={isChecked}
                                  onChange={() =>
                                    handleAnswer(
                                      currentBlock.question,
                                      idx,
                                      false
                                    )
                                  }
                                />
                              )
                            }
                            label={opt}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
            </CardContent>

            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
              borderTop="none"
              bgcolor="transparent"
              boxShadow="none"
            >
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={
                  currentBlock.type === "question" &&
                  (answers[currentBlock.question] === undefined ||
                    (Array.isArray(answers[currentBlock.question]) &&
                      answers[currentBlock.question].length === 0))
                }
                sx={{
                  backgroundColor: "#666687",
                  textTransform: "none",
                  px: 1.5,
                  py: 0.5,
                  gap: 0.5,
                  //   borderRadius: 3,
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                  },
                  minWidth: "fit-content",
                  "&:hover": {
                    backgroundColor: "#404069",
                  },
                }}
              >
                {currentIndex === totalSlides - 1 ? "Finish" : "Next"}
                <ArrowCircleRightIcon
                  sx={{
                    fontSize: {
                      xs: 18,
                      sm: 20,
                      md: 24,
                    },
                    ml: 0.5,
                  }}
                />
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}
