import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useEndUser } from "../context/endUserContextProvider";
import { Tooltip, Typography } from "@mui/material";
import moment from "moment";

const AssignedTrainingTable = ({ searchText }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trainings } = useEndUser();
  // console.log(trainings);
  useEffect(() => {
    if (!trainings) {
      setLoading(true);
      return;
    }
    setLoading(true);
    const formatted = trainings.map((t, idx) => {
      let progress = 0;
      if (typeof t.progress === "number") {
        progress = t.progress;
      } else if (t.status && t.status.toLowerCase() === "completed") {
        progress = 100;
      }

      return {
        id: idx + 1,
        trainingId: t.id,
        training: t.title || "Untitled",
        trainings_status: t.trainings_status?.toLowerCase() || "inactive",
        startdate: t.start_date
          ? new Date(t.start_date).toLocaleDateString(undefined, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "-",
        duedate: t.due_date
          ? new Date(t.due_date).toLocaleDateString(undefined, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "-",
        status: t.status
          ? t.status.charAt(0).toUpperCase() + t.status.slice(1)
          : "Assigned",
        assigned_date: t.assigned_date
          ? new Date(t.assigned_date).toLocaleDateString(undefined, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "-",
        progress,
      };
    });

    setRows(formatted);
    setLoading(false);
  }, [trainings]);

  const navigate = useNavigate();
  const columns = [
    {
      field: "id",
      headerName: "SNo",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "training",
      headerName: "Trainings",
      flex: 1.5,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        const value = params.value || "";
        const maxLength = 25;
        const displayText =
          value.length > maxLength ? value.slice(0, maxLength) + "..." : value;

        return (
          <Tooltip title={value}>
            <Typography
              noWrap
              sx={{
                maxWidth: "100%",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {displayText}
            </Typography>
          </Tooltip>
        );
      },
    },

    // {
    //   field: "assigned_date",
    //   headerName: "Assigned Date",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "startdate",
      headerName: "Start Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "duedate",
      headerName: "Due Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value =
          typeof params.row.progress === "number" ? params.row.progress : 0;
        return (
          <Box
            sx={{ width: "80%", display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box sx={{ width: "70%", mr: 1 }}>
              <Box
                sx={{
                  background: "#e0e0e0",
                  borderRadius: 5,
                  height: 8,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: `${value}%`,
                    background: value === 100 ? "#22c55e" : "#eec187",
                    height: 8,
                    borderRadius: 5,
                    transition: "width 0.3s",
                  }}
                />
              </Box>
            </Box>
            <span style={{ minWidth: 32, fontWeight: 500 }}>{value}%</span>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Button
            // variant="outlined"
            size="medium"
            sx={{
              color: "#000",
              textTransform: "none",
              width: "50%",
              borderColor: "transparent",
            }}
          >
            {params.row.status}
          </Button>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row.status?.toLowerCase();
        const trainingStatus = params.row.trainings_status;

        let isEnabled = false;
        let buttonText = "Start";
        let currentIndex = 0;
        const shouldShowTooltip =
          status === "assigned" && trainingStatus !== "active";
        const tooltipMessage = shouldShowTooltip
          ? "This training is currently Inactive. Please contact your administrator."
          : "";

        if (shouldShowTooltip) {
          isEnabled = false;
          buttonText = "Start";
        } else if (trainingStatus !== "active") {
          isEnabled = false;
          buttonText = "Start";
        } else if (status === "completed") {
          isEnabled = false;
          buttonText = "Completed";
        } else if (status === "due") {
          isEnabled = true;
          buttonText = "Resume";
        } else if (status === "assigned") {
          isEnabled = true;
          buttonText = "Start";
        }

        return (
          <Tooltip
            title={tooltipMessage}
            disableHoverListener={!shouldShowTooltip}
          >
            <span>
              <Button
                variant="outlined"
                size="medium"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: isEnabled ? "#e0e7ff" : "#f3f4f6",
                  color: isEnabled ? "#000" : "#888",
                  textTransform: "none",
                  boxShadow: "none",
                  cursor: isEnabled ? "pointer" : "not-allowed",
                  "&:hover": {
                    backgroundColor: isEnabled ? "#c7d2fe" : "#f3f4f6",
                    boxShadow: "none",
                  },
                }}
                disabled={!isEnabled}
                onClick={() => {
                  if (isEnabled) {
                    navigate("/training", {
                      state: {
                        id: params.row.trainingId,
                      },
                    });
                  }
                }}
              >
                {buttonText}
              </Button>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const LoadingOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        width: "100%",
      }}
    >
      <CircularProgress sx={{ color: "#0043a8" }} />
    </Box>
  );

  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 120,
        width: "100%",
        fontSize: 16,
        color: "#666",
        fontWeight: 500,
      }}
    >
      No training assigned to you.
    </Box>
  );

  return (
    <Box
      sx={{
        height: "auto",
        mx: 2,
        my: 3,
        "& .MuiDataGrid-sortIcon": {
          color: "#ffffff",
        },

        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "#fff",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#001f4d !important",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        "& .MuiDataGrid-columnHeader:last-of-type": {
          borderRight: "none",
        },

        ".MuiDataGrid-columnSeparator": {
          display: "none",
        },
        "&.MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 500,
          textAlign: "center",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={7}
        rowsPerPageOptions={[7]}
        pageSizeOptions={[7]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 7, page: 0 },
          },
        }}
        pagination
        autoHeight
        disableColumnMenu
        hideFooterSelectedRowCount
        rowHeight={60}
        sx={{
          borderRadius: "10px",
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          },
        }}
        slots={{ loadingOverlay: LoadingOverlay, noRowsOverlay: NoRowsOverlay }}
        filterModel={{
          items: [],
          quickFilterValues: searchText ? [searchText] : [],
        }}
      />
    </Box>
  );
};

export default AssignedTrainingTable;
