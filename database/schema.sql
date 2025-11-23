-- TVEnglish Database Schema
-- English Learning Application Database
-- Created: 2025-11-22

-- Enable UUID extension for PostgreSQL (comment out if using MySQL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive') DEFAULT 'active',
    birthdate DATE,
    sex ENUM('male', 'female', 'other', 'prefer-not-to-say'),
    phone_number VARCHAR(20),
    avatar VARCHAR(500),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- ============================================================================
-- COURSE STRUCTURE
-- ============================================================================

-- Courses table (CEFR levels: A1, A2, B1, B2)
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    level ENUM('A1', 'A2', 'B1', 'B2') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    title_key VARCHAR(100),
    description_key VARCHAR(100),
    estimated_hours INT DEFAULT 0,
    color VARCHAR(20),
    bg_color VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level)
);

-- Topics table (organized within courses)
CREATE TABLE topics (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
);

-- Lessons table
CREATE TABLE lessons (
    id VARCHAR(36) PRIMARY KEY,
    topic_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    difficulty ENUM('A1', 'A2', 'B1', 'B2') NOT NULL,
    type ENUM('grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing') DEFAULT 'grammar',
    video_url VARCHAR(500),
    audio_url VARCHAR(500),
    display_order INT DEFAULT 0,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic_id (topic_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Lesson key points
CREATE TABLE lesson_key_points (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    point TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id)
);

-- Lesson examples
CREATE TABLE lesson_examples (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    sentence TEXT NOT NULL,
    explanation TEXT,
    display_order INT DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id)
);

-- Lesson media (images, videos)
CREATE TABLE lesson_media (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    type ENUM('image', 'video') NOT NULL,
    url VARCHAR(500),
    placeholder VARCHAR(500),
    caption TEXT,
    display_order INT DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id)
);

-- ============================================================================
-- EXERCISES & QUIZZES
-- ============================================================================

-- Exercises table
CREATE TABLE exercises (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    type ENUM('multiple-choice', 'fill-blank', 'true-false') DEFAULT 'multiple-choice',
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id)
);

-- Exercise options (for multiple choice questions)
CREATE TABLE exercise_options (
    id VARCHAR(36) PRIMARY KEY,
    exercise_id VARCHAR(36) NOT NULL,
    option_text TEXT NOT NULL,
    option_order INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    INDEX idx_exercise_id (exercise_id)
);

-- ============================================================================
-- USER PROGRESS TRACKING
-- ============================================================================

-- User progress summary
CREATE TABLE user_progress (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    words_learned INT DEFAULT 0,
    last_study_date DATE,
    study_streak INT DEFAULT 0,
    total_time_spent INT DEFAULT 0, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id),
    INDEX idx_user_id (user_id)
);

-- Completed lessons tracking
CREATE TABLE user_completed_lessons (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    lesson_id VARCHAR(36) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent INT DEFAULT 0, -- in minutes
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_completed_at (completed_at)
);

-- Topic progress tracking
CREATE TABLE user_topic_progress (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    completed_lessons INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    percentage INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    INDEX idx_user_id (user_id),
    INDEX idx_topic_id (topic_id)
);

-- Quiz scores tracking
CREATE TABLE user_quiz_scores (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    lesson_id VARCHAR(36) NOT NULL,
    score INT NOT NULL, -- percentage (0-100)
    total_questions INT,
    correct_answers INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_completed_at (completed_at)
);

-- ============================================================================
-- COMMENTS & FEEDBACK
-- ============================================================================

-- Lesson comments
CREATE TABLE lesson_comments (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Comment likes tracking
CREATE TABLE comment_likes (
    id VARCHAR(36) PRIMARY KEY,
    comment_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES lesson_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_comment_like (user_id, comment_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id)
);

-- Lesson reports (for flagging inappropriate content)
CREATE TABLE lesson_reports (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(36),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- ============================================================================
-- AI COACH INTERACTIONS
-- ============================================================================

-- AI Coach chat sessions
CREATE TABLE coach_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- AI Coach messages
CREATE TABLE coach_messages (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES coach_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- Activity logs for auditing
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

