import { getPool, sql } from "../config/database.ts";
import type {
  AddCommentRequest,
  ApiResponse,
  LessonComment,
  LikeCommentRequest,
} from "../types/index.ts";

/**
 * Get all comments for a lesson
 */
export async function getCommentsByLesson(
  lessonId: string,
  currentUserId?: string
): Promise<ApiResponse<LessonComment[]>> {
  try {
    const pool = await getPool();
    
    let query = `
      SELECT 
        lc.id,
        lc.user_id,
        lc.lesson_id,
        lc.content,
        lc.likes_count,
        lc.created_at,
        lc.updated_at,
        ISNULL(u.full_name, u.username) AS author_name
    `;
    
    // If current user is provided, check if they have liked each comment
    if (currentUserId) {
      query += `,
        CASE WHEN cl.user_id IS NOT NULL THEN 1 ELSE 0 END AS has_liked
      FROM lesson_comments lc
      INNER JOIN users u ON lc.user_id = u.id
      LEFT JOIN comment_likes cl ON lc.id = cl.comment_id AND cl.user_id = @current_user_id
      WHERE lc.lesson_id = @lesson_id
      ORDER BY lc.created_at DESC
      `;
      
      const result = await pool.request()
        .input("lesson_id", sql.NVarChar(50), lessonId)
        .input("current_user_id", sql.UniqueIdentifier, currentUserId)
        .query(query);
      // SQL returns has_liked as 0 or 1, we need to convert to boolean
      const comments = result.recordset.map((r: Record<string, unknown>) => ({ 
        ...r, 
        has_liked: r.has_liked === 1 
      })) as LessonComment[];
      
      return {
        success: true,
        data: comments,
      };
    } else {
      query += `
      FROM lesson_comments lc
      INNER JOIN users u ON lc.user_id = u.id
      WHERE lc.lesson_id = @lesson_id
      ORDER BY lc.created_at DESC
      `;
      
      const result = await pool.request()
        .input("lesson_id", sql.NVarChar(50), lessonId)
        .query(query);
      
      return {
        success: true,
        data: result.recordset,
      };
    }
  } catch (error) {
    console.error("Error getting comments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Add a new comment to a lesson
 */
export async function addComment(
  data: AddCommentRequest
): Promise<ApiResponse<LessonComment>> {
  try {
    const pool = await getPool();
    const { user_id, lesson_id, content } = data;

    // Insert the comment
    const insertResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("lesson_id", sql.NVarChar(50), lesson_id)
      .input("content", sql.NVarChar(sql.MAX), content)
      .query(`
        INSERT INTO lesson_comments (user_id, lesson_id, content)
        OUTPUT INSERTED.*
        VALUES (@user_id, @lesson_id, @content)
      `);

    const newComment = insertResult.recordset[0];

    // Get author name
    const userResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .query(`
        SELECT ISNULL(full_name, username) AS author_name
        FROM users WHERE id = @user_id
      `);

    return {
      success: true,
      message: "Comment added successfully",
      data: {
        ...newComment,
        author_name: userResult.recordset[0]?.author_name || "Unknown",
        has_liked: false,
      },
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Like or unlike a comment
 */
export async function toggleLikeComment(
  data: LikeCommentRequest
): Promise<ApiResponse<{ liked: boolean; likes_count: number }>> {
  try {
    const pool = await getPool();
    const { user_id, comment_id } = data;

    // Check if user already liked this comment
    const checkResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .input("comment_id", sql.UniqueIdentifier, comment_id)
      .query(`
        SELECT * FROM comment_likes
        WHERE user_id = @user_id AND comment_id = @comment_id
      `);

    let liked: boolean;

    if (checkResult.recordset.length > 0) {
      // Unlike: Remove the like
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("comment_id", sql.UniqueIdentifier, comment_id)
        .query(`
          DELETE FROM comment_likes
          WHERE user_id = @user_id AND comment_id = @comment_id;
          
          UPDATE lesson_comments
          SET likes_count = likes_count - 1
          WHERE id = @comment_id;
        `);
      liked = false;
    } else {
      // Like: Add the like
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("comment_id", sql.UniqueIdentifier, comment_id)
        .query(`
          INSERT INTO comment_likes (user_id, comment_id)
          VALUES (@user_id, @comment_id);
          
          UPDATE lesson_comments
          SET likes_count = likes_count + 1
          WHERE id = @comment_id;
        `);
      liked = true;
    }

    // Get updated likes count
    const countResult = await pool.request()
      .input("comment_id", sql.UniqueIdentifier, comment_id)
      .query(`
        SELECT likes_count FROM lesson_comments WHERE id = @comment_id
      `);

    return {
      success: true,
      data: {
        liked,
        likes_count: countResult.recordset[0]?.likes_count || 0,
      },
    };
  } catch (error) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a comment (only owner can delete)
 */
export async function deleteComment(
  userId: string,
  commentId: string
): Promise<ApiResponse> {
  try {
    const pool = await getPool();

    // Check if user owns this comment
    const checkResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("comment_id", sql.UniqueIdentifier, commentId)
      .query(`
        SELECT * FROM lesson_comments
        WHERE id = @comment_id AND user_id = @user_id
      `);

    if (checkResult.recordset.length === 0) {
      return {
        success: false,
        error: "Comment not found or you don't have permission to delete it",
      };
    }

    // Delete the comment (cascade will handle comment_likes)
    await pool.request()
      .input("comment_id", sql.UniqueIdentifier, commentId)
      .query(`
        DELETE FROM comment_likes WHERE comment_id = @comment_id;
        DELETE FROM lesson_comments WHERE id = @comment_id;
      `);

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
