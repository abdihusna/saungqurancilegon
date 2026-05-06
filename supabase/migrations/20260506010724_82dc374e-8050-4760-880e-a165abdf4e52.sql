-- Tabel pengumuman terpisah dari news
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Pengumuman',
  date_label TEXT,
  author TEXT NOT NULL DEFAULT 'Admin SQC',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  scheduled_publish_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published announcements"
  ON public.announcements FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can read all announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger sinkron ke Hostinger (reuse pattern news, target endpoint terpisah)
CREATE OR REPLACE FUNCTION public.notify_hostinger_announcement_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  payload jsonb;
  edge_url text := 'https://xkppbrevqrdrgykjlfrw.supabase.co/functions/v1/sync-announcement-to-hostinger';
BEGIN
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

CREATE TRIGGER trg_notify_hostinger_announcement_change
  AFTER INSERT OR UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.notify_hostinger_announcement_change();

CREATE INDEX idx_announcements_published ON public.announcements(published, published_at DESC);
CREATE INDEX idx_announcements_category ON public.announcements(category);
CREATE INDEX idx_announcements_slug ON public.announcements(slug);