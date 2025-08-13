import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Slide,
  Typography,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { useUser } from "../context/userProvider";
import { uploadTrainingData } from "../services/getAdminDashboardData";
import { axiosInstance } from "../utils/axios";
import { useAdminContext } from "../context/AdminContextProvider";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UploadDialog = ({ open, handleClose, setAllTrainings }) => {
  const { departments } = useAdminContext();
  const { user } = useUser();

  const [training, setTraining] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!training) setIsChanged(false);
  }, [training]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && (file.name.endsWith(".ppt") || file.name.endsWith(".pptx"))) {
      const newTitle = file.name.replace(/\.[^/.]+$/, "");

      const newTraining = {
        id: Date.now(),
        title: newTitle,
        department: "",
        timePeriod: "",
        file,
      };

      setTraining(newTraining);
      setIsChanged(true);

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } else {
      toast.error("Please upload a valid PPT or PPTX file.");
    }

    e.target.value = null;
  };

  const handleDeptChange = (value) => {
    setTraining((prev) => ({ ...prev, department: value }));
    setIsChanged(true);
  };

  const handleDelete = () => {
    setTraining(null);
    setIsChanged(true);
    toast.success("Training Deleted Successfully!");
  };

  const handleSave = async () => {
    if (!training?.department || !training?.timePeriod) {
      toast.warning("Please fill in department and time period.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("file", training.file);
      formData.append("uploaded_by_name", user.name);
      formData.append("uploaded_by_id", user.emp_id);
      formData.append("uploaded_department", user.role);
      formData.append("role", "admin");
      formData.append("department", training.department);
      formData.append("time_period", training.timePeriod);
      formData.append("training_status", "active");
      formData.append("priority", "medium");
      formData.append("enrolled_employees", "0");

      const response = await uploadTrainingData(axiosInstance, formData);
      toast.success("Training uploaded Successfully!");

      setAllTrainings((prev) => [...prev, response.training]);

      setTraining(null);
      setIsChanged(false);
      handleClose();
    } catch (err) {
      console.error("Failed to upload training:", training.title, err);
      toast.error("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      BackdropProps={{ sx: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
      PaperProps={{
        sx: {
          borderRadius: 0,
          p: 3,
          backgroundColor: "#fff",
          position: "relative",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Upload Training
        </Typography>
        <Box display="flex" alignItems="center">
          <Box display="flex" justifyContent="flex-end">
            <input
              accept=".ppt,.pptx"
              type="file"
              id="ppt-upload"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <label htmlFor="ppt-upload">
              <Button
                variant="contained"
                component="span"
                sx={{
                  backgroundColor: "#ff8f07",
                  color: "white",
                  textTransform: "none",
                  px: 2,
                  mr: 13,
                  py: 0.8,
                  boxShadow: "none",
                }}
                startIcon={<AddCircleOutlineIcon />}
                disabled={!!training}
              >
                Add New Training
              </Button>
            </label>
          </Box>
          <Tooltip title="Click to Close" placement="bottom" arrow>
            <IconButton
              onClick={handleClose}
              sx={{ width: 48, height: 48, padding: 1 }}
            >
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          maxHeight: 240,
          overflowY: "auto",
          pr: 1,
          mt: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#999",
          },
        }}
      >
        {!training ? (
          <Typography
            fontSize={16}
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1, mb: 2 }}
          >
            Upload a training file to begin
          </Typography>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1.5}
            borderBottom="1px solid #e0e0e0"
          >
            <Typography width="5%" fontSize={15}>
              1
            </Typography>
            <Typography width="25%" fontSize={15}>
              {training.title}
            </Typography>
            <Tooltip title="Only positive numbers allowed" arrow>
              <input
                type="number"
                placeholder="Enter Timeperiod"
                min="0"
                max="365"
                style={{
                  width: "20%",
                  height: "36px",
                  padding: "0 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
                value={training.timePeriod === 0 ? "" : training.timePeriod}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow empty input so user can delete the number
                  if (value === "") {
                    setTraining((prev) => ({
                      ...prev,
                      timePeriod: "",
                    }));
                    setIsChanged(true);
                    return;
                  }

                  const numValue = parseInt(value, 10);

                  // Only allow numbers between 1 and 365
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 365) {
                    setTraining((prev) => ({
                      ...prev,
                      timePeriod: numValue,
                    }));
                    setIsChanged(true);
                  }
                }}
              />
            </Tooltip>
            <Select
              value={training.department}
              displayEmpty
              onChange={(e) => handleDeptChange(e.target.value)}
              sx={{
                backgroundColor: "#ff8f07",
                color: "#000",
                fontWeight: 500,
                borderRadius: "4px",
                height: 36,
                px: 1,
                width: "30%",
                "& .MuiSelect-icon": { color: "#000" },
              }}
            >
              <MenuItem disabled value="">
                Assign department
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Delete Training" placement="bottom" arrow>
              <IconButton onClick={handleDelete}>
                <DeleteIcon sx={{ color: "#333" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {training && (
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Save" placement="bottom" arrow>
            <Button
              variant="contained"
              disabled={loading || !isChanged}
              onClick={handleSave}
              sx={{
                backgroundColor: "#22c55e",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
                mt: 2,
                minWidth: 100,
                height: 40,
                "&:disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#999",
                },
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {loading ? "" : "Save"}
            </Button>
          </Tooltip>
        </Box>
      )}
    </Dialog>
  );
};

export default UploadDialog;
