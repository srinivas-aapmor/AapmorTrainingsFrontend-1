import { useState, useRef } from "react";
import { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  Slide,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/aapmor_logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useUser } from "../context/userProvider";
import Cookies from "js-cookie";
import { getPermissions } from "../services/getPermissions";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [userInfo, setUserInfo] = useState({
    name: "",
    Department: "",
    role: "",
  });
  const iconRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [hasTeamLeadAccess, setHasTeamLeadAccess] = useState(false);

  const handleClick = () => {
    const rect = iconRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const left = Math.min(rect.left, window.innerWidth - 270);
    setPosition({ top, left });
    setOpen(true);
  };

  const handleDialogClose = () => setOpen(false);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser({ name: "", email: "", role: "" });
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        setUserInfo({
          user: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Cookies.remove('token');
        setUser({ name: "", email: "", role: "" });
        navigate("/login");
      }
    };

    fetchUser();
  }, [user, navigate, setUser]);

  useEffect(() => {
    async function checkPermissions() {
      const admin = await getPermissions(["Admin View"], user.access);
      const lead = await getPermissions(["Team Lead View"], user.access);
      setHasAdminAccess(admin);
      setHasTeamLeadAccess(lead);
    }

    if (user?.access?.length) {
      checkPermissions();
    }
  }, [user.access]);

  return (
    <Box className="navbar">
      <Box
        className="navbar-logo"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      >
        <Tooltip title="Aapmor - Trainings" arrow>
          <img src={logo} alt="aapmor logo" />
        </Tooltip>
      </Box>

      <Box className="navbar-content">
        {/* <Tooltip title="Click to Check Notifications" placement="bottom" arrow>
          <IconButton
            sx={{
              backgroundColor: "black",
              color: "#fff",
              width: 36,
              height: 36,
              mr: 2,
              "&:hover": {
                backgroundColor: "grey",
              },
            }}
          >
            <NotificationsActiveOutlinedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip> */}
        <Tooltip title={userInfo.user + "(You)"} placement="bottom-start" arrow>
          <IconButton
            ref={iconRef}
            onClick={handleClick}
            sx={{
              width: 44,
              height: 44,
              color: "black",
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Tooltip>
        <Dialog
          open={open}
          onClose={handleDialogClose}
          TransitionComponent={Slide}
          keepMounted
          disableEnforceFocus
          PaperProps={{
            sx: {
              position: "absolute",
              top: position.top,
              left: position.left,
              m: 0,
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              width: isMobile ? "55vw" : "240px",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight="bold" color="#333">
                  {userInfo.user}
                </Typography>
                <Typography fontSize={14} color="#666">
                  {userInfo.role}
                </Typography>
                <Divider sx={{ borderColor: "black", mt: 2 }} />
              </Box>
            </Box>
            {hasAdminAccess && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                mt={1}
                width="100%"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/admin");
                  handleDialogClose();
                }}
              >
                <DashboardOutlinedIcon fontSize="small" />
                <Typography fontSize={14} color="#333">
                  Admin Dashboard
                </Typography>
              </Box>
            )}

            {hasTeamLeadAccess && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                mt={1}
                width="100%"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/teamlead");
                  handleDialogClose();
                }}
              >
                <DashboardOutlinedIcon fontSize="small" />
                <Typography fontSize={14} color="#333">
                  Team Lead Dashboard
                </Typography>
              </Box>
            )}
            <Tooltip title="Click to Logout" arrow>
              <Button
                fullWidth
                endIcon={<Logout />}
                onClick={handleLogout}
                variant="contained"
                sx={{
                  backgroundColor: "#d9664f",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#c25545",
                  },
                }}
              >
                Log Out
              </Button>
            </Tooltip>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Navbar;
