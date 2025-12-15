import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { addQuizScore } from "../utils/progressTracker";
import React from "react";

interface MultipleChoiceQuizProps {
  lessonId?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function MultipleChoiceQuiz({ 
  lessonId,
  question, 
  options, 
  correctAnswer, 
  explanation 
}: MultipleChoiceQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Reset quiz state when lesson or question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [lessonId, question]);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      
      // Track quiz score
      if (lessonId) {
        const score = selectedAnswer === correctAnswer ? 100 : 0;
        addQuizScore(lessonId, score);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className="mt-6 border-2">
      <div className="bg-[#d4edda] border-b border-[#c3e6cb] px-4 py-3">
        <h3 className="text-[#155724]">Practice Exercise</h3>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h4 className="mb-4">{question}</h4>
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === correctAnswer;
            const showCorrect = showResult && isCorrectOption;
            const showIncorrect = showResult && isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showCorrect
                    ? "border-green-500 bg-green-50"
                    : showIncorrect
                    ? "border-red-500 bg-red-50"
                    : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm mt-0.5"
                      style={{
                        borderColor: showCorrect ? '#22c55e' : showIncorrect ? '#ef4444' : isSelected ? '#225d9c' : '#d1d5db',
                        backgroundColor: showCorrect ? '#22c55e' : showIncorrect ? '#ef4444' : isSelected ? '#225d9c' : 'transparent',
                        color: isSelected || showCorrect || showIncorrect ? 'white' : '#6b7280'
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                  <div className="flex-shrink-0">
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="bg-[#288f8a] hover:bg-[#236f6b] text-white w-full sm:w-auto"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              isCorrect 
                ? "bg-green-50 border-green-500" 
                : "bg-red-50 border-red-500"
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-green-900 mb-1">Correct!</h4>
                      <p className="text-green-800 text-sm">Well done! You got the right answer.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-900 mb-1">Incorrect</h4>
                      <p className="text-red-800 text-sm">
                        The correct answer is: <strong>{String.fromCharCode(65 + correctAnswer)}</strong>
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="pl-8">
                <p className="text-sm"><strong>Explanation:</strong> {explanation}</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}