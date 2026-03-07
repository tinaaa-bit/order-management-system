import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Container,
  Loader,
  Icon,
  Modal,
  List
} from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { handleLogError } from '../misc/Helpers'
import OrderForm from '../misc/OrderForm'
import OrderTable from './OrderTable'
import './UserPage.css'

function UserPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isUser = user?.data?.rol?.[0] === 'USER'

  const [userMe, setUserMe] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [orderDescription, setOrderDescription] = useState('')
  const [activeSection, setActiveSection] = useState('home')
  const [profileOpen, setProfileOpen] = useState(false)

  const fetchUserMeData = async () => {
    setIsLoading(true)
    try {
      const response = await orderApi.getUserMe(user)
      setUserMe(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserMeData()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    if (name === 'orderDescription') {
      setOrderDescription(value)
    }
  }

  const handleCreateOrder = async () => {
    const trimmedDescription = orderDescription.trim()
    if (!trimmedDescription) return

    const order = { description: trimmedDescription }

    try {
      await orderApi.createOrder(user, order)
      await fetchUserMeData()
      setOrderDescription('')
      setActiveSection('history')
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleLogout = () => {
    Auth.userLogout()
  }

  if (!isUser) {
    return <Navigate to='/' replace />
  }

  return (
      <div className="user-page-shell">
        <Container className="user-page-container">
          <div className="user-topbar">
            <div>
              <p className="user-page-tag">User Dashboard</p>
              <h1 className="user-page-title">Welcome, {userMe?.name || 'User'}</h1>
              <p className="user-page-subtitle">
                Create orders, check your order history, and manage your account.
              </p>
            </div>

            <div className="user-topbar-actions">
              <button
                  type="button"
                  className="user-icon-btn"
                  onClick={() => setProfileOpen(true)}
              >
                <Icon name="user circle" />
                Profile
              </button>

              <button
                  type="button"
                  className="user-logout-btn"
                  onClick={handleLogout}
              >
                <Icon name="log out" />
                Logout
              </button>
            </div>
          </div>

          <div className="user-tabs">
            <button
                type="button"
                className={activeSection === 'home' ? 'user-tab active' : 'user-tab'}
                onClick={() => setActiveSection('home')}
            >
              <Icon name="home" />
              Home
            </button>

            <button
                type="button"
                className={activeSection === 'history' ? 'user-tab active' : 'user-tab'}
                onClick={() => setActiveSection('history')}
            >
              <Icon name="history" />
              Order History
            </button>
          </div>

          {isLoading && !userMe ? (
              <div className="user-loader-box">
                <Loader active inline="centered" />
              </div>
          ) : (
              <>
                {activeSection === 'home' && (
                    <div className="user-card">
                      <div className="user-card-header">
                        <h2>Create New Order</h2>
                        <p>Enter a description to create a new order.</p>
                      </div>

                      <OrderForm
                          orderDescription={orderDescription}
                          handleInputChange={handleInputChange}
                          handleCreateOrder={handleCreateOrder}
                      />
                    </div>
                )}

                {activeSection === 'history' && (
                    <div className="user-card">
                      <div className="user-card-header">
                        <h2>Your Orders</h2>
                        <p>View all the orders you have created.</p>
                      </div>

                      <OrderTable orders={userMe?.orders || []} />
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
              <div className="profile-modal-box">
                <div className="profile-avatar">
                  <Icon name="user circle" />
                </div>

                <h3>My Profile</h3>

                <List relaxed className="profile-list">
                  <List.Item>
                    <strong>Name:</strong> {userMe?.name}
                  </List.Item>
                  <List.Item>
                    <strong>Username:</strong> {userMe?.username}
                  </List.Item>
                  <List.Item>
                    <strong>Email:</strong> {userMe?.email}
                  </List.Item>
                </List>
              </div>
            </Modal.Content>
          </Modal>
        </Container>
      </div>
  )
}

export default UserPage