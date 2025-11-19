/**
 * Topic data for TVEnglish
 * Organizes lessons into themed topics
 */

import {
  a1_greetings_lessons,
  a1_numbers_lessons,
  a1_family_lessons,
  a2_daily_life_lessons,
  a2_shopping_food_lessons,
  a2_weather_lessons,
  b1_travel_lessons,
  b1_culture_lessons,
  b1_health_lessons,
  b2_work_lessons,
  b2_technology_lessons,
  b2_education_lessons,
  type Lesson
} from './lessons';

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

// A1 TOPICS - Beginner Level
export const a1_topics: Topic[] = [
  {
    id: "greetings",
    name: "Greetings & Introductions",
    description: "Learn how to greet people and introduce yourself in various situations",
    icon: "👋",
    lessons: a1_greetings_lessons
  },
  {
    id: "numbers",
    name: "Numbers & Counting",
    description: "Master numbers, counting, and basic mathematics in English",
    icon: "🔢",
    lessons: a1_numbers_lessons
  },
  {
    id: "family",
    name: "Family & Relationships",
    description: "Learn vocabulary for family members and how to describe relationships",
    icon: "👨‍👩‍👧‍👦",
    lessons: a1_family_lessons
  }
];

// A2 TOPICS - Elementary Level
export const a2_topics: Topic[] = [
  {
    id: "daily-life",
    name: "Daily Life & Routines",
    description: "Learn to describe your daily activities and routines",
    icon: "☀️",
    lessons: a2_daily_life_lessons
  },
  {
    id: "shopping-food",
    name: "Shopping & Food",
    description: "Essential vocabulary for shopping and dining",
    icon: "🛒",
    lessons: a2_shopping_food_lessons
  },
  {
    id: "weather",
    name: "Weather & Seasons",
    description: "Talk about weather conditions and seasons",
    icon: "🌤️",
    lessons: a2_weather_lessons
  }
];

// B1 TOPICS - Intermediate Level
export const b1_topics: Topic[] = [
  {
    id: "travel",
    name: "Travel & Directions",
    description: "Navigate and travel confidently in English-speaking countries",
    icon: "✈️",
    lessons: b1_travel_lessons
  },
  {
    id: "culture",
    name: "Culture & Heritage",
    description: "Explore cultural traditions and heritage sites",
    icon: "🏛️",
    lessons: b1_culture_lessons
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Discuss health issues and medical situations",
    icon: "🏥",
    lessons: b1_health_lessons
  }
];

// B2 TOPICS - Upper-Intermediate Level
export const b2_topics: Topic[] = [
  {
    id: "work",
    name: "Work & Business",
    description: "Professional English for workplace communication",
    icon: "💼",
    lessons: b2_work_lessons
  },
  {
    id: "technology",
    name: "Technology & Digital Life",
    description: "Master digital vocabulary and online communication skills",
    icon: "💻",
    lessons: b2_technology_lessons
  },
  {
    id: "education",
    name: "Education & Learning",
    description: "Discuss education systems, study skills, and academic life",
    icon: "📚",
    lessons: b2_education_lessons
  }
];

// Export all topics as a flat array (for backward compatibility)
export const allTopics: Topic[] = [
  ...a1_topics,
  ...a2_topics,
  ...b1_topics,
  ...b2_topics
];
