import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useUser } from "../context/userProvider";
import { verifyToken } from "../services/verifyToken";
import Loader from "../helpers/Loader";
// import Loader from '../helpers/Loader';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    async function decodeToken() {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      if (!token) {
        console.warn("No token found in URL");
        navigate("/login", { replace: true });
        return;
      }

      const response = await verifyToken(token);

      if (response.data.valid) {
        try {

          const decoded = response.data.payload;


          Cookies.set("token", token, {
            expires: 7,
            sameSite: "Strict",
            secure: false,
            path: "/"
          });
          setUser({
            emp_id: decoded.EmpId,
            name: decoded.FullName,
            email: decoded.Email,
            role: decoded.SpaceName,
            access: decoded.Access || [],
          });

          if (Cookies.get("token")) {
            navigate("/", { replace: true });
          }
        } catch (err) {
          console.error("Invalid token:", err.message);
          navigate("/login", { replace: true });
        }
      } else {

        navigate("/login", { replace: true });
      }
    }
    decodeToken()
  }, [location, setUser, navigate]);

  return <Loader />;
};

export default AuthCallbackPage;
