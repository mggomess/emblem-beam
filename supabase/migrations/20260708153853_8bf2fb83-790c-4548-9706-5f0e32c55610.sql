
CREATE POLICY "own folder read inst" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'institution-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder write inst" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'institution-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder update inst" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'institution-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder delete inst" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'institution-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own folder read cert" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'certificates' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder write cert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certificates' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder update cert" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'certificates' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder delete cert" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'certificates' AND (storage.foldername(name))[1] = auth.uid()::text);
