import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const violationSchema = z.object({
  type: z.enum(['tab_switch', 'window_blur', 'devtools', 'copy_attempt', 'right_click']),
  details: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { type, details } = violationSchema.parse(body)
    const attemptId = params.id

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        userId: true,
        status: true,
        tabSwitchCount: true,
        suspiciousFlags: true
      }
    })

    if (!attempt || attempt.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json({ error: 'Attempt not active' }, { status: 400 })
    }

    // Update violation records
    const flags = (attempt.suspiciousFlags as any[]) || []
    flags.push({
      type,
      details,
      timestamp: new Date().toISOString()
    })

    const updates: any = {
      suspiciousFlags: flags
    }

    if (type === 'tab_switch' || type === 'window_blur') {
      updates.tabSwitchCount = attempt.tabSwitchCount + 1
    }

    await prisma.attempt.update({
      where: { id: attemptId },
      data: updates
    })

    // Optional: Auto-submit after too many violations
    const newTabSwitchCount = updates.tabSwitchCount || attempt.tabSwitchCount
    
    return NextResponse.json({
      success: true,
      violationCount: flags.length,
      tabSwitchCount: newTabSwitchCount,
      warning: newTabSwitchCount >= 5 ? 'Multiple violations detected. Continued violations may result in disqualification.' : null
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to log violation' },
      { status: 500 }
    )
  }
}