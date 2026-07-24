'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { DownloadIcon, RefreshIcon, LockIcon, CheckIcon, FileTextIcon } from '@/components/Icons'
import { currentPayrollRun, payrollTotals, PayrollRunStatus } from '@/lib/payrollData'

const statusOrder: PayrollRunStatus[] = ['Draft', 'Calculated', 'Locked', 'Approved', 'Processed']

const statusStyles: Record<PayrollRunStatus, { bg: string; text: string }> = {
  Draft: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#6B7280]' },
  Calculated: { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
  Locked: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Approved: { bg: 'bg-[#8B5CF6]/15', text: 'text-[#8B5CF6]' },
  Processed: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
}

const lineStatusStyles: Record<string, { bg: string; text: string }> = {
  Pending: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#6B7280]' },
  Calculated: { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
  Approved: { bg: 'bg-[#8B5CF6]/15', text: 'text-[#8B5CF6]' },
  Paid: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
}

export default function PayrollRunPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const [status, setStatus] = useState<PayrollRunStatus>(currentPayrollRun.status)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const employeeById = useMemo(() => {
    const map: Record<string, (typeof employees)[number]> = {}
    employees.forEach(e => { map[e.id] = e })
    return map
  }, [employees])

  const lineStatusForRun = (baseStatus: string): string => {
    if (status === 'Processed') return 'Paid'
    if (status === 'Approved') return 'Approved'
    if (status === 'Draft') return 'Pending'
    return baseStatus
  }

  const currentIdx = statusOrder.indexOf(status)

  const advance = (to: PayrollRunStatus) => setStatus(to)

  const summaryFields = [
    { label: 'Payroll Month', value: currentPayrollRun.month },
    { label: 'Cut-off Date', value: new Date(currentPayrollRun.cutOffDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    { label: 'Pay Date', value: new Date(currentPayrollRun.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payroll Run</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Calculate, lock, and approve this month&apos;s payroll before disbursement.</p>
      </div>

      {/* Summary bar */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5 space-y-4`}>
        <div className="flex flex-wrap gap-8">
          {summaryFields.map(f => (
            <div key={f.label}>
              <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{f.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{f.value}</p>
            </div>
          ))}
          <div>
            <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Status</p>
            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[status].bg} ${statusStyles[status].text}`}>
              {status}
            </span>
          </div>
        </div>

        <div className={`pt-4 border-t ${borderColor} flex flex-wrap items-center gap-2.5`}>
          {(() => {
            const disabledClass = isDark
              ? 'bg-[#27272A] text-[#71717A] cursor-not-allowed'
              : 'bg-[#E8EFF6] text-[#94A3B8] cursor-not-allowed'
            const btnBase = 'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors'

            const calculateDisabled = currentIdx >= 1
            const lockDisabled = currentIdx < 1 || currentIdx >= 2
            const approveDisabled = currentIdx < 2 || currentIdx >= 3
            const payslipsDisabled = currentIdx < 3
            const exportDisabled = currentIdx < 3

            return (
              <>
                <button
                  onClick={() => advance('Calculated')}
                  disabled={calculateDisabled}
                  className={`${btnBase} ${calculateDisabled ? disabledClass : 'text-white bg-[#5E93FF] hover:bg-[#4A7FE8]'}`}
                >
                  <RefreshIcon size={15} />
                  Calculate
                </button>
                <button
                  onClick={() => advance('Locked')}
                  disabled={lockDisabled}
                  className={`${btnBase} ${lockDisabled ? disabledClass : 'text-white bg-[#F59E0B] hover:bg-[#D97706]'}`}
                >
                  <LockIcon size={15} />
                  Lock
                </button>
                <button
                  onClick={() => advance('Approved')}
                  disabled={approveDisabled}
                  className={`${btnBase} ${approveDisabled ? disabledClass : 'text-white bg-[#8B5CF6] hover:bg-[#7C3AED]'}`}
                >
                  <CheckIcon size={15} />
                  Approve
                </button>
                <button
                  onClick={() => advance('Processed')}
                  disabled={payslipsDisabled}
                  className={`${btnBase} ${payslipsDisabled ? disabledClass : 'text-white bg-[#00755A] hover:bg-[#004A3A]'}`}
                >
                  <FileTextIcon size={15} />
                  Generate Payslips
                </button>
                <button
                  disabled={exportDisabled}
                  className={`${btnBase} border ${exportDisabled ? `${disabledClass} border-transparent` : `${borderColor} ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}`}
                >
                  <DownloadIcon size={15} />
                  Export Bank File
                </button>
              </>
            )
          })()}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
          <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Total Gross</p>
          <p className={`text-xl font-extrabold mt-1 ${textColor}`}>₹{payrollTotals.gross.toLocaleString('en-IN')}</p>
        </div>
        <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
          <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Total Deductions</p>
          <p className={`text-xl font-extrabold mt-1 ${textColor}`}>₹{payrollTotals.deductions.toLocaleString('en-IN')}</p>
        </div>
        <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
          <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Total Net Pay</p>
          <p className={`text-xl font-extrabold mt-1 text-[#00755A]`}>₹{payrollTotals.net.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Employee table */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className={`px-5 py-3.5 border-b ${borderColor}`}>
          <h2 className={`text-sm font-bold ${textColor}`}>Employee Payroll — {currentPayrollRun.month}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Department', 'Gross', 'Deductions', 'Net Pay', 'Status'].map(h => (
                  <th key={h} className={`text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPayrollRun.lines.map(line => {
                const emp = employeeById[line.employeeId]
                if (!emp) return null
                const lineStatus = lineStatusForRun(line.status)
                const style = lineStatusStyles[lineStatus] ?? lineStatusStyles.Pending
                return (
                  <tr key={line.employeeId} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-[160px]">
                        <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                          <p className={`text-[10.5px] font-medium truncate ${textSecondary}`}>{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textColor}`}>{emp.department}</td>
                    <td className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${textColor}`}>₹{line.gross.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap ${textSecondary}`}>₹{line.deductions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 text-sm font-bold whitespace-nowrap text-[#00755A]">₹{line.netPay.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
                        {lineStatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
