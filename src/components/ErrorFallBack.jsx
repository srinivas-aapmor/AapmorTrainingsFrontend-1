import React, { useEffect, useRef } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import Error_Picture from "../assets/Error_Picture.png";
import { axiosInstance } from "../utils/axios";
import { useUser } from "../context/userProvider";
import { UAParser } from "ua-parser-js";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { user } = useUser();
  const sentRef = useRef(false);

  useEffect(() => {
    if (!error || sentRef.current) return;

    const sendErrorToBackend = async () => {
      try {
        const parser = new UAParser();
        const osInfo = parser.getOS();
        const browserInfo = parser.getBrowser();

        // Build a simple error signature to avoid duplicates
        const errorKey = `${error.message}_${error.stack}`.slice(0, 100);

        // Prevent duplicate logging across page refreshes
        if (sessionStorage.getItem(errorKey)) return;

        const payload = {
          id: user?.id || "Unknown",
          emp_id: user?.emp_id || "Unknown",
          name: user?.name || "Unknown user",
          email: user?.email || "Unknown email",
          message: error?.message || "Unknown error",
          stack: error?.stack || "No stack trace",

          os: `${osInfo.name} ${osInfo.version}`.trim(),
          browser: `${browserInfo.name} ${browserInfo.version}`.trim(),

          url: window.location.href,
          pathname: window.location.pathname,
          referrer: document.referrer,
          language: navigator.language,
          screen: {
            width: window.screen.width,
            height: window.screen.height,
          },
        };

        await axiosInstance.post("/api/error", payload, {
          headers: { "Content-Type": "application/json" },
        });

        // Prevent future resends in this session
        sessionStorage.setItem(errorKey, "sent");
        sentRef.current = true;
      } catch (err) {
        console.error("Failed to send error to backend:", err);
      }
    };

    sendErrorToBackend();
  }, [error, user]);

  return (
    <Grid
      container
      className="AdminBackground"
      sx={{ height: "100vh", px: 2 }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item sx={{ textAlign: "center" }}>
        <Box sx={{ mb: 1 }}>
          <Box
            component="img"
            src={Error_Picture}
            alt="Error Message"
            sx={{
              width: { xs: "80%", sm: "60%", md: "50%" },
              maxHeight: "100%",
              mx: "auto",
            }}
          />
        </Box>

        <Typography
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2rem" }, fontWeight: "bold" }}
        >
          Oops! Something went wrong...
        </Typography>

        <Typography
          gutterBottom
          sx={{ fontSize: { xs: "1rem", sm: "1.5rem", md: "1.3rem" } }}
        >
          Please try again later.
        </Typography>

        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          sx={{ textTransform: "none", mt: 2 }}
        >
          Try Again
        </Button>
      </Grid>
    </Grid>
  );
};

export default ErrorFallback;
