import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AppRoutes from './app.routes';
import AppRoutesGuest from './app.routes.guest';
import AuthRoutes from './auth.routes';

export default function Routes() {
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  if (isAuthenticated) {
    return <AppRoutes />;
  } else if (isGuest) {
    return <AppRoutesGuest />;
  } else {
    return <AuthRoutes />;
  }
}
