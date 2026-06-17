import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import useHunterStore from '../store/hunterStore'

const initialForm = {
  username: '',
  email: '',
  password: '',
}

const Awakening = () => {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const setHunter = useHunterStore((s) => s.setHunter)

  if (token) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        email: form.email,
        password: form.password,
        username: form.username,
      }

      const response = mode === 'login' ? await login(payload) : await register(payload)
      const tokenValue = response.data.token

      if (tokenValue) {
        localStorage.setItem('token', tokenValue)
      }

      // populate hunter store immediately so UI updates without reload
      if (response.data?.hunter) {
        setHunter(response.data.hunter)
      }

      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to authenticate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-system-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-system-border bg-system-panel p-10 shadow-system-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-system-blue">The System Awaits</p>
            <h1 className="text-4xl font-bold text-white">Awaken as a Hunter</h1>
          </div>
          <div className="inline-flex rounded-3xl border border-system-border bg-[#061323] p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-3xl px-5 py-2 text-sm transition ${
                mode === 'login' ? 'bg-system-blue text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-3xl px-5 py-2 text-sm transition ${
                mode === 'register' ? 'bg-system-blue text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Awaken
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Hunter Name</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Shadow Hunter"
                className="w-full rounded-2xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none transition focus:border-system-blue"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hunter@system.com"
              className="w-full rounded-2xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none transition focus:border-system-blue"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none transition focus:border-system-blue"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-system-blue px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Connecting...' : mode === 'login' ? 'Enter the System' : 'Awaken'}
          </button>
        </form>

        <p className="text-sm text-slate-400">
          {mode === 'login'
            ? 'New hunter? Click Awaken to create your profile.'
            : 'Already have a hunter? Click Enter to log in.'}
        </p>
      </div>
    </div>
  )
}

export default Awakening
