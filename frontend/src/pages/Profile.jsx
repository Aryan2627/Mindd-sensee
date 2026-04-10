import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

function Toggle({ defaultChecked }) {
  const [on, setOn] = useState(defaultChecked || false)
  return (
    <button onClick={() => setOn(p => !p)}
      className="relative w-11 h-6 rounded-full transition-all"
      style={{ background: on ? 'var(--sage)' : 'rgba(107,144,128,0.25)' }}>
      <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
        style={{ left: on ? '24px' : '4px' }} />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-6 mb-4" style={{ borderColor: 'rgba(107,144,128,0.18)' }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#8FA396' }}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, valueStyle }) {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-0" style={{ borderColor: 'rgba(107,144,128,0.12)' }}>
      <span className="text-sm" style={{ color: '#5A6B62' }}>{label}</span>
      <span className="text-sm font-medium" style={valueStyle}>{value}</span>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <main className="pt-20 pb-16" style={{ background: 'var(--warm)' }}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-18 h-18 rounded-full flex items-center justify-center font-serif text-3xl text-white flex-shrink-0"
            style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--sage), var(--sage-light))' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="font-serif text-3xl">{user?.name || 'User'}</h2>
            <p className="text-sm mt-1" style={{ color: '#5A6B62' }}>Member since March 2026 · 12 sessions completed</p>
          </div>
        </div>

        <Section title="Account details">
          <Field label="Name"     value={user?.name  || '—'} />
          <Field label="Email"    value={user?.email || '—'} />
          <Field label="Timezone" value="Asia/Kolkata (IST)" />
          <Field label="Language" value="English" />
        </Section>

        <Section title="Preferences">
          {[
            ['Dark mode',                false],
            ['Daily check-in reminder',  true],
            ['Push notifications',       true],
            ['Voice input',              false],
          ].map(([label, def]) => (
            <div key={label} className="flex justify-between items-center py-3 border-b last:border-0"
              style={{ borderColor: 'rgba(107,144,128,0.12)' }}>
              <span className="text-sm">{label}</span>
              <Toggle defaultChecked={def} />
            </div>
          ))}
        </Section>

        <Section title="Safety & Support">
          <Field label="Emergency contact" value="Not set" />
          <Field label="iCall helpline"    value="9152987821"      valueStyle={{ color: 'var(--sage)' }} />
          <Field label="Vandrevala"        value="1860-2662-345"   valueStyle={{ color: 'var(--sage)' }} />
          <div className="pt-4 text-xs leading-relaxed" style={{ color: '#8FA396' }}>
            ⚠️ Mind-Sense is an AI wellness tool and is <strong>not</strong> a replacement for professional mental health support. Please seek qualified help for clinical concerns.
          </div>
        </Section>

        <Section title="Data & Privacy">
          <Field label="Export my data"
            value="Download JSON →"
            valueStyle={{ color: 'var(--sage)', cursor: 'pointer' }} />
          <div className="flex justify-between items-center py-3" style={{ borderColor: 'rgba(107,144,128,0.12)' }}>
            <span className="text-sm" style={{ color: '#5A6B62' }}>Delete account</span>
            <button onClick={() => toast('Contact support to delete your account.')}
              className="text-sm font-medium" style={{ color: '#D4605A' }}>Delete →</button>
          </div>
        </Section>

        <button onClick={handleLogout}
          className="w-full py-3.5 rounded-xl border text-sm font-medium transition-all hover:bg-red-50"
          style={{ borderColor: 'rgba(212,96,90,0.3)', color: '#D4605A' }}>
          Sign out
        </button>
      </div>
    </main>
  )
}
