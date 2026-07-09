'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { MenuIcon, SearchIcon, PlusIcon, BellIcon, MoonIcon, SunIcon } from './Icons'

export function TopBar() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const topbarBg = isDark ? 'bg-[#0A0A0A]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const hoverBg = isDark ? 'hover:bg-[#18181B]' : 'hover:bg-[#E8EFF6]'
  const iconColor = isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'

  const notifications = [
    { id: 1, message: 'Leave request approved', time: '2 min ago' },
    { id: 2, message: 'New employee onboarded', time: '1 hour ago' },
    { id: 3, message: 'Payroll processed for July', time: '3 hours ago' },
  ]

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
        border-b ${borderColor}
        flex items-center justify-between px-4 lg:px-8 py-3 h-auto
        ${topbarBg}
      `}
    >
      {/* Left - Menu + Logo */}
      <div className="flex items-center gap-4">
        <button className={`p-1.5 rounded-lg transition-colors ${hoverBg} ${iconColor}`}>
          <MenuIcon size={20} />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#004D43] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className={`text-sm font-bold ${textColor}`}>EVOQ HRMS</span>
        </Link>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={`
          hidden md:flex items-center gap-2 px-3 py-2 rounded-lg w-72
          ${isDark ? 'bg-[#27272A]' : 'bg-[#ABE6D1]/30'}
        `}>
          <SearchIcon size={16} className={textSecondary} />
          <input
            type="text"
            placeholder="Search employees, requests..."
            className={`
              bg-transparent text-sm outline-none flex-1
              ${isDark ? 'text-[#D4D4D8] placeholder-[#71717A]' : 'text-[#0C2472] placeholder-[#94A3B8]'}
            `}
          />
          <kbd className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${borderColor} ${textSecondary}`}>
            ⌘K
          </kbd>
        </div>

        {/* Primary Action — 14px/600, padding 10px 20px per Primary Button spec */}
        <Link href="/people/employees/new">
          <button className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#004D43] hover:bg-[#24A576] text-white text-button transition-colors">
            <PlusIcon size={16} />
            New Employee
          </button>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${hoverBg} ${iconColor}`}
        >
          {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${hoverBg} ${iconColor}`}
          >
            <BellIcon size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`
              absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50
              ${isDark ? 'bg-[#18181B]' : 'bg-white'}
              border ${borderColor}
            `}>
              <div className={`px-4 py-3 text-section-header border-b ${borderColor} ${textColor}`}>
                Notifications
              </div>
              {notifications.map(notif => (
                <div key={notif.id} className={`px-4 py-3 border-b ${borderColor} last:border-0`}>
                  <p className={`text-body-value ${textColor}`}>{notif.message}</p>
                  <p className="text-metadata mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-[#004D43] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </button>

          {showUserMenu && (
            <div className={`
              absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50
              ${isDark ? 'bg-[#18181B]' : 'bg-white'}
              border ${borderColor}
            `}>
              <div className={`px-4 py-3 border-b ${borderColor}`}>
                <p className={`text-body-value ${textColor}`}>{user?.firstName} {user?.lastName}</p>
                <p className="text-metadata">{user?.email}</p>
              </div>
              <button className={`w-full text-left px-4 py-2 ${hoverBg} flex items-center gap-2 text-sm ${textColor}`}>
                Profile
              </button>
              <button className={`w-full text-left px-4 py-2 ${hoverBg} flex items-center gap-2 text-sm ${textColor}`}>
                Settings
              </button>
              <button
                onClick={() => {
                  logout()
                  setShowUserMenu(false)
                }}
                className={`w-full text-left px-4 py-2 ${hoverBg} flex items-center gap-2 text-sm text-[#EF4444]`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
