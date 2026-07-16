'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'hrms-user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = (nextUser: User) => {
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 500))
    persistUser({
      id: 'user-admin',
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'Admin',
      organizationId: 'org-001',
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const signup = async (data: any) => {
    await new Promise(r => setTimeout(r, 500))
    persistUser({
      id: `user-${data.email}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'Admin',
      organizationId: 'org-001',
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
