import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
