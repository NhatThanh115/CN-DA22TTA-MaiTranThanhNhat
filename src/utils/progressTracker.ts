// Progress tracking utility for user learning progress - Topic-based tracking

export interface TopicProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface UserProgress {
  completedLessons: string[];
  topicProgress: Record<string, TopicProgress>;
  wordsLearned: number;
  lastStudyDate: string;
  studyStreak: number;
  quizScores: Record<string, number>; // lessonId -> score percentage
  timeSpent: Record<string, number>; // lessonId -> minutes
}

const STORAGE_KEY = 'tvenglish_user_progress';

// Initialize or get user progress from localStorage
export function getUserProgress(): UserProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure topicProgress exists
      if (!parsed.topicProgress) {
        parsed.topicProgress = {};
      }
      return parsed;
    } catch (error) {
      console.error('Error parsing user progress:', error);
    }
  }
  
  // Return default progress
  return {
    completedLessons: [],
    topicProgress: {},
    wordsLearned: 0,
    lastStudyDate: new Date().toISOString().split('T')[0],
    studyStreak: 1,
    quizScores: {},
    timeSpent: {},
  };
}

// Save user progress to localStorage
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // Emit custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('progressUpdated'));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

// Calculate topic progress based on completed lessons
export function calculateTopicProgress(
  topicId: string,
  topicLessons: string[],
  completedLessons: string[]
): { completed: number; total: number; percentage: number } {
  const total = topicLessons.length;
  const completed = topicLessons.filter(lessonId => 
    completedLessons.includes(lessonId)
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}

// Update all topic progress
export function updateAllTopicProgress(
  topics: Array<{ id: string; lessons: Array<{ id: string }> | string[] }>
): void {
  const progress = getUserProgress();
  
  // Ensure topicProgress exists
  if (!progress.topicProgress) {
    progress.topicProgress = {};
  }
  
  topics.forEach(topic => {
    // Handle both old format (string[]) and new format (Array<{id: string}>)
    const lessonIds = Array.isArray(topic.lessons) 
      ? topic.lessons.map(lesson => typeof lesson === 'string' ? lesson : lesson.id)
      : [];
    
    progress.topicProgress[topic.id] = calculateTopicProgress(
      topic.id,
      lessonIds,
      progress.completedLessons
    );
  });
  
  saveUserProgress(progress);
}

// Mark a lesson as completed
export function markLessonComplete(
  lessonId: string,
  topicId: string,
  topicLessons: string[]
): void {
  const progress = getUserProgress();
  
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    updateStudyStreak(progress);
    
    // Update topic progress
    progress.topicProgress[topicId] = calculateTopicProgress(
      topicId,
      topicLessons,
      progress.completedLessons
    );
    
    saveUserProgress(progress);
  }
}

// Update study streak
function updateStudyStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split('T')[0];
  const lastStudy = new Date(progress.lastStudyDate);
  const todayDate = new Date(today);
  
  const daysDiff = Math.floor((todayDate.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day - no change to streak
    return;
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    progress.studyStreak += 1;
  } else {
    // Streak broken - reset to 1
    progress.studyStreak = 1;
  }
  
  progress.lastStudyDate = today;
}

// Add quiz score for a lesson
export function addQuizScore(lessonId: string, score: number): void {
  const progress = getUserProgress();
  progress.quizScores[lessonId] = score;
  saveUserProgress(progress);
}

// Add words learned
export function addWordsLearned(count: number): void {
  const progress = getUserProgress();
  progress.wordsLearned += count;
  saveUserProgress(progress);
}

// Track time spent on a lesson
export function addTimeSpent(lessonId: string, minutes: number): void {
  const progress = getUserProgress();
  progress.timeSpent[lessonId] = (progress.timeSpent[lessonId] || 0) + minutes;
  saveUserProgress(progress);
}

// Check if a lesson is completed
export function isLessonCompleted(lessonId: string): boolean {
  const progress = getUserProgress();
  return progress.completedLessons.includes(lessonId);
}

// Get completion percentage for all lessons
export function getCompletionPercentage(totalLessons: number): number {
  const progress = getUserProgress();
  if (totalLessons === 0) return 0;
  return Math.round((progress.completedLessons.length / totalLessons) * 100);
}

// Get progress for a specific topic
export function getTopicProgress(topicId: string): { completed: number; total: number; percentage: number } {
  const progress = getUserProgress();
  
  // Return default if topicProgress doesn't exist or topic not found
  if (!progress.topicProgress || !progress.topicProgress[topicId]) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  
  return progress.topicProgress[topicId];
}

// Reset all progress (for testing or user request)
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}