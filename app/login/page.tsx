'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  SparkleIcon,
  UsersIcon,
  ClockIcon,
  WalletIcon,
  ShieldIcon,
  MoonIcon,
  SunIcon,
} from '@/components/Icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { login, signup } = useAuth()
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        await signup({ email, password, firstName, lastName })
        router.push('/onboarding/welcome')
      } else {
        await login(email, password)
        router.push('/dashboard')
      }
    } catch {
      setError(isSignup ? 'Could not create your account. Please try again.' : 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const pageBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const inputBg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7FAF9]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const inputBorder = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#64748B]'
  const iconMuted = isDark ? 'text-[#71717A]' : 'text-[#94A3B8]'
  const hoverBg = isDark ? 'hover:bg-[#27272A]' : 'hover:bg-[#E8EFF6]'

  const highlights = [
    { icon: UsersIcon, label: 'Manage your entire workforce in one place' },
    { icon: ClockIcon, label: 'Track attendance and leave in real time' },
    { icon: WalletIcon, label: 'Run payroll with confidence, every cycle' },
    { icon: ShieldIcon, label: 'Enterprise-grade security by default' },
  ]

  return (
    <div className={`min-h-screen flex ${pageBg}`}>
      {/* Left — Brand Panel */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #00755A 0%, #003D2E 100%)' }}
      >
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-[#27EAA6]/20 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-lg font-bold">EVOQ HRMS</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium mb-5">
              <SparkleIcon size={13} />
              Human Resource Management
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-3">
              Everything HR,<br />in one place.
            </h1>
            <p className="text-sm font-medium opacity-80 max-w-sm">
              Onboard employees, run payroll, track attendance, and approve requests — all from a single dashboard.
            </p>
          </div>

          <div className="space-y-3.5">
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <p className="text-sm font-medium opacity-90">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        <p className="relative text-xs font-medium opacity-60">© 2026 EVOQ HRMS. All rights reserved.</p>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <button
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${hoverBg} ${iconMuted}`}
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-[#004D43] flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <h1 className={`text-xl font-bold ${textColor}`}>EVOQ HRMS</h1>
          </div>

          <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
            <div className="mb-7">
              <h2 className={`text-2xl font-extrabold ${textColor}`}>
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className={`text-sm ${textSecondary} mt-1.5`}>
                {isSignup ? 'Set up access to your HRMS workspace' : 'Sign in to continue to your workspace'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-2`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${inputBorder} ${inputBg} ${textColor} text-sm outline-none transition-colors focus:border-[#00755A]`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-2`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${inputBorder} ${inputBg} ${textColor} text-sm outline-none transition-colors focus:border-[#00755A]`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-2`}>
                  Email
                </label>
                <div className="relative">
                  <MailIcon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconMuted}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border ${inputBorder} ${inputBg} ${textColor} text-sm outline-none transition-colors focus:border-[#00755A]`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-[0.05em] ${textSecondary} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <LockIcon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconMuted}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${inputBorder} ${inputBg} ${textColor} text-sm outline-none transition-colors focus:border-[#00755A]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${iconMuted} hover:text-[#00755A] transition-colors`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3.5 py-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                  <p className="text-xs font-medium text-[#EF4444]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-colors bg-[#00755A] hover:bg-[#27EAA6] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (isSignup ? 'Creating account…' : 'Signing in…') : isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className={`text-center text-sm ${textSecondary} mt-6`}>
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup)
                  setError('')
                }}
                className="text-[#00755A] hover:text-[#27EAA6] hover:underline font-semibold transition-colors"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
