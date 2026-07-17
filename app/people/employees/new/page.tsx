'use client'

import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { mockDepartments, mockDesignations, mockLocations } from '@/lib/mockData'

export default function NewEmployeePage() {
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
      <Link href="/people/employees" className={`text-xs font-semibold ${textSecondary} hover:text-[#004D43]`}>
        ← Back to Employees
      </Link>

      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Add Employee</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Create a new employee record</p>
      </div>

      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg} space-y-5`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} placeholder="e.g. Ananya" />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} placeholder="e.g. Rao" />
          </div>
          <div>
            <label className={labelClass}>Work Email</label>
            <input className={inputClass} type="email" placeholder="ananya.rao@evoq.com" />
          </div>
          <div>
            <label className={labelClass}>Mobile</label>
            <input className={inputClass} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className={labelClass}>Designation</label>
            <select className={inputClass}>
              {mockDesignations.map(d => <option key={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <select className={inputClass}>
              {mockDepartments.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select className={inputClass}>
              {mockLocations.map(l => <option key={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Employment Type</label>
            <select className={inputClass}>
              <option>Full Time</option>
              <option>Contract</option>
              <option>Intern</option>
            </select>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${borderColor}`}>
          <Link
            href="/people/employees"
            className={`px-4 py-2.5 rounded-lg border ${borderColor} text-sm font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}
          >
            Cancel
          </Link>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors">
            Save Employee
          </button>
        </div>
      </div>
    </div>
  )
}
