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
import { mockDepartments, mockOrganization } from '@/lib/mockData'
import { layoutTree } from '@/lib/treeLayout'
import { DepartmentNode, DepartmentNodeData } from '@/components/tree/DepartmentNode'

const nodeTypes = { department: DepartmentNode }
const NODE_WIDTH = 240
const NODE_HEIGHT = 64

export default function DepartmentTreePage() {
  const { isDark } = useTheme()
  const { employees, getEmployee } = useEmployee()

  const textColor = isDark ? 'text-[#D4D4D8]' : 'text-[#0C2472]'
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#94A3B8]'
  const cardBg = isDark ? 'bg-[#18181B]' : 'bg-white'
  const borderColor = isDark ? 'border-[#27272A]' : 'border-[#D4E8E0]'

  const { nodes, edges } = useMemo(() => {
    const depts = mockDepartments.map(dept => ({
      ...dept,
      head: getEmployee(dept.headId),
      count: employees.filter(e => e.department === dept.name).length,
    }))

    const rootId = 'org-root'

    const rawNodes: Node<DepartmentNodeData>[] = [
      {
        id: rootId,
        type: 'department',
        position: { x: 0, y: 0 },
        data: {
          id: rootId,
          name: mockOrganization.name,
          employeeCount: employees.length,
          isRoot: true,
        },
      },
      ...depts.map(dept => ({
        id: dept.id,
        type: 'department',
        position: { x: 0, y: 0 },
        data: {
          id: dept.id,
          name: dept.name,
          employeeCount: dept.count,
          headName: dept.head ? `${dept.head.firstName} ${dept.head.lastName}` : undefined,
          clickable: true,
        },
      })),
    ]

    const rawEdges: Edge[] = depts.map(dept => ({
      id: `${rootId}-${dept.id}`,
      source: rootId,
      target: dept.id,
      type: 'smoothstep',
      style: { stroke: isDark ? '#27272A' : '#D4E8E0', strokeWidth: 2 },
    }))

    return layoutTree(rawNodes, rawEdges, NODE_WIDTH, NODE_HEIGHT)
  }, [employees, getEmployee, isDark])

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl font-extrabold ${textColor}`}>Department Tree</h1>
        <p className={`text-xs font-medium mt-0.5 ${textSecondary}`}>Functional hierarchy across the organization</p>
      </div>

      <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`} style={{ height: 560 }}>
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
