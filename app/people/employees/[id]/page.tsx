'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { mockLeaveRequests } from '@/lib/mockData'
import {
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  MailIcon,
  EditIcon,
  MoreVerticalIcon,
} from '@/components/Icons'

type TabId = 'overview' | 'employment' | 'attendance' | 'leave' | 'payroll' | 'documents' | 'activity'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'employment', label: 'Employment' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'leave', label: 'Leave' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity' },
]

// Deterministic pseudo-random 0..1 from a string seed, so attendance-style
// illustrative numbers stay stable across renders instead of using Math.random()
function seededRatio(seed: string, salt: number) {
  let h = salt
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 997
  }
  return (h % 100) / 100
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { isDark } = useTheme()
  const { getEmployee, employees } = useEmployee()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const employee = getEmployee(id)

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  const manager = employee?.manager ? getEmployee(employee.manager) : undefined
  const directReports = useMemo(
    () => (employee ? employees.filter(e => e.manager === employee.id) : []),
    [employee, employees]
  )
  const leaveHistory = useMemo(
    () => (employee ? mockLeaveRequests.filter(r => r.employeeId === employee.id) : []),
    [employee]
  )

  if (!employee) {
    return (
      <div className={`p-8 rounded-xl border ${borderColor} ${cardBg} text-center`}>
        <p className={`text-sm font-semibold ${textColor}`}>Employee not found.</p>
        <Link href="/people/employees" className={`text-sm font-semibold ${isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} hover:underline mt-2 inline-block`}>
          ← Back to Employees
        </Link>
      </div>
    )
  }

  const attendancePct = 82 + Math.round(seededRatio(employee.id, 7) * 16) // 82-97%
  const leaveBalance = 6 + Math.round(seededRatio(employee.id, 3) * 14) // 6-19 days
  const presentDays = 18 + Math.round(seededRatio(employee.id, 11) * 4)
  const lateEntries = Math.round(seededRatio(employee.id, 19) * 4)
  const overtimeHrs = Math.round(seededRatio(employee.id, 23) * 12)
  const wfhDays = Math.round(seededRatio(employee.id, 29) * 6)

  const statusStyleMap: Record<string, { bg: string; text: string }> = {
    Active: { bg: 'bg-[#10B981]/15', text: 'text-[#10B981]' },
    'On Leave': { bg: 'bg-[#5E93FF]/15', text: 'text-[#5E93FF]' },
    Probation: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' },
    Inactive: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
  }
  const statusStyle = statusStyleMap[employee.status]

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const summaryCards = [
    { label: 'Joined Date', value: formatDate(employee.joiningDate), icon: CalendarIcon },
    { label: 'Manager', value: manager ? `${manager.firstName} ${manager.lastName}` : '—', icon: UsersIcon },
    { label: 'Attendance %', value: `${attendancePct}%`, icon: CheckCircleIcon },
    { label: 'Leave Balance', value: `${leaveBalance} days`, icon: ClockIcon },
    { label: 'Employment Type', value: employee.employmentType, icon: ClipboardCheckIcon },
  ]

  return (
    <div className="space-y-5">
      <Link href="/people/employees" className={`text-xs font-semibold ${textSecondary} ${isDark ? 'hover:text-[#27EAA6]' : 'hover:text-[#004D43]'}`}>
        ← Back to Employees
      </Link>

      {/* Header */}
      <div className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#004D43] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-lg font-extrabold ${textColor}`}>{employee.firstName} {employee.lastName}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                  {employee.status}
                </span>
              </div>
              <p className={`text-sm font-medium mt-0.5 ${textSecondary}`}>
                {employee.id} · {employee.designation} · {employee.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border ${borderColor} text-sm font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}>
              <EditIcon size={15} />
              Edit
            </button>
            <button className={`p-2 rounded-lg border ${borderColor} ${textSecondary} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} transition-colors`}>
              <MoreVerticalIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#00755A]" />
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{card.label}</p>
              </div>
              <p className={`text-base font-bold truncate ${textColor}`}>{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 border-b ${borderColor} overflow-x-auto`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#00755A] text-[#00755A]'
                : `border-transparent ${textSecondary} ${isDark ? 'hover:text-[#D4D4D8]' : 'hover:text-[#0C2472]'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Personal Information</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <Field label="Name" value={`${employee.firstName} ${employee.lastName}`} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Gender" value="—" textColor={textColor} textSecondary={textSecondary} />
              <Field label="Date of Birth" value="—" textColor={textColor} textSecondary={textSecondary} />
              <Field label="Email" value={employee.email} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Mobile" value={employee.mobile} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Emergency Contact" value="—" textColor={textColor} textSecondary={textSecondary} />
              <Field label="Address" value="—" textColor={textColor} textSecondary={textSecondary} span2 />
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Employment Information</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <Field label="Employee ID" value={employee.id} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Department" value={employee.department} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Designation" value={employee.designation} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Manager" value={manager ? `${manager.firstName} ${manager.lastName}` : '—'} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Joining Date" value={formatDate(employee.joiningDate)} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Employment Type" value={employee.employmentType} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Location" value={employee.location} textColor={textColor} textSecondary={textSecondary} />
            </div>

            {directReports.length > 0 && (
              <div className={`mt-5 pt-4 border-t ${borderColor}`}>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.05em] mb-2 ${textSecondary}`}>
                  Direct Reports ({directReports.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {directReports.map(r => (
                    <Link
                      key={r.id}
                      href={`/people/employees/${r.id}`}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${borderColor} text-xs font-semibold ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-[#004D43] text-white text-[9px] font-bold flex items-center justify-center">
                        {r.firstName[0]}{r.lastName[0]}
                      </span>
                      {r.firstName} {r.lastName}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'employment' && (
        <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
          <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Career History</h2>
          <div className="space-y-4">
            <TimelineRow
              icon={UsersIcon}
              title={`Joined as ${employee.designation}`}
              subtitle={`${employee.department} · ${employee.location}`}
              date={formatDate(employee.joiningDate)}
              textColor={textColor}
              textSecondary={textSecondary}
              isDark={isDark}
            />
            {employee.status === 'Probation' ? (
              <TimelineRow
                icon={ClockIcon}
                title="On probation"
                subtitle="Confirmation pending"
                date="Ongoing"
                textColor={textColor}
                textSecondary={textSecondary}
                isDark={isDark}
              />
            ) : (
              <TimelineRow
                icon={CheckCircleIcon}
                title="Confirmed as permanent employee"
                subtitle="Probation completed"
                date={formatDate(employee.joiningDate)}
                textColor={textColor}
                textSecondary={textSecondary}
                isDark={isDark}
              />
            )}
          </div>
          <p className={`text-xs font-medium mt-5 ${textSecondary}`}>
            Promotions, transfers, reporting changes and salary revisions will appear here as they happen.
          </p>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Present Days" value={`${presentDays}/22`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
            <MiniStat label="Late Entries" value={`${lateEntries}`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
            <MiniStat label="Overtime" value={`${overtimeHrs} hrs`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
            <MiniStat label="WFH Days" value={`${wfhDays}`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
          </div>
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-sm font-bold mb-1 ${textColor}`}>Attendance Calendar</h2>
            <p className={`text-xs font-medium ${textSecondary}`}>Detailed daily attendance calendar will appear here.</p>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MiniStat label="Leave Balance" value={`${leaveBalance} days`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
            <MiniStat label="Taken This Year" value={`${leaveHistory.reduce((s, r) => s + r.days, 0)} days`} textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
            <MiniStat label="Upcoming Leave" value="None scheduled" textColor={textColor} textSecondary={textSecondary} borderColor={borderColor} cardBg={cardBg} />
          </div>
          <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${borderColor}`}>
              <h2 className={`text-sm font-bold ${textColor}`}>Leave History</h2>
            </div>
            {leaveHistory.length === 0 ? (
              <p className={`text-sm font-medium px-5 py-8 text-center ${textSecondary}`}>No leave requests on record.</p>
            ) : (
              <div className="divide-y" style={{ borderColor: isDark ? '#27272A' : '#D4E8E0' }}>
                {leaveHistory.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className={`text-sm font-semibold ${textColor}`}>{r.type} Leave</p>
                      <p className={`text-xs font-medium ${textSecondary}`}>{r.days} day{r.days > 1 ? 's' : ''} · Applied {formatDate(r.appliedDate)}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                        r.status === 'Approved' ? 'bg-[#10B981]/15 text-[#10B981]' :
                        r.status === 'Pending' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${borderColor} ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'} flex items-center gap-2`}>
            <ClipboardCheckIcon size={14} className={textSecondary} />
            <p className={`text-xs font-medium ${textSecondary}`}>Payroll information is permission-based and visible to HR Admins only.</p>
          </div>
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Salary Structure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
              <Field label="Annual CTC" value={`₹${employee.salary.toLocaleString('en-IN')}`} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Basic (50%)" value={`₹${Math.round(employee.salary * 0.5).toLocaleString('en-IN')}`} textColor={textColor} textSecondary={textSecondary} />
              <Field label="HRA (30%)" value={`₹${Math.round(employee.salary * 0.3).toLocaleString('en-IN')}`} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Other Allowances (20%)" value={`₹${Math.round(employee.salary * 0.2).toLocaleString('en-IN')}`} textColor={textColor} textSecondary={textSecondary} />
              <Field label="Benefits" value="Health Insurance, PF" textColor={textColor} textSecondary={textSecondary} />
              <Field label="Deductions" value="PF, Professional Tax" textColor={textColor} textSecondary={textSecondary} />
            </div>
          </div>
          <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${borderColor}`}>
              <h2 className={`text-sm font-bold ${textColor}`}>Payslips</h2>
            </div>
            <div className="divide-y" style={{ borderColor: isDark ? '#27272A' : '#D4E8E0' }}>
              {['June 2026', 'May 2026', 'April 2026'].map(month => (
                <div key={month} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileTextIcon size={15} className="text-[#00755A]" />
                    <p className={`text-sm font-medium ${textColor}`}>Payslip - {month}</p>
                  </div>
                  <button className={`text-xs font-semibold ${isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} hover:underline`}>Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
          <div className="divide-y" style={{ borderColor: isDark ? '#27272A' : '#D4E8E0' }}>
            {['Offer Letter', 'Contract', 'ID Proof', 'Certificates', 'Other Documents'].map(doc => (
              <div key={doc} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                    <FileTextIcon size={16} className="text-[#00755A]" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textColor}`}>{doc}</p>
                    <p className={`text-xs font-medium ${textSecondary}`}>Not uploaded</p>
                  </div>
                </div>
                <button className={`text-xs font-semibold ${isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} hover:underline`}>Upload</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
          <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Activity Log</h2>
          <div className="space-y-4">
            <TimelineRow
              icon={UsersIcon}
              title="Employee Created"
              subtitle={`Added to ${employee.department} as ${employee.designation}`}
              date={formatDate(employee.joiningDate)}
              textColor={textColor}
              textSecondary={textSecondary}
              isDark={isDark}
            />
            <TimelineRow
              icon={EditIcon}
              title="Profile Updated"
              subtitle="Contact information updated"
              date={formatDate(new Date())}
              textColor={textColor}
              textSecondary={textSecondary}
              isDark={isDark}
            />
            <TimelineRow
              icon={MailIcon}
              title="Welcome email sent"
              subtitle={`Sent to ${employee.email}`}
              date={formatDate(employee.joiningDate)}
              textColor={textColor}
              textSecondary={textSecondary}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  textColor,
  textSecondary,
  span2,
}: {
  label: string
  value: string
  textColor: string
  textSecondary: string
  span2?: boolean
}) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-1`}>{label}</p>
      <p className={`text-sm font-semibold ${textColor}`}>{value}</p>
    </div>
  )
}

function MiniStat({
  label,
  value,
  textColor,
  textSecondary,
  borderColor,
  cardBg,
}: {
  label: string
  value: string
  textColor: string
  textSecondary: string
  borderColor: string
  cardBg: string
}) {
  return (
    <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
      <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] mb-1.5 ${textSecondary}`}>{label}</p>
      <p className={`text-lg font-bold ${textColor}`}>{value}</p>
    </div>
  )
}

function TimelineRow({
  icon: Icon,
  title,
  subtitle,
  date,
  textColor,
  textSecondary,
  isDark,
}: {
  icon: React.FC<{ size?: number; className?: string }>
  title: string
  subtitle: string
  date: string
  textColor: string
  textSecondary: string
  isDark: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
        <Icon size={15} className={isDark ? 'text-[#27EAA6]' : 'text-[#004D43]'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
        <p className={`text-xs font-medium ${textSecondary}`}>{subtitle}</p>
      </div>
      <span className={`text-[11px] font-semibold flex-shrink-0 ${textSecondary}`}>{date}</span>
    </div>
  )
}
