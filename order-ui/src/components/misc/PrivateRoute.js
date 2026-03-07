import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children, roles }) {
  const { userIsAuthenticated, getUser } = useAuth()

  if (!userIsAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const user = getUser()
  const userRole = user?.data?.rol?.[0]

  if (roles && roles.length > 0 && (!userRole || !roles.includes(userRole))) {
    if (userRole === 'ADMIN') {
      return <Navigate to="/adminpage" replace />
    }

    if (userRole === 'USER') {
      return <Navigate to="/userpage" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute