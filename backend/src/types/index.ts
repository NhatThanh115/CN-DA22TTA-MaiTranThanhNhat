// User types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  date_of_birth?: Date;
  country?: string;
  preferred_language: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  is_active: boolean;
  is_verified: boolean;
  profile_picture_url?: string;
}

// Progress tracking types
export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  topic_id: string;
  status: "not_started" | "in_progress" | "completed";
  started_at?: Date;
  completed_at?: Date;
  time_spent_minutes: number;
  attempts: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  lesson_id: string;
  selected_answer: number;
  is_correct: boolean;
  attempted_at: Date;
  time_taken_seconds?: number;
}

export interface UserQuizScore {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  completed_at: Date;
}

// Streak types
export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: Date;
  updated_at: Date;
}

// Analytics types
export interface LearningAnalytics {
  id: string;
  user_id: string;
  date: Date;
  lessons_completed: number;
  exercises_attempted: number;
  correct_answers: number;
  quizzes_completed: number;
  time_spent_minutes: number;
  created_at: Date;
}

// Request/Response types
export interface StartLessonRequest {
  user_id: string;
  lesson_id: string;
  course_id: string;
  topic_id: string;
}

export interface CompleteLessonRequest {
  user_id: string;
  lesson_id: string;
  course_id: string;
  topic_id: string;
  time_spent_minutes: number;
}

export interface SubmitExerciseRequest {
  user_id: string;
  exercise_id: string;
  lesson_id: string;
  selected_answer: number;
  correct_answer: number;
  time_taken_seconds?: number;
}

export interface SubmitQuizRequest {
  user_id: string;
  lesson_id: string;
  course_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Comment types
export interface LessonComment {
  id: string;
  user_id: string;
  lesson_id: string;
  content: string;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
  author_name?: string; // Joined from users table
  has_liked?: boolean; // Whether current user has liked
}

export interface AddCommentRequest {
  user_id: string;
  lesson_id: string;
  content: string;
}

export interface LikeCommentRequest {
  user_id: string;
  comment_id: string;
}
