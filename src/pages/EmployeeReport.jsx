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
import Navbar from "../components/Navbar";
import TrainingsOverviewTable from "../helpers/EmployeeReportTable";
import { useAdminContext } from "../context/AdminContextProvider";

const EmployeeReport = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { departments } = useAdminContext();

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleResetFilters = () => {
    setStatusFilter("");
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
            Employee Report
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
      />
    </Box>
  );
};

export default EmployeeReport;
