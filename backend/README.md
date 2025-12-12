# TVEnglish Backend - Deno 2 with SQL Server

Backend API for TVEnglish learning platform built with Deno 2 and SQL Server.

## Prerequisites

- [Deno 2](https://deno.land/) installed
- SQL Server database running (SQL Server 2019+ or Azure SQL Database)
- Database schema initialized (see `/database/schema.sql`)

## Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure database connection in `.env`:**
   ```env
   DB_SERVER=localhost
   DB_PORT=1433
   DB_DATABASE=tvenglish
   DB_USER=sa
   DB_PASSWORD=your_password
   DB_ENCRYPT=true
   DB_TRUST_SERVER_CERTIFICATE=true
   PORT=8000
   ```

3. **Initialize database:**

   Open SQL Server Management Studio (SSMS) or use sqlcmd:
   ```bash
   sqlcmd -S localhost -U sa -P your_password -d tvenglish -i ../database/schema.sql
   ```

   Or in SSMS:
   - Create database `tvenglish`
   - Open and execute `schema.sql`

## Running the Server

### Development mode (with auto-reload):
```bash
deno task dev
```

### Production mode:
```bash
deno task start
```

The server will start at `http://localhost:8000`

## API Endpoints

### User Management

- **POST** `/api/users/register` - Register a new user
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "full_name": "John Doe"
  }
  ```

- **POST** `/api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

- **GET** `/api/users/:userId` - Get user profile
- **PUT** `/api/users/:userId` - Update user profile

### Progress Tracking

- **POST** `/api/progress/lesson/start` - Start a lesson
  ```json
  {
    "user_id": "uuid",
    "lesson_id": "greetings-basic",
    "course_id": "course-a1",
    "topic_id": "greetings"
  }
  ```

- **POST** `/api/progress/lesson/complete` - Complete a lesson
  ```json
  {
    "user_id": "uuid",
    "lesson_id": "greetings-basic",
    "course_id": "course-a1",
    "topic_id": "greetings",
    "time_spent_minutes": 15
  }
  ```

- **POST** `/api/progress/exercise/submit` - Submit exercise attempt
  ```json
  {
    "user_id": "uuid",
    "exercise_id": "ex-greetings-1",
    "lesson_id": "greetings-basic",
    "selected_answer": 1,
    "correct_answer": 1,
    "time_taken_seconds": 30
  }
  ```

- **POST** `/api/progress/quiz/submit` - Submit quiz results
  ```json
  {
    "user_id": "uuid",
    "lesson_id": "greetings-basic",
    "course_id": "course-a1",
    "score": 85.5,
    "total_questions": 10,
    "correct_answers": 8
  }
  ```

- **GET** `/api/progress/:userId?courseId=course-a1` - Get user progress
- **GET** `/api/progress/:userId/stats` - Get user statistics
- **GET** `/api/progress/:userId/streak` - Get user streak information

## Features

✅ User registration and authentication
✅ Password hashing with bcrypt
✅ Lesson progress tracking (start, in-progress, completed)
✅ Exercise attempt recording
✅ Quiz score tracking
✅ Daily streak tracking (automatic via stored procedure)
✅ Learning analytics (automatic daily aggregation via stored procedure)
✅ Course/Topic/Lesson IDs from frontend data
✅ SQL Server with connection pooling
✅ Parameterized queries for SQL injection prevention
✅ CORS enabled
✅ Request logging
✅ Error handling

## Database Features

### Stored Procedures:
- `sp_update_user_streak` - Automatically updates daily streaks
- `sp_update_daily_analytics` - Aggregates daily learning statistics

These are called automatically when:
- Lessons are completed
- Exercises are submitted
- Quizzes are completed

### Views:
- `vw_user_progress_overview` - User progress summary by course/topic
- `vw_user_statistics` - Comprehensive user statistics

### Triggers:
- Auto-updating `updated_at` timestamps on users and progress tables

## SQL Server Specific Features

- **UNIQUEIDENTIFIER** for UUIDs (using NEWID())
- **BIT** type for booleans
- **DATETIME2** for timestamps
- **NVARCHAR** for Unicode support
- **Stored Procedures** for complex operations
- **Views** for common queries
- **Extended Properties** for table documentation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # SQL Server connection pool
│   ├── controllers/
│   │   ├── progressController.ts  # Progress tracking logic
│   │   └── userController.ts      # User management logic
│   ├── routes/
│   │   ├── progressRoutes.ts      # Progress API routes
│   │   └── userRoutes.ts          # User API routes
│   ├── middleware/
│   │   ├── cors.ts           # CORS configuration
│   │   └── logger.ts         # Request logger
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── main.ts               # Application entry point
├── deno.json                 # Deno configuration
├── .env.example              # Example environment variables
└── README.md                 # This file
```

## Development Notes

- The backend expects course, topic, and lesson IDs to match those defined in the frontend data files
- All IDs from the frontend (courses.ts, topics.ts, lessons.ts) are stored as NVARCHAR(50) in SQL Server
- User IDs are UNIQUEIDENTIFIERs generated by SQL Server using NEWID()
- Timestamps are managed automatically by database triggers
- Daily streaks are updated automatically when users complete lessons or exercises
- All queries use parameterized inputs to prevent SQL injection
- Connection pooling is handled by the mssql library

## Troubleshooting

### Connection Issues:
- Ensure SQL Server is running and accepting TCP/IP connections
- Check that SQL Server Browser service is running
- Verify firewall allows connections on port 1433
- For local development with self-signed certificates, set `DB_TRUST_SERVER_CERTIFICATE=true`

### Authentication Issues:
- Enable SQL Server authentication (mixed mode)
- Verify user credentials
- Check if user has proper database permissions

### Common SQL Server Commands:
```sql
-- Check if database exists
SELECT name FROM sys.databases WHERE name = 'tvenglish';

-- Check tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

-- Check stored procedures
SELECT name FROM sys.procedures;

-- Test stored procedure
EXEC sp_update_user_streak @user_id = 'YOUR-UUID-HERE';
```
