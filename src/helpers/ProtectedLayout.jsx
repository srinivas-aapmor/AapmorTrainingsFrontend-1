import React, { useEffect, useState } from 'react';
import { useUser } from "../context/userProvider";
import { getPermissions } from '../services/getPermissions';
import { Navigate } from 'react-router-dom';
import Loader from '../helpers/Loader';


export default function ProtectedLayout({ children, requiredAccess = [] }) {
    const { user } = useUser();
    const userAccess = user?.access || [];

    const [hasAccess, setHasAccess] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function checkAccess() {
            const result = await getPermissions(requiredAccess, userAccess);
            setHasAccess(result);
        }

        checkAccess();
    }, [requiredAccess, user]);

    if (!user || hasAccess === null) {
        return <Loader />;
    }

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
