"use client";

import { useEffect, useState, Suspense } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db, auth } from "../../firebase";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Navbar from "../../Components/Navbar";

function QuizContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const moduleName =
    searchParams.get("module");

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(15);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [showFeedback, setShowFeedback] =
    useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      if (!moduleName) return;

      const q = query(
        collection(db, "questions"),
        where("module", "==", moduleName)
      );

      const querySnapshot =
        await getDocs(q);

      let fetchedQuestions =
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

            fetchedQuestions =
        fetchedQuestions.sort(
          () => Math.random() - 0.5
        );

      const selectedQuestions =
        fetchedQuestions.slice(0, 10);

      setQuestions(selectedQuestions);
    }

    fetchQuestions();
  }, [moduleName]);

  useEffect(() => {
    if (finished || showFeedback) return;

    if (timeLeft === 0) {
      nextQuestion();

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished, showFeedback]);

  async function handleAnswer(
    selectedOption: string
  ) {
    if (showFeedback) return;

    setSelectedAnswer(selectedOption);

    setShowFeedback(true);

    const question =
      questions[currentQuestion];

    if (
      selectedOption === question.answer
    ) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  }

  async function nextQuestion() {
    setSelectedAnswer(null);

    setShowFeedback(false);

    setTimeLeft(15);

    if (
      currentQuestion + 1 <
      questions.length
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );
    } else {
      setFinished(true);

      const user = auth.currentUser;

      if (user) {
        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const today =
          new Date().toDateString();

        await updateDoc(userRef, {
          xp: increment(score * 10),

          streak: increment(1),

          lastQuizDate: today,
        });
      }
    }
  }

  function restartQuiz() {
    setCurrentQuestion(0);

    setScore(0);

    setFinished(false);

    setTimeLeft(15);
  }

  if (!moduleName) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No module selected.</p>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <h1 className="text-4xl font-bold mb-4">
              No Questions Found
            </h1>

            <p className="text-zinc-400">
              Add more questions for{" "}
              {moduleName}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center w-[520px] shadow-2xl">
            <div className="text-7xl mb-6">
              🏆
            </div>

            <h1 className="text-5xl font-bold mb-6">
              Quiz Complete
            </h1>

            <p className="text-3xl mb-4">
              Score: {score} /{" "}
              {questions.length}
            </p>

            <p className="text-green-400 text-2xl mb-10">
              +{score * 10} XP Earned
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-2xl text-lg font-semibold"
              >
                Play Again
              </button>

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-2xl text-lg font-semibold"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <p className="text-zinc-400">
              Progress
            </p>

            <p className="text-zinc-400">
              {currentQuestion + 1} /{" "}
              {questions.length}
            </p>
          </div>

          <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-zinc-400 mb-2">
                {moduleName}
              </p>

              <h2 className="text-2xl font-semibold text-indigo-400">
                {question.topic}
              </h2>
            </div>

            <div className="bg-black/40 rounded-2xl px-6 py-4 text-center">
              <p className="text-zinc-400 text-sm mb-1">
                TIME
              </p>

              <h2 className="text-4xl font-bold text-red-400">
                {timeLeft}
              </h2>
            </div>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-12">
            {question.question}
          </h1>

          <div className="space-y-5">
            {question.options.map(
              (
                option: string,
                index: number
              ) => {
                let buttonStyle =
                  "bg-zinc-800 hover:bg-zinc-700";

                if (showFeedback) {
                  if (
                    option ===
                    question.answer
                  ) {
                    buttonStyle =
                      "bg-green-600";
                  } else if (
                    option ===
                    selectedAnswer
                  ) {
                    buttonStyle =
                      "bg-red-600";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswer(option)
                    }
                    disabled={showFeedback}
                    className={`w-full transition-all duration-300 ${buttonStyle} p-6 rounded-2xl text-left text-xl font-medium hover:scale-[1.01]`}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <div>
              <p className="text-zinc-400">
                Current Score
              </p>

              <h2 className="text-3xl font-bold">
                {score}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-zinc-400">
                Potential XP
              </p>

              <h2 className="text-3xl font-bold text-green-400">
                {score * 10}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}