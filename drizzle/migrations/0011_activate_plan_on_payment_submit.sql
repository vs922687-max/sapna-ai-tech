CREATE OR REPLACE FUNCTION public.sync_user_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_plans (user_id, plan_name, status, payment_id, activated_at, expires_at)
    VALUES (NEW.user_id, NEW.plan_name, 'active', NEW.id, now(), now() + interval '30 days')
    ON CONFLICT (user_id) DO UPDATE
      SET plan_name = EXCLUDED.plan_name,
          status = 'active',
          payment_id = EXCLUDED.payment_id,
          activated_at = EXCLUDED.activated_at,
          expires_at = EXCLUDED.expires_at,
          updated_at = now();
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'rejected' THEN
    UPDATE public.user_plans
      SET plan_name = 'Free', status = 'free', payment_id = NULL,
          activated_at = NULL, expires_at = NULL, updated_at = now()
      WHERE user_id = NEW.user_id AND payment_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_user_plan() FROM PUBLIC, anon, authenticated;

COMMENT ON COLUMN public.user_plans.status IS 'free or active; pending is no longer used because plans activate on UTR submission';