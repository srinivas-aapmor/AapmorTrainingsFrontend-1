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
import TuneIcon from "@mui/icons-material/Tune";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Navbar from "../components/Navbar";
import TrainingsOverviewTable from "../helpers/TrainingsOverviewTable";
import UploadDialog from "../helpers/UploadDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAdminContext } from "../context/AdminContextProvider";

const TrainingsOverview = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  // const [startDate, setStartDate] = useState(dayjs("2025-06-01"));
  // const [endDate, setEndDate] = useState(dayjs("2025-06-30"));
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { departments, setAllTrainings } = useAdminContext();

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
          <Tooltip title="Click to Go Back" placement="top-start" arrow>
            <IconButton onClick={() => window.history.back()}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight="bold">
            Trainings Overview
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider> */}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#ff8f07", width: "35%", gap: 1 }}
            onClick={() => setOpenDialog(true)}
          >
            <AddCircleOutlineIcon />
            <Typography variant="button" sx={{ textTransform: "none" }}>
              Add Training
            </Typography>
          </Button>

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

          <Tooltip title="Filter data" placement="top-start" arrow>
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
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  value={statusFilter}
                  label="Department"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
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
          </Menu>
        </Box>
      </Box>

      <TrainingsOverviewTable
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
      <UploadDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        setAllTrainings={setAllTrainings}
      />
    </Box>
  );
};

export default TrainingsOverview;
