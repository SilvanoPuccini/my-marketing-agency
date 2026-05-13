-- Create a public bucket for agency logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view logos (public bucket)
CREATE POLICY "logos_public_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'logos');

-- Authenticated users can upload logos
CREATE POLICY "logos_auth_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Authenticated users can overwrite their logos
CREATE POLICY "logos_auth_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');
