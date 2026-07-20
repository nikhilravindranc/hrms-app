'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { ChevronRightIcon } from '@/components/Icons'
import { mockLeavePolicies, mockLeaveTypes } from '@/lib/operationsData'

export default function LeavePoliciesPage() {
  const { isDark } = useTheme()
  const [openId, setOpenId] = useState<string | null>(mockLeavePolicies[0]?.id ?? null)

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const fields: { key: keyof typeof mockLeavePolicies[number]; label: string }[] = [
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'accrual', label: 'Accrual' },
    { key: 'carryForward', label: 'Carry Forward' },
    { key: 'encashment', label: 'Encashment' },
    { key: 'noticePeriod', label: 'Notice Period' },
    { key: 'blackoutDates', label: 'Blackout Dates' },
    { key: 'approvalRules', label: 'Approval Rules' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Leave Policies</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Rules governing eligibility, accrual and approval for each leave type</p>
      </div>

      <div className="space-y-3">
        {mockLeavePolicies.map(policy => {
          const leaveType = mockLeaveTypes.find(t => t.id === policy.leaveTypeId)
          const isOpen = openId === policy.id
          return (
            <div key={policy.id} className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
              <button
                onClick={() => setOpenId(isOpen ? null : policy.id)}
                className={`w-full flex items-center justify-between px-5 py-3.5 ${isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'} transition-colors`}
              >
                <p className={`text-sm font-bold ${textColor}`}>{leaveType?.name}</p>
                <ChevronRightIcon size={16} className={`${textSecondary} transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className={`px-5 py-4 border-t ${borderColor} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                  {fields.map(f => (
                    <div key={f.key}>
                      <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{f.label}</p>
                      <p className={`text-sm font-medium mt-0.5 ${textColor}`}>{policy[f.key] as string}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
