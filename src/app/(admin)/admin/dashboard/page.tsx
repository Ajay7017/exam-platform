import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileQuestion, BookOpen, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Questions',
      value: '2,543',
      icon: FileQuestion,
      change: '+23 today',
    },
    {
      title: 'Active Exams',
      value: '47',
      icon: BookOpen,
      change: '12 drafts',
    },
    {
      title: 'Total Users',
      value: '5,432',
      icon: Users,
      change: '+142 this week',
    },
    {
      title: 'Revenue',
      value: '₹2.4L',
      icon: DollarSign,
      change: '+12% vs last month',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard 🔧
        </h1>
        <p className="mt-2 text-gray-600">
          Platform overview and management
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Admin Layout Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            ✅ Admin sidebar navigation is working!
            <br />
            ✅ Different menu structure from student layout
            <br />
            ✅ Try clicking different sections in the sidebar
            <br />
            ✅ Notice the gray background on admin pages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}