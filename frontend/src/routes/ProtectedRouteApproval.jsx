// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRouteApproval = ({ children }) => {
  const user = useSelector((state) => state.user.username);
  const { grade } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const allowedGrades = ["E3", "E2", "E1", "M3","M2"];
    if (!allowedGrades.includes(grade)) {
        return <Navigate to="/restrictedAccess" />;
    }

  return children;
};

export default ProtectedRouteApproval;
