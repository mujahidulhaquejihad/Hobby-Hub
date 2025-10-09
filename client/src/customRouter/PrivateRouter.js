import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouter = () => {
    const firstLogin = localStorage.getItem('firstLogin');

    // If the user is logged in, render the child routes (`<Outlet />`).
    // Otherwise, redirect them to the home/login page.
    return firstLogin ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouter;