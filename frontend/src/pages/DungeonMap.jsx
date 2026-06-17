import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDungeons } from '../api/dungeons'
import SystemPanel from '../components/system/SystemPanel'

const DungeonMap = () => {
  const [dungeons, setDungeons] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadDungeons = async () => {
      setLoading(true)
      try {
        const response = await getDungeons()
        if (mounted) {
          setDungeons(response.data.dungeons)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Failed to load dungeons', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDungeons()
    const interval = window.setInterval(loadDungeons, 20000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Dungeon Map</p>
              <h1 className="text-4xl font-semibold text-white">Active Gates</h1>
              <p className="mt-2 text-slate-400">Track dungeon progress and venture deeper into your productivity quests.</p>
            </div>
            <Link to="/dungeons/create" className="inline-flex items-center justify-center rounded-3xl bg-system-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90">
              + New Dungeon
            </Link>
          </div>
        </SystemPanel>

        {loading ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Loading dungeons…</div>
        ) : dungeons.length === 0 ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">No dungeons found. Create your first gate to begin.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {dungeons.map((dungeon) => (
              <Link key={dungeon.id} to={`/dungeons/${dungeon.id}`} className="group rounded-3xl border border-system-border bg-[#061323] p-6 transition hover:border-system-blue">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{dungeon.title}</h2>
                    <p className="mt-2 text-slate-400">{dungeon.description}</p>
                  </div>
                  <span className="rounded-full bg-system-blue/10 px-3 py-1 text-sm text-system-blue">{dungeon.rank}</span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-sm uppercase text-slate-400">Status</p>
                    <p className="mt-1 text-white">{dungeon.status}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase text-slate-400">Progress</p>
                    <p className="mt-1 text-white">{dungeon.completedTasks} / {dungeon.totalTasks}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase text-slate-400">Reward</p>
                    <p className="mt-1 text-system-gold">{dungeon.xpReward} XP</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DungeonMap
