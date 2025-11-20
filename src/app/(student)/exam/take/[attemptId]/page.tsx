import React, { useEffect, useState, useCallback, useRef } from 'react';

// Mock data for demo - replace with actual API calls
const mockExamData = {
  attemptId: 'attempt_123',
  examTitle: 'Physics Mock Test 1',
  duration: 60,
  totalQuestions: 10,
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  allowReview: true,
  questions: Array.from({ length: 10 }, (_, i) => ({
    id: `q${i + 1}`,
    sequence: i + 1,
    statement: `Question ${i + 1}: What is the fundamental principle being tested here?`,
    imageUrl: null,
    topic: ['Mechanics', 'Thermodynamics', 'Optics'][i % 3],
    marks: 4,
    negativeMarks: 1,
    difficulty: ['easy', 'medium', 'hard'][i % 3],
    options: [
      { key: 'A', text: 'First option answer', imageUrl: null },
      { key: 'B', text: 'Second option answer', imageUrl: null },
      { key: 'C', text: 'Third option answer', imageUrl: null },
      { key: 'D', text: 'Fourth option answer', imageUrl: null },
    ]
  }))
};

export default function ExamInterface() {
  const [exam] = useState(mockExamData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout>();

  // Initialize timer
  useEffect(() => {
    const expiresAt = new Date(exam.expiresAt).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
    setTimeRemaining(remaining);

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-save every 10 seconds
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      saveAnswers();
    }, 10000);

    return () => {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current);
      }
    };
  }, [answers, markedForReview]);

  // Anti-cheating: detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        fetch(`/api/attempts/${exam.attemptId}/violation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'tab_switch' })
        }).catch(console.error);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
    };
  }, [exam.attemptId]);

  const saveAnswers = async () => {
    try {
      const answersToSave = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
        markedForReview: markedForReview[questionId] || false
      }));

      // In production: await fetch('/api/attempts/.../save-batch', ...)
      console.log('Auto-saving:', answersToSave.length, 'answers');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === optionKey ? null : optionKey
    }));
  };

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      setShowSubmitConfirm(true);
      return;
    }

    setSubmitting(true);

    try {
      await saveAnswers();
      
      // In production: const result = await fetch('/api/attempts/.../submit', {method: 'POST'})
      console.log('Exam submitted!');
      
      // Redirect to results
      alert('Exam submitted! Redirecting to results...');
      // window.location.href = `/results/${exam.attemptId}`;
    } catch (error) {
      alert('Failed to submit exam. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const question = exam.questions[currentQuestion];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const visitedQuestions = new Set(Object.keys(answers).concat(Object.keys(markedForReview)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{exam.examTitle}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {exam.totalQuestions}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div 
                className="text-2xl font-mono font-bold transition-colors"
                style={{ color: timeRemaining < 300 ? '#EF4444' : timeRemaining < 600 ? '#F59E0B' : '#10B981' }}
              >
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-gray-600">Time Remaining</div>
            </div>
            
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Question Panel */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {question.topic}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    +{question.marks} | -{question.negativeMarks}
                  </span>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: question.statement }} />
              </div>
            </div>
            
            {question.imageUrl && (
              <img 
                src={question.imageUrl} 
                alt="Question" 
                className="max-w-full h-auto rounded-lg mt-4 border"
              />
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.key}
                onClick={() => handleOptionSelect(question.id, option.key)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[question.id] === option.key
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                    answers[question.id] === option.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {option.key}
                  </div>
                  <div className="flex-1 pt-1">
                    <div dangerouslySetInnerHTML={{ __html: option.text }} />
                    {option.imageUrl && (
                      <img 
                        src={option.imageUrl} 
                        alt={`Option ${option.key}`} 
                        className="max-w-full h-auto rounded mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Selection */}
          {answers[question.id] && (
            <button
              onClick={() => handleOptionSelect(question.id, answers[question.id]!)}
              className="mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
            >
              Clear Selection
            </button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => handleMarkForReview(question.id)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                markedForReview[question.id]
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {markedForReview[question.id] ? '★ Marked for Review' : '☆ Mark for Review'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                ← Previous
              </button>
              
              {currentQuestion < exam.totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette */}
        <div className="w-80 bg-white rounded-lg shadow p-6 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Question Palette</h3>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-500"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-red-500"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500"></div>
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-300"></div>
              <span>Not Visited</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600 text-lg">{answeredCount}</div>
              <div className="text-xs text-gray-600">Answered</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-red-600 text-lg">{exam.totalQuestions - answeredCount}</div>
              <div className="text-xs text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600 text-lg">{reviewCount}</div>
              <div className="text-xs text-gray-600">Marked</div>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2">
            {exam.questions.map((q, index) => {
              const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;
              const isMarked = markedForReview[q.id];
              const isCurrent = index === currentQuestion;
              const isVisited = visitedQuestions.has(q.id);
              
              let bgColor = 'bg-gray-300';
              if (isMarked) bgColor = 'bg-yellow-500';
              else if (isAnswered) bgColor = 'bg-green-500';
              else if (isVisited) bgColor = 'bg-red-500';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-full aspect-square rounded font-bold text-white ${bgColor} ${
                    isCurrent ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                  } hover:opacity-90 transition text-sm`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Submit Exam?</h3>
            <div className="mb-6 space-y-2 text-sm">
              <p className="text-gray-700">Are you sure you want to submit?</p>
              <div className="p-4 bg-blue-50 rounded">
                <p className="font-medium mb-2">Summary:</p>
                <ul className="space-y-1">
                  <li>✓ Answered: <strong>{answeredCount}</strong></li>
                  <li>✗ Not Answered: <strong>{exam.totalQuestions - answeredCount}</strong></li>
                  <li>★ Marked for Review: <strong>{reviewCount}</strong></li>
                </ul>
              </div>
              <p className="text-red-600 font-medium">⚠️ You cannot change answers after submission!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmit(true);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}