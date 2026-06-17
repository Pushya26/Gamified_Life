import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AppShell from './components/shared/AppShell'
import Awakening from './pages/Awakening'
import Dashboard from './pages/Dashboard'
import QuestBoard from './pages/QuestBoard'
import DungeonMap from './pages/DungeonMap'
import Dungeon from './pages/Dungeon'
import CreateDungeon from './pages/CreateDungeon'
import HunterStatus from './pages/HunterStatus'
import Shadows from './pages/Shadows'
import Shop from './pages/Shop'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/awakening" element={<Awakening />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<QuestBoard />} />
            <Route path="/dungeons" element={<DungeonMap />} />
            <Route path="/dungeons/create" element={<CreateDungeon />} />
            <Route path="/dungeons/:id" element={<Dungeon />} />
            <Route path="/hunter" element={<HunterStatus />} />
            <Route path="/shadows" element={<Shadows />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
