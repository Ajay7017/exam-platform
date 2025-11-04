import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import subjectsData from '@/data/subjects.json';

export default function SubjectsPage() {
  const { subjects } = subjectsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subjects & Topics
          </h1>
          <p className="mt-2 text-gray-600">
            Manage subjects and their topics
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{subject.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.totalQuestions} questions
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-error-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Topics:</span>
                  <span className="text-gray-600">{subject.topics.length}</span>
                </div>
                <div className="space-y-1">
                  {subject.topics.slice(0, 3).map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700">{topic.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {topic.questionCount}
                      </span>
                    </div>
                  ))}
                  {subject.topics.length > 3 && (
                    <button className="w-full text-center text-xs text-primary-500 hover:underline py-1">
                      +{subject.topics.length - 3} more topics
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Subject Card */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 mb-4">
            <Plus className="h-6 w-6 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Add New Subject
          </h3>
          <p className="text-sm text-gray-600">
            Create a new subject category
          </p>
        </CardContent>
      </Card>
    </div>
  );
}