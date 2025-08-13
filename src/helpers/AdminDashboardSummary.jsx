import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";

const DashboardSummary = ({ totalDue, totalCompleted, totalAssigned }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cardStyles = {
    borderRadius: 2,
    p: 1.5,
    border: "1px solid #deebec",
    flex: isMobile ? "1 1 100%" : "1 1 30%",
  };

  const summaryItems = [
    {
      title: "Due Trainings",
      icon: <CalendarMonthIcon sx={{ color: "#001f4d" }} />,
      count: totalDue,
    },
    {
      title: "Completed Trainings",
      icon: <EventAvailableOutlinedIcon sx={{ color: "#001f4d" }} />,
      count: totalCompleted,
    },
    {
      title: "Assigned Trainings",
      icon: <EditCalendarOutlinedIcon sx={{ color: "#001f4d" }} />,
      count: totalAssigned,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: 1,
        boxSizing: "border-box",
        backgroundColor: "transparent",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={3}
        justifyContent="space-between"
        alignItems="stretch"
        sx={{ width: "98%" }}
      >
        {summaryItems.map((item, index) => (
          <Card key={index} sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                {item.icon}
                <Typography fontWeight={520} color="#001f4d">
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="#001f4d">
                {item.count}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default DashboardSummary;
