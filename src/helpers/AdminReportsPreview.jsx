import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  TableContainer,
  Paper,
  useMediaQuery,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import CallMadeIcon from "@mui/icons-material/CallMade";
import Tooltip from "@mui/material/Tooltip";
import { useAdminContext } from "../context/AdminContextProvider";

const AdminReportsPreview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { trainings, employees } = useAdminContext();


  return (
    <Grid
      container
      spacing={isMobile ? 2 : 3}
      sx={{
        px: isMobile ? 1 : 1.5,
        py: isMobile ? 2 : 3,
        mt: 0,
        height: "100%",
        width: "100%",
        alignItems: "stretch",
      }}
    >

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Grid
          container
          direction="column"
          sx={{
            border: "2px solid #deebec",
            borderRadius: 2,
            backgroundColor: "#fff",
            p: isMobile ? 2 : 3,
            flex: 1,
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item display="flex" alignItems="center" gap={1}>
              <BarChartOutlinedIcon sx={{ color: "#002B5B" }} />
              <Typography fontWeight="bold" color="#002B5B">
                Trainings
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip
                title="View all Trainings data"
                placement="top-end"
                arrow
              >
                <Button
                  size="small"
                  endIcon={<CallMadeIcon />}
                  onClick={() => navigate("/admin/trainings-overview")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#002B5B",
                    px: 1.5,
                    py: 0.5,
                    border: "1px solid transparent",
                    borderRadius: "4px",
                    "&:hover": {
                      border: "1.5px solid #007BFF",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  View all
                </Button>
              </Tooltip>
            </Grid>
          </Grid>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ flex: 1, overflow: "auto" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "45%" }}>
                    Trainings
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "35%" }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.length > 0 ? (
                  trainings.slice(0, 5).map((training, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{
                          width: "45%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 200,
                        }}
                      >
                        <Tooltip title={training.title}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {training.title}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ width: "35%", whiteSpace: "nowrap" }}>
                        {training.department}
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor:
                                training.status?.toLowerCase() === "active"
                                  ? "green"
                                  : "red",
                            }}
                          />
                          <Typography fontSize={14}>
                            {training.status || "Unknown"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No trainings available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>


      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Grid
          container
          direction="column"
          sx={{
            border: "2px solid #deebec",
            borderRadius: 2,
            backgroundColor: "#fff",
            p: isMobile ? 2 : 3,
            flex: 1,
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item display="flex" alignItems="center" gap={1}>
              <PermContactCalendarOutlinedIcon sx={{ color: "#002B5B" }} />
              <Typography fontWeight="bold" color="#002B5B">
                Employee Report
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip
                title="View all Employees Reports"
                placement="top-end"
                arrow
              >
                <Button
                  size="small"
                  endIcon={<CallMadeIcon />}
                  onClick={() => navigate("/admin/employee-report")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#002B5B",
                    px: 1.5,
                    py: 0.5,
                    border: "1px solid transparent",
                    borderRadius: "4px",
                    "&:hover": {
                      border: "1.5px solid #007BFF",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  View all
                </Button>
              </Tooltip>
            </Grid>
          </Grid>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ flex: 1, overflow: "auto" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    Employee
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Assigned
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Due
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "20%" }}>
                    Completed
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employees && employees.length > 0 ? (
                  employees.slice(0, 5).map((emp, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{
                          width: "40%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 200,
                        }}
                      >
                        <Tooltip title={emp.name}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {emp.name}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {emp.assignedTrainings}
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {emp.dueTrainings}
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {emp.completedTrainings}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No employee reports available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminReportsPreview;
