'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { DownloadIcon, MailIcon, CheckIcon, FileTextIcon } from '@/components/Icons'
import { mockPayslips } from '@/lib/payrollData'

export default function PayslipsPage() {
  const { isDark } = useTheme()
  const [payslips, setPayslips] = useState(mockPayslips)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const departments = useMemo(() => Array.from(new Set(mockPayslips.map(p => p.department))), [])

  const filtered = useMemo(() => {
    return payslips.filter(p => {
      if (search && !p.employeeName.toLowerCase().includes(search.toLowerCase())) return false
      if (deptFilter && p.department !== deptFilter) return false
      return true
    })
  }, [payslips, search, deptFilter])

  const publish = (id: string) => setPayslips(prev => prev.map(p => p.id === id ? { ...p, status: 'Published' } : p))

  const generatedCount = payslips.filter(p => p.status === 'Generated').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Payslips</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Employee document center — generate, publish, and share monthly payslips.</p>
        </div>
        {generatedCount > 0 && (
          <button
            onClick={() => setPayslips(prev => prev.map(p => ({ ...p, status: 'Published' })))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
          >
            <CheckIcon size={15} />
            Publish All ({generatedCount})
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select disabled className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-semibold outline-none opacity-80`}>
          <option>June 2026</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employee..."
          className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none w-48`}
        />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-medium outline-none`}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Department', 'Month', 'Net Pay', 'Status', ''].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-[160px]">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                        <FileTextIcon size={14} />
                      </div>
                      <p className={`text-sm font-semibold truncate ${textColor}`}>{p.employeeName}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{p.department}</td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{p.month}</td>
                  <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${textColor}`}>₹{p.netPay.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${p.status === 'Published' ? 'bg-[#00755A]/15 text-[#00755A]' : 'bg-[#5E93FF]/15 text-[#5E93FF]'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {p.status === 'Generated' && (
                        <button onClick={() => publish(p.id)} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
                          Publish
                        </button>
                      )}
                      <button className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`} title="Download">
                        <DownloadIcon size={15} />
                      </button>
                      <button className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`} title="Email">
                        <MailIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className={`text-sm font-medium ${textSecondary}`}>No payslips match these filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
