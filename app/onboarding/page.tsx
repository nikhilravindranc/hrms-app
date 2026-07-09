'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

const steps = [
  { id: 1, name: 'Organization', label: 'Organization Details' },
  { id: 2, name: 'HR Settings', label: 'HR Settings' },
  { id: 3, name: 'Structure', label: 'Organization Structure' },
  { id: 4, name: 'Employees', label: 'Invite Employees' },
  { id: 5, name: 'Policies', label: 'Policies' },
  { id: 6, name: 'Integrations', label: 'Integrations' },
  { id: 7, name: 'Finish', label: 'Finish' },
]

const Step1Organization = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    industry: '',
    size: '',
    country: '',
    timezone: '',
    currency: '',
  })

  const inputBg = isDark ? 'bg-[#27272A]' : 'bg-[#F0FBF7]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4F4EA]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>Organization Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Company Name</label>
          <input
            type="text"
            placeholder="EVOQ HR Systems"
            value={formData.companyName}
            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Industry</label>
          <select
            value={formData.industry}
            onChange={e => setFormData({ ...formData, industry: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          >
            <option>Software</option>
            <option>HR Tech</option>
            <option>Finance</option>
            <option>Retail</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Company Size</label>
          <select
            value={formData.size}
            onChange={e => setFormData({ ...formData, size: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          >
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>200+</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Country</label>
          <select
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          >
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Timezone</label>
          <select
            value={formData.timezone}
            onChange={e => setFormData({ ...formData, timezone: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          >
            <option>IST (India)</option>
            <option>EST (USA)</option>
            <option>GMT (UK)</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Currency</label>
          <select
            value={formData.currency}
            onChange={e => setFormData({ ...formData, currency: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}
          >
            <option>INR</option>
            <option>USD</option>
            <option>GBP</option>
          </select>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}

const Step2HRSettings = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const inputBg = isDark ? 'bg-[#27272A]' : 'bg-[#F0FBF7]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4F4EA]'

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>HR Settings</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Work Week</label>
          <select className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}>
            <option>Mon-Fri (5 days)</option>
            <option>Mon-Sat (6 days)</option>
            <option>Custom</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Working Hours</label>
          <select className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}>
            <option>9 AM - 5 PM (8 hours)</option>
            <option>9 AM - 6 PM (9 hours)</option>
            <option>Custom</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Leave Year</label>
          <select className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}>
            <option>Jan-Dec</option>
            <option>Apr-Mar</option>
            <option>Apr-Mar (India)</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>Payroll Cycle</label>
          <select className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none`}>
            <option>Monthly</option>
            <option>Bi-weekly</option>
            <option>Weekly</option>
          </select>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}

const Step3Structure = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  const defaultDepts = ['HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Support', 'IT']

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>Organization Structure</h2>

      <div>
        <h3 className={`text-lg font-bold ${textColor} mb-4`}>Default Departments</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {defaultDepts.map(dept => (
            <div key={dept} className={`p-3 rounded-lg border border-[#0B5B47] bg-[#0B5B47] bg-opacity-10`}>
              <p className={`font-medium ${textColor}`}>{dept}</p>
            </div>
          ))}
        </div>
        <p className={`text-sm ${textSecondary} mt-4`}>These departments have been added. You can customize them later.</p>
      </div>

      <div>
        <h3 className={`text-lg font-bold ${textColor} mb-2`}>Locations</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Bangalore', 'Delhi', 'Mumbai'].map(loc => (
            <div key={loc} className={`p-3 rounded-lg border border-[#0B5B47] bg-[#0B5B47] bg-opacity-10`}>
              <p className={`font-medium ${textColor}`}>{loc}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}

const Step4Employees = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>Invite Employees</h2>

      <div className="space-y-3">
        <p className={`text-sm ${isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'}`}>
          You can invite employees now or skip this step and add them later.
        </p>
        <button className="w-full py-2 rounded-lg border border-[#0B5B47] text-[#0B5B47] hover:bg-[#0B5B47] hover:bg-opacity-10 font-medium transition-colors">
          📤 Upload CSV File
        </button>
        <button className="w-full py-2 rounded-lg border border-[#0B5B47] text-[#0B5B47] hover:bg-[#0B5B47] hover:bg-opacity-10 font-medium transition-colors">
          ➕ Add Manually
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Skip for Now →
      </button>
    </div>
  )
}

const Step5Policies = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'

  const policies = [
    { name: 'Leave Policy', status: '✓' },
    { name: 'Attendance Policy', status: '✓' },
    { name: 'Shift Policy', status: '✓' },
    { name: 'Overtime Policy', status: '✓' },
  ]

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>Policies</h2>

      <div className="space-y-3">
        {policies.map(policy => (
          <div key={policy.name} className={`p-3 rounded-lg border border-[#10B981] flex justify-between items-center`}>
            <p className={`font-medium ${textColor}`}>{policy.name}</p>
            <span className="text-[#10B981] text-lg">{policy.status}</span>
          </div>
        ))}
      </div>

      <p className={`text-sm ${isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'}`}>
        Default policies have been configured. You can customize them from the administration panel.
      </p>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}

const Step6Integrations = ({ onNext }: { onNext: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  const integrations = ['Google Workspace', 'Microsoft 365', 'Slack', 'Teams', 'Payroll Provider']

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${textColor}`}>Integrations (Optional)</h2>

      <p className={`text-sm ${textSecondary}`}>
        Connect your favorite tools. You can set these up later from settings.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {integrations.map(int => (
          <button
            key={int}
            className={`p-3 rounded-lg border border-[#D4F4EA] hover:border-[#0B5B47] transition-colors`}
          >
            <p className={`font-medium ${textColor}`}>{int}</p>
            <p className={`text-xs ${textSecondary} mt-1`}>Integrate Now</p>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors"
      >
        Continue →
      </button>
    </div>
  )
}

const Step7Finish = ({ onFinish }: { onFinish: () => void }) => {
  const { isDark } = useTheme()
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'

  return (
    <div className="space-y-6 text-center">
      <h2 className={`text-2xl font-bold ${textColor}`}>Setup Complete! 🎉</h2>

      <div className="space-y-3">
        <div className="text-4xl">✓</div>
        <p className={`text-lg ${textColor} font-medium`}>Your HRMS is ready!</p>
        <p className={`text-sm ${isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'}`}>
          Organization setup, departments, and policies are configured.
        </p>
      </div>

      <button
        onClick={onFinish}
        className="w-full py-2 rounded-lg bg-[#0B5B47] hover:bg-[#24A576] text-white font-medium transition-colors text-lg"
      >
        Go to Dashboard →
      </button>
    </div>
  )
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { isDark } = useTheme()

  const handleFinish = () => {
    router.push('/dashboard')
  }

  const stepPercentage = (currentStep / 7) * 100

  const containerBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#F0FBF7]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const progressBg = isDark ? 'bg-[#27272A]' : 'bg-[#D4F4EA]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  return (
    <div className={`min-h-screen ${containerBg} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold ${textColor}`}>Let&apos;s set up your HRMS</h1>
          <p className={`text-sm ${textSecondary} mt-2`}>Complete these steps to get started</p>
        </div>

        {/* Progress Bar */}
        <div className={`mb-8 p-4 rounded-lg ${cardBg}`}>
          <div className="flex justify-between mb-2">
            <p className={`text-sm font-medium ${textColor}`}>Step {currentStep} of 7</p>
            <p className={`text-sm font-medium ${textSecondary}`}>{steps[currentStep - 1].label}</p>
          </div>
          <div className={`w-full h-2 rounded-full ${progressBg} overflow-hidden`}>
            <div
              className="h-full bg-[#0B5B47] transition-all duration-300"
              style={{ width: `${stepPercentage}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className={`p-8 rounded-lg ${cardBg}`}>
          {currentStep === 1 && <Step1Organization onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && <Step2HRSettings onNext={() => setCurrentStep(3)} />}
          {currentStep === 3 && <Step3Structure onNext={() => setCurrentStep(4)} />}
          {currentStep === 4 && <Step4Employees onNext={() => setCurrentStep(5)} />}
          {currentStep === 5 && <Step5Policies onNext={() => setCurrentStep(6)} />}
          {currentStep === 6 && <Step6Integrations onNext={() => setCurrentStep(7)} />}
          {currentStep === 7 && <Step7Finish onFinish={handleFinish} />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${textSecondary}`}>
            Already set up? <a href="/dashboard" className="text-[#0B5B47] hover:underline font-medium">Go to Dashboard</a>
          </p>
        </div>
      </div>
    </div>
  )
}
