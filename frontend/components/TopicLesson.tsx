import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { DifficultyLevel } from "../data/courses";
import { getTopicByLessonId, getCourseByLessonId, getPreviousLesson, getNextLesson } from "../data/courses";
import { isLessonCompleted, markLessonComplete } from "../utils/progressTracker";
import { CheckCircle2, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { LessonMedia } from "./LessonMedia";
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz";
import { CommentSection } from "./CommentSection";


interface Example {
  sentence: string;
  explanation: string;
}

interface MediaItem {
  type: 'image' | 'video';
  url?: string;
  placeholder: string;
  caption?: string;
}

interface TopicLessonProps {
  lessonId?: string;
  title: string;
  description: string;
  difficulty?: DifficultyLevel;
  keyPoints: string[];
  media?: MediaItem[];
  examples: Example[];
  practiceExercise?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onNavigate?: (lessonId: string) => void;
}

const getDifficultyInfo = (level: DifficultyLevel) => {
  const info = {
    'A1': { label: 'Beginner', color: 'bg-green-100 text-green-800 border-green-300', description: 'Basic' },
    'A2': { label: 'Elementary', color: 'bg-blue-100 text-blue-800 border-blue-300', description: 'Elementary' },
    'B1': { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', description: 'Intermediate' },
    'B2': { label: 'Upper Intermediate', color: 'bg-orange-100 text-orange-800 border-orange-300', description: 'Advanced' }
  };
  return info[level];
};

export function TopicLesson({ 
  lessonId,
  title, 
  description, 
  difficulty,
  keyPoints,
  media, 
  examples, 
  practiceExercise,
  onNavigate
}: TopicLessonProps) {
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  
  // Get previous and next lessons
  const previousLesson = lessonId ? getPreviousLesson(lessonId) : undefined;
  const nextLesson = lessonId ? getNextLesson(lessonId) : undefined;

  useEffect(() => {
    if (lessonId) {
      setCompleted(isLessonCompleted(lessonId));
    }

    // Track time spent when component unmounts
    return () => {
      if (lessonId) {
        const _timeSpent = Math.floor((Date.now() - startTime) / 60000); // minutes
        // Could call addTimeSpent(lessonId, timeSpent) here if needed
      }
    };
  }, [lessonId, startTime]);

  const handleMarkComplete = async () => {
    if (lessonId && !completed) {
      const topic = getTopicByLessonId(lessonId);
      const course = getCourseByLessonId(lessonId); // Need course ID
      
      if (topic && course) {
        // Extract lesson IDs from the topic's lessons array
        const lessonIds = topic.lessons.map(lesson => lesson.id);
        
        // Calculate time spent so far
        const timeSpent = Math.floor((Date.now() - startTime) / 60000);

        try {
            await markLessonComplete(lessonId, topic.id, lessonIds, course.id, timeSpent);
            setCompleted(true);
            toast.success("Lesson completed! Great job! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save progress");
        }
      }
    }
  };

  const handlePrevious = () => {
    if (previousLesson && onNavigate) {
      onNavigate(previousLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (nextLesson && onNavigate) {
      onNavigate(nextLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const difficultyInfo = difficulty ? getDifficultyInfo(difficulty) : null;

  return (
    <div className="space-y-6">
      {/* Title and Description */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="mb-0">{title}</h1>
              {difficultyInfo && (
                <Badge className={`${difficultyInfo.color} border flex items-center gap-1.5 px-3 py-1`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{difficulty} - {difficultyInfo.label}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="border-l-4 border-primary bg-[#f6f8fa] p-4 mb-6">
          <p>{description}</p>
        </div>
      </div>

      {/* Media Section */}
      {media && media.length > 0 && (
        <LessonMedia media={media} />
      )}

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <Card className="p-6 border-2">
          <h2 className="mb-4">Key Points</h2>
          <ul className="space-y-3">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Examples */}
      <div>
        <h2 className="mb-4">Examples</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <Card key={index} className="p-5">
              <div className="bg-[#f6f8fa] p-4 rounded-lg border mb-3">
                <p className="font-mono">{example.sentence}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <p className="text-muted-foreground text-sm">{example.explanation}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Practice Exercise */}
      {practiceExercise && (
        <MultipleChoiceQuiz
          lessonId={lessonId}
          question={practiceExercise.question}
          options={practiceExercise.options}
          correctAnswer={practiceExercise.correctAnswer}
          explanation={practiceExercise.explanation}
        />
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-6 border-t gap-4">
        <Button
          onClick={handlePrevious}
          disabled={!previousLesson}
          variant="outline"
          className="border-2 border-[#288f8a] text-[#288f8a] hover:bg-[#288f8a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {lessonId && (
            <Button
              onClick={handleMarkComplete}
              disabled={completed}
              variant={completed ? "outline" : "default"}
              className={completed ? "border-2 border-green-500 text-green-700 hover:bg-green-50" : "bg-[#288f8a] hover:bg-[#236f6b] text-white transition-colors"}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {completed ? "Completed" : "Mark as Complete"}
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!nextLesson}
            className="bg-[#288f8a] hover:bg-[#236f6b] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection lessonId={lessonId} />
    </div>
  );
}