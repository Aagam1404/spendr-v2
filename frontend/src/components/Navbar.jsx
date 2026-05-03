// Navbar.jsx - Top navigation bar

import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Sticky top navbar with logo, navigation links, and logout button
 * Shows admin link only if the logged in user is an admin
 */
export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <div className="logo">
          <span className="logo-dot"></span> SpendR
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button className={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          {user?.role === 'admin' && (
            <button className={isActive('/admin')} onClick={() => navigate('/admin')}>
              Admin Panel
            </button>
          )}
        </nav>

        {/* User info and logout */}
        <div className="nav-user">
          <span>👋 {user?.name}</span>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>

      </div>
    </header>
  )
}