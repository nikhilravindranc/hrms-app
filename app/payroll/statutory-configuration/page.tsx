'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { ShieldIcon } from '@/components/Icons'
import { wizardCountries, wizardStatutoryByCountry } from '@/lib/payrollData'

export default function StatutoryConfigurationPage() {
  const { isDark } = useTheme()
  const [country, setCountry] = useState('IN')
  const statutoryItems = wizardStatutoryByCountry[country] ?? []
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(statutoryItems.map(s => [s.id, true]))
  )

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const toggle = (id: string) => setEnabled(prev => ({ ...prev, [id]: !prev[id] }))

  const handleCountryChange = (id: string) => {
    setCountry(id)
    setEnabled(Object.fromEntries((wizardStatutoryByCountry[id] ?? []).map(s => [s.id, true])))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Statutory Configuration</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Which statutory components apply to your organization, set during payroll setup.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-xs font-semibold ${textSecondary}`}>Country</label>
          <select value={country} onChange={e => handleCountryChange(e.target.value)} className={`px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-xs font-semibold outline-none`}>
            {wizardCountries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className={`rounded-lg border ${borderColor} ${isDark ? 'bg-[#5E93FF]/10' : 'bg-[#5E93FF]/10'} px-4 py-3`}>
        <p className={`text-xs font-medium ${isDark ? 'text-[#B4C6FF]' : 'text-[#1E3A8A]'}`}>
          This is the same country-level configuration completed during payroll setup. Changes here affect which
          statutory components appear as options on Statutory Deductions.
        </p>
      </div>

      <div className="space-y-2">
        {statutoryItems.map(item => (
          <label key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${borderColor} ${cardBg} cursor-pointer`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/15 text-[#8B5CF6]">
                <ShieldIcon size={17} />
              </div>
              <p className={`text-sm font-bold ${textColor}`}>{item.label}</p>
            </div>
            <input type="checkbox" checked={enabled[item.id]} onChange={() => toggle(item.id)} className="rounded" />
          </label>
        ))}
      </div>
    </div>
  )
}
