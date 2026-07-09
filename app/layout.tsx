import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { EmployeeProvider } from '@/context/EmployeeContext'
import { mockEmployees } from '@/lib/mockData'
import './globals.css'

export const metadata: Metadata = {
  title: 'EVOQ HRMS - Human Resource Management System',
  description: 'Complete HRMS solution for managing employees, leave, attendance, and payroll',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('hrms-theme') || 'light'
                const html = document.documentElement
                html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
                if (theme === 'dark') html.classList.add('dark')
              })()
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <EmployeeProvider initialEmployees={mockEmployees}>
              {children}
            </EmployeeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
