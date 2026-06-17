import React from 'react'
import useSettingsStore from '../store/settingsStore'

export default function Settings() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const notifications = useSettingsStore((s) => s.notifications)
  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications)
  const sound = useSettingsStore((s) => s.sound)
  const toggleSound = useSettingsStore((s) => s.toggleSound)
  const volume = useSettingsStore((s) => s.volume)
  const setVolume = useSettingsStore((s) => s.setVolume)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Theme</h2>
        <p className="text-sm text-slate-400 mb-3">Choose your preferred UI theme.</p>
        <div className="flex gap-3">
          <button
            className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button
            className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            onClick={() => setTheme('system')}
          >
            System
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Notifications</h2>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={notifications} onChange={toggleNotifications} />
          <span className="text-sm">Enable push notifications</span>
        </label>
      </section>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Sound</h2>
        <label className="flex items-center gap-3 mb-3">
          <input type="checkbox" checked={sound} onChange={toggleSound} />
          <span className="text-sm">Enable sound effects</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="w-12 text-right text-sm">{Math.round(volume * 100)}%</span>
        </div>
      </section>

      <section>
        <button
          className="px-4 py-2 bg-rose-500 text-white rounded"
          onClick={() => useSettingsStore.getState().reset()}
        >
          Reset to defaults
        </button>
      </section>
    </div>
  )
}
 
