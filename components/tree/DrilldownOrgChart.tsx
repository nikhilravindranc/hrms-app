'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { ExternalLinkIcon } from '@/components/Icons'
import { Employee } from '@/lib/mockData'

function initialsOf(e: Employee) {
  return `${e.firstName[0]}${e.lastName[0]}`
}

function Avatar({ label, size, tone }: { label: string; size: number; tone: 'root' | 'normal' }) {
  return (
    <span
      className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white ${
        tone === 'root' ? 'bg-[#004D43]' : 'bg-[#00755A]'
      }`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {label}
    </span>
  )
}

export function DrilldownOrgChart({ employees }: { employees: Employee[] }) {
  const { isDark } = useTheme()
  const router = useRouter()
  const [path, setPath] = useState<string[]>([])

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'
  const lineColor = isDark ? '#27272A' : '#D4E8E0'
  const selectedRing = isDark ? 'border-[#27EAA6] ring-1 ring-[#27EAA6]/30' : 'border-[#00755A] ring-1 ring-[#00755A]/20'

  const { root, childrenOf } = useMemo(() => {
    const map: Record<string, Employee[]> = {}
    employees.forEach(e => {
      if (e.manager) {
        if (!map[e.manager]) map[e.manager] = []
        map[e.manager].push(e)
      }
    })
    return { root: employees.find(e => !e.manager) ?? null, childrenOf: map }
  }, [employees])

  if (!root) return null

  const selectAt = (level: number, id: string) => {
    setPath(prev => {
      if (prev[level] === id) return prev.slice(0, level)
      return [...prev.slice(0, level), id]
    })
  }

  const goToProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/people/employees/${id}`)
  }

  const level1 = childrenOf[root.id] ?? []
  const columns: Employee[][] = [level1]
  for (let i = 0; i < path.length; i++) {
    const kids = childrenOf[path[i]] ?? []
    if (kids.length === 0) break
    columns.push(kids)
  }

  return (
    <div className="flex items-start gap-8 overflow-x-auto pb-4" style={{ minHeight: 500 }}>
      {/* Root */}
      <div className="flex flex-col items-center flex-shrink-0 pt-6">
        <div
          onClick={e => goToProfile(root.id, e)}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${borderColor} ${cardBg} cursor-pointer hover:border-[#00755A] transition-colors group w-32`}
        >
          <Avatar label={initialsOf(root)} size={44} tone="root" />
          <div className="text-center min-w-0">
            <p className={`text-xs font-bold truncate w-full group-hover:text-[#00755A] ${textColor}`}>{root.firstName} {root.lastName}</p>
            <p className={`text-[10px] font-medium truncate w-full ${textSecondary}`}>{root.designation}</p>
          </div>
        </div>
        {level1.length > 0 && (
          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
            {level1.length}
          </span>
        )}
      </div>

      {columns.map((nodes, level) => {
        const isThumbnailLevel = level === 0
        const selectedId = path[level]

        return (
          <div key={level} className="flex flex-col justify-center flex-shrink-0" style={{ minHeight: 480 }}>
            <div className="flex flex-col gap-3 relative pl-6 border-l-2" style={{ borderColor: lineColor }}>
              {nodes.map(node => {
                const kids = childrenOf[node.id] ?? []
                const isSelected = selectedId === node.id

                if (isThumbnailLevel) {
                  return (
                    <div key={node.id} className="relative flex items-center">
                      <span className="absolute -left-6 top-1/2 w-6 h-0.5" style={{ backgroundColor: lineColor }} />
                      <button
                        title={`${node.firstName} ${node.lastName} · ${node.designation}`}
                        onClick={() => selectAt(level, node.id)}
                        className={`relative rounded-full border-2 transition-colors ${
                          isSelected ? selectedRing : `${borderColor} hover:border-[#00755A]`
                        }`}
                      >
                        <Avatar label={initialsOf(node)} size={40} tone="normal" />
                        {kids.length > 0 && (
                          <span className={`absolute -bottom-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border ${borderColor} ${isDark ? 'bg-[#0A0A0A] text-[#9CA3AF]' : 'bg-white text-[#004D43]'}`}>
                            {kids.length}
                          </span>
                        )}
                      </button>
                    </div>
                  )
                }

                return (
                  <div key={node.id} className="relative flex items-center">
                    <span className="absolute -left-6 top-1/2 w-6 h-0.5" style={{ backgroundColor: lineColor }} />
                    <div
                      onClick={() => kids.length > 0 && selectAt(level, node.id)}
                      className={`w-60 flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl border ${
                        isSelected ? selectedRing : `${borderColor} hover:border-[#00755A]`
                      } ${cardBg} transition-colors group ${kids.length > 0 ? 'cursor-pointer' : ''}`}
                    >
                      <Avatar label={initialsOf(node)} size={34} tone="normal" />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[13px] font-semibold truncate ${textColor}`}>{node.firstName} {node.lastName}</p>
                        <p className={`text-[11px] font-medium truncate ${textSecondary}`}>{node.designation}</p>
                      </div>
                      {kids.length > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-[#0F0F0F] text-[#9CA3AF]' : 'bg-[#E8EFF6] text-[#004D43]'}`}>
                          {kids.length}
                        </span>
                      )}
                      <button
                        title="View profile"
                        onClick={e => goToProfile(node.id, e)}
                        className={`flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'hover:bg-[#27272A] text-[#9CA3AF]' : 'hover:bg-[#F7FAF9] text-[#94A3B8]'}`}
                      >
                        <ExternalLinkIcon size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
