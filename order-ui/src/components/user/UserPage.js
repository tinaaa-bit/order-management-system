import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Grid, Segment, Header, Icon, List, Loader } from 'semantic-ui-react'
import OrderTable from './OrderTable'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { handleLogError } from '../misc/Helpers'

function UserPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isUser = user?.data?.rol?.[0] === 'USER'

  const [userMe, setUserMe] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [orderDescription, setOrderDescription] = useState('')

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
    if (!trimmedDescription) {
      return
    }

    const order = { description: trimmedDescription }

    try {
      await orderApi.createOrder(user, order)
      await fetchUserMeData()
      setOrderDescription('')
    } catch (error) {
      handleLogError(error)
    }
  }

  if (!isUser) {
    return <Navigate to='/' replace />
  }

  return (
      <Container style={{ marginTop: '2em' }}>
        {isLoading && !userMe ? (
            <Loader active inline='centered' />
        ) : (
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment>
                    <Header as='h2'>
                      <Icon name='user circle' />
                      <Header.Content>My Profile</Header.Content>
                    </Header>

                    <List size='large'>
                      <List.Item>
                        <strong>Name:</strong> {userMe?.name}
                      </List.Item>
                      <List.Item>
                        <strong>Username:</strong> {userMe?.username}
                      </List.Item>
                      <List.Item>
                        <strong>Email:</strong> {userMe?.email}
                      </List.Item>
                      <List.Item>
                        <strong>Role:</strong> {userMe?.role}
                      </List.Item>
                    </List>
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment loading={isLoading}>
                    <OrderTable
                        orders={userMe?.orders || []}
                        orderDescription={orderDescription}
                        handleCreateOrder={handleCreateOrder}
                        handleInputChange={handleInputChange}
                    />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
        )}
      </Container>
  )
}

export default UserPage