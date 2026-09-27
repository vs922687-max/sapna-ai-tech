-- The public counter is now read through site_visit_metrics. Individual visit rows
-- must only be written by the trusted visitor-recording server function.
DROP POLICY IF EXISTS "Anyone can record a visit" ON public.site_visits;
REVOKE INSERT ON TABLE public.site_visits FROM anon, authenticated;
GRANT INSERT ON TABLE public.site_visits TO service_role;