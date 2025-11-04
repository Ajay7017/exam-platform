import { Brain, BarChart3, Shield, Zap, Users2, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: <Brain className="w-10 h-10" />,
    title: 'Smart Practice',
    description: 'AI-powered question recommendations based on your weak areas and learning patterns'
  },
  {
    icon: <BarChart3 className="w-10 h-10" />,
    title: 'Real-time Analytics',
    description: 'Track your performance with detailed insights, topic-wise accuracy, and progress graphs'
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: 'Anti-Cheat System',
    description: 'Secure exam environment with tab monitoring and screenshot prevention'
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: 'Instant Results',
    description: 'Get detailed results immediately after test completion with answer explanations'
  },
  {
    icon: <Users2 className="w-10 h-10" />,
    title: 'Leaderboards',
    description: 'Compete with thousands of students and see where you stand nationally'
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: 'Expert Content',
    description: 'Questions curated by subject experts with detailed solutions and concepts'
  }
]

export function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you prepare smarter and achieve your goals
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-2 hover:border-blue-500 dark:hover:border-blue-600 transition-all hover:shadow-lg group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}