'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import {
  ArrowRightIcon,
  UsersIcon,
  CashIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  RefreshIcon,
  ReceiptIcon,
  EditIcon,
  FileTextIcon,
  CalendarIcon,
  activityIconMap,
} from '@/components/Icons'
import {
  payrollAttentionItems,
  currentPayrollRun,
  payrollTotals,
  payrollHistory,
  payrollTimelineStages,
  currentTimelineStageIndex,
  payrollDeadlines,
  payrollActivity,
} from '@/lib/payrollData'

const attentionColors: Record<string, string> = {
  'awaiting-approval': '#5E93FF',
  'salary-revisions': '#F59E0B',
  'reimbursements-review': '#EAB308',
  'missing-bank': '#EF4444',
  'payroll-scheduled': '#8B5CF6',
}

const attentionIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'awaiting-approval': ClipboardCheckIcon,
  'salary-revisions': EditIcon,
  'reimbursements-review': ReceiptIcon,
  'missing-bank': UsersIcon,
  'payroll-scheduled': CalendarIcon,
}

const quickActions = [
  { id: 'run-payroll', label: 'Run Payroll', icon: RefreshIcon, href: '/payroll/run', hex: '#00755A' },
  { id: 'approve-payroll', label: 'Approve Payroll', icon: CheckCircleIcon, href: '/payroll/run', hex: '#5E93FF' },
  { id: 'generate-payslips', label: 'Generate Payslips', icon: FileTextIcon, href: '/payroll/payslips', hex: '#8B5CF6' },
  { id: 'add-salary-revision', label: 'Add Salary Revision', icon: EditIcon, href: '/payroll/compensation', hex: '#F59E0B' },
  { id: 'review-reimbursements', label: 'Review Reimbursements', icon: ReceiptIcon, href: '/payroll/reimbursements', hex: '#EAB308' },
]

export default function PayrollLandingPage() {
  const { isDark } = useTheme()
  const { user } = useAuth()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const lastProcessed = payrollHistory[0]

  const snapshotCards = [
    { label: 'Employees Included', value: currentPayrollRun.lines.length.toString(), icon: UsersIcon, hex: '#00755A' },
    { label: 'Estimated Payroll', value: `₹${(payrollTotals.net / 100000).toFixed(1)}L`, icon: CashIcon, hex: '#5E93FF' },
    { label: 'Pending Approvals', value: '1', icon: ClipboardCheckIcon, hex: '#F59E0B' },
    { label: 'Processed This Month', value: lastProcessed ? `₹${(lastProcessed.totalNet / 100000).toFixed(1)}L` : '—', icon: CheckCircleIcon, hex: '#8B5CF6' },
  ]

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#004D43] to-[#00755A]">
        <p className="text-white/70 text-sm font-semibold">Good morning, {user?.firstName ?? 'there'}</p>
        <h1 className="text-2xl font-extrabold text-white mt-1">Payroll for July is ready to process.</h1>
      </div>

      {/* Attention Center */}
      <div>
        <h2 className={`text-sm font-bold mb-3 ${textColor}`}>Needs Your Attention</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {payrollAttentionItems.map(item => {
            const hex = attentionColors[item.id]
            const Icon = attentionIcons[item.id]
            return (
              <Link key={item.id} href={item.href}>
                <div
                  className={`p-4 rounded-xl border ${borderColor} transition-transform hover:-translate-y-0.5 cursor-pointer h-full flex flex-col`}
                  style={{ backgroundColor: `${hex}${isDark ? '1F' : '14'}` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${hex}33`, color: hex }}
                    >
                      <Icon size={18} />
                    </div>
                    <p className={`text-2xl font-extrabold ${textColor}`}>{item.count}</p>
                  </div>
                  <p className={`text-xs font-semibold mb-1.5 flex-1 ${textColor}`}>{item.label}</p>
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: hex }}>
                    {item.actionLabel}
                    <ArrowRightIcon size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Payroll Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {snapshotCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
              <div className="flex items-center justify-between mb-2.5">
                <p className={`text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{card.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${card.hex}22`, color: card.hex }}>
                  <Icon size={16} />
                </div>
              </div>
              <p className={`text-2xl font-extrabold ${textColor}`}>{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Payroll Timeline */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Payroll Timeline</h2>
            <div className="flex items-center overflow-x-auto pb-1">
              {payrollTimelineStages.map((stage, idx) => {
                const isDone = idx < currentTimelineStageIndex
                const isCurrent = idx === currentTimelineStageIndex
                return (
                  <div key={stage} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-2 w-28">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          isDone
                            ? 'bg-[#00755A] border-[#00755A] text-white'
                            : isCurrent
                            ? 'border-[#00755A] text-[#00755A]'
                            : `${borderColor} ${textSecondary}`
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <p className={`text-[10.5px] font-semibold text-center leading-tight ${isCurrent ? 'text-[#00755A]' : isDone ? textColor : textSecondary}`}>
                        {stage}
                      </p>
                    </div>
                    {idx < payrollTimelineStages.length - 1 && (
                      <div className={`h-0.5 w-8 flex-shrink-0 -mt-6 ${isDone ? 'bg-[#00755A]' : isDark ? 'bg-[#27272A]' : 'bg-[#D4E8E0]'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <Link key={action.id} href={action.href}>
                    <div
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-transform hover:-translate-y-0.5 cursor-pointer"
                      style={{ backgroundColor: `${action.hex}${isDark ? '1F' : '14'}`, borderColor: `${action.hex}${isDark ? '40' : '30'}` }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.hex}33`, color: action.hex }}>
                        <Icon size={18} />
                      </div>
                      <p className={`text-xs font-semibold text-center ${textColor}`}>{action.label}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <h2 className={`text-sm font-bold mb-3.5 ${textColor}`}>Recent Activity</h2>
            <div className="space-y-3">
              {payrollActivity.map(a => {
                const Icon = activityIconMap[a.icon]
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                      <Icon size={15} className={isDark ? 'text-[#9CA3AF]' : 'text-[#004D43]'} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${textColor}`}>{a.title}</p>
                      <p className={`text-[10.5px] font-medium ${textSecondary}`}>{a.actor} · {a.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Upcoming Deadlines */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-center gap-1.5 mb-3.5">
              <CalendarIcon size={15} className="text-[#F59E0B]" />
              <h2 className={`text-sm font-bold ${textColor}`}>Upcoming Deadlines</h2>
            </div>
            <div className="space-y-3">
              {payrollDeadlines.map(d => (
                <div key={d.id} className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-semibold truncate ${textColor}`}>{d.label}</p>
                  <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 bg-[#F59E0B]/15 text-[#F59E0B]`}>
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payroll History quick peek */}
          <div className={`rounded-xl border ${borderColor} ${cardBg} p-5`}>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className={`text-sm font-bold ${textColor}`}>Recently Processed</h2>
              <Link href="/payroll/history" className={`text-xs font-bold ${isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} hover:underline`}>
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {payrollHistory.slice(0, 3).map(h => (
                <div key={h.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${textColor}`}>{h.month}</p>
                    <p className={`text-[10.5px] font-medium ${textSecondary}`}>{h.employeeCount} employees</p>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${textColor}`}>₹{(h.totalNet / 100000).toFixed(1)}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
