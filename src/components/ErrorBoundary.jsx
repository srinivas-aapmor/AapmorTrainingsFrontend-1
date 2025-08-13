import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import Error_Picture from "../assets/error_picture.png";
import axios from "axios";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error, errorInfo) {
    const response = await axios.post("/api/error", errorInfo, {
      headers: { "Content-Type": "application/json" },
    });
    {
      console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Grid
          container
          className="AdminBackground"
          sx={{ height: "100vh", px: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 4 }}>
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
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                },
                fontWeight: "bold",
              }}
            >
              Oops! Something went wrong...
            </Typography>

            <Typography variant="body1" gutterBottom>
              {this.state.error?.message || "An unexpected error occurred."}
            </Typography>

            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ textTransform: "none" }}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
