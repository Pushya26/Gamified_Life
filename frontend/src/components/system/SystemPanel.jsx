import React from 'react'

const SystemPanel = ({ title, children, className = '' }) => {
  return (
    <section className={`rounded-3xl border border-system-border bg-system-panel p-6 shadow-system-glow ${className}`}>
      {title && <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>}
      {children}
    </section>
  )
}

export default SystemPanel
