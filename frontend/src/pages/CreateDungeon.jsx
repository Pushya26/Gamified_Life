import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDungeon } from '../api/dungeons'
import SystemPanel from '../components/system/SystemPanel'

const initialForm = {
  title: '',
  description: '',
  rank: 'C',
  xpReward: 800,
  deadline: '',
}

const CreateDungeon = () => {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!form.title.trim()) {
      setError('Dungeon title is required.')
      setLoading(false)
      return
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        rank: form.rank,
        xpReward: Number(form.xpReward),
        deadline: form.deadline || null,
      }

      await createDungeon(payload)
      navigate('/dungeons', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create dungeon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <SystemPanel>
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-system-blue">New Dungeon</p>
            <h1 className="text-4xl font-semibold text-white">Create a New Gate</h1>
            <p className="mt-2 text-slate-400">Build a dungeon challenge and send your hunter deeper into the system.</p>
          </div>
        </SystemPanel>

        <SystemPanel>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <label className="text-sm text-slate-300">Dungeon Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Abyss of Resolve"
                className="w-full rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
              />
            </div>

            <div className="grid gap-3">
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the dungeon objectives and rewards."
                className="min-h-[120px] w-full rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-3">
                <label className="text-sm text-slate-300">Rank</label>
                <select
                  name="rank"
                  value={form.rank}
                  onChange={handleChange}
                  className="rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
                >
                  <option value="C">C</option>
                  <option value="B">B</option>
                  <option value="A">A</option>
                  <option value="S">S</option>
                </select>
              </div>

              <div className="grid gap-3">
                <label className="text-sm text-slate-300">XP Reward</label>
                <input
                  name="xpReward"
                  type="number"
                  value={form.xpReward}
                  onChange={handleChange}
                  className="rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
                />
              </div>

              <div className="grid gap-3">
                <label className="text-sm text-slate-300">Deadline</label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className="rounded-3xl border border-system-border bg-[#061323] px-4 py-3 text-white outline-none focus:border-system-blue"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-system-blue px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Forging Dungeon...' : 'Create Dungeon'}
            </button>
          </form>
        </SystemPanel>
      </div>
    </div>
  )
}

export default CreateDungeon
