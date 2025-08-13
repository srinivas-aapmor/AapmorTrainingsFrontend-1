import { axiosInstance } from "../utils/axios";
import { apiEndpoints } from "../utils/apiEndpoints";

export const getTrainingsDetails = async (spacename) => {
  const response = await axiosInstance.post(apiEndpoints.fetchTrainingsforTL, {
    department: spacename,
  });
  return response.data;
};
