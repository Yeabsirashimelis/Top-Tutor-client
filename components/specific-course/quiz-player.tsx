"use client";
import { useState, useEffect } from "react";
import { useGetQuiz, useSubmitQuizAttempt } from "@/hooks/quiz-hooks";

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
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [retry, setRetry] = useState(false);

  if (isLoading) return <div>Loading quiz…</div>;
  if (!quiz) return <div>Quiz not found</div>;

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
          onClick={() => setRetry(true)}
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
    if (question.options[selected].isCorrect) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      // Submit final score
      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= 70;
      submit.mutate(
        { courseId, quizId, userId, score, passed },
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
