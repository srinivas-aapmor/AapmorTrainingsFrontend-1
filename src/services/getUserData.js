import { apiEndpoints } from "../utils/apiEndpoints";
import { axiosInstance } from "../utils/axios";

export async function getUserData(emp_id) {
  try {
    const response = await axiosInstance.post(
      apiEndpoints.userDashBoardEndpoint,
      {
        emp_id: emp_id,
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error getting user dashboard data: ", error);
  }
}
