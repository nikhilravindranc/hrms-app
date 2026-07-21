'use client'

import { useTheme } from '@/context/ThemeContext'
import { SettingsIcon, CheckIcon } from '@/components/Icons'
import { payrollSettings } from '@/lib/payrollData'

export default function PayrollSettingsPage() {
  const { isDark } = useTheme()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const fieldBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const fields = [
    { label: 'Payroll Frequency', value: payrollSettings.frequency },
    { label: 'Pay Day', value: payrollSettings.payDay },
    { label: 'Cut-off Date', value: payrollSettings.cutOffDate },
    { label: 'Payroll Calendar', value: payrollSettings.payrollCalendar },
    { label: 'Working Days Calculation', value: payrollSettings.workingDaysCalculation },
    { label: 'Rounding Rule', value: payrollSettings.roundingRule },
    { label: 'Default Bank Settings', value: payrollSettings.defaultBank },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payroll Settings</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Organization-wide payroll configuration.</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
            <SettingsIcon size={17} />
          </div>
          <h2 className={`text-sm font-bold ${textColor}`}>General</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.label} className={`p-3 rounded-lg ${fieldBg}`}>
              <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{f.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Salary Components</h2>
        <div className="flex flex-wrap gap-2">
          {payrollSettings.salaryComponents.map(c => (
            <span key={c} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isDark ? 'bg-[#27272A] text-[#D4D4D8]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
        <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Approval Workflow</h2>
        <div className="space-y-3">
          {payrollSettings.approvalWorkflow.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                <CheckIcon size={12} />
              </span>
              <p className={`text-sm font-medium ${textColor}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
