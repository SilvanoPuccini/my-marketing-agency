-- Add ON DELETE CASCADE to foreign keys referencing users(id)
-- so deleting a user from the dashboard doesn't fail on FK constraints.

-- 1. pieces.author_id
ALTER TABLE pieces
  DROP CONSTRAINT pieces_author_id_fkey,
  ADD CONSTRAINT pieces_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- 2. comments.author_id
ALTER TABLE comments
  DROP CONSTRAINT comments_author_id_fkey,
  ADD CONSTRAINT comments_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
