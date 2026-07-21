'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { XIcon, HistoryIcon, AlertTriangleIcon } from '@/components/Icons'
import { mockCompensation, mockSalaryStructures, salaryRevisionsPending, employeesMissingBank } from '@/lib/payrollData'

type FilterKey = '' | 'pending' | 'missing-bank'

export default function EmployeeCompensationPage() {
  return (
    <Suspense fallback={null}>
      <EmployeeCompensationPageInner />
    </Suspense>
  )
}

function EmployeeCompensationPageInner() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState<FilterKey>('')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f === 'pending' || f === 'missing-bank') setFilter(f)
  }, [searchParams])

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const structureById = useMemo(() => {
    const map: Record<string, string> = {}
    mockSalaryStructures.forEach(s => { map[s.id] = s.name })
    return map
  }, [])

  const pendingIds = useMemo(() => new Set(salaryRevisionsPending.map(e => e.id)), [])
  const missingBankIds = useMemo(() => new Set(employeesMissingBank.map(e => e.id)), [])

  const compensationById = useMemo(() => {
    const map: Record<string, (typeof mockCompensation)[number]> = {}
    mockCompensation.forEach(c => { map[c.employeeId] = c })
    return map
  }, [])

  const rows = useMemo(() => {
    return employees.filter(e => {
      if (filter === 'pending') return pendingIds.has(e.id)
      if (filter === 'missing-bank') return missingBankIds.has(e.id)
      return true
    })
  }, [employees, filter, pendingIds, missingBankIds])

  const open = openId ? compensationById[openId] : null
  const openEmployee = openId ? employees.find(e => e.id === openId) : null

  const filterLabels: Record<FilterKey, string> = {
    '': 'All Employees',
    pending: 'Revision Pending',
    'missing-bank': 'Missing Bank Details',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Employee Compensation</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Employee-specific salary structure, bank, and tax regime details.</p>
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit`}>
          {(['', 'pending', 'missing-bank'] as FilterKey[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === f ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Salary Structure', 'Effective Date', 'Gross Salary', 'Bank Account', 'Tax Regime', 'Cost Center'].map(h => (
                  <th key={h} className={`text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(e => {
                const comp = compensationById[e.id]
                if (!comp) return null
                return (
                  <tr key={e.id} className={`border-b ${borderColor} last:border-b-0 transition-colors cursor-pointer ${rowHover}`} onClick={() => setOpenId(e.id)}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {e.firstName[0]}{e.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${textColor}`}>{e.firstName} {e.lastName}</p>
                          <p className={`text-[10.5px] font-medium truncate ${textSecondary}`}>{e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textColor}`}>{structureById[comp.salaryStructureId]}</td>
                    <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>
                      {new Date(comp.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap ${textColor}`}>₹{comp.grossSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {comp.bankAccount ? (
                        <span className={`text-sm font-medium ${textColor}`}>{comp.bankAccount}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
                          <AlertTriangleIcon size={12} />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${comp.taxRegime === 'New' ? 'bg-[#5E93FF]/15 text-[#5E93FF]' : 'bg-[#8B5CF6]/15 text-[#8B5CF6]'}`}>
                        {comp.taxRegime} Regime
                      </span>
                    </td>
                    <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{comp.costCenter}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-12 text-center">
              <p className={`text-sm font-medium ${textSecondary}`}>No employees match this filter.</p>
            </div>
          )}
        </div>
      </div>

      {open && openEmployee && (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/40" onClick={() => setOpenId(null)}>
          <div className={`w-full max-w-md h-full overflow-y-auto border-l ${borderColor} ${cardBg} p-6`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-base font-bold ${textColor}`}>{openEmployee.firstName} {openEmployee.lastName}</h2>
              <button onClick={() => setOpenId(null)} className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
                <XIcon size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Salary Structure</p>
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{structureById[open.salaryStructureId]}</p>
                </div>
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Tax Regime</p>
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{open.taxRegime}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Gross Salary</p>
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>₹{open.grossSalary.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Cost Center</p>
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{open.costCenter}</p>
                </div>
              </div>
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Bank Account</p>
                {open.bankAccount ? (
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{open.bankAccount}</p>
                ) : (
                  <p className="text-sm font-bold mt-0.5 text-[#EF4444]">Not on file — employee needs to submit bank details</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <HistoryIcon size={13} className={textSecondary} />
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Revision History</p>
                </div>
                <div className="space-y-2">
                  {open.history.map((h, i) => (
                    <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'}`}>
                      <div>
                        <p className={`text-xs font-semibold ${textColor}`}>₹{h.grossSalary.toLocaleString('en-IN')}</p>
                        <p className={`text-[10.5px] font-medium ${textSecondary}`}>{h.reason}</p>
                      </div>
                      <p className={`text-[10.5px] font-semibold ${textSecondary}`}>
                        {new Date(h.effectiveDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
