'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { CheckIcon, XIcon as RejectIcon } from '@/components/Icons'
import { mockTaxDeclarations, TaxDeclaration } from '@/lib/payrollData'

type StatusFilter = 'All' | TaxDeclaration['proofStatus']

const statusColors: Record<TaxDeclaration['proofStatus'], { bg: string; text: string }> = {
  Pending: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
  Verified: { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
  Rejected: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
}

export default function TaxDeclarationsPage() {
  const { isDark } = useTheme()
  const [declarations, setDeclarations] = useState(mockTaxDeclarations)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'

  const filtered = useMemo(
    () => statusFilter === 'All' ? declarations : declarations.filter(d => d.proofStatus === statusFilter),
    [declarations, statusFilter]
  )

  const setProofStatus = (id: string, proofStatus: TaxDeclaration['proofStatus']) =>
    setDeclarations(prev => prev.map(d => d.id === id ? { ...d, proofStatus } : d))

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Tax Declarations</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Employee-declared investments and exemptions for FY 2026-27, pending proof verification.</p>
      </div>

      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit`}>
        {(['All', 'Pending', 'Verified', 'Rejected'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === s ? 'bg-[#00755A] text-white' : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                {['Employee', 'Category', 'Declared Amount', 'Submitted', 'Proof Status', ''].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className={`border-b ${borderColor} last:border-b-0 transition-colors ${rowHover}`}>
                  <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${textColor}`}>{d.employeeName}</td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{d.category}</td>
                  <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${textColor}`}>₹{d.declaredAmount.toLocaleString('en-IN')}</td>
                  <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{new Date(d.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[d.proofStatus].bg} ${statusColors[d.proofStatus].text}`}>{d.proofStatus}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.proofStatus === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setProofStatus(d.id, 'Verified')} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
                          <CheckIcon size={12} />
                          Verify
                        </button>
                        <button onClick={() => setProofStatus(d.id, 'Rejected')} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 transition-colors">
                          <RejectIcon size={12} />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className={`text-sm font-medium ${textSecondary}`}>No declarations match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
