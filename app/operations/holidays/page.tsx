'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { PlusIcon, UploadIcon, XIcon, MoreVerticalIcon, EditIcon } from '@/components/Icons'
import { mockHolidays, Holiday } from '@/lib/operationsData'
import { mockLocations } from '@/lib/mockData'

const typeColors: Record<Holiday['type'], { bg: string; text: string }> = {
  National: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
  Regional: { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
  Company: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Optional: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#9CA3AF]' },
}

export default function HolidaysSetupPage() {
  const { isDark } = useTheme()
  const [holidays, setHolidays] = useState(mockHolidays)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', date: '2026-12-31', type: 'Company' as Holiday['type'], locations: [] as string[] })

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const toggleLocation = (loc: string) => {
    setForm(f => ({ ...f, locations: f.locations.includes(loc) ? f.locations.filter(l => l !== loc) : [...f.locations, loc] }))
  }

  const addHoliday = () => {
    if (!form.name.trim() || form.locations.length === 0) return
    setHolidays(prev => [...prev, { id: `hol-${Date.now()}`, name: form.name, date: form.date, type: form.type, locations: form.locations }])
    setForm({ name: '', date: '2026-12-31', type: 'Company', locations: [] })
    setShowForm(false)
  }

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id))
    setOpenMenuId(null)
  }

  const sorted = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Holidays</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Create, import and manage the company holiday list</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowImport(prev => !prev); setShowForm(false) }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border ${borderColor} ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}>
            <UploadIcon size={15} />
            Import
          </button>
          <button onClick={() => { setShowForm(prev => !prev); setShowImport(false) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#004A3A] transition-colors">
            <PlusIcon size={15} />
            Create Holiday
          </button>
        </div>
      </div>

      {showImport && (
        <div className={`rounded-xl border border-dashed ${borderColor} ${cardBg} p-8 flex flex-col items-center justify-center text-center gap-2`}>
          <UploadIcon size={20} className="text-[#00755A]" />
          <p className={`text-sm font-bold ${textColor}`}>Import holiday list from CSV</p>
          <p className={`text-xs font-medium ${textSecondary}`}>Columns: Name, Date, Type, Locations</p>
          <button className="mt-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#004A3A] transition-colors">Choose File</button>
        </div>
      )}

      {showForm && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 space-y-3`}>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. New Year's Day" className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none w-52`} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Holiday['type'] }))} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`}>
                {(['National', 'Regional', 'Company', 'Optional'] as Holiday['type'][]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Branches</label>
            <div className="flex items-center gap-3 mt-1.5">
              {mockLocations.map(loc => (
                <label key={loc.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.locations.includes(loc.name)} onChange={() => toggleLocation(loc.name)} className="rounded" />
                  <span className={`text-sm font-medium ${textColor}`}>{loc.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addHoliday} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#004A3A] transition-colors">Save Holiday</button>
            <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}><XIcon size={16} /></button>
          </div>
        </div>
      )}

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {['Holiday', 'Date', 'Type', 'Branches', ''].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(h => (
              <tr key={h.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                <td className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${textColor}`}>{h.name}</td>
                <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="px-4 py-2.5 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${typeColors[h.type].bg} ${typeColors[h.type].text}`}>{h.type}</span></td>
                <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{h.locations.join(', ')}</td>
                <td className="px-4 py-2.5 relative">
                  <button onClick={() => setOpenMenuId(prev => prev === h.id ? null : h.id)} className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
                    <MoreVerticalIcon size={16} />
                  </button>
                  {openMenuId === h.id && (
                    <div className={`absolute right-4 top-10 z-10 w-32 rounded-lg border ${borderColor} ${cardBg} shadow-lg py-1`}>
                      <button className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
                        <EditIcon size={14} className={textSecondary} />
                        Edit
                      </button>
                      <button onClick={() => removeHoliday(h.id)} className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-[#EF4444] ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
                        <XIcon size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
