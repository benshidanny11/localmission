import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const withProtectedRoute = (Component) => {
  return (props) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default withProtectedRoute;
