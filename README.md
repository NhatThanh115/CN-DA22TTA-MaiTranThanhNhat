# TVEnglish - Nền tảng Học tiếng Anh

Một nền tảng học tiếng Anh toàn diện được thiết kế dành cho người Khmer ở vùng nông thôn,
bao gồm các bài học tương tác, nội dung video và theo dõi tiến độ cá nhân hóa.

---

## 🛠 Công nghệ sử dụng

| Layer         | Công nghệ                                                         |
| ------------- | ----------------------------------------------------------------- |
| **Frontend**  | React 18, TypeScript, Vite, CSS                                   |
| **Backend**   | Deno 2, Oak Framework, JWT Authentication, bcrypt                 |
| **Database**  | SQL Server                                                        |
| **AI**        | Google Generative AI                                              |
| **Container** | Docker, Docker Compose                                            |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│    Database     │
│   (React/Vite)  │     │  (Deno/Oak)     │     │  (SQL Server)   │
│   Port: 80      │     │   Port: 8000    │     │   Port: 1433    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 🐳 Cài đặt với Docker

```bash
# Khởi động toàn bộ stack
docker-compose up --build

# Dừng và xóa volumes (reset database)
docker-compose down -v
```

**Ports:**

- Frontend: http://localhost:80
- Backend: http://localhost:8000
- Database: localhost:1433

**Tài khoản mặc định:**

- Admin: `admin` / `admin123`
- User: `user` / `user123`

---

## 📁 Cài đặt thủ công

### 1. Database

```bash
sqlcmd -S localhost -U sa -P your_password -d master -i database/schema.sql
sqlcmd -S localhost -U sa -P your_password -d tvenglish -i database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Cập nhật .env với thông tin database
deno task dev
```

### 3. Frontend

```bash
npm install
npm run dev
```

---

## 🎨 Frontend

### Cấu trúc thư mục

```
frontend/
├── App.tsx                    # Component gốc, routing, quản lý state
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── AccountPage.tsx        # Trang cài đặt tài khoản
│   ├── AdminPage.tsx          # Bảng điều khiển admin
│   ├── CoachPage.tsx          # AI Coach tương tác
│   ├── CourseView.tsx         # Hiển thị khóa học
│   ├── DashboardHome.tsx      # Trang chủ sau khi đăng nhập
│   ├── LoginPage.tsx          # Trang đăng nhập
│   ├── SignUpPage.tsx         # Trang đăng ký
│   ├── Sidebar.tsx            # Menu điều hướng bên trái
│   ├── TopicLesson.tsx        # Hiển thị bài học
│   └── WelcomePage.tsx        # Trang chào mừng
├── data/
│   ├── courses.ts             # Dữ liệu khóa học tĩnh
│   ├── lessons.ts             # Dữ liệu bài học
│   └── topics.ts              # Dữ liệu chủ đề
├── utils/
│   ├── api.ts                 # API client và xác thực
│   ├── progressTracker.ts     # Theo dõi tiến độ học tập
│   └── userProfile.ts         # Quản lý hồ sơ người dùng
└── i18n/
    └── config.ts              # Cấu hình đa ngôn ngữ (EN/VI/KM)
```

### Chức năng chính

| Component           | Chức năng                                    |
| ------------------- | -------------------------------------------- |
| `App.tsx`           | Routing, session management, navbar, sidebar |
| `LoginPage.tsx`     | Đăng nhập với email/username + password      |
| `SignUpPage.tsx`    | Đăng ký tài khoản mới                        |
| `DashboardHome.tsx` | Tổng quan tiến độ, khóa học đang học         |
| `CourseView.tsx`    | Danh sách topics trong một khóa học          |
| `TopicLesson.tsx`   | Nội dung bài học, video, bài tập             |
| `CoachPage.tsx`     | AI Coach sử dụng Google Generative AI        |
| `AccountPage.tsx`   | Chỉnh sửa thông tin cá nhân                  |
| `AdminPage.tsx`     | Quản lý users, content (cho admin/moderator) |
| `Sidebar.tsx`       | Menu điều hướng theo khóa học và topics      |

### Utils

| File                 | Các hàm                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `api.ts`             | `getAuthToken()`, `setAuthToken()`, `removeAuthToken()`, `api.auth.login()`, `api.auth.register()`, `api.progress.*`               |
| `progressTracker.ts` | `getUserProgress()`, `saveUserProgress()`, `markLessonComplete()`, `setCurrentUser()`, `clearCurrentUser()`, `isLessonCompleted()` |
| `userProfile.ts`     | `getUserProfile()`, `saveUserProfile()`, `createUserProfile()`, `updateUserProfile()`, `clearUserProfile()`                        |

---

## ⚙️ Backend

### Cấu trúc thư mục

```
backend/src/
├── main.ts                           # Entry point
├── config/
│   └── database.ts                   # SQL Server connection pool
├── controllers/
│   ├── userController.ts             # User CRUD operations
│   └── progressController.ts         # Progress tracking
├── routes/
│   ├── userRoutes.ts                 # /api/users/*
│   └── progressRoutes.ts             # /api/progress/*
├── middleware/
│   ├── auth.ts                       # JWT authentication
│   ├── cors.ts                       # CORS configuration
│   └── logger.ts                     # Request logging
├── scripts/
│   └── seed.ts                       # Database seeding script
└── types/
    └── index.ts                      # TypeScript interfaces
```

### Deno Tasks

```bash
deno task dev    # Development với auto-reload
deno task start  # Production mode
deno task seed   # Seed database với users mặc định
```

### Controllers

#### `userController.ts`

| Function                                             | Mô tả                                               |
| ---------------------------------------------------- | --------------------------------------------------- |
| `registerUser(username, email, password, full_name)` | Đăng ký user mới với password được hash bằng bcrypt |
| `loginUser(email, password)`                         | Đăng nhập, trả về JWT token và role từ database     |
| `getUserById(userId)`                                | Lấy thông tin user theo ID                          |
| `updateUser(userId, data)`                           | Cập nhật thông tin user                             |

#### `progressController.ts`

| Function                             | Mô tả                                  |
| ------------------------------------ | -------------------------------------- |
| `startLesson(data)`                  | Bắt đầu một bài học mới                |
| `completeLesson(data)`               | Hoàn thành bài học, cập nhật analytics |
| `submitExercise(data)`               | Nộp bài tập, ghi nhận kết quả          |
| `submitQuiz(data)`                   | Nộp quiz, ghi nhận điểm số             |
| `getUserProgress(userId, courseId?)` | Lấy tiến độ học tập của user           |
| `getUserStats(userId)`               | Lấy thống kê tổng hợp                  |
| `getUserStreak(userId)`              | Lấy thông tin streak                   |

### Middleware

| File        | Chức năng                                              |
| ----------- | ------------------------------------------------------ |
| `auth.ts`   | Xác thực JWT token, gắn user info vào `ctx.state.user` |
| `cors.ts`   | Cho phép cross-origin requests                         |
| `logger.ts` | Log HTTP requests với method, path, status, time       |

---

## 🗄 Database

### Cấu trúc

#### Tables chính

| Table                    | Mô tả                                        |
| ------------------------ | -------------------------------------------- |
| `users`                  | Thông tin người dùng                         |
| `user_roles`             | Định nghĩa roles (admin, moderator, student) |
| `user_role_assignments`  | Gán role cho user                            |
| `user_lesson_progress`   | Tiến độ bài học của user                     |
| `user_exercise_attempts` | Lịch sử làm bài tập                          |
| `user_quiz_scores`       | Điểm quiz                                    |
| `user_streaks`           | Chuỗi ngày học liên tiếp                     |
| `learning_analytics`     | Thống kê học tập hàng ngày                   |

#### Stored Procedures

| Procedure                   | Mô tả                                       |
| --------------------------- | ------------------------------------------- |
| `sp_update_user_streak`     | Cập nhật streak khi user hoàn thành bài học |
| `sp_update_daily_analytics` | Cập nhật thống kê hàng ngày                 |

#### Views

| View                        | Mô tả                               |
| --------------------------- | ----------------------------------- |
| `vw_user_progress_overview` | Tổng quan tiến độ theo course/topic |
| `vw_user_statistics`        | Thống kê toàn diện của user         |

### Files

| File            | Mô tả                                                      |
| --------------- | ---------------------------------------------------------- |
| `schema.sql`    | Tạo database, tables, indexes, triggers, stored procedures |
| `seed.sql`      | Insert users mặc định (admin, user) với roles              |
| `entrypoint.sh` | Script khởi tạo database trong Docker                      |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint              | Mô tả                         |
| ------ | --------------------- | ----------------------------- |
| POST   | `/api/users/register` | Đăng ký user mới              |
| POST   | `/api/users/login`    | Đăng nhập, trả về JWT token   |
| GET    | `/api/users/:userId`  | Lấy thông tin user (cần auth) |
| PUT    | `/api/users/:userId`  | Cập nhật user (cần auth)      |

### Progress Tracking (tất cả cần JWT auth)

| Method | Endpoint                        | Mô tả              |
| ------ | ------------------------------- | ------------------ |
| POST   | `/api/progress/lesson/start`    | Bắt đầu bài học    |
| POST   | `/api/progress/lesson/complete` | Hoàn thành bài học |
| POST   | `/api/progress/exercise/submit` | Nộp bài tập        |
| POST   | `/api/progress/quiz/submit`     | Nộp quiz           |
| GET    | `/api/progress/:userId`         | Lấy tiến độ user   |
| GET    | `/api/progress/:userId/stats`   | Lấy thống kê       |
| GET    | `/api/progress/:userId/streak`  | Lấy streak info    |

### Request/Response Examples

**Login:**

```json
// POST /api/users/login
{ "email": "admin", "password": "admin123" }

// Response
{
  "success": true,
  "message": "Login successful",
  "data": { "id": "...", "username": "admin", "role": "admin" },
  "token": "eyJhbGciOiJIUzUxMiI..."
}
```

**Complete Lesson:**

```json
// POST /api/progress/lesson/complete
// Header: Authorization: Bearer <token>
{
   "lesson_id": "greetings-basic",
   "course_id": "course-a1",
   "topic_id": "greetings",
   "time_spent_minutes": 15
}
```

---

## 👥 Tác giả

- **Mai Tran Thanh Nhat** - _Tác giả chính_

## 📄 License

ISC License
