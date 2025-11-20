'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function StartExamPage() {
  const router = useRouter()
  const params = useParams()
  const examSlug = params.slug as string
  
  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    loadExamDetails()
  }, [examSlug])

  const loadExamDetails = async () => {
    try {
      const response = await fetch(`/api/exams/${examSlug}`)
      const data = await response.json()
      
      if (response.ok) {
        setExam(data)
      } else {
        alert(data.error)
        router.push('/exams')
      }
    } catch (error) {
      alert('Failed to load exam details')
      router.push('/exams')
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    setStarting(true)
    
    try {
      const response = await fetch('/api/attempts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: exam.id })
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to exam interface
        router.push(`/exam/take/${data.attemptId}`)
      } else {
        // Check if there's an active attempt
        if (data.canResume && data.attemptId) {
          const resume = confirm(data.error + '\n\nDo you want to resume?')
          if (resume) {
            router.push(`/exam/take/${data.attemptId}`)
          } else {
            setStarting(false)
          }
        } else {
          alert(data.error || 'Failed to start exam')
          setStarting(false)
        }
      }
    } catch (error) {
      alert('Failed to start exam. Please try again.')
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading exam details...</p>
        </div>
      </div>
    )
  }

  if (!exam) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">{exam.title}</h1>
          
          {/* Exam Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{exam.duration} min</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{exam.totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{exam.totalMarks}</div>
              <div className="text-sm text-gray-600">Total Marks</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 capitalize">{exam.difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
          </div>

          {/* Instructions */}
          {exam.instructions && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: exam.instructions }}
              />
            </div>
          )}

          {/* Important Points */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>⚠️</span>
              Important Points
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Once started, the timer cannot be paused</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Your answers are auto-saved every 10 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>You can navigate between questions freely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mark questions for review if you're unsure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Exam will auto-submit when time expires</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Negative marking: -0.25 per wrong answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Once submitted, you cannot change answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Tab switching is monitored and discouraged</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              href={`/exams/${examSlug}`}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back
            </Link>
            
            <button
              onClick={handleStart}
              disabled={starting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition"
            >
              {starting ? 'Starting...' : '🚀 Start Exam Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}