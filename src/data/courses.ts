/**
 * Course data for TVEnglish
 * Top-level organization by CEFR levels (A1, A2, B1, B2)
 */

import i18n from '../i18n/config';
import { a1_topics, a2_topics, b1_topics, b2_topics, type Topic } from './topics';
import { type Lesson } from './lessons';

export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface Course {
  id: string;
  level: DifficultyLevel;
  title: string;
  description: string;
  topics: Topic[];
  estimatedHours: number;
  color: string;
  bgColor: string;
  titleKey: string; // Translation key
  descriptionKey: string; // Translation key
}

// Base course data with translation keys
const baseCourses: Course[] = [
  {
    id: "course-a1",
    level: "A1",
    title: "Beginner (A1)",
    description: "Start your English learning journey! Master basic greetings, simple sentences, and everyday vocabulary.",
    titleKey: "courses.a1.title",
    descriptionKey: "courses.a1.description",
    estimatedHours: 80,
    color: "#22c55e",
    bgColor: "bg-green-500",
    topics: a1_topics
  },
  {
    id: "course-a2",
    level: "A2",
    title: "Elementary (A2)",
    description: "Build on your basics! Learn past tenses, more complex sentences, and expand your vocabulary.",
    titleKey: "courses.a2.title",
    descriptionKey: "courses.a2.description",
    estimatedHours: 100,
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    topics: a2_topics
  },
  {
    id: "course-b1",
    level: "B1",
    title: "Intermediate (B1)",
    description: "Become an independent user! Master complex grammar, discuss abstract topics, and improve fluency.",
    titleKey: "courses.b1.title",
    descriptionKey: "courses.b1.description",
    estimatedHours: 120,
    color: "#f97316",
    bgColor: "bg-orange-500",
    topics: b1_topics
  },
  {
    id: "course-b2",
    level: "B2",
    title: "Upper-Intermediate (B2)",
    description: "Achieve advanced proficiency! Handle complex discussions, understand nuanced language, and express yourself fluently.",
    titleKey: "courses.b2.title",
    descriptionKey: "courses.b2.description",
    estimatedHours: 140,
    color: "#a855f7",
    bgColor: "bg-purple-500",
    topics: b2_topics
  }
];

// Function to get courses with translated text
export function getTranslatedCourses(): Course[] {
  return baseCourses.map(course => ({
    ...course,
    title: i18n.t(course.titleKey),
    description: i18n.t(course.descriptionKey)
  }));
}

// HIERARCHICAL COURSE DATA (with translations applied)
export const courses: Course[] = baseCourses;

// HELPER FUNCTIONS

// Get all lessons for a course
export function getCourseLessons(courseId: string): Lesson[] {
  const course = courses.find(c => c.id === courseId);
  if (!course) return [];
  
  const allLessons: Lesson[] = [];
  course.topics.forEach(topic => {
    allLessons.push(...topic.lessons);
  });
  
  return allLessons;
}

// Get topic by ID
export function getTopicById(topicId: string): Topic | undefined {
  for (const course of courses) {
    const topic = course.topics.find(t => t.id === topicId);
    if (topic) return topic;
  }
  return undefined;
}

// Get course by ID
export function getCourseById(courseId: string): Course | undefined {
  return courses.find(c => c.id === courseId);
}

// Get lesson by ID
export function getLessonById(lessonId: string): Lesson | undefined {
  for (const course of courses) {
    for (const topic of course.topics) {
      const lesson = topic.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}

// Get course by topic ID
export function getCourseByTopicId(topicId: string): Course | undefined {
  return courses.find(course => 
    course.topics.some(topic => topic.id === topicId)
  );
}

// Get topic by lesson ID
export function getTopicByLessonId(lessonId: string): Topic | undefined {
  for (const course of courses) {
    for (const topic of course.topics) {
      if (topic.lessons.some(lesson => lesson.id === lessonId)) {
        return topic;
      }
    }
  }
  return undefined;
}

// Get course by lesson ID
export function getCourseByLessonId(lessonId: string): Course | undefined {
  for (const course of courses) {
    for (const topic of course.topics) {
      if (topic.lessons.some(lesson => lesson.id === lessonId)) {
        return course;
      }
    }
  }
  return undefined;
}

// Get previous lesson in sequence
export function getPreviousLesson(currentLessonId: string): Lesson | undefined {
  const course = getCourseByLessonId(currentLessonId);
  if (!course) return undefined;

  // Get all lessons in the course in order
  const allLessons: Lesson[] = [];
  course.topics.forEach(topic => {
    allLessons.push(...topic.lessons);
  });

  // Find current lesson index
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  
  // Return previous lesson if it exists
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1];
  }
  
  return undefined;
}

// Get next lesson in sequence
export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const course = getCourseByLessonId(currentLessonId);
  if (!course) return undefined;

  // Get all lessons in the course in order
  const allLessons: Lesson[] = [];
  course.topics.forEach(topic => {
    allLessons.push(...topic.lessons);
  });

  // Find current lesson index
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
  
  // Return next lesson if it exists
  if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  
  return undefined;
}

// Legacy exports for backward compatibility
export const topics = courses.flatMap(course => course.topics);
export const lessons = courses.reduce((acc, course) => {
  course.topics.forEach(topic => {
    topic.lessons.forEach(lesson => {
      acc[lesson.id] = lesson;
    });
  });
  return acc;
}, {} as Record<string, Lesson>);