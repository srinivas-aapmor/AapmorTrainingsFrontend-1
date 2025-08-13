import { useState, useEffect, useContext, createContext } from "react";
import { axiosInstance } from "../utils/axios";
import { useUser } from "./userProvider";
import { getUserData } from "../services/getUserData";

const endUserContext = createContext(undefined);

function EndUserContextProvider({ children }) {
    const [assigned, setAssigned] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [due, setDue] = useState(0);
    const [trainings, setTrainings] = useState([]);
    const { user } = useUser()
    useEffect(() => {
        async function getData() {
            const data = await getUserData(user.emp_id);
            if (data) {
                setAssigned(data.cardStats.assigned);
                setCompleted(data.cardStats.completed);
                setDue(data.cardStats.due);
                setTrainings(data.trainings);
            }
        }
        getData()
    }, [user.emp_id]);
    return (
        <endUserContext.Provider value={{
            assigned,
            setAssigned,
            completed,
            setCompleted,
            due,
            setDue,
            trainings,
            setTrainings,
            emp_id: user.emp_id,
        }}>
            {children}
        </endUserContext.Provider>
    )
}

const useEndUser = () => useContext(endUserContext);

export { EndUserContextProvider, useEndUser };