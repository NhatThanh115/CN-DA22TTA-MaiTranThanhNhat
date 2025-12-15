# Hướng Dẫn Kiểm Thử API TVEnglish với Postman

Tài liệu này cung cấp hướng dẫn chi tiết từng bước để kiểm thử API TVEnglish sử
dụng Postman.

---

## Mục Lục

1. [Yêu Cầu Trước Khi Bắt Đầu](#yêu-cầu-trước-khi-bắt-đầu)
2. [Cài Đặt Postman](#cài-đặt-postman)
3. [Cấu Hình Môi Trường](#cấu-hình-môi-trường)
4. [Danh Sách API Endpoints](#danh-sách-api-endpoints)
5. [Hướng Dẫn Kiểm Thử](#hướng-dẫn-kiểm-thử)
   - [Kiểm Tra Trạng Thái Server](#1-kiểm-tra-trạng-thái-server)
   - [Xác Thực Người Dùng](#2-xác-thực-người-dùng)
   - [Quản Lý Người Dùng](#3-quản-lý-người-dùng)
   - [Theo Dõi Tiến Độ](#4-theo-dõi-tiến-độ)
   - [Bình Luận](#5-bình-luận)
6. [Lỗi Thường Gặp & Cách Khắc Phục](#lỗi-thường-gặp--cách-khắc-phục)

---

## Yêu Cầu Trước Khi Bắt Đầu

Trước khi kiểm thử API, đảm bảo:

1. **Docker** đã được cài đặt và đang chạy
2. **Backend server** đang hoạt động (qua `docker-compose up` hoặc
   `deno task dev`)
3. **Postman** đã được cài đặt -
   [Tải Postman](https://www.postman.com/downloads/)
4. API có thể truy cập tại `http://localhost:8000`

---

## Cài Đặt Postman

### Bước 1: Cài Đặt Postman

1. Tải Postman từ trang web chính thức
2. Cài đặt và khởi chạy ứng dụng
3. Tạo tài khoản miễn phí hoặc đăng nhập

### Bước 2: Tạo Collection Mới

1. Nhấp vào **"Collections"** ở thanh bên trái
2. Nhấp **"+"** hoặc **"New Collection"**
3. Đặt tên là `TVEnglish API`
4. Nhấp **"Create"**

---

## Cấu Hình Môi Trường

Tạo môi trường để quản lý các biến như URL cơ sở và token.

### Bước 1: Tạo Môi Trường

1. Nhấp vào **biểu tượng bánh răng** (⚙️) ở góc trên bên phải
2. Nhấp **"Add"** để tạo môi trường mới
3. Đặt tên là `TVEnglish Local`

### Bước 2: Thêm Các Biến

| Biến       | Giá Trị Ban Đầu         | Giá Trị Hiện Tại                |
| ---------- | ----------------------- | ------------------------------- |
| `base_url` | `http://localhost:8000` | `http://localhost:8000`         |
| `token`    | (để trống)              | (sẽ được đặt sau khi đăng nhập) |
| `user_id`  | (để trống)              | (sẽ được đặt sau khi đăng nhập) |

### Bước 3: Chọn Môi Trường

Chọn `TVEnglish Local` từ dropdown môi trường ở góc trên bên phải.

---

## Danh Sách API Endpoints

### URL Cơ Sở

```
http://localhost:8000
```

### Endpoints Xác Thực

| Phương Thức | Endpoint              | Cần Xác Thực | Mô Tả                  |
| ----------- | --------------------- | ------------ | ---------------------- |
| POST        | `/api/users/register` | Không        | Đăng ký người dùng mới |
| POST        | `/api/users/login`    | Không        | Đăng nhập              |

### Endpoints Người Dùng

| Phương Thức | Endpoint                    | Cần Xác Thực | Mô Tả                            |
| ----------- | --------------------------- | ------------ | -------------------------------- |
| GET         | `/api/users`                | Có (Admin)   | Lấy danh sách người dùng         |
| GET         | `/api/users/:userId`        | Có           | Lấy thông tin người dùng theo ID |
| PUT         | `/api/users/:userId`        | Có           | Cập nhật hồ sơ người dùng        |
| PATCH       | `/api/users/:userId/status` | Có (Admin)   | Kích hoạt/vô hiệu hóa người dùng |
| PATCH       | `/api/users/:userId/role`   | Có (Admin)   | Cập nhật vai trò người dùng      |

### Endpoints Tiến Độ

| Phương Thức | Endpoint                        | Cần Xác Thực | Mô Tả                            |
| ----------- | ------------------------------- | ------------ | -------------------------------- |
| POST        | `/api/progress/lesson/start`    | Có           | Bắt đầu bài học                  |
| POST        | `/api/progress/lesson/complete` | Có           | Hoàn thành bài học               |
| POST        | `/api/progress/exercise/submit` | Có           | Nộp bài tập                      |
| POST        | `/api/progress/quiz/submit`     | Có           | Nộp bài kiểm tra                 |
| GET         | `/api/progress/:userId`         | Có           | Lấy tiến độ người dùng           |
| GET         | `/api/progress/:userId/stats`   | Có           | Lấy thống kê người dùng          |
| GET         | `/api/progress/:userId/streak`  | Có           | Lấy thông tin chuỗi học liên tục |

### Endpoints Bình Luận

| Phương Thức | Endpoint                        | Cần Xác Thực | Mô Tả                     |
| ----------- | ------------------------------- | ------------ | ------------------------- |
| GET         | `/api/comments/:lessonId`       | Tùy chọn     | Lấy bình luận của bài học |
| POST        | `/api/comments`                 | Có           | Thêm bình luận            |
| POST        | `/api/comments/:commentId/like` | Có           | Thích/bỏ thích bình luận  |
| DELETE      | `/api/comments/:commentId`      | Có           | Xóa bình luận             |

---

## Hướng Dẫn Kiểm Thử

### 1. Kiểm Tra Trạng Thái Server

Xác minh API đang hoạt động.

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/`

**Phản hồi mong đợi:**

```json
{
    "success": true,
    "message": "TVEnglish API is running",
    "version": "1.0.0",
    "timestamp": "2024-12-14T12:00:00.000Z"
}
```

---

### 2. Xác Thực Người Dùng

#### 2.1 Đăng Ký Người Dùng Mới

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/users/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "username": "user",
      "email": "user@example.com",
      "password": "password123",
      "full_name": "User"
  }
  ```

**Phản hồi mong đợi (201 Created):**

```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "uuid-ở-đây",
        "username": "user",
        "email": "user@example.com",
        "full_name": "User",
        "role": "user"
    }
}
```

#### 2.2 Đăng Nhập

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/users/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "email": "user@example.com",
      "password": "password123"
  }
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "uuid-ở-đây",
        "username": "user",
        "email": "user@example.com",
        "role": "user"
    },
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
}
```

> **Quan trọng:** Sau khi đăng nhập, sao chép giá trị `token` và lưu vào môi
> trường:
>
> 1. Nhấp vào môi trường của bạn
> 2. Đặt giá trị hiện tại của biến `token` thành token từ phản hồi
> 3. Đặt biến `user_id` thành `id` của người dùng từ phản hồi

---

### 3. Quản Lý Người Dùng

#### 3.1 Lấy Thông Tin Người Dùng Theo ID

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/users/{{user_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "user": {
        "id": "uuid-ở-đây",
        "username": "user",
        "email": "user@example.com",
        "full_name": "User",
        "role": "user",
        "is_active": true,
        "created_at": "2024-12-14T12:00:00.000Z"
    }
}
```

#### 3.2 Cập Nhật Hồ Sơ Người Dùng

**Yêu cầu:**

- **Phương thức:** `PUT`
- **URL:** `{{base_url}}/api/users/{{user_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "full_name": "Tên Đã Cập Nhật",
      "preferred_language": "vi"
  }
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "User updated successfully",
    "user": {
        "id": "uuid-ở-đây",
        "full_name": "Tên Đã Cập Nhật",
        "preferred_language": "vi"
    }
}
```

#### 3.3 Lấy Tất Cả Người Dùng (Chỉ Admin)

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/users`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

> **Lưu ý:** Endpoint này yêu cầu tài khoản admin. Người dùng không phải admin
> sẽ nhận được lỗi 403 Forbidden.

---

### 4. Theo Dõi Tiến Độ

#### 4.1 Bắt Đầu Bài Học

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/progress/lesson/start`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "lesson_id": "uuid-hoặc-id-bài-học",
      "course_id": "uuid-hoặc-id-khóa-học"
  }
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "Lesson started",
    "progress": {
        "id": "uuid-tiến-độ",
        "lesson_id": "uuid-hoặc-id-bài-học",
        "started_at": "2024-12-14T12:00:00.000Z"
    }
}
```

#### 4.2 Hoàn Thành Bài Học

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/progress/lesson/complete`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "lesson_id": "uuid-hoặc-id-bài-học",
      "course_id": "uuid-hoặc-id-khóa-học",
      "time_spent": 300
  }
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "Lesson completed",
    "progress": {
        "id": "uuid-tiến-độ",
        "lesson_id": "uuid-hoặc-id-bài-học",
        "is_completed": true,
        "completed_at": "2024-12-14T12:05:00.000Z",
        "time_spent": 300
    }
}
```

#### 4.3 Nộp Bài Tập

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/progress/exercise/submit`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "exercise_id": "uuid-bài-tập",
      "lesson_id": "uuid-bài-học",
      "score": 80,
      "answers": ["câu-trả-lời-1", "câu-trả-lời-2"]
  }
  ```

#### 4.4 Nộp Bài Kiểm Tra

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/progress/quiz/submit`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "quiz_id": "uuid-bài-kiểm-tra",
      "course_id": "uuid-khóa-học",
      "score": 90,
      "total_questions": 10,
      "correct_answers": 9
  }
  ```

#### 4.5 Lấy Tiến Độ Người Dùng

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/progress/{{user_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```
- **Tham số query (tùy chọn):**
  ```
  courseId=uuid-khóa-học
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "progress": [
        {
            "lesson_id": "uuid-bài-học",
            "is_completed": true,
            "completed_at": "2024-12-14T12:00:00.000Z",
            "time_spent": 300
        }
    ]
}
```

#### 4.6 Lấy Thống Kê Người Dùng

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/progress/{{user_id}}/stats`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "stats": {
        "total_lessons_completed": 10,
        "total_time_spent": 3600,
        "average_score": 85
    }
}
```

#### 4.7 Lấy Thông Tin Chuỗi Học Liên Tục

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/progress/{{user_id}}/streak`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "streak": {
        "current_streak": 5,
        "longest_streak": 10,
        "last_activity_date": "2024-12-14"
    }
}
```

---

### 5. Bình Luận

#### 5.1 Lấy Bình Luận Của Bài Học

**Yêu cầu:**

- **Phương thức:** `GET`
- **URL:** `{{base_url}}/api/comments/uuid-bài-học`
- **Headers (tùy chọn để xem trạng thái thích):**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "comments": [
        {
            "id": "uuid-bình-luận",
            "user_id": "uuid-người-dùng",
            "username": "nguoidung",
            "content": "Bài học rất hay!",
            "like_count": 5,
            "is_liked": true,
            "created_at": "2024-12-14T12:00:00.000Z"
        }
    ]
}
```

#### 5.2 Thêm Bình Luận

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/comments`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "lesson_id": "uuid-bài-học",
      "content": "Đây là bài học rất hay! Rất hữu ích."
  }
  ```

**Phản hồi mong đợi (201 Created):**

```json
{
    "success": true,
    "message": "Comment added successfully",
    "comment": {
        "id": "uuid-bình-luận-mới",
        "content": "Đây là bài học rất hay! Rất hữu ích.",
        "created_at": "2024-12-14T12:00:00.000Z"
    }
}
```

#### 5.3 Thích/Bỏ Thích Bình Luận

**Yêu cầu:**

- **Phương thức:** `POST`
- **URL:** `{{base_url}}/api/comments/uuid-bình-luận/like`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "Comment liked",
    "is_liked": true
}
```

> **Lưu ý:** Gọi endpoint này lần nữa sẽ bỏ thích bình luận (hành vi chuyển
> đổi).

#### 5.4 Xóa Bình Luận

**Yêu cầu:**

- **Phương thức:** `DELETE`
- **URL:** `{{base_url}}/api/comments/uuid-bình-luận`
- **Headers:**
  ```
  Authorization: Bearer {{token}}
  ```

**Phản hồi mong đợi (200 OK):**

```json
{
    "success": true,
    "message": "Comment deleted successfully"
}
```

> **Lưu ý:** Chỉ chủ sở hữu bình luận mới có thể xóa bình luận của họ.

---

## Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi: 401 Unauthorized (Không Được Phép)

**Nguyên nhân:** JWT token không hợp lệ hoặc đã hết hạn.

**Giải pháp:**

1. Đăng nhập lại để lấy token mới
2. Cập nhật biến `token` trong môi trường của bạn
3. Đảm bảo header `Authorization` được đặt đúng: `Bearer <token>`

### Lỗi: 403 Forbidden (Bị Cấm)

**Nguyên nhân:** Người dùng không có quyền truy cập tài nguyên.

**Giải pháp:**

- Đối với các endpoint chỉ dành cho admin, sử dụng tài khoản admin
- Kiểm tra xem người dùng có vai trò đúng không

### Lỗi: 400 Bad Request (Yêu Cầu Không Hợp Lệ)

**Nguyên nhân:** Thiếu hoặc không hợp lệ body yêu cầu.

**Giải pháp:**

1. Kiểm tra các trường bắt buộc có đầy đủ không
2. Xác minh cú pháp JSON đúng
3. Đảm bảo header `Content-Type: application/json` được đặt

### Lỗi: 404 Not Found (Không Tìm Thấy)

**Nguyên nhân:** Tài nguyên không tồn tại hoặc sai endpoint.

**Giải pháp:**

1. Xác minh URL endpoint đúng
2. Kiểm tra xem ID tài nguyên có tồn tại không
3. Đảm bảo API server đang chạy

### Lỗi: 500 Internal Server Error (Lỗi Máy Chủ Nội Bộ)

**Nguyên nhân:** Lỗi phía máy chủ.

**Giải pháp:**

1. Kiểm tra logs container Docker: `docker-compose logs backend`
2. Xác minh database đang chạy: `docker-compose ps`
3. Kiểm tra vấn đề kết nối database

---

## Mẹo Kiểm Thử Hiệu Quả

1. **Sử Dụng Collections:** Tổ chức các yêu cầu vào thư mục trong collection
2. **Lưu Yêu Cầu:** Lưu mỗi yêu cầu đã kiểm thử để sử dụng sau
3. **Sử Dụng Biến:** Lưu các giá trị thường dùng trong biến môi trường
4. **Viết Tests:** Thêm script kiểm thử Postman để tự động hóa xác thực phản hồi
5. **Xuất Collection:** Chia sẻ collection với các thành viên nhóm

### Ví Dụ Script Kiểm Thử (Tab Tests của Postman)

```javascript
// Kiểm thử phản hồi đăng nhập
pm.test("Đăng nhập thành công", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.token).to.not.be.undefined;

    // Tự động lưu token vào môi trường
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
});
```

---

## Bảng Tham Khảo Nhanh

| Hành Động           | Phương Thức | Endpoint                        | Cần Body |
| ------------------- | ----------- | ------------------------------- | -------- |
| Kiểm tra server     | GET         | `/`                             | Không    |
| Đăng ký             | POST        | `/api/users/register`           | Có       |
| Đăng nhập           | POST        | `/api/users/login`              | Có       |
| Lấy người dùng      | GET         | `/api/users/:id`                | Không    |
| Cập nhật người dùng | PUT         | `/api/users/:id`                | Có       |
| Bắt đầu bài học     | POST        | `/api/progress/lesson/start`    | Có       |
| Hoàn thành bài học  | POST        | `/api/progress/lesson/complete` | Có       |
| Lấy tiến độ         | GET         | `/api/progress/:userId`         | Không    |
| Thêm bình luận      | POST        | `/api/comments`                 | Có       |
| Thích bình luận     | POST        | `/api/comments/:id/like`        | Không    |

---

_Cập nhật lần cuối: 14 tháng 12, 2024_
