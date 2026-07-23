'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { usePayrollConnection } from '@/context/PayrollConnectionContext'
import { CheckIcon, ArrowRightIcon, AlertTriangleIcon } from '@/components/Icons'
import {
  wizardCountries,
  wizardFinancialYears,
  wizardPayrollFrequencies,
  wizardPayrollCycles,
  wizardPayDayOptions,
  wizardSalaryComponentGroups,
  mockSalaryStructures,
  wizardStatutoryByCountry,
  employeeMappingReadiness,
  wizardPaymentMethods,
  wizardFileFormats,
  wizardValidationChecks,
} from '@/lib/payrollData'

const STEPS = [
  'Company Details',
  'Salary Components',
  'Salary Structures',
  'Statutory Configuration',
  'Employee Mapping',
  'Bank & Payment',
  'Validation',
]

export default function PayrollSetupWizard() {
  const { isDark } = useTheme()
  const { completeSetup } = usePayrollConnection()
  const router = useRouter()

  const [step, setStep] = useState(0)

  // Step 1: Company Details
  const [country, setCountry] = useState('IN')
  const [financialYear, setFinancialYear] = useState(wizardFinancialYears[0])
  const [frequency, setFrequency] = useState(wizardPayrollFrequencies[0])
  const [cycle, setCycle] = useState(wizardPayrollCycles[0])
  const [payDay, setPayDay] = useState(wizardPayDayOptions[0])

  // Step 2: Salary Components
  const allComponentLabels = wizardSalaryComponentGroups.flatMap(g => g.items)
  const [enabledComponents, setEnabledComponents] = useState<Record<string, boolean>>(
    Object.fromEntries(allComponentLabels.map(c => [c, true]))
  )

  // Step 3: Salary Structures
  const [selectedStructures, setSelectedStructures] = useState<Record<string, boolean>>(
    Object.fromEntries(mockSalaryStructures.map(s => [s.id, true]))
  )

  // Step 4: Statutory Configuration
  const statutoryItems = wizardStatutoryByCountry[country] ?? []
  const [enabledStatutory, setEnabledStatutory] = useState<Record<string, boolean>>(
    Object.fromEntries(statutoryItems.map(s => [s.id, true]))
  )

  // Step 6: Bank & Payment
  const [companyBank, setCompanyBank] = useState('HDFC Bank Corporate Account')
  const [salaryAccount, setSalaryAccount] = useState('HDFC •••• 4821')
  const [paymentMethod, setPaymentMethod] = useState(wizardPaymentMethods[0])
  const [fileFormat, setFileFormat] = useState(wizardFileFormats[0])

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const fieldBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'

  const selectedCountry = wizardCountries.find(c => c.id === country)!

  const toggleComponent = (label: string) => setEnabledComponents(prev => ({ ...prev, [label]: !prev[label] }))
  const toggleStructure = (id: string) => setSelectedStructures(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleStatutory = (id: string) => setEnabledStatutory(prev => ({ ...prev, [id]: !prev[id] }))

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const finish = () => {
    completeSetup()
    router.push('/payroll')
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className={`block text-[10.5px] font-semibold uppercase tracking-[0.05em] mb-1.5 ${textSecondary}`}>{label}</label>
      {children}
    </div>
  )

  const selectClass = `w-full px-3 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${textColor} text-sm font-medium outline-none`
  const inputClass = selectClass

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Payroll Setup</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>One-time configuration. You won&apos;t see this wizard again once payroll is ready.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center overflow-x-auto pb-1">
        {STEPS.map((label, idx) => {
          const isDone = idx < step
          const isCurrent = idx === step
          return (
            <div key={label} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5 w-24">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 flex-shrink-0 ${
                    isDone
                      ? 'bg-[#00755A] border-[#00755A] text-white'
                      : isCurrent
                      ? 'border-[#00755A] text-[#00755A]'
                      : `${borderColor} ${textSecondary}`
                  }`}
                >
                  {isDone ? <CheckIcon size={13} /> : idx + 1}
                </div>
                <p className={`text-[9.5px] font-semibold text-center leading-tight ${isCurrent ? 'text-[#00755A]' : isDone ? textColor : textSecondary}`}>
                  {label}
                </p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-6 flex-shrink-0 -mt-5 ${isDone ? 'bg-[#00755A]' : isDark ? 'bg-[#27272A]' : 'bg-[#D4E8E0]'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} p-6`}>
        {step === 0 && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold ${textColor}`}>Company Payroll Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Country">
                <select value={country} onChange={e => setCountry(e.target.value)} className={selectClass}>
                  {wizardCountries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Currency">
                <input disabled value={selectedCountry.currency} className={`${inputClass} opacity-80`} />
              </Field>
              <Field label="Financial Year">
                <select value={financialYear} onChange={e => setFinancialYear(e.target.value)} className={selectClass}>
                  {wizardFinancialYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Payroll Frequency">
                <select value={frequency} onChange={e => setFrequency(e.target.value)} className={selectClass}>
                  {wizardPayrollFrequencies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Payroll Cycle">
                <select value={cycle} onChange={e => setCycle(e.target.value)} className={selectClass}>
                  {wizardPayrollCycles.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Pay Day">
                <select value={payDay} onChange={e => setPayDay(e.target.value)} className={selectClass}>
                  {wizardPayDayOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold ${textColor}`}>Salary Components</h2>
            <p className={`text-xs font-medium -mt-3 ${textSecondary}`}>Choose which components apply to your organization. You can adjust these later in Configuration.</p>
            {wizardSalaryComponentGroups.map(group => (
              <div key={group.id}>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] mb-2 ${textSecondary}`}>{group.label}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.items.map(item => (
                    <label key={item} className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer ${fieldBg}`}>
                      <input type="checkbox" checked={enabledComponents[item]} onChange={() => toggleComponent(item)} className="rounded" />
                      <span className={`text-xs font-medium ${textColor}`}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className={`text-sm font-bold ${textColor}`}>Salary Structures</h2>
            <p className={`text-xs font-medium -mt-2 ${textSecondary}`}>These templates are ready to use. Deselect any you don&apos;t need — you can create more later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockSalaryStructures.map(s => (
                <label key={s.id} className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer ${selectedStructures[s.id] ? 'border-[#00755A] bg-[#00755A]/5' : `${borderColor} ${fieldBg}`}`}>
                  <input type="checkbox" checked={selectedStructures[s.id]} onChange={() => toggleStructure(s.id)} className="rounded mt-0.5" />
                  <div>
                    <p className={`text-sm font-bold ${textColor}`}>{s.name}</p>
                    <p className={`text-[11px] font-medium mt-0.5 ${textSecondary}`}>{s.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className={`text-sm font-bold ${textColor}`}>Statutory Configuration</h2>
            <p className={`text-xs font-medium -mt-2 ${textSecondary}`}>Based on {selectedCountry.name}. Toggle off anything that doesn&apos;t apply to your organization.</p>
            <div className="space-y-2">
              {statutoryItems.map(item => (
                <label key={item.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${fieldBg}`}>
                  <span className={`text-sm font-semibold ${textColor}`}>{item.label}</span>
                  <input type="checkbox" checked={enabledStatutory[item.id]} onChange={() => toggleStatutory(item.id)} className="rounded" />
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold ${textColor}`}>Employee Mapping</h2>
            <p className={`text-xs font-medium -mt-3 ${textSecondary}`}>Employees are automatically mapped to a salary structure and pay account. Review before continuing.</p>
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-lg ${fieldBg}`}>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] ${textSecondary}`}>Employees</p>
                <p className={`text-2xl font-extrabold mt-1 ${textColor}`}>{employeeMappingReadiness.total}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#00755A]/10">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#00755A]">Ready</p>
                <p className="text-2xl font-extrabold mt-1 text-[#00755A]">{employeeMappingReadiness.ready}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#EF4444]/10">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#EF4444]">Needs Attention</p>
                <p className="text-2xl font-extrabold mt-1 text-[#EF4444]">{employeeMappingReadiness.missing}</p>
              </div>
            </div>
            {employeeMappingReadiness.missing > 0 && (
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.05em] mb-2 ${textSecondary}`}>{employeeMappingReadiness.missingReason}</p>
                <div className="space-y-1.5">
                  {employeeMappingReadiness.missingEmployees.map(e => (
                    <div key={e.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg ${fieldBg}`}>
                      <AlertTriangleIcon size={14} className="text-[#EF4444] flex-shrink-0" />
                      <p className={`text-xs font-semibold ${textColor}`}>{e.firstName} {e.lastName}</p>
                      <p className={`text-[10.5px] font-medium ${textSecondary}`}>{e.id}</p>
                    </div>
                  ))}
                </div>
                <p className={`text-[10.5px] font-medium mt-2 ${textSecondary}`}>You can finish setup now and complete these later in Employee Compensation.</p>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold ${textColor}`}>Bank & Payment Setup</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Bank">
                <input value={companyBank} onChange={e => setCompanyBank(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Salary Account">
                <input value={salaryAccount} onChange={e => setSalaryAccount(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Payment Method">
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={selectClass}>
                  {wizardPaymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="File Format">
                <select value={fileFormat} onChange={e => setFileFormat(e.target.value)} className={selectClass}>
                  {wizardFileFormats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold ${textColor}`}>Validation</h2>
            <p className={`text-xs font-medium -mt-3 ${textSecondary}`}>Everything checks out. You&apos;re ready to run your first payroll.</p>
            <div className="space-y-2">
              {wizardValidationChecks.map(check => (
                <div key={check} className="flex items-center gap-3 p-3 rounded-lg bg-[#00755A]/10">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#00755A] text-white">
                    <CheckIcon size={13} />
                  </span>
                  <p className="text-sm font-semibold text-[#00755A]">{check}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={step === 0}
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold border ${borderColor} ${textColor} ${isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#F7FAF9]'} disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
          >
            Next
            <ArrowRightIcon size={15} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#00755A] hover:bg-[#27EAA6] transition-colors"
          >
            <CheckIcon size={15} />
            Finish — Payroll Ready
          </button>
        )}
      </div>
    </div>
  )
}
