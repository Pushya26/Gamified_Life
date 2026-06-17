import { create } from 'zustand'

const useHunterStore = create((set) => ({
  hunter: null,
  setHunter: (hunter) => set({ hunter }),
  addXP: (xp) => set((state) => ({ hunter: { ...state.hunter, xp: state.hunter.xp + xp } })),
  levelUp: (level) => set((state) => ({ hunter: { ...state.hunter, level } })),
  rankUp: (rank) => set((state) => ({ hunter: { ...state.hunter, rank } })),
  allocateStat: (stat, amount) =>
    set((state) => ({
      hunter: {
        ...state.hunter,
        [`stat${stat}`]: state.hunter[`stat${stat}`] + amount,
        statPointsAvailable: state.hunter.statPointsAvailable - amount,
      },
    })),
}))

export default useHunterStore
