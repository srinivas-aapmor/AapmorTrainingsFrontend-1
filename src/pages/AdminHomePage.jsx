import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Navbar from "../components/Navbar";
import AdminReportsPreview from "../helpers/AdminReportsPreview";
import UploadDialog from "../helpers/UploadDialog";
import DashboardSummary from "../helpers/AdminDashboardSummary";
import Tooltip from "@mui/material/Tooltip";
import { useAdminContext } from "../context/AdminContextProvider";


function AdminDashBoard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const { totalDue, totalCompleted, totalAssigned, setAllTrainings } = useAdminContext();



  return (
    <Box className="AdminBackground">
      <CssBaseline />
      <Navbar />

      <Box sx={{ pt: "90px", px: isMobile ? 2 : 5, boxSizing: "border-box" }}>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <DashboardOutlinedIcon fontSize="medium" />
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                Admin Dashboard
              </Typography>
            </Box>
            <Tooltip title="Upload New Assignments" placement="bottom" arrow>
              <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                sx={{
                  backgroundColor: "#FFA500",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  boxShadow: "none",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "#ff9400",
                  },
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                Upload
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <DashboardSummary totalDue={totalDue} totalCompleted={totalCompleted} totalAssigned={totalAssigned} />

        <AdminReportsPreview />
      </Box>

      <UploadDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        setAllTrainings={setAllTrainings}
      />
    </Box>
  );
}

export default AdminDashBoard;
