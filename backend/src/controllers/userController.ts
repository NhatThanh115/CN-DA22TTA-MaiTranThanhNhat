import { getPool, sql } from "../config/database.ts";
import { hash, compare, genSalt } from "bcrypt";
import type { ApiResponse, User } from "../types/index.ts";
import { create } from "djwt";
import { jwtKey } from "../middleware/auth.ts";

const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
export async function registerUser(
  username: string,
  email: string,
  password: string,
  full_name?: string,
): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    // Check if user already exists
    const existingUser = await pool.request()
      .input("email", sql.NVarChar(255), email)
      .input("username", sql.NVarChar(50), username)
      .query(`
        SELECT id FROM users
        WHERE email = @email OR username = @username
      `);

    if (existingUser.recordset.length > 0) {
      return {
        success: false,
        error: "User with this email or username already exists",
      };
    }

    // Hash password
    const salt = await genSalt(SALT_ROUNDS);
    const password_hash = await hash(password, salt);

    // Insert new user
    const result = await pool.request()
      .input("username", sql.NVarChar(50), username)
      .input("email", sql.NVarChar(255), email)
      .input("password_hash", sql.NVarChar(255), password_hash)
      .input("full_name", sql.NVarChar(100), full_name || null)
      .query(`
        INSERT INTO users (username, email, password_hash, full_name)
        VALUES (@username, @email, @password_hash, @full_name);

        SELECT id, username, email, full_name, created_at, updated_at, is_active, is_verified
        FROM users
        WHERE email = @email;
      `);

    const newUser = result.recordset[0];

    // Assign default student role
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, newUser.id)
      .query(`
        INSERT INTO user_role_assignments (user_id, role_id)
        SELECT @user_id, id FROM user_roles WHERE role_name = 'student'
      `);

    return {
      success: true,
      message: "User registered successfully",
      data: newUser,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    // Get user by email or username, including their role
    const result = await pool.request()
      .input("email_or_username", sql.NVarChar(255), email)
      .query(`
        SELECT u.*, r.role_name as role
        FROM users u
        LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
        LEFT JOIN user_roles r ON ura.role_id = r.id
        WHERE (u.email = @email_or_username OR u.username = @email_or_username) AND u.is_active = 1
      `);

    if (result.recordset.length === 0) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const user = result.recordset[0];

    // Verify password
    const isPasswordValid = await compare(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Update last login
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, user.id)
      .query(`
        UPDATE users SET last_login = GETDATE() WHERE id = @user_id
      `);

    // Remove password_hash from response but keep role
    const { password_hash: _, ...userWithoutPassword } = user;

    // Generate JWT with role included
    const jwt = await create(
      { alg: "HS512", typ: "JWT" }, 
      { id: user.id, email: user.email, role: user.role || 'user' }, 
      jwtKey
    );

    return {
      success: true,
      message: "Login successful",
      data: userWithoutPassword,
      // @ts-ignore: Extending response with token
      token: jwt,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT id, username, email, full_name, date_of_birth, country,
               preferred_language, created_at, updated_at, last_login,
               is_active, is_verified, profile_picture_url
        FROM users
        WHERE id = @user_id
      `);

    if (result.recordset.length === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>,
): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    const allowedFields = [
      "full_name",
      "date_of_birth",
      "country",
      "preferred_language",
      "profile_picture_url",
    ];

    const updateParts: string[] = [];
    const request = pool.request();

    request.input("user_id", sql.UniqueIdentifier, userId);

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        updateParts.push(`${key} = @${key}`);

        if (key === "date_of_birth") {
          request.input(key, sql.Date, value);
        } else {
          request.input(key, sql.NVarChar, value);
        }
      }
    });

    if (updateParts.length === 0) {
      return {
        success: false,
        error: "No valid fields to update",
      };
    }

    const query = `
      UPDATE users
      SET ${updateParts.join(", ")}, updated_at = GETDATE()
      WHERE id = @user_id;

      SELECT id, username, email, full_name, date_of_birth, country,
             preferred_language, created_at, updated_at, last_login,
             is_active, is_verified, profile_picture_url
      FROM users
      WHERE id = @user_id;
    `;

    const result = await request.query(query);

    return {
      success: true,
      message: "User updated successfully",
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all users with roles and progress stats (admin only)
 */
export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.full_name,
          u.created_at,
          u.last_login,
          u.is_active,
          u.is_verified,
          ISNULL(r.role_name, 'student') AS role,
          ISNULL(lp.lessons_completed, 0) AS lessons_completed,
          ISNULL(us.current_streak, 0) AS study_streak,
          ISNULL(qs.avg_score, 0) AS avg_score
        FROM users u
        LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
        LEFT JOIN user_roles r ON ura.role_id = r.id
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS lessons_completed
          FROM user_lesson_progress
          GROUP BY user_id
        ) lp ON u.id = lp.user_id
        LEFT JOIN user_streaks us ON u.id = us.user_id
        LEFT JOIN (
          SELECT 
            user_id,
            AVG(CAST(score AS FLOAT)) AS avg_score
          FROM user_quiz_scores
          GROUP BY user_id
        ) qs ON u.id = qs.user_id
        ORDER BY u.created_at DESC
      `);

    return {
      success: true,
      data: result.recordset,
    };
  } catch (error) {
    console.error("Error getting all users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update user status (activate/deactivate)
 */
export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("is_active", sql.Bit, isActive ? 1 : 0)
      .query(`
        UPDATE users SET is_active = @is_active, updated_at = GETDATE()
        WHERE id = @user_id
      `);

    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT id, username, email, full_name, is_active
        FROM users WHERE id = @user_id
      `);

    return {
      success: true,
      message: isActive ? "User activated" : "User deactivated",
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  roleName: string
): Promise<ApiResponse<User>> {
  try {
    const pool = await getPool();

    // Get role id
    const roleResult = await pool.request()
      .input("role_name", sql.NVarChar(50), roleName)
      .query(`SELECT id FROM user_roles WHERE role_name = @role_name`);

    if (roleResult.recordset.length === 0) {
      return {
        success: false,
        error: "Invalid role",
      };
    }

    const roleId = roleResult.recordset[0].id;

    // Update or insert role assignment
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("role_id", sql.Int, roleId)
      .query(`
        IF EXISTS (SELECT 1 FROM user_role_assignments WHERE user_id = @user_id)
          UPDATE user_role_assignments SET role_id = @role_id WHERE user_id = @user_id
        ELSE
          INSERT INTO user_role_assignments (user_id, role_id) VALUES (@user_id, @role_id)
      `);

    const result = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT u.id, u.username, r.role_name as role
        FROM users u
        LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
        LEFT JOIN user_roles r ON ura.role_id = r.id
        WHERE u.id = @user_id
      `);

    return {
      success: true,
      message: "User role updated",
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
