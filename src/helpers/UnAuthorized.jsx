import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import error from "../assets/error.png";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


const UnAuthorized = () => {
    const navigate = useNavigate();

    return (
        <Box className="TrainingsOverviewBackground"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                textAlign: "center",
                px: 2,
            }}
        >
            <img
                src={error}
                alt="404 Illustration"
                style={{ maxWidth: "130px" }}
            />

            <Typography variant="h3" fontWeight={600} gutterBottom>
                403 - Forbidden
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={4}>
                Oops! You do not have permission to access this page.
            </Typography>

            <Button
                variant="contained"

                onClick={() => navigate(-1)}
                sx={{ background: "#C95343", textTransform: "none", px: 1.5, py: 1, gap: 1 }}
            >
                <ArrowCircleLeftIcon />
                Go Back Home
            </Button>
        </Box>
    );
};

export default UnAuthorized;
