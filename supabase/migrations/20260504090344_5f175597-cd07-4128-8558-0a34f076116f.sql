DROP TRIGGER IF EXISTS trg_notify_hostinger_news_change ON public.news;
CREATE TRIGGER trg_notify_hostinger_news_change
AFTER INSERT OR UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.notify_hostinger_news_change();