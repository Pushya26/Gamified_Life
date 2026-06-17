import React, { useEffect, useState } from 'react'
import { getShopItems, buyShopItem } from '../api/shop'
import SystemPanel from '../components/system/SystemPanel'

const Shop = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getShopItems()
        setItems(response.data.items)
      } catch (error) {
        console.error('Failed to load shop items', error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const handlePurchase = async (id) => {
    setPurchaseLoading(id)
    try {
      const response = await buyShopItem(id)
      setItems((current) => current.map((item) => (item.id === id ? response.data.item : item)))
    } catch (error) {
      console.error('Failed to purchase item', error)
    } finally {
      setPurchaseLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <div className="grid gap-6">
        <SystemPanel>
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-system-blue">Reward Shop</p>
            <h1 className="text-4xl font-semibold text-white">Unlock Your Rewards</h1>
            <p className="mt-2 text-slate-400">Spend your hard-earned coins on bonuses, habits, and real-world rewards.</p>
          </div>
        </SystemPanel>

        {loading ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">Loading shop items…</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-system-border bg-[#061323] p-8 text-center text-slate-300">No items available in your shop yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-system-border bg-[#061323] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-slate-400">{item.description}</p>
                  </div>
                  <span className="rounded-full bg-system-gold/10 px-3 py-1 text-sm text-system-gold">{item.costCoins} coins</span>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-300">{item.isPurchased ? 'Purchased' : 'Available'}</p>
                  <button
                    type="button"
                    disabled={item.isPurchased || purchaseLoading === item.id}
                    onClick={() => handlePurchase(item.id)}
                    className="rounded-3xl bg-system-blue px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-system-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {item.isPurchased ? 'Purchased' : 'Buy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
