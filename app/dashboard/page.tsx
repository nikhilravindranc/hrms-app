'use client'

import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Sparkline } from '@/components/Sparkline'
import {
  UsersIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ExternalLinkIcon,
  activityIconMap,
  CalendarIcon,
  CakeIcon,
  TrophyIcon,
  EditIcon,
  ReceiptIcon,
  UserPlusIcon,
  UploadIcon,
  CashIcon,
  MegaphoneIcon,
  FileTextIcon,
} from '@/components/Icons'
import {
  sparklineData,
  recentActivity,
  departmentColors,
  locationColors,
  employmentTypeColors,
  todaysWorkforce,
  pendingApprovalsBreakdown,
  attendanceTrend,
  upcomingBirthdays,
  upcomingAnniversaries,
  newJoiners,
  probationEnding,
  quickActions,
  type UpcomingEvent,
} from '@/lib/mockData'

const pendingIconMap = {
  calendar: CalendarIcon,
  edit: EditIcon,
  receipt: ReceiptIcon,
}

const quickActionIconMap = {
  'user-plus': UserPlusIcon,
  upload: UploadIcon,
  check: CheckCircleIcon,
  cash: CashIcon,
  megaphone: MegaphoneIcon,
  'file-text': FileTextIcon,
}

type DistributionTab = 'department' | 'location' | 'employmentType'

type IconComponent = React.FC<{ size?: number; className?: string }>

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { employees } = useEmployee()
  const router = useRouter()
  const { isDark } = useTheme()
  const [distributionTab, setDistributionTab] = useState<DistributionTab>('department')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated || !user) {
    return null
  }

  const totalEmployees = employees.length
  const newHiresThisMonth = 3

  const presentCount = todaysWorkforce.find(w => w.label === 'Present')?.count ?? 0
  const wfhCount = todaysWorkforce.find(w => w.label === 'WFH')?.count ?? 0
  const lateCount = todaysWorkforce.find(w => w.label === 'Late')?.count ?? 0
  const onLeaveCount = todaysWorkforce.find(w => w.label === 'On Leave')?.count ?? 0
  const presentTodayTotal = presentCount + wfhCount + lateCount
  const presentPct = Math.round((presentTodayTotal / totalEmployees) * 100)
  const pendingApprovalsTotal = pendingApprovalsBreakdown.reduce((sum, g) => sum + g.count, 0)

  const departments = [...new Set(employees.map(e => e.department))]
  const deptCounts = departments
    .map(dept => ({ name: dept, count: employees.filter(e => e.department === dept).length }))
    .sort((a, b) => b.count - a.count)

  const locations = [...new Set(employees.map(e => e.location))]
  const locationCounts = locations
    .map(loc => ({ name: loc, count: employees.filter(e => e.location === loc).length }))
    .sort((a, b) => b.count - a.count)

  const employmentTypes = [...new Set(employees.map(e => e.employmentType))]
  const employmentTypeCounts = employmentTypes
    .map(type => ({ name: type, count: employees.filter(e => e.employmentType === type).length }))
    .sort((a, b) => b.count - a.count)

  const distributionData = {
    department: { data: deptCounts, colors: departmentColors },
    location: { data: locationCounts, colors: locationColors },
    employmentType: { data: employmentTypeCounts, colors: employmentTypeColors },
  }[distributionTab]
  const maxDistributionCount = Math.max(...distributionData.data.map(d => d.count))

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const kpis = [
    {
      label: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      icon: UsersIcon,
      tint: isDark ? 'bg-[#004D43]/20' : 'bg-[#ABE6D1]/40',
      iconColor: '#004D43',
      labelColor: isDark ? 'text-[#8FD9C4]' : 'text-[#004D43]',
      trend: 8.2,
      trendUp: true,
      spark: sparklineData.totalEmployees,
      link: '/people/employees',
    },
    {
      label: 'Present Today',
      value: presentTodayTotal.toLocaleString(),
      icon: CheckCircleIcon,
      tint: isDark ? 'bg-[#00755A]/20' : 'bg-[#ABE6D1]/50',
      iconColor: '#00755A',
      labelColor: isDark ? 'text-[#8FD9C4]' : 'text-[#00543F]',
      trend: 3.5,
      trendUp: true,
      spark: sparklineData.activeEmployees,
      link: '/workforce/attendance',
    },
    {
      label: 'On Leave',
      value: onLeaveCount.toLocaleString(),
      icon: ClockIcon,
      tint: isDark ? 'bg-[#5E93FF]/20' : 'bg-[#5E93FF]/15',
      iconColor: '#5E93FF',
      labelColor: isDark ? 'text-[#B4C6FF]' : 'text-[#1E3A8A]',
      trend: 1.2,
      trendUp: false,
      spark: sparklineData.onLeave,
      link: '/workforce/attendance',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovalsTotal.toLocaleString(),
      icon: ClipboardCheckIcon,
      tint: isDark ? 'bg-[#D0FF71]/20' : 'bg-[#D0FF71]/25',
      iconColor: '#7A9A1E',
      labelColor: isDark ? 'text-[#E3FFAE]' : 'text-[#4D6612]',
      trend: 12.1,
      trendUp: false,
      spark: sparklineData.pendingApprovals,
      link: '/requests',
    },
  ]

  const statPills = [
    { icon: '📋', label: `${pendingApprovalsTotal} Pending approvals` },
    { icon: '🏖️', label: `${onLeaveCount} On leave today` },
    { icon: '👋', label: `${newHiresThisMonth} New hires this month` },
    { icon: '📈', label: `+${totalEmployees - 19} Employees this year` },
  ]

  const distributionTabs: { id: DistributionTab; label: string }[] = [
    { id: 'department', label: 'By Department' },
    { id: 'location', label: 'By Location' },
    { id: 'employmentType', label: 'By Employment Type' },
  ]

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Welcome Banner */}
        <div
          className="relative overflow-hidden rounded-xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #00755A 0%, #003D2E 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/10 blur-xl" />

          <div className="relative">
            <p className="text-xs font-medium opacity-90 mb-1">👋 Good morning</p>
            <h1 className="text-xl font-extrabold leading-tight mb-1">Welcome back, {user.firstName} {user.lastName}</h1>
            <p className="text-xs font-medium opacity-90 mb-4">Here&apos;s your HR snapshot for {today}</p>

            <div className="flex flex-wrap gap-3">
              {statPills.map((pill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium"
                >
                  <span>{pill.icon}</span>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <Link key={idx} href={kpi.link}>
                <div className={`p-4 rounded-xl border ${borderColor} ${kpi.tint} cursor-pointer transition-transform hover:-translate-y-0.5`}>
                  <div className="flex items-start justify-between mb-2.5">
                    {/* Field Label tier: 11.5px / 600 / uppercase / 0.05em tracking */}
                    <p className={`text-[11.5px] font-semibold uppercase tracking-[0.05em] ${kpi.labelColor}`}>{kpi.label}</p>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${kpi.iconColor}22`, color: kpi.iconColor }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${textColor} mb-2.5`}>{kpi.value}</p>
                  <div className="flex items-center justify-between">
                    {/* Tag/Pill tier: 12px / 500 */}
                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        kpi.trendUp
                          ? 'bg-[#10B981]/15 text-[#10B981]'
                          : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}
                    >
                      {kpi.trendUp ? <ArrowUpRightIcon size={12} /> : <ArrowDownRightIcon size={12} />}
                      {kpi.trend}%
                    </div>
                    <Sparkline data={kpi.spark} color={kpi.iconColor} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Row 2: Today's Workforce + Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Today's Workforce */}
          <div className={`lg:col-span-2 p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className={`text-base font-bold ${textColor}`}>Today&apos;s Workforce</h2>
                <p className={`text-xs font-medium ${textSecondary} mt-0.5`}>Live attendance snapshot</p>
              </div>
              <Link href="/workforce/attendance" className="flex items-center gap-1 text-sm font-semibold text-[#004D43] hover:underline">
                View All
                <ExternalLinkIcon size={13} />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 mt-3">
              <div className="relative w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={todaysWorkforce}
                      dataKey="count"
                      nameKey="label"
                      innerRadius="68%"
                      outerRadius="100%"
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {todaysWorkforce.map(w => (
                        <Cell key={w.label} fill={w.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        border: `1px solid ${isDark ? '#27272A' : '#E3F2F0'}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className={`text-2xl font-extrabold ${textColor}`}>{presentPct}%</p>
                  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Present</p>
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-2 gap-3">
                {todaysWorkforce.map((w, idx) => (
                  <div
                    key={w.label}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'} ${
                      idx === todaysWorkforce.length - 1 && todaysWorkforce.length % 2 === 1 ? 'col-span-2' : ''
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: w.color }} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11.5px] font-medium truncate ${textSecondary}`}>{w.label}</p>
                      <p className={`text-base font-bold ${textColor}`}>{w.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg} flex flex-col`}>
            <h2 className={`text-base font-bold ${textColor}`}>Pending Approvals</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-4`}>Awaiting your review</p>

            <div className="space-y-2.5 flex-1">
              {pendingApprovalsBreakdown.map(group => {
                const Icon = pendingIconMap[group.icon]
                return (
                  <Link
                    key={group.id}
                    href="/requests"
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} transition-colors ${
                      isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#E8EFF6]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                      <Icon size={16} className="text-[#00755A]" />
                    </div>
                    <p className={`text-sm font-semibold flex-1 ${textColor}`}>{group.type}</p>
                    <span className="w-6 h-6 rounded-full bg-[#5E93FF]/15 text-[#5E93FF] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {group.count}
                    </span>
                  </Link>
                )
              })}
            </div>

            <Link
              href="/requests"
              className="mt-4 w-full py-2.5 rounded-lg text-center text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
            >
              Review All
            </Link>
          </div>
        </div>

        {/* Row 3: Attendance Trend + Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Attendance Trend */}
          <div className={`lg:col-span-2 p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className={`text-base font-bold ${textColor}`}>Attendance Trend</h2>
                <p className={`text-xs font-medium ${textSecondary} mt-0.5`}>Last 30 days</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981]">
                <ArrowUpRightIcon size={12} />
                Trending up
              </div>
            </div>

            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#004D43" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#004D43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                    tick={{ fill: isDark ? '#71717A' : '#94A3B8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[70, 100]}
                    tick={{ fill: isDark ? '#71717A' : '#94A3B8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#27272A' : '#E3F2F0'}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#004D43"
                    strokeWidth={2.5}
                    fill="url(#attendanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-base font-bold ${textColor}`}>Upcoming Events</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-4`}>Next 30 days</p>

            <div className="space-y-3">
              <EventSection icon={CakeIcon} label="Birthdays" events={upcomingBirthdays} isDark={isDark} textColor={textColor} textSecondary={textSecondary} />
              <EventSection icon={TrophyIcon} label="Work Anniversaries" events={upcomingAnniversaries} isDark={isDark} textColor={textColor} textSecondary={textSecondary} />
              <EventSection icon={UserPlusIcon} label="New Joiners" events={newJoiners} isDark={isDark} textColor={textColor} textSecondary={textSecondary} />
              <EventSection icon={CalendarIcon} label="Probation Ending" events={probationEnding} isDark={isDark} textColor={textColor} textSecondary={textSecondary} />
            </div>
          </div>
        </div>

        {/* Row 4: Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Quick Actions */}
          <div className={`lg:col-span-2 p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-base font-bold ${textColor}`}>Quick Actions</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-4`}>Common tasks, one click away</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map(action => {
                const Icon = quickActionIconMap[action.icon]
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className={`flex flex-col items-start gap-3 p-4 rounded-xl border ${borderColor} transition-colors ${
                      isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#E8EFF6]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
                      <Icon size={17} />
                    </div>
                    <p className={`text-sm font-semibold ${textColor}`}>{action.label}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-base font-bold ${textColor}`}>Recent Activity</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-4`}>Live team updates</p>

            <div className="space-y-3">
              {recentActivity.map(activity => {
                const Icon = activityIconMap[activity.icon]
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
                      <Icon size={15} className="text-[#004D43]" />
                    </div>
                    <div className="min-w-0">
                      {/* Body/Value tier: 14px / 600 */}
                      <p className={`text-sm font-semibold ${textColor}`}>{activity.title}</p>
                      <p className="text-metadata mt-0.5">{activity.actor} · {activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link href="/reports" className="flex items-center gap-1 text-sm font-semibold text-[#004D43] hover:underline mt-4">
              View all activity →
            </Link>
          </div>
        </div>

        {/* Row 5: Employee Distribution */}
        <div className={`p-5 rounded-xl border ${borderColor} ${cardBg}`}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className={`text-base font-bold ${textColor}`}>Employee Distribution</h2>
              <p className={`text-xs font-medium ${textSecondary} mt-0.5`}>Headcount breakdown</p>
            </div>
            <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#E8EFF6]'}`}>
              {distributionTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDistributionTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    distributionTab === tab.id
                      ? 'bg-[#00755A] text-white'
                      : isDark
                      ? 'text-[#9CA3AF] hover:text-[#D4D4D8]'
                      : 'text-[#94A3B8] hover:text-[#0C2472]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5">
            {distributionData.data.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${textColor}`}>{item.name}</span>
                  <span className={`text-xs font-semibold ${textSecondary}`}>{item.count}</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'} overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / maxDistributionCount) * 100}%`,
                      backgroundColor: distributionData.colors[item.name] || '#004D43',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function EventSection({
  icon: Icon,
  label,
  events,
  isDark,
  textColor,
  textSecondary,
}: {
  icon: IconComponent
  label: string
  events: UpcomingEvent[]
  isDark: boolean
  textColor: string
  textSecondary: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'}`}>
          <Icon size={13} className="text-[#00755A]" />
        </div>
        <p className={`text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>{label}</p>
      </div>
      <div className="space-y-1.5 pl-8">
        {events.map(event => (
          <div key={event.id} className="flex items-center justify-between gap-2">
            <p className={`text-xs font-medium truncate ${textColor}`}>{event.name}</p>
            <span className={`text-[11px] font-semibold flex-shrink-0 ${textSecondary}`}>{event.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
