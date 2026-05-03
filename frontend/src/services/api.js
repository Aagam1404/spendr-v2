// api.js - All API calls to the FastAPI backend

import axios from 'axios'

// Base URL for all API requests
const API = axios.create({ baseURL: 'http://127.0.0.1:8000' })

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── AUTH ───────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser    = (data) => API.post('/auth/login', data)

// ─── EXPENSES ───────────────────────────────────────────────
export const getExpenses    = ()         => API.get('/expenses/')
export const createExpense  = (data)     => API.post('/expenses/', data)
export const updateExpense  = (id, data) => API.put(`/expenses/${id}`, data)
export const deleteExpense  = (id)       => API.delete(`/expenses/${id}`)

// ─── ADMIN ──────────────────────────────────────────────────
export const getAdminUsers    = () => API.get('/admin/users')
export const getAdminActivity = () => API.get('/admin/activity')
export const getAdminExpenses = () => API.get('/admin/expenses')