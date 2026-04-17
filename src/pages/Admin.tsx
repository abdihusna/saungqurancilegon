import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Lock, Plus, Pencil, Trash2, LogOut, ImagePlus, X, Loader2, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WEBHOOK_BASE = "https://saungqurancilegon.id";
const WEBHOOK_URL = `${WEBHOOK_BASE}/webhook.php`;
const POSTS_URL = `${WEBHOOK_BASE}/posts.php`;
const TOKEN_KEY = "sqc_webhook_token";

interface DynamicPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author?: string;
  tags?: string[];
  image?: string | null;
  gallery?: { src: string; alt: string }[];
  created_at?: string;
  updated_at?: string | null;
}

interface GalleryItem {
  // existingSrc: gambar yang sudah ada di server (saat edit) — dikirim sebagai image_url
  // base64: file baru yang baru di-upload — dikirim sebagai image_base64
  existingSrc?: string;
  base64?: string;
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
  imageBase64: string | null;
  imageUrl: string;
  imagePreview: string | null;
  gallery: GalleryItem[];
}

const emptyForm: FormState = {
  title: "",
  excerpt: "",
  content: "",
  category: "Berita",
  date: "",
  slug: "",
  author: "Admin SQC",
  tagsText: "",
  imageBase64: null,
  imageUrl: "",
  imagePreview: null,
  gallery: [],
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Admin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [posts, setPosts] = useState<DynamicPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DynamicPost | null>(null);

  // Restore token from sessionStorage (cleared on tab close)
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  // Inject noindex meta tag agar Google tidak meng-index halaman /admin
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Admin — Saung Qur'an Cilegon";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  // Fetch posts whenever token is set
  useEffect(() => {
    if (!token) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(POSTS_URL, { cache: "no-store" });
      const data = await res.json();
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch (err) {
      toast.error("Gagal memuat berita", {
        description: "Pastikan webhook.php sudah di-upload ke Hostinger.",
      });
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (trimmed.length < 16) {
      toast.error("Token terlalu pendek", { description: "Minimal 16 karakter." });
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, trimmed);
    setToken(trimmed);
    setTokenInput("");
    toast.success("Berhasil login admin");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setForm(emptyForm);
    setEditingSlug(null);
    toast.info("Logout berhasil");
  };

  const handleImageFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Gambar terlalu besar", { description: "Maks 5 MB." });
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format tidak didukung", { description: "Gunakan JPG, PNG, atau WebP." });
      return;
    }
    const base64 = await fileToBase64(file);
    setForm((f) => ({ ...f, imageBase64: base64, imagePreview: base64, imageUrl: "" }));
  };

  const handleGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} terlalu besar`, { description: "Maks 5 MB per gambar." });
        continue;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name} format tidak didukung`);
        continue;
      }
      const base64 = await fileToBase64(file);
      newItems.push({ base64, preview: base64, alt: "" });
    }
    if (newItems.length) {
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...newItems] }));
    }
  };

  const removeGalleryItem = (idx: number) => {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  };

  const updateGalleryAlt = (idx: number, alt: string) => {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.map((g, i) => (i === idx ? { ...g, alt } : g)),
    }));
  };

  const startEdit = (p: DynamicPost) => {
    setEditingSlug(p.slug);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      date: p.date,
      slug: p.slug,
      author: p.author || "Admin SQC",
      tagsText: (p.tags || []).join(", "),
      imageBase64: null,
      imageUrl: p.image && !p.image.includes("/uploads/news/") ? p.image : "",
      imagePreview: p.image || null,
      gallery: (p.gallery || []).map((g) => ({
        existingSrc: g.src,
        preview: g.src,
        alt: g.alt || "",
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setForm(emptyForm);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title & content wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category.trim() || "Berita",
        author: form.author.trim() || "Admin SQC",
      };
      if (form.excerpt.trim()) body.excerpt = form.excerpt.trim();
      if (form.date.trim()) body.date = form.date.trim();
      if (form.slug.trim()) body.slug = form.slug.trim();
      if (form.tagsText.trim()) {
        body.tags = form.tagsText.split(",").map((t) => t.trim()).filter(Boolean);
      }
      if (form.imageBase64) body.image_base64 = form.imageBase64;
      else if (form.imageUrl.trim()) body.image_url = form.imageUrl.trim();

      const url = editingSlug
        ? `${WEBHOOK_URL}?slug=${encodeURIComponent(editingSlug)}`
        : WEBHOOK_URL;
      const method = editingSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": token,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      toast.success(editingSlug ? "Berita diperbarui" : "Berita dipublish", {
        description: data.url,
      });
      setForm(emptyForm);
      setEditingSlug(null);
      await fetchPosts();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Gagal mengirim", { description: msg });
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        handleLogout();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) return;
    try {
      const res = await fetch(`${WEBHOOK_URL}?slug=${encodeURIComponent(deleteTarget.slug)}`, {
        method: "DELETE",
        headers: { "X-Webhook-Secret": token },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast.success("Berita dihapus");
      setDeleteTarget(null);
      await fetchPosts();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Gagal hapus", { description: msg });
    }
  };

  // ============ LOGIN VIEW ============
  if (!token) {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Berita</CardTitle>
              <CardDescription>
                Masukkan webhook secret untuk publish berita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="token">Webhook Secret</Label>
                  <Input
                    id="token"
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Token rahasia dari webhook.php"
                    autoComplete="off"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Lock className="mr-2 h-4 w-4" /> Masuk
                </Button>
                <Alert>
                  <AlertDescription className="text-xs">
                    Token disimpan di session browser dan otomatis hilang saat tab ditutup. Token sama dengan <code>$WEBHOOK_SECRET</code> di <code>webhook.php</code>.
                  </AlertDescription>
                </Alert>
              </form>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  // ============ ADMIN VIEW ============
  return (
    <Layout>
      <section className="py-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Admin Berita</h1>
              <p className="text-muted-foreground text-sm">
                Publish, edit, dan hapus berita untuk halaman Event
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container grid lg:grid-cols-5 gap-8">
          {/* FORM */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingSlug ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingSlug ? `Edit: ${editingSlug}` : "Berita Baru"}
              </CardTitle>
              {editingSlug && (
                <CardDescription>
                  <Button variant="ghost" size="sm" onClick={cancelEdit} className="px-0 h-auto">
                    ← Batal edit, kembali ke mode baru
                  </Button>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Berita / Kegiatan / Prestasi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="17 April 2026 (kosongkan = hari ini)"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug URL</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="otomatis dari judul"
                      disabled={!!editingSlug}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                  <Input
                    id="tags"
                    value={form.tagsText}
                    onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                    placeholder="tahfidz, santri, prestasi"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Ringkasan (excerpt)</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Auto-generate dari content kalau kosong"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Konten *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={10}
                    required
                    placeholder="Tulis isi berita di sini. Pakai 2x enter untuk paragraf baru, **teks** untuk bold."
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>Gambar Utama</Label>
                  <div className="space-y-3">
                    {form.imagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={form.imagePreview}
                          alt="Preview"
                          className="max-h-40 rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() =>
                            setForm({ ...form, imageBase64: null, imageUrl: "", imagePreview: null })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("image-file")?.click()}
                      >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                      <input
                        id="image-file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageFile(f);
                          e.target.value = "";
                        }}
                      />
                      <Input
                        type="url"
                        placeholder="atau paste URL gambar"
                        value={form.imageUrl}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            imageUrl: e.target.value,
                            imageBase64: null,
                            imagePreview: e.target.value || null,
                          })
                        }
                        className="flex-1 min-w-[200px]"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
                    </>
                  ) : editingSlug ? (
                    <>
                      <Pencil className="mr-2 h-4 w-4" /> Update Berita
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Publish Berita
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* DAFTAR POSTS */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Berita Terpublish ({posts.length})</CardTitle>
                <CardDescription>Klik edit/hapus untuk mengelola</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[800px] overflow-y-auto">
                {loadingPosts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))
                ) : posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Belum ada berita dinamis.
                  </p>
                ) : (
                  posts.map((p) => (
                    <div
                      key={p.slug}
                      className="border rounded-lg p-3 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt=""
                            className="w-16 h-16 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="mb-1 text-xs">
                            {p.category}
                          </Badge>
                          <h3 className="font-medium text-sm line-clamp-2">{p.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => startEdit(p)}
                        >
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Hapus
                        </Button>
                        <a
                          href={`/berita/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto"
                        >
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
            <AlertDialogDescription>
              Berita <strong>"{deleteTarget?.title}"</strong> akan dihapus permanen beserta gambarnya. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
