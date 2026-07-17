'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Employee } from '@/lib/mockData'

export function initialsOf(e: Employee) {
  return `${e.firstName[0]}${e.lastName[0]}`
}

// Deterministic photo per employee: pravatar.cc serves 70 stock headshots by index
function photoIndex(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return (hash % 70) + 1
}

export function PersonAvatar({ employee, size, tone }: { employee: Employee; size: number; tone: 'root' | 'normal' }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <span
        className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white ${
          tone === 'root' ? 'bg-[#004D43]' : 'bg-[#00755A]'
        }`}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {initialsOf(employee)}
      </span>
    )
  }

  return (
    <Image
      src={`https://i.pravatar.cc/150?img=${photoIndex(employee.id)}`}
      alt={`${employee.firstName} ${employee.lastName}`}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
    />
  )
}
