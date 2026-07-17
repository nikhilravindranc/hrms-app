'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { Employee, mockDepartments, mockDesignations, mockLocations } from '@/lib/mockData'
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  UploadIcon,
  PlusIcon,
  MoreVerticalIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  UserPlusIcon,
  XIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from '@/components/Icons'
import { Sparkline } from '@/components/Sparkline'

type SavedView = 'all' | 'my-team' | 'my-department' | 'direct-reports' | 'new-joiners' | 'inactive'

const statusColors: Record<Employee['status'], { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-[#10B981]/15', text: 'text-[#10B981]', dot: '#10B981' },
  'On Leave': { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]', dot: '#5E93FF' },
  Probation: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', dot: '#F59E0B' },
  Inactive: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', dot: '#EF4444' },
}

const employmentTypeColors: Record<Employee['employmentType'], { bg: string; text: string }> = {
  'Full Time': { bg: 'bg-[#00755A]/15', text: 'text-[#00755A]' },
  Contract: { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
  Intern: { bg: 'bg-[#7A9A1E]/15', text: 'text-[#7A9A1E]' },
}

export default function EmployeesPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()
  const router = useRouter()

  const [activeView, setActiveView] = useState<SavedView>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
    location: '',
    manager: '',
    employmentType: '',
    status: '',
  })

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const rowHover = isDark ? 'hover:bg-[#0F0F0F]' : 'hover:bg-[#F7FAF9]'
  const managerById = useMemo(() => {
    const map: Record<string, Employee> = {}
    employees.forEach(e => { map[e.id] = e })
    return map
  }, [employees])

  const savedViews: { id: SavedView; label: string; count: number }[] = useMemo(() => {
    const newJoinerCutoff = new Date()
    newJoinerCutoff.setDate(newJoinerCutoff.getDate() - 30)
    return [
      { id: 'all', label: 'All Employees', count: employees.length },
      { id: 'my-team', label: 'My Team', count: employees.filter(e => e.manager === 'EMP-002').length },
      { id: 'my-department', label: 'My Department', count: employees.filter(e => e.department === 'HR').length },
      { id: 'direct-reports', label: 'Direct Reports', count: employees.filter(e => e.manager === 'EMP-001').length },
      { id: 'new-joiners', label: 'New Joiners', count: employees.filter(e => new Date(e.joiningDate) >= newJoinerCutoff).length },
      { id: 'inactive', label: 'Inactive', count: employees.filter(e => e.status === 'Inactive').length },
    ]
  }, [employees])

  const viewFiltered = useMemo(() => {
    const newJoinerCutoff = new Date()
    newJoinerCutoff.setDate(newJoinerCutoff.getDate() - 30)
    switch (activeView) {
      case 'my-team': return employees.filter(e => e.manager === 'EMP-002')
      case 'my-department': return employees.filter(e => e.department === 'HR')
      case 'direct-reports': return employees.filter(e => e.manager === 'EMP-001')
      case 'new-joiners': return employees.filter(e => new Date(e.joiningDate) >= newJoinerCutoff)
      case 'inactive': return employees.filter(e => e.status === 'Inactive')
      default: return employees
    }
  }, [employees, activeView])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return viewFiltered.filter(e => {
      if (filters.department && e.department !== filters.department) return false
      if (filters.designation && e.designation !== filters.designation) return false
      if (filters.location && e.location !== filters.location) return false
      if (filters.manager && e.manager !== filters.manager) return false
      if (filters.employmentType && e.employmentType !== filters.employmentType) return false
      if (filters.status && e.status !== filters.status) return false
      if (q) {
        const hay = `${e.firstName} ${e.lastName} ${e.id} ${e.email} ${e.designation}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [viewFiltered, filters, search])

  const stats = useMemo(() => {
    const newJoinerCutoff = new Date()
    newJoinerCutoff.setDate(newJoinerCutoff.getDate() - 30)
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'Active').length,
      onLeave: employees.filter(e => e.status === 'On Leave').length,
      newJoiners: employees.filter(e => new Date(e.joiningDate) >= newJoinerCutoff).length,
    }
  }, [employees])

  const managers = useMemo(
    () => employees.filter(e => employees.some(other => other.manager === e.id)),
    [employees]
  )

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(e => e.id)))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const sparklineData = {
    total: [45, 52, 48, 55, 60, 58, 62, 65, 63, 68, 70, 72],
    active: [38, 42, 40, 45, 48, 46, 50, 52, 51, 54, 56, 58],
    onLeave: [2, 2, 3, 2, 3, 4, 3, 4, 5, 4, 3, 4],
    newJoiners: [1, 1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 3],
  }

  const statCards = [
    {
      label: 'Total Employees',
      value: stats.total,
      icon: UsersIcon,
      tint: isDark ? 'bg-[#004D43]/20' : 'bg-[#ABE6D1]/40',
      iconColor: '#004D43',
      labelColor: isDark ? 'text-[#8FD9C4]' : 'text-[#004D43]',
      trend: 8.2,
      trendUp: true,
      spark: sparklineData.total,
    },
    {
      label: 'Active Employees',
      value: stats.active,
      icon: CheckCircleIcon,
      tint: isDark ? 'bg-[#00755A]/20' : 'bg-[#ABE6D1]/50',
      iconColor: '#00755A',
      labelColor: isDark ? 'text-[#8FD9C4]' : 'text-[#00543F]',
      trend: 3.5,
      trendUp: true,
      spark: sparklineData.active,
    },
    {
      label: 'On Leave',
      value: stats.onLeave,
      icon: ClockIcon,
      tint: isDark ? 'bg-[#5E93FF]/20' : 'bg-[#5E93FF]/15',
      iconColor: '#5E93FF',
      labelColor: isDark ? 'text-[#B4C6FF]' : 'text-[#1E3A8A]',
      trend: 1.2,
      trendUp: false,
      spark: sparklineData.onLeave,
    },
    {
      label: 'New Joiners',
      value: stats.newJoiners,
      icon: UserPlusIcon,
      tint: isDark ? 'bg-[#7A9A1E]/20' : 'bg-[#D0FF71]/25',
      iconColor: '#7A9A1E',
      labelColor: isDark ? 'text-[#C5E25C]' : 'text-[#4D6612]',
      trend: 12.1,
      trendUp: false,
      spark: sparklineData.newJoiners,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-extrabold ${textColor}`}>Employees</h1>
          <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>{stats.total} Employees</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${inputBg} w-56`}>
            <SearchIcon size={15} className={textSecondary} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className={`bg-transparent outline-none text-sm flex-1 ${textColor} placeholder:${textSecondary}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border ${borderColor} text-sm font-semibold transition-colors ${
              showFilters ? 'bg-[#00755A] text-white border-[#00755A]' : `${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`
            }`}
          >
            <FilterIcon size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/25 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border ${borderColor} text-sm font-semibold ${textColor} transition-colors ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
            <UploadIcon size={15} />
            Import
          </button>
          <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border ${borderColor} text-sm font-semibold ${textColor} transition-colors ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}>
            <DownloadIcon size={15} />
            Export
          </button>
          <Link
            href="/people/employees/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
          >
            <PlusIcon size={15} />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`p-4 rounded-xl border ${borderColor} ${card.tint} cursor-pointer transition-transform hover:-translate-y-0.5`}>
              <div className="flex items-start justify-between mb-2.5">
                <p className={`text-[11.5px] font-semibold uppercase tracking-[0.05em] ${card.labelColor}`}>{card.label}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${card.iconColor}22`, color: card.iconColor }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${textColor} mb-2.5`}>{card.value}</p>
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    card.trendUp
                      ? 'bg-[#10B981]/15 text-[#10B981]'
                      : 'bg-[#EF4444]/15 text-[#EF4444]'
                  }`}
                >
                  {card.trendUp ? <ArrowUpRightIcon size={12} /> : <ArrowDownRightIcon size={12} />}
                  {card.trend}%
                </div>
                <Sparkline data={card.spark} color={card.iconColor} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Saved Views */}
      <div className={`flex items-center gap-1 p-1 rounded-lg border ${borderColor} ${cardBg} w-fit flex-wrap`}>
        {savedViews.map(view => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeView === view.id
                ? 'bg-[#00755A] text-white'
                : `${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {view.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeView === view.id ? 'bg-white/25' : isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'
              }`}
            >
              {view.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} flex items-end gap-3 flex-wrap`}>
          <FilterSelect
            label="Department"
            value={filters.department}
            onChange={v => setFilters(f => ({ ...f, department: v }))}
            options={mockDepartments.map(d => d.name)}
            isDark={isDark}
          />
          <FilterSelect
            label="Designation"
            value={filters.designation}
            onChange={v => setFilters(f => ({ ...f, designation: v }))}
            options={mockDesignations.map(d => d.title)}
            isDark={isDark}
          />
          <FilterSelect
            label="Location"
            value={filters.location}
            onChange={v => setFilters(f => ({ ...f, location: v }))}
            options={mockLocations.map(l => l.name)}
            isDark={isDark}
          />
          <FilterSelect
            label="Manager"
            value={filters.manager}
            onChange={v => setFilters(f => ({ ...f, manager: v }))}
            options={managers.map(m => m.id)}
            optionLabels={managers.map(m => `${m.firstName} ${m.lastName}`)}
            isDark={isDark}
          />
          <FilterSelect
            label="Employment Type"
            value={filters.employmentType}
            onChange={v => setFilters(f => ({ ...f, employmentType: v }))}
            options={['Full Time', 'Contract', 'Intern']}
            isDark={isDark}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={v => setFilters(f => ({ ...f, status: v }))}
            options={['Active', 'On Leave', 'Probation', 'Inactive']}
            isDark={isDark}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ department: '', designation: '', location: '', manager: '', employmentType: '', status: '' })}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold ${textSecondary} hover:text-[#EF4444] transition-colors`}
            >
              <XIcon size={13} />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${borderColor} bg-[#00755A]/10`}>
          <p className={`text-sm font-semibold ${textColor}`}>{selected.size} selected</p>
          <div className="flex items-center gap-2">
            {['Export', 'Assign Department', 'Assign Manager', 'Activate', 'Deactivate', 'Send Email'].map(action => (
              <button
                key={action}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-white'} transition-colors`}
              >
                {action}
              </button>
            ))}
            <button onClick={() => setSelected(new Set())} className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-white'}`}>
              <XIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                {['Employee', 'Designation', 'Department', 'Location', 'Manager', 'Employment Type', 'Status', 'Joining Date', ''].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary} whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const manager = emp.manager ? managerById[emp.manager] : null
                const statusStyle = statusColors[emp.status]
                const typeStyle = employmentTypeColors[emp.employmentType]
                return (
                  <tr
                    key={emp.id}
                    className={`border-b ${borderColor} last:border-b-0 transition-colors cursor-pointer ${rowHover}`}
                    onClick={() => router.push(`/people/employees/${emp.id}`)}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(emp.id)}
                        onChange={() => toggleSelectOne(emp.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="w-8 h-8 rounded-full bg-[#004D43] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${textColor}`}>{emp.firstName} {emp.lastName}</p>
                          <p className={`text-[11px] font-medium ${textSecondary}`}>{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{emp.designation}</td>
                    <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{emp.department}</td>
                    <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textColor}`}>{emp.location}</td>
                    <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>
                      {manager ? `${manager.firstName} ${manager.lastName}` : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${typeStyle.bg} ${typeStyle.text}`}>
                        {emp.employmentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                        {emp.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${textSecondary}`}>{formatDate(emp.joiningDate)}</td>
                    <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuId(prev => (prev === emp.id ? null : emp.id))}
                        className={`p-1.5 rounded-md ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
                      >
                        <MoreVerticalIcon size={16} />
                      </button>
                      {openMenuId === emp.id && (
                        <div className={`absolute right-4 top-10 z-10 w-40 rounded-lg border ${borderColor} ${cardBg} shadow-lg py-1`}>
                          {['View', 'Edit', 'Transfer', 'Deactivate', 'Archive'].map(action => (
                            <button
                              key={action}
                              onClick={() => {
                                setOpenMenuId(null)
                                if (action === 'View') router.push(`/people/employees/${emp.id}`)
                              }}
                              className={`w-full text-left px-3 py-2 text-sm font-medium ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} ${
                                action === 'Deactivate' || action === 'Archive' ? 'text-[#EF4444]' : ''
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className={`text-sm font-medium ${textSecondary}`}>No employees match this view.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  optionLabels,
  isDark,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  optionLabels?: string[]
  isDark: boolean
}) {
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const bg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  return (
    <div className="flex flex-col gap-1">
      <label className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`px-3 py-2 rounded-lg border ${borderColor} ${bg} ${textColor} text-sm font-medium outline-none min-w-[150px]`}
      >
        <option value="">All</option>
        {options.map((opt, i) => (
          <option key={opt} value={opt}>
            {optionLabels ? optionLabels[i] : opt}
          </option>
        ))}
      </select>
    </div>
  )
}
