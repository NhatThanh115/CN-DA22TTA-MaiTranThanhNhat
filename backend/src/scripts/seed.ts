import { getPool } from "../config/database.ts";
import * as bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");
    const pool = await getPool();

    // 1. Get Role IDs
    console.log("Fetching roles...");
    const adminRole = await pool.request().query("SELECT id FROM user_roles WHERE role_name = 'admin'");
    const studentRole = await pool.request().query("SELECT id FROM user_roles WHERE role_name = 'student'");

    if (adminRole.recordset.length === 0 || studentRole.recordset.length === 0) {
      throw new Error("Roles not found. Did you run schema.sql?");
    }

    const adminRoleId = adminRole.recordset[0].id;
    const studentRoleId = studentRole.recordset[0].id;

    // 2. Hash Passwords
    console.log("Hashing passwords...");
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash("admin123", adminSalt); // Password: admin123

    const userSalt = await bcrypt.genSalt(10);
    const userHash = await bcrypt.hash("user123", userSalt); // Password: user123

    // 3. Insert Admin
    console.log("Inserting Admin user...");
    try {
      const adminResult = await pool.request()
        .input("username", "admin")
        .input("email", "admin@tvenglish.com")
        .input("password_hash", adminHash)
        .input("full_name", "System Admin")
        .query(`
          INSERT INTO users (username, email, password_hash, full_name, is_verified)
          OUTPUT inserted.id
          VALUES (@username, @email, @password_hash, @full_name, 1)
        `);
      const adminId = adminResult.recordset[0].id;

      // 4. Assign Admin Role
      await pool.request()
        .input("user_id", adminId)
        .input("role_id", adminRoleId)
        .query("INSERT INTO user_role_assignments (user_id, role_id) VALUES (@user_id, @role_id)");
      
      console.log(`✅ Admin user created (ID: ${adminId})`);
    } catch (err: any) {
        if (err.message.includes('VIOLATION OF UNIQUE KEY')) {
            console.log("⚠️ Admin user already exists, skipping.");
        } else {
            throw err;
        }
    }

    // 5. Insert Regular User
    console.log("Inserting Standard User...");
    try {
      const userResult = await pool.request()
        .input("username", "user")
        .input("email", "user@tvenglish.com")
        .input("password_hash", userHash)
        .input("full_name", "Test User")
        .query(`
          INSERT INTO users (username, email, password_hash, full_name, is_verified)
          OUTPUT inserted.id
          VALUES (@username, @email, @password_hash, @full_name, 1)
        `);
      const userId = userResult.recordset[0].id;

      // 6. Assign Student Role
      await pool.request()
        .input("user_id", userId)
        .input("role_id", studentRoleId)
        .query("INSERT INTO user_role_assignments (user_id, role_id) VALUES (@user_id, @role_id)");
      
      console.log(`✅ Standard user created (ID: ${userId})`);
    } catch (err: any) {
        if (err.message.includes('VIOLATION OF UNIQUE KEY')) {
            console.log("⚠️ Standard user already exists, skipping.");
        } else {
            throw err;
        }
    }

    console.log("🎉 Seeding complete!");
    Deno.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    Deno.exit(1);
  }
}

seed();
