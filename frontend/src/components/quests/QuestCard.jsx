import React from 'react'

const difficultyStyles = {
  E: 'bg-slate-600 text-white',
  D: 'bg-system-blue text-slate-950',
  C: 'bg-blue-500 text-white',
  B: 'bg-purple-500 text-white',
  A: 'bg-orange-500 text-white',
  S: 'bg-system-gold text-slate-950',
}

const statColors = {
  STR: 'bg-[#39FF14]',
  AGI: 'bg-[#00D4FF]',
  INT: 'bg-[#A855F7]',
  VIT: 'bg-[#F97316]',
  SENSE: 'bg-[#EAB308]',
}

const QuestCard = ({ quest }) => {
  return (
    <article className="rounded-3xl border border-system-border bg-[#061323] p-5 shadow-[0_0_30px_rgba(0,212,255,0.08)] transition hover:-translate-y-1 hover:border-system-blue/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{quest.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{quest.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[quest.difficulty]}`}>
          {quest.difficulty}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div className="space-y-1 rounded-2xl border border-system-border bg-[#09182e] p-3">
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500">XP</p>
          <p className="font-semibold text-white">{quest.xpReward}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-system-border bg-[#09182e] p-3">
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500">Coins</p>
          <p className="font-semibold text-white">{quest.coinReward}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-system-border bg-[#09182e] p-3">
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500">Stat</p>
          <p className="inline-flex items-center gap-2 text-white">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${statColors[quest.statType]}`} />
            {quest.statType}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <p>Due {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString() : 'No due date'}</p>
        <div className="inline-flex items-center gap-2 rounded-full border border-system-border bg-[#071626] px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          {quest.status}
        </div>
      </div>
    </article>
  )
}

export default QuestCard
