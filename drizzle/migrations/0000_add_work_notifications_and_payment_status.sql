ALTER TABLE public.work_applications
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN payment_updated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.work_applications
  ADD CONSTRAINT work_applications_payment_status_check
  CHECK (payment_status IN ('pending', 'processing', 'paid', 'issue'));

CREATE TABLE public.work_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('new_application', 'work_approved', 'work_submitted', 'payment_status')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  job_id UUID REFERENCES public.work_jobs(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.work_applications(id) ON DELETE CASCADE,
  link TEXT NOT NULL DEFAULT '/work/my',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.work_notifications TO authenticated;
GRANT ALL ON public.work_notifications TO service_role;

ALTER TABLE public.work_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own work notifications"
  ON public.work_notifications FOR SELECT TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can mark their own work notifications read"
  ON public.work_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

CREATE INDEX work_notifications_recipient_created_idx
  ON public.work_notifications (recipient_id, created_at DESC);
CREATE INDEX work_notifications_recipient_unread_idx
  ON public.work_notifications (recipient_id, is_read)
  WHERE is_read = false;

CREATE OR REPLACE FUNCTION public.create_work_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job_record public.work_jobs%ROWTYPE;
  payment_label TEXT;
BEGIN
  SELECT * INTO job_record FROM public.work_jobs WHERE id = NEW.job_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.work_notifications (
      recipient_id, event_type, title, message, job_id, application_id
    ) VALUES (
      job_record.client_id,
      'new_application',
      'New application received',
      'A worker applied for “' || job_record.title || '”.',
      NEW.job_id,
      NEW.id
    );
    RETURN NEW;
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'submitted' THEN
    INSERT INTO public.work_notifications (
      recipient_id, event_type, title, message, job_id, application_id
    ) VALUES (
      job_record.client_id,
      'work_submitted',
      'Work submitted for review',
      'Completed work was submitted for “' || job_record.title || '”.',
      NEW.job_id,
      NEW.id
    );
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'approved' THEN
    INSERT INTO public.work_notifications (
      recipient_id, event_type, title, message, job_id, application_id
    ) VALUES (
      NEW.worker_id,
      'work_approved',
      'Work approved',
      'Your completed work for “' || job_record.title || '” was approved.',
      NEW.job_id,
      NEW.id
    );
  END IF;

  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
    payment_label := CASE NEW.payment_status
      WHEN 'processing' THEN 'processing'
      WHEN 'paid' THEN 'paid'
      WHEN 'issue' THEN 'needs attention'
      ELSE 'pending'
    END;

    INSERT INTO public.work_notifications (
      recipient_id, event_type, title, message, job_id, application_id
    ) VALUES (
      NEW.worker_id,
      'payment_status',
      'Payment status updated',
      'Payment for “' || job_record.title || '” is now ' || payment_label || '.',
      NEW.job_id,
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.create_work_notification() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_work_notification() TO service_role;

CREATE TRIGGER notify_work_application_insert
  AFTER INSERT ON public.work_applications
  FOR EACH ROW EXECUTE FUNCTION public.create_work_notification();

CREATE TRIGGER notify_work_application_update
  AFTER UPDATE OF status, payment_status ON public.work_applications
  FOR EACH ROW EXECUTE FUNCTION public.create_work_notification();