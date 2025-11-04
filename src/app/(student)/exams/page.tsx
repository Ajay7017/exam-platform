import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { ExamFilters } from '@/components/student/ExamFilters'
import { ExamCard } from '@/components/student/ExamCard'
import examsData from '@/data/exams.json'

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse Exams</h1>
        <p className="text-muted-foreground mt-2">
          Choose from {examsData.exams.length} available exams across multiple subjects
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search exams by name or subject..."
          className="pl-10 h-12"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ExamFilters />
        </div>

        {/* Exams Grid */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {examsData.exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-8 flex justify-center">
            <p className="text-sm text-muted-foreground">
              Showing {examsData.exams.length} of {examsData.exams.length} exams
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}