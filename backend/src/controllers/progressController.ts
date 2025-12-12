import { getPool, sql } from "../config/database.ts";
import type {
  ApiResponse,
  CompleteLessonRequest,
  StartLessonRequest,
  SubmitExerciseRequest,
  SubmitQuizRequest,
  UserLessonProgress,
} from "../types/index.ts";

/**
 * Start a lesson - records when user begins a lesson
 */
export async function startLesson(
  data: StartLessonRequest,
): Promise<ApiResponse<UserLessonProgress>> {
  try {
    const pool = await getPool();
    const { user_id, lesson_id, course_id, topic_id } = data;

    // Check if progress already exists
    const checkResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .query(`
        SELECT * FROM user_lesson_progress
        WHERE user_id = @user_id AND lesson_id = @lesson_id
      `);

    if (checkResult.recordset.length > 0) {
      // Update existing record
      const updateResult = await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("lesson_id", sql.NVarChar(50), lesson_id)
        .query(`
          UPDATE user_lesson_progress
          SET status = 'in_progress',
              attempts = attempts + 1,
              updated_at = GETDATE()
          WHERE user_id = @user_id AND lesson_id = @lesson_id;

          SELECT * FROM user_lesson_progress
          WHERE user_id = @user_id AND lesson_id = @lesson_id;
        `);

      return {
        success: true,
        message: "Lesson progress updated",
        data: updateResult.recordset[0],
      };
    } else {
      // Insert new record
      const insertResult = await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("lesson_id", sql.NVarChar(50), lesson_id)
        .input("course_id", sql.NVarChar(50), course_id)
        .input("topic_id", sql.NVarChar(50), topic_id)
        .query(`
          INSERT INTO user_lesson_progress (
            user_id, lesson_id, course_id, topic_id, status, started_at, attempts
          )
          VALUES (
            @user_id, @lesson_id, @course_id, @topic_id, 'in_progress', GETDATE(), 1
          );

          SELECT * FROM user_lesson_progress
          WHERE user_id = @user_id AND lesson_id = @lesson_id;
        `);

      return {
        success: true,
        message: "Lesson started",
        data: insertResult.recordset[0],
      };
    }
  } catch (error) {
    console.error("Error starting lesson:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Complete a lesson - marks lesson as completed and updates analytics
 */
export async function completeLesson(
  data: CompleteLessonRequest,
): Promise<ApiResponse<UserLessonProgress>> {
  try {
    const pool = await getPool();
    const { user_id, lesson_id, course_id, topic_id, time_spent_minutes } = data;

    // Check if progress exists
    const checkResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .query(`
        SELECT * FROM user_lesson_progress
        WHERE user_id = @user_id AND lesson_id = @lesson_id
      `);

    if (checkResult.recordset.length > 0) {
      // Update existing record
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("lesson_id", sql.NVarChar(50), lesson_id)
        .input("time_spent", sql.Int, time_spent_minutes)
        .query(`
          UPDATE user_lesson_progress
          SET status = 'completed',
              completed_at = GETDATE(),
              time_spent_minutes = time_spent_minutes + @time_spent,
              updated_at = GETDATE()
          WHERE user_id = @user_id AND lesson_id = @lesson_id;
        `);
    } else {
      // Insert new record
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("lesson_id", sql.NVarChar(50), lesson_id)
        .input("course_id", sql.NVarChar(50), course_id)
        .input("topic_id", sql.NVarChar(50), topic_id)
        .input("time_spent", sql.Int, time_spent_minutes)
        .query(`
          INSERT INTO user_lesson_progress (
            user_id, lesson_id, course_id, topic_id, status,
            started_at, completed_at, time_spent_minutes
          )
          VALUES (
            @user_id, @lesson_id, @course_id, @topic_id, 'completed',
            GETDATE(), GETDATE(), @time_spent
          );
        `);
    }

    // Update daily analytics
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lessons_completed", sql.Int, 1)
      .input("exercises_attempted", sql.Int, 0)
      .input("correct_answers", sql.Int, 0)
      .input("time_spent", sql.Int, time_spent_minutes)
      .input("quizzes_completed", sql.Int, 0)
      .execute("sp_update_daily_analytics");

    // Update user streak
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .execute("sp_update_user_streak");

    // Get updated progress
    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .query(`
        SELECT * FROM user_lesson_progress
        WHERE user_id = @user_id AND lesson_id = @lesson_id
      `);

    return {
      success: true,
      message: "Lesson completed",
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Submit an exercise attempt
 */
export async function submitExercise(
  data: SubmitExerciseRequest,
): Promise<ApiResponse> {
  try {
    const pool = await getPool();
    const {
      user_id,
      exercise_id,
      lesson_id,
      selected_answer,
      correct_answer,
      time_taken_seconds,
    } = data;

    const is_correct = selected_answer === correct_answer;
    const time_minutes = time_taken_seconds ? Math.ceil(time_taken_seconds / 60) : 0;

    // Insert exercise attempt
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("exercise_id", sql.NVarChar(50), exercise_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .input("selected_answer", sql.Int, selected_answer)
      .input("is_correct", sql.Bit, is_correct)
      .input("time_taken_seconds", sql.Int, time_taken_seconds || null)
      .query(`
        INSERT INTO user_exercise_attempts (
          user_id, exercise_id, lesson_id, selected_answer, is_correct, time_taken_seconds
        )
        VALUES (
          @user_id, @exercise_id, @lesson_id, @selected_answer, @is_correct, @time_taken_seconds
        )
      `);

    // Update daily analytics
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lessons_completed", sql.Int, 0)
      .input("exercises_attempted", sql.Int, 1)
      .input("correct_answers", sql.Int, is_correct ? 1 : 0)
      .input("time_spent", sql.Int, time_minutes)
      .input("quizzes_completed", sql.Int, 0)
      .execute("sp_update_daily_analytics");

    // Update streak
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .execute("sp_update_user_streak");

    return {
      success: true,
      message: "Exercise submitted",
      data: { is_correct },
    };
  } catch (error) {
    console.error("Error submitting exercise:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Submit quiz results
 */
export async function submitQuiz(
  data: SubmitQuizRequest,
): Promise<ApiResponse> {
  try {
    const pool = await getPool();
    const {
      user_id,
      lesson_id,
      course_id,
      score,
      total_questions,
      correct_answers,
    } = data;

    // Insert quiz score
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .input("course_id", sql.NVarChar(50), course_id)
      .input("score", sql.Decimal(5, 2), score)
      .input("total_questions", sql.Int, total_questions)
      .input("correct_answers", sql.Int, correct_answers)
      .query(`
        INSERT INTO user_quiz_scores (
          user_id, lesson_id, course_id, score, total_questions, correct_answers
        )
        VALUES (
          @user_id, @lesson_id, @course_id, @score, @total_questions, @correct_answers
        )
      `);

    // Update daily analytics
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lessons_completed", sql.Int, 0)
      .input("exercises_attempted", sql.Int, total_questions)
      .input("correct_answers", sql.Int, correct_answers)
      .input("time_spent", sql.Int, 0)
      .input("quizzes_completed", sql.Int, 1)
      .execute("sp_update_daily_analytics");

    // Update streak
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .execute("sp_update_user_streak");

    return {
      success: true,
      message: "Quiz submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user progress for a specific course
 */
export async function getUserProgress(userId: string, courseId?: string) {
  try {
    const pool = await getPool();
    const request = pool.request()
      .input("user_id", sql.UniqueIdentifier, userId);

    let query = `
      SELECT * FROM user_lesson_progress
      WHERE user_id = @user_id
    `;

    if (courseId) {
      request.input("course_id", sql.NVarChar(50), courseId);
      query += " AND course_id = @course_id";
    }

    query += " ORDER BY updated_at DESC";

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
    };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT * FROM vw_user_statistics
        WHERE user_id = @user_id
      `);

    return {
      success: true,
      data: result.recordset[0] || null,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user streak information
 */
export async function getUserStreak(userId: string) {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT * FROM user_streaks
        WHERE user_id = @user_id
      `);

    return {
      success: true,
      data: result.recordset[0] || null,
    };
  } catch (error) {
    console.error("Error getting user streak:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
