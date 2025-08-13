import { createContext, useContext, useState, useEffect, use } from "react";
import {
  getAdminDashboardData,
  getDepartmentNames,
} from "../services/getAdminDashboardData";

const AdminContext = createContext();

function AdminContextProvider({ children }) {
  const [totalAssigned, setTotalAssigned] = useState();
  const [totalCompleted, setTotalCompleted] = useState();
  const [totalDue, setTotalDue] = useState();

  const [trainings, setAllTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAdminDashboardData();
      const deptNames = await getDepartmentNames();
      // console.log(data)
      if (data) {
        const stats = data.cardStats || {};

        setTotalAssigned(stats.assigned || 0);
        setTotalCompleted(stats.completed || 0);
        setTotalDue(stats.due || 0);

        setAllTrainings(data.trainings || []);
        setEmployees(data.employeeReport || []);

        if (deptNames) {
          setDepartments(deptNames);
        }
      }
    }
    fetchData();
  }, []);
  return (
    <AdminContext.Provider
      value={{
        totalAssigned,
        setTotalAssigned,
        totalCompleted,
        setTotalCompleted,
        totalDue,
        setTotalDue,
        trainings,
        setAllTrainings,
        employees,
        setEmployees,
        departments,
        setDepartments,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

function useAdminContext() {
  return useContext(AdminContext);
}

export { AdminContextProvider, useAdminContext };