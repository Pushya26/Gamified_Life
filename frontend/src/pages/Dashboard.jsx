import React, { useEffect, useState } from 'react'
import SystemPanel from '../components/system/SystemPanel'
import useHunterStore from '../store/hunterStore'
import { getDailyQuests } from '../api/quests'
import { getHunterStatus } from '../api/hunter'

const Dashboard = () => {
  const hunter = useHunterStore((s) => s.hunter)
  const setHunter = useHunterStore((s) => s.setHunter)
  const [dailyQuests, setDailyQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        const [statusRes, questsRes] = await Promise.all([
          getHunterStatus(),
          getDailyQuests(),
        ])

        if (!mounted) return
        setHunter(statusRes.data.hunter)
        setDailyQuests(questsRes.data.quests || [])
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to refresh dashboard data', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    const interval = window.setInterval(loadData, 15000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [setHunter])

  const rank = hunter?.rank || 'D'
  const level = hunter?.level || 1
  const coins = hunter?.coins || 0
  const xp = hunter?.xp || 0
  const xpToNextLevel = hunter?.xpToNextLevel || 1000
  const xpPercent = Math.min(100, Math.round((xp / Math.max(xpToNextLevel, 1)) * 100))

  const activeDungeons = [
    { title: 'Gate of Resolve', progress: 2, total: 4, deadline: '2d', rank: 'C' },
    { title: 'Abyss of Growth', progress: 1, total: 3, deadline: '5d', rank: 'B' },
  ]

  const stats = [
    { label: 'STR', value: hunter?.statStrength || 0, color: 'bg-[#39FF14]' },
    { label: 'AGI', value: hunter?.statAgility || 0, color: 'bg-[#00D4FF]' },
    { label: 'INT', value: hunter?.statIntelligence || 0, color: 'bg-[#A855F7]' },
    { label: 'VIT', value: hunter?.statVitality || 0, color: 'bg-[#F97316]' },
    { label: 'SENSE', value: hunter?.statSense || 0, color: 'bg-[#EAB308]' },
  ]

  const shadowArmy = [
    { name: 'Hydra', streak: 5, awakened: false },
    { name: 'Phantom', streak: 7, awakened: true },
    { name: 'Warden', streak: 3, awakened: false },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-system-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center text-xl text-slate-300">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-system-dark text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Season</p>
              <h1 className="text-4xl font-semibold text-white">Hunter Dashboard</h1>
              <p className="mt-2 text-slate-400">Welcome back, Shadow Hunter. Your army grows stronger with every completed quest.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  try {
                    const statusRes = await getHunterStatus()
                    setHunter(statusRes.data.hunter)
                    setLastUpdated(new Date())
                  } catch (error) {
                    console.error('Failed to refresh stats', error)
                  } finally {
                    setLoading(false)
                  }
                }}
                className="rounded-3xl border border-system-blue bg-system-blue/10 px-4 py-2 text-sm text-system-blue transition hover:bg-system-blue/20"
              >
                Refresh Stats
              </button>
              <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
                <p className="text-sm uppercase text-slate-400">Last refresh</p>
                <p className="mt-2 text-base text-white">{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Pending'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
              <p className="text-sm uppercase text-slate-400">Rank</p>
              <p className="mt-2 text-2xl font-semibold text-system-blue">{rank}</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
              <p className="text-sm uppercase text-slate-400">Level</p>
              <p className="mt-2 text-2xl font-semibold text-white">{level}</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4 text-center">
              <p className="text-sm uppercase text-slate-400">Coins</p>
              <p className="mt-2 text-2xl font-semibold text-system-gold">{coins.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-system-border bg-[#061323] p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>XP Progress</span>
              <span>{xp} / {xpToNextLevel}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-system-blue" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </SystemPanel>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-6">
            <SystemPanel title="Today's Daily Quests">
              <div className="space-y-4">
                {dailyQuests.length === 0 ? (
                  <div className="rounded-3xl border border-system-border bg-[#061323] p-6 text-center text-slate-400">
                    No daily quests available right now.
                  </div>
                ) : (
                  dailyQuests.map((quest) => (
                    <div key={quest.id} className="rounded-3xl border border-system-border bg-[#061323] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{quest.difficulty} • {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString() : 'No due date'}</p>
                        </div>
                        <div className="text-right text-sm text-slate-300">
                          <div>{quest.rewardXp} XP</div>
                          <div className="mt-1 text-system-gold">+ {quest.rewardCoins || 0} coins</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SystemPanel>

            <SystemPanel title="Active Dungeons">
              <div className="space-y-4">
                {activeDungeons.map((dungeon) => (
                  <div key={dungeon.title} className="rounded-3xl border border-system-border bg-[#061323] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{dungeon.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">Deadline in {dungeon.deadline}</p>
                      </div>
                      <span className="rounded-full bg-system-blue/10 px-3 py-1 text-sm text-system-blue">Rank {dungeon.rank}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-system-blue" style={{ width: `${(dungeon.progress / dungeon.total) * 100}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{dungeon.progress} / {dungeon.total} tasks completed</p>
                  </div>
                ))}
              </div>
            </SystemPanel>
          </div>

          <div className="grid gap-6">
            <SystemPanel title="Stats">
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${stat.value * 4}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </SystemPanel>

            <SystemPanel title="Shadow Army">
              <div className="space-y-3">
                {shadowArmy.map((shadow) => (
                  <div
                    key={shadow.name}
                    className={`rounded-3xl border p-4 ${shadow.awakened ? 'border-purple-500 bg-[#1c1033]' : 'border-system-border bg-[#061323]'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{shadow.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">Streak {shadow.streak} days</p>
                      </div>
                      {shadow.awakened ? (
                        <span className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-300">Awakened</span>
                      ) : (
                        <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">Growing</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SystemPanel>
          </div>
        </div>

        <SystemPanel title="Recent System Logs">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-white">[SYSTEM]</p>
              <p className="mt-2">Quest complete: +200 XP</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-white">[SYSTEM]</p>
              <p className="mt-2">Dungeon cleared: Gate of Resolve</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-white">[SYSTEM]</p>
              <p className="mt-2">A shadow has awakened and joined your army.</p>
            </div>
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}

export default Dashboard
