'use client'

import { Handle, Position } from '@xyflow/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

export interface EmployeeNodeData {
  id: string
  firstName: string
  lastName: string
  designation: string
  department: string
  reportCount: number
  [key: string]: unknown
}

export function EmployeeNode({ data }: { data: EmployeeNodeData }) {
  const { isDark } = useTheme()
  const router = useRouter()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const hoverBorder = isDark ? 'hover:border-[#00755A]' : 'hover:border-[#00755A]'

  return (
    <div
      onClick={() => router.push(`/people/employees/${data.id}`)}
      className={`w-60 flex items-center gap-3 px-3.5 py-3 rounded-xl border ${borderColor} ${cardBg} ${hoverBorder} shadow-sm cursor-pointer transition-colors group`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#00755A] !w-2 !h-2 !border-0" />
      <span className="w-10 h-10 rounded-full bg-[#004D43] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {data.firstName[0]}{data.lastName[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate group-hover:text-[#00755A] ${textColor}`}>
          {data.firstName} {data.lastName}
        </p>
        <p className={`text-[11px] font-medium truncate ${textSecondary}`}>{data.designation} · {data.department}</p>
      </div>
      {data.reportCount > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
          {data.reportCount}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-[#00755A] !w-2 !h-2 !border-0" />
    </div>
  )
}
