-- Add name column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
