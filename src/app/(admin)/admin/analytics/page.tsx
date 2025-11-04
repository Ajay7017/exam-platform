'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, FileQuestion, BookOpen, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  // Mock data for user signups (last 30 days)
  const userSignupData = [
    { date: 'Nov 1', users: 12 },
    { date: 'Nov 5', users: 19 },
    { date: 'Nov 10', users: 25 },
    { date: 'Nov 15', users: 32 },
    { date: 'Nov 20', users: 28 },
    { date: 'Nov 25', users: 35 },
    { date: 'Nov 30', users: 42 },
  ];

  // Mock data for exam attempts (last 7 days)
  const examAttemptsData = [
    { day: 'Mon', attempts: 45 },
    { day: 'Tue', attempts: 52 },
    { day: 'Wed', attempts: 48 },
    { day: 'Thu', attempts: 61 },
    { day: 'Fri', attempts: 55 },
    { day: 'Sat', attempts: 67 },
    { day: 'Sun', attempts: 58 },
  ];

  // Mock data for subject distribution
  const subjectDistribution = [
    { name: 'Computer Science', value: 856, color: '#3b82f6' },
    { name: 'Mathematics', value: 542, color: '#10b981' },
    { name: 'General Aptitude', value: 423, color: '#f59e0b' },
  ];

  // Mock data for revenue
  const revenueData = [
    { month: 'Jun', revenue: 45000 },
    { month: 'Jul', revenue: 52000 },
    { month: 'Aug', revenue: 48000 },
    { month: 'Sep', revenue: 61000 },
    { month: 'Oct', revenue: 73000 },
    { month: 'Nov', revenue: 89000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Platform insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5,432</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success-500" />
                  <span className="text-sm text-success-500 font-medium">
                    +12.5%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2,543</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success-500" />
                  <span className="text-sm text-success-500 font-medium">
                    +8.2%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
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
                <p className="text-sm text-gray-600">Exam Attempts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8,921</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success-500" />
                  <span className="text-sm text-success-500 font-medium">
                    +23.1%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100">
                <BookOpen className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹8.9L</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success-500" />
                  <span className="text-sm text-success-500 font-medium">
                    +18.7%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
                <DollarSign className="h-6 w-6 text-error-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Signups</CardTitle>
            <CardDescription>Last 30 days trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userSignupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exam Attempts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Attempts</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={examAttemptsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attempts" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Question Distribution by Subject</CardTitle>
            <CardDescription>Total questions across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const name = props.name ?? "Unknown";
                    const percent = typeof props.percent === "number" ? props.percent : 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {subjectDistribution.map((subject) => (
                <div key={subject.name} className="text-center">
                  <div
                    className="h-3 w-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="text-xs text-gray-600">{subject.name}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {subject.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₹${(value / 1000).toFixed(1)}K`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Exams</CardTitle>
          <CardDescription>Most attempted exams this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'GATE CS Mock Test 2025 - 1', attempts: 1240, trend: '+12%' },
              { name: 'SSC CGL Tier 1 Practice', attempts: 987, trend: '+8%' },
              { name: 'GATE Mathematics Full Test', attempts: 856, trend: '+15%' },
              { name: 'General Aptitude Speed Test', attempts: 743, trend: '+5%' },
              { name: 'Computer Networks Advanced', attempts: 612, trend: '+18%' },
            ].map((exam, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{exam.name}</div>
                    <div className="text-sm text-gray-500">
                      {exam.attempts} attempts
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success-500" />
                  <span className="text-sm font-medium text-success-500">
                    {exam.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}