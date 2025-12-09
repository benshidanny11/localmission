// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRouteCompute = ({ children }) => {
  const user = useSelector((state) => state.user.username);
  const { grade, department } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const allowedGradesFinance = ["P2", "T2", "P1", "E1"];
    if (JSON.parse(department).id !== 15 && !allowedGradesFinance.includes(grade)) {
        return <Navigate to="/restrictedAccess" />;
    }

  return children;
};

export default ProtectedRouteCompute;
