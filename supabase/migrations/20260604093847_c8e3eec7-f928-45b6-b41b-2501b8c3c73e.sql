
-- learning_tracks: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated can insert tracks" ON public.learning_tracks;
DROP POLICY IF EXISTS "Authenticated can update tracks" ON public.learning_tracks;
DROP POLICY IF EXISTS "Authenticated can delete tracks" ON public.learning_tracks;

CREATE POLICY "Admins can insert tracks" ON public.learning_tracks
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tracks" ON public.learning_tracks
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tracks" ON public.learning_tracks
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- platforms: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated can insert platforms" ON public.platforms;
DROP POLICY IF EXISTS "Authenticated can update platforms" ON public.platforms;
DROP POLICY IF EXISTS "Authenticated can delete platforms" ON public.platforms;

CREATE POLICY "Admins can insert platforms" ON public.platforms
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update platforms" ON public.platforms
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete platforms" ON public.platforms
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- posts: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated can update posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated can delete posts" ON public.posts;

CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete posts" ON public.posts
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- avatars storage: scope read to owner folder (prevents public listing) and add delete policy
DROP POLICY IF EXISTS "Public avatar read" ON storage.objects;
CREATE POLICY "Users can read own avatar" ON storage.objects
  FOR SELECT TO authenticated
  USING ((bucket_id = 'avatars') AND ((storage.foldername(name))[1] = (auth.uid())::text));

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE TO authenticated
  USING ((bucket_id = 'avatars') AND ((storage.foldername(name))[1] = (auth.uid())::text));
