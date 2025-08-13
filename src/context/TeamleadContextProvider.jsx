import { createContext, useContext, useState, useEffect } from 'react';
import { apiEndpoints } from '../utils/apiEndpoints';
import { axiosInstance } from '../utils/axios';
import { useUser } from './userProvider';

const TeamleadContext = createContext();

function TeamleadContextProvider({ children }) {
    const { user } = useUser()
    // console.log(user.email)
    // console.log(user.role)
    const [totalAssigned, setTotalAssigned] = useState()
    const [totalCompleted, setTotalCompleted] = useState()
    const [totalDue, setTotalDue] = useState()

    const [employees, setEmployees] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                const response = await axiosInstance.post(apiEndpoints.teamleadDashBoardEndpoint, {
                    "email": user.email,
                    "SpaceName": user.role
                })
                // console.log(response.data.teamReport)
                setTotalAssigned(response.data.cardStats.assigned);
                setTotalCompleted(response.data.cardStats.completed);
                setTotalDue(response.data.cardStats.pending);
                setEmployees(response.data.teamReport)
            } catch (error) {
                console.error("Error fetching teamlead dashboard data:", error);
            }
        }
        getData()
    }, [])

    return (
        <TeamleadContext.Provider value={{
            totalAssigned,
            totalCompleted,
            totalDue,
            employees,
            setEmployees,
            setTotalAssigned,
            setTotalDue,


        }}>
            {children}
        </TeamleadContext.Provider>
    )
}

function useTeamleadContext() {
    return useContext(TeamleadContext)
}

export { TeamleadContextProvider, useTeamleadContext };