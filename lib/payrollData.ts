import { mockEmployees, Employee } from '@/lib/mockData'

// ============================================================================
// SALARY STRUCTURES (templates)
// ============================================================================
export interface SalaryStructure {
  id: string
  name: string
  description: string
  basicPercent: number // % of gross
  hraPercent: number // % of basic
  bonusPercent: number // annual, % of basic
  employerPFPercent: number
  employerESIPercent: number
  employeePFPercent: number
  employeeESIPercent: number
  professionalTaxMonthly: number
}

export const mockSalaryStructures: SalaryStructure[] = [
  { id: 'ss-operations', name: 'Operations', description: 'Standard structure for operations & support staff', basicPercent: 50, hraPercent: 40, bonusPercent: 8.33, employerPFPercent: 12, employerESIPercent: 3.25, employeePFPercent: 12, employeeESIPercent: 0.75, professionalTaxMonthly: 200 },
  { id: 'ss-sales', name: 'Sales', description: 'Higher variable component with incentive alignment', basicPercent: 45, hraPercent: 40, bonusPercent: 15, employerPFPercent: 12, employerESIPercent: 3.25, employeePFPercent: 12, employeeESIPercent: 0.75, professionalTaxMonthly: 200 },
  { id: 'ss-management', name: 'Management', description: 'Leadership and managerial band compensation', basicPercent: 40, hraPercent: 50, bonusPercent: 20, employerPFPercent: 12, employerESIPercent: 0, employeePFPercent: 12, employeeESIPercent: 0, professionalTaxMonthly: 200 },
  { id: 'ss-factory', name: 'Factory Staff', description: 'Wage-linked structure for on-site production staff', basicPercent: 55, hraPercent: 30, bonusPercent: 8.33, employerPFPercent: 12, employerESIPercent: 3.25, employeePFPercent: 12, employeeESIPercent: 0.75, professionalTaxMonthly: 200 },
  { id: 'ss-contract', name: 'Contract', description: 'Fixed consolidated pay, no statutory benefits', basicPercent: 100, hraPercent: 0, bonusPercent: 0, employerPFPercent: 0, employerESIPercent: 0, employeePFPercent: 0, employeeESIPercent: 0, professionalTaxMonthly: 0 },
]

function structureForEmployee(e: Employee): string {
  if (e.employmentType === 'Contract' || e.employmentType === 'Intern') return 'ss-contract'
  if (e.designation === 'CEO' || e.designation === 'Manager') return 'ss-management'
  if (e.department === 'Sales') return 'ss-sales'
  return 'ss-operations'
}

// ============================================================================
// EMPLOYEE COMPENSATION
// ============================================================================
export interface CompensationHistoryEntry {
  effectiveDate: string
  grossSalary: number
  reason: string
}

export interface CompensationRecord {
  employeeId: string
  salaryStructureId: string
  effectiveDate: string
  grossSalary: number // annual
  bankAccount: string | null
  taxRegime: 'Old' | 'New'
  costCenter: string
  history: CompensationHistoryEntry[]
}

const missingBankIds = new Set(['EMP-020', 'EMP-021', 'EMP-024', 'EMP-018', 'EMP-025'])
const pendingRevisionIds = new Set(['EMP-011', 'EMP-013', 'EMP-016', 'EMP-019', 'EMP-022', 'EMP-023', 'EMP-014', 'EMP-017'])

export const mockCompensation: CompensationRecord[] = mockEmployees.map(e => ({
  employeeId: e.id,
  salaryStructureId: structureForEmployee(e),
  effectiveDate: '2026-04-01',
  grossSalary: e.salary,
  bankAccount: missingBankIds.has(e.id) ? null : `HDFC •••• ${(1000 + e.id.charCodeAt(6) * 37) % 9000 + 1000}`,
  taxRegime: e.id.charCodeAt(6) % 2 === 0 ? 'New' : 'Old',
  costCenter: `${e.department} – ${e.location}`,
  history: [
    { effectiveDate: '2025-04-01', grossSalary: Math.round(e.salary * 0.91 / 1000) * 1000, reason: 'Annual appraisal' },
    { effectiveDate: '2026-04-01', grossSalary: e.salary, reason: 'Annual appraisal' },
  ],
}))

export const salaryRevisionsPending = mockEmployees.filter(e => pendingRevisionIds.has(e.id))
export const employeesMissingBank = mockEmployees.filter(e => missingBankIds.has(e.id))

// ============================================================================
// PAYROLL RUN (current month)
// ============================================================================
export type PayrollRunStatus = 'Draft' | 'Calculated' | 'Locked' | 'Approved' | 'Processed'

export interface PayrollRunLine {
  employeeId: string
  gross: number // monthly
  deductions: number
  netPay: number
  status: 'Pending' | 'Calculated' | 'Approved' | 'Paid'
}

function buildRunLine(e: Employee): PayrollRunLine {
  const gross = Math.round(e.salary / 12)
  const structure = mockSalaryStructures.find(s => s.id === structureForEmployee(e))!
  const basic = Math.round(gross * (structure.basicPercent / 100))
  const pf = Math.round(basic * (structure.employeePFPercent / 100))
  const esi = Math.round(basic * (structure.employeeESIPercent / 100))
  const deductions = pf + esi + structure.professionalTaxMonthly
  return {
    employeeId: e.id,
    gross,
    deductions,
    netPay: gross - deductions,
    status: 'Calculated',
  }
}

export const currentPayrollRun: {
  id: string
  month: string
  status: PayrollRunStatus
  cutOffDate: string
  payDate: string
  lines: PayrollRunLine[]
} = {
  id: 'run-2026-07',
  month: 'July 2026',
  status: 'Calculated',
  cutOffDate: '2026-07-25',
  payDate: '2026-07-31',
  lines: mockEmployees.map(buildRunLine),
}

export const payrollTotals = {
  gross: currentPayrollRun.lines.reduce((sum, l) => sum + l.gross, 0),
  deductions: currentPayrollRun.lines.reduce((sum, l) => sum + l.deductions, 0),
  net: currentPayrollRun.lines.reduce((sum, l) => sum + l.netPay, 0),
}

// ============================================================================
// PAYROLL HISTORY (archive)
// ============================================================================
export interface PayrollHistoryEntry {
  id: string
  month: string
  status: 'Processed'
  totalNet: number
  employeeCount: number
  processedDate: string
}

export const payrollHistory: PayrollHistoryEntry[] = [
  { id: 'hist-2026-06', month: 'June 2026', status: 'Processed', totalNet: 2350000, employeeCount: 25, processedDate: '2026-06-30' },
  { id: 'hist-2026-05', month: 'May 2026', status: 'Processed', totalNet: 2280000, employeeCount: 24, processedDate: '2026-05-31' },
  { id: 'hist-2026-04', month: 'April 2026', status: 'Processed', totalNet: 2210000, employeeCount: 24, processedDate: '2026-04-30' },
  { id: 'hist-2026-03', month: 'March 2026', status: 'Processed', totalNet: 2080000, employeeCount: 23, processedDate: '2026-03-31' },
  { id: 'hist-2026-02', month: 'February 2026', status: 'Processed', totalNet: 2020000, employeeCount: 23, processedDate: '2026-02-28' },
  { id: 'hist-2026-01', month: 'January 2026', status: 'Processed', totalNet: 1980000, employeeCount: 23, processedDate: '2026-01-31' },
]

// ============================================================================
// REIMBURSEMENTS
// ============================================================================
export interface Reimbursement {
  id: string
  employeeId: string
  employeeName: string
  category: 'Travel' | 'Food' | 'Internet' | 'Medical' | 'Other'
  amount: number
  description: string
  submittedDate: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
}

export const mockReimbursements: Reimbursement[] = [
  { id: 'reim-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', category: 'Travel', amount: 4200, description: 'Client visit — Mumbai to Pune cab fare', submittedDate: '2026-07-15', status: 'Pending' },
  { id: 'reim-002', employeeId: 'EMP-016', employeeName: 'Sophia Fernandes', category: 'Internet', amount: 1200, description: 'Monthly broadband reimbursement — WFH', submittedDate: '2026-07-17', status: 'Pending' },
  { id: 'reim-003', employeeId: 'EMP-022', employeeName: 'Vikram Kumar', category: 'Food', amount: 850, description: 'Team dinner — sprint completion', submittedDate: '2026-07-18', status: 'Pending' },
  { id: 'reim-004', employeeId: 'EMP-007', employeeName: 'Arjun Reddy', category: 'Travel', amount: 6800, description: 'Flight — Bangalore to Mumbai for QBR', submittedDate: '2026-07-10', status: 'Approved' },
  { id: 'reim-005', employeeId: 'EMP-004', employeeName: 'Amrita Patel', category: 'Medical', amount: 2500, description: 'Annual health checkup reimbursement', submittedDate: '2026-07-05', status: 'Paid' },
  { id: 'reim-006', employeeId: 'EMP-013', employeeName: 'Karan Chopra', category: 'Other', amount: 3000, description: 'Client gift — exceeds policy limit', submittedDate: '2026-06-28', status: 'Rejected' },
  { id: 'reim-007', employeeId: 'EMP-006', employeeName: 'Sneha Gupta', category: 'Internet', amount: 1200, description: 'Monthly broadband reimbursement — WFH', submittedDate: '2026-06-20', status: 'Paid' },
]

// ============================================================================
// BONUSES & ADJUSTMENTS
// ============================================================================
export interface BonusAdjustment {
  id: string
  employeeId: string
  employeeName: string
  type: 'Bonus' | 'Incentive' | 'Variable Pay' | 'Arrears' | 'Recovery' | 'One-time Payment'
  amount: number
  month: string
  status: 'Pending' | 'Approved' | 'Processed'
  reason: string
}

export const mockBonusAdjustments: BonusAdjustment[] = [
  { id: 'badj-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', type: 'Incentive', amount: 15000, month: 'July 2026', status: 'Pending', reason: 'Q2 sales target achieved' },
  { id: 'badj-002', employeeId: 'EMP-006', employeeName: 'Sneha Gupta', type: 'Bonus', amount: 50000, month: 'July 2026', status: 'Approved', reason: 'Annual performance bonus' },
  { id: 'badj-003', employeeId: 'EMP-014', employeeName: 'Aisha Khan', type: 'Variable Pay', amount: 12000, month: 'July 2026', status: 'Pending', reason: 'Quarterly variable payout' },
  { id: 'badj-004', employeeId: 'EMP-021', employeeName: 'Aryan Mishra', type: 'Arrears', amount: 8000, month: 'June 2026', status: 'Processed', reason: 'Salary revision arrears — Apr to Jun' },
  { id: 'badj-005', employeeId: 'EMP-013', employeeName: 'Karan Chopra', type: 'Recovery', amount: -3000, month: 'July 2026', status: 'Approved', reason: 'Excess leave encashment recovery' },
  { id: 'badj-006', employeeId: 'EMP-023', employeeName: 'Riya Agarwal', type: 'One-time Payment', amount: 5000, month: 'July 2026', status: 'Pending', reason: 'Referral bonus — successful hire' },
]

// ============================================================================
// STATUTORY DEDUCTIONS (configurable, country-scoped)
// ============================================================================
export interface StatutoryDeduction {
  id: string
  country: string
  name: string
  employeeContribution: string
  employerContribution: string
  applicability: string
  cap: string
  enabled: boolean
}

export const mockStatutoryDeductions: StatutoryDeduction[] = [
  { id: 'sd-pf', country: 'India', name: 'Provident Fund (PF)', employeeContribution: '12% of Basic', employerContribution: '12% of Basic', applicability: 'All employees on Operations/Sales/Management/Factory structures', cap: 'Basic capped at ₹15,000/month for statutory minimum', enabled: true },
  { id: 'sd-esi', country: 'India', name: 'Employee State Insurance (ESI)', employeeContribution: '0.75% of Gross', employerContribution: '3.25% of Gross', applicability: 'Employees with gross salary ≤ ₹21,000/month', cap: 'Not applicable above wage ceiling', enabled: true },
  { id: 'sd-pt', country: 'India', name: 'Professional Tax', employeeContribution: '₹200/month (state-dependent)', employerContribution: 'None', applicability: 'All employees, varies by work location state', cap: 'Max ₹2,500/year per state law', enabled: true },
  { id: 'sd-tds', country: 'India', name: 'Tax Deducted at Source (TDS)', employeeContribution: 'As per income tax slab', employerContribution: 'None', applicability: 'All employees above taxable income threshold', cap: 'Governed by declared tax regime', enabled: true },
  { id: 'sd-lwf', country: 'India', name: 'Labour Welfare Fund (LWF)', employeeContribution: '₹20/half-year (state-dependent)', employerContribution: '₹40/half-year (state-dependent)', applicability: 'Applicable in Karnataka, Maharashtra, Delhi', cap: 'Fixed per state notification', enabled: false },
]

// ============================================================================
// TAX DECLARATIONS
// ============================================================================
export interface TaxDeclaration {
  id: string
  employeeId: string
  employeeName: string
  financialYear: string
  category: 'Investments (80C)' | 'HRA' | 'Home Loan' | 'Insurance' | 'Other Exemptions'
  declaredAmount: number
  proofStatus: 'Pending' | 'Verified' | 'Rejected'
  submittedDate: string
}

export const mockTaxDeclarations: TaxDeclaration[] = [
  { id: 'td-001', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', financialYear: '2026-27', category: 'Investments (80C)', declaredAmount: 150000, proofStatus: 'Verified', submittedDate: '2026-06-10' },
  { id: 'td-002', employeeId: 'EMP-011', employeeName: 'Rohit Iyer', financialYear: '2026-27', category: 'HRA', declaredAmount: 240000, proofStatus: 'Pending', submittedDate: '2026-06-10' },
  { id: 'td-003', employeeId: 'EMP-006', employeeName: 'Sneha Gupta', financialYear: '2026-27', category: 'Home Loan', declaredAmount: 200000, proofStatus: 'Verified', submittedDate: '2026-05-22' },
  { id: 'td-004', employeeId: 'EMP-004', employeeName: 'Amrita Patel', financialYear: '2026-27', category: 'Insurance', declaredAmount: 50000, proofStatus: 'Pending', submittedDate: '2026-07-01' },
  { id: 'td-005', employeeId: 'EMP-022', employeeName: 'Vikram Kumar', financialYear: '2026-27', category: 'Investments (80C)', declaredAmount: 120000, proofStatus: 'Rejected', submittedDate: '2026-06-15' },
  { id: 'td-006', employeeId: 'EMP-007', employeeName: 'Arjun Reddy', financialYear: '2026-27', category: 'Other Exemptions', declaredAmount: 30000, proofStatus: 'Verified', submittedDate: '2026-05-30' },
]

// ============================================================================
// PAYSLIPS
// ============================================================================
export interface Payslip {
  id: string
  employeeId: string
  employeeName: string
  department: string
  month: string
  netPay: number
  status: 'Generated' | 'Published'
  generatedDate: string | null
}

export const mockPayslips: Payslip[] = mockEmployees.map((e, idx) => {
  const line = currentPayrollRun.lines.find(l => l.employeeId === e.id)!
  return {
    id: `slip-${e.id}-2026-06`,
    employeeId: e.id,
    employeeName: `${e.firstName} ${e.lastName}`,
    department: e.department,
    month: 'June 2026',
    netPay: line.netPay,
    status: idx % 4 === 0 ? 'Generated' : 'Published',
    generatedDate: '2026-07-01',
  }
})

// ============================================================================
// PAYROLL SETTINGS
// ============================================================================
export const payrollSettings = {
  frequency: 'Monthly',
  payDay: '1st working day of every month',
  cutOffDate: '25th of the previous month',
  salaryComponents: ['Basic', 'HRA', 'Special Allowance', 'Bonus', 'Provident Fund', 'ESI', 'Professional Tax', 'TDS'],
  payrollCalendar: 'Aligned to calendar month (1st – last day)',
  workingDaysCalculation: 'Calendar days minus weekly offs and declared holidays',
  roundingRule: 'Round net pay to nearest ₹1',
  defaultBank: 'HDFC Bank Corporate Salary Account ****4821',
  approvalWorkflow: [
    'Payroll Executive prepares & calculates the run',
    'Finance Manager reviews and approves',
    'CFO sign-off required for runs above ₹50,00,000',
  ],
}

// ============================================================================
// ATTENTION CENTER (Payroll landing page)
// ============================================================================
export interface PayrollAttentionItem {
  id: string
  label: string
  count: number
  actionLabel: string
  href: string
}

export const payrollAttentionItems: PayrollAttentionItem[] = [
  { id: 'awaiting-approval', label: 'Payroll awaiting approval', count: 1, actionLabel: 'Review', href: '/payroll/run' },
  { id: 'salary-revisions', label: 'Salary revisions pending', count: salaryRevisionsPending.length, actionLabel: 'Review', href: '/payroll/compensation?filter=pending' },
  { id: 'reimbursements-review', label: 'Reimbursements to review', count: mockReimbursements.filter(r => r.status === 'Pending').length, actionLabel: 'Review', href: '/payroll/reimbursements?tab=Pending' },
  { id: 'missing-bank', label: 'Employees missing bank details', count: employeesMissingBank.length, actionLabel: 'Review', href: '/payroll/compensation?filter=missing-bank' },
  { id: 'payroll-scheduled', label: 'Payroll scheduled in 2 days', count: 2, actionLabel: 'View', href: '/payroll/run' },
]

// ============================================================================
// PAYROLL TIMELINE (current month workflow stage)
// ============================================================================
export const payrollTimelineStages = [
  'Salary Updates',
  'Attendance Locked',
  'Payroll Calculated',
  'Payroll Approved',
  'Payslips Generated',
  'Bank Transfer',
] as const

export const currentTimelineStageIndex = 2 // "Payroll Calculated"

// ============================================================================
// UPCOMING DEADLINES
// ============================================================================
export const payrollDeadlines = [
  { id: 'dl-processing', label: 'Payroll processing', date: '2026-07-31' },
  { id: 'dl-tax-filing', label: 'Tax filing', date: '2026-08-07' },
  { id: 'dl-pf', label: 'PF submission', date: '2026-08-15' },
  { id: 'dl-esi', label: 'ESI submission', date: '2026-08-15' },
  { id: 'dl-payslip', label: 'Payslip publishing', date: '2026-08-01' },
]

// ============================================================================
// RECENT ACTIVITY
// ============================================================================
export const payrollActivity = [
  { id: 1, icon: 'check', title: 'Payroll processed: June 2026', actor: 'Amrita Patel', time: '3d ago' },
  { id: 2, icon: 'edit', title: 'Salary updated: Sneha Gupta', actor: 'Amrita Patel', time: '4d ago' },
  { id: 3, icon: 'clipboard', title: 'Payslips published: June 2026', actor: 'Vikram Singh', time: '5d ago' },
  { id: 4, icon: 'check', title: 'Bonus approved: Sneha Gupta', actor: 'Amrita Patel', time: '6d ago' },
  { id: 5, icon: 'check', title: 'Reimbursement approved: Arjun Reddy', actor: 'Vikram Singh', time: '1w ago' },
  { id: 6, icon: 'edit', title: 'Salary structure updated: Sales', actor: 'Amrita Patel', time: '1w ago' },
]
