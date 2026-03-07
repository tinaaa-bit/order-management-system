import React, { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message, Header } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { parseJwt, handleLogError } from '../misc/Helpers'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
    } else if (name === 'name') {
      setName(value)
    } else if (name === 'email') {
      setEmail(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password && name && email)) {
      setIsError(true)
      setErrorMessage('Please fill in all fields.')
      return
    }

    const user = { username, password, name, email }

    try {
      const response = await orderApi.signup(user)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setName('')
      setEmail('')
      setIsError(false)
      setErrorMessage('')
    } catch (error) {
      handleLogError(error)

      let message = 'Invalid fields'

      if (error.response && error.response.data) {
        const errorData = error.response.data

        if (errorData.status === 409) {
          message = errorData.message
        } else if (errorData.status === 400 && errorData.errors?.length > 0) {
          message = errorData.errors[0].defaultMessage
        }
      }

      setIsError(true)
      setErrorMessage(message)
    }
  }

  return (
      <Grid textAlign='center' style={{ marginTop: '4rem' }}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='violet' textAlign='center'>
            Create your account
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
              <Form.Input
                  fluid
                  name='name'
                  icon='address card'
                  iconPosition='left'
                  placeholder='Name'
                  value={name}
                  onChange={handleInputChange}
              />
              <Form.Input
                  fluid
                  name='email'
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  value={email}
                  onChange={handleInputChange}
              />
              <Button color='violet' fluid size='large'>
                Sign Up
              </Button>
            </Segment>
          </Form>

          <Message>
            Already have an account?{' '}
            <NavLink to="/login">Login</NavLink>
          </Message>

          {isError && <Message negative>{errorMessage}</Message>}
        </Grid.Column>
      </Grid>
  )
}

export default Signup