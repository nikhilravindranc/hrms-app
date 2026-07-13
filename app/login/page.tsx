'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { login, signup } = useAuth()
  const router = useRouter()
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignup) {
        await signup({ email, password, firstName, lastName })
        router.push('/onboarding/welcome')
      } else {
        await login(email, password)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Auth failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const inputBg = isDark ? 'bg-[#27272A]' : 'bg-[#E8EFF6]'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const buttonBg = 'bg-[#004D43] hover:bg-[#27EAA6] text-white'

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#E8EFF6]'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg border ${borderColor} ${cardBg}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-[#004D43] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">E</span>
          </div>
          <h1 className={`text-2xl font-bold ${textColor}`}>EVOQ HRMS</h1>
          <p className={`text-sm ${textSecondary} mt-1`}>Human Resource Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className={`text-lg font-bold ${textColor} mb-6`}>
            {isSignup ? 'Create Account' : 'Login'}
          </h2>

          {isSignup && (
            <>
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none focus:border-[#004D43]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none focus:border-[#004D43]`}
                />
              </div>
            </>
          )}

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isSignup ? 'you@company.com' : 'tech@evoq.one'}
              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none focus:border-[#004D43]`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} outline-none focus:border-[#004D43]`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${buttonBg} disabled:opacity-50`}
          >
            {loading ? (isSignup ? 'Creating...' : 'Logging in...') : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        {/* Toggle */}
        <p className={`text-center text-sm ${textSecondary} mt-6`}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-[#004D43] hover:underline font-medium"
          >
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
