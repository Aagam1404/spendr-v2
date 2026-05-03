// Admin.jsx - Admin panel page

import { useState, useEffect } from 'react'
import { getAdminUsers, getAdminActivity, getAdminExpenses } from '../services/api'

const fmt     = (n) => '$' + parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const ACTION_BADGE = {
  login:          'badge-green',
  register:       'badge-blue',
  create_expense: 'badge-blue',
  update_expense: 'badge badge-blue',
  delete_expense: 'badge-red',
}

export default function Admin({ onToast }) {
  const [tab,       setTab]       = useState('users')
  const [users,     setUsers]     = useState([])
  const [activity,  setActivity]  = useState([])
  const [expenses,  setExpenses]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [u, a, e] = await Promise.all([getAdminUsers(), getAdminActivity(), getAdminExpenses()])
        setUsers(u.data)
        setActivity(a.data)
        setExpenses(e.data)
      } catch {
        onToast('Failed to load admin data', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [onToast])

  return (
    <div className="page-wrap">
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Admin Panel</div>
            <div className="section-sub">Manage users and view all activity</div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="cards-grid">
          <div className="card card-accent">
            <div className="card-icon">👥</div>
            <div className="card-label">Total Users</div>
            <div className="card-value">{users.length}</div>
            <div className="card-sub">Registered accounts</div>
          </div>
          <div className="card card-green">
            <div className="card-icon">🧾</div>
            <div className="card-label">Total Expenses</div>
            <div className="card-value">{expenses.length}</div>
            <div className="card-sub">Across all users</div>
          </div>
          <div className="card card-red">
            <div className="card-icon">⚡</div>
            <div className="card-label">Total Activity</div>
            <div className="card-value">{activity.length}</div>
            <div className="card-sub">Logged actions</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f0f0ec', paddingBottom: 0 }}>
          {['users', 'activity', 'expenses'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500,
                color: tab === t ? 'var(--accent-dark)' : 'var(--ink-muted)',
                borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.15s'
              }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="panel" style={{ overflow: 'auto' }}>
          {loading && <div style={{ padding: 20, color: 'var(--ink-muted)' }}><span className="spinner"></span> Loading...</div>}

          {/* Users tab */}
          {!loading && tab === 'users' && (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                    <td>{fmtDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Activity tab */}
          {!loading && tab === 'activity' && (
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Action</th><th>Description</th><th>Time</th></tr>
              </thead>
              <tbody>
                {activity.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{a.users?.name || '—'}</td>
                    <td><span className={`badge ${ACTION_BADGE[a.action] || 'badge-user'}`}>{a.action}</span></td>
                    <td>{a.description}</td>
                    <td>{fmtDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Expenses tab */}
          {!loading && tab === 'expenses' && (
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Title</th><th>Category</th><th>Amount</th><th>Date</th></tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{e.users?.name || '—'}</td>
                    <td>{e.title}</td>
                    <td>{e.category}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(e.amount)}</td>
                    <td>{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}