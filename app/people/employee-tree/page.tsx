'use client'

import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'
import { layoutTree } from '@/lib/treeLayout'
import { EmployeeNode, EmployeeNodeData } from '@/components/tree/EmployeeNode'

const nodeTypes = { employee: EmployeeNode }
const NODE_WIDTH = 240
const NODE_HEIGHT = 64

export default function EmployeeTreePage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const { nodes, edges } = useMemo(() => {
    const reportCounts: Record<string, number> = {}
    employees.forEach(e => {
      if (e.manager) reportCounts[e.manager] = (reportCounts[e.manager] ?? 0) + 1
    })

    const rawNodes: Node<EmployeeNodeData>[] = employees.map(e => ({
      id: e.id,
      type: 'employee',
      position: { x: 0, y: 0 },
      data: {
        id: e.id,
        firstName: e.firstName,
        lastName: e.lastName,
        designation: e.designation,
        department: e.department,
        reportCount: reportCounts[e.id] ?? 0,
      },
    }))

    const rawEdges: Edge[] = employees
      .filter(e => e.manager)
      .map(e => ({
        id: `${e.manager}-${e.id}`,
        source: e.manager as string,
        target: e.id,
        type: 'smoothstep',
        style: { stroke: isDark ? '#27272A' : '#D4E8E0', strokeWidth: 2 },
      }))

    return layoutTree(rawNodes, rawEdges, NODE_WIDTH, NODE_HEIGHT)
  }, [employees, isDark])

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Employee Tree</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Reporting hierarchy across the organization</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`} style={{ height: 620 }}>
        <ReactFlow
          style={{ width: '100%', height: '100%' }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          colorMode={isDark ? 'dark' : 'light'}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color={isDark ? '#27272A' : '#D4E8E0'}
            gap={20}
          />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={isDark ? '#27272A' : '#E8EFF6'}
            maskColor={isDark ? 'rgba(10,10,10,0.6)' : 'rgba(232,239,246,0.6)'}
            style={{ backgroundColor: isDark ? '#18181B' : '#FFFFFF' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
