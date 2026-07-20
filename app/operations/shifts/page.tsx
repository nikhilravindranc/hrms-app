'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { PlusIcon, ClockIcon, XIcon } from '@/components/Icons'
import { mockShifts, Shift } from '@/lib/operationsData'

export default function ShiftsPage() {
  const { isDark } = useTheme()
  const [shifts, setShifts] = useState(mockShifts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', start: '09:00', end: '18:00', breakMinutes: 60, graceMinutes: 10, workingHours: 8 })

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const addShift = () => {
    if (!form.name.trim()) return
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      name: form.name,
      start: form.start,
      end: form.end,
      breakMinutes: form.breakMinutes,
      graceMinutes: form.graceMinutes,
      workingHours: form.workingHours,
      weeklyOff: ['Sat', 'Sun'],
      color: '#00755A',
    }
    setShifts(prev => [...prev, newShift])
    setForm({ name: '', start: '09:00', end: '18:00', breakMinutes: 60, graceMinutes: 10, workingHours: 8 })
    setShowForm(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Shifts</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Shift library used across attendance and scheduling</p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
        >
          <PlusIcon size={15} />
          Add Shift
        </button>
      </div>

      {showForm && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex items-end gap-3 flex-wrap`}>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Evening" className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none w-40`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Start</label>
            <input type="time" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>End</label>
            <input type="time" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Break (min)</label>
            <input type="number" value={form.breakMinutes} onChange={e => setForm(f => ({ ...f, breakMinutes: Number(e.target.value) }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none w-24`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Grace (min)</label>
            <input type="number" value={form.graceMinutes} onChange={e => setForm(f => ({ ...f, graceMinutes: Number(e.target.value) }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none w-24`} />
          </div>
          <button onClick={addShift} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">Save</button>
          <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}><XIcon size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map(shift => (
          <div key={shift.id} className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${shift.color}22`, color: shift.color }}>
                <ClockIcon size={16} />
              </div>
              <div>
                <p className={`text-sm font-bold ${textColor}`}>{shift.name}</p>
                <p className={`text-xs font-medium ${textSecondary}`}>{shift.start} – {shift.end}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Break" value={`${shift.breakMinutes} min`} textColor={textColor} textSecondary={textSecondary} />
              <Stat label="Grace" value={`${shift.graceMinutes} min`} textColor={textColor} textSecondary={textSecondary} />
              <Stat label="Working Hours" value={`${shift.workingHours}h`} textColor={textColor} textSecondary={textSecondary} />
              <Stat label="Weekly Off" value={shift.weeklyOff.join(', ')} textColor={textColor} textSecondary={textSecondary} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, textColor, textSecondary }: { label: string; value: string; textColor: string; textSecondary: string }) {
  return (
    <div>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${textColor}`}>{value}</p>
    </div>
  )
}
