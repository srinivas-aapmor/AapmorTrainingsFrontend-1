import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="main-content">
            <Outlet />
        </div>
    );
};

export default AdminLayout;
