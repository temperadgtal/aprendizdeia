-- Fix 1: Remove catch-all SELECT on posts; admins can view all (incl drafts), others only published
DROP POLICY IF EXISTS "Authenticated can view all posts" ON public.posts;

CREATE POLICY "Admins can view all posts"
ON public.posts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Remove client-side INSERT on notifications (created server-side via SECURITY DEFINER trigger)
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;