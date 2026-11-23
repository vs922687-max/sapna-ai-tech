CREATE OR REPLACE FUNCTION public.sync_user_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- A submitted UTR is only a claim: record it as pending, never active.
    INSERT INTO public.user_plans (user_id, plan_name, status, payment_id)
    VALUES (NEW.user_id, NEW.plan_name, 'pending', NEW.id)
    ON CONFLICT (user_id) DO UPDATE
      SET plan_name = EXCLUDED.plan_name,
          status = 'pending',
          payment_id = EXCLUDED.payment_id,
          activated_at = NULL,
          expires_at = NULL,
          updated_at = now()
      WHERE public.user_plans.status <> 'active'
         OR public.user_plans.expires_at < now();
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'approved' THEN
    INSERT INTO public.user_plans (user_id, plan_name, status, payment_id, activated_at, expires_at)
    VALUES (NEW.user_id, NEW.plan_name, 'active', NEW.id, now(), now() + interval '30 days')
    ON CONFLICT (user_id) DO UPDATE
      SET plan_name = EXCLUDED.plan_name,
          status = 'active',
          payment_id = EXCLUDED.payment_id,
          activated_at = EXCLUDED.activated_at,
          expires_at = EXCLUDED.expires_at,
          updated_at = now();
  ELSIF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'rejected' THEN
    UPDATE public.user_plans
      SET plan_name = 'Free', status = 'free', payment_id = NULL,
          activated_at = NULL, expires_at = NULL, updated_at = now()
      WHERE user_id = NEW.user_id AND payment_id = NEW.id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_user_plan() FROM PUBLIC, anon, authenticated;

-- Revoke any plan that was switched on from a payment nobody has verified yet.
UPDATE public.user_plans u
   SET status = 'pending', activated_at = NULL, expires_at = NULL, updated_at = now()
  FROM public.plan_payments p
 WHERE p.id = u.payment_id AND p.status = 'pending' AND u.status = 'active';

COMMENT ON COLUMN public.user_plans.status IS 'free, pending (UTR submitted, awaiting admin verification) or active (admin marked payment received)';