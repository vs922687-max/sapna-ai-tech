DROP POLICY IF EXISTS "Workers can apply" ON public.work_applications;

CREATE POLICY "Workers can apply"
ON public.work_applications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = worker_id
  AND status = 'applied'
  AND payment_status = 'pending'
  AND payment_updated_at IS NULL
  AND submission_url IS NULL
  AND submission_note IS NULL
  AND EXISTS (
    SELECT 1 FROM public.work_jobs j
    WHERE j.id = work_applications.job_id
      AND j.status = 'open'
      AND j.client_id <> auth.uid()
  )
);