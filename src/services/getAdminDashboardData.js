import { axiosInstance } from "../utils/axios";
import { apiEndpoints } from "../utils/apiEndpoints";
import axios from "axios";

export async function getAdminDashboardData() {
  try {
    const response = await axiosInstance(apiEndpoints.adminDashboardEndpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
  }
}

export const uploadTrainingData = async (axiosInstance, formData) => {
  try {
    const response = await axiosInstance.post(
      apiEndpoints.uploadTrainings,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading training data:", error);
    throw error;
  }
};
export async function deleteTraining(id) {
  try {
    const response = await axiosInstance.delete(
      apiEndpoints.deleteTrainingEndpoint(id)
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.error || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting training:", error);
    throw error;
  }
}

export async function updateTraining(id, data) {
  try {
    const response = await axiosInstance.put("/update-trainings", { id, data });
    return response.data.trainings;
  } catch (error) {
    console.error("Error updating training:", error);
  }
}

export async function getDepartmentNames() {
  try {
    const url = import.meta.env.VITE_AUTHX_USERSDEPARTMENTNAMES + "/api/users";
    const response = await axios.get(url);
    const users = response.data;
    const uniqueDepartments = [...new Set(users.map((user) => user.SpaceName))];
    const departmentsWithAll = ["All Departments", ...uniqueDepartments];
    return departmentsWithAll;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
}
