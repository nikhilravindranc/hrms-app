import dagre from '@dagrejs/dagre'
import { Node, Edge, Position } from '@xyflow/react'

export function layoutTree<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  nodeWidth: number,
  nodeHeight: number
): { nodes: Node<T>[]; edges: Edge[] } {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 70 })

  nodes.forEach(node => {
    graph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach(edge => {
    graph.setEdge(edge.source, edge.target)
  })

  dagre.layout(graph)

  const layoutedNodes = nodes.map(node => {
    const { x, y } = graph.node(node.id)
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    }
  })

  return { nodes: layoutedNodes, edges }
}
