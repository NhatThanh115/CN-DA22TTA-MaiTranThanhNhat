import { useState, useEffect } from "react";
import { topics, courses } from "../data/courses";
import { TopicProgressBar } from "./TopicProgressBar";
import { getUserProgress, updateAllTopicProgress, isLessonCompleted } from "../utils/progressTracker";
import { Badge } from "./ui/badge";
import { useTranslation } from 'react-i18next';
import { 
  MessageCircle, 
  Heart, 
  Plane, 
  Briefcase, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import React from "react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedCourse?: string; // Course ID to show topics for
}

export function Sidebar({ currentView, onNavigate, selectedCourse }: SidebarProps) {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([selectedCourse || 'course-a1']);
  const [, setRefresh] = useState(0);
  const progress = getUserProgress();

  // Initialize topic progress on mount
  useEffect(() => {
    updateAllTopicProgress(topics);
  }, []);

  // Re-render sidebar when progress changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRefresh(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('progressUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('progressUpdated', handleStorageChange);
    };
  }, []);

  // Expand the selected course if provided
  useEffect(() => {
    if (selectedCourse && !expandedCourses.includes(selectedCourse)) {
      setExpandedCourses([selectedCourse]);
    }
  }, [selectedCourse]);

  // Topic icon mapping
  const topicIcons: Record<string, { icon: React.ReactNode; emoji: string; color: string }> = {
    greetings: { icon: <MessageCircle className="w-4 h-4" />, emoji: "👋", color: "text-blue-600" },
    "daily-life": { icon: <Heart className="w-4 h-4" />, emoji: "🏡", color: "text-pink-600" },
    "shopping-food": { icon: <Heart className="w-4 h-4" />, emoji: "🛍️", color: "text-orange-600" },
    "travel": { icon: <Plane className="w-4 h-4" />, emoji: "✈️", color: "text-teal-600" },
    "weather": { icon: <Heart className="w-4 h-4" />, emoji: "🌤️", color: "text-yellow-600" },
    "work": { icon: <Briefcase className="w-4 h-4" />, emoji: "💼", color: "text-purple-600" },
    "culture": { icon: <Heart className="w-4 h-4" />, emoji: "🏛️", color: "text-indigo-600" },
  };

  const toggleSection = (id: string) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter(s => s !== id));
    } else {
      setExpandedSections([...expandedSections, id]);
    }
  };

  const toggleCourse = (courseId: string) => {
    if (expandedCourses.includes(courseId)) {
      setExpandedCourses(expandedCourses.filter(c => c !== courseId));
    } else {
      setExpandedCourses([courseId]);
    }
  };

  // Get course icon/emoji based on level
  const getCourseEmoji = (level: string) => {
    switch(level) {
      case 'A1': return '🌱';
      case 'A2': return '🌿';
      case 'B1': return '🌳';
      case 'B2': return '🌲';
      default: return '📚';
    }
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 overflow-y-auto border-r pt-16 shadow-sm">
      <div className="p-4 space-y-6">
        {/* Courses */}
        <div>
          <div className="px-2 mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{t('sidebar.courses')}</span>
            <Badge variant="outline" className="text-xs">
              {courses.length}
            </Badge>
          </div>
          <nav className="space-y-1">
            {courses.map((course) => {
              const courseTopics = course.topics; // Already Topic objects in hierarchical structure
              const totalLessons = courseTopics.reduce((acc, t) => acc + t.lessons.length, 0);
              const completedLessons = courseTopics.reduce((acc, t) => {
                return acc + t.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
              }, 0);
              const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
              const isExpanded = expandedCourses.includes(course.id);
              
              return (
                <div key={course.id}>
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-all group ${
                      isExpanded ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">{getCourseEmoji(course.level)}</span>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{t(course.titleKey)}</span>
                          {isCompleted && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {courseTopics.length} {courseTopics.length === 1 ? t('sidebar.topic') : t('sidebar.topics_plural')}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-3 mt-2 mb-2 space-y-1 border-l-2 border-gray-200 pl-3">
                      {/* Topics for this course */}
                      {courseTopics.map((topic) => {
                        const topicProgress = progress.topicProgress?.[topic.id];
                        const isTopicCompleted = topicProgress?.percentage === 100;
                        const iconData = topicIcons[topic.id] || { icon: <BookOpen className="w-4 h-4" />, emoji: "📚", color: "text-gray-600" };
                        const isTopicExpanded = expandedSections.includes(topic.id);
                        
                        return (
                          <div key={topic.id}>
                            <button
                              onClick={() => toggleSection(topic.id)}
                              className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100 transition-all group ${
                                isTopicExpanded ? "bg-gray-50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-base">{iconData.emoji}</span>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{topic.name}</span>
                                    {isTopicCompleted && (
                                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    )}
                                  </div>
                                  {topicProgress && (
                                    <div className="text-xs text-muted-foreground">
                                      {topicProgress.completed}/{topicProgress.total} complete
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                                isTopicExpanded ? "rotate-90" : ""
                              }`} />
                            </button>
                            
                            {isTopicExpanded && (
                              <div className="ml-2 mt-1 mb-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                                {/* Progress bar for topic */}
                                {topic && (
                                  <div className="px-2 py-1.5 mb-0.5">
                                    <TopicProgressBar
                                      topicId={topic.id}
                                      topicName=""
                                      totalLessons={topic.lessons.length}
                                      compact
                                    />
                                  </div>
                                )}
                                {/* Lessons for this topic */}
                                {topic.lessons.map((lesson) => {
                                  const completed = isLessonCompleted(lesson.id);
                                  const lessonLabel = lesson.id
                                    .split('-')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                                  
                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => onNavigate(lesson.id)}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-all flex items-center justify-between group ${
                                        currentView === lesson.id
                                          ? "bg-[#288f8a] text-white shadow-sm"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="flex-1 text-xs">{lessonLabel}</span>
                                      </div>
                                      {completed && (
                                        <CheckCircle2 className={`w-3 h-3 ml-1 ${
                                          currentView === lesson.id ? "text-white" : "text-green-600"
                                        }`} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}