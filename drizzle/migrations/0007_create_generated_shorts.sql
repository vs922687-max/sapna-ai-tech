CREATE TABLE public.generated_shorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT NOT NULL CHECK (char_length(topic) BETWEEN 1 AND 200),
  language TEXT NOT NULL DEFAULT 'Hindi' CHECK (language IN ('Hindi', 'Punjabi', 'English')),
  script TEXT NOT NULL CHECK (char_length(script) <= 12000),
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) <= 5000),
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'ready', 'uploaded', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_shorts TO authenticated;
GRANT ALL ON public.generated_shorts TO service_role;

ALTER TABLE public.generated_shorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generated shorts"
  ON public.generated_shorts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated shorts"
  ON public.generated_shorts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated shorts"
  ON public.generated_shorts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated shorts"
  ON public.generated_shorts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX generated_shorts_user_created_idx
  ON public.generated_shorts (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_generated_shorts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_generated_shorts_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_generated_shorts_updated_at() TO service_role;

CREATE TRIGGER set_generated_shorts_updated_at
  BEFORE UPDATE ON public.generated_shorts
  FOR EACH ROW EXECUTE FUNCTION public.set_generated_shorts_updated_at();