// Mock Data - 25 Employees
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  designation: string
  department: string
  location: string
  manager: string | null
  employmentType: 'Full Time' | 'Contract' | 'Intern'
  status: 'Active' | 'On Leave' | 'Probation' | 'Inactive'
  joiningDate: Date
  salary: number
}

export interface Organization {
  id: string
  name: string
  industry: string
  country: string
  timezone: string
  currency: string
}

// Create employee helper
let joinDateCounter = 0
const joinDates = [
  '2023-01-15', '2023-02-20', '2023-03-10', '2023-04-05', '2023-05-18',
  '2023-06-22', '2023-07-30', '2023-08-14', '2023-09-09', '2023-10-25',
  '2023-11-12', '2023-12-01', '2024-01-08', '2024-01-22', '2024-02-14',
  '2024-02-28', '2024-03-15', '2024-04-02', '2024-04-19', '2024-05-06',
  '2024-05-21', '2024-06-03', '2024-06-17', '2024-07-01', '2024-07-15',
]

const createEmp = (
  id: string,
  firstName: string,
  lastName: string,
  designation: string,
  department: string,
  location: string,
  manager: string | null,
  status: 'Active' | 'On Leave' | 'Probation' | 'Inactive' = 'Active',
  salary: number = 1000000
): Employee => ({
  id,
  firstName,
  lastName,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@evoq.com`,
  mobile: '+91 98765 43210',
  designation,
  department,
  location,
  manager,
  employmentType: 'Full Time',
  status,
  joiningDate: new Date(joinDates[joinDateCounter++ % joinDates.length]),
  salary,
})

// 25 Mock Employees
export const mockEmployees: Employee[] = [
  // Leadership (10)
  createEmp('EMP-001', 'John', 'Anderson', 'CEO', 'Operations', 'Bangalore', null, 'Active', 5000000),
  createEmp('EMP-002', 'Priya', 'Sharma', 'Manager', 'HR', 'Bangalore', 'EMP-001', 'Active', 1800000),
  createEmp('EMP-003', 'Rahul', 'Desai', 'Executive', 'HR', 'Delhi', 'EMP-002', 'Active', 900000),
  createEmp('EMP-004', 'Amrita', 'Patel', 'Manager', 'Finance', 'Bangalore', 'EMP-001', 'Active', 2000000),
  createEmp('EMP-005', 'Vikram', 'Singh', 'Officer', 'Finance', 'Bangalore', 'EMP-004', 'Active', 700000),
  createEmp('EMP-006', 'Sneha', 'Gupta', 'Manager', 'IT', 'Bangalore', 'EMP-001', 'Active', 2200000),
  createEmp('EMP-007', 'Arjun', 'Reddy', 'Manager', 'Sales', 'Mumbai', 'EMP-001', 'Active', 1700000),
  createEmp('EMP-008', 'Divya', 'Nair', 'Manager', 'Marketing', 'Bangalore', 'EMP-001', 'Active', 1600000),
  createEmp('EMP-009', 'Suresh', 'Kumar', 'Manager', 'Operations', 'Bangalore', 'EMP-001', 'Active', 1500000),
  createEmp('EMP-010', 'Neha', 'Verma', 'Manager', 'Support', 'Delhi', 'EMP-001', 'Active', 1400000),

  // Sales Team (5)
  createEmp('EMP-011', 'Rohit', 'Iyer', 'Executive', 'Sales', 'Mumbai', 'EMP-007', 'Active', 800000),
  createEmp('EMP-012', 'Anjali', 'Malik', 'Executive', 'Sales', 'Mumbai', 'EMP-007', 'On Leave', 750000),
  createEmp('EMP-013', 'Karan', 'Chopra', 'Associate', 'Sales', 'Mumbai', 'EMP-007', 'Active', 600000),
  createEmp('EMP-014', 'Aisha', 'Khan', 'Executive', 'Sales', 'Mumbai', 'EMP-007', 'Active', 700000),
  createEmp('EMP-015', 'Manish', 'Rao', 'Associate', 'Sales', 'Mumbai', 'EMP-007', 'Active', 550000),

  // Marketing Team (3)
  createEmp('EMP-016', 'Sophia', 'Fernandes', 'Executive', 'Marketing', 'Bangalore', 'EMP-008', 'Active', 900000),
  createEmp('EMP-017', 'Rohan', 'Banerjee', 'Coordinator', 'Marketing', 'Bangalore', 'EMP-008', 'Probation', 500000),
  createEmp('EMP-018', 'Zara', 'Kapoor', 'Executive', 'Marketing', 'Bangalore', 'EMP-008', 'Active', 800000),

  // Support Team (3)
  createEmp('EMP-019', 'Pradeep', 'Patil', 'Executive', 'Support', 'Delhi', 'EMP-010', 'Active', 650000),
  createEmp('EMP-020', 'Pooja', 'Singh', 'Associate', 'Support', 'Delhi', 'EMP-010', 'Probation', 450000),
  createEmp('EMP-021', 'Aryan', 'Mishra', 'Coordinator', 'Support', 'Delhi', 'EMP-010', 'On Leave', 550000),

  // IT Team (3)
  createEmp('EMP-022', 'Vikram', 'Kumar', 'Developer', 'IT', 'Bangalore', 'EMP-006', 'Active', 1200000),
  createEmp('EMP-023', 'Riya', 'Agarwal', 'Developer', 'IT', 'Bangalore', 'EMP-006', 'Active', 1100000),
  createEmp('EMP-024', 'Abhishek', 'Verma', 'Developer', 'IT', 'Bangalore', 'EMP-006', 'Active', 950000),

  // Finance Associate (1)
  createEmp('EMP-025', 'Sneha', 'Tiwari', 'Associate', 'Finance', 'Bangalore', 'EMP-004', 'Inactive', 680000),
]

// Diversify a few employment types so "By Employment Type" distribution is meaningful
const employmentTypeOverrides: Record<string, Employee['employmentType']> = {
  'EMP-013': 'Contract',
  'EMP-015': 'Contract',
  'EMP-020': 'Intern',
  'EMP-021': 'Intern',
}
mockEmployees.forEach(emp => {
  if (employmentTypeOverrides[emp.id]) {
    emp.employmentType = employmentTypeOverrides[emp.id]
  }
})

export const mockOrganization: Organization = {
  id: 'org-001',
  name: 'EVOQ HR Systems',
  industry: 'Software/HR Tech',
  country: 'India',
  timezone: 'IST',
  currency: 'INR',
}

export const mockDepartments = [
  { id: 'dept-001', name: 'HR' },
  { id: 'dept-002', name: 'Finance' },
  { id: 'dept-003', name: 'Sales' },
  { id: 'dept-004', name: 'Marketing' },
  { id: 'dept-005', name: 'Operations' },
  { id: 'dept-006', name: 'Support' },
  { id: 'dept-007', name: 'IT' },
]

export const mockLocations = [
  { id: 'loc-001', name: 'Bangalore' },
  { id: 'loc-002', name: 'Delhi' },
  { id: 'loc-003', name: 'Mumbai' },
]

// ============================================================================
// LEAVE REQUESTS (for pending approvals badge + dashboard)
// ============================================================================
export interface LeaveRequestSummary {
  id: string
  employeeId: string
  employeeName: string
  type: string
  days: number
  status: 'Pending' | 'Approved' | 'Rejected'
  appliedDate: Date
}

export const mockLeaveRequests: LeaveRequestSummary[] = [
  { id: 'leave-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', type: 'Annual', days: 5, status: 'Pending', appliedDate: new Date('2024-07-20') },
  { id: 'leave-002', employeeId: 'EMP-016', employeeName: 'Sophia Fernandes', type: 'Personal', days: 3, status: 'Pending', appliedDate: new Date('2024-07-22') },
  { id: 'leave-003', employeeId: 'EMP-003', employeeName: 'Rahul Desai', type: 'Annual', days: 5, status: 'Pending', appliedDate: new Date('2024-07-23') },
  { id: 'leave-004', employeeId: 'EMP-012', employeeName: 'Anjali Malik', type: 'Sick', days: 2, status: 'Approved', appliedDate: new Date('2024-07-10') },
  { id: 'leave-005', employeeId: 'EMP-021', employeeName: 'Aryan Mishra', type: 'Sick', days: 2, status: 'Approved', appliedDate: new Date('2024-07-05') },
]

// ============================================================================
// HEADCOUNT TREND (last 6 months, for dashboard chart)
// ============================================================================
export const headcountTrend = [
  { month: 'Feb \'24', count: 19 },
  { month: 'Mar \'24', count: 20 },
  { month: 'Apr \'24', count: 21 },
  { month: 'May \'24', count: 22 },
  { month: 'Jun \'24', count: 24 },
  { month: 'Jul \'24', count: 25 },
]

// ============================================================================
// SPARKLINE DATA (small trend lines inside KPI cards)
// ============================================================================
export const sparklineData = {
  totalEmployees: [18, 19, 19, 20, 21, 22, 24, 25],
  activeEmployees: [16, 17, 17, 18, 19, 19, 20, 20],
  pendingApprovals: [2, 4, 3, 5, 4, 6, 3, 3],
  payroll: [14, 15, 15, 16, 16, 17, 18, 18.6],
  onLeave: [4, 3, 5, 4, 3, 4, 3, 3],
}

// ============================================================================
// RECENT ACTIVITY FEED
// ============================================================================
export const recentActivity = [
  { id: 1, icon: 'check', title: 'Leave request approved: Anjali Malik', actor: 'Arjun Reddy', time: '5m ago' },
  { id: 2, icon: 'user-plus', title: 'New employee added: Sophia Fernandes', actor: 'Admin', time: '23m ago' },
  { id: 3, icon: 'edit', title: 'Employee record updated: Karan Chopra', actor: 'Priya Sharma', time: '1h ago' },
  { id: 4, icon: 'task', title: 'Task: Review payroll done', actor: 'Vikram Singh', time: '2h ago' },
  { id: 5, icon: 'cash', title: 'Payroll processed for July', actor: 'Admin', time: '3h ago' },
]

// ============================================================================
// DEPARTMENT BAR COLORS (for distribution chart)
// ============================================================================
export const departmentColors: Record<string, string> = {
  HR: '#003D2E',
  Finance: '#004D43',
  Sales: '#00755A',
  Marketing: '#27EAA6',
  Operations: '#7A9A1E',
  Support: '#5E93FF',
  IT: '#2E4A99',
}

export const locationColors: Record<string, string> = {
  Bangalore: '#00755A',
  Delhi: '#5E93FF',
  Mumbai: '#7A9A1E',
}

export const employmentTypeColors: Record<string, string> = {
  'Full Time': '#00755A',
  Contract: '#5E93FF',
  Intern: '#7A9A1E',
}

// ============================================================================
// TODAY'S WORKFORCE SNAPSHOT (attendance status breakdown)
// ============================================================================
export interface WorkforceStatus {
  label: string
  count: number
  color: string
}

export const todaysWorkforce: WorkforceStatus[] = [
  { label: 'Present', count: 15, color: '#00755A' },
  { label: 'WFH', count: 4, color: '#27EAA6' },
  { label: 'Late', count: 1, color: '#F59E0B' },
  { label: 'On Leave', count: 3, color: '#5E93FF' },
  { label: 'Absent', count: 2, color: '#EF4444' },
]

// ============================================================================
// PENDING APPROVALS BREAKDOWN (actionable queue)
// ============================================================================
export interface PendingApprovalGroup {
  id: string
  type: string
  count: number
  icon: 'calendar' | 'edit' | 'receipt'
}

export const pendingApprovalsBreakdown: PendingApprovalGroup[] = [
  { id: 'leave', type: 'Leave Requests', count: 3, icon: 'calendar' },
  { id: 'attendance', type: 'Attendance Correction', count: 1, icon: 'edit' },
  { id: 'expense', type: 'Expense Claim', count: 1, icon: 'receipt' },
]

// ============================================================================
// ATTENDANCE TREND (last 30 days, % present)
// ============================================================================
const attendancePctSeries = [
  82, 84, 83, 85, 87, 86, 88, 90, 89, 91,
  90, 92, 91, 93, 92, 94, 93, 95, 94, 96,
  95, 94, 96, 95, 97, 96, 95, 97, 96, 98,
]
export const attendanceTrend = attendancePctSeries.map((present, i) => ({
  day: `${i + 1}`,
  present,
}))

// ============================================================================
// UPCOMING EVENTS (birthdays, anniversaries, new joiners, probation ending)
// ============================================================================
export interface UpcomingEvent {
  id: string
  name: string
  detail: string
  date: string
}

export const upcomingBirthdays: UpcomingEvent[] = [
  { id: 'b1', name: 'Riya Agarwal', detail: 'IT · Developer', date: 'Jul 18' },
  { id: 'b2', name: 'Karan Chopra', detail: 'Sales · Associate', date: 'Jul 22' },
]

export const upcomingAnniversaries: UpcomingEvent[] = [
  { id: 'a1', name: 'Divya Nair', detail: '3 years · Marketing', date: 'Jul 20' },
  { id: 'a2', name: 'Neha Verma', detail: '3 years · Support', date: 'Jul 25' },
]

export const newJoiners: UpcomingEvent[] = [
  { id: 'n1', name: 'Sneha Tiwari', detail: 'Finance · Associate', date: 'Jul 15' },
  { id: 'n2', name: 'Abhishek Verma', detail: 'IT · Developer', date: 'Jul 1' },
]

export const probationEnding: UpcomingEvent[] = [
  { id: 'p1', name: 'Rohan Banerjee', detail: 'Marketing · Coordinator', date: 'Sep 15' },
  { id: 'p2', name: 'Pooja Singh', detail: 'Support · Associate', date: 'Nov 6' },
]

// ============================================================================
// QUICK ACTIONS (dashboard shortcuts)
// ============================================================================
export interface QuickAction {
  id: string
  label: string
  icon: 'user-plus' | 'upload' | 'check' | 'cash' | 'megaphone' | 'file-text'
  href: string
}

export const quickActions: QuickAction[] = [
  { id: 'add-employee', label: 'Add Employee', icon: 'user-plus', href: '/people/employees/new' },
  { id: 'import-employees', label: 'Import Employees', icon: 'upload', href: '/people/employees' },
  { id: 'mark-attendance', label: 'Mark Attendance', icon: 'check', href: '/workforce/attendance' },
  { id: 'run-payroll', label: 'Run Payroll', icon: 'cash', href: '/payroll' },
  { id: 'create-announcement', label: 'Create Announcement', icon: 'megaphone', href: '/reports' },
  { id: 'generate-report', label: 'Generate Report', icon: 'file-text', href: '/reports' },
]
