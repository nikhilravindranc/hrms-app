import { mockEmployees } from '@/lib/mockData'

// ============================================================================
// SHIFTS (shift library)
// ============================================================================
export interface Shift {
  id: string
  name: string
  start: string
  end: string
  breakMinutes: number
  graceMinutes: number
  workingHours: number
  weeklyOff: string[]
  color: string
}

export const mockShifts: Shift[] = [
  { id: 'shift-001', name: 'Morning', start: '09:00', end: '18:00', breakMinutes: 60, graceMinutes: 10, workingHours: 8, weeklyOff: ['Sat', 'Sun'], color: '#00755A' },
  { id: 'shift-002', name: 'General', start: '09:30', end: '18:30', breakMinutes: 60, graceMinutes: 15, workingHours: 8, weeklyOff: ['Sat', 'Sun'], color: '#27EAA6' },
  { id: 'shift-003', name: 'Night', start: '22:00', end: '07:00', breakMinutes: 45, graceMinutes: 10, workingHours: 8.25, weeklyOff: ['Sat', 'Sun'], color: '#5E93FF' },
  { id: 'shift-004', name: 'Weekend', start: '10:00', end: '19:00', breakMinutes: 60, graceMinutes: 10, workingHours: 8, weeklyOff: ['Mon', 'Tue'], color: '#F59E0B' },
  { id: 'shift-005', name: 'Flexible', start: '11:00', end: '20:00', breakMinutes: 60, graceMinutes: 30, workingHours: 8, weeklyOff: ['Sat', 'Sun'], color: '#7A9A1E' },
]

// ============================================================================
// SHIFT ASSIGNMENTS
// ============================================================================
export interface ShiftAssignment {
  id: string
  employeeId: string
  shiftId: string
  effectiveFrom: string
  assignedBy: string
}

const shiftByDept: Record<string, string> = {
  IT: 'shift-003',
  Marketing: 'shift-005',
  Sales: 'shift-005',
}

export const mockShiftAssignments: ShiftAssignment[] = mockEmployees.map(e => ({
  id: `sa-${e.id}`,
  employeeId: e.id,
  shiftId: shiftByDept[e.department] ?? 'shift-001',
  effectiveFrom: '2026-01-01',
  assignedBy: 'Priya Sharma',
}))

export const upcomingShiftChanges = [
  { id: 'usc-1', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', fromShift: 'Morning', toShift: 'Flexible', effectiveFrom: '2026-08-01' },
  { id: 'usc-2', employeeId: 'EMP-022', employeeName: 'Vikram Kumar', fromShift: 'General', toShift: 'Night', effectiveFrom: '2026-08-05' },
]

export const shiftConflicts = [
  { id: 'conflict-1', employeeId: 'EMP-017', employeeName: 'Rohan Banerjee', detail: 'Assigned to both Flexible and Weekend shifts starting Aug 1', severity: 'high' as const },
]

// ============================================================================
// TODAY'S ATTENDANCE (per-employee snapshot for today)
// ============================================================================
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'WFH' | 'On Leave'

export interface TodayAttendance {
  employeeId: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  workedHours: number
  overtime: number
  lateMinutes: number
}

const todayStatusMap: Record<string, AttendanceStatus> = {
  'EMP-003': 'WFH', 'EMP-015': 'WFH', 'EMP-017': 'WFH', 'EMP-022': 'WFH',
  'EMP-025': 'Late',
  'EMP-012': 'On Leave', 'EMP-018': 'On Leave', 'EMP-021': 'On Leave',
  'EMP-020': 'Absent', 'EMP-024': 'Absent',
}

function buildTodayAttendance(): TodayAttendance[] {
  return mockEmployees.map(e => {
    const status = todayStatusMap[e.id] ?? 'Present'
    switch (status) {
      case 'Present':
        return { employeeId: e.id, status, checkIn: '09:12', checkOut: '18:20', workedHours: 8.6, overtime: 0.3, lateMinutes: 0 }
      case 'WFH':
        return { employeeId: e.id, status, checkIn: '09:05', checkOut: '18:40', workedHours: 8.9, overtime: 0.5, lateMinutes: 0 }
      case 'Late':
        return { employeeId: e.id, status, checkIn: '10:18', checkOut: '18:30', workedHours: 7.8, overtime: 0, lateMinutes: 48 }
      case 'Absent':
        return { employeeId: e.id, status, checkIn: null, checkOut: null, workedHours: 0, overtime: 0, lateMinutes: 0 }
      case 'On Leave':
        return { employeeId: e.id, status, checkIn: null, checkOut: null, workedHours: 0, overtime: 0, lateMinutes: 0 }
    }
  })
}

export const todayAttendance = buildTodayAttendance()

// Employees who haven't checked in yet as-of-now (subset flagged for the Attention Center)
export const notCheckedInIds = ['EMP-020', 'EMP-024', 'EMP-012', 'EMP-018', 'EMP-021', 'EMP-006', 'EMP-016']

// ============================================================================
// ATTENDANCE CORRECTIONS
// ============================================================================
export interface AttendanceCorrection {
  id: string
  employeeId: string
  employeeName: string
  date: string
  field: 'Check In' | 'Check Out' | 'Status'
  oldValue: string
  requestedValue: string
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approver: string
  submittedDate: string
  history: { action: string; by: string; date: string }[]
}

export const mockAttendanceCorrections: AttendanceCorrection[] = [
  {
    id: 'corr-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', date: '2026-07-18',
    field: 'Check In', oldValue: '10:45 AM', requestedValue: '09:15 AM', reason: 'Biometric device was down at the Mumbai office entrance.',
    status: 'Pending', approver: 'Arjun Reddy', submittedDate: '2026-07-19',
    history: [{ action: 'Submitted', by: 'Rohit Iyer', date: '2026-07-19' }],
  },
  {
    id: 'corr-002', employeeId: 'EMP-016', employeeName: 'Sophia Fernandes', date: '2026-07-17',
    field: 'Status', oldValue: 'Absent', requestedValue: 'WFH', reason: 'Worked from home, forgot to mark WFH before the day ended.',
    status: 'Pending', approver: 'Divya Nair', submittedDate: '2026-07-18',
    history: [{ action: 'Submitted', by: 'Sophia Fernandes', date: '2026-07-18' }],
  },
  {
    id: 'corr-003', employeeId: 'EMP-021', employeeName: 'Aryan Mishra', date: '2026-07-10',
    field: 'Check Out', oldValue: '—', requestedValue: '06:30 PM', reason: 'Left after biometric already logged out due to network issue.',
    status: 'Approved', approver: 'Neha Verma', submittedDate: '2026-07-11',
    history: [
      { action: 'Submitted', by: 'Aryan Mishra', date: '2026-07-11' },
      { action: 'Approved', by: 'Neha Verma', date: '2026-07-12' },
    ],
  },
  {
    id: 'corr-004', employeeId: 'EMP-013', employeeName: 'Karan Chopra', date: '2026-07-08',
    field: 'Check In', oldValue: '11:30 AM', requestedValue: '09:00 AM', reason: 'Client visit in the morning, was marked late incorrectly.',
    status: 'Rejected', approver: 'Arjun Reddy', submittedDate: '2026-07-09',
    history: [
      { action: 'Submitted', by: 'Karan Chopra', date: '2026-07-09' },
      { action: 'Rejected', by: 'Arjun Reddy', date: '2026-07-10' },
    ],
  },
]

// ============================================================================
// LEAVE TYPES
// ============================================================================
export interface LeaveType {
  id: string
  name: string
  category: 'Paid' | 'Unpaid'
  defaultDays: number
  carryForward: boolean
  encashable: boolean
}

export const mockLeaveTypes: LeaveType[] = [
  { id: 'lt-001', name: 'Annual', category: 'Paid', defaultDays: 18, carryForward: true, encashable: true },
  { id: 'lt-002', name: 'Sick', category: 'Paid', defaultDays: 12, carryForward: false, encashable: false },
  { id: 'lt-003', name: 'Casual', category: 'Paid', defaultDays: 6, carryForward: false, encashable: false },
  { id: 'lt-004', name: 'Comp Off', category: 'Paid', defaultDays: 0, carryForward: false, encashable: false },
  { id: 'lt-005', name: 'Loss of Pay', category: 'Unpaid', defaultDays: 0, carryForward: false, encashable: false },
  { id: 'lt-006', name: 'Maternity', category: 'Paid', defaultDays: 182, carryForward: false, encashable: false },
  { id: 'lt-007', name: 'Paternity', category: 'Paid', defaultDays: 15, carryForward: false, encashable: false },
]

// ============================================================================
// LEAVE POLICIES
// ============================================================================
export interface LeavePolicy {
  id: string
  leaveTypeId: string
  eligibility: string
  accrual: string
  carryForward: string
  encashment: string
  noticePeriod: string
  blackoutDates: string
  approvalRules: string
}

export const mockLeavePolicies: LeavePolicy[] = [
  { id: 'lp-001', leaveTypeId: 'lt-001', eligibility: 'All full-time employees after probation', accrual: '1.5 days/month', carryForward: 'Up to 10 days to next year', encashment: 'Up to 5 days at year-end', noticePeriod: '3 working days', blackoutDates: 'Dec 20 – Jan 2', approvalRules: 'Manager approval required' },
  { id: 'lp-002', leaveTypeId: 'lt-002', eligibility: 'All employees', accrual: '1 day/month', carryForward: 'Not allowed', encashment: 'Not allowed', noticePeriod: 'Same day with medical note if 3+ days', blackoutDates: 'None', approvalRules: 'Auto-approved, manager notified' },
  { id: 'lp-003', leaveTypeId: 'lt-003', eligibility: 'All employees', accrual: '0.5 days/month', carryForward: 'Not allowed', encashment: 'Not allowed', noticePeriod: '1 working day', blackoutDates: 'Month-end close week (Finance)', approvalRules: 'Manager approval required' },
  { id: 'lp-004', leaveTypeId: 'lt-004', eligibility: 'Employees who worked an approved weekend/holiday shift', accrual: 'Earned per approved extra shift', carryForward: '90 days from earning', encashment: 'Not allowed', noticePeriod: 'None', blackoutDates: 'None', approvalRules: 'Manager approval required' },
  { id: 'lp-005', leaveTypeId: 'lt-005', eligibility: 'All employees, once paid leave exhausted', accrual: 'Not applicable', carryForward: 'Not applicable', encashment: 'Not allowed', noticePeriod: '3 working days', blackoutDates: 'None', approvalRules: 'Manager + HR approval required' },
  { id: 'lp-006', leaveTypeId: 'lt-006', eligibility: 'Female employees, 80+ days worked in preceding 12 months', accrual: 'Full block on approval', carryForward: 'Not applicable', encashment: 'Not allowed', noticePeriod: '30 days advance notice', blackoutDates: 'None', approvalRules: 'HR approval required' },
  { id: 'lp-007', leaveTypeId: 'lt-007', eligibility: 'Male employees, confirmed', accrual: 'Full block on approval', carryForward: 'Not applicable', encashment: 'Not allowed', noticePeriod: '15 days advance notice', blackoutDates: 'None', approvalRules: 'Manager + HR approval required' },
]

// ============================================================================
// LEAVE BALANCE
// ============================================================================
export interface LeaveBalance {
  employeeId: string
  leaveTypeId: string
  total: number
  used: number
}

export const mockLeaveBalances: LeaveBalance[] = mockEmployees.flatMap(e => [
  { employeeId: e.id, leaveTypeId: 'lt-001', total: 18, used: [3, 5, 8, 12, 2, 6, 9][e.id.charCodeAt(6) % 7] },
  { employeeId: e.id, leaveTypeId: 'lt-002', total: 12, used: [1, 2, 4, 0, 3, 5, 2][e.id.charCodeAt(6) % 7] },
  { employeeId: e.id, leaveTypeId: 'lt-003', total: 6, used: [0, 1, 2, 3, 1, 2, 0][e.id.charCodeAt(6) % 7] },
])

// ============================================================================
// LEAVE REQUESTS (full workspace version)
// ============================================================================
export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveTypeId: string
  leaveTypeName: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  appliedDate: string
  approver: string
}

export const mockWorkforceLeaveRequests: LeaveRequest[] = [
  { id: 'wlr-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', leaveTypeId: 'lt-001', leaveTypeName: 'Annual', startDate: '2026-08-03', endDate: '2026-08-07', days: 5, reason: 'Family trip', status: 'Pending', appliedDate: '2026-07-19', approver: 'Arjun Reddy' },
  { id: 'wlr-002', employeeId: 'EMP-016', employeeName: 'Sophia Fernandes', leaveTypeId: 'lt-003', leaveTypeName: 'Casual', startDate: '2026-07-24', endDate: '2026-07-26', days: 3, reason: 'Personal work', status: 'Pending', appliedDate: '2026-07-20', approver: 'Divya Nair' },
  { id: 'wlr-003', employeeId: 'EMP-003', employeeName: 'Rahul Desai', leaveTypeId: 'lt-001', leaveTypeName: 'Annual', startDate: '2026-08-10', endDate: '2026-08-14', days: 5, reason: 'Wedding', status: 'Pending', appliedDate: '2026-07-20', approver: 'Priya Sharma' },
  { id: 'wlr-004', employeeId: 'EMP-012', employeeName: 'Anjali Malik', leaveTypeId: 'lt-002', leaveTypeName: 'Sick', startDate: '2026-07-19', endDate: '2026-07-20', days: 2, reason: 'Fever', status: 'Approved', appliedDate: '2026-07-18', approver: 'Arjun Reddy' },
  { id: 'wlr-005', employeeId: 'EMP-021', employeeName: 'Aryan Mishra', leaveTypeId: 'lt-002', leaveTypeName: 'Sick', startDate: '2026-07-20', endDate: '2026-07-21', days: 2, reason: 'Cold & flu', status: 'Approved', appliedDate: '2026-07-19', approver: 'Neha Verma' },
  { id: 'wlr-006', employeeId: 'EMP-018', employeeName: 'Zara Kapoor', leaveTypeId: 'lt-003', leaveTypeName: 'Casual', startDate: '2026-07-20', endDate: '2026-07-20', days: 1, reason: 'Personal', status: 'Approved', appliedDate: '2026-07-18', approver: 'Divya Nair' },
  { id: 'wlr-007', employeeId: 'EMP-013', employeeName: 'Karan Chopra', leaveTypeId: 'lt-001', leaveTypeName: 'Annual', startDate: '2026-07-05', endDate: '2026-07-06', days: 2, reason: 'Not enough balance', status: 'Rejected', appliedDate: '2026-07-01', approver: 'Arjun Reddy' },
  { id: 'wlr-008', employeeId: 'EMP-020', employeeName: 'Pooja Singh', leaveTypeId: 'lt-003', leaveTypeName: 'Casual', startDate: '2026-06-28', endDate: '2026-06-28', days: 1, reason: 'Plans changed', status: 'Cancelled', appliedDate: '2026-06-25', approver: 'Neha Verma' },
]

// ============================================================================
// HOLIDAYS
// ============================================================================
export interface Holiday {
  id: string
  name: string
  date: string
  type: 'National' | 'Regional' | 'Company' | 'Optional'
  locations: string[]
}

export const mockHolidays: Holiday[] = [
  { id: 'hol-001', name: 'Republic Day', date: '2026-01-26', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-002', name: 'Holi', date: '2026-03-04', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-003', name: 'Ugadi', date: '2026-03-19', type: 'Regional', locations: ['Bangalore'] },
  { id: 'hol-004', name: 'Good Friday', date: '2026-04-03', type: 'Optional', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-005', name: 'Independence Day', date: '2026-08-15', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-006', name: 'Ganesh Chaturthi', date: '2026-09-14', type: 'Regional', locations: ['Mumbai'] },
  { id: 'hol-007', name: 'Gandhi Jayanti', date: '2026-10-02', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-008', name: 'Dussehra', date: '2026-10-20', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-009', name: 'Diwali', date: '2026-11-08', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-010', name: 'Founders Day', date: '2026-11-20', type: 'Company', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
  { id: 'hol-011', name: 'Christmas', date: '2026-12-25', type: 'National', locations: ['Bangalore', 'Delhi', 'Mumbai'] },
]

// ============================================================================
// ATTENTION CENTER (Today's Workforce landing page)
// ============================================================================
export interface AttentionItem {
  id: string
  label: string
  count: number
  actionLabel: string
  href: string
}

export const attentionItems: AttentionItem[] = [
  { id: 'not-checked-in', label: "Employees haven't checked in", count: notCheckedInIds.length, actionLabel: 'Review', href: '/operations/attendance?filter=not-checked-in' },
  { id: 'leave-pending', label: 'Leave requests waiting', count: mockWorkforceLeaveRequests.filter(r => r.status === 'Pending').length, actionLabel: 'Open', href: '/operations/leave?view=Pending' },
  { id: 'corrections-pending', label: 'Attendance corrections', count: mockAttendanceCorrections.filter(c => c.status === 'Pending').length, actionLabel: 'Review', href: '/operations/attendance-corrections?tab=Pending' },
  { id: 'shift-conflict', label: 'Shift conflict', count: shiftConflicts.length, actionLabel: 'Resolve', href: '/operations/shift-assignments?tab=employee&highlight=' + shiftConflicts[0]?.employeeId },
]

// ============================================================================
// WORKFORCE RECENT ACTIVITY
// ============================================================================
export const workforceActivity = [
  { id: 1, icon: 'edit', title: 'Attendance corrected: Aryan Mishra', actor: 'Neha Verma', time: '2h ago' },
  { id: 2, icon: 'check', title: 'Leave approved: Anjali Malik', actor: 'Arjun Reddy', time: '4h ago' },
  { id: 3, icon: 'clipboard', title: 'Shift assigned: Vikram Kumar → Night', actor: 'Sneha Gupta', time: '6h ago' },
  { id: 4, icon: 'calendar', title: 'Holiday added: Founders Day', actor: 'Priya Sharma', time: '1d ago' },
  { id: 5, icon: 'check', title: 'Leave approved: Zara Kapoor', actor: 'Divya Nair', time: '1d ago' },
  { id: 6, icon: 'edit', title: 'Attendance correction rejected: Karan Chopra', actor: 'Arjun Reddy', time: '2d ago' },
]
