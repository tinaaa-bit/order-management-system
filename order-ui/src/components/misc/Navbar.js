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
    if (!isAuthenticated) return '/'
    if (role === 'ADMIN') return '/adminpage'
    if (role === 'USER') return '/userpage'
    return '/'
  }

  return (
      <Menu inverted color='violet' stackable size='large' style={{ borderRadius: 0, marginBottom: 0 }}>
        <Container>
          <Menu.Item header as={Link} to={getHomePath()}>
            Order-UI
          </Menu.Item>

          {isAuthenticated && (
              <Menu.Item as={Link} to={getHomePath()}>
                Home
              </Menu.Item>
          )}

          <Menu.Menu position='right'>
            {isAuthenticated && <Menu.Item header>{`Hi ${name}`}</Menu.Item>}

            {isAuthenticated && (
                <Menu.Item as={Link} to="/" onClick={logout}>
                  Logout
                </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
  )
}

export default Navbar