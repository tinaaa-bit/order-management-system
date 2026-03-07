import React, { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message, Header } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { parseJwt, handleLogError } from '../misc/Helpers'

function Login() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)

  if (isLoggedIn) {
    const user = Auth.getUser()
    const role = user?.data?.rol?.[0]

    if (role === 'ADMIN') {
      return <Navigate to="/adminpage" replace />
    }

    if (role === 'USER') {
      return <Navigate to="/userpage" replace />
    }

    return <Navigate to="/" replace />
  }

  const handleInputChange = (e, { name, value }) => {
    if (name === 'username') {
      setUsername(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password)) {
      setIsError(true)
      return
    }

    try {
      const response = await orderApi.authenticate(username, password)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setIsError(false)
    } catch (error) {
      handleLogError(error)
      setIsError(true)
    }
  }

  return (
      <Grid textAlign='center' style={{ marginTop: '4rem' }}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='violet' textAlign='center'>
            Login to your account
          </Header>

          <Form size='large' onSubmit={handleSubmit}>
            <Segment>
              <Form.Input
                  fluid
                  autoFocus
                  name='username'
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={username}
                  onChange={handleInputChange}
              />
              <Form.Input
                  fluid
                  name='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  value={password}
                  onChange={handleInputChange}
              />
              <Button color='violet' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>

          <Message>
            Don&apos;t have an account?{' '}
            <NavLink to="/signup">Sign Up</NavLink>
          </Message>

          {isError && (
              <Message negative>
                The username or password provided are incorrect!
              </Message>
          )}
        </Grid.Column>
      </Grid>
  )
}

export default Login