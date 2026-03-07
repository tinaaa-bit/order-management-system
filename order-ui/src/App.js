import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import AdminPage from './components/admin/AdminPage'
import UserPage from './components/user/UserPage'

function RootRedirect() {
  const { userIsAuthenticated, getUser } = useAuth()

  if (!userIsAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const user = getUser()
  const role = user?.data?.rol?.[0]

  if (role === 'ADMIN') {
    return <Navigate to="/adminpage" replace />
  }

  if (role === 'USER') {
    return <Navigate to="/userpage" replace />
  }

  return <Navigate to="/login" replace />
}

function App() {
  return (
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<RootRedirect />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            <Route
                path='/adminpage'
                element={
                  <PrivateRoute roles={['ADMIN']}>
                    <AdminPage />
                  </PrivateRoute>
                }
            />

            <Route
                path='/userpage'
                element={
                  <PrivateRoute roles={['USER']}>
                    <UserPage />
                  </PrivateRoute>
                }
            />

            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
      </AuthProvider>
  )
}

export default App