import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Switch, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { useAdminContext } from "../context/AdminContextProvider";

const EmployeeReportTable = ({ searchText, statusFilter }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { employees } = useAdminContext();
  // console.log(employees)

  const handleCellClick = (params) => {
    const clickableFields = ["name"];
    // console.log(params)
    if (clickableFields.includes(params.field)) {
      navigate("/employee-trainingdata", {
        state: {
          emp_id: params.row.emp_id,
          name: params.row.name,
          department: params.row.department,
          email: params.row.email,
        },
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    setFilteredRows([]);
    setTimeout(() => {
      const filtered = employees.filter((t) => {
        const matchStatus =
          statusFilter === "" || t.department === statusFilter;

        const searchLower = searchText.toLowerCase();

        const matchSearch =
          t.name?.toLowerCase().includes(searchLower) ||
          t.department?.toLowerCase().includes(searchLower);

        return matchStatus && matchSearch;
      });
      setLoading(false);

      setFilteredRows(filtered.map((t, i) => ({ ...t, id: t.id || i })));
    }, 500);
  }, [employees, statusFilter, searchText]);

  const columns = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip
          title="Click to get user's training data"
          placement="bottom-start"
          arrow
        >
          <Box sx={{ gap: 0, display: "flex", flexDirection: "column" }}>
            <Typography>{params.value}</Typography>
            <Typography variant="caption" color="gray">
              {params.row.email}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "assignedTrainings",
      headerName: "Assigned",
      flex: 1,
    },

    {
      field: "completedTrainings",
      headerName: "Completed",
      flex: 0.8,
    },
    {
      field: "dueTrainings",
      headerName: "Due",
      flex: 1,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   flex: 0.7,
    //   renderCell: () => (
    //     <Tooltip title="Send Reminder" placement="bottom-start" arrow>
    //       <Button
    //         variant="contained"
    //         size="small"
    //         startIcon={<NotificationsNoneOutlinedIcon />}
    //         sx={{ textTransform: "none", backgroundColor: "#ff8f07" }}
    //       >
    //         Notify
    //       </Button>
    //     </Tooltip>
    //   ),
    // },
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
        // rows={employees.map((t, i) => ({
        //   ...t,
        //   id: i
        // }))}
        rows={filteredRows}
        columns={columns}
        loading={loading}
        pageSize={7}
        rowsPerPageOptions={[7, 10, 20]}
        pageSizeOptions={[7, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 7, page: 0 },
          },
        }}
        rowHeight={55}
        onCellClick={handleCellClick}
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
    </Box>
  );
};

export default EmployeeReportTable;
