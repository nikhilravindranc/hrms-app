'use client'

import { Handle, Position } from '@xyflow/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { BuildingIcon } from '@/components/Icons'

export interface DepartmentNodeData {
  id: string
  name: string
  employeeCount: number
  headName?: string
  isRoot?: boolean
  clickable?: boolean
  [key: string]: unknown
}

export function DepartmentNode({ data }: { data: DepartmentNodeData }) {
  const { isDark } = useTheme()
  const router = useRouter()

  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'

  if (data.isRoot) {
    return (
      <div className={`w-60 flex items-center gap-3 px-4 py-3.5 rounded-xl border ${borderColor} bg-[#004D43] shadow-sm`}>
        <span className="w-10 h-10 rounded-lg bg-white/15 text-white flex items-center justify-center flex-shrink-0">
          <BuildingIcon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate text-white">{data.name}</p>
          <p className="text-[11px] font-medium truncate text-white/70">{data.employeeCount} Employees</p>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-[#00755A] !w-2 !h-2 !border-0" />
      </div>
    )
  }

  return (
    <div
      onClick={() => data.clickable && router.push(`/people/departments/${data.id}`)}
      className={`w-60 flex items-center gap-3 px-3.5 py-3 rounded-xl border ${borderColor} ${cardBg} hover:border-[#00755A] shadow-sm ${data.clickable ? 'cursor-pointer' : ''} transition-colors group`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#00755A] !w-2 !h-2 !border-0" />
      <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#00755A]/15 text-[#00755A]">
        <BuildingIcon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate group-hover:text-[#00755A] ${textColor}`}>{data.name}</p>
        <p className={`text-[11px] font-medium truncate ${textSecondary}`}>
          {data.employeeCount} Employees{data.headName ? ` · ${data.headName}` : ''}
        </p>
      </div>
    </div>
  )
}
