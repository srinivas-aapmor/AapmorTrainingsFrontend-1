import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  TextField,
  IconButton,
  CssBaseline,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { MenuList } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import moment from "moment";
import Navbar from "../components/Navbar";
import WestIcon from "@mui/icons-material/West";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import "../App.css";
import "../styles/TrainingsOverview.css";
import { getEmployeeTrainings } from "../services/getEmployeeTrainings";
import { getTrainingsDetails } from "../services/getTrainingsDetails";
import { assignTasksForEmployees } from "../services/assignTrainings";
import { toast } from "react-toastify";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteTrainingAssignment } from "../services/deleteTrainingAssignment";
import { useUser } from "../context/userProvider";

const AssignTaskDialog = ({
  open,
  onClose,
  remainingTrainings,
  setRemainingTrainings,
  emp_id,
  setRows,
  email,
  name,
}) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [doneClicked, setDoneClicked] = useState(false);
  const { user } = useUser();

  const handleAssign = async () => {
    setLoading(true);
    const selectedTrainings = remainingTrainings.filter((t) =>
      selected.includes(t.title)
    );
    const assignedTrainings = selectedTrainings.map((t) => ({
      id: t.id,
      title: t.title,
    }));
    const tasks = {
      employeeId: emp_id,
      email: email,
      name: name,
      assignedTrainings,
      department: user.role,
    };
    try {
      const response = await assignTasksForEmployees(tasks);
      console.log(response);
      if (response && response.success !== false) {
        setRows((prevRows) => [
          ...prevRows,
          ...response.assigned_trainings.map((item) => ({
            id: item.training_id,
            title: item.training_title,
            start_date: item.assignment.start_date,
            due_date: item.assignment.due_date,
            progress: item.assignment.progress,
            status: item.assignment.status,
            assigned_date: item.assignment.assigned_date,
            last_accessed: item.assignment.last_accessed,
            emp_id: item.assignment.emp_id,
          })),
        ]);
        setRemainingTrainings((prev) =>
          prev.filter((t) => !selected.includes(t.title))
        );
      }
      toast.success("Training Assigned Successfully");
    } catch (err) {
      console.error("Assignment failed:", err);
      toast.error("Failed to Assign Training");
    }
    setLoading(false);
    onClose();
  };

  const handleDoneClick = () => {
    setDoneClicked(true);
    setOpenSelect(false);
  };

  useEffect(() => {
    if (open) {
      setSelected([]);
      setOpenSelect(false);
      setDoneClicked(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box className="EditTrainingDialog" sx={{ p: 3, position: "relative" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="#001f4d">
            Assign The Task
          </Typography>
          <Tooltip title="Close Tab" placement="left" arrow>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 14, right: 18 }}
            >
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <DialogContent sx={{ mt: 2, p: 0 }}>
          <Select
            key={openSelect ? "open" : doneClicked ? "done" : "default"}
            multiple
            fullWidth
            displayEmpty
            open={openSelect}
            onOpen={() => setOpenSelect(true)}
            onClose={() => {
              setOpenSelect(false);
              setDoneClicked(true);
            }}
            value={selected}
            onChange={(e) =>
              setSelected(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return <em style={{ color: "#aaa" }}>Choose The Training</em>;
              }
              return selected.join(", ");
            }}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 250 },
              },
            }}
          >
            {remainingTrainings.map((training) => (
              <MenuItem key={training.id} value={training.title}>
                <Checkbox checked={selected.indexOf(training.title) > -1} />
                <ListItemText primary={training.title} />
              </MenuItem>
            ))}
            <MenuItem
              divider
              onClick={handleDoneClick}
              sx={{
                justifyContent: "center",
                fontWeight: 600,
                borderTop: "1px solid #ddd",
              }}
            >
              Done
            </MenuItem>
          </Select>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={loading || selected.length === 0}
            sx={{
              backgroundColor: "#ff8f07",
              textTransform: "none",
              px: 3,
              py: 1,
              ml: 53,
              borderRadius: 2,
              fontWeight: 500,
            }}
            endIcon={
              loading ? (
                <span
                  className="spinner"
                  style={{
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                <AddCircleOutlineIcon />
              )
            }
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const EmployeeTrainingsData = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { emp_id, name, department, email } = location.state;
  const [remainingTrainings, setRemainingTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRows, setFilteredRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrainingToDelete, setSelectedTrainingToDelete] = useState(null);


  // console.log(rows)


  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const data = await getEmployeeTrainings(emp_id);
        setRows(data.data);
        let all_trainings;

        all_trainings = await getTrainingsDetails(department);

        const assignedIds = data.data.map((t) => t.id);
        const notAssignedTrainings = all_trainings.filter((t) => {
          // console.log(t.status);
          return t.status !== "inactive" && !assignedIds.includes(t.id);
        });
        setRemainingTrainings(notAssignedTrainings);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [emp_id]);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const titleMatch = row.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const startDateMatch = moment(row.start_date)
        .format("MMM DD, YYYY")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const dueDateMatch = moment(row.due_date)
        .format("MMM DD, YYYY")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return titleMatch || startDateMatch || dueDateMatch;
    });
    setFilteredRows(filtered);
  }, [searchTerm, rows]);
  // console.log(filteredRows)

  // const filteredRows = rows.filter((row) =>
  //   row.training.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const columns = [
    {
      field: "id",
      headerName: "SNo",
      flex: 0.4,
      renderCell: (params) => <Typography>{params.row.sno}</Typography>,
    },
    {
      field: "title",
      headerName: "Training Name",
      flex: 1.7,
      renderCell: (params) => {
        const value = params.value || "";
        const maxLength = 30;

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
      field: "progress",
      headerName: "Progress",
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ width: "50%", px: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={0.5}
          >
            <Typography variant="caption" color="textSecondary">
              {params.value}%
            </Typography>
          </Box>
          <Box>
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
                  width: `${params.value}%`,
                  backgroundColor: "#4caf50",
                  borderRadius: 5,
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </Box>
      ),
    },

    {
      field: "start_date",
      headerName: "Started Date",
      flex: 1.2,
      renderCell: (params) =>
        params.value ? moment(params.value).format("MMM DD, YYYY") : "",
    },
    {
      field: "due_date",
      headerName: "Due Date",
      flex: 1.2,
      renderCell: (params) =>
        params.value ? moment(params.value).format("MMM DD, YYYY") : "",
    },
    {
      field: "delete_training",
      headerName: "Dismiss Assignment",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip title="Dismiss Training">
          <IconButton
            color="error"
            onClick={() => {
              setSelectedTrainingToDelete(params.row);
              setDeleteDialogOpen(true);
              // console.log("Delete training with ID:", params.row);
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      ),
    },


    // {
    //   field: "alert",
    //   headerName: "Alert",
    //   flex: 1,
    //   renderCell: () => (
    //     <Tooltip title="Send Reminder" placement="top-start" arrow>
    //       <Button
    //         variant="contained"
    //         size="small"
    //         startIcon={<NotificationsNoneOutlinedIcon />}
    //         sx={{
    //           textTransform: "none",
    //           backgroundColor: "#ff8f07",
    //           borderRadius: "8px",
    //           px: 2,
    //         }}
    //       >
    //         Notify
    //       </Button>
    //     </Tooltip>
    //   ),
    // },
  ];
  // console.log(filteredRows)

  const ConfirmDeleteDialog = ({ open, onClose, onConfirm, trainingTitle }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to remove the training{" "}
          <strong>{trainingTitle}</strong> from this employee?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
  const handleConfirmDelete = async () => {
    if (!selectedTrainingToDelete) return;

    try {
      const trainingId = selectedTrainingToDelete.id;

      await deleteTrainingAssignment(trainingId, emp_id);
      toast.success("Training assignment removed successfully");

      // Filter out the deleted training using only the consistent `id`
      setRows((prev) => prev.filter((t) => t.id !== trainingId));

      // You may not need to do this if `filteredRows` is derived via useEffect
      setFilteredRows((prev) => prev.filter((t) => t.id !== trainingId));

      // Add the removed training back to the remaining pool
      setRemainingTrainings((prev) => [
        ...prev,
        {
          id: trainingId,
          title: selectedTrainingToDelete.title,
        },
      ]);
    } catch (error) {
      toast.error("Failed to remove training");
      console.error("Error removing training:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTrainingToDelete(null);
    }
  };



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

  const NoTrainingsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        height: "100px",
        width: "100%",
      }}
    >
      <Typography variant="h6" color="textSecondary">
        No Trainings Found
      </Typography>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box className="TrainingsOverviewBackground" sx={{ pt: "90px", px: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Click to Go Back" placement="top-start" arrow>
              <IconButton onClick={() => navigate(-1)}>
                <WestIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" fontWeight={600}>
              {name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#ff8f07", gap: 1, width: "35%" }}
              onClick={() => setOpenDialog(true)}
            >
              <AddCircleOutlineIcon />
              <Typography variant="button" sx={{ textTransform: "none" }}>
                Assign Task
              </Typography>
            </Button>

            <TextField
              variant="outlined"
              placeholder="Search Trainings..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "60%" }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#aaa", mr: 1 }} />,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mx: 2,
            my: 2,
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            "& .MuiDataGrid-sortIcon": {
              color: "#ffffff",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #ddd",
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
            rows={filteredRows.map((t, i) => ({
              ...t,
              sno: i + 1
            }))}
            columns={columns}
            loading={loading}
            pageSize={7}
            rowsPerPageOptions={[7]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 7, page: 0 },
              },
            }}
            rowHeight={64}
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
            slots={{
              loadingOverlay: LoadingOverlay,
              noRowsOverlay: NoTrainingsOverlay,
            }}
          />
        </Box>
      </Box>
      <AssignTaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        remainingTrainings={remainingTrainings}
        setRemainingTrainings={setRemainingTrainings}
        emp_id={emp_id}
        email={email}
        name={name}
        setRows={setRows}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        trainingTitle={selectedTrainingToDelete?.title}
      />

    </>
  );
};

export default EmployeeTrainingsData;
