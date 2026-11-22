CREATE TABLE public.plan_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_email text,
  plan_name text NOT NULL CHECK (plan_name IN ('Pro', 'Team')),
  amount numeric NOT NULL DEFAULT 0,
  utr_number text NOT NULL CHECK (utr_number ~ '^[0-9]{12}$'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT plan_payments_utr_number_key UNIQUE (utr_number)
);

CREATE INDEX plan_payments_user_id_idx ON public.plan_payments (user_id, created_at DESC);
CREATE INDEX plan_payments_status_idx ON public.plan_payments (status, created_at DESC);

CREATE TABLE public.user_plans (
  user_id uuid PRIMARY KEY,
  plan_name text NOT NULL DEFAULT 'Free' CHECK (plan_name IN ('Free', 'Pro', 'Team')),
  status text NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'pending', 'active')),
  payment_id uuid REFERENCES public.plan_payments(id) ON DELETE SET NULL,
  activated_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.plan_payments TO authenticated;
GRANT UPDATE (status, admin_note) ON public.plan_payments TO authenticated;
GRANT ALL ON public.plan_payments TO service_role;
GRANT SELECT ON public.user_plans TO authenticated;
GRANT ALL ON public.user_plans TO service_role;

ALTER TABLE public.plan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit their own plan payments"
ON public.plan_payments FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND reviewed_at IS NULL
  AND admin_note IS NULL
);

CREATE POLICY "Users can view their own plan payments"
ON public.plan_payments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all plan payments"
ON public.plan_payments FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Admins can review plan payments"
ON public.plan_payments FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Users can view their own plan"
ON public.user_plans FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all plans"
ON public.user_plans FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

-- Server-side amount, payer email and spam limit for every new submission.
CREATE OR REPLACE FUNCTION public.prepare_plan_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.amount := CASE NEW.plan_name WHEN 'Pro' THEN 499 WHEN 'Team' THEN 1499 END;
  NEW.utr_number := btrim(NEW.utr_number);
  SELECT u.email INTO NEW.user_email FROM auth.users u WHERE u.id = NEW.user_id;
  IF (SELECT count(*) FROM public.plan_payments p WHERE p.user_id = NEW.user_id AND p.status = 'pending') >= 3 THEN
    RAISE EXCEPTION 'Too many payments are waiting for verification';
  END IF;
  RETURN NEW;
END;
$$;

-- Only a pending payment can be reviewed, and only once.
CREATE OR REPLACE FUNCTION public.validate_plan_payment_review()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF OLD.status <> 'pending' OR NEW.status NOT IN ('approved', 'rejected') THEN
      RAISE EXCEPTION 'Only pending payments can be approved or rejected';
    END IF;
    NEW.reviewed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

-- Keep each user's plan in step with their payments.
CREATE OR REPLACE FUNCTION public.sync_user_plan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
      SET plan_name = 'Free', status = 'free', payment_id = NULL, updated_at = now()
      WHERE user_id = NEW.user_id AND payment_id = NEW.id AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prepare_plan_payment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_plan() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_plan_payment_review() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER prepare_plan_payment_before_insert
BEFORE INSERT ON public.plan_payments
FOR EACH ROW EXECUTE FUNCTION public.prepare_plan_payment();

CREATE TRIGGER validate_plan_payment_review_before_update
BEFORE UPDATE ON public.plan_payments
FOR EACH ROW EXECUTE FUNCTION public.validate_plan_payment_review();

CREATE TRIGGER sync_user_plan_after_change
AFTER INSERT OR UPDATE ON public.plan_payments
FOR EACH ROW EXECUTE FUNCTION public.sync_user_plan();