import { axiosInstance } from "../utils/axios";

export const deleteTrainingAssignment = async (training_id, emp_id) => {
  console.log(training_id, emp_id);
  const response = await axiosInstance.delete("/delete-training", {
    data: {
      training_id,
      emp_id,
    },
  });
  return response.data;
};
