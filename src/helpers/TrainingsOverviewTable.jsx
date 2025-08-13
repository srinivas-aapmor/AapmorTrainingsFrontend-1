import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import EditTraining from "../components/EditTraining";
import Tooltip from "@mui/material/Tooltip";
import { useAdminContext } from "../context/AdminContextProvider";

const TrainingsOverviewTable = ({
  searchText,
  statusFilter,
  priorityFilter,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [editId, setEditId] = useState();
  const [editTrainingname, setEditTrainingname] = useState();
  const [editStatus, setEditStatus] = useState();
  const [editTimePeriod, setEditTimePeriod] = useState();
  const [editDepartmentName, setEditDepartmentName] = useState();
  const [editCreatedAt, setEditCreatedAt] = useState();
  const { trainings, setAllTrainings } = useAdminContext();
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEditClick = (row) => {
    // console.log(row);
    setSelectedTraining(row);
    setEditId(row.id);
    setEditTrainingname(row.title);
    setEditStatus(row.status);
    setEditTimePeriod(row.time_period);
    setEditDepartmentName(row.department);
    setEditCreatedAt(row.created_at);
    setEditOpen(true);
  };
  // console.log(trainings);

  const handleTrainingUpdate = (updatedTraining) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedTraining.id ? updatedTraining : row
      )
    );
    setEditOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    setFilteredRows([]);
    setTimeout(() => {
      const filtered = trainings.filter((t) => {
        const matchStatus =
          statusFilter === "" || t.department === statusFilter;

        const matchPriority =
          priorityFilter === "" ||
          t.status.toLowerCase() === priorityFilter.toLowerCase();
        const searchLower = searchText.toLowerCase();

        const matchSearch =
          t.title?.toLowerCase().includes(searchLower) ||
          t.department?.toLowerCase().includes(searchLower);

        return matchStatus && matchPriority && matchSearch;
      });
      setLoading(false);

      setFilteredRows(filtered.map((t, i) => ({ ...t, id: t.id || i })));
    }, 500);
  }, [trainings, statusFilter, priorityFilter, searchText]);

  const columns = [
    {
      field: "title",
      headerName: "Training Name",
      flex: 1.7,
      renderCell: (params) => {
        const value = params.value || "";
        const maxLength = 25;

        const displayText =
          value.length > maxLength ? value.slice(0, maxLength) + "..." : value;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Tooltip title={value}>
              <Typography
                noWrap
                sx={{
                  maxWidth: "100%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {displayText}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="gray">
              Created: {moment(params.row.created_at).format("MMM DD, YYYY")}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "department",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => {
        // console.log(params);
        const isActive = params?.row?.status?.toLowerCase?.() === "active";

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: isActive ? "#0dc44a" : "red",
              }}
            />
            <Typography>{isActive ? "Active" : "Inactive"}</Typography>
          </Box>
        );
      },
    },
    {
      field: "enrolled",
      headerName: "Enrolled",
      flex: 0.8,
    },
    {
      field: "progress",
      headerName: "progress",
      flex: 1,
      renderCell: (params) => {
        const completed = params.row.completed || 0;
        const due = params.row.due || 0;
        const total = completed + due;
        const percentage =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        return (
          <Box sx={{ width: "100%", px: 1 }}>
            <Typography variant="caption" mb={0.5} display="block">
              {percentage}%
            </Typography>
            <Box
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${percentage}%`,
                  backgroundColor: "#4caf50",
                  borderRadius: 5,
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "completed",
      headerName: "Completed",
      flex: 0.8,
    },
    {
      field: "time_period",
      headerName: "Time Period",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditClick(params.row)}>
          <Tooltip title="Edit Row" placement="bottom" arrow>
            <EditIcon sx={{ color: "#d14343" }} />
          </Tooltip>
        </IconButton>
      ),
    },
  ];

  const LoadingOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        width: "100%",
      }}
    >
      <CircularProgress sx={{ color: "#0043a8" }} />
    </Box>
  );

  return (
    <Box
      sx={{
        mx: 3,
        my: 2,
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
        // rows={trainings.map((t, i) => ({ ...t, id: t.id || i }))}
        rows={filteredRows}
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
        rowHeight={55}
        disableColumnResize
        disableColumnMenu
        sx={{
          borderRadius: "10px",
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          },
        }}
        slots={{ loadingOverlay: LoadingOverlay }}
        // filterModel={{
        //   items: [],
        //   quickFilterValues: searchText ? [searchText] : [],
        // }}
      />

      <EditTraining
        open={editOpen}
        onClose={() => setEditOpen(false)}
        training={selectedTraining}
        onUpdate={handleTrainingUpdate}
        editId={editId}
        editDepartmentName={editDepartmentName}
        editStatus={editStatus}
        editTimePeriod={editTimePeriod}
        editTrainingname={editTrainingname}
        editCreatedAt={editCreatedAt}
        setAllTrainings={setAllTrainings}
        trainings={trainings}
      />
    </Box>
  );
};

export default TrainingsOverviewTable;
