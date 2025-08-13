import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { MenuList } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getTrainingsDetails } from "../services/getTrainingsDetails";
import { useUser } from "../context/userProvider";
import { assignTasksForEmployees } from "../services/assignTrainings";
import { toast } from "react-toastify";

const AssignTaskDialog = ({
  open,
  onClose,
  employeeId,
  onAssign,
  alreadyAssignedTrainings,
  selectedEmployeeName,
  selectedEmployeeEmail,
}) => {
  const { user } = useUser();
  const [trainings, setTraining] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 250,
      },
    },
    MenuListProps: {
      disablePadding: true,
      component: (props) => (
        <MenuList {...props}>
          {props.children}
          <MenuItem
            onClick={() => {
              setOpenSelect(false);
            }}
            sx={{
              justifyContent: "center",
              fontWeight: 600,
              borderTop: "1px solid #ddd",
            }}
          >
            Done
          </MenuItem>
        </MenuList>
      ),
    },
  };

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        let all_trainings;

        all_trainings = await getTrainingsDetails(user.role);

        // console.log(all_trainings);
        const notAssignedTrainings = all_trainings.filter((t) => {
          // console.log(t.status);
          return (
            t.status !== "inactive" && !alreadyAssignedTrainings.includes(t.id)
          );
        });

        // console.log(notAssignedTrainings)
        setTraining(notAssignedTrainings);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [alreadyAssignedTrainings, user.role]);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setOpenSelect(false);
    }
  }, [open]);
  // console.log(user)
  const handleAssign = async () => {
    if (isAssigning) return;

    setIsAssigning(true);

    try {
      const selectedTrainings = trainings.filter((t) =>
        selected.includes(t.title)
      );

      const result = {
        employeeId,
        email: selectedEmployeeEmail,
        name: selectedEmployeeName,
        department: user.role,
        // assignedBy: user.name,
        assignedTrainings: selectedTrainings.map((t) => ({
          id: t.id,
          title: t.title,
        })),
      };

      await onAssign(result);
      onClose();
    } catch (error) {
      console.error("Failed to assign tasks:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box className="EditTrainingDialog" sx={{ p: 3, position: "relative" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="#001f4d">
            Assign The Task
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 14, right: 18 }}
          >
            <CloseIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ mt: 2, p: 0 }}>
          <Select
            multiple
            fullWidth
            displayEmpty
            open={openSelect}
            onOpen={() => setOpenSelect(true)}
            onClose={() => setOpenSelect(false)}
            value={selected}
            onChange={(e) => {
              const value = e.target.value;
              setSelected(value);
            }}
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length === 0
                ? "Choose The Training"
                : selected.join(", ")
            }
            MenuProps={MenuProps}
          >
            {trainings.map((training, index) => (
              <MenuItem key={index} value={training.title}>
                <Checkbox checked={selected.indexOf(training.title) > -1} />
                <ListItemText primary={training.title} />
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={isAssigning || selected.length === 0}
            sx={{
              backgroundColor: "#ff8f07",
              textTransform: "none",
              px: 3,
              py: 1,
              ml: 53,
              borderRadius: 2,
              fontWeight: 500,
            }}
            endIcon={<AddCircleOutlineIcon />}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const EmployeesDetailsOverView = ({
  employees,
  totalAssigned,
  setTotalAssigned,
  setEmployees,
  totalDue,
  setTotalDue,
  searchText,
}) => {
  const [openDialog, setOpenDialog] = useState({
    open: false,
    assignedTrainings: [],
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [assignedResult, setAssignedResult] = useState(null);
  // const [alreadyAssignedTrainings, setAlreadyAssignedTrainings] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (employees.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [employees]);

  const handleCellClick = (params) => {
    const clickableFields = ["empId", "name", "role"];
    // console.log(params.row.name);
    if (clickableFields.includes(params.field)) {
      navigate("/employee-trainingdata", {
        state: {
          emp_id: params.row.empId,
          name: params.row.name,
          department: user.role,
          email: params.row.email,
        },
      });
    }
  };

  const handleAssignClick = (row) => {
    setSelectedEmployeeId(row.empId);
    setSelectedEmployeeName(row.name);
    setSelectedEmployeeEmail(row.email);
    setOpenDialog({ open: true, assignedTrainings: row.assigned_trainings });
  };
  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAssign = async (result) => {
    // console.log(result)
    setLoading(true);
    try {
      const response = await assignTasksForEmployees(result);
      if (response) {
        setTotalAssigned((prev) => prev + result.assignedTrainings.length);
        setTotalDue((prev) => prev + result.assignedTrainings.length);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.empId === result.employeeId
              ? {
                ...emp,
                assigned: emp.assigned + result.assignedTrainings.length,
                due: emp.due + result.assignedTrainings.length,
                assigned_trainings: [
                  ...emp.assigned_trainings,
                  ...result.assignedTrainings.map((t) => t.id),
                ],
              }
              : emp
          )
        );
        toast.success("Training assigned successfully!");
      } else {
        toast.error(
          "Assignment failed or Already Assigned. Please Refresh and try again."
        );
      }
    } catch (error) {
      console.error("Error assigning training:", error);
      toast.error("Something went wrong while assigning.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "empId", headerName: "Emp ID", flex: 0.8 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1.2 },
    { field: "assigned", headerName: "Assigned", flex: 0.8 },
    {
      field: "completed",
      headerName: "Completed",
      flex: 1.5,
    },
    {
      field: "due",
      headerName: "Due Tasks",
      flex: 1.1,
    },
    {
      field: "assign",
      headerName: "Assign Task",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="Click to assign training" placement="bottom" arrow>
          <IconButton onClick={() => handleAssignClick(params.row)}>
            <PersonAddAltOutlinedIcon sx={{ color: "#001f4d" }} />
          </IconButton>
        </Tooltip>
      ),
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

  return (
    <Box
      sx={{
        mx: 3,
        my: 2,
        borderRadius: 2,
        border: "1px solid #deebec",
        "& .MuiDataGrid-sortIcon": { color: "#ffffff" },
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-columnHeaders": { color: "#fff" },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#001f4d !important",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        "& .MuiDataGrid-columnHeader:last-of-type": { borderRight: "none" },
        ".MuiDataGrid-columnSeparator": {},
        "&.MuiDataGrid-root": { border: "none" },
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
        rows={filteredEmployees.map((e, i) => ({ ...e, id: i }))}
        columns={columns}
        loading={loading}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        autoHeight
        disableColumnMenu
        disableColumnResize
        rowHeight={48}
        onCellClick={handleCellClick}
        sx={{
          borderRadius: "10px",
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            cursor: "pointer",
          },
        }}
        slots={{ loadingOverlay: LoadingOverlay }}
      />

      <AssignTaskDialog
        open={openDialog.open}
        onClose={() => setOpenDialog({ open: false, assignedTrainings: [] })}
        employeeId={selectedEmployeeId}
        selectedEmployeeName={selectedEmployeeName}
        selectedEmployeeEmail={selectedEmployeeEmail}
        onAssign={handleAssign}
        alreadyAssignedTrainings={openDialog.assignedTrainings}
      />
    </Box>
  );
};

export default EmployeesDetailsOverView;
