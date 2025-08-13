import { axiosInstance } from "../utils/axios";
import { apiEndpoints } from "../utils/apiEndpoints";

export async function verifyToken(token) {
  try {
    const response = await axiosInstance(apiEndpoints.verifyToken, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Cannot verify Jwt token", error);
  }
}
