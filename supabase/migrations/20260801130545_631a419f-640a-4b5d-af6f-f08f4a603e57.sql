CREATE POLICY "authenticated users can upload own gov docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gov-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "authenticated users can read own gov docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'gov-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "authenticated users can update own gov docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gov-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'gov-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "authenticated users can delete own gov docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'gov-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);