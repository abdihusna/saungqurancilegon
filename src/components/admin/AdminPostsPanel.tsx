import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, ImagePlus, X, Loader2, ExternalLink, Calendar, Eye, EyeOff,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

type TableName = "news" | "announcements";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  date_label: string | null;
  author: string;
  tags: string[];
  image_url: string | null;
  gallery: { src: string; alt: string }[];
  published: boolean;
  published_at: string | null;
  scheduled_publish_at: string | null;
  created_at: string;
}

interface GalleryItem {
  existingSrc?: string;
  file?: File;
  preview: string;
  alt: string;
}

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  slug: string;
  author: string;
  tagsText: string;
  imageFile: File | null;
  imageUrl: string;
  imagePreview: string | null;
  gallery: GalleryItem[];
  published: boolean;
  scheduledPublishAt: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "news-images";

const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `post-${Date.now()}`;

const formatDateID = () =>
  new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const uploadToStorage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

interface Props {
  table: TableName;
  defaultCategory: string;
  detailPathPrefix: string; // e.g. "/berita" or "/pengumuman"
  labelSingular: string; // "Berita" / "Pengumuman"
  userId: string;
}

const emptyForm = (defaultCategory: string): FormState => ({
  title: "", excerpt: "", content: "", category: defaultCategory,
  date: "", slug: "", author: "Admin SQC", tagsText: "",
  imageFile: null, imageUrl: "", imagePreview: null, gallery: [],
  published: true, scheduledPublishAt: "",
});

export const AdminPostsPanel = ({ table, defaultCategory, detailPathPrefix, labelSingular, userId }: Props) => {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(defaultCategory));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("published_at", { ascending: false });
    if (error) {
      toast.error(`Gagal memuat ${labelSingular.toLowerCase()}`, { description: error.message });
      setPosts([]);
    } else {
      setPosts((data ?? []) as unknown as PostRow[]);
    }
    setLoading(false);
  }, [table, labelSingular]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const validateImage = (file: File): boolean => {
    if (file.size > MAX_BYTES) { toast.error(`${file.name} terlalu besar`, { description: "Maks 5 MB." }); return false; }
    if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`${file.name} format tidak didukung`); return false; }
    return true;
  };

  const handleImageFile = (file: File) => {
    if (!validateImage(file)) return;
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file), imageUrl: "" }));
  };

  const handleGalleryFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const items: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      if (!validateImage(file)) continue;
      items.push({ file, preview: URL.createObjectURL(file), alt: "" });
    }
    if (items.length) setForm((f) => ({ ...f, gallery: [...f.gallery, ...items] }));
  };

  const startEdit = (p: PostRow) => {
    setEditingId(p.id);
    const toLocal = (iso: string | null) => {
      if (!iso) return "";
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setForm({
      title: p.title, excerpt: p.excerpt ?? "", content: p.content, category: p.category,
      date: p.date_label ?? "", slug: p.slug, author: p.author, tagsText: (p.tags ?? []).join(", "),
      imageFile: null, imageUrl: "", imagePreview: p.image_url ?? null,
      gallery: (p.gallery ?? []).map((g) => ({ existingSrc: g.src, preview: g.src, alt: g.alt ?? "" })),
      published: p.published, scheduledPublishAt: toLocal(p.scheduled_publish_at),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyForm(defaultCategory)); };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Judul & konten wajib diisi"); return;
    }
    setSubmitting(true);
    try {
      let imageUrl: string | null = form.imagePreview;
      if (form.imageFile) imageUrl = await uploadToStorage(form.imageFile);
      else if (form.imageUrl.trim()) imageUrl = form.imageUrl.trim();
      else if (!form.imagePreview) imageUrl = null;

      const galleryFinal: { src: string; alt: string }[] = [];
      for (const g of form.gallery) {
        let src = g.existingSrc;
        if (g.file) src = await uploadToStorage(g.file);
        if (src) galleryFinal.push({ src, alt: g.alt || "" });
      }

      const scheduledIso = form.scheduledPublishAt ? new Date(form.scheduledPublishAt).toISOString() : null;
      const isScheduledFuture = !!scheduledIso && new Date(scheduledIso).getTime() > Date.now();
      const finalPublished = isScheduledFuture ? false : form.published;

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim() || form.content.trim().slice(0, 200) + "...",
        content: form.content.trim(),
        category: form.category.trim() || defaultCategory,
        date_label: form.date.trim() || formatDateID(),
        author: form.author.trim() || "Admin SQC",
        tags: form.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        image_url: imageUrl,
        gallery: galleryFinal,
        published: finalPublished,
        scheduled_publish_at: isScheduledFuture ? scheduledIso : null,
      };

      if (editingId) {
        const { error } = await supabase.from(table).update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success(`${labelSingular} diperbarui`);
      } else {
        const { error } = await supabase.from(table).insert({
          ...payload,
          created_by: userId,
          published_at: finalPublished ? new Date().toISOString() : scheduledIso,
        });
        if (error) throw error;
        toast.success(isScheduledFuture ? `Dijadwalkan publish ${new Date(scheduledIso!).toLocaleString("id-ID")}` : finalPublished ? `${labelSingular} dipublish` : "Disimpan sebagai draft");
      }

      setForm(emptyForm(defaultCategory));
      setEditingId(null);
      await fetchPosts();
    } catch (err) {
      toast.error("Gagal simpan", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal hapus", { description: error.message }); return; }
    toast.success(`${labelSingular} dihapus`);
    setDeleteTarget(null);
    await fetchPosts();
  };

  const fieldId = (s: string) => `${table}-${s}`;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? `Edit: ${form.slug}` : `${labelSingular} Baru`}
          </CardTitle>
          {editingId && (
            <CardDescription>
              <Button variant="ghost" size="sm" onClick={cancelEdit} className="px-0 h-auto">← Batal edit</Button>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <Label htmlFor={fieldId("title")}>Judul *</Label>
              <Input id={fieldId("title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={fieldId("category")}>Kategori</Label>
                <Input id={fieldId("category")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label htmlFor={fieldId("date")}>Tanggal</Label>
                <Input id={fieldId("date")} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="17 April 2026" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={fieldId("author")}>Author</Label>
                <Input id={fieldId("author")} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <Label htmlFor={fieldId("slug")}>Slug URL</Label>
                <Input id={fieldId("slug")} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="otomatis dari judul" disabled={!!editingId} />
              </div>
            </div>
            <div>
              <Label htmlFor={fieldId("tags")}>Tags (pisahkan dengan koma)</Label>
              <Input id={fieldId("tags")} value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} />
            </div>
            <div>
              <Label htmlFor={fieldId("excerpt")}>Ringkasan</Label>
              <Textarea id={fieldId("excerpt")} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Auto dari konten kalau kosong" />
            </div>
            <div>
              <Label htmlFor={fieldId("content")}>Konten *</Label>
              <Textarea id={fieldId("content")} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} required className="font-mono text-sm" />
            </div>
            <div>
              <Label>Gambar Utama</Label>
              <div className="space-y-3">
                {form.imagePreview && (
                  <div className="relative inline-block">
                    <img src={form.imagePreview} alt="Preview" className="max-h-40 rounded-lg border" />
                    <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6" onClick={() => setForm({ ...form, imageFile: null, imageUrl: "", imagePreview: null })}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(fieldId("image-file"))?.click()}>
                    <ImagePlus className="mr-2 h-4 w-4" /> Upload File
                  </Button>
                  <input id={fieldId("image-file")} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }} />
                  <Input type="url" placeholder="atau paste URL gambar" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value, imageFile: null, imagePreview: e.target.value || null })} className="flex-1 min-w-[200px]" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Gallery Foto ({form.gallery.length})</Label>
                <span className="text-xs text-muted-foreground">Maks 5 MB / foto</span>
              </div>
              <div className="space-y-3">
                {form.gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.gallery.map((g, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                          <img src={g.preview} alt={g.alt || `Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 opacity-90" onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }))}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input value={g.alt} onChange={(e) => setForm((f) => ({ ...f, gallery: f.gallery.map((gg, i) => i === idx ? { ...gg, alt: e.target.value } : gg) }))} placeholder="Caption / alt" className="h-7 text-xs" />
                      </div>
                    ))}
                  </div>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(fieldId("gallery-files"))?.click()}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Tambah Foto Gallery
                </Button>
                <input id={fieldId("gallery-files")} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { handleGalleryFiles(e.target.files); e.target.value = ""; }} />
              </div>
            </div>
            <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor={fieldId("published")} className="flex items-center gap-2">
                    {form.published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    Status
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{form.published ? "Published" : "Draft — tersembunyi"}</p>
                </div>
                <Switch id={fieldId("published")} checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} disabled={!!form.scheduledPublishAt && new Date(form.scheduledPublishAt).getTime() > Date.now()} />
              </div>
              <div>
                <Label htmlFor={fieldId("sched")} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Jadwalkan Publish (opsional)
                </Label>
                <Input id={fieldId("sched")} type="datetime-local" value={form.scheduledPublishAt} onChange={(e) => setForm({ ...form, scheduledPublishAt: e.target.value })} className="mt-1" />
                {form.scheduledPublishAt && (
                  <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs mt-1" onClick={() => setForm({ ...form, scheduledPublishAt: "" })}>
                    <X className="h-3 w-3 mr-1" /> Hapus jadwal
                  </Button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : editingId ? <><Pencil className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Simpan</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{labelSingular} ({posts.length})</CardTitle>
            <CardDescription>Klik edit/hapus untuk mengelola</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[800px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : posts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada {labelSingular.toLowerCase()}.</p>
            ) : (
              posts.map((p) => (
                <div key={p.id} className="border rounded-lg p-3 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start gap-3">
                    {p.image_url && <img src={p.image_url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1 mb-1">
                        <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                        {p.scheduled_publish_at && new Date(p.scheduled_publish_at).getTime() > Date.now() ? (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(p.scheduled_publish_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </Badge>
                        ) : p.published ? (
                          <Badge variant="default" className="text-xs"><Eye className="h-3 w-3 mr-1" /> Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs"><EyeOff className="h-3 w-3 mr-1" /> Draft</Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.date_label}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => startEdit(p)}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Hapus
                    </Button>
                    <a href={`${detailPathPrefix}/${p.slug}`} target="_blank" rel="noopener noreferrer" className="ml-auto">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"><ExternalLink className="h-3 w-3" /></Button>
                    </a>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {labelSingular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deleteTarget?.title}"</strong> akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
