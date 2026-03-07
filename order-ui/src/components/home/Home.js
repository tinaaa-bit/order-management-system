import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../misc/OrderApi'
import { parseJwt, handleLogError } from '../misc/Helpers'
import './AuthPages.css'

function Home() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [mode, setMode] = useState('login')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupError, setSignupError] = useState('')

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!(loginUsername && loginPassword)) {
      setLoginError('Please fill in all fields.')
      return
    }

    try {
      const response = await orderApi.authenticate(loginUsername, loginPassword)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setLoginUsername('')
      setLoginPassword('')
      setLoginError('')
    } catch (error) {
      handleLogError(error)
      setLoginError('The username or password provided are incorrect.')
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    if (!(signupUsername && signupPassword && signupName && signupEmail)) {
      setSignupError('Please fill in all fields.')
      return
    }

    const user = {
      username: signupUsername,
      password: signupPassword,
      name: signupName,
      email: signupEmail
    }

    try {
      const response = await orderApi.signup(user)
      const { accessToken } = response.data
      const data = parseJwt(accessToken)
      const authenticatedUser = { data, accessToken }

      Auth.userLogin(authenticatedUser)

      setSignupUsername('')
      setSignupPassword('')
      setSignupName('')
      setSignupEmail('')
      setSignupError('')
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

      setSignupError(message)
    }
  }

  return (
      <div className="auth-page">
        <div className="auth-card compact-auth-card">
          <div className="auth-form-section">
            <div className="auth-form-box">
              <div className="auth-switch">
                <button
                    className={mode === 'login' ? 'auth-switch-btn active' : 'auth-switch-btn'}
                    onClick={() => {
                      setMode('login')
                      setLoginError('')
                      setSignupError('')
                    }}
                    type="button"
                >
                  Login
                </button>
                <button
                    className={mode === 'signup' ? 'auth-switch-btn active' : 'auth-switch-btn'}
                    onClick={() => {
                      setMode('signup')
                      setLoginError('')
                      setSignupError('')
                    }}
                    type="button"
                >
                  Sign Up
                </button>
              </div>

              {mode === 'login' ? (
                  <>
                    <h2 className="auth-title">Sign In</h2>
                    <p className="auth-subtext">Enter your account details to continue.</p>

                    <form onSubmit={handleLoginSubmit} className="auth-form">
                      <div className="auth-input-group">
                        <label>USERNAME</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                      </div>

                      <div className="auth-input-group">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="auth-submit-btn">
                        Sign In
                      </button>
                    </form>

                    {loginError && <div className="auth-error-box">{loginError}</div>}
                  </>
              ) : (
                  <>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtext">Create your account and get started.</p>

                    <form onSubmit={handleSignupSubmit} className="auth-form">
                      <div className="auth-input-group">
                        <label>USERNAME</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                        />
                      </div>

                      <div className="auth-input-group">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>

                      <div className="auth-input-group">
                        <label>NAME</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>

                      <div className="auth-input-group">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="auth-submit-btn">
                        Sign Up
                      </button>
                    </form>

                    {signupError && <div className="auth-error-box">{signupError}</div>}
                  </>
              )}
            </div>
          </div>

          <div className="auth-side-panel">
            <div className="auth-side-content">
              <h2>{mode === 'login' ? 'Welcome back' : 'Hello there'}</h2>
              <p>
                {mode === 'login'
                    ? 'Login to continue managing your orders in one place.'
                    : 'Create an account to access your dashboard and manage orders easily.'}
              </p>
              <button
                  type="button"
                  className="auth-side-btn"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login')
                    setLoginError('')
                    setSignupError('')
                  }}
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home