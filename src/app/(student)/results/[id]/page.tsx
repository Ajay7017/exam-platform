// src/app/(student)/results/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Circle,
  Clock,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = {
  correct: '#10b981',
  wrong: '#ef4444',
  unattempted: '#6b7280',
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Load result from localStorage
    const storedResults = JSON.parse(localStorage.getItem('exam-results') || '[]');
    const foundResult = storedResults.find((r: any) => r.id === resultId);
    
    if (foundResult) {
      setResult(foundResult);
    }
  }, [resultId]);

  if (!result) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading result...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Correct', value: result.correct },
    { name: 'Wrong', value: result.wrong },
    { name: 'Unattempted', value: result.unattempted },
  ];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Results</h1>
          <p className="text-muted-foreground">{result.examTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm" onClick={() => router.push('/exams')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Take Another
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">
                  {result.score.toFixed(2)}
                </span>
                <span className="text-2xl text-muted-foreground">
                  / {result.totalMarks}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {result.percentage.toFixed(2)}%
                </Badge>
                {result.percentage >= 80 && (
                  <Badge className="bg-green-600">Excellent</Badge>
                )}
                {result.percentage >= 60 && result.percentage < 80 && (
                  <Badge className="bg-blue-600">Good</Badge>
                )}
                {result.percentage >= 40 && result.percentage < 60 && (
                  <Badge className="bg-yellow-600">Average</Badge>
                )}
                {result.percentage < 40 && (
                  <Badge className="bg-red-600">Needs Improvement</Badge>
                )}
              </div>
            </div>

            <div className="text-right space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Time Taken: {formatTime(result.timeTaken)}</span>
              </div>
              {result.rank && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>Rank: #{result.rank}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{result.correct}</p>
            <p className="text-xs text-muted-foreground mt-1">
              +{result.correct} marks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Wrong Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{result.wrong}</p>
            <p className="text-xs text-muted-foreground mt-1">
              -{(result.wrong * 0.25).toFixed(2)} marks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-600" />
              Unattempted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{result.unattempted}</p>
            <p className="text-xs text-muted-foreground mt-1">0 marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    const name = entry.name ?? '';
                    const percent = typeof entry.percent === 'number' ? entry.percent : 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Correct'
                          ? COLORS.correct
                          : entry.name === 'Wrong'
                          ? COLORS.wrong
                          : COLORS.unattempted
                      }
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Your Score', value: result.score },
                  { name: 'Average', value: result.totalMarks * 0.6 },
                  { name: 'Top Score', value: result.totalMarks * 0.95 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push('/exams')}>
              Practice More Exams
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}