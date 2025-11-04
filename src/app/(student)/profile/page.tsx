'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' // ✅ ensure this file exists (see below)
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  User, Mail, Phone, MapPin, Calendar,
  Camera, Save, Trophy, Target, Clock, Flame
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student" alt="Profile" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Student Name</h2>
                  <p className="text-muted-foreground">student@example.com</p>
                  <Badge variant="secondary" className="mt-2">
                    Pro Member
                  </Badge>
                </div>

                <Separator />

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Rank</span>
                    </div>
                    <span className="font-semibold">#147</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Accuracy</span>
                    </div>
                    <span className="font-semibold">84.5%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Time Spent</span>
                    </div>
                    <span className="font-semibold">45 hrs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Streak</span>
                    </div>
                    <span className="font-semibold">7 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🎯', name: 'Perfect Score', earned: true },
                  { icon: '⚡', name: 'Speed Demon', earned: true },
                  { icon: '🔥', name: '7 Day Streak', earned: true },
                  { icon: '📚', name: '50 Exams', earned: false },
                  { icon: '🏆', name: 'Top 100', earned: false },
                  { icon: '⭐', name: 'All Rounder', earned: false },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                      badge.earned
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 border-muted opacity-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className="text-xs text-center font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  'Edit Profile'
                )}
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10"
                      disabled={!isEditing}
                      defaultValue="Student"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="pl-10"
                      disabled={!isEditing}
                      defaultValue="Name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    className="pl-10"
                    disabled={!isEditing}
                    defaultValue="student@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    disabled={!isEditing}
                    defaultValue="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State"
                    className="pl-10"
                    disabled={!isEditing}
                    defaultValue="Delhi, India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    className="pl-10"
                    disabled={!isEditing}
                    defaultValue="2000-01-01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Preferences</CardTitle>
              <CardDescription>Customize your exam experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Exam</Label>
                <Input
                  id="target"
                  placeholder="e.g., GATE CS 2025"
                  defaultValue="GATE CS 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjects">Preferred Subjects</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Computer Science', 'Mathematics', 'General Aptitude'].map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="goals"
                    type="number"
                    placeholder="30"
                    defaultValue="30"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">questions</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Number of questions you want to practice daily
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full sm:w-auto">
                Reset Progress
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
