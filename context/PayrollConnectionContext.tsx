'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface PayrollConnectionContextType {
  isConnected: boolean
  isConfigured: boolean
  isLoaded: boolean
  connectPayroll: () => void
  completeSetup: () => void
  disconnectPayroll: () => void
}

const PayrollConnectionContext = createContext<PayrollConnectionContextType | undefined>(undefined)

const CONNECTED_KEY = 'hrms-payroll-connected'
const CONFIGURED_KEY = 'hrms-payroll-configured'

export function PayrollConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsConnected(localStorage.getItem(CONNECTED_KEY) === 'true')
    setIsConfigured(localStorage.getItem(CONFIGURED_KEY) === 'true')
    setIsLoaded(true)
  }, [])

  const connectPayroll = () => {
    localStorage.setItem(CONNECTED_KEY, 'true')
    setIsConnected(true)
  }

  const completeSetup = () => {
    localStorage.setItem(CONFIGURED_KEY, 'true')
    setIsConfigured(true)
  }

  const disconnectPayroll = () => {
    localStorage.removeItem(CONNECTED_KEY)
    localStorage.removeItem(CONFIGURED_KEY)
    setIsConnected(false)
    setIsConfigured(false)
  }

  return (
    <PayrollConnectionContext.Provider value={{ isConnected, isConfigured, isLoaded, connectPayroll, completeSetup, disconnectPayroll }}>
      {children}
    </PayrollConnectionContext.Provider>
  )
}

export function usePayrollConnection() {
  const context = useContext(PayrollConnectionContext)
  if (!context) throw new Error('usePayrollConnection must be used within PayrollConnectionProvider')
  return context
}
