import { axiosInstance } from "../utils/axios";
import { apiEndpoints } from "../utils/apiEndpoints";

export async function verifyToken(token) {
  try {
    const response = await axiosInstance.get(apiEndpoints.verifyToken, {
      headers: {
        Authorization: `Bearer ${token}`, // send token in Authorization header
      },
    });

    return response; // this will include status, data, etc.
  } catch (error) {
    console.error("Cannot verify JWT token:", error.response || error.message);
    return { data: { valid: false, message: error.message } }; // fallback object
  }
}
