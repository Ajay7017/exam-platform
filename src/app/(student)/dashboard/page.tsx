'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCardSkeleton } from '@/components/student/StatsCardSkeleton';
import { BookOpen, Trophy, Award, Clock, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Exams Taken',
      value: '12',
      icon: BookOpen,
      change: '+3 this week',
      changeType: 'positive',
    },
    {
      title: 'Average Score',
      value: '78%',
      icon: Trophy,
      change: '+5% vs last week',
      changeType: 'positive',
    },
    {
      title: 'Current Rank',
      value: '#142',
      icon: Award,
      change: 'Out of 5,432 students',
      changeType: 'neutral',
    },
    {
      title: 'Time Spent',
      value: '24h',
      icon: Clock,
      change: '8h this week',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Student! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's your learning progress overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading State
          Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))
        ) : (
          // Loaded State
          stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="animate-scale-in card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center gap-1 mt-1 ${
                  stat.changeType === 'positive' 
                    ? 'text-success-600' 
                    : 'text-muted-foreground'
                }`}>
                  {stat.changeType === 'positive' && (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Continue Learning Section */}
      <Card className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 animate-pulse">
                  <div className="h-12 w-12 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      GATE CS Mock Test 2025 - 1
                    </h4>
                    <p className="text-sm text-gray-600">
                      45 of 65 questions completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary-600">
                    69% Complete
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: '69%' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-warning-50 hover:bg-warning-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-500 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Mathematics Full Test
                    </h4>
                    <p className="text-sm text-gray-600">
                      12 of 50 questions completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-warning-600">
                    24% Complete
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-warning-500 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  action: 'Completed',
                  exam: 'GATE CS Mock Test',
                  score: '85%',
                  time: '2 hours ago',
                  icon: Trophy,
                  color: 'success',
                },
                {
                  action: 'Started',
                  exam: 'Mathematics Practice',
                  score: 'In Progress',
                  time: '5 hours ago',
                  icon: BookOpen,
                  color: 'primary',
                },
                {
                  action: 'Reviewed',
                  exam: 'Algorithms Test',
                  score: 'Solutions',
                  time: 'Yesterday',
                  icon: Award,
                  color: 'warning',
                },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${activity.color}-100`}>
                    <activity.icon className={`h-5 w-5 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action} {activity.exam}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {activity.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}