# TVEnglish Database Schema

This directory contains the database schema for the TVEnglish application - an English learning platform designed for rural learners.

## Overview

The schema is designed to support:
- **User Management**: Authentication, profiles, and role-based access control
- **Course Structure**: Hierarchical organization (Courses → Topics → Lessons)
- **Learning Content**: Lessons with exercises, media, examples, and key points
- **Progress Tracking**: Comprehensive tracking of user learning progress
- **Social Features**: Comments, likes, and content reporting
- **AI Coach**: Chat sessions for interactive learning support
- **Analytics**: Activity logging and user statistics

## Database Structure

### Core Entities

#### 1. User Management
- **users**: User accounts with authentication and profile information
- **activity_logs**: System-wide activity tracking for auditing

#### 2. Course Hierarchy
```
courses (CEFR levels: A1, A2, B1, B2)
  └── topics (themed learning modules)
      └── lessons (individual learning units)
          ├── lesson_key_points
          ├── lesson_examples
          ├── lesson_media
          └── exercises
              └── exercise_options
```

#### 3. Progress Tracking
- **user_progress**: Overall user learning statistics
- **user_completed_lessons**: Individual lesson completion records
- **user_topic_progress**: Topic-level progress aggregation
- **user_quiz_scores**: Quiz performance tracking

#### 4. Social & Feedback
- **lesson_comments**: User comments on lessons
- **comment_likes**: Like tracking for comments
- **lesson_reports**: Content flagging system

#### 5. AI Coach
- **coach_sessions**: Chat session management
- **coach_messages**: Individual messages in chat sessions

## Key Features

### CEFR Level Support
The schema supports four CEFR (Common European Framework of Reference) levels:
- **A1**: Beginner
- **A2**: Elementary
- **B1**: Intermediate
- **B2**: Upper-Intermediate

### User Roles
- **user**: Standard learner account
- **moderator**: Content moderation privileges
- **admin**: Full system access

### Lesson Types
- grammar
- vocabulary
- listening
- speaking
- reading
- writing

### Exercise Types
- multiple-choice
- fill-blank
- true-false

## Database Compatibility

The schema is written for **MySQL/MariaDB** but can be adapted for PostgreSQL:

1. Uncomment the UUID extension line at the top
2. Replace `ENUM` types with `CHECK` constraints or custom types
3. Adjust `AUTO_INCREMENT` to `SERIAL` if needed
4. Update timestamp defaults to PostgreSQL syntax

## Installation

### MySQL/MariaDB
```bash
mysql -u username -p database_name < schema.sql
```

### PostgreSQL
```bash
psql -U username -d database_name -f schema.sql
```

## Indexes

The schema includes strategic indexes on:
- Foreign keys for join performance
- Frequently queried fields (username, email, status)
- Timestamp fields for chronological queries
- Composite unique constraints for data integrity

## Relationships

### One-to-Many
- User → Progress, Comments, Sessions
- Course → Topics
- Topic → Lessons
- Lesson → Exercises, Media, Examples, Key Points
- Exercise → Options

### Many-to-Many (through junction tables)
- Users ↔ Lessons (via user_completed_lessons)
- Users ↔ Comments (via comment_likes)

## Data Integrity

- **CASCADE DELETE**: Child records are deleted when parent is removed
- **SET NULL**: References are nullified when parent is deleted (for logs)
- **UNIQUE CONSTRAINTS**: Prevent duplicate records (e.g., user-lesson completion)

## Migration from Frontend

The current frontend uses localStorage for data persistence. To migrate to this database:

1. Export user profiles from `tvenglish_user_profile` localStorage key
2. Export progress data from `tvenglish_user_progress` localStorage key
3. Import course/topic/lesson data from `frontend/data/` TypeScript files
4. Create migration scripts to transform and load data

## Future Enhancements

Potential schema additions:
- **Vocabulary tracking**: Separate table for word learning
- **Achievements/Badges**: Gamification system
- **Study groups**: Collaborative learning features
- **Notifications**: User notification system
- **Payment/Subscriptions**: Premium features support
- **Content versioning**: Track lesson changes over time

## Notes

- All IDs use VARCHAR(36) to support UUIDs
- Timestamps use MySQL's automatic update functionality
- Text fields use TEXT type for unlimited content
- URLs limited to 500 characters
- All tables include created_at/updated_at where applicable

