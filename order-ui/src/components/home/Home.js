import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'

function Home() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  if (isLoggedIn) {
    const user = Auth.getUser()
    const role = user?.data?.rol?.[0]

    if (role === 'ADMIN') {
      return <Navigate to="/adminpage" replace />
    }

    if (role === 'USER') {
      return <Navigate to="/userpage" replace />
    }

    return <Navigate to="/login" replace />
  }

  return (
      <Container text style={{ marginTop: '5rem' }}>
        <Segment padded='very' textAlign='center' raised>
          <Icon name='shopping bag' size='huge' color='violet' />
          <Header as='h1' style={{ marginTop: '1rem' }}>
            Welcome to Order-UI
          </Header>
          <p style={{ fontSize: '1.1rem', color: '#555', marginTop: '1rem' }}>
            Manage orders easily with a clean role-based system for users and admins.
          </p>

          <Grid columns={2} stackable style={{ marginTop: '2rem' }}>
            <Grid.Column>
              <Segment padded='very' color='violet'>
                <Header as='h3'>Already have an account?</Header>
                <p>Login and continue to your dashboard.</p>
                <Button as={Link} to="/login" color='violet' size='large' fluid>
                  Login
                </Button>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment padded='very'>
                <Header as='h3'>New here?</Header>
                <p>Create an account and start using the app.</p>
                <Button as={Link} to="/signup" basic color='violet' size='large' fluid>
                  Sign Up
                </Button>
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
  )
}

export default Home