// Dashboard.jsx - Main expense tracking page

import { useState, useEffect, useCallback } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/api'

// ─── CATEGORY CONFIG ──────────────────────────────────────────
const CATEGORIES = [
  { label: 'Food',          value: '🍔 Food',          bg: 'bg-food',          color: '#f4a843' },
  { label: 'Travel',        value: '✈️ Travel',        bg: 'bg-travel',        color: '#4a90d9' },
  { label: 'Shopping',      value: '🛍️ Shopping',      bg: 'bg-shopping',      color: '#a855f7' },
  { label: 'Bills',         value: '🏠 Bills',         bg: 'bg-bills',         color: '#4ade80' },
  { label: 'Health',        value: '💊 Health',        bg: 'bg-health',        color: '#f87171' },
  { label: 'Entertainment', value: '🎬 Entertainment', bg: 'bg-entertainment', color: '#22d3ee' },
  { label: 'Education',     value: '📚 Education',     bg: 'bg-education',     color: '#fbbf24' },
  { label: 'Other',         value: '🗂️ Other',         bg: 'bg-other',         color: '#94a3b8' },
]

const getCatMeta = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[7]
const getEmoji   = (cat) => cat.split(' ')[0]
const fmt        = (n)   => '$' + parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const fmtDate    = (d)   => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ─── EMPTY FORM STATE ─────────────────────────────────────────
const emptyForm = { title: '', amount: '', date: new Date().toISOString().split('T')[0], category: '🍔 Food' }

export default function Dashboard({ user, onToast }) {
  const [expenses,    setExpenses]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterCat,   setFilterCat]   = useState('')
  const [sortBy,      setSortBy]      = useState('newest')
  const [budget,      setBudget]      = useState(() => parseFloat(localStorage.getItem('spendr_budget') || '0'))
  const [budgetInput, setBudgetInput] = useState('')
  const [showModal,   setShowModal]   = useState(false)
  const [editingExp,  setEditingExp]  = useState(null)
  const [form,        setForm]        = useState(emptyForm)
  const [saving,      setSaving]      = useState(false)

  // Load expenses from API
  const loadExpenses = useCallback(async () => {
    try {
      const res = await getExpenses()
      setExpenses(res.data)
    } catch {
      onToast('Failed to load expenses', 'error')
    } finally {
      setLoading(false)
    }
  }, [onToast])

  useEffect(() => { loadExpenses() }, [loadExpenses])

  // Filter to current month only
  const now = new Date()
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Summary calculations
  const total   = thisMonth.reduce((s, e) => s + parseFloat(e.amount), 0)
  const biggest = thisMonth.length > 0 ? thisMonth.reduce((a, b) => parseFloat(a.amount) > parseFloat(b.amount) ? a : b) : null

  // Category totals for chart
  const catTotals = {}
  thisMonth.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + parseFloat(e.amount) })
  const chartData = Object.entries(catTotals).map(([name, value]) => ({ name, value, color: getCatMeta(name).color }))

  // Filter and sort expenses
  const filtered = expenses
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) && (filterCat ? e.category === filterCat : true))
    .sort((a, b) => {
      if (sortBy === 'newest')  return new Date(b.date) - new Date(a.date)
      if (sortBy === 'oldest')  return new Date(a.date) - new Date(b.date)
      if (sortBy === 'highest') return parseFloat(b.amount) - parseFloat(a.amount)
      if (sortBy === 'lowest')  return parseFloat(a.amount) - parseFloat(b.amount)
    })

  // ── HANDLERS ────────────────────────────────────────────────
  const openAdd = () => { setForm(emptyForm); setEditingExp(null); setShowModal(true) }

  const openEdit = (exp) => {
    setForm({ title: exp.title, amount: exp.amount, date: exp.date, category: exp.category })
    setEditingExp(exp)
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingExp(null); setForm(emptyForm) }

  const handleSave = async () => {
    if (!form.title || !form.amount || !form.date) { onToast('Please fill in all fields', 'error'); return }
    if (parseFloat(form.amount) <= 0)              { onToast('Amount must be greater than 0', 'error'); return }

    setSaving(true)
    try {
      if (editingExp) {
        await updateExpense(editingExp.id, { ...form, amount: parseFloat(form.amount) })
        onToast('Expense updated!', 'success')
      } else {
        await createExpense({ ...form, amount: parseFloat(form.amount) })
        onToast('Expense added!', 'success')
      }
      closeModal()
      loadExpenses()
    } catch {
      onToast('Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await deleteExpense(id)
      onToast('Expense deleted', 'success')
      loadExpenses()
    } catch {
      onToast('Failed to delete', 'error')
    }
  }

  const saveBudget = () => {
    const val = parseFloat(budgetInput)
    if (!val || val <= 0) { onToast('Enter a valid budget', 'error'); return }
    setBudget(val)
    localStorage.setItem('spendr_budget', val)
    setBudgetInput('')
    onToast('Budget saved!', 'success')
  }

  const budgetPct  = budget > 0 ? Math.min((total / budget) * 100, 100) : 0
  const budgetLeft = budget - total

  return (
    <div className="page-wrap">

      {/* ── OVERVIEW CARDS ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Overview</div>
            <div className="section-sub">{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>
          <button className="btn-add" onClick={openAdd}>＋ Add Expense</button>
        </div>

        <div className="cards-grid">
          <div className="card card-accent">
            <div className="card-icon">💸</div>
            <div className="card-label">Total Spent</div>
            <div className="card-value">{fmt(total)}</div>
            <div className="card-sub">{thisMonth.length} expense{thisMonth.length !== 1 ? 's' : ''} this month</div>
          </div>
          <div className="card card-green">
            <div className="card-icon">✓</div>
            <div className="card-label">Budget Left</div>
            <div className="card-value">{budget > 0 ? fmt(Math.abs(budgetLeft)) : '—'}</div>
            <div className="card-sub">{budget > 0 ? (budgetLeft >= 0 ? 'remaining this month' : 'over budget!') : 'Set a budget below'}</div>
            {budget > 0 && (
              <div className="budget-bar-wrap">
                <div className="budget-bar" style={{ width: budgetPct + '%' }}></div>
              </div>
            )}
          </div>
          <div className="card card-red">
            <div className="card-icon">↑</div>
            <div className="card-label">Biggest Expense</div>
            <div className="card-value">{biggest ? fmt(biggest.amount) : '—'}</div>
            <div className="card-sub">{biggest ? biggest.title : 'No expenses yet'}</div>
          </div>
        </div>
      </section>

      {/* ── CHART + BREAKDOWN ── */}
      <section className="section">
        <div className="two-col">
          <div className="panel">
            <div className="panel-title">Spending by Category</div>
            <div className="chart-wrap">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val) => fmt(val)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty" style={{ padding: '30px 0' }}>
                  <div className="empty-icon">📊</div>
                  <div className="empty-sub">No data yet</div>
                </div>
              )}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Category Breakdown</div>
            <div className="cat-list">
              {chartData.length === 0 && <div className="empty-sub" style={{ color: 'var(--ink-muted)', fontSize: 13 }}>No expenses this month</div>}
              {[...chartData].sort((a, b) => b.value - a.value).map((item) => {
                const pct = total > 0 ? (item.value / total) * 100 : 0
                return (
                  <div className="cat-row" key={item.name}>
                    <div className={`cat-icon-sm ${getCatMeta(item.name).bg}`}>{getEmoji(item.name)}</div>
                    <div className="cat-info">
                      <div className="cat-name">{item.name.replace(/^\S+\s/, '')}</div>
                      <div className="cat-bar-track">
                        <div className="cat-bar-fill" style={{ width: pct + '%', background: item.color }}></div>
                      </div>
                    </div>
                    <div className="cat-amount">{fmt(item.value)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUDGET ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Monthly Budget</div>
            <div className="section-sub">Set and track your spending limit</div>
          </div>
        </div>
        <div className="budget-row">
          <div className="panel">
            <div className="panel-title">Set Budget</div>
            <div className="budget-input-row">
              <input className="form-input" type="number" min="0" step="10" placeholder="e.g. 1500"
                value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} style={{ margin: 0 }} />
              <button className="btn-add" onClick={saveBudget}>Save</button>
            </div>
            {budget > 0 && <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 8 }}>Current: {fmt(budget)}</div>}
          </div>
          <div className="panel">
            <div className="panel-title">
              This Month's Progress
              <span className="budget-amounts">Spent <span>{fmt(total)}</span> of <span>{fmt(budget)}</span></span>
            </div>
            <div className="big-bar-track">
              <div className={`big-bar-fill ${budgetPct >= 90 ? 'warning' : budgetPct <= 60 ? 'ok' : ''}`}
                style={{ width: budgetPct + '%' }}></div>
            </div>
            <div className="budget-meta">
              <span>{budgetPct.toFixed(0)}% used</span>
              <span>{budget > 0 ? (budgetLeft >= 0 ? `${fmt(budgetLeft)} remaining` : `${fmt(Math.abs(budgetLeft))} over budget`) : 'No budget set'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL EXPENSES ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">All Expenses</div>
            <div className="section-sub">Your full transaction history</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search expenses…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>

        <div className="expense-list">
          {loading && <div style={{ padding: 20, color: 'var(--ink-muted)' }}><span className="spinner"></span></div>}
          {!loading && filtered.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No expenses found</div>
              <div className="empty-sub">Try a different search or add your first expense</div>
            </div>
          )}
          {filtered.map(e => (
            <div className="expense-item" key={e.id}>
              <div className={`exp-icon ${getCatMeta(e.category).bg}`}>{getEmoji(e.category)}</div>
              <div className="exp-info">
                <div className="exp-title">{e.title}</div>
                <div className="exp-meta">{fmtDate(e.date)} · {e.category.replace(/^\S+\s/, '')}</div>
              </div>
              <div className="exp-amount">{fmt(e.amount)}</div>
              <div className="exp-actions">
                <button className="btn-icon btn-edit"   onClick={() => openEdit(e)}     title="Edit">✏️</button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(e.id)} title="Delete">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editingExp ? 'Edit Expense' : 'Add Expense'}</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label className="form-label">What did you spend on?</label>
                <input className="form-input" placeholder="e.g. Grocery run…"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00"
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date"
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group form-group-full">
                <label className="form-label">Category</label>
                <div className="cat-picker">
                  {CATEGORIES.map(c => (
                    <div key={c.value} className={`cat-option ${form.category === c.value ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, category: c.value })}>
                      <span style={{ fontSize: 20 }}>{c.value.split(' ')[0]}</span>
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, width: 'auto' }}>
                {saving ? <span className="spinner"></span> : (editingExp ? 'Save Changes' : '💾 Save Expense')}
              </button>
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}