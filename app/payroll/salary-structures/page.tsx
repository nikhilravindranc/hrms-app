'use client'

import { useTheme } from '@/context/ThemeContext'
import { LayersIcon } from '@/components/Icons'
import { mockSalaryStructures } from '@/lib/payrollData'

export default function SalaryStructuresPage() {
  const { isDark } = useTheme()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const fieldBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Salary Structures</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Reusable compensation templates assigned to employees by role and employment type.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockSalaryStructures.map(s => {
          const specialAllowancePercent = 100 - s.basicPercent
          const fields = [
            { label: 'Basic', value: `${s.basicPercent}% of Gross` },
            { label: 'HRA', value: `${s.hraPercent}% of Basic` },
            { label: 'Special Allowance', value: `${specialAllowancePercent}% of Gross` },
            { label: 'Bonus', value: s.bonusPercent > 0 ? `${s.bonusPercent}% of Basic (annual)` : 'Not applicable' },
            { label: 'Employer PF', value: s.employerPFPercent > 0 ? `${s.employerPFPercent}% of Basic` : 'Not applicable' },
            { label: 'Employer ESI', value: s.employerESIPercent > 0 ? `${s.employerESIPercent}% of Gross` : 'Not applicable' },
            { label: 'Employee PF', value: s.employeePFPercent > 0 ? `${s.employeePFPercent}% of Basic` : 'Not applicable' },
            { label: 'Employee ESI', value: s.employeeESIPercent > 0 ? `${s.employeeESIPercent}% of Gross` : 'Not applicable' },
            { label: 'Professional Tax', value: s.professionalTaxMonthly > 0 ? `₹${s.professionalTaxMonthly}/month` : 'Not applicable' },
          ]
          return (
            <div key={s.id} className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                  <LayersIcon size={17} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${textColor}`}>{s.name}</h2>
                  <p className={`text-[11px] font-medium ${textSecondary}`}>{s.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {fields.map(f => (
                  <div key={f.label} className={`p-2.5 rounded-lg ${fieldBg}`}>
                    <p className={`text-[9.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{f.label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${textColor}`}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
