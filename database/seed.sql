-- Seed initial users for TVEnglish
-- Passwords are pre-hashed with bcrypt (10 rounds)
-- admin123 hash: $2a$10$GQVzN3b3iT4E8C9Pq8suI.9r7cFd9.f5q02LUxjGOuwvRTzaH8DPO
-- user123 hash: $2a$10$3LkzkO/Yzl8vapE9D39Mq.caYmKNPjN5BWR5UtEm4eGKhx7EHi1xy

USE tvenglish;
GO

-- Insert admin user if not exists
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
BEGIN
    INSERT INTO users (id, username, email, password_hash, full_name, is_verified)
    VALUES (NEWID(), 'admin', 'admin@tvenglish.com', 
            '$2a$10$GQVzN3b3iT4E8C9Pq8suI.9r7cFd9.f5q02LUxjGOuwvRTzaH8DPO', 
            'System Admin', 1);
    PRINT 'Admin user created';
END
ELSE
BEGIN
    PRINT 'Admin user already exists';
END
GO

-- Insert standard user if not exists
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'user')
BEGIN
    INSERT INTO users (id, username, email, password_hash, full_name, is_verified)
    VALUES (NEWID(), 'user', 'user@tvenglish.com', 
            '$2a$10$3LkzkO/Yzl8vapE9D39Mq.caYmKNPjN5BWR5UtEm4eGKhx7EHi1xy', 
            'Test User', 1);
    PRINT 'Standard user created';
END
ELSE
BEGIN
    PRINT 'Standard user already exists';
END
GO

-- Assign admin role to admin user (always ensure this exists)
IF NOT EXISTS (
    SELECT 1 FROM user_role_assignments ura 
    INNER JOIN users u ON ura.user_id = u.id 
    INNER JOIN user_roles r ON ura.role_id = r.id 
    WHERE u.username = 'admin' AND r.role_name = 'admin'
)
BEGIN
    DECLARE @adminUserId UNIQUEIDENTIFIER;
    DECLARE @adminRoleId INT;
    
    SELECT @adminUserId = id FROM users WHERE username = 'admin';
    SELECT @adminRoleId = id FROM user_roles WHERE role_name = 'admin';
    
    IF @adminUserId IS NOT NULL AND @adminRoleId IS NOT NULL
    BEGIN
        INSERT INTO user_role_assignments (user_id, role_id) VALUES (@adminUserId, @adminRoleId);
        PRINT 'Admin role assigned to admin user';
    END
    ELSE
    BEGIN
        PRINT 'Could not find admin user or admin role';
    END
END
ELSE
BEGIN
    PRINT 'Admin already has admin role';
END
GO

-- Assign student role to standard user (always ensure this exists)
IF NOT EXISTS (
    SELECT 1 FROM user_role_assignments ura 
    INNER JOIN users u ON ura.user_id = u.id 
    INNER JOIN user_roles r ON ura.role_id = r.id 
    WHERE u.username = 'user' AND r.role_name = 'student'
)
BEGIN
    DECLARE @stdUserId UNIQUEIDENTIFIER;
    DECLARE @studentRoleId INT;
    
    SELECT @stdUserId = id FROM users WHERE username = 'user';
    SELECT @studentRoleId = id FROM user_roles WHERE role_name = 'student';
    
    IF @stdUserId IS NOT NULL AND @studentRoleId IS NOT NULL
    BEGIN
        INSERT INTO user_role_assignments (user_id, role_id) VALUES (@stdUserId, @studentRoleId);
        PRINT 'Student role assigned to standard user';
    END
    ELSE
    BEGIN
        PRINT 'Could not find user or student role';
    END
END
ELSE
BEGIN
    PRINT 'User already has student role';
END
GO

PRINT 'Seeding complete!';
GO
