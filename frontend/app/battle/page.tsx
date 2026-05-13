"use client";

import { useEffect, useState } from "react";

import Navbar from "../../Components/Navbar";
import PlayerCard from "../../Components/PlayerCard";
import ProgressBar from "../../Components/ProgressBar";
import QuestionCard from "../../Components/QuestionCard";

const questions = [
  {
    number: 1,
    text: "Which data structure follows FIFO order?",

    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph",
    ],

    correctAnswer: "Queue",
  },

  {
    number: 2,
    text: "Which keyword is used to inherit a class in Java?",

    options: [
      "this",
      "super",
      "extends",
      "implements",
    ],

    correctAnswer: "extends",
  },

  {
    number: 3,
    text: "Which sorting algorithm has average O(n log n) complexity?",

    options: [
      "Bubble Sort",
      "Insertion Sort",
      "Merge Sort",
      "Selection Sort",
    ],

    correctAnswer: "Merge Sort",
  },
];

const battleInfo = {
  roomCode: "X7K9P",

  player1: {
    name: "Player 1",
    score: 120,
    rank: "Gold II",
  },

  player2: {
    name: "Player 2",
    score: 105,
    rank: "Silver III",
  },
};

export default function BattlePage() {

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedOption, setSelectedOption] =
    useState<string | null>(null);

  const [answered, setAnswered] = useState(false);

  const [score, setScore] = useState(0);

  const [showResults, setShowResults] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15);

  const question = questions[currentQuestion];

  useEffect(() => {

    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  function handleNextQuestion() {

    if (selectedOption === question.correctAnswer) {
      setScore((prev) => prev + 10);
    }

    setSelectedOption(null);

    setAnswered(false);

    if (currentQuestion + 1 < questions.length) {

      setCurrentQuestion((prev) => prev + 1);

      setTimeLeft(15);

    } else {

      setShowResults(true);

    }
  }

  if (showResults) {

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

        <h1 className="mb-6 text-6xl font-extrabold">
          Battle Complete 🎉
        </h1>

        <p className="mb-8 text-3xl text-purple-300">
          Final Score: {score}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-2xl bg-purple-600 px-8 py-4 text-xl font-bold transition hover:bg-purple-500"
        >
          Play Again
        </button>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

      <Navbar />

      <section className="p-8">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">

          <div>

            <h1 className="mb-2 text-5xl font-extrabold">
              Battle Arena ⚔️
            </h1>

            <p className="text-lg text-gray-300">
              Compete in real-time quiz battles.
            </p>

          </div>

          <div className="rounded-2xl border border-purple-500 bg-purple-500/20 px-6 py-3 text-lg font-bold text-purple-300 backdrop-blur-md">

            Room Code: {battleInfo.roomCode}

          </div>

        </div>

        {/* Players */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">

          <PlayerCard
            name={battleInfo.player1.name}
            score={battleInfo.player1.score}
            rank={battleInfo.player1.rank}
            borderColor="border-green-500/30"
          />

          <PlayerCard
            name={battleInfo.player2.name}
            score={battleInfo.player2.score}
            rank={battleInfo.player2.rank}
            borderColor="border-red-500/30"
          />

        </div>

        {/* Question Section */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">

          {/* Top */}
          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-3xl font-bold">
              Question {question.number}
            </h2>

            <div className="rounded-xl bg-red-500 px-5 py-2 text-lg font-bold">
              ⏱ {timeLeft}s
            </div>

          </div>

          {/* Progress */}
          <ProgressBar
            current={currentQuestion + 1}
            total={questions.length}
          />

          {/* Question */}
          <QuestionCard
            question={question.text}
          />

          {/* Options */}
          <div className="grid gap-5">

            {question.options.map((option, index) => (

              <button
                key={index}
                onClick={() => {

                  if (!answered) {

                    setSelectedOption(option);

                    setAnswered(true);
                  }
                }}
                className={`rounded-2xl border p-5 text-left text-lg transition

                ${
                  answered
                    ? option === question.correctAnswer
                      ? "border-green-400 bg-green-500/30"
                      : selectedOption === option
                      ? "border-red-400 bg-red-500/30"
                      : "border-white/10 bg-black/30"
                    : selectedOption === option
                    ? "border-purple-400 bg-purple-500/30"
                    : "border-white/10 bg-black/30 hover:border-purple-400 hover:bg-purple-500/20"
                }
                `}
              >
                {option}
              </button>

            ))}

          </div>

          {/* Bottom */}
          <div className="mt-8 flex items-center justify-between">

            <div className="text-xl font-bold text-purple-300">
              Score: {score}
            </div>

            <button
              onClick={handleNextQuestion}
              className="rounded-2xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500"
            >
              Next Question →
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}