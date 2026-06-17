import { create } from 'zustand'

const useUIStore = create((set) => ({
  isLoading: false,
  activeModal: null,
  soundEnabled: true,
  setLoading: (isLoading) => set({ isLoading }),
  setActiveModal: (activeModal) => set({ activeModal }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}))

export default useUIStore
