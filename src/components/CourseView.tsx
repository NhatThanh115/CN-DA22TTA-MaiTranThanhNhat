import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  getCourseById,
  getCourseLessons,
  topics
} from "../data/courses";
import { getUserProgress, updateAllTopicProgress } from "../utils/progressTracker";
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Trophy,
  Target,
  GraduationCap
} from "lucide-react";
import React from "react";

interface CourseViewProps {
  courseId: string;
  onNavigate: (view: string) => void;
  onBack: () => void;
}

export function CourseView({ courseId, onNavigate, onBack }: CourseViewProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(getUserProgress());
  const course = getCourseById(courseId);

  useEffect(() => {
    updateAllTopicProgress(topics);
    setProgress(getUserProgress());
  }, []);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Get all lessons for this course
  const courseLessons = getCourseLessons(courseId);
  const completedLessons = courseLessons.filter(lesson => progress.completedLessons.includes(lesson.id));
  const courseProgress = courseLessons.length > 0 
    ? Math.round((completedLessons.length / courseLessons.length) * 100)
    : 0;

  // Get topics for this course (already in hierarchical structure)
  const courseTopics = course.topics;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      {/* Course Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <Badge className={`${course.bgColor} text-white border-0 mb-3`}>
              {course.level}
            </Badge>
            <h1 className="mb-2">{t(course.titleKey)}</h1>
            <p className="text-muted-foreground mb-4">
              {t(course.descriptionKey)}
            </p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border-2 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#225d9c]" />
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
            <p className="text-2xl">{courseProgress}%</p>
          </div>

          <div className="bg-white border-2 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-[#225d9c]" />
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
            <p className="text-2xl">{courseTopics.length}</p>
          </div>

          <div className="bg-white border-2 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl">{completedLessons.length}/{courseLessons.length}</p>
          </div>

          <div className="bg-white border-2 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-[#225d9c]" />
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <p className="text-2xl">~{course.estimatedHours}h</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Course Progress</span>
            <span>{courseProgress}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`${course.bgColor} h-full rounded-full transition-all duration-300`}
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="mb-1">Course Topics</h2>
            <p className="text-sm text-muted-foreground">
              Choose a topic to start learning
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseTopics.map((topic) => {
            if (!topic) return null;
            
            const topicLessons = topic.lessons;
            const topicCompleted = topicLessons.filter(lesson => progress.completedLessons.includes(lesson.id));
            const topicProgress = topicLessons.length > 0 
              ? Math.round((topicCompleted.length / topicLessons.length) * 100)
              : 0;
            const isCompleted = topicProgress === 100;
            const isStarted = topicProgress > 0;

            // Find next lesson to start or continue
            const nextLesson = topicLessons.find(lesson => !progress.completedLessons.includes(lesson.id)) || topicLessons[0];

            return (
              <Card 
                key={topic.id}
                className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer bg-white"
                onClick={() => onNavigate(nextLesson.id)}
              >
                {/* Topic Icon & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{topic.icon}</div>
                  {isCompleted && (
                    <Badge className="bg-green-500 text-white border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {isStarted && !isCompleted && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      In Progress
                    </Badge>
                  )}
                </div>

                {/* Topic Info */}
                <h3 className="mb-2">{topic.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {topic.description}
                </p>

                {/* Topic Stats */}
                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{topicLessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`${course.bgColor} text-white border-0 text-xs px-2 py-0.5`}>
                      {course.level}
                    </Badge>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{topicProgress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${course.bgColor} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${topicProgress}%` }}
                    />
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-[#225d9c] hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(nextLesson.id);
                    }}
                  >
                    {isCompleted ? 'Review' : isStarted ? 'Continue' : 'Start'} →
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievement Section */}
      {courseProgress === 100 && (
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 p-6 md:p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-2">🎉 Congratulations!</h2>
            <p className="text-muted-foreground mb-4">
              You've completed the {t(course.titleKey)} course! Keep up the great work.
            </p>
            <Button 
              onClick={onBack}
              className="bg-[#225d9c] hover:bg-[#1a4a7a] text-white"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              View All Courses
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}