CREATE OR REPLACE VIEW public.site_visit_totals
WITH (security_barrier = true)
AS
SELECT count(*)::BIGINT AS total
FROM public.site_visits;

REVOKE ALL ON TABLE public.site_visit_totals FROM PUBLIC;
GRANT SELECT ON TABLE public.site_visit_totals TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_site_visit_count() FROM PUBLIC, anon, authenticated;