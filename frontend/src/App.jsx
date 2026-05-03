// App.jsx - Root component, handles auth state and routing

import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar    from './components/Navbar'
import Toast     from './components/Toast'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin     from './pages/Admin'

export default function App() {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('user')  || 'null'))
  const [toast, setToast] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = (data) => {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user',  JSON.stringify({
      name:  data.name,
      email: data.email,
      role:  data.role,
      id:    data.user_id
    }))
    setUser({ name: data.name, email: data.email, role: data.role, id: data.user_id })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  // ── IF NOT LOGGED IN → SHOW AUTH SCREENS ──────────────────
  if (!user) {
    return (
      <div>
        {showRegister
          ? <Register onLogin={handleLogin} onSwitchToLogin={() => setShowRegister(false)} />
          : <Login    onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
        }
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // ── IF LOGGED IN → SHOW MAIN APP ───────────────────────────
  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/"          element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard user={user} onToast={showToast} />} />
        <Route path="/admin"     element={
          user.role === 'admin'
            ? <Admin onToast={showToast} />
            : <Navigate to="/dashboard" replace />
        } />
        <Route path="*"          element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </BrowserRouter>
  )
}