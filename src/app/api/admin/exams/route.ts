// src/app/api/admin/exams/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'
import { examFiltersSchema, createExamSchema } from '@/lib/validations/exam'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const filters = examFiltersSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      subject: searchParams.get('subject'),
      difficulty: searchParams.get('difficulty'),
      search: searchParams.get('search'),
      isPublished: searchParams.get('isPublished')
    })
    
    const { page, limit, subject, difficulty, search, isPublished } = filters
    const skip = (page - 1) * limit
    
    const where: any = {}
    
    if (subject) {
      where.subject = { slug: subject }
    }
    
    if (difficulty) {
      where.difficulty = difficulty
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (isPublished !== undefined) {
      where.isPublished = isPublished
    }
    
    const [exams, totalCount] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        include: {
          subject: {
            select: { id: true, name: true, slug: true }
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
              purchases: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.exam.count({ where })
    ])
    
    const transformedExams = exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      slug: exam.slug,
      subject: exam.subject,
      thumbnail: exam.thumbnail,
      duration: exam.durationMin,
      totalQuestions: exam._count.questions,
      totalMarks: exam.totalMarks,
      difficulty: exam.difficulty,
      price: exam.price,
      isFree: exam.isFree,
      isPublished: exam.isPublished,
      totalAttempts: exam._count.attempts,
      totalPurchases: exam._count.purchases,
      instructions: exam.instructions,
      randomizeOrder: exam.randomizeOrder,
      allowReview: exam.allowReview,
      createdAt: exam.createdAt.toISOString(),
      updatedAt: exam.updatedAt.toISOString()
    }))
    
    return NextResponse.json({
      exams: transformedExams,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + exams.length < totalCount
      }
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = createExamSchema.parse(body)
    
    // Check if slug exists
    const existingExam = await prisma.exam.findUnique({
      where: { slug: validated.slug }
    })
    
    if (existingExam) {
      return NextResponse.json(
        { error: 'An exam with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: validated.subjectId }
    })
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }
    
    // Fetch questions to calculate total marks
    const questions = await prisma.question.findMany({
      where: { id: { in: validated.questionIds } },
      select: { id: true, marks: true }
    })
    
    if (questions.length !== validated.questionIds.length) {
      return NextResponse.json(
        { error: `Found ${questions.length} questions out of ${validated.questionIds.length} requested` },
        { status: 400 }
      )
    }
    
    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)
    
    // Create exam with questions
    const exam = await prisma.exam.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        subjectId: validated.subjectId,
        durationMin: validated.durationMin,
        totalMarks,
        price: validated.price,
        isFree: validated.isFree || validated.price === 0,
        isPaid: validated.price > 0,
        instructions: validated.instructions,
        randomizeOrder: validated.randomizeOrder ?? false,
        allowReview: validated.allowReview ?? true,
        difficulty: validated.difficulty ?? 'medium',
        thumbnail: validated.thumbnail,
        isPublished: false,
        questions: {
          create: validated.questionIds.map((questionId, index) => ({
            questionId,
            sequence: index
          }))
        }
      },
      include: {
        subject: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { questions: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      exam: {
        id: exam.id,
        title: exam.title,
        slug: exam.slug,
        subject: exam.subject,
        duration: exam.durationMin,
        totalQuestions: exam._count.questions,
        totalMarks: exam.totalMarks,
        difficulty: exam.difficulty,
        price: exam.price,
        isFree: exam.isFree,
        isPublished: exam.isPublished,
        createdAt: exam.createdAt.toISOString()
      }
    }, { status: 201 })
    
  } catch (error) {
    return handleApiError(error)
  }
}