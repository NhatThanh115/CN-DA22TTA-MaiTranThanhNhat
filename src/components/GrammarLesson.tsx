import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface Exercise {
  sentence: string;
  blank: string;
  options: string[];
  correctAnswer: string;
}

const exercises: Exercise[] = [
  {
    sentence: "She ___ to the store yesterday.",
    blank: "went",
    options: ["go", "went", "goes", "going"],
    correctAnswer: "went",
  },
  {
    sentence: "They ___ studying for three hours.",
    blank: "have been",
    options: ["has been", "have been", "had been", "was"],
    correctAnswer: "have been",
  },
  {
    sentence: "If I ___ rich, I would travel the world.",
    blank: "were",
    options: ["am", "was", "were", "be"],
    correctAnswer: "were",
  },
];

export function GrammarLesson() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [checked, setChecked] = useState(false);

  const handleAnswer = (index: number, answer: string) => {
    setAnswers({ ...answers, [index]: answer });
  };

  const handleCheck = () => {
    setChecked(true);
  };

  const handleReset = () => {
    setAnswers({});
    setChecked(false);
  };

  const score = Object.entries(answers).filter(
    ([index, answer]) => answer === exercises[parseInt(index)].correctAnswer
  ).length;

  return (
    <Card>
      <CardHeader>
        <h2>Grammar Practice</h2>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lesson" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="lesson" className="space-y-4 mt-6">
            <div>
              <h3 className="mb-3">Present Perfect Continuous</h3>
              <p className="text-muted-foreground mb-4">
                The present perfect continuous is used to describe an action that started in the past and continues to the present, or has recently stopped.
              </p>
              
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h4 className="mb-2">Structure:</h4>
                <p className="font-mono">Subject + have/has + been + verb(-ing)</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="mb-2">Examples:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>I <span className="text-primary">have been studying</span> English for two years.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>She <span className="text-primary">has been working</span> here since 2020.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>They <span className="text-primary">have been living</span> in London for five months.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-4 mt-6">
            <div className="mb-4">
              <p className="text-muted-foreground">Fill in the blanks with the correct form:</p>
            </div>

            {exercises.map((exercise, index) => {
              const isIncorrect = checked && answers[index] && answers[index] !== exercise.correctAnswer;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-1">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="mb-3">{exercise.sentence}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {exercise.options.map((option) => {
                          const isSelected = answers[index] === option;
                          const shouldHighlightCorrect = checked && option === exercise.correctAnswer;
                          
                          return (
                            <button
                              key={option}
                              onClick={() => !checked && handleAnswer(index, option)}
                              disabled={checked}
                              className={`p-2 rounded border-2 transition-all ${
                                shouldHighlightCorrect
                                  ? "border-green-500 bg-green-50"
                                  : isSelected && isIncorrect
                                  ? "border-red-500 bg-red-50"
                                  : isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              } ${checked ? "cursor-default" : "cursor-pointer"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {shouldHighlightCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-4">
              {!checked ? (
                <Button
                  onClick={handleCheck}
                  disabled={Object.keys(answers).length !== exercises.length}
                  className="bg-primary"
                >
                  Check Answers
                </Button>
              ) : (
                <>
                  <Badge variant="outline" className="py-2 px-4">
                    Score: {score}/{exercises.length}
                  </Badge>
                  <Button onClick={handleReset} variant="outline">
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
