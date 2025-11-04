import { UserPlus, FileSearch, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: <UserPlus className="w-12 h-12" />,
    step: 'Step 1',
    title: 'Create Your Account',
    description: 'Sign up in seconds with Google or email. No credit card required for free practice'
  },
  {
    icon: <FileSearch className="w-12 h-12" />,
    step: 'Step 2',
    title: 'Choose Your Exam',
    description: 'Browse through 450+ exams across GATE, SSC, JEE, NEET, UPSC, and more'
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    step: 'Step 3',
    title: 'Practice & Improve',
    description: 'Take tests, analyze results, and track your progress with detailed analytics'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started in three simple steps and begin your journey to success
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow relative z-10">
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg">
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="text-center">
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                    {step.step}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}