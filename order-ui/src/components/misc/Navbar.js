import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Menu } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth()

  const isAuthenticated = userIsAuthenticated()
  const user = getUser()
  const role = user?.data?.rol?.[0]
  const name = user?.data?.name || ''

  const logout = () => {
    userLogout()
  }

  const getHomePath = () => {
    if (!isAuthenticated) return '/login'
    if (role === 'ADMIN') return '/adminpage'
    if (role === 'USER') return '/userpage'
    return '/login'
  }

  return (
      <Menu inverted color='violet' stackable size='massive' style={{ borderRadius: 0 }}>
        <Container>
          <Menu.Item header>Order-UI</Menu.Item>
          <Menu.Item as={Link} to={getHomePath()}>Home</Menu.Item>

          {isAuthenticated && role === 'ADMIN' && (
              <Menu.Item as={Link} to="/adminpage">AdminPage</Menu.Item>
          )}

          {isAuthenticated && role === 'USER' && (
              <Menu.Item as={Link} to="/userpage">UserPage</Menu.Item>
          )}

          <Menu.Menu position='right'>
            {!isAuthenticated && <Menu.Item as={Link} to="/login">Login</Menu.Item>}
            {!isAuthenticated && <Menu.Item as={Link} to="/signup">Sign Up</Menu.Item>}

            {isAuthenticated && <Menu.Item header>{`Hi ${name}`}</Menu.Item>}

            {isAuthenticated && (
                <Menu.Item as={Link} to="/login" onClick={logout}>
                  Logout
                </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
  )
}

export default Navbar