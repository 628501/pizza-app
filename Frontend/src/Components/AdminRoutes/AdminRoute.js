import React, { useEffect, useState } from 'react';
import NotFound from '../NotFound/NotFound';
import AuthRoute from '../AuthRoute/AuthRoute';

const AdminRoute = ({ children }) => {
  const [admin, setAdmin] = useState();
  

  useEffect(() => {
    const isadmin = localStorage.getItem('user');
    if(isadmin){
      const parsedAdmin = JSON.parse(isadmin)
      setAdmin(parsedAdmin.admin)
    }
    },[])

    return admin ? (
      children
    ) : (
      <NotFound
        linkRoute="/dashboard"
        linkText="Go to Dashboard"
        message="You don't have access to this page"
      />
    );
  }


const AdminRouteExport = ({ children }) => (
  <AuthRoute>
    <AdminRoute>{children}</AdminRoute>
  </AuthRoute>
);

export default AdminRouteExport;
