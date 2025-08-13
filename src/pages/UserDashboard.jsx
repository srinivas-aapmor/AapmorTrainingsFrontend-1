import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Paper,
    useTheme,
    useMediaQuery
} from '@mui/material';
import Navbar from '../components/Navbar';
import { CheckCircle, PendingActions, School } from '@mui/icons-material';
import { useUser } from '../context/userProvider';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { AccessTime } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { CalendarMonth } from '@mui/icons-material';
import { useEndUser } from "../context/endUserContextProvider";


export default function UserDashboard() {
    const [assignedTrainings, setAssignedTrainings] = useState([]);
    const [trainingSummary, setTrainingSummary] = useState({ completed: 0, pending: 0 });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useUser();
    const navigate = useNavigate();
    const { assigned, completed, due, trainings } = useEndUser();


    const now = new Date();
    const nextTraining = trainings
        .filter(t => t.status === "assigned" || t.status === "in-progress" || t.status === "due")
        .filter(t => t.due_date && new Date(t.due_date) >= now)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];

    const upcoming = trainings
        .filter(t => t.status === "assigned" || t.status === "due")
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 3);
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {
        if (upcoming.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % upcoming.length);
        }, 4000); // 4s delay
        return () => clearInterval(interval);
    }, [upcoming.length]);

    console.log(upcoming)

    return (
        <>
            <Navbar />
            <Box sx={{ pt: "90px", px: isMobile ? 2 : 10, minHeight: "100vh" }}>
                <Typography variant="h5" fontWeight={600} mb={1}>
                    Welcome {user.name}!
                </Typography>
                <Typography color="text.secondary" mb={3}>
                    Keep learning, stay curious, and level up your skills with every
                    training you complete!
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                    }}
                >
                    {/* Continue Training */}
                    <Box
                        onClick={() => {
                            if (nextTraining) {
                                navigate("/training", {
                                    state: {
                                        id: nextTraining.id,
                                    },
                                });
                            }
                        }}
                        sx={{
                            cursor: nextTraining ? "pointer" : "default",
                            flexShrink: 0,
                            width: { xs: "100%", md: "30%" },
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            pt: 3,
                            bgcolor: "white",
                            border: "1px solid #e6e7e6",
                            height: "65vh",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <School sx={{ color: "#0f2a58", fontSize: 20 }} />
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, fontSize: "1rem" }}
                            >
                                Continue Training
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                bgcolor: "#000",
                                borderRadius: 2,
                                height: 280,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {nextTraining ? (
                                <Box sx={{ textAlign: "center", color: "white" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 0.5,
                                            mb: 1,
                                        }}
                                    >
                                        <Box sx={{ width: 12, height: 12, bgcolor: "#ef4444", borderRadius: "50%" }} />
                                        <Box sx={{ width: 12, height: 12, bgcolor: "#3b82f6", borderRadius: "50%" }} />
                                        <Box sx={{ width: 12, height: 12, bgcolor: "#10b981", borderRadius: "50%" }} />
                                        <Box sx={{ width: 12, height: 12, bgcolor: "#f59e0b", borderRadius: "50%" }} />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        {nextTraining.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, color: '#eec187' }}>
                                        {/* Due: {new Date(nextTraining.due_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} */}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: "center", color: "white" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        No trainings to continue
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        You have completed all assigned trainings or none are due.
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", sm: "row" },
                                flexWrap: "wrap",
                            }}
                        >
                            <Paper
                                sx={{
                                    flex: 1,
                                    p: 1,
                                    bgcolor: "#f9fafb",
                                    boxShadow: "none",
                                    border: "1px solid #e6e7e6",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Training
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold", color: "#1f2937" }}
                                    >
                                        1
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lesson
                                    </Typography>
                                </Box>
                            </Paper>

                            <Paper
                                sx={{
                                    flex: 1,
                                    p: 1,
                                    bgcolor: "#eff6ff",
                                    boxShadow: "none",
                                    border: "1px solid #e6e7e6",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Progress
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box position="relative" display="inline-flex">
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            thickness={5}
                                            sx={{ color: "#e0e0e0", position: "absolute" }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={nextTraining && typeof nextTraining.progress === 'number' ? Math.max(0, Math.min(100, nextTraining.progress)) : 0}
                                            thickness={5}
                                            sx={{ color: "#eec187" }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: "bold", color: "#1f2937" }}
                                    >
                                        {nextTraining && typeof nextTraining.progress === 'number' ? Math.max(0, Math.min(100, nextTraining.progress)) : 0}%
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>

                    {/* Assigned Trainings + Training Summary */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 2,
                                width: '100%',
                                height: "90%"
                            }}
                        >
                            {/* Assigned Trainings */}
                            <Box
                                sx={{
                                    // flexShrink: 0,
                                    width: { xs: '100%', md: '50%' },
                                    bgcolor: '#eef2ff',
                                    p: 3,
                                    pb: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderRadius: '10px',
                                    border: '1px solid #e6e7e6'
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={600} >
                                    Assigned Trainings
                                </Typography>
                                <ol style={{ paddingLeft: 20, paddingTop: 0 }}>
                                    {trainings.length > 0 ? (
                                        trainings.slice(0, 4).map((training, idx) => (
                                            <li key={idx} style={{ margin: '10px 0', fontSize: "18px" }}><Typography>{training.title}</Typography></li>
                                        ))
                                    ) : (
                                        <li style={{ margin: '10px 0', fontSize: "25px", color: 'balck' }}>
                                            <Typography>No trainings assigned yet.</Typography>
                                        </li>
                                    )}
                                </ol>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: "14px",
                                            color: "#002B5B",
                                            px: 1.5,
                                            py: 0.5,
                                            backgroundColor: "white",
                                            border: "1px solid transparent",
                                            borderRadius: "4px",
                                            "&:hover": {
                                                border: "1.5px solid #007BFF",
                                            },
                                        }}
                                        endIcon={<NorthEastIcon fontSize="small" />}
                                        onClick={() => navigate('/assigned-trainings', { replace: true })}
                                    >
                                        View all
                                    </Button>
                                </Box>
                            </Box>

                            {/* Training Summary */}
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: { xs: "100%", md: "50%" },
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderRadius: "10px",
                                    border: "1px solid #e6e7e6",
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Training Summary
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 0,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PendingActions color="success" />

                                        <Typography>Assigned</Typography>
                                    </Box>
                                    <Typography fontWeight={600}>
                                        {assigned}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mt: 2,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CheckCircle color="success" />
                                        <Typography>Completed</Typography>
                                    </Box>
                                    <Typography fontWeight={600}>
                                        {completed}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mt: 2,
                                        mb: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <AccessTime color="error" />
                                        <Typography>Due</Typography>
                                    </Box>
                                    <Typography fontWeight={600}>
                                        {due}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {/* <Button
                                        size="small"
                                        sx={{
                                            backgroundColor: '#eef2ff',
                                            width: '100px',
                                            borderRadius: '8px',
                                            color: 'black',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        endIcon={<NorthEastIcon fontSize="small" />}
                                    >
                                        View all
                                    </Button> */}
                                </Box>
                            </Box>
                        </Box>

                        {/* Swiper Carousel */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #e6e7e6",
                                mt: 2,
                                background: "linear-gradient(to right, #eef2ff, #fff7ed)",
                            }}
                        >
                            {/* Header Row */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CalendarMonth sx={{ color: "#0f2a58" }} />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Upcoming Submissions
                                    </Typography>
                                </Box>
                                <Typography fontWeight={600} color="primary">
                                    Due Date
                                </Typography>
                            </Box>

                            {/* Slide Content */}
                            {upcoming.length > 0 ? (
                                <>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                                                {upcoming[currentIndex].title}
                                            </Typography>
                                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                                {upcoming[currentIndex]?.assigned_department
                                                    ? `Assigned by ${upcoming[currentIndex].assigned_department === 'Full Stack Developer'
                                                        ? 'Full Stack'
                                                        : upcoming[currentIndex].assigned_department} Team`
                                                    : ''}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ ml: "auto" }}>
                                            <Typography fontWeight={500} color="text.primary">
                                                On {upcoming[currentIndex].due_date
                                                    ? new Date(upcoming[currentIndex].due_date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
                                                    : "No Due Date"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 1,
                                        }}
                                    >
                                        {upcoming.map((_, index) => (
                                            <Box
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    bgcolor: currentIndex === index ? "#f59e0b" : "#d1d5db",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <Typography color="text.secondary">No upcoming submissions</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
