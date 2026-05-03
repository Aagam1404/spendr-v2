 // Login.jsx - Login page

import { useState } from 'react'
import { loginUser } from '../services/api'

/**
 * Login form — email and password
 * On success stores token and user info in localStorage
 */
export default function Login({ onLogin, onSwitchToRegister }) {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser(form)
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-dot"></span> SpendR
        </div>
        <p className="auth-subtitle">Welcome back — sign in to your account</p>

        {/* Error message */}
        {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        {/* Switch to register */}
        <div className="auth-footer">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister}>Create one</button>
        </div>

      </div>
    </div>
  )
}