-- Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add scheduled publish field
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_news_scheduled
  ON public.news (scheduled_publish_at)
  WHERE published = false AND scheduled_publish_at IS NOT NULL;

-- Auto-publish function (security definer to bypass RLS for server-side cron)
CREATE OR REPLACE FUNCTION public.auto_publish_scheduled_news()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.news
  SET published = true,
      published_at = COALESCE(published_at, scheduled_publish_at, now()),
      scheduled_publish_at = NULL
  WHERE published = false
    AND scheduled_publish_at IS NOT NULL
    AND scheduled_publish_at <= now();
END;
$$;

-- Schedule cron every minute (idempotent: unschedule existing first)
DO $$
DECLARE
  job_id BIGINT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'auto-publish-scheduled-news';
  IF job_id IS NOT NULL THEN
    PERFORM cron.unschedule(job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'auto-publish-scheduled-news',
  '* * * * *',
  $$ SELECT public.auto_publish_scheduled_news(); $$
);