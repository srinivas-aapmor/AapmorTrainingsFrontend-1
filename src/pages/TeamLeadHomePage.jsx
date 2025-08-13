import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  useTheme,
  useMediaQuery,
  InputAdornment,
  TextField,
} from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Navbar from "../components/Navbar";
import EmployeesDetailsOverView from "../components/EmployeesDetailsForTL";
import DashboardSummary from "../helpers/AdminDashboardSummary";
import { useTeamleadContext } from "../context/TeamleadContextProvider";
import SearchIcon from "@mui/icons-material/Search";

function TeamLeadHomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    totalCompleted,
    totalAssigned,
    employees,
    setTotalAssigned,
    setEmployees,
    setTotalDue,
    totalDue,
  } = useTeamleadContext();
  const [searchText, setSearchText] = useState("");

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
              mb: 0,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolOutlinedIcon fontSize="medium" />
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                Team Lead
              </Typography>
            </Box>

            <TextField
              size="small"
              variant="outlined"
              placeholder="Search employee..."
              startIcon={<SearchIcon />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "none",
                minWidth: isMobile ? "100%" : 250,
                mr: 2,
              }}
            />
          </Box>
        </Box>

        <DashboardSummary
          totalDue={totalDue}
          totalCompleted={totalCompleted}
          totalAssigned={totalAssigned}
        />

        <EmployeesDetailsOverView
          employees={employees}
          totalAssigned={totalAssigned}
          setEmployees={setEmployees}
          setTotalAssigned={setTotalAssigned}
          setTotalDue={setTotalDue}
          totalDue={totalDue}
          searchText={searchText}
        />
      </Box>
    </Box>
  );
}

export default TeamLeadHomePage;
