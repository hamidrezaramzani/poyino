-- Expand UserRole enum (must commit before values are used)
ALTER TYPE "UserRole" ADD VALUE 'OWNER';
ALTER TYPE "UserRole" ADD VALUE 'RECRUITER';
ALTER TYPE "UserRole" ADD VALUE 'HIRING_MANAGER';
ALTER TYPE "UserRole" ADD VALUE 'INTERVIEWER';
ALTER TYPE "UserRole" ADD VALUE 'VIEWER';
