import { apiEndpoints } from "../utils/apiEndpoints";
import { axiosInstance } from "../utils/axios";

export async function getEmployeeTrainings(emp_id) {
  try {
    const response = await axiosInstance.post(
      apiEndpoints.fetchEmployeeTrainings,
      { emp_id }
    );
    return response.data;
  } catch (error) {
    console.error("cannot fetch employye trainings", error);
  }
}
