import React, { useEffect, useMemo, useState } from 'react'
import QuestCard from '../components/quests/QuestCard'
import { getQuests } from '../api/quests'

const tabs = ['All', 'Daily', 'Active', 'Completed', 'Failed']
const sortOptions = ['Difficulty', 'Due Date', 'XP Reward']

const QuestBoard = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [sortBy, setSortBy] = useState('Difficulty')
  const [query, setQuery] = useState('')
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadQuests = async () => {
      setLoading(true)
      try {
        const response = await getQuests()
        if (mounted) {
          setQuests(response.data.quests || [])
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Unable to fetch quests', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadQuests()
    const interval = window.setInterval(loadQuests, 20000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  const filteredQuests = useMemo(() => {
    let filtered = [...quests]

    if (activeTab === 'Daily') {
      filtered = filtered.filter((quest) => quest.isDaily)
    } else if (activeTab === 'Active') {
      filtered = filtered.filter((quest) => quest.status === 'active' || quest.status === 'pending')
    } else if (activeTab === 'Completed') {
      filtered = filtered.filter((quest) => quest.status === 'completed')
    } else if (activeTab === 'Failed') {
      filtered = filtered.filter((quest) => quest.status === 'failed')
    }

    if (query) {
      filtered = filtered.filter((quest) =>
        quest.title.toLowerCase().includes(query.toLowerCase()) ||
        (quest.description || '').toLowerCase().includes(query.toLowerCase()),
      )
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'Difficulty') {
        const order = ['E', 'D', 'C', 'B', 'A', 'S']
        return order.indexOf(a.difficulty) - order.indexOf(b.difficulty)
      }
      if (sortBy === 'Due Date') {
        return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
      }
      return (b.rewardXp || 0) - (a.rewardXp || 0)
    })
  }, [activeTab, sortBy, query, quests])

  return (
    <div className="min-h-screen bg-system-dark text-white">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-system-border bg-system-panel p-6 shadow-system-glow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-system-blue">Quest Board</h1>
              <p className="mt-2 text-slate-300">Manage daily quests, track rewards, and stay on top of your mission list.</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-3xl bg-system-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90">
              + New Quest
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-system-blue text-slate-950 shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                      : 'bg-[#071526] text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  try {
                    const response = await getQuests()
                    setQuests(response.data.quests || [])
                    setLastUpdated(new Date())
                  } catch (error) {
                    console.error('Unable to refresh quests', error)
                  } finally {
                    setLoading(false)
                  }
                }}
                className="rounded-3xl bg-system-blue px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90"
              >
                Refresh
              </button>
              <label className="inline-flex items-center gap-3 rounded-3xl border border-system-border bg-[#071526] px-4 py-2 text-sm text-slate-300">
                <span>Search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a quest"
                  className="w-40 bg-transparent text-white outline-none placeholder:text-slate-500"
                />
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-3xl border border-system-border bg-[#071526] px-4 py-2 text-sm text-white outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-3 text-sm text-slate-400">Last synced: {lastUpdated.toLocaleTimeString()}</div>
          )}
        </section>

        {loading ? (
          <div className="rounded-3xl border border-system-border bg-system-panel p-8 text-center text-slate-300">
            Loading quests...
          </div>
        ) : (
          <section className="grid gap-6 xl:grid-cols-2">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
            ) : (
              <div className="rounded-3xl border border-system-border bg-system-panel p-8 text-center text-slate-300">
                No quests match your filters.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default QuestBoard
