import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import leaderboardData from '@/data/leaderboard.json'

export default function LeaderboardPage() {
  const topThree = leaderboardData.leaderboard.slice(0, 3)
  const others = leaderboardData.leaderboard.slice(3)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
    if (rank === 2) return 'border-gray-400 bg-gray-50 dark:bg-gray-900'
    if (rank === 3) return 'border-orange-600 bg-orange-50 dark:bg-orange-950'
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          See how you rank against other students nationwide
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold">#147</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold">942</p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold">84.5%</p>
              </div>
              <Award className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {topThree.map((user) => (
              <Card 
                key={user.userId} 
                className={`border-2 ${getRankColor(user.rank)}`}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  <Avatar className="w-20 h-20 mx-auto border-4 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.examsCompleted} exams completed
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-semibold">{user.score}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Points:</span>
                      <span className="font-semibold">{user.totalPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-semibold">{user.averageAccuracy}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {others.map((user) => (
              <div
                key={user.userId}
                className={`flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors ${
                  user.isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'border'
                }`}
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar & Name */}
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{user.name}</h4>
                    {user.isCurrentUser && (
                      <Badge variant="secondary">You</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.examsCompleted} exams • {user.averageAccuracy}% accuracy
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Score</p>
                    <p className="font-semibold">{user.score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Points</p>
                    <p className="font-semibold">{user.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}