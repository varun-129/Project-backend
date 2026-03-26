import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import { getApiError } from '../utils/helpers'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <span className="logo-icon-lg">▶</span>
          <span className="display" style={{ fontSize: 28, letterSpacing: '0.06em' }}>VIDEOTUBE</span>
        </div>

        <h1 className="auth-heading display">SIGN IN</h1>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 28 }}>
          Welcome back — let's pick up where you left off.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="label">Email or Username</label>
            <div className="input-wrap input-icon-left">
              <FiMail className="icon" size={15} />
              <input
                className="input"
                type="text"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="input-wrap input-icon-left">
              <FiLock className="icon" size={15} />
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner spinner-sm" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="text-dim" style={{ fontSize: 14 }}>Don't have an account?</span>
          <Link to="/register" className="auth-link">Create one →</Link>
        </div>
      </div>
    </div>
  )
}
