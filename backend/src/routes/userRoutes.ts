import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.ts";

const router = new Router();

// Register new user
router.post("/api/users/register", async (context) => {
  try {
    const body = await context.request.body.json();
    const { username, email, password, full_name } = body;

    if (!username || !email || !password) {
      context.response.status = 400;
      context.response.body = {
        success: false,
        error: "Username, email, and password are required",
      };
      return;
    }

    const result = await registerUser(username, email, password, full_name);
    context.response.status = result.success ? 201 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Login user
router.post("/api/users/login", async (context) => {
  try {
    const body = await context.request.body.json();
    const { email, password } = body;

    if (!email || !password) {
      context.response.status = 400;
      context.response.body = {
        success: false,
        error: "Email and password are required",
      };
      return;
    }

    const result = await loginUser(email, password);
    context.response.status = result.success ? 200 : 401;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Get all users (admin only)
router.get("/api/users", authMiddleware, async (context) => {
  try {
    // Check if user is admin
    const user = context.state.user as { role?: string };
    if (user.role !== 'admin') {
      context.response.status = 403;
      context.response.body = {
        success: false,
        error: "Admin access required",
      };
      return;
    }

    const result = await getAllUsers();
    context.response.status = result.success ? 200 : 500;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Get user by ID
router.get("/api/users/:userId", authMiddleware, async (context) => {
  try {
    const userId = context.params.userId;
    const result = await getUserById(userId);
    context.response.status = result.success ? 200 : 404;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Update user profile
router.put("/api/users/:userId", authMiddleware, async (context) => {
  try {
    const userId = context.params.userId;
    const body = await context.request.body.json();
    const result = await updateUser(userId, body);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Update user status (activate/deactivate)
router.patch("/api/users/:userId/status", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { role?: string };
    if (user.role !== 'admin' && user.role !== 'moderator') {
      context.response.status = 403;
      context.response.body = {
        success: false,
        error: "Admin or moderator access required",
      };
      return;
    }

    const userId = context.params.userId;
    const body = await context.request.body.json();
    const result = await updateUserStatus(userId, body.is_active);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Update user role (admin only)
router.patch("/api/users/:userId/role", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { role?: string };
    if (user.role !== 'admin') {
      context.response.status = 403;
      context.response.body = {
        success: false,
        error: "Admin access required",
      };
      return;
    }

    const userId = context.params.userId;
    const body = await context.request.body.json();
    const result = await updateUserRole(userId, body.role);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

export default router;
