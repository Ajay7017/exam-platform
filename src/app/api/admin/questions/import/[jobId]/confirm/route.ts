import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { handleApiError, ApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'
import { queueQuestionImport } from '@/lib/queue'
import type { ParsedQuestion } from '@/lib/question-parser'

/**
 * POST /api/admin/questions/import/[jobId]/confirm
 * Confirm import and start background job
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await requireAdmin()

    const { jobId } = params

    // Get import job
    const importJob = await prisma.importJob.findUnique({
      where: { id: jobId },
    })

    if (!importJob) {
      throw new ApiError('Import job not found', 404, 'NOT_FOUND')
    }

    if (importJob.status !== 'queued') {
      return NextResponse.json(
        { error: 'Import job already processed' },
        { status: 400 }
      )
    }

    // Get full question data (stored in previewData during preview)
    const questions = importJob.previewData as unknown as ParsedQuestion[]

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions to import' },
        { status: 400 }
      )
    }

    // Queue the import job
    await queueQuestionImport(jobId, importJob.topicId, questions)

    return NextResponse.json({
      success: true,
      importJobId: jobId,
      message: 'Import started in background',
      totalQuestions: questions.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}