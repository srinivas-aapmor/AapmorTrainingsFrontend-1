import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  deleteTraining,
  updateTraining,
} from "../services/getAdminDashboardData";
import { useAdminContext } from "../context/AdminContextProvider";
import "../styles/EditTrainings.css";
import { toast } from "react-toastify";

const EditTraining = ({
  open,
  onClose,
  training,
  onUpdate,
  editId,
  editTrainingname,
  editStatus,
  editTimePeriod,
  editDepartmentName,
  editCreatedAt,
  setAllTrainings,
}) => {
  const { departments } = useAdminContext();
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState(training?.department || "");
  const [timePeriod, setTimePeriod] = useState(training?.time_period || "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [initialValues, setInitialValues] = useState({
    status: "",
    department: "",
    timePeriod: "",
  });

  useEffect(() => {
    if (editStatus || editDepartmentName || editTimePeriod !== undefined) {
      setInitialValues({
        status: editStatus?.toLowerCase(),
        department: editDepartmentName,
        timePeriod: editTimePeriod,
      });

      setStatus("");
      setDepartment("");
      setTimePeriod("");
    }
  }, [editStatus, editDepartmentName, editTimePeriod]);

  const isChanged =
    (status && status !== initialValues.status) ||
    (department && department !== initialValues.department) ||
    (timePeriod !== "" && timePeriod !== initialValues.timePeriod);

  const clearFields = () => {
    setStatus("");
    setDepartment("");
    setTimePeriod("");
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteTraining(editId);
      setAllTrainings((prev) => prev.filter((t) => t.id !== editId));
      toast.success("Training deleted successfully");
    } catch (error) {
      console.error("Failed to delete training:", error);
      toast.error("Failed to delete training");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const updatedData = {};

      if (status && status.toLowerCase() !== editStatus.toLowerCase()) {
        updatedData.training_status = status.toLowerCase();
      }
      if (department && department !== editDepartmentName) {
        updatedData.department = department;
      }
      if (timePeriod && timePeriod !== editTimePeriod) {
        updatedData.time_period = timePeriod;
      }

      if (Object.keys(updatedData).length === 0) {
        toast.warning("Please change at least one field to update.");
        return;
      }

      const updatedTraining = await updateTraining(editId, updatedData);

      setAllTrainings((prev) =>
        prev.map((t) => (t.id === editId ? updatedTraining : t))
      );

      onClose();
      clearFields();
      toast.success("Training updated successfully");
    } catch (error) {
      console.error("Failed to update training:", error);
      toast.error("Failed to update training");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }} className="EditTrainingDialog">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 0,
              pt: 0,
            }}
          >
            <Typography component="span" variant="h5" fontWeight={600}>
              Edit Trainings
            </Typography>
            <Tooltip title="Close Tab" placement="bottom" arrow>
              <IconButton onClick={onClose}>
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>

          <Box>
            <Typography variant="h6" mb={2}>
              Training Name
            </Typography>
            <Typography variant="body1">{editTrainingname || "N/A"}</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Created: {editCreatedAt}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["active", "inactive"]
                  .filter((val) => val !== initialValues.status)
                  .map((val) => (
                    <MenuItem key={val} value={val}>
                      <CircleIcon
                        sx={{
                          fontSize: 12,
                          color: val === "active" ? "green" : "red",
                          mr: 1,
                        }}
                      />
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </MenuItem>
                  ))}
              </TextField>

              <Tooltip title="Only positive numbers allowed" arrow>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  // label="Time Period (days)"
                  value={timePeriod}
                  placeholder="Enter time period"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setTimePeriod("");
                      return;
                    }

                    const numberValue = Number(value);

                    if (numberValue >= 0 && numberValue <= 365) {
                      setTimePeriod(numberValue);
                    }
                  }}
                  inputProps={{
                    min: 0,
                    max: 365,
                  }}
                />
              </Tooltip>

              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departments
                  .filter((dept) => dept !== initialValues.department)
                  .map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#dc2626",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#b91c1c",
                  },
                }}
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </Button>

              <Button
                variant="contained"
                disabled={!isChanged || isUpdating}
                sx={{
                  backgroundColor: "#22c55e",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 600,
                }}
                onClick={handleUpdate}
                endIcon={<AddCircleOutlineIcon />}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box p={3}>
          <Typography variant="h6" mb={2}>
            Are you sure you want to delete this training?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setConfirmOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default EditTraining;
