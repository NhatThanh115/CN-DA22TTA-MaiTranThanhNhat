import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { lessons, topics, courses, getCourseLessons } from "../data/courses";
import { getUserProgress, updateAllTopicProgress, getCompletionPercentage } from "../utils/progressTracker";
import { 
  TrendingUp, 
  CheckCircle2, 
  Trophy, 
  Award,
  Clock,
  BookOpen
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import React from "react";

interface DashboardHomeProps {
  user: { username: string; email?: string } | null;
  onNavigate: (view: string) => void;
}



export function DashboardHome({ user, onNavigate }: DashboardHomeProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(getUserProgress());
  
  useEffect(() => {
    updateAllTopicProgress(topics);
    setProgress(getUserProgress());
  }, []);

  // Get total lessons count
  const totalLessons = Object.keys(lessons).length;
  const completionPercentage = getCompletionPercentage(totalLessons);
  
  // Mock points and badges (you can replace with real data later)
  const points = progress.completedLessons.length * 125; // 125 points per lesson
  const badges = Math.floor(progress.completedLessons.length / 3); // 1 badge per 3 lessons

  // Determine current level based on progress
  const getCurrentLevel = (): 'A1' | 'A2' | 'B1' | 'B2' => {
    if (completionPercentage < 25) return 'A1';
    if (completionPercentage < 50) return 'A2';
    if (completionPercentage < 75) return 'B1';
    return 'B2';
  };

  const currentLevel = getCurrentLevel();

  // Calculate progress for each course
  const coursesWithProgress = courses.map(course => {
    const courseLessons = getCourseLessons(course.id);
    const lessonIds = courseLessons.map(l => l.id);
    const completed = lessonIds.filter(id => progress.completedLessons.includes(id)).length;
    return {
      ...course,
      totalLessons: courseLessons.length,
      completed,
      progress: courseLessons.length > 0 ? Math.round((completed / courseLessons.length) * 100) : 0
    };
  });

  // Find current course (course with progress but not completed)
  const currentCourse = coursesWithProgress.find(course =>
    course.completed > 0 && course.completed < course.totalLessons
  ) || coursesWithProgress[0]; // Default to A1 if no progress

  const currentCourseProgress = currentCourse.progress;

  // Find next lesson to continue
  const getNextLesson = () => {
    const courseLessons = getCourseLessons(currentCourse.id);
    for (const lesson of courseLessons) {
      if (!progress.completedLessons.includes(lesson.id)) {
        return lesson.id;
      }
    }
    return courseLessons[0]?.id; // Default to first lesson
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">
          {t('dashboard.welcome')}, {user ? user.username : 'Guest'}! 👋
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.currentLevel')} {currentLevel} {t('dashboard.level')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-2 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{t('dashboard.stats.totalProgress')}</p>
            <div className="bg-blue-50 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#225d9c]" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-3xl">{completionPercentage}%</p>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#225d9c] h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{t('dashboard.stats.completed')}</p>
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl">{progress.completedLessons.length}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('common.all')} {totalLessons} {t('dashboard.stats.totalLessons')}
            </p>
          </div>
        </Card>

        <Card className="p-5 border-2 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{t('dashboard.stats.pointsEarned')}</p>
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-[#e8c02e]" />
            </div>
          </div>
          <div>
            <p className="text-3xl">{points}</p>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.stats.keepItUp')}</p>
          </div>
        </Card>

        <Card className="p-5 border-2 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{t('dashboard.stats.badges')}</p>
            <div className="bg-teal-50 p-2 rounded-lg">
              <Award className="w-5 h-5 text-[#288f8a]" />
            </div>
          </div>
          <div>
            <p className="text-3xl">{badges}</p>
            <p className="text-xs text-muted-foreground mt-2">{t('dashboard.stats.achievements')}</p>
          </div>
        </Card>
      </div>

      {/* Continue Learning Card */}
      <Card className="bg-gradient-to-br from-[#5b86e5] via-[#7c6ee0] to-[#a55eea] text-white border-2 border-purple-600 overflow-hidden shadow-lg">
        <div className="p-6 md:p-8 relative">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-white/90 mb-1">{t('dashboard.continueLearning.title')}</p>
              <h2 className="text-white mb-2">{t(currentCourse.titleKey)}</h2>
              <div className="flex items-center gap-3 mb-0 md:mb-0">
                <div className="flex-1 max-w-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('dashboard.continueLearning.progress')}: {currentCourseProgress}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-300"
                      style={{ width: `${currentCourseProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate(getNextLesson())}
              className="bg-white text-[#5b86e5] hover:bg-white/95 shadow-md w-fit"
            >
              {t('dashboard.continue')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Your Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>{t('dashboard.courses')}</h2>
          <Button variant="ghost" className="text-[#225d9c]">
            {t('dashboard.viewAll')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {coursesWithProgress.map((course) => {
            const isStarted = course.completed > 0;
            const isRecommended = course.level === 'B1' && currentLevel === 'A2';

            return (
              <Card 
                key={course.id}
                className={`p-6 border-2 hover:shadow-lg transition-all bg-white ${
                  isRecommended ? 'border-blue-400 bg-blue-50/20' : 'border-gray-300'
                }`}
              >
                {isRecommended && (
                  <div className="mb-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                      {t('dashboard.recommended')}
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <Badge className={`${course.bgColor} text-white border-0 text-xs px-2.5 py-1`}>
                    {course.level}
                  </Badge>
                </div>

                <h3 className="mb-2">{t(course.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {t(course.descriptionKey)}
                </p>

                <div className="space-y-4 mb-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t('dashboard.progress')}</span>
                      <span className="text-sm">{course.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${course.bgColor} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>~{course.estimatedHours} {t('dashboard.hours')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.topics.length} {t('dashboard.topics')}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    // Navigate to course view to see topics
                    onNavigate(course.id);
                  }}
                  variant={isStarted ? "default" : "outline"}
                  className={`w-full ${
                    isStarted 
                      ? 'bg-[#1e293b] hover:bg-[#0f172a] text-white' 
                      : 'border-2 hover:bg-gray-50'
                  }`}
                >
                  {isStarted ? t('dashboard.continueCourse') : t('dashboard.start')}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}