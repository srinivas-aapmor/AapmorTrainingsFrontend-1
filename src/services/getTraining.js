import { apiEndpoints } from "../utils/apiEndpoints";
import { axiosInstance } from "../utils/axios";

export async function getTraining(id, emp_id) {
  try {
    const response = await axiosInstance.get(apiEndpoints.getTraining(id), {
      params: { emp_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching training details:", error);
    throw error;
  }
}
