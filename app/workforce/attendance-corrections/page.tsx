'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { XIcon, CheckIcon, HistoryIcon } from '@/components/Icons'
import { mockAttendanceCorrections, AttendanceCorrection } from '@/lib/workforceData'

type Tab = 'Pending' | 'Approved' | 'Rejected'
const TAB_VALUES: Tab[] = ['Pending', 'Approved', 'Rejected']

export default function AttendanceCorrectionsPage() {
  return (
    <Suspense fallback={null}>
      <AttendanceCorrectionsPageInner />
    </Suspense>
  )
}

function AttendanceCorrectionsPageInner() {
  const { isDark } = useTheme()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>('Pending')
  const [corrections, setCorrections] = useState(mockAttendanceCorrections)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const t = searchParams.get('tab')
    if (t && TAB_VALUES.includes(t as Tab)) setTab(t as Tab)
  }, [searchParams])

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const filtered = useMemo(() => corrections.filter(c => c.status === tab), [corrections, tab])
  const open = corrections.find(c => c.id === openId) ?? null

  const setStatus = (id: string, status: AttendanceCorrection['status']) => {
    setCorrections(prev => prev.map(c => c.id === id ? {
      ...c,
      status,
      history: [...c.history, { action: status, by: 'Admin User', date: '2026-07-20' }],
    } : c))
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)))
  const bulkApprove = () => { selected.forEach(id => setStatus(id, 'Approved')) }

  const statusColors: Record<Tab, { bg: string; text: string }> = {
    Pending: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
    Approved: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
    Rejected: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Attendance Corrections</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Review employee-requested changes to their attendance record</p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit`}>
          {(['Pending', 'Approved', 'Rejected'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelected(new Set()) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === t ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
              }`}
            >
              {t}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t ? 'bg-white/25' : isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                {corrections.filter(c => c.status === t).length}
              </span>
            </button>
          ))}
        </div>
        {tab === 'Pending' && selected.size > 0 && (
          <button onClick={bulkApprove} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
            <CheckIcon size={15} />
            Bulk Approve ({selected.size})
          </button>
        )}
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              {tab === 'Pending' && <th className="w-10 px-4 py-3"><input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} className="rounded" /></th>}
              {['Employee', 'Date', 'Field', 'Old Value', 'Requested', 'Approver', ''].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className={`border-b ${borderColor} last:border-b-0 transition-colors cursor-pointer ${rowHover}`} onClick={() => setOpenId(c.id)}>
                {tab === 'Pending' && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="rounded" />
                  </td>
                )}
                <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${textColor}`}>{c.employeeName}</td>
                <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{c.field}</td>
                <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{c.oldValue}</td>
                <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-[#00755A]">{c.requestedValue}</td>
                <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{c.approver}</td>
                <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  {c.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setStatus(c.id, 'Approved')} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">Approve</button>
                      <button onClick={() => setStatus(c.id, 'Rejected')} className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors">Reject</button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${statusColors[c.status].bg} ${statusColors[c.status].text}`}>{c.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className={`text-sm font-medium ${textSecondary}`}>No {tab.toLowerCase()} corrections.</p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/40" onClick={() => setOpenId(null)}>
          <div className={`w-full max-w-md h-full overflow-y-auto border-l ${borderColor} ${cardBg} p-6`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-base font-bold ${textColor}`}>Correction Detail</h2>
              <button onClick={() => setOpenId(null)} className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
                <XIcon size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employee</p>
                <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{open.employeeName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Date</p>
                  <p className={`text-sm font-medium mt-0.5 ${textColor}`}>{new Date(open.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Field</p>
                  <p className={`text-sm font-medium mt-0.5 ${textColor}`}>{open.field}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg border ${borderColor}`}>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Old Value</p>
                  <p className={`text-sm font-bold mt-0.5 ${textColor}`}>{open.oldValue}</p>
                </div>
                <div className="p-3 rounded-lg border border-[#00755A]/30 bg-[#00755A]/10">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#00755A]">Requested Value</p>
                  <p className="text-sm font-bold mt-0.5 text-[#00755A]">{open.requestedValue}</p>
                </div>
              </div>
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Reason</p>
                <p className={`text-sm font-medium mt-0.5 ${textColor}`}>{open.reason}</p>
              </div>
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Approver</p>
                <p className={`text-sm font-medium mt-0.5 ${textColor}`}>{open.approver}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <HistoryIcon size={13} className={textSecondary} />
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>History</p>
                </div>
                <div className="space-y-2">
                  {open.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${textColor}`}>{h.action} · {h.by}</p>
                      <p className={`text-[11px] font-medium ${textSecondary}`}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              </div>

              {open.status === 'Pending' && (
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => { setStatus(open.id, 'Approved'); setOpenId(null) }} className="flex-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">Approve</button>
                  <button onClick={() => { setStatus(open.id, 'Rejected'); setOpenId(null) }} className="flex-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors">Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
