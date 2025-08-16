import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import routes from "./configs/routesConfig";
import Navbar from "./components/Navbar";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useUser } from "./context/userProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "./services/verifyToken";
import ProtectedLayout from "./helpers/ProtectedLayout";
import Loader from "./helpers/Loader";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    // Avoid redirect loop on login or auth callback
    if (location.pathname.startsWith("/auth-callback/login") || location.pathname === "/login") {
      setLoading(false);
      return;
    }

    // If no token, redirect to login once
    if (!token) {
      navigate("/login", { replace: true });
      setLoading(false);
      return;
    }

    async function validateToken() {
      try {
        const response = await verifyToken(token);

        if (!response.data.valid) {
          Cookies.remove("token");
          if (location.pathname !== "/login") navigate("/login", { replace: true });
        } else {
          const decoded = response.data.payload;
          setUser({
            emp_id: decoded.EmpId,
            name: decoded.FullName,
            email: decoded.Email,
            role: decoded.Department,
            access: decoded.Access || [],
          });
        }
      } catch (error) {
        console.error("Token validation error:", error);
        Cookies.remove("token");
        if (location.pathname !== "/login") navigate("/login", { replace: true });
        toast.error("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, [location.pathname, navigate, setUser]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          {routes.map(({ path, element, children, requiredAccess }, index) => (
            <Route
              key={index}
              path={path}
              element={
                requiredAccess ? (
                  <ProtectedLayout requiredAccess={requiredAccess}>
                    {element}
                  </ProtectedLayout>
                ) : (
                  element
                )
              }
            >
              {children &&
                children.map((child, i) => (
                  <Route
                    key={i}
                    path={child.path}
                    element={
                      child.requiredAccess ? (
                        <ProtectedLayout requiredAccess={child.requiredAccess}>
                          {child.element}
                        </ProtectedLayout>
                      ) : (
                        child.element
                      )
                    }
                  />
                ))}
            </Route>
          ))}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </>
  );
}

export default App;

