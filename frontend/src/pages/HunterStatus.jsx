import React, { useEffect, useState } from 'react'
import { getHunterStatus, getLeaderboard } from '../api/hunter'
import SystemPanel from '../components/system/SystemPanel'

const HunterStatus = () => {
  const [hunter, setHunter] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const [statusRes, leaderboardRes] = await Promise.all([getHunterStatus(), getLeaderboard()])
        setHunter(statusRes.data.hunter)
        setLeaderboard(leaderboardRes.data.leaderboard)
      } catch (error) {
        console.error('Failed to load hunter status', error)
      } finally {
        setLoading(false)
      }
    }

    loadStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-system-dark p-6 text-white">
        <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Loading hunter profile…</div>
      </div>
    )
  }

  if (!hunter) {
    return (
      <div className="min-h-screen bg-system-dark p-6 text-white">
        <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Hunter profile not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Hunter Profile</p>
              <h1 className="text-4xl font-semibold text-white">{hunter.name}</h1>
              <p className="mt-2 text-slate-400">Your current champion stats and leaderboard position.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
                <p className="text-sm uppercase text-slate-400">Level</p>
                <p className="mt-2 text-2xl font-semibold text-white">{hunter.level}</p>
              </div>
              <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
                <p className="text-sm uppercase text-slate-400">Rank</p>
                <p className="mt-2 text-2xl font-semibold text-system-blue">{hunter.rank}</p>
              </div>
              <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
                <p className="text-sm uppercase text-slate-400">Coins</p>
                <p className="mt-2 text-2xl font-semibold text-system-gold">{hunter.coins?.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-system-border bg-[#061323] p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>XP Progress</span>
              <span>{hunter.xp} / {hunter.xpToNextLevel}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-system-blue" style={{ width: `${Math.min(100, Math.round((hunter.xp / Math.max(hunter.xpToNextLevel, 1)) * 100))}%` }} />
            </div>
          </div>
        </SystemPanel>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <SystemPanel title="Core Stats">
            <div className="grid gap-4 sm:grid-cols-2">
              {['statStrength', 'statAgility', 'statIntelligence', 'statVitality', 'statSense'].map((field) => (
                <div key={field} className="rounded-3xl border border-system-border bg-[#061323] p-4">
                  <p className="text-sm uppercase text-slate-400">{field.replace('stat', '')}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{hunter[field] ?? 0}</p>
                </div>
              ))}
            </div>
          </SystemPanel>

          <SystemPanel title="Leaderboard">
            <div className="space-y-3 text-sm">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between rounded-3xl border border-system-border bg-[#061323] p-4">
                  <div>
                    <p className="font-semibold text-white">{index + 1}. {entry.username}</p>
                    <p className="text-slate-400">Level {entry.level} • Rank {entry.rank}</p>
                  </div>
                  <span className="rounded-full bg-system-blue/10 px-3 py-1 text-sm text-system-blue">{entry.coins}</span>
                </div>
              ))}
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  )
}

export default HunterStatus
