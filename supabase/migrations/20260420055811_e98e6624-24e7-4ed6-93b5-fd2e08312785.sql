-- Enable pg_net for async HTTP from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: forward news change ke edge function
CREATE OR REPLACE FUNCTION public.notify_hostinger_news_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  payload jsonb;
  edge_url text := 'https://xkppbrevqrdrgykjlfrw.supabase.co/functions/v1/sync-news-to-hostinger';
BEGIN
  -- Hanya forward kalau published = true
  IF NEW.published IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', to_jsonb(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END
  );

  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Drop dulu kalau sudah ada
DROP TRIGGER IF EXISTS news_sync_to_hostinger ON public.news;

CREATE TRIGGER news_sync_to_hostinger
AFTER INSERT OR UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.notify_hostinger_news_change();