import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ms_token')
      localStorage.removeItem('ms_user')
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

export default api
