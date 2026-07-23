'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { BuildingBankIcon } from '@/components/Icons'
import { mockPaymentMethods, payrollSettings } from '@/lib/payrollData'

export default function PaymentMethodsPage() {
  const { isDark } = useTheme()
  const [methods, setMethods] = useState(mockPaymentMethods)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const fieldBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const setDefault = (id: string) => setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })))

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payment Methods</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>How salaries are disbursed, and the bank file format used for each method.</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} p-4 flex items-center gap-3`}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
          <BuildingBankIcon size={17} />
        </div>
        <p className={`text-sm font-medium ${textColor}`}>
          Default disbursing account: <span className="font-bold">{payrollSettings.defaultBank}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {methods.map(m => (
          <div key={m.id} className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex items-center justify-between flex-wrap gap-3`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#5E93FF]/15 text-[#5E93FF]">
                <BuildingBankIcon size={17} />
              </div>
              <div>
                <p className={`text-sm font-bold ${textColor}`}>{m.label}</p>
                <p className={`text-[11px] font-medium mt-0.5 ${textSecondary}`}>File format: {m.fileFormat}</p>
              </div>
            </div>
            {m.isDefault ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00755A]/15 text-[#00755A]">Default</span>
            ) : (
              <button
                onClick={() => setDefault(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${borderColor} ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={`rounded-xl border ${borderColor} ${fieldBg} p-4`}>
        <p className={`text-xs font-medium ${textSecondary}`}>
          Payment method and file format determine how the Export Bank File action on Payroll Run formats the disbursement file for your bank.
        </p>
      </div>
    </div>
  )
}
