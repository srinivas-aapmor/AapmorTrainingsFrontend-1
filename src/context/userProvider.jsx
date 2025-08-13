// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Loader from "../helpers/Loader";
import { verifyToken } from "../services/verifyToken";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    emp_id: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function decodeToken() {
      const token = Cookies.get("token");
      if (!token) return setLoading(false);
      const response = await verifyToken(token);
      if (!response.data.valid) {
        Cookies.remove("token");
        return setLoading(false);
      }
      try {
        const decoded = response.data.payload;
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
          Cookies.remove("token");
          return setLoading(false);
        }

        setUser({
          emp_id: decoded.EmpId,
          name: decoded.FullName,
          email: decoded.Email,
          role: decoded.Department,
          access: decoded.Access || []
        });
      } catch (err) {
        console.error("Token decoding failed:", err.message);
      } finally {
        setLoading(false);
      }
    }
    decodeToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
