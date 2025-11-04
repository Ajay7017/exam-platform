'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Validation schema
const questionSchema = z.object({
  statement: z.string().min(10, 'Question must be at least 10 characters'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().min(1).max(10),
  negativeMarks: z.number().min(0).max(5),
  optionA: z.string().min(1, 'Option A is required'),
  optionB: z.string().min(1, 'Option B is required'),
  optionC: z.string().min(1, 'Option C is required'),
  optionD: z.string().min(1, 'Option D is required'),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export function QuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      marks: 1,
      negativeMarks: 0.25,
    },
  });

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log('Form data:', data);
    toast.success('Question added successfully!');
    reset();
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Statement */}
          <div className="space-y-2">
            <Label htmlFor="statement">
              Question Statement <span className="text-error-500">*</span>
            </Label>
            <textarea
              id="statement"
              {...register('statement')}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Enter the question statement..."
            />
            {errors.statement && (
              <p className="text-sm text-error-500">{errors.statement.message}</p>
            )}
          </div>

          {/* Subject and Topic */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-error-500">*</span>
              </Label>
              <select
                id="subject"
                {...register('subject')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select Subject</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="General Aptitude">General Aptitude</option>
              </select>
              {errors.subject && (
                <p className="text-sm text-error-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">
                Topic <span className="text-error-500">*</span>
              </Label>
              <Input
                id="topic"
                {...register('topic')}
                placeholder="e.g., Data Structures"
              />
              {errors.topic && (
                <p className="text-sm text-error-500">{errors.topic.message}</p>
              )}
            </div>
          </div>

          {/* Difficulty and Marks */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-error-500">*</span>
              </Label>
              <select
                id="difficulty"
                {...register('difficulty')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="text-sm text-error-500">{errors.difficulty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">
                Marks <span className="text-error-500">*</span>
              </Label>
              <Input
                id="marks"
                type="number"
                step="0.01"
                {...register('marks', { valueAsNumber: true })}
              />
              {errors.marks && (
                <p className="text-sm text-error-500">{errors.marks.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="negativeMarks">
                Negative Marks <span className="text-error-500">*</span>
              </Label>
              <Input
                id="negativeMarks"
                type="number"
                step="0.01"
                {...register('negativeMarks', { valueAsNumber: true })}
              />
              {errors.negativeMarks && (
                <p className="text-sm text-error-500">{errors.negativeMarks.message}</p>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label>Options <span className="text-error-500">*</span></Label>
            
            {['A', 'B', 'C', 'D'].map((option) => (
              <div key={option} className="space-y-2">
                <Label htmlFor={`option${option}`}>Option {option}</Label>
                <Input
                  id={`option${option}`}
                  {...register(`option${option}` as any)}
                  placeholder={`Enter option ${option}`}
                />
                {errors[`option${option}` as keyof QuestionFormData] && (
                  <p className="text-sm text-error-500">
                    {errors[`option${option}` as keyof QuestionFormData]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <div className="space-y-2">
            <Label htmlFor="correctAnswer">
              Correct Answer <span className="text-error-500">*</span>
            </Label>
            <select
              id="correctAnswer"
              {...register('correctAnswer')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select correct answer</option>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
            {errors.correctAnswer && (
              <p className="text-sm text-error-500">{errors.correctAnswer.message}</p>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">
              Explanation <span className="text-error-500">*</span>
            </Label>
            <textarea
              id="explanation"
              {...register('explanation')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Explain the correct answer..."
            />
            {errors.explanation && (
              <p className="text-sm text-error-500">{errors.explanation.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Adding Question...' : 'Add Question'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}