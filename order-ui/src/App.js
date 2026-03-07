import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import AdminPage from './components/admin/AdminPage'
import UserPage from './components/user/UserPage'

function AppLayout() {
    const location = useLocation()
    const hideNavbar = ['/', '/login', '/signup', '/userpage', '/adminpage'].includes(location.pathname)

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path='/' element={<Home />} />
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
        </>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    )
}

export default App