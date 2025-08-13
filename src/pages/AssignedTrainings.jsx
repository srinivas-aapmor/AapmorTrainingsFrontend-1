import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/Tune";
// import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import AssignedTrainingsTable from "../components/AssignedTrainingsTable";
import "../styles/TrainingsOverview.css";
import { useNavigate } from "react-router-dom";
import { useEndUser } from "../context/endUserContextProvider";

const AssignedTrainings = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  // const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  // const [startDate, setStartDate] = useState(dayjs("2025-06-01"));
  // const [endDate, setEndDate] = useState(dayjs("2025-06-30"));
  // const { trainings } = useEndUser();
  const navigate = useNavigate();


  // const handleFilterClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    handleFilterClose();
  };

  return (
    <Box className="TrainingsOverviewBackground">
      <Navbar />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        mt={2.5}
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Click to Go Back" placement="bottom" arrow>
            <IconButton onClick={() => navigate('/')}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight="bold">
            Assigned Trainings
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search trainings..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* <Tooltip title="Filter">
            <IconButton
              onClick={handleFilterClick}
              sx={{
                border: "1px solid #000",
                borderRadius: 2,
                padding: "6px",
              }}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 250, width: 250 } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1">Filter</Typography>

              <FormControl fullWidth size="small" sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All Departments">All Departments</MenuItem>
                  <MenuItem value="QA">QA</MenuItem>
                  <MenuItem value="Full Stack">Full Stack</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="Active">
                    <CircleIcon sx={{ fontSize: 12, color: "green", mr: 1 }} />{" "}
                    Active
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <CircleIcon sx={{ fontSize: 12, color: "red", mr: 1 }} />{" "}
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleResetFilters}
                sx={{ textTransform: "none" }}
              >
                Reset All
              </Button>
            </Box>
          </Menu> */}
        </Box>
      </Box>

      <AssignedTrainingsTable
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
    </Box>
  );
};

export default AssignedTrainings;
