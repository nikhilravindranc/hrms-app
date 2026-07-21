'use client'

import { useTheme } from '@/context/ThemeContext'
import { DownloadIcon, HistoryIcon } from '@/components/Icons'
import { payrollHistory } from '@/lib/payrollData'

export default function PayrollHistoryPage() {
  const { isDark } = useTheme()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payroll History</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Monthly archive of processed payroll runs.</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Month', 'Status', 'Employees', 'Total Net Pay', 'Processed Date', ''].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payrollHistory.map(h => (
                <tr key={h.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                        <HistoryIcon size={15} className={isDark ? 'text-[#9CA3AF]' : 'text-[#004D43]'} />
                      </span>
                      <p className={`text-sm font-bold ${textColor}`}>{h.month}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#00755A]/15 text-[#00755A]">
                      {h.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${textColor}`}>{h.employeeCount}</td>
                  <td className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap ${textColor}`}>₹{h.totalNet.toLocaleString('en-IN')}</td>
                  <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>
                    {new Date(h.processedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${borderColor} text-xs font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}>
                      <DownloadIcon size={13} />
                      Download
                    </button>
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
