import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./contexts/AuthContext/AuthContext";
import Forbidden from "./pages/Forbidden";

const AdminOwnerRoute = ({ component }) => {
  const { auth } = useContext(AuthContext);
  const { isAuthenticated, user } = auth;

  if (isAuthenticated && (user.role_id === 1 || user.role_id === 2)) {
    return component;
  } else if (isAuthenticated && (user.role_id !== 1 || user.role_id !== 2)) {
    return <Forbidden />;
  }

  return <Navigate to="/login" />;
};

export default AdminOwnerRoute;
