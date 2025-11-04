import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText, Star, Users, ArrowRight } from 'lucide-react'
import examsData from '@/data/exams.json'

export function PopularExams() {
  // Get first 6 exams
  const popularExams = examsData.exams.slice(0, 6)

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Popular Exams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start practicing with our most popular mock tests
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/exams">
              View All Exams
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Exams grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {popularExams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={exam.thumbnail}
                    alt={exam.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {exam.isFree && (
                    <Badge className="absolute top-4 left-4 bg-green-500">
                      Free
                    </Badge>
                  )}
                  <Badge 
                    className="absolute top-4 right-4"
                    variant={exam.difficulty === 'easy' ? 'secondary' : exam.difficulty === 'medium' ? 'default' : 'destructive'}
                  >
                    {exam.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {exam.subject}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {exam.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{exam.totalQuestions} questions</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{exam.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{exam.totalAttempts.toLocaleString()} attempts</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full" variant={exam.isFree ? 'default' : 'outline'}>
                  <Link href={`/exams/${exam.slug}`}>
                    {exam.isFree ? 'Start Free Test' : `₹${exam.price} - View Details`}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Mobile view all button */}
        <div className="flex justify-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/exams">
              View All Exams
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}