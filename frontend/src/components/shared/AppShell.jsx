import React, { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/quests', label: 'Quests' },
  { path: '/dungeons', label: 'Dungeons' },
  { path: '/hunter', label: 'Hunter' },
  { path: '/shadows', label: 'Shadows' },
  { path: '/shop', label: 'Shop' },
  { path: '/settings', label: 'Settings' },
]

const AppShell = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/awakening', { replace: true })
  }

  return (
    <div className="min-h-screen bg-system-dark text-white">
      <header className="border-b border-system-border bg-[#071026]/80 backdrop-blur-xl px-4 py-4 shadow-system-glow">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Solo Leveling System</p>
            <h1 className="text-2xl font-semibold">Hunter Interface</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenMenu((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-system-border bg-system-panel text-system-blue transition hover:bg-system-blue/10 md:hidden"
              aria-label="Toggle navigation"
            >
              <span className="text-lg">☰</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="hidden rounded-xl border border-system-blue bg-system-blue/10 px-3 py-2 text-sm text-system-blue transition hover:bg-system-blue/20 md:inline-flex"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className={`${openMenu ? 'block' : 'hidden'} mt-4 md:hidden`}>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpenMenu(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-system-blue text-slate-950 shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-2xl border border-system-blue bg-system-blue/10 px-4 py-3 text-sm text-system-blue transition hover:bg-system-blue/20"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-3xl border border-system-border bg-system-panel p-6 shadow-system-glow"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AppShell
