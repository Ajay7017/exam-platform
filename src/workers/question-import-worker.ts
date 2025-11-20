import { startQuestionImportWorker } from '@/lib/queue'

console.log('🚀 Starting question import worker...')

const worker = startQuestionImportWorker()

console.log('✅ Worker started and listening for jobs')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⏹️  Shutting down worker...')
  await worker.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('⏹️  Shutting down worker...')
  await worker.close()
  process.exit(0)
})