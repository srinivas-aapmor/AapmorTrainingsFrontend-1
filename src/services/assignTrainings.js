import { apiEndpoints } from "../utils/apiEndpoints";
import { axiosInstance } from "../utils/axios";

export async function assignTasksForEmployees(tasks) {
  try {
    const emp_id = tasks.employeeId;
    const assignedTrainings = tasks.assignedTrainings;
    const email = tasks.email;
    const name = tasks.name;
    const department = tasks.department;
    // console.log(tasks);
    const response = await axiosInstance.post(apiEndpoints.assignTasks, {
      emp_id,
      email,
      name,
      assignedTrainings,
      department,
    });
    return response.data;
  } catch (error) {
    console.error("cannot assign tasks", error);
  }
}
