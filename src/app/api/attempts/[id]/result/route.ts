import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attemptId = params.id

    // Get attempt with exam and questions
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    options: {
                      orderBy: { sequence: 'asc' }
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
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    // Verify ownership
    if (attempt.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if exam is submitted
    if (attempt.status !== 'completed') {
      return NextResponse.json(
        { error: 'Exam not yet submitted' },
        { status: 400 }
      )
    }

    // Get leaderboard entry for rank
    const leaderboardEntry = await prisma.leaderboardEntry.findFirst({
      where: { attemptId },
    })

    const totalAttempts = await prisma.leaderboardEntry.count({
      where: { examId: attempt.examId },
    })

    // Parse answers
    const userAnswers = (attempt.answers as Record<string, any>) || {}

    // Build question results with correct answers and explanations
    const questionResults = attempt.exam.questions.map((eq) => {
      const question = eq.question
      const correctOption = question.options.find(o => o.isCorrect)
      const userResponse = userAnswers[question.id]

      return {
        questionId: question.id,
        statement: question.statement,
        imageUrl: question.imageUrl,
        options: question.options.map((opt) => ({
          key: opt.optionKey,
          text: opt.text,
          imageUrl: opt.imageUrl,
          isCorrect: opt.isCorrect, // Now visible after submission
        })),
        yourAnswer: userResponse?.selectedOption || null,
        correctAnswer: correctOption?.optionKey || null,
        isCorrect: userResponse?.selectedOption === correctOption?.optionKey,
        explanation: question.explanation,
        markedForReview: userResponse?.markedForReview || false,
      }
    })

    // Calculate topic-wise performance
    const topicMap = new Map<
      string,
      { correct: number; wrong: number; total: number }
    >()

    questionResults.forEach((qr) => {
      const examQuestion = attempt.exam.questions.find((eq) => eq.question.id === qr.questionId)
      const topic = examQuestion?.question.topic || 'Other'

      if (!topicMap.has(topic)) {
        topicMap.set(topic, { correct: 0, wrong: 0, total: 0 })
      }

      const stats = topicMap.get(topic)!
      stats.total++

      if (qr.yourAnswer) {
        if (qr.isCorrect) {
          stats.correct++
        } else {
          stats.wrong++
        }
      }
    })

    const topicWisePerformance = Array.from(topicMap.entries()).map(
      ([topic, stats]) => ({
        topic,
        correct: stats.correct,
        wrong: stats.wrong,
        total: stats.total,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      })
    )

    return NextResponse.json({
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      score: attempt.score,
      totalMarks: attempt.exam.totalMarks,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      unattempted: attempt.unattempted,
      timeSpent: attempt.timeSpentSec,
      submittedAt: attempt.submittedAt,
      rank: leaderboardEntry?.rank || null,
      totalAttempts,
      topicWisePerformance,
      questionResults,
      suspiciousFlags: attempt.suspiciousFlags,
      tabSwitchCount: attempt.tabSwitchCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}