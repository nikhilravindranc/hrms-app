'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { CheckIcon, XIcon } from '@/components/Icons'
import { mockLeaveTypes } from '@/lib/workforceData'

export default function LeaveTypesPage() {
  const { isDark } = useTheme()
  const [types, setTypes] = useState(mockLeaveTypes)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const updateDays = (id: string, days: number) => {
    setTypes(prev => prev.map(t => t.id === id ? { ...t, defaultDays: days } : t))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Leave Types</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Configure the leave categories available across the organization</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {['Leave Type', 'Category', 'Default Days / Year', 'Carry Forward', 'Encashable'].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map(t => (
              <tr key={t.id} className={`border-b ${borderColor} last:border-b-0 ${rowHover}`}>
                <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${textColor}`}>{t.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${t.category === 'Paid' ? 'bg-[#00755A]/15 text-[#00755A]' : 'bg-[#9CA3AF]/15 text-[#9CA3AF]'}`}>{t.category}</span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={t.defaultDays}
                    onChange={e => updateDays(t.id, Number(e.target.value))}
                    className={`w-20 px-2.5 py-1.5 rounded-lg border ${borderColor} ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'} ${textColor} text-sm font-medium outline-none`}
                  />
                </td>
                <td className="px-4 py-3">
                  {t.carryForward ? <CheckIcon size={16} className="text-[#00755A]" /> : <XIcon size={16} className={textSecondary} />}
                </td>
                <td className="px-4 py-3">
                  {t.encashable ? <CheckIcon size={16} className="text-[#00755A]" /> : <XIcon size={16} className={textSecondary} />}
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
