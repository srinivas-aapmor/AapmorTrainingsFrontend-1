import NavigatetoAuthX from "../pages/NavigatetoAuthX";
import AdminHomePage from "../pages/AdminHomePage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import TrainingsOverview from "../pages/TrainingsOverview";
import DisplayContent from "../pages/DisplayContent";
import UserDashboard from "../pages/UserDashboard";
import EmployeeReport from "../pages/EmployeeReport";
import TeamLeadHomePage from "../pages/TeamLeadHomePage";
import EmployeeTrainingDataForTL from "../pages/EmployeeTrainingDataForTL";
import AssignedTrainings from "../pages/AssignedTrainings";
import NotFound from "../helpers/NotFound"
import AdminLayout from "../layouts/AdminLayout";
import { AdminContextProvider } from "../context/AdminContextProvider";
import { TeamleadContextProvider } from '../context/TeamleadContextProvider'
import UserLayout from "../layouts/UserLayout";
import { EndUserContextProvider } from "../context/endUserContextProvider";
import UnAuthorized from "../helpers/UnAuthorized";

const routes = [
  {
    path: "/login",
    element: <NavigatetoAuthX />,
  },
  {
    path: "/",
    element: <EndUserContextProvider><UserLayout /></EndUserContextProvider>,

    children: [
      {
        path: "",
        element: <UserDashboard />
      },
      {
        path: 'training',
        element: <DisplayContent />
      },
      {
        path: "assigned-trainings",
        element: <AssignedTrainings />,
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminContextProvider><AdminLayout /></AdminContextProvider>,
    requiredAccess: ["Admin View"],
    children: [
      {
        path: "",
        element: <AdminHomePage />
      },
      {
        path: "trainings-overview",
        element: <TrainingsOverview />
      }, {
        path: 'employee-report',
        element: <EmployeeReport />
      }
    ]
  },
  {
    path: "/teamlead",
    element: <TeamleadContextProvider><TeamLeadHomePage /></TeamleadContextProvider>,
    requiredAccess: ["Team Lead View"],
  },
  {
    path: "/auth-callback/login",
    element: <AuthCallbackPage />
  },

  {
    path: "/employee-trainingdata",
    element: <EmployeeTrainingDataForTL />,
    requiredAccess: ["Admin View", "Team Lead View"],
  },
  {

  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/unauthorized",
    element: < UnAuthorized />,
  }

];

export default routes;


