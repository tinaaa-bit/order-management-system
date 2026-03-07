import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Loader, Icon, Modal, List } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { handleLogError } from '../misc/Helpers'
import UserTable from './UserTable'
import OrderTable from './OrderTable'
import './AdminPage.css'

function AdminPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isAdmin = user?.data?.rol?.[0] === 'ADMIN'

  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [activeSection, setActiveSection] = useState('users')
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await orderApi.getUsers(user)
      setUsers(response.data)
    } catch (error) {
      handleLogError(error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getOrders(user)
      setOrders(response.data)
    } catch (error) {
      handleLogError(error)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    await fetchUsers()
    await fetchOrders()
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteUser = async (username) => {
    try {
      await orderApi.deleteUser(user, username)
      fetchUsers()
    } catch (error) {
      handleLogError(error)
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      await orderApi.deleteOrder(user, orderId)
      fetchOrders()
    } catch (error) {
      handleLogError(error)
    }
  }

  const logout = () => {
    Auth.userLogout()
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
      <div className="admin-shell">
        <Container className="admin-container">

          <div className="admin-topbar">

            <div>
              <p className="admin-tag">Admin Dashboard</p>
              <h1 className="admin-title">System Management</h1>
              <p className="admin-subtitle">
                Manage users and monitor all orders in the system.
              </p>
            </div>

            <div className="admin-actions">

              <button
                  className="admin-btn-outline"
                  onClick={() => setProfileOpen(true)}
              >
                <Icon name="user circle" />
                Profile
              </button>

              <button
                  className="admin-btn-primary"
                  onClick={logout}
              >
                <Icon name="log out" />
                Logout
              </button>

            </div>

          </div>

          <div className="admin-tabs">

            <button
                className={activeSection === 'users' ? 'admin-tab active' : 'admin-tab'}
                onClick={() => setActiveSection('users')}
            >
              <Icon name="users" />
              Users
            </button>

            <button
                className={activeSection === 'orders' ? 'admin-tab active' : 'admin-tab'}
                onClick={() => setActiveSection('orders')}
            >
              <Icon name="shopping bag" />
              Orders
            </button>

          </div>

          {isLoading ? (
              <Loader active inline="centered" />
          ) : (
              <>

                {activeSection === 'users' && (
                    <div className="admin-card">
                      <UserTable
                          users={users}
                          deleteUser={deleteUser}
                      />
                    </div>
                )}

                {activeSection === 'orders' && (
                    <div className="admin-card">
                      <OrderTable
                          orders={orders}
                          deleteOrder={deleteOrder}
                      />
                    </div>
                )}

              </>
          )}

          <Modal
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
              size="tiny"
              closeIcon
          >
            <Modal.Content>

              <div className="profile-box">

                <Icon name="user circle" size="huge" />

                <h3>Admin Profile</h3>

                <List relaxed>

                  <List.Item>
                    <strong>Name:</strong> {user?.data?.name}
                  </List.Item>

                  <List.Item>
                    <strong>Username:</strong> {user?.data?.sub}
                  </List.Item>

                  <List.Item>
                    <strong>Email:</strong> {user?.data?.email}
                  </List.Item>

                </List>

              </div>

            </Modal.Content>
          </Modal>

        </Container>
      </div>
  )
}

export default AdminPage