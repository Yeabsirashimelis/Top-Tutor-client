"use client";
import { useState, useEffect, useMemo } from "react";
import { useGetQuiz, useSubmitQuizAttempt } from "@/hooks/quiz-hooks";
import { Clock, AlertCircle, CheckCircle, XCircle, Trophy, Timer } from "lucide-react";

interface Answer {
  questionIndex: number;
  answer: any; // can be number, number[], or string
}

export default function QuizPlayer({
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
  const progress = data?.progress; // array of attempts

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [retry, setRetry] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStartTime] = useState(Date.now());
  const [showReview, setShowReview] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  // Randomize questions and options if enabled
  const shuffledQuiz = useMemo(() => {
    if (!quiz) return null;
    
    let questions = [...quiz.questions];
    
    // Randomize questions
    if (quiz.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    
    // Randomize options
    if (quiz.randomizeOptions) {
      questions = questions.map((q: any) => {
        if (q.questionType === "multiple-choice" || q.questionType === "multiple-select") {
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
          // Auto-submit when time runs out
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
    
    let correct = 0;
    const totalQuestions = shuffledQuiz.questions.length;
    
    answers.forEach((answer) => {
      const question = shuffledQuiz.questions[answer.questionIndex];
      if (!question) return;
      
      // Handle different question types
      if (question.questionType === "multiple-choice") {
        const selectedOption = question.options[answer.answer];
        if (selectedOption?.isCorrect) correct++;
      } else if (question.questionType === "multiple-select") {
        const correctIndexes = question.options
          .map((opt: any, idx: number) => (opt.isCorrect ? idx : -1))
          .filter((idx: number) => idx !== -1);
        const selectedIndexes = Array.isArray(answer.answer) ? answer.answer : [];
        const isCorrect = 
          correctIndexes.length === selectedIndexes.length &&
          correctIndexes.every((idx: number) => selectedIndexes.includes(idx));
        if (isCorrect) correct++;
      } else if (question.questionType === "true-false") {
        const selectedOption = question.options[answer.answer];
        if (selectedOption?.isCorrect) correct++;
      }
    });
    
    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return { score, correctCount: correct };
  };

  const handleAutoSubmit = () => {
    if (!shuffledQuiz) return;
    const { score, correctCount: correct } = calculateScore();
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

  if (isLoading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!quiz || !shuffledQuiz) return <div className="p-8 text-center text-gray-500">Quiz not found</div>;

  const previousAttempts = progress || [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1];

  // Show last attempt if exists and not retrying
  if (lastAttempt && !retry) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{quiz.title} - Previous Attempt</h2>
        <p className="text-lg mb-2">
          Score: <span className="font-semibold">{lastAttempt.score}%</span>
        </p>
        <p className={`text-xl font-bold mb-4 ${lastAttempt.passed ? "text-green-600" : "text-red-600"}`}>
          {lastAttempt.passed ? "You passed! 🎉" : "You failed. ❌"}
        </p>
        <button
          onClick={() => {
            setRetry(true);
            setCurrentIndex(0);
            setAnswers([]);
            setChecked(false);
            setFinished(false);
            setSelected(null);
            setCorrectCount(0);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Retry Quiz
        </button>
        <button
          onClick={onFinish}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
        >
          Continue
        </button>
      </div>
    );
  }

  // Normal quiz flow
  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentIndex];

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    
    // Save the answer
    const newAnswer: Answer = {
      questionIndex: currentIndex,
      answer: selected
    };
    setAnswers(prev => [...prev.filter(a => a.questionIndex !== currentIndex), newAnswer]);
    
    // Update correct count
    if (question.options[selected].isCorrect) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      // Submit final score
      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= (shuffledQuiz?.passingScore || 70);
      const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
      
      submit.mutate(
        { courseId, quizId, userId, score, passed, answers, timeTaken },
        { onSuccess: () => setFinished(true) }
      );
    }
  };

  if (finished) {
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-lg mb-2">
          You answered <span className="font-semibold">{correctCount}</span> out of{" "}
          <span className="font-semibold">{totalQuestions}</span> correctly.
        </p>
        <p className={`text-xl font-bold mb-4 ${passed ? "text-green-600" : "text-red-600"}`}>
          {passed ? `Great job! You passed with ${score}%` : `You scored ${score}% — keep practicing!`}
        </p>
        <button onClick={onFinish} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Continue
        </button>
      </div>
    );
  }

  // Display current question
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {quiz.title} ({currentIndex + 1}/{totalQuestions})
      </h2>
      <p className="font-medium mb-4">{question.questionText}</p>

      {question.options.map((o, oi) => {
        const isSelected = selected === oi;
        const color =
          checked && o.isCorrect
            ? "bg-green-100 border-green-600"
            : checked && isSelected && !o.isCorrect
            ? "bg-red-100 border-red-600"
            : "bg-white border-gray-300";

        return (
          <label key={oi} className={`block p-2 mb-2 border rounded cursor-pointer ${color}`}>
            <input
              type="radio"
              className="mr-2"
              name={`q-${currentIndex}`}
              onChange={() => setSelected(oi)}
              checked={isSelected}
              disabled={checked}
            />
            {o.text}
          </label>
        );
      })}

      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Check Answer
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p className={`text-lg font-semibold ${question.options[selected!].isCorrect ? "text-green-700" : "text-red-700"}`}>
            {question.options[selected!].isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          {!question.options[selected!].isCorrect && (
            <p className="text-gray-700">
              Correct answer:{" "}
              <span className="font-semibold">
                {question.options.find((opt) => opt.isCorrect)?.text}
              </span>
            </p>
          )}
          {question.explanation && <p className="text-gray-600 italic">{question.explanation}</p>}
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {currentIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
