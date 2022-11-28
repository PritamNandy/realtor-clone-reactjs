import React from 'react'
import { Navigate, Outlet } from 'react-router';
import { useAuthStatus } from '../hooks/useAuthStatus';

export default function PrivateRoute() {
  const {loggedIn, checkingStatus} = useAuthStatus();
  if(checkingStatus) {
    return 'Loading...'
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in"/>
}
