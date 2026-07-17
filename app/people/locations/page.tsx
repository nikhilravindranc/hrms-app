'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockLocations } from '@/lib/mockData'
import { PlusIcon, MapPinIcon } from '@/components/Icons'

export default function LocationsPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  const rows = useMemo(
    () => mockLocations.map(loc => ({ ...loc, employeeCount: employees.filter(e => e.location === loc.name).length })),
    [employees]
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Locations</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{mockLocations.length} Locations</p>
        </div>
        <Link
          href="/people/locations/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
        >
          <PlusIcon size={15} />
          Add Location
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(loc => (
          <div key={loc.id} className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                <MapPinIcon size={18} />
              </div>
              <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${isDark ? 'bg-[#27272A] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
                {loc.employeeCount} Employees
              </span>
            </div>
            <p className={`text-base font-bold ${textColor}`}>{loc.name}</p>
            <p className={`text-xs font-medium mt-1 ${textSecondary}`}>{loc.address}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
