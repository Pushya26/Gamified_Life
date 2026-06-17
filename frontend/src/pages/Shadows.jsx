import React, { useEffect, useState } from 'react'
import { getShadows, createShadow, checkinShadow } from '../api/shadows'
import SystemPanel from '../components/system/SystemPanel'

const Shadows = () => {
  const [shadows, setShadows] = useState([])
  const [form, setForm] = useState({ habitName: '', icon: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadShadows = async () => {
      try {
        const response = await getShadows()
        setShadows(response.data.shadows)
      } catch (err) {
        console.error('Unable to load shadows', err)
      } finally {
        setLoading(false)
      }
    }

    loadShadows()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.habitName.trim()) {
      setError('Habit name is required.')
      return
    }

    setSaving(true)
    try {
      const response = await createShadow(form)
      setShadows((current) => [response.data.shadow, ...current])
      setForm({ habitName: '', icon: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create a shadow habit.')
    } finally {
      setSaving(false)
    }
  }

  const handleCheckin = async (id) => {
    setActionId(id)
    try {
      const response = await checkinShadow(id)
      setShadows((current) => current.map((item) => (item.id === id ? response.data.shadow : item)))
    } catch (err) {
      console.error('Check-in failed', err)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Shadow Army</p>
            <h1 className="text-4xl font-semibold text-white">Manage Your Shadow Habits</h1>
            <p className="mt-2 text-slate-400">Create habits, track daily check-ins, and awaken your shadow companions.</p>
          </div>
        </SystemPanel>

        <SystemPanel title="Summon a New Shadow">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm text-slate-300">Habit Name</label>
              <input
                name="habitName"
                value={form.habitName}
                onChange={handleChange}
                placeholder="Hydration Ritual"
                className="w-full rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-slate-300">Symbolic Icon</label>
              <input
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="🌀"
                className="w-full rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
              />
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-system-blue px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Summoning...' : 'Summon Shadow'}
            </button>
          </form>
        </SystemPanel>

        {loading ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Loading shadows…</div>
        ) : shadows.length === 0 ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">No shadows awakened yet. Create one to start your streak.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {shadows.map((shadow) => (
              <div key={shadow.id} className="rounded-3xl border border-system-border bg-[#061323] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{shadow.icon || '👤'} {shadow.habitName}</h2>
                    <p className="mt-2 text-slate-400">Streak: {shadow.streakCount} days</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm ${shadow.isAwakened ? 'bg-purple-500/10 text-purple-300' : 'bg-slate-700 text-slate-300'}`}>
                    {shadow.isAwakened ? 'Awakened' : 'Growing'}
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-300">
                    Last check-in: {shadow.lastChecked ? new Date(shadow.lastChecked).toLocaleDateString() : 'Never'}
                  </div>
                  <button
                    type="button"
                    disabled={actionId === shadow.id}
                    onClick={() => handleCheckin(shadow.id)}
                    className="rounded-3xl bg-system-blue px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionId === shadow.id ? 'Checking in…' : 'Check in'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shadows
