-- ─── Storage bucket for piece files ─────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('piece-files', 'piece-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "piece_files_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'piece-files');

-- Allow authenticated users to read files
CREATE POLICY "piece_files_read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'piece-files');

-- Allow authenticated users to delete their uploads
CREATE POLICY "piece_files_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'piece-files');
