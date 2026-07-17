'use client'

import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

export default function NewDesignationPage() {
  const { isDark } = useTheme()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const inputClass = `w-full px-3 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`
  const labelClass = `text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-1.5 block`

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/people/designations" className={`text-xs font-semibold ${textSecondary} ${isDark ? 'hover:text-[#27EAA6]' : 'hover:text-[#004D43]'}`}>
        ← Back to Designations
      </Link>

      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Add Designation</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Create a new job designation</p>
      </div>

      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg} space-y-5`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} placeholder="e.g. Senior Manager" />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select className={inputClass}>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Level 4</option>
              <option>Level 5</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Brief description of the role..." />
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${borderColor}`}>
          <Link
            href="/people/designations"
            className={`px-4 py-2.5 rounded-lg border ${borderColor} text-sm font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}
          >
            Cancel
          </Link>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
            Save Designation
          </button>
        </div>
      </div>
    </div>
  )
}
