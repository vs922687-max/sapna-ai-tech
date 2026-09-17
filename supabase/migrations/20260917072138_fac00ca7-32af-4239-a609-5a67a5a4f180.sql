CREATE TABLE public.work_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_inr NUMERIC NOT NULL DEFAULT 0,
  deadline DATE,
  requirements TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  contact_note TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX work_jobs_category_idx ON public.work_jobs (category);
CREATE INDEX work_jobs_created_idx ON public.work_jobs (created_at DESC);

GRANT SELECT ON public.work_jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.work_jobs TO authenticated;
GRANT ALL ON public.work_jobs TO service_role;

ALTER TABLE public.work_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open jobs are viewable by everyone"
  ON public.work_jobs FOR SELECT
  USING (status = 'open');

CREATE POLICY "Clients can view their own jobs"
  ON public.work_jobs FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create their own jobs"
  ON public.work_jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own jobs"
  ON public.work_jobs FOR UPDATE TO authenticated
  USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can delete their own jobs"
  ON public.work_jobs FOR DELETE TO authenticated
  USING (auth.uid() = client_id);

CREATE TABLE public.work_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.work_jobs (id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  cover_note TEXT NOT NULL,
  quote_inr NUMERIC,
  status TEXT NOT NULL DEFAULT 'submitted',
  submission_url TEXT,
  submission_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (job_id, worker_id)
);

CREATE INDEX work_applications_job_idx ON public.work_applications (job_id);
CREATE INDEX work_applications_worker_idx ON public.work_applications (worker_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.work_applications TO authenticated;
GRANT ALL ON public.work_applications TO service_role;

ALTER TABLE public.work_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their own applications"
  ON public.work_applications FOR SELECT TO authenticated
  USING (auth.uid() = worker_id);

CREATE POLICY "Clients can view applications on their jobs"
  ON public.work_applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.work_jobs j WHERE j.id = job_id AND j.client_id = auth.uid()));

CREATE POLICY "Workers can apply"
  ON public.work_applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can update their own applications"
  ON public.work_applications FOR UPDATE TO authenticated
  USING (auth.uid() = worker_id) WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Clients can update applications on their jobs"
  ON public.work_applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.work_jobs j WHERE j.id = job_id AND j.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.work_jobs j WHERE j.id = job_id AND j.client_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_work_jobs_updated_at BEFORE UPDATE ON public.work_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_work_applications_updated_at BEFORE UPDATE ON public.work_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();