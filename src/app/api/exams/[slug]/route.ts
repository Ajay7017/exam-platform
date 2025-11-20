// src/app/api/exams/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Optional auth
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    
    // Fetch exam
    const exam = await prisma.exam.findUnique({
      where: { 
        slug: params.slug,
        isPublished: true // Only show published exams to students
      },
      include: {
        subject: {
          select: { id: true, name: true, slug: true }
        },
        questions: {
          include: {
            question: {
              include: {
                topic: {
                  select: { id: true, name: true, slug: true }
                }
              }
            }
          },
          orderBy: { sequence: 'asc' }
        },
        _count: {
          select: {
            attempts: true,
            purchases: true
          }
        }
      }
    })
    
    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }
    
    // ✅ PHASE 6: Check purchase status with active validation
    let isPurchased = false
    let userAttempts = 0
    
    if (userId) {
      const [purchase, attempts] = await Promise.all([
        prisma.purchase.findFirst({
          where: {
            userId,
            examId: exam.id,
            status: 'active',
            validUntil: { gte: new Date() }
          }
        }),
        prisma.attempt.count({
          where: {
            userId,
            examId: exam.id,
            status: 'submitted'
          }
        })
      ])
      
      isPurchased = !!purchase || exam.isFree
      userAttempts = attempts
    } else {
      isPurchased = exam.isFree
    }
    
    // Get unique topics
    const topics = [...new Set(
      exam.questions.map(eq => eq.question.topic.name)
    )]
    
    // Topic-wise question count
    const topicWiseCount = exam.questions.reduce((acc, eq) => {
      const topicName = eq.question.topic.name
      acc[topicName] = (acc[topicName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate difficulty distribution
    const difficultyCount = exam.questions.reduce((acc, eq) => {
      const diff = eq.question.difficulty
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return NextResponse.json({
      id: exam.id,
      title: exam.title,
      slug: exam.slug,
      subject: {
        id: exam.subject.id,
        name: exam.subject.name,
        slug: exam.subject.slug
      },
      thumbnail: exam.thumbnail || '/default-exam-thumbnail.jpg',
      duration: exam.durationMin,
      totalQuestions: exam.questions.length,
      totalMarks: exam.totalMarks,
      difficulty: exam.difficulty,
      price: exam.price,
      isFree: exam.isFree,
      isPurchased, // ✅ PHASE 6: Now includes purchase validation
      instructions: exam.instructions,
      topics,
      topicWiseCount: Object.entries(topicWiseCount).map(([topic, count]) => ({
        topic,
        count
      })),
      difficultyDistribution: {
        easy: difficultyCount.easy || 0,
        medium: difficultyCount.medium || 0,
        hard: difficultyCount.hard || 0
      },
      totalAttempts: exam._count.attempts,
      totalPurchases: exam._count.purchases,
      userAttempts,
      canAttempt: isPurchased, // ✅ PHASE 6: Gate exam access
      createdAt: exam.createdAt.toISOString()
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}