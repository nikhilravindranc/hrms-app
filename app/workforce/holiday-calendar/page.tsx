'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { CalendarIcon } from '@/components/Icons'
import { mockHolidays, Holiday } from '@/lib/workforceData'

const typeColors: Record<Holiday['type'], { bg: string; text: string }> = {
  National: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
  Regional: { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
  Company: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Optional: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#9CA3AF]' },
}

const TYPES: Holiday['type'][] = ['National', 'Regional', 'Company', 'Optional']

export default function HolidayCalendarPage() {
  const { isDark } = useTheme()
  const [typeFilter, setTypeFilter] = useState<Holiday['type'] | ''>('')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const filtered = useMemo(
    () => (typeFilter ? mockHolidays.filter(h => h.type === typeFilter) : mockHolidays).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [typeFilter]
  )

  const grouped = useMemo(() => {
    const map: Record<string, Holiday[]> = {}
    filtered.forEach(h => {
      const month = new Date(h.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      map[month] = map[month] ?? []
      map[month].push(h)
    })
    return map
  }, [filtered])

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Holiday Calendar</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>2026 company holiday schedule</p>
      </div>

      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
        <button
          onClick={() => setTypeFilter('')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            typeFilter === '' ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
          }`}
        >
          All
        </button>
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              typeFilter === t ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([month, holidays]) => (
          <div key={month} className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className={`px-5 py-3 border-b ${borderColor}`}>
              <h2 className={`text-sm font-bold ${textColor}`}>{month}</h2>
            </div>
            <div>
              {holidays.map(h => {
                const d = new Date(h.date)
                return (
                  <div key={h.id} className={`flex items-center justify-between px-5 py-3 border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'}`}>
                        <span className="text-[9px] font-bold text-[#00755A] uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className={`text-sm font-extrabold ${textColor}`}>{d.getDate()}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${textColor}`}>{h.name}</p>
                        <p className={`text-[11px] font-medium ${textSecondary}`}>{d.toLocaleDateString('en-US', { weekday: 'long' })} · {h.locations.join(', ')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${typeColors[h.type].bg} ${typeColors[h.type].text}`}>{h.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={`rounded-xl border ${borderColor} ${cardBg} py-16 text-center`}>
            <CalendarIcon size={24} className={`mx-auto mb-2 ${textSecondary}`} />
            <p className={`text-sm font-medium ${textSecondary}`}>No holidays in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
