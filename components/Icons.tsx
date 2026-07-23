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

export function CheckIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={3}>
      <path d="M5 12.5l4.5 4.5L19 6.5" />
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

export function UserXIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M14.5 7.5l5 5M19.5 7.5l-5 5" />
    </svg>
  )
}

export function ShuffleIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 6h3.5c2 0 3.3 1 4.2 2.3M20.5 6H17c-1.3 0-2.3.4-3.1 1.1M20.5 18H17c-2 0-3.3-1-4.2-2.3M3 18h3.5c1.3 0 2.3-.4 3.1-1.1" />
      <path d="M17.5 3l3 3-3 3M17.5 15l3 3-3 3" />
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

export function CalendarIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  )
}

export function CakeIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20v-6.5a2 2 0 012-2h12a2 2 0 012 2V20" />
      <path d="M2.5 20h19" />
      <path d="M8 11.5V8M12 11.5V8M16 11.5V8" />
      <path d="M8 8c-.9 0-1.5-.6-1.5-1.4 0-.9 1.5-2.6 1.5-2.6s1.5 1.7 1.5 2.6c0 .8-.6 1.4-1.5 1.4zM12 8c-.9 0-1.5-.6-1.5-1.4 0-.9 1.5-2.6 1.5-2.6s1.5 1.7 1.5 2.6c0 .8-.6 1.4-1.5 1.4zM16 8c-.9 0-1.5-.6-1.5-1.4 0-.9 1.5-2.6 1.5-2.6s1.5 1.7 1.5 2.6c0 .8-.6 1.4-1.5 1.4z" />
      <path d="M4 16.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 3 0 2 .8 3 0" />
    </svg>
  )
}

export function TrophyIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 4h10v6a5 5 0 01-10 0V4z" />
      <path d="M7 5.5H4a1 1 0 00-1 1v1a3.5 3.5 0 003.5 3.5M17 5.5h3a1 1 0 011 1v1a3.5 3.5 0 01-3.5 3.5" />
      <path d="M12 15v3M9 21h6M9.5 18h5l.5 3H9z" />
    </svg>
  )
}

export function HomeIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 11l8-7 8 7" />
      <path d="M5.5 9.8V20h13V9.8" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function ReceiptIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 3.5h14v17l-2.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2.5 1.5z" />
      <path d="M8 8h8M8 11.5h8M8 15h5" />
    </svg>
  )
}

export function UploadIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 15.5V4M8 8l4-4 4 4" />
      <path d="M4.5 15.5V19a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-3.5" />
    </svg>
  )
}

export function MegaphoneIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 10.5v3a1.5 1.5 0 001.5 1.5H6l3.5 4V5L6 9H4.5A1.5 1.5 0 003 10.5z" />
      <path d="M13 8.5c2.5 0 5-1.2 6.5-3v11c-1.5-1.8-4-3-6.5-3" />
      <path d="M7 15l1 4.5" />
    </svg>
  )
}

export function FileTextIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 3.5h8l4 4V20a1 1 0 01-1 1H6a1 1 0 01-1-1V4.5a1 1 0 011-1z" />
      <path d="M14 3.5V8h4" />
      <path d="M8 12.5h8M8 16h5" />
    </svg>
  )
}

export function BuildingIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="3" width="12" height="18" rx="1" />
      <path d="M16 8h4v13h-4M7.5 7h1M11.5 7h1M7.5 11h1M11.5 11h1M7.5 15h1M11.5 15h1" />
    </svg>
  )
}

export function MapPinIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function BadgeIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
    </svg>
  )
}

export function SitemapIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="8.5" y="3" width="7" height="5" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
      <rect x="14" y="16" width="7" height="5" rx="1" />
      <path d="M12 8v4M6.5 16v-4h11v4" />
    </svg>
  )
}

export function FilterIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 5h16l-6 7.5V19l-4 2v-8.5z" />
    </svg>
  )
}

export function DownloadIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M4.5 16v3a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-3" />
    </svg>
  )
}

export function MoreVerticalIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <circle cx="12" cy="5.5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="18.5" r="1.7" />
    </svg>
  )
}

export function XIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function ChevronRightIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function LayersIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M4.5 12.2L12 16l7.5-3.8" />
      <path d="M4.5 16.2L12 20l7.5-3.8" />
    </svg>
  )
}

export function AlertTriangleIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M10.3 3.9L1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  )
}

export function ArrowRightIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function HistoryIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

export function RefreshIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  )
}

export function ListIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  )
}

export function SettingsIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function PlugIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 2v5" />
      <path d="M15 2v5" />
      <path d="M7 7h10a1 1 0 0 1 1 1v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V8a1 1 0 0 1 1-1z" />
      <path d="M12 17v5" />
    </svg>
  )
}

export function BuildingBankIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9" />
      <path d="M9 10v9" />
      <path d="M15 10v9" />
      <path d="M19 10v9" />
      <path d="M3 21h18" />
    </svg>
  )
}

export const activityIconMap: Record<string, React.FC<IconProps>> = {
  check: CheckCircleIcon,
  'user-plus': UserPlusIcon,
  edit: EditIcon,
  task: TaskIcon,
  cash: CashIcon,
  calendar: CalendarIcon,
  clipboard: ClipboardCheckIcon,
}
