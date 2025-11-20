'use client';
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, FileText, Award, Users, Star, 
  CheckCircle, AlertCircle, TrendingUp, BookOpen 
} from 'lucide-react'
import examsData from '@/data/exams.json'
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExamDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter(); // ✅ ADD THIS
  
  const exam = examsData.exams.find(e => e.slug === params.slug)

  if (!exam) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={exam.thumbnail}
                    alt={exam.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{exam.subject}</Badge>
                      <Badge variant={
                        exam.difficulty === 'easy' ? 'secondary' :
                        exam.difficulty === 'medium' ? 'default' : 'destructive'
                      }>
                        {exam.difficulty}
                      </Badge>
                      {exam.isFree && (
                        <Badge className="bg-green-500">Free</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold">{exam.title}</h1>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{exam.rating}</span>
                      <span className="text-muted-foreground">rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{exam.totalAttempts.toLocaleString()} attempts</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{exam.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="font-semibold">{exam.totalQuestions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Marks</p>
                    <p className="font-semibold">{exam.totalMarks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="font-semibold capitalize">{exam.difficulty}</p>
                  </div>
                </div>
                <Link 
                  href={`/exam/${exam.slug}/start`}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
                >
                  Start Exam Now
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Topics Covered */}
          <Card>
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exam.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="px-3 py-1">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Important Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Each question carries equal marks with negative marking for wrong answers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  You can mark questions for review and return to them later
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your progress is auto-saved every 30 seconds
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Switching tabs more than 3 times will be flagged as suspicious activity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-6">
              {/* Price */}
              <div className="text-center py-4">
                {exam.isFree ? (
                  <div>
                    <p className="text-4xl font-bold text-green-600">Free</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      No payment required
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold">₹{exam.price}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      One-time payment
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/exam-interface/${exam.id}`}>
                    {exam.isFree ? 'Start Free Test' : 'Purchase & Start'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/exams">
                    Browse More Exams
                  </Link>
                </Button>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-3">
                <p className="font-semibold">This exam includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant results
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detailed solutions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Performance analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Leaderboard ranking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lifetime access
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}