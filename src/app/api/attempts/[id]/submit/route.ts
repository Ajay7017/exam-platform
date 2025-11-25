import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const attemptId = params.id

    // 1. Get complete attempt data with all questions
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    options: true,
                    topic: {
                      select: { name: true }
                    }
                  }
                }
              },
              orderBy: { sequence: 'asc' }
            }
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      )
    }

    if (attempt.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Attempt already submitted' },
        { status: 400 }
      )
    }

    // 2. Calculate score (SERVER-SIDE ONLY!)
    const userAnswers = (attempt.answers as Record<string, any>) || {}
    
    let score = 0
    let correctCount = 0
    let wrongCount = 0
    let unattempted = 0

    const topicStats = new Map<string, {
      correct: number
      wrong: number
      total: number
    }>()

    for (const examQuestion of attempt.exam.questions) {
      const question = examQuestion.question
      const correctOption = question.options.find(o => o.isCorrect)
      const correctAnswer = correctOption?.optionKey || null
      
      const userResponse = userAnswers[question.id]
      const userAnswer = userResponse?.selectedOption || null

      // Update topic stats
      const topicName = question.topic.name
      if (!topicStats.has(topicName)) {
        topicStats.set(topicName, { correct: 0, wrong: 0, total: 0 })
      }
      const stats = topicStats.get(topicName)!
      stats.total++

      // Calculate marks
      if (userAnswer === null) {
        unattempted++
      } else if (userAnswer === correctAnswer) {
        correctCount++
        score += question.marks
        stats.correct++
      } else {
        wrongCount++
        score -= question.negativeMarks
        stats.wrong++
      }
    }

    // 3. Calculate time taken
    const timeTaken = Math.floor(
      (new Date().getTime() - attempt.startedAt.getTime()) / 1000
    )

    // 4. Calculate percentage
    const percentage = (score / attempt.exam.totalMarks) * 100

    // 5. Calculate rank and percentile BEFORE updating attempt
    const submittedAt = new Date()

    // Get all existing completed attempts for this exam
    const allCompletedAttempts = await prisma.leaderboardEntry.findMany({
      where: {
        examId: attempt.examId,
      },
      select: {
        userId: true,
        score: true,
        timeTaken: true,
      }
    })

    // Add current user's attempt to the list
    const allAttemptsList = [
      ...allCompletedAttempts,
      {
        userId: attempt.userId,
        score,
        timeTaken
      }
    ]

    // Sort: Higher score first, then faster time
    allAttemptsList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.timeTaken - b.timeTaken
    })

    // Find current user's rank
    const userRank = allAttemptsList.findIndex(
      entry => entry.userId === attempt.userId && entry.score === score && entry.timeTaken === timeTaken
    ) + 1

    // Calculate percentile (what % of students did you beat?)
    const totalAttempts = allAttemptsList.length
    const percentile = totalAttempts > 1 
      ? ((totalAttempts - userRank) / (totalAttempts - 1)) * 100 
      : 100

    // 6. Update attempt with results (INCLUDING rank and percentile)
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: 'completed',
        submittedAt,
        score,
        percentage,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        unattempted,
        timeSpentSec: timeTaken,
        rank: userRank,           // ✅ SAVING RANK
        percentile: percentile    // ✅ SAVING PERCENTILE
      }
    })

    // 7. Create/update leaderboard entry with rank
    await prisma.leaderboardEntry.upsert({
      where: {
        examId_userId: {
          examId: attempt.examId,
          userId: attempt.userId
        }
      },
      create: {
        examId: attempt.examId,
        userId: attempt.userId,
        attemptId: attempt.id,
        score,
        percentage,
        rank: userRank,
        timeTaken,
        submittedAt
      },
      update: {
        attemptId: attempt.id,
        score,
        percentage,
        rank: userRank,
        timeTaken,
        submittedAt
      }
    })

    // 8. Update ranks for ALL users (because new submission might affect others' ranks)
    // This runs in background after response is sent
    prisma.$transaction(async (tx) => {
      const allEntries = await tx.leaderboardEntry.findMany({
        where: { examId: attempt.examId },
        orderBy: [
          { score: 'desc' },
          { timeTaken: 'asc' }
        ]
      })

      // Batch update ranks
      for (let i = 0; i < allEntries.length; i++) {
        await tx.leaderboardEntry.update({
          where: { id: allEntries[i].id },
          data: { rank: i + 1 }
        })
      }
    }).catch(err => {
      console.error('Failed to update all ranks:', err)
    })

    // 9. Build topic-wise performance
    const topicWisePerformance = Array.from(topicStats.entries()).map(
      ([topic, stats]) => ({
        topic,
        correct: stats.correct,
        wrong: stats.wrong,
        total: stats.total,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
      })
    )

    // 10. Return immediate results (NOW WITH RANK & PERCENTILE)
    return NextResponse.json({
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      score,
      totalMarks: attempt.exam.totalMarks,
      percentage: parseFloat(percentage.toFixed(2)),
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattempted,
      timeTaken,
      rank: userRank,                              // ✅ NOW INCLUDED
      percentile: parseFloat(percentile.toFixed(2)), // ✅ NOW INCLUDED
      totalAttempts,
      submittedAt: submittedAt.toISOString(),
      topicWisePerformance
    })

  } catch (error) {
    return handleApiError(error)
  }
}