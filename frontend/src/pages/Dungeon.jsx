import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDungeon, completeDungeonTask, clearDungeon } from '../api/dungeons'
import SystemPanel from '../components/system/SystemPanel'

const Dungeon = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dungeon, setDungeon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [taskLoading, setTaskLoading] = useState(false)

  useEffect(() => {
    const loadDungeon = async () => {
      try {
        const response = await getDungeon(id)
        setDungeon(response.data.dungeon)
      } catch (error) {
        console.error('Failed to load dungeon', error)
      } finally {
        setLoading(false)
      }
    }

    loadDungeon()
  }, [id])

  const handleTaskComplete = async (taskId) => {
    setTaskLoading(true)
    try {
      const response = await completeDungeonTask(id, taskId)
      setDungeon(response.data.dungeon)
    } catch (error) {
      console.error('Unable to complete task', error)
    } finally {
      setTaskLoading(false)
    }
  }

  const handleClear = async () => {
    setTaskLoading(true)
    try {
      await clearDungeon(id)
      navigate('/dungeons')
    } catch (error) {
      console.error('Unable to clear dungeon', error)
    } finally {
      setTaskLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-system-dark p-6 text-white">
        <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Loading dungeon...</div>
      </div>
    )
  }

  if (!dungeon) {
    return (
      <div className="min-h-screen bg-system-dark p-6 text-white">
        <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Dungeon not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">{dungeon.title}</h1>
              <p className="mt-2 text-slate-400">{dungeon.description}</p>
            </div>
            <button
              type="button"
              disabled={taskLoading || dungeon.status === 'cleared'}
              onClick={handleClear}
              className="inline-flex items-center justify-center rounded-3xl bg-system-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {dungeon.status === 'cleared' ? 'Dungeon Cleared' : 'Clear Dungeon'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-sm uppercase text-slate-400">Status</p>
              <p className="mt-2 text-white">{dungeon.status}</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-sm uppercase text-slate-400">Progress</p>
              <p className="mt-2 text-white">{dungeon.completedTasks} / {dungeon.totalTasks}</p>
            </div>
            <div className="rounded-3xl border border-system-border bg-[#061323] p-4">
              <p className="text-sm uppercase text-slate-400">Reward</p>
              <p className="mt-2 text-system-gold">{dungeon.xpReward} XP</p>
            </div>
          </div>
        </SystemPanel>

        <SystemPanel title="Dungeon Tasks">
          <div className="space-y-4">
            {dungeon.tasks.length === 0 ? (
              <div className="rounded-3xl border border-system-border bg-[#061323] p-6 text-slate-300">No tasks added yet.</div>
            ) : (
              dungeon.tasks.map((task) => (
                <div key={task.id} className="flex flex-col gap-4 rounded-3xl border border-system-border bg-[#061323] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-sm text-slate-400">{task.isCompleted ? 'Completed' : 'Pending'}</p>
                  </div>
                  <button
                    type="button"
                    disabled={task.isCompleted || taskLoading}
                    onClick={() => handleTaskComplete(task.id)}
                    className="rounded-3xl bg-system-blue px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {task.isCompleted ? 'Done' : 'Complete'}
                  </button>
                </div>
              ))
            )}
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}

export default Dungeon
