import create from 'zustand'
import { persist } from 'zustand/middleware'

const defaultSettings = {
  theme: 'system', // 'light' | 'dark' | 'system'
  notifications: true,
  sound: true,
  volume: 0.8,
}

const useSettingsStore = create(
  persist(
    (set) => ({
      ...defaultSettings,
      setTheme: (theme) => set(() => ({ theme })),
      toggleNotifications: () => set((s) => ({ notifications: !s.notifications })),
      toggleSound: () => set((s) => ({ sound: !s.sound })),
      setVolume: (v) => set(() => ({ volume: Math.max(0, Math.min(1, v)) })),
      reset: () => set(() => ({ ...defaultSettings })),
    }),
    {
      name: 'solo-leveling-settings',
      getStorage: () => localStorage,
    }
  )
)

export default useSettingsStore
