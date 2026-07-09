'use client'

import { useAuth } from '@/context/AuthContext'
import { useEmployee } from '@/context/EmployeeContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
} from 'recharts'
import { Sparkline } from '@/components/Sparkline'
import {
  UsersIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  WalletIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ExternalLinkIcon,
  activityIconMap,
} from '@/components/Icons'
import {
  mockLeaveRequests,
  headcountTrend,
  sparklineData,
  recentActivity,
  departmentColors,
} from '@/lib/mockData'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const { employees } = useEmployee()
  const router = useRouter()
  const { isDark } = useTheme()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const onLeaveToday = employees.filter(e => e.status === 'On Leave').length
  const pendingApprovals = mockLeaveRequests.filter(r => r.status === 'Pending').length
  const newHiresThisMonth = 3
  const payrollThisMonth = employees.reduce((sum, e) => sum + e.salary, 0) / 12 / 100000 // in lakhs

  const departments = [...new Set(employees.map(e => e.department))]
  const deptCounts = departments
    .map(dept => ({ name: dept, count: employees.filter(e => e.department === dept).length }))
    .sort((a, b) => b.count - a.count)
  const maxDeptCount = Math.max(...deptCounts.map(d => d.count))

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, 5)

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const gridColor = isDark ? '#27272A' : '#ABE6D1'

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
      label: 'Active Employees',
      value: activeEmployees.toLocaleString(),
      icon: CheckCircleIcon,
      tint: isDark ? 'bg-[#00755A]/20' : 'bg-[#ABE6D1]/50',
      iconColor: '#00755A',
      labelColor: isDark ? 'text-[#8FD9C4]' : 'text-[#00543F]',
      trend: 4.7,
      trendUp: true,
      spark: sparklineData.activeEmployees,
      link: '/people/employees',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.toLocaleString(),
      icon: ClipboardCheckIcon,
      // Complementary accent: Purple
      tint: isDark ? 'bg-[#5E93FF]/20' : 'bg-[#5E93FF]/15',
      iconColor: '#5E93FF',
      labelColor: isDark ? 'text-[#B4C6FF]' : 'text-[#1E3A8A]',
      trend: 12.1,
      trendUp: false,
      spark: sparklineData.pendingApprovals,
      link: '/requests',
    },
    {
      label: 'Payroll This Month',
      value: `₹${payrollThisMonth.toFixed(1)}L`,
      icon: WalletIcon,
      // Complementary accent: Lime — icon/text use a darkened shade of the
      // accent since the raw lime (#D0FF71) is too pale to read as text/icon fill
      tint: isDark ? 'bg-[#D0FF71]/20' : 'bg-[#D0FF71]/25',
      iconColor: '#7A9A1E',
      labelColor: isDark ? 'text-[#E3FFAE]' : 'text-[#4D6612]',
      trend: 6.3,
      trendUp: true,
      spark: sparklineData.payroll,
      link: '/payroll',
    },
  ]

  const statPills = [
    { icon: '📋', label: `${pendingApprovals} Pending approvals` },
    { icon: '🏖️', label: `${onLeaveToday} On leave today` },
    { icon: '👋', label: `${newHiresThisMonth} New hires this month` },
    { icon: '📈', label: `+${totalEmployees - 19} Employees this year` },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div
          className="relative overflow-hidden rounded-xl p-8 text-white"
          style={{ background: 'linear-gradient(135deg, #00755A 0%, #003D2E 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/10 blur-xl" />

          <div className="relative">
            <p className="text-xs font-medium opacity-90 mb-1">👋 Good morning</p>
            {/* Page Hero tier: 20px / 800 / tight line-height */}
            <h1 className="text-xl font-extrabold leading-tight mb-1">Welcome back, {user.firstName} {user.lastName}</h1>
            <p className="text-xs font-medium opacity-90 mb-5">Here&apos;s your HR snapshot for {today}</p>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <Link key={idx} href={kpi.link}>
                <div className={`p-5 rounded-xl border ${borderColor} ${kpi.tint} cursor-pointer transition-transform hover:-translate-y-0.5`}>
                  <div className="flex items-start justify-between mb-3">
                    {/* Field Label tier: 11.5px / 600 / uppercase / 0.05em tracking */}
                    <p className={`text-[11.5px] font-semibold uppercase tracking-[0.05em] ${kpi.labelColor}`}>{kpi.label}</p>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${kpi.iconColor}22`, color: kpi.iconColor }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${textColor} mb-3`}>{kpi.value}</p>
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Headcount Trend */}
          <div className={`lg:col-span-2 p-6 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className={`text-base font-bold ${textColor}`}>Headcount Trend</h2>
                <p className={`text-xs font-medium ${textSecondary} mt-0.5`}>Total employees · last 6 months</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981]">
                <ArrowUpRightIcon size={12} />
                31.6% growth
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={headcountTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#004D43" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#004D43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#71717A' : '#94A3B8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
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
                    dataKey="count"
                    stroke="#004D43"
                    strokeWidth={2.5}
                    fill="url(#headcountGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-base font-bold ${textColor}`}>Department Distribution</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-5`}>Active employees by department</p>

            <div className="space-y-3.5">
              {deptCounts.map(dept => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${textColor}`}>{dept.name}</span>
                    <span className={`text-xs font-semibold ${textSecondary}`}>{dept.count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'} overflow-hidden`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(dept.count / maxDeptCount) * 100}%`,
                        backgroundColor: departmentColors[dept.name] || '#004D43',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table + Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Employees */}
          <div className={`lg:col-span-2 p-6 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-base font-bold ${textColor}`}>Recent Employees</h2>
                <p className={`text-xs font-medium ${textSecondary} mt-0.5`}>{recentEmployees.length} latest joiners</p>
              </div>
              <Link href="/people/employees" className={`flex items-center gap-1 text-sm font-semibold text-[#004D43] hover:underline`}>
                View All
                <ExternalLinkIcon size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`text-left py-2 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textColor}`}>Employee</th>
                    <th className={`text-left py-2 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textColor}`}>Department</th>
                    <th className={`text-left py-2 pr-4 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textColor}`}>Status</th>
                    <th className={`text-left py-2 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${textColor}`}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map(emp => (
                    <tr key={emp.id} className={`border-b ${borderColor} last:border-0`}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#004D43] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            {/* Table Cell tier: 14px / 600 / navy */}
                            <p className={`text-sm font-semibold ${textColor} whitespace-nowrap`}>{emp.firstName} {emp.lastName}</p>
                            <p className="text-metadata">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`py-3 pr-4 text-sm font-semibold whitespace-nowrap ${textColor}`}>{emp.department}</td>
                      <td className="py-3 pr-4">
                        {/* Status Badge tier: 11.5px / 600 */}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${
                            emp.status === 'Active'
                              ? 'bg-[#10B981]/15 text-[#10B981]'
                              : emp.status === 'On Leave'
                              ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                              : emp.status === 'Probation'
                              ? 'bg-[#5E93FF]/15 text-[#5E93FF]'
                              : 'bg-[#94A3B8]/15 text-[#94A3B8]'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className={`py-3 text-sm font-semibold whitespace-nowrap ${textColor}`}>
                        {new Date(emp.joiningDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
            <h2 className={`text-base font-bold ${textColor}`}>Recent Activity</h2>
            <p className={`text-xs font-medium ${textSecondary} mt-0.5 mb-4`}>Live team updates</p>

            <div className="space-y-4">
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

            <Link href="/reports" className="flex items-center gap-1 text-sm font-semibold text-[#004D43] hover:underline mt-5">
              View all activity →
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
