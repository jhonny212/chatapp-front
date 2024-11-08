// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import { NavBarLayout } from '../components/common/Navbar';
import { Layout } from '../layout/Layout';

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    const isValidToken = auth.isAuthenticated();

    const tmp = <>
        <NavBarLayout />
        <Layout>{children}</Layout>
    </>

    return isValidToken ? tmp : <Navigate to="/" />;
};

export default PrivateRoute;
