import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/questions
 * List all questions with filters
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Filters
    const subjectId = searchParams.get('subjectId')
    const topicId = searchParams.get('topicId')
    const difficulty = searchParams.get('difficulty')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}

    if (search) {
      where.statement = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (topicId) {
      where.topicId = topicId
    } else if (subjectId) {
      where.topic = {
        subjectId,
      }
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Fetch questions
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          topic: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          options: {
            orderBy: { sequence: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ])

    // Transform response
    const response = questions.map(q => ({
      id: q.id,
      statement: q.statement.substring(0, 100) + (q.statement.length > 100 ? '...' : ''),
      fullStatement: q.statement,
      imageUrl: q.imageUrl,
      topicId: q.topicId,
      topicName: q.topic.name,
      subjectId: q.topic.subjectId,
      subjectName: q.topic.subject.name,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      difficulty: q.difficulty,
      explanation: q.explanation,
      isActive: q.isActive,
      createdAt: q.createdAt.toISOString(),
      options: q.options.map(opt => ({
        id: opt.id,
        key: opt.optionKey,
        text: opt.text,
        imageUrl: opt.imageUrl,
        isCorrect: opt.isCorrect,
      })),
    }))

    return NextResponse.json({
      questions: response,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}