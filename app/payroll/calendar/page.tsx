'use client'

import { useTheme } from '@/context/ThemeContext'
import { CalendarIcon } from '@/components/Icons'
import { payrollCalendarEntries, payrollSettings } from '@/lib/payrollData'

export default function PayrollCalendarPage() {
  const { isDark } = useTheme()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payroll Calendar</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Cut-off and pay dates for each upcoming payroll cycle.</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-4 flex items-center gap-3`}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
          <CalendarIcon size={17} />
        </div>
        <p className={`text-sm font-medium ${textColor}`}>
          Cycle: <span className="font-bold">{payrollSettings.payrollCalendar}</span> · Cut-off <span className="font-bold">{payrollSettings.cutOffDate}</span> · Pay day <span className="font-bold">{payrollSettings.payDay}</span>
        </p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Month', 'Cut-off Date', 'Pay Date'].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payrollCalendarEntries.map(entry => (
                <tr key={entry.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap ${textColor}`}>{entry.month}</td>
                  <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>
                    {new Date(entry.cutOff).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${textColor}`}>
                    {new Date(entry.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
