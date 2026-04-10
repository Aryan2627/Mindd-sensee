import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Auth() {
  const [tab, setTab]         = useState('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register }   = useAuth()
  const navigate              = useNavigate()

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
        toast.success('Welcome back 🌿')
      } else {
        await register(name, email, password)
        toast.success('Account created 🌿')
      }
      navigate('/chat')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4" style={{ background: '#F0F4F2' }}>
      <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-lg border" style={{ borderColor: 'rgba(107,144,128,0.18)' }}>
        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-7" style={{ background: '#F0F4F2' }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1E2822' : '#8FA396',
                boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.08)' : 'none' }}>
              {t === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        <h2 className="font-serif text-3xl mb-1">{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="text-sm mb-6" style={{ color: '#5A6B62' }}>
          {tab === 'login' ? 'Sign in to continue your wellness journey.' : 'Start your path to better mental wellness.'}
        </p>

        <form onSubmit={handle} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#5A6B62' }}>Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-sage-300"
                style={{ borderColor: 'rgba(107,144,128,0.3)', fontFamily: 'DM Sans' }}
                placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5A6B62' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: 'rgba(107,144,128,0.3)', fontFamily: 'DM Sans' }}
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5A6B62' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: 'rgba(107,144,128,0.3)', fontFamily: 'DM Sans' }}
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-medium mt-1 transition-all"
            style={{ background: loading ? 'var(--sage-light)' : 'var(--sage)' }}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p className="text-xs text-center mt-4" style={{ color: '#8FA396' }}>
          Mind-Sense is not a medical service. Your conversations are private and encrypted.
        </p>
      </div>
    </div>
  )
}
