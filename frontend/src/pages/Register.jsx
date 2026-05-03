// Register.jsx - Registration page

import { useState } from 'react'
import { registerUser } from '../services/api'

/**
 * Registration form — name, email, and password
 * On success stores token and user info in localStorage
 */
export default function Register({ onLogin, onSwitchToLogin }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await registerUser(form)
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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
        <p className="auth-subtitle">Create your account and start tracking</p>

        {/* Error message */}
        {error && <p className="form-error" style={{ marginBottom: 16 }}>⚠️ {error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        {/* Switch to login */}
        <div className="auth-footer">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin}>Sign in</button>
        </div>

      </div>
    </div>
  )
}