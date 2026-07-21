'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { TrophyIcon } from '@/components/Icons'
import { mockBonusAdjustments, BonusAdjustment } from '@/lib/payrollData'

type TypeFilter = 'All' | BonusAdjustment['type']
const TYPES: BonusAdjustment['type'][] = ['Bonus', 'Incentive', 'Variable Pay', 'Arrears', 'Recovery', 'One-time Payment']

const statusColors: Record<BonusAdjustment['status'], { bg: string; text: string }> = {
  Pending: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Approved: { bg: 'bg-[#8B5CF6]/15', text: 'text-[#8B5CF6]' },
  Processed: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
}

export default function BonusesAdjustmentsPage() {
  const { isDark } = useTheme()
  const [items, setItems] = useState(mockBonusAdjustments)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const filtered = useMemo(() => typeFilter === 'All' ? items : items.filter(i => i.type === typeFilter), [items, typeFilter])

  const approve = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Approved' } : i))

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Bonuses & Adjustments</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Manage one-off payments — bonuses, incentives, variable pay, arrears, and recoveries.</p>
      </div>

      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
        {(['All', ...TYPES] as TypeFilter[]).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              typeFilter === t ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Type', 'Amount', 'Month', 'Reason', 'Status', ''].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-[160px]">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/15 text-[#8B5CF6]">
                        <TrophyIcon size={14} />
                      </div>
                      <p className={`text-sm font-semibold truncate ${textColor}`}>{b.employeeName}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{b.type}</td>
                  <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${b.amount < 0 ? 'text-[#EF4444]' : 'text-[#00755A]'}`}>
                    {b.amount < 0 ? '-' : '+'}₹{Math.abs(b.amount).toLocaleString('en-IN')}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{b.month}</td>
                  <td className={`px-4 py-3 text-sm font-medium max-w-xs truncate ${textSecondary}`}>{b.reason}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[b.status].bg} ${statusColors[b.status].text}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.status === 'Pending' && (
                      <button onClick={() => approve(b.id)} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className={`text-sm font-medium ${textSecondary}`}>No entries for this type.</p>
          </div>
        )}
      </div>
    </div>
  )
}
