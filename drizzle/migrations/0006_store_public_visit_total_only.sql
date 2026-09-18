CREATE TABLE public.site_visit_metrics (
  singleton BOOLEAN PRIMARY KEY DEFAULT true CHECK (singleton),
  total BIGINT NOT NULL DEFAULT 0 CHECK (total >= 0)
);

GRANT SELECT ON TABLE public.site_visit_metrics TO anon, authenticated;
GRANT ALL ON TABLE public.site_visit_metrics TO service_role;

ALTER TABLE public.site_visit_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read aggregate visit total"
  ON public.site_visit_metrics
  FOR SELECT
  TO anon, authenticated
  USING (singleton = true);

INSERT INTO public.site_visit_metrics (singleton, total)
SELECT true, count(*)::BIGINT FROM public.site_visits
ON CONFLICT (singleton) DO UPDATE SET total = EXCLUDED.total;

CREATE OR REPLACE FUNCTION public.increment_site_visit_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.site_visit_metrics
  SET total = total + 1
  WHERE singleton = true;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_site_visit_total() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_site_visit_total() TO service_role;

CREATE TRIGGER increment_site_visit_total_after_insert
  AFTER INSERT ON public.site_visits
  FOR EACH ROW EXECUTE FUNCTION public.increment_site_visit_total();

REVOKE ALL ON TABLE public.site_visit_totals FROM PUBLIC, anon, authenticated;