// Lightweight inline SVG icon set (stroke-based, 24x24 viewBox)
import React from 'react'

type IconProps = {
  className?: string
  size?: number
}

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function GridIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function UsersIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17" cy="8" r="2.6" />
      <path d="M15 14.7c2.6.2 4.7 2.3 4.7 5.3" />
    </svg>
  )
}

export function ClockIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function WalletIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="6.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18" />
      <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClipboardCheckIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V3.8a1.3 1.3 0 011.3-1.3h3.4A1.3 1.3 0 0115 3.8v.7" />
      <path d="M8.5 12.5l2.2 2.2 4.3-4.7" />
    </svg>
  )
}

export function BarChartIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
    </svg>
  )
}

export function GearIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.6 7.6 0 000-2l1.9-1.5-2-3.4-2.3.6a7.7 7.7 0 00-1.7-1L14.9 3h-4l-.4 2.7a7.7 7.7 0 00-1.7 1l-2.3-.6-2 3.4L6.4 11a7.6 7.6 0 000 2l-1.9 1.5 2 3.4 2.3-.6a7.7 7.7 0 001.7 1l.4 2.7h4l.4-2.7a7.7 7.7 0 001.7-1l2.3.6 2-3.4z" />
    </svg>
  )
}

export function ShieldIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4.2" />
    </svg>
  )
}

export function SearchIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

export function BellIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 9a6 6 0 1112 0c0 4.2 1.2 5.7 2 6.5H4c.8-.8 2-2.3 2-6.5z" />
      <path d="M10 19a2 2 0 004 0" />
    </svg>
  )
}

export function MoonIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
    </svg>
  )
}

export function SunIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

export function PlusIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MenuIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function ChevronDownIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function ArrowUpRightIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowDownRightIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 7l10 10M16 7v9H7" />
    </svg>
  )
}

export function ExternalLinkIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M14 4h6v6M20 4L10 14M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  )
}

export function CheckCircleIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.3 2.3 4.7-5" />
    </svg>
  )
}

export function UserPlusIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M17 7.5v5M14.5 10h5" />
    </svg>
  )
}

export function EditIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20l.9-3.6L16.6 4.7a1.5 1.5 0 012.1 0l.6.6a1.5 1.5 0 010 2.1L7.6 19.1 4 20z" />
      <path d="M14 6.5l3.5 3.5" />
    </svg>
  )
}

export function CashIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export function TaskIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8.5 12l2.2 2.2 4.3-4.7" />
    </svg>
  )
}

export function MailIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  )
}

export function LockIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 018 0v3" />
    </svg>
  )
}

export function EyeIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.6A10.8 10.8 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a15 15 0 01-3.2 4M6.4 6.9C4 8.6 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.7 9.7 0 004.4-1" />
      <path d="M9.9 10a3 3 0 004.1 4.1" />
    </svg>
  )
}

export function SparkleIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />
    </svg>
  )
}

export const activityIconMap: Record<string, React.FC<IconProps>> = {
  check: CheckCircleIcon,
  'user-plus': UserPlusIcon,
  edit: EditIcon,
  task: TaskIcon,
  cash: CashIcon,
}
