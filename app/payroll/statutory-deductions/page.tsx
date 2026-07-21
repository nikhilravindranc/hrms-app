'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { ShieldIcon } from '@/components/Icons'
import { mockStatutoryDeductions } from '@/lib/payrollData'

export default function StatutoryDeductionsPage() {
  const { isDark } = useTheme()
  const [deductions, setDeductions] = useState(mockStatutoryDeductions)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const toggle = (id: string) => setDeductions(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Statutory Deductions</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Country-specific compliance rules, configurable per component.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-xs font-semibold ${textSecondary}`}>Country</label>
          <select disabled className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-semibold outline-none opacity-80`}>
            <option>India</option>
          </select>
        </div>
      </div>

      <div className={`rounded-lg border ${borderColor} ${isDark ? 'bg-[#5E93FF]/10' : 'bg-[#5E93FF]/10'} px-4 py-3`}>
        <p className={`text-xs font-medium ${isDark ? 'text-[#B4C6FF]' : 'text-[#1E3A8A]'}`}>
          This framework is built to support additional countries — each deduction below is a configurable component scoped to India. Add a country to define a new compliance set without changing payroll logic.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {deductions.map(d => (
          <div key={d.id} className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/15 text-[#8B5CF6]">
                  <ShieldIcon size={17} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${textColor}`}>{d.name}</h2>
                  <p className={`text-[11px] font-medium mt-0.5 ${textSecondary}`}>{d.applicability}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(d.id)}
                className={`relative w-10 rounded-full transition-colors flex-shrink-0 ${d.enabled ? 'bg-[#00755A]' : isDark ? 'bg-[#27272A]' : 'bg-[#D4E8E0]'}`}
                style={{ height: '22px' }}
              >
                <span className={`absolute top-0.5 rounded-full bg-white transition-transform ${d.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <div className={`p-2.5 rounded-lg ${inputBg}`}>
                <p className={`text-[9.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employee Contribution</p>
                <p className={`text-xs font-bold mt-0.5 ${textColor}`}>{d.employeeContribution}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${inputBg}`}>
                <p className={`text-[9.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employer Contribution</p>
                <p className={`text-xs font-bold mt-0.5 ${textColor}`}>{d.employerContribution}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${inputBg} col-span-2 sm:col-span-1`}>
                <p className={`text-[9.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Cap</p>
                <p className={`text-xs font-bold mt-0.5 ${textColor}`}>{d.cap}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${inputBg}`}>
                <p className={`text-[9.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Status</p>
                <p className={`text-xs font-bold mt-0.5 ${d.enabled ? 'text-[#00755A]' : textSecondary}`}>{d.enabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
