CREATE TABLE public.video_channels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  url text,
  category text NOT NULL DEFAULT 'noticias',
  description text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.video_channels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_channels TO authenticated;
GRANT ALL ON public.video_channels TO service_role;

ALTER TABLE public.video_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video channels"
  ON public.video_channels FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert video channels"
  ON public.video_channels FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update video channels"
  ON public.video_channels FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete video channels"
  ON public.video_channels FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_video_channels_updated_at
  BEFORE UPDATE ON public.video_channels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();