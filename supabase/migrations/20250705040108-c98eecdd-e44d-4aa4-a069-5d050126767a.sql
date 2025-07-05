
-- Create the claim-documents storage bucket that's referenced in SubmitClaim.tsx
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'claim-documents',
  'claim-documents', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- Create storage policy to allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own claim documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'claim-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow authenticated users to view their own files
CREATE POLICY "Users can view their own claim documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'claim-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow public access to claim documents (if needed for processing)
CREATE POLICY "Public can view claim documents" ON storage.objects
FOR SELECT USING (bucket_id = 'claim-documents');
