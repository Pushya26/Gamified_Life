import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { me } from './api/auth'
import useHunterStore from './store/hunterStore'
import useSettingsStore from './store/settingsStore'

function Root() {
  const [ready, setReady] = useState(false)
  const setHunter = useHunterStore((s) => s.setHunter)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        if (mounted) setReady(true)
        return
      }

      try {
        const res = await me()
        if (mounted && res?.data?.hunter) {
          setHunter(res.data.hunter)
        }
      } catch (err) {
        localStorage.removeItem('token')
      } finally {
        if (mounted) setReady(true)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [setHunter])

  // apply theme from settings and subscribe to changes
  useEffect(() => {
    const applyTheme = (theme) => {
      const root = document.documentElement
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    // initial apply
    const current = useSettingsStore.getState().theme
    applyTheme(current)

    // subscribe
    const unsub = useSettingsStore.subscribe((s) => s.theme, (theme) => {
      applyTheme(theme)
    })

    return () => unsub()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-system-dark flex items-center justify-center text-slate-300">
        Loading session...
      </div>
    )
  }

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
