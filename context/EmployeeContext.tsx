'use client'

import React, { createContext, useContext, useState } from 'react'
import { Employee } from '@/lib/mockData'

interface EmployeeContextType {
  employees: Employee[]
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  getEmployee: (id: string) => Employee | undefined
  filterEmployees: (filters: any) => Employee[]
  search: (query: string) => Employee[]
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined)

export function EmployeeProvider({
  children,
  initialEmployees = [],
}: {
  children: React.ReactNode
  initialEmployees?: Employee[]
}) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)

  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee])
  }

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updates } : emp))
    )
  }

  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id)
  }

  const filterEmployees = (filters: any) => {
    return employees.filter(emp => {
      if (filters.department && emp.department !== filters.department) return false
      if (filters.location && emp.location !== filters.location) return false
      if (filters.status && emp.status !== filters.status) return false
      return true
    })
  }

  const search = (query: string) => {
    const q = query.toLowerCase()
    return employees.filter(
      emp =>
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q)
    )
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        addEmployee,
        updateEmployee,
        getEmployee,
        filterEmployees,
        search,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployee() {
  const context = useContext(EmployeeContext)
  if (!context) throw new Error('useEmployee must be used within EmployeeProvider')
  return context
}
