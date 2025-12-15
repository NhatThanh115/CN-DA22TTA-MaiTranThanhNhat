CREATE DATABASE tvenglish
GO
USE tvenglish
GO

-- Users table - stores user account information
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100),
    date_of_birth DATE,
    country NVARCHAR(100),
    preferred_language NVARCHAR(10) DEFAULT 'en',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    last_login DATETIME2,
    is_active BIT DEFAULT 1,
    is_verified BIT DEFAULT 0,
    profile_picture_url NVARCHAR(MAX),
    CONSTRAINT chk_email CHECK (email LIKE '%_@__%.__%')
);

-- User roles table
CREATE TABLE user_roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- User-Role association (many-to-many)
CREATE TABLE user_role_assignments (
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE
);

-- ================================================================
-- USER PROGRESS TRACKING
-- ================================================================

-- User lesson progress
CREATE TABLE user_lesson_progress (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    lesson_id NVARCHAR(50) NOT NULL,
    course_id NVARCHAR(50) NOT NULL,
    topic_id NVARCHAR(50) NOT NULL,
    status NVARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at DATETIME2,
    completed_at DATETIME2,
    time_spent_minutes INT DEFAULT 0,
    attempts INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- User exercise attempts
CREATE TABLE user_exercise_attempts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    exercise_id NVARCHAR(50) NOT NULL,
    lesson_id NVARCHAR(50) NOT NULL,
    selected_answer INT NOT NULL,
    is_correct BIT,
    attempted_at DATETIME2 DEFAULT GETDATE(),
    time_taken_seconds INT,
    CONSTRAINT fk_exercise_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User quiz scores
CREATE TABLE user_quiz_scores (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    lesson_id NVARCHAR(50) NOT NULL,
    course_id NVARCHAR(50) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    completed_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_quiz_score_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- DAILY STREAK TRACKING
-- ================================================================

-- Daily streak tracking
CREATE TABLE user_streaks (
    user_id UNIQUEIDENTIFIER PRIMARY KEY,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_streak_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- ANALYTICS & REPORTING
-- ================================================================

-- User activity logs
CREATE TABLE user_activity_logs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    activity_type NVARCHAR(50) NOT NULL,
    activity_details NVARCHAR(MAX), -- JSON string
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_activity_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- LESSON COMMENTS
-- ================================================================

-- Lesson comments table
CREATE TABLE lesson_comments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    lesson_id NVARCHAR(50) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    likes_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comment likes table (tracks which users liked which comments)
CREATE TABLE comment_likes (
    user_id UNIQUEIDENTIFIER NOT NULL,
    comment_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (user_id, comment_id),
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_comment FOREIGN KEY (comment_id) REFERENCES lesson_comments(id) ON DELETE NO ACTION
);

-- Indexes for comments
CREATE INDEX idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX idx_lesson_comments_user_id ON lesson_comments(user_id);
CREATE INDEX idx_lesson_comments_created_at ON lesson_comments(created_at DESC);

-- Learning analytics
CREATE TABLE learning_analytics (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    date DATE NOT NULL,
    lessons_completed INT DEFAULT 0,
    exercises_attempted INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    quizzes_completed INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_analytics_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_date UNIQUE (user_id, date)
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);

-- Progress tracking indexes
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_lesson_progress_course_id ON user_lesson_progress(course_id);
CREATE INDEX idx_user_exercise_attempts_user_id ON user_exercise_attempts(user_id);
CREATE INDEX idx_user_exercise_attempts_lesson_id ON user_exercise_attempts(lesson_id);

-- Activity and analytics indexes
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_learning_analytics_user_id ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_date ON learning_analytics(date);

-- Streak indexes
CREATE INDEX idx_user_streaks_last_activity ON user_streaks(last_activity_date);

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Trigger to update updated_at timestamp for users
GO
CREATE TRIGGER trg_users_updated_at
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE users
    SET updated_at = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- Trigger to update updated_at timestamp for user_lesson_progress
CREATE TRIGGER trg_user_lesson_progress_updated_at
ON user_lesson_progress
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE user_lesson_progress
    SET updated_at = GETDATE()
    FROM user_lesson_progress ulp
    INNER JOIN inserted i ON ulp.id = i.id;
END;
GO

-- ================================================================
-- SCALAR FUNCTIONS
-- ================================================================

-- Function to calculate total User XP
GO
CREATE FUNCTION fn_calculate_user_xp(@user_id UNIQUEIDENTIFIER)
RETURNS INT
AS
BEGIN
    DECLARE @xp INT = 0;

    -- XP from Lessons (50 XP per completed lesson)
    SELECT @xp = @xp + (COUNT(*) * 50)
    FROM user_lesson_progress
    WHERE user_id = @user_id AND status = 'completed';

    -- XP from Exercises (10 XP per correct answer)
    SELECT @xp = @xp + (COUNT(*) * 10)
    FROM user_exercise_attempts
    WHERE user_id = @user_id AND is_correct = 1;

    -- XP from Quizzes (Score * 10)
    SELECT @xp = @xp + ISNULL(SUM(CAST(score AS INT) * 10), 0)
    FROM user_quiz_scores
    WHERE user_id = @user_id;

    -- XP from Streaks (Current streak * 5)
    SELECT @xp = @xp + (ISNULL(current_streak, 0) * 5)
    FROM user_streaks
    WHERE user_id = @user_id;

    RETURN @xp;
END;
GO

-- Function to calculate course completion percentage
-- Requires total_lessons to be passed since it's not in DB
CREATE FUNCTION fn_get_course_completion_percentage(
    @user_id UNIQUEIDENTIFIER, 
    @course_id NVARCHAR(50),
    @total_course_lessons INT
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @completed INT;
    
    IF @total_course_lessons IS NULL OR @total_course_lessons = 0 RETURN 0;

    SELECT @completed = COUNT(*)
    FROM user_lesson_progress
    WHERE user_id = @user_id 
    AND course_id = @course_id 
    AND status = 'completed';

    RETURN CAST((@completed * 100.0) / @total_course_lessons AS DECIMAL(5,2));
END;
GO

-- ================================================================
-- STORED PROCEDURES
-- ================================================================

-- Procedure to update user streak
CREATE PROCEDURE sp_update_user_streak
    @user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @last_date DATE;
    DECLARE @current_streak INT;
    DECLARE @longest_streak INT;
    DECLARE @today DATE = CAST(GETDATE() AS DATE);

    -- Get current streak data
    SELECT
        @last_date = last_activity_date,
        @current_streak = current_streak,
        @longest_streak = longest_streak
    FROM user_streaks
    WHERE user_id = @user_id;

    -- If no record exists, create one
    IF @last_date IS NULL
    BEGIN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (@user_id, 1, 1, @today);
        RETURN;
    END

    -- If already logged today, do nothing
    IF @last_date = @today
    BEGIN
        RETURN;
    END

    -- If consecutive day
    IF DATEDIFF(day, @last_date, @today) = 1
    BEGIN
        SET @current_streak = @current_streak + 1;
        SET @longest_streak = CASE WHEN @current_streak > @longest_streak THEN @current_streak ELSE @longest_streak END;

        UPDATE user_streaks
        SET current_streak = @current_streak,
            longest_streak = @longest_streak,
            last_activity_date = @today,
            updated_at = GETDATE()
        WHERE user_id = @user_id;
    END
    ELSE
    BEGIN
        -- Streak broken
        UPDATE user_streaks
        SET current_streak = 1,
            last_activity_date = @today,
            updated_at = GETDATE()
        WHERE user_id = @user_id;
    END
END;
GO

-- Procedure to safely ensure user login and daily streak
CREATE PROCEDURE sp_ensure_user_daily_login
    @user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update last login
    UPDATE users SET last_login = GETDATE() WHERE id = @user_id;

    -- Update streak via existing logic
    EXEC sp_update_user_streak @user_id;
END;
GO

-- Procedure to update daily analytics
CREATE PROCEDURE sp_update_daily_analytics
    @user_id UNIQUEIDENTIFIER,
    @lessons_completed INT = 0,
    @exercises_attempted INT = 0,
    @correct_answers INT = 0,
    @time_spent INT = 0,
    @quizzes_completed INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @today DATE = CAST(GETDATE() AS DATE);

    -- Check if record exists
    IF EXISTS (SELECT 1 FROM learning_analytics WHERE user_id = @user_id AND date = @today)
    BEGIN
        -- Update existing record
        UPDATE learning_analytics
        SET
            lessons_completed = lessons_completed + @lessons_completed,
            exercises_attempted = exercises_attempted + @exercises_attempted,
            correct_answers = correct_answers + @correct_answers,
            time_spent_minutes = time_spent_minutes + @time_spent,
            quizzes_completed = quizzes_completed + @quizzes_completed
        WHERE user_id = @user_id AND date = @today;
    END
    ELSE
    BEGIN
        -- Insert new record
        INSERT INTO learning_analytics (
            user_id, date, lessons_completed, exercises_attempted,
            correct_answers, time_spent_minutes, quizzes_completed
        )
        VALUES (
            @user_id, @today, @lessons_completed, @exercises_attempted,
            @correct_answers, @time_spent, @quizzes_completed
        );
    END
END;
GO

-- ================================================================
-- INITIAL DATA - User Roles
-- ================================================================

INSERT INTO user_roles (role_name, description) VALUES
('admin', 'System administrator with full access'),
('teacher', 'Content creator and instructor'),
('student', 'Regular learner user'),
('moderator', 'Community moderator');
GO

-- ================================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================================

-- View for user progress overview
CREATE VIEW vw_user_progress_overview AS
SELECT
    u.id AS user_id,
    u.username,
    u.email,
    ulp.course_id,
    ulp.topic_id,
    COUNT(DISTINCT CASE WHEN ulp.status = 'completed' THEN ulp.lesson_id END) AS lessons_completed,
    COUNT(DISTINCT ulp.lesson_id) AS total_lessons_started,
    AVG(ulp.time_spent_minutes) AS avg_time_per_lesson,
    MAX(ulp.completed_at) AS last_lesson_completed
FROM users u
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id
GROUP BY u.id, u.username, u.email, ulp.course_id, ulp.topic_id;
GO

-- View for user statistics
CREATE VIEW vw_user_statistics AS
SELECT
    u.id AS user_id,
    u.username,
    u.email,
    ISNULL(us.current_streak, 0) AS current_streak,
    ISNULL(us.longest_streak, 0) AS longest_streak,
    us.last_activity_date,
    COUNT(DISTINCT CASE WHEN ulp.status = 'completed' THEN ulp.lesson_id END) AS total_lessons_completed,
    COUNT(DISTINCT uea.exercise_id) AS total_exercises_attempted,
    COUNT(DISTINCT CASE WHEN uea.is_correct = 1 THEN uea.exercise_id END) AS total_correct_answers,
    SUM(ISNULL(ulp.time_spent_minutes, 0)) AS total_time_spent_minutes
FROM users u
LEFT JOIN user_streaks us ON u.id = us.user_id
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id
LEFT JOIN user_exercise_attempts uea ON u.id = uea.user_id
GROUP BY u.id, u.username, u.email, us.current_streak, us.longest_streak, us.last_activity_date;
GO

-- View for user leaderboard (Gamification)
CREATE VIEW vw_user_leaderboard AS
SELECT
    u.id AS user_id,
    u.username,
    u.full_name,
    u.profile_picture_url,
    u.country,
    dbo.fn_calculate_user_xp(u.id) AS total_xp,
    ISNULL(us.current_streak, 0) AS current_streak,
    u.is_active
FROM users u
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.is_active = 1;
GO

-- ================================================================
-- COMMENTS (Extended Properties)
-- ================================================================

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Stores user account information and authentication data',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'users';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Tracks individual user progress through lessons',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'user_lesson_progress';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Records all exercise attempts by users',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'user_exercise_attempts';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Stores quiz completion scores',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'user_quiz_scores';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Tracks daily learning streaks for gamification',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'user_streaks';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Daily aggregated learning statistics per user',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'learning_analytics';
GO

EXEC sp_addextendedproperty
    @name = N'MS_Description', @value = 'Logs all user activities for analytics',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'user_activity_logs';
GO

-- ================================================================
-- END OF SCHEMA
-- ================================================================
