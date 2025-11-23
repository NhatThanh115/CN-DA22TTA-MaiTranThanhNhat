-- TVEnglish Sample Data
-- Sample data for testing and development
-- Created: 2025-11-22

-- ============================================================================
-- SAMPLE USERS
-- ============================================================================

-- Admin user (password: admin123 - should be hashed in production)
INSERT INTO users (id, username, email, password_hash, role, status, join_date) VALUES
('admin-001', 'admin', 'admin@tvenglish.com', '$2b$10$example_hash_admin', 'admin', 'active', NOW());

-- Moderator user (password: mod123)
INSERT INTO users (id, username, email, password_hash, role, status, join_date) VALUES
('mod-001', 'moderator', 'mod@tvenglish.com', '$2b$10$example_hash_mod', 'moderator', 'active', NOW());

-- Regular users
INSERT INTO users (id, username, email, password_hash, role, status, birthdate, sex, join_date) VALUES
('user-001', 'john_doe', 'john@example.com', '$2b$10$example_hash_john', 'user', 'active', '1995-05-15', 'male', DATE_SUB(NOW(), INTERVAL 30 DAY)),
('user-002', 'jane_smith', 'jane@example.com', '$2b$10$example_hash_jane', 'user', 'active', '1998-08-22', 'female', DATE_SUB(NOW(), INTERVAL 60 DAY)),
('user-003', 'bob_wilson', 'bob@example.com', '$2b$10$example_hash_bob', 'user', 'inactive', '1992-03-10', 'male', DATE_SUB(NOW(), INTERVAL 90 DAY));

-- ============================================================================
-- SAMPLE COURSES
-- ============================================================================

INSERT INTO courses (id, level, title, description, title_key, description_key, estimated_hours, color, bg_color, display_order) VALUES
('course-a1', 'A1', 'Beginner (A1)', 'Start your English learning journey! Master basic greetings, simple sentences, and everyday vocabulary.', 'courses.a1.title', 'courses.a1.description', 80, '#22c55e', 'bg-green-500', 1),
('course-a2', 'A2', 'Elementary (A2)', 'Build on your basics! Learn past tenses, more complex sentences, and expand your vocabulary.', 'courses.a2.title', 'courses.a2.description', 100, '#3b82f6', 'bg-blue-500', 2),
('course-b1', 'B1', 'Intermediate (B1)', 'Become an independent user! Master complex grammar, discuss abstract topics, and improve fluency.', 'courses.b1.title', 'courses.b1.description', 120, '#f97316', 'bg-orange-500', 3),
('course-b2', 'B2', 'Upper-Intermediate (B2)', 'Achieve advanced proficiency! Handle complex discussions, understand nuanced language, and express yourself fluently.', 'courses.b2.title', 'courses.b2.description', 140, '#a855f7', 'bg-purple-500', 4);

-- ============================================================================
-- SAMPLE TOPICS
-- ============================================================================

-- A1 Topics
INSERT INTO topics (id, course_id, name, description, icon, display_order) VALUES
('greetings', 'course-a1', 'Greetings & Introductions', 'Learn how to greet people and introduce yourself in various situations', '👋', 1),
('numbers', 'course-a1', 'Numbers & Counting', 'Master numbers, counting, and basic mathematics in English', '🔢', 2),
('family', 'course-a1', 'Family & Relationships', 'Learn vocabulary for family members and how to describe relationships', '👨‍👩‍👧‍👦', 3);

-- A2 Topics
INSERT INTO topics (id, course_id, name, description, icon, display_order) VALUES
('daily-life', 'course-a2', 'Daily Life & Routines', 'Learn to describe your daily activities and routines', '☀️', 1),
('shopping-food', 'course-a2', 'Shopping & Food', 'Essential vocabulary for shopping and dining', '🛒', 2),
('weather', 'course-a2', 'Weather & Seasons', 'Talk about weather conditions and seasons', '🌤️', 3);

-- B1 Topics
INSERT INTO topics (id, course_id, name, description, icon, display_order) VALUES
('travel', 'course-b1', 'Travel & Directions', 'Navigate and travel confidently in English-speaking countries', '✈️', 1),
('culture', 'course-b1', 'Culture & Heritage', 'Explore cultural traditions and heritage sites', '🏛️', 2),
('health', 'course-b1', 'Health & Wellness', 'Discuss health issues and medical situations', '🏥', 3);

-- B2 Topics
INSERT INTO topics (id, course_id, name, description, icon, display_order) VALUES
('work', 'course-b2', 'Work & Business', 'Professional English for workplace communication', '💼', 1),
('technology', 'course-b2', 'Technology & Digital Life', 'Master digital vocabulary and online communication skills', '💻', 2),
('education', 'course-b2', 'Education & Learning', 'Discuss education systems, study skills, and academic life', '📚', 3);

-- ============================================================================
-- SAMPLE LESSONS
-- ============================================================================

-- A1 Greetings Lessons
INSERT INTO lessons (id, topic_id, title, description, difficulty, type, display_order, status) VALUES
('greetings-basic', 'greetings', 'Basic Greetings', 'Learn how to greet people in different situations - formal and informal contexts.', 'A1', 'grammar', 1, 'published'),
('introductions-self', 'greetings', 'Introducing Yourself', 'Learn how to introduce yourself in English, including sharing your name, occupation, and where you''re from.', 'A1', 'vocabulary', 2, 'published'),
('greetings-farewell', 'greetings', 'Saying Goodbye', 'Learn different ways to say goodbye in English, from casual to formal situations.', 'A1', 'speaking', 3, 'published');

-- ============================================================================
-- SAMPLE LESSON KEY POINTS
-- ============================================================================

INSERT INTO lesson_key_points (id, lesson_id, point, display_order) VALUES
('kp-1', 'greetings-basic', 'Use ''Hello'' and ''Hi'' for general greetings', 1),
('kp-2', 'greetings-basic', '''Good morning/afternoon/evening'' are time-specific greetings', 2),
('kp-3', 'greetings-basic', '''How are you?'' is a common follow-up question', 3),
('kp-4', 'greetings-basic', 'Informal greetings include ''Hey'', ''What''s up?'', ''How''s it going?''', 4);

-- ============================================================================
-- SAMPLE LESSON EXAMPLES
-- ============================================================================

INSERT INTO lesson_examples (id, lesson_id, sentence, explanation, display_order) VALUES
('ex-1', 'greetings-basic', 'Hello! How are you today?', 'A friendly, neutral greeting suitable for most situations', 1),
('ex-2', 'greetings-basic', 'Good morning, Mr. Smith. Nice to see you.', 'A formal greeting using time of day and title', 2),
('ex-3', 'greetings-basic', 'Hey! What''s up?', 'An informal greeting used between friends', 3);

-- ============================================================================
-- SAMPLE EXERCISES
-- ============================================================================

INSERT INTO exercises (id, lesson_id, type, question, correct_answer, explanation, display_order) VALUES
('ex-greetings-1', 'greetings-basic', 'multiple-choice', 'Complete the conversation: ''Good morning, ___________.''', '1', 'The correct answer is ''Professor Johnson''. Since the greeting is ''Good morning'' (formal), we should use a formal title and last name.', 1),
('ex-intro-1', 'introductions-self', 'multiple-choice', 'Fill in the blanks: ''Hello, my name ___ David. I ___ from Australia.''', '0', 'The correct answer is ''is / am''. We use ''is'' after ''my name'', ''am'' with ''I''.', 1);

-- ============================================================================
-- SAMPLE EXERCISE OPTIONS
-- ============================================================================

INSERT INTO exercise_options (id, exercise_id, option_text, option_order) VALUES
('opt-1-1', 'ex-greetings-1', 'dude', 0),
('opt-1-2', 'ex-greetings-1', 'Professor Johnson', 1),
('opt-1-3', 'ex-greetings-1', 'buddy', 2),
('opt-1-4', 'ex-greetings-1', 'mate', 3),
('opt-2-1', 'ex-intro-1', 'is / am', 0),
('opt-2-2', 'ex-intro-1', 'am / am', 1),
('opt-2-3', 'ex-intro-1', 'is / come', 2),
('opt-2-4', 'ex-intro-1', 'was / am', 3);

-- ============================================================================
-- SAMPLE USER PROGRESS
-- ============================================================================

INSERT INTO user_progress (id, user_id, words_learned, last_study_date, study_streak, total_time_spent) VALUES
('prog-001', 'user-001', 150, CURDATE(), 5, 240),
('prog-002', 'user-002', 320, CURDATE(), 21, 680);

-- ============================================================================
-- SAMPLE COMPLETED LESSONS
-- ============================================================================

INSERT INTO user_completed_lessons (id, user_id, lesson_id, completed_at, time_spent) VALUES
('comp-001', 'user-001', 'greetings-basic', DATE_SUB(NOW(), INTERVAL 5 DAY), 15),
('comp-002', 'user-001', 'introductions-self', DATE_SUB(NOW(), INTERVAL 3 DAY), 20),
('comp-003', 'user-002', 'greetings-basic', DATE_SUB(NOW(), INTERVAL 10 DAY), 12),
('comp-004', 'user-002', 'introductions-self', DATE_SUB(NOW(), INTERVAL 8 DAY), 18),
('comp-005', 'user-002', 'greetings-farewell', DATE_SUB(NOW(), INTERVAL 6 DAY), 16);

-- ============================================================================
-- SAMPLE QUIZ SCORES
-- ============================================================================

INSERT INTO user_quiz_scores (id, user_id, lesson_id, score, total_questions, correct_answers, completed_at) VALUES
('quiz-001', 'user-001', 'greetings-basic', 85, 10, 8, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('quiz-002', 'user-002', 'greetings-basic', 92, 10, 9, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================================================
-- SAMPLE COMMENTS
-- ============================================================================

INSERT INTO lesson_comments (id, lesson_id, user_id, content, likes, created_at) VALUES
('comment-001', 'greetings-basic', 'user-001', 'This lesson was very helpful! The examples made it easy to understand.', 12, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('comment-002', 'greetings-basic', 'user-002', 'Great explanation. Could you add more practice exercises?', 8, DATE_SUB(NOW(), INTERVAL 1 DAY));

