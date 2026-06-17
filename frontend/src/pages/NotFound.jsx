import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-system-dark p-6 text-white">
      <h1 className="text-4xl font-bold text-system-blue">404</h1>
      <p className="mt-3 text-slate-300">Page not found.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg border border-system-blue px-5 py-3 text-system-blue transition hover:bg-system-blue/10">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
