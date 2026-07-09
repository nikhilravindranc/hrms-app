'use client'

import React, { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'Admin' | 'HR Manager' | 'Employee'
  organizationId: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 500))
    setUser({
      id: 'user-admin',
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      organizationId: 'org-001',
    })
  }

  const logout = () => setUser(null)

  const signup = async (data: any) => {
    await new Promise(r => setTimeout(r, 500))
    setUser({
      id: `user-${data.email}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'Admin',
      organizationId: 'org-001',
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
