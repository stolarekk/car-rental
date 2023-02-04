import React from "react";
import { Navigate } from "react-router-dom";
const ProtectedRouteAdmin = ({ user, redirectPath, children }) => {
    if (Object.keys(user).length === 0 || !user.admin) {
      return <Navigate to={redirectPath} replace />;
    }
    
    return children;
  };

  export default ProtectedRouteAdmin