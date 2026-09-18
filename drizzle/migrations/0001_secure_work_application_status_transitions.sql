CREATE OR REPLACE FUNCTION public.validate_work_application_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  actor UUID := auth.uid();
  owner_id UUID;
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  SELECT client_id INTO owner_id FROM public.work_jobs WHERE id = OLD.job_id;

  IF NEW.job_id IS DISTINCT FROM OLD.job_id OR NEW.worker_id IS DISTINCT FROM OLD.worker_id THEN
    RAISE EXCEPTION 'Application ownership cannot be changed';
  END IF;

  IF actor = OLD.worker_id THEN
    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status
      OR NEW.payment_updated_at IS DISTINCT FROM OLD.payment_updated_at
      OR NEW.cover_note IS DISTINCT FROM OLD.cover_note
      OR NEW.quote_inr IS DISTINCT FROM OLD.quote_inr THEN
      RAISE EXCEPTION 'Workers cannot change approval or payment details';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status
      AND NOT (OLD.status = 'accepted' AND NEW.status = 'submitted') THEN
      RAISE EXCEPTION 'Invalid worker status change';
    END IF;
  ELSIF actor = owner_id THEN
    IF NEW.submission_note IS DISTINCT FROM OLD.submission_note
      OR NEW.submission_url IS DISTINCT FROM OLD.submission_url
      OR NEW.cover_note IS DISTINCT FROM OLD.cover_note
      OR NEW.quote_inr IS DISTINCT FROM OLD.quote_inr THEN
      RAISE EXCEPTION 'Clients cannot change worker submission details';
    END IF;
    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status AND NEW.status <> 'approved' THEN
      RAISE EXCEPTION 'Payment status can only change after work approval';
    END IF;
  ELSE
    RAISE EXCEPTION 'Not authorized to update this application';
  END IF;

  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    NEW.payment_updated_at := now();
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_work_application_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_work_application_update() TO service_role;

CREATE TRIGGER validate_work_application_update
  BEFORE UPDATE ON public.work_applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_work_application_update();