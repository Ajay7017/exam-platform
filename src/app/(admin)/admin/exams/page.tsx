'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  Clock,
  FileQuestion,
  MoreVertical,
} from 'lucide-react';
import examsData from '@/data/exams.json';

export default function AdminExamsPage() {
  const { exams } = examsData;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter exams
  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success-100 text-success-700';
      case 'medium':
        return 'bg-warning-100 text-warning-700';
      case 'hard':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="mt-2 text-gray-600">
            Manage all exams and mock tests ({filteredExams.length} total)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Exam
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search exams by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {exams.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <FileQuestion className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Free Exams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {exams.filter((e) => e.isFree).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                <FileQuestion className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Exams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {exams.filter((e) => !e.isFree).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100">
                <FileQuestion className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {exams.reduce((sum, e) => sum + e.totalAttempts, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
                <Users className="h-6 w-6 text-error-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600">No exams found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try a different search term
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Exam Image */}
                <div className="relative h-40 bg-gradient-to-br from-primary-500 to-primary-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileQuestion className="h-16 w-16 text-white opacity-50" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className={getDifficultyColor(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Exam Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {exam.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{exam.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      <span>{exam.totalQuestions} Q</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{exam.totalAttempts}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {exam.isFree ? (
                      <span className="text-lg font-bold text-success-600">Free</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₹{(exam.price / 100).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 text-error-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create New Exam Card */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4">
            <Plus className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Create New Exam
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Start building a new mock test or exam
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}