'use client'

import { useEffect, useState } from 'react'
import { Users, FileText, Trophy, Clock } from 'lucide-react'

interface Stat {
  icon: React.ReactNode
  label: string
  value: number
  suffix: string
}

const stats: Stat[] = [
  {
    icon: <Users className="w-8 h-8" />,
    label: 'Active Students',
    value: 50000,
    suffix: '+'
  },
  {
    icon: <FileText className="w-8 h-8" />,
    label: 'Questions',
    value: 200000,
    suffix: '+'
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    label: 'Exams Completed',
    value: 125000,
    suffix: '+'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    label: 'Hours Practiced',
    value: 500000,
    suffix: '+'
  }
]

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000 // 2 seconds
    const increment = end / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end])

  return (
    <span className="text-4xl font-bold text-gray-900 dark:text-white">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsBar() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}