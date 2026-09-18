REVOKE SELECT ON TABLE public.site_visits FROM anon, authenticated;

DROP POLICY IF EXISTS "Anyone can read visit count" ON public.site_visits;

CREATE OR REPLACE FUNCTION public.get_site_visit_count()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::BIGINT FROM public.site_visits;
$$;

REVOKE ALL ON FUNCTION public.get_site_visit_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_visit_count() TO anon, authenticated;

DROP POLICY IF EXISTS "No direct work notification creation" ON public.work_notifications;
CREATE POLICY "No direct work notification creation"
  ON public.work_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

REVOKE INSERT ON TABLE public.work_notifications FROM anon, authenticated;