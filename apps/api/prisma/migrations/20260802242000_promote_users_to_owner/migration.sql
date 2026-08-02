-- Promote all existing workspace users to OWNER (highest role).
UPDATE "users"
SET "role" = 'OWNER'
WHERE "role" <> 'OWNER';
