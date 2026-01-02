"use client";
import { useState, useEffect, useMemo } from "react";
import { useGetQuiz, useSubmitQuizAttempt } from "@/hooks/quiz-hooks";
import { Clock, AlertCircle, CheckCircle, XCircle, Trophy, Timer, Award, Brain } from "lucide-react";
import { Progress } from "../ui/progress";

interface Answer {
  questionIndex: number;
  answer: any; // can be number, number[], or string
}

export default function EnhancedQuizPlayer({
  courseId,
  quizId,
  userId,
  onFinish,
}: {
  courseId: string;
  quizId: string;
  userId: string;
  onFinish: () => void;
}) {
  const { data, isLoading } = useGetQuiz(courseId, quizId, userId);
  const submit = useSubmitQuizAttempt();

  const quiz = data?.quiz;
  const progress = data?.progress;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [retry, setRetry] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStartTime] = useState(Date.now());
  const [showReview, setShowReview] = useState(false);

  // Randomize questions and options if enabled
  const shuffledQuiz = useMemo(() => {
    if (!quiz) return null;
    
    let questions = [...quiz.questions];
    
    if (quiz.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    
    if (quiz.randomizeOptions) {
      questions = questions.map((q: any) => {
        if (q.questionType === "multiple-choice" || q.questionType === "multiple-select" || q.questionType === "true-false") {
          const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
          return { ...q, options: shuffledOptions };
        }
        return q;
      });
    }
    
    return { ...quiz, questions };
  }, [quiz]);

  // Timer logic
  useEffect(() => {
    if (!shuffledQuiz || !shuffledQuiz.timeLimit || shuffledQuiz.timeLimit === 0) return;
    
    const totalSeconds = shuffledQuiz.timeLimit * 60;
    setTimeRemaining(totalSeconds);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [shuffledQuiz]);

  const calculateScore = () => {
    if (!shuffledQuiz) return { score: 0, correctCount: 0 };
    
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    shuffledQuiz.questions.forEach((question: any, index: number) => {
      const answer = answers.find(a => a.questionIndex === index);
      const points = question.points || 1;
      totalPoints += points;

      if (!answer) return;

      let isCorrect = false;

      switch (question.questionType) {
        case "multiple-choice":
        case "true-false":
          isCorrect = question.options[answer.answer]?.isCorrect;
          break;
        case "multiple-select":
          const selectedOptions = answer.answer as number[];
          const correctOptions = question.options
            .map((opt: any, i: number) => opt.isCorrect ? i : -1)
            .filter((i: number) => i !== -1);
          isCorrect = 
            selectedOptions.length === correctOptions.length &&
            selectedOptions.every((i: number) => correctOptions.includes(i));
          break;
        case "fill-in-blank":
          const userAnswer = (answer.answer as string).trim();
          const correctAnswer = question.correctAnswer.trim();
          isCorrect = question.caseSensitive
            ? userAnswer === correctAnswer
            : userAnswer.toLowerCase() === correctAnswer.toLowerCase();
          break;
      }

      if (isCorrect) {
        correctCount++;
        earnedPoints += points;
      }
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return { score, correctCount };
  };

  const handleAutoSubmit = () => {
    if (!shuffledQuiz) return;
    const { score, correctCount } = calculateScore();
    const passed = score >= (shuffledQuiz.passingScore || 70);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    submit.mutate(
      { 
        courseId, 
        quizId, 
        userId, 
        score, 
        passed,
        answers,
        timeTaken 
      },
      { onSuccess: () => setFinished(true) }
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionIndex === currentIndex);
  };

  const setCurrentAnswer = (answer: any) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionIndex !== currentIndex);
      return [...filtered, { questionIndex: currentIndex, answer }];
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !shuffledQuiz) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Quiz not found</p>
      </div>
    );
  }

  const previousAttempts = progress || [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1];
  const attemptsUsed = previousAttempts.length;
  const maxAttempts = shuffledQuiz.maxAttempts || 0;
  const canRetake = maxAttempts === 0 || attemptsUsed < maxAttempts;

  // Show previous attempt result
  if (lastAttempt && !retry) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            lastAttempt.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {lastAttempt.passed ? (
              <Trophy className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-gray-600 mb-6">Attempt {attemptsUsed}</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold mb-2" style={{ color: lastAttempt.passed ? '#10b981' : '#ef4444' }}>
              {lastAttempt.score}%
            </div>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Passing Score</p>
              <p className="text-xl font-semibold">{shuffledQuiz.passingScore}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Attempts Used</p>
              <p className="text-xl font-semibold">
                {attemptsUsed}{maxAttempts > 0 ? ` / ${maxAttempts}` : ''}
              </p>
            </div>
          </div>

          <p className={`text-xl font-bold mb-6 ${lastAttempt.passed ? 'text-green-600' : 'text-red-600'}`}>
            {lastAttempt.passed ? '🎉 Congratulations! You passed!' : '❌ You did not pass. Keep trying!'}
          </p>

          <div className="flex gap-4 justify-center">
            {canRetake && (
              <button
                onClick={() => setRetry(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Retry Quiz
              </button>
            )}
            <button
              onClick={onFinish}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              {lastAttempt.passed ? 'Continue' : 'Back to Course'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = shuffledQuiz.questions.length;
  const question = shuffledQuiz.questions[currentIndex];
  const currentAnswer = getCurrentAnswer();
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // Quiz completion screen
  if (finished) {
    const { score, correctCount } = calculateScore();
    const passed = score >= (shuffledQuiz.passingScore || 70);
    
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 mt-6">
            <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#10b981' : '#ef4444' }}>
              {score}%
            </div>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Correct Answers</p>
              <p className="text-xl font-semibold">{correctCount} / {totalQuestions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Passing Score</p>
              <p className="text-xl font-semibold">{shuffledQuiz.passingScore}%</p>
            </div>
          </div>

          <p className={`text-xl font-bold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? '🎉 Congratulations! You passed!' : `Keep practicing! You need ${shuffledQuiz.passingScore}% to pass.`}
          </p>

          {shuffledQuiz.showCorrectAnswers && (
            <button
              onClick={() => setShowReview(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium mb-4"
            >
              Review Answers
            </button>
          )}

          <button
            onClick={onFinish}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium ml-4"
          >
            Continue to Next Lesson
          </button>
        </div>
      </div>
    );
  }

  // Review mode
  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Review Your Answers</h2>
          
          {shuffledQuiz.questions.map((q: any, index: number) => {
            const answer = answers.find(a => a.questionIndex === index);
            let isCorrect = false;
            let userAnswer = "";
            let correctAnswer = "";

            // Calculate correctness
            switch (q.questionType) {
              case "multiple-choice":
              case "true-false":
                isCorrect = answer && q.options[answer.answer]?.isCorrect;
                userAnswer = answer ? q.options[answer.answer]?.text : "Not answered";
                correctAnswer = q.options.find((opt: any) => opt.isCorrect)?.text;
                break;
              case "multiple-select":
                const selectedOptions = (answer?.answer as number[]) || [];
                const correctOptions = q.options
                  .map((opt: any, i: number) => opt.isCorrect ? i : -1)
                  .filter((i: number) => i !== -1);
                isCorrect = 
                  selectedOptions.length === correctOptions.length &&
                  selectedOptions.every((i: number) => correctOptions.includes(i));
                userAnswer = selectedOptions.map((i: number) => q.options[i]?.text).join(", ") || "Not answered";
                correctAnswer = correctOptions.map((i: number) => q.options[i]?.text).join(", ");
                break;
              case "fill-in-blank":
                const userAns = answer?.answer || "";
                isCorrect = q.caseSensitive
                  ? userAns === q.correctAnswer
                  : userAns.toLowerCase() === q.correctAnswer.toLowerCase();
                userAnswer = userAns || "Not answered";
                correctAnswer = q.correctAnswer;
                break;
            }

            return (
              <div key={index} className={`border-l-4 p-4 mb-4 rounded-lg ${
                isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Q{index + 1}. {q.questionText}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Your answer:</span> {userAnswer}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-700">
                          <span className="font-medium">Correct answer:</span> {correctAnswer}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-gray-700 italic mt-2">
                          <span className="font-medium">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={onFinish}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium w-full"
          >
            Continue to Next Lesson
          </button>
        </div>
      </div>
    );
  }

  // Main quiz interface
  const handleCheck = () => {
    if (!currentAnswer) return;
    setChecked(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(i => i + 1);
      setChecked(false);
    } else {
      handleAutoSubmit();
    }
  };

  const renderQuestion = () => {
    switch (question.questionType) {
      case "multiple-choice":
      case "true-false":
        return (
          <div className="space-y-3">
            {question.options.map((opt: any, optIndex: number) => {
              const isSelected = currentAnswer?.answer === optIndex;
              const isCorrect = opt.isCorrect;
              
              let bgColor = "bg-white hover:bg-gray-50";
              if (checked) {
                if (isCorrect) {
                  bgColor = "bg-green-100 border-green-500";
                } else if (isSelected && !isCorrect) {
                  bgColor = "bg-red-100 border-red-500";
                }
              } else if (isSelected) {
                bgColor = "bg-indigo-50 border-indigo-500";
              }

              return (
                <label
                  key={optIndex}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${bgColor}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    checked={isSelected}
                    onChange={() => setCurrentAnswer(optIndex)}
                    disabled={checked}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="flex-1">{opt.text}</span>
                  {checked && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {checked && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </label>
              );
            })}
          </div>
        );

      case "multiple-select":
        const selectedOptions = (currentAnswer?.answer as number[]) || [];
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
            {question.options.map((opt: any, optIndex: number) => {
              const isSelected = selectedOptions.includes(optIndex);
              const isCorrect = opt.isCorrect;
              
              let bgColor = "bg-white hover:bg-gray-50";
              if (checked) {
                if (isCorrect && isSelected) {
                  bgColor = "bg-green-100 border-green-500";
                } else if (!isCorrect && isSelected) {
                  bgColor = "bg-red-100 border-red-500";
                } else if (isCorrect && !isSelected) {
                  bgColor = "bg-yellow-50 border-yellow-500";
                }
              } else if (isSelected) {
                bgColor = "bg-indigo-50 border-indigo-500";
              }

              return (
                <label
                  key={optIndex}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${bgColor}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newSelected = e.target.checked
                        ? [...selectedOptions, optIndex]
                        : selectedOptions.filter(i => i !== optIndex);
                      setCurrentAnswer(newSelected);
                    }}
                    disabled={checked}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="flex-1">{opt.text}</span>
                  {checked && isCorrect && isSelected && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {checked && !isCorrect && isSelected && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </label>
              );
            })}
          </div>
        );

      case "fill-in-blank":
        const userAnswer = currentAnswer?.answer || "";
        const isCorrect = question.caseSensitive
          ? userAnswer === question.correctAnswer
          : userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
        
        return (
          <div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={checked}
              placeholder="Type your answer here..."
              className={`w-full p-4 border-2 rounded-lg text-lg ${
                checked
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {question.caseSensitive && (
              <p className="text-sm text-gray-500 mt-2">⚠️ Answer is case-sensitive</p>
            )}
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{shuffledQuiz.title}</h2>
              {shuffledQuiz.description && (
                <p className="text-indigo-100 mt-1">{shuffledQuiz.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Brain className="w-5 h-5" />
                <span className="font-medium capitalize">{shuffledQuiz.difficulty}</span>
              </div>
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeRemaining < 60 ? 'bg-red-500' : 'bg-white/20'
                }`}>
                  <Timer className="w-5 h-5" />
                  <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="bg-indigo-100 text-indigo-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {currentIndex + 1}
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-1">{question.questionText}</p>
              <p className="text-sm text-gray-500">
                {question.points > 1 ? `Worth ${question.points} points` : '1 point'}
              </p>
            </div>
          </div>

          {renderQuestion()}

          {checked && question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-medium text-blue-900 mb-1">💡 Explanation</p>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={!currentAnswer || (Array.isArray(currentAnswer.answer) && currentAnswer.answer.length === 0)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                {currentIndex + 1 === totalQuestions ? 'Finish Quiz' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
