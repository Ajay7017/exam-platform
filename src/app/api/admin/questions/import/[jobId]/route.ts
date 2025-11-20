import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { handleApiError, ApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/questions/import/[jobId]
 * Get import job status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await requireAdmin()

    const { jobId } = params

    const importJob = await prisma.importJob.findUnique({
      where: { id: jobId },
      include: {
        topic: {
          include: {
            subject: true,
          },
        },
      },
    })

    if (!importJob) {
      throw new ApiError('Import job not found', 404, 'NOT_FOUND')
    }

    const progress =
      importJob.totalQuestions > 0
        ? Math.round(
            ((importJob.successCount + importJob.failedCount) /
              importJob.totalQuestions) *
              100
          )
        : 0

    return NextResponse.json({
      id: importJob.id,
      fileName: importJob.fileName,
      subjectName: importJob.topic.subject.name,
      topicName: importJob.topic.name,
      status: importJob.status,
      totalQuestions: importJob.totalQuestions,
      successCount: importJob.successCount,
      failedCount: importJob.failedCount,
      progress,
      errors: importJob.errors,
      startedAt: importJob.startedAt.toISOString(),
      completedAt: importJob.completedAt?.toISOString(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}