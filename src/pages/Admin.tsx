import { useEffect, useState, useCallback } from "react";
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
import { Lock, Plus, Pencil, Trash2, LogOut, ImagePlus, X, Loader2, ExternalLink, Download, KeyRound, Calendar, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface NewsRow {
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
  scheduledPublishAt: string; // datetime-local value, "" if none
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
  imageFile: null,
  imageUrl: "",
  imagePreview: null,
  gallery: [],
  published: true,
  scheduledPublishAt: "",
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "news-images";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `post-${Date.now()}`;

const formatDateID = (iso?: string | null) => {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const uploadToStorage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [posts, setPosts] = useState<NewsRow[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsRow | null>(null);
  const [importing, setImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // ====== AUTH ======
  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setIsAdmin(false);
      }
    });
    // THEN getSession
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Check admin role whenever session changes
  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        console.error("Role check failed:", error);
      }
      setIsAdmin(!!data);
    })();
  }, [session]);

  // Inject noindex
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

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) {
      toast.error("Gagal memuat berita", { description: error.message });
      setPosts([]);
    } else {
      setPosts((data ?? []) as unknown as NewsRow[]);
    }
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchPosts();
  }, [isAdmin, fetchPosts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email & password wajib");
      return;
    }
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoggingIn(false);
    if (error) {
      toast.error("Login gagal", { description: error.message });
      return;
    }
    setPassword("");
    toast.success("Berhasil login");
  };

  const handleForgotPassword = async () => {
    const target = email.trim();
    if (!target) {
      toast.error("Isi email dulu", { description: "Tulis email admin di kolom email lalu klik 'Lupa Password'." });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error("Gagal kirim email reset", { description: error.message });
      return;
    }
    toast.success("Email reset dikirim", { description: `Cek inbox ${target} untuk link reset password.` });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setForm(emptyForm);
    setEditingId(null);
    toast.info("Logout berhasil");
  };

  const validateImage = (file: File): boolean => {
    if (file.size > MAX_BYTES) {
      toast.error(`${file.name} terlalu besar`, { description: "Maks 5 MB." });
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name} format tidak didukung`, { description: "JPG/PNG/WebP." });
      return false;
    }
    return true;
  };

  const handleImageFile = (file: File) => {
    if (!validateImage(file)) return;
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: preview, imageUrl: "" }));
  };

  const handleGalleryFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const items: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      if (!validateImage(file)) continue;
      items.push({ file, preview: URL.createObjectURL(file), alt: "" });
    }
    if (items.length) setForm((f) => ({ ...f, gallery: [...f.gallery, ...items] }));
  };

  const removeGalleryItem = (idx: number) =>
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));

  const updateGalleryAlt = (idx: number, alt: string) =>
    setForm((f) => ({
      ...f,
      gallery: f.gallery.map((g, i) => (i === idx ? { ...g, alt } : g)),
    }));

  const startEdit = (p: NewsRow) => {
    setEditingId(p.id);
    // Convert ISO to datetime-local format (YYYY-MM-DDTHH:mm)
    const toLocal = (iso: string | null) => {
      if (!iso) return "";
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setForm({
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content,
      category: p.category,
      date: p.date_label ?? "",
      slug: p.slug,
      author: p.author,
      tagsText: (p.tags ?? []).join(", "),
      imageFile: null,
      imageUrl: "",
      imagePreview: p.image_url ?? null,
      gallery: (p.gallery ?? []).map((g) => ({
        existingSrc: g.src,
        preview: g.src,
        alt: g.alt ?? "",
      })),
      published: p.published,
      scheduledPublishAt: toLocal(p.scheduled_publish_at),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Judul & konten wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload main image jika file baru
      let imageUrl: string | null = form.imagePreview;
      if (form.imageFile) {
        imageUrl = await uploadToStorage(form.imageFile);
      } else if (form.imageUrl.trim()) {
        imageUrl = form.imageUrl.trim();
      } else if (!form.imagePreview) {
        imageUrl = null;
      }

      // 2. Upload gallery files baru
      const galleryFinal: { src: string; alt: string }[] = [];
      for (const g of form.gallery) {
        let src = g.existingSrc;
        if (g.file) src = await uploadToStorage(g.file);
        if (src) galleryFinal.push({ src, alt: g.alt || "" });
      }

      // Resolve scheduled date
      const scheduledIso = form.scheduledPublishAt
        ? new Date(form.scheduledPublishAt).toISOString()
        : null;
      const isScheduledFuture = !!scheduledIso && new Date(scheduledIso).getTime() > Date.now();
      // If a future schedule is set, force draft. Otherwise honor switch.
      const finalPublished = isScheduledFuture ? false : form.published;

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim() || form.content.trim().slice(0, 200) + "...",
        content: form.content.trim(),
        category: form.category.trim() || "Berita",
        date_label: form.date.trim() || formatDateID(),
        author: form.author.trim() || "Admin SQC",
        tags: form.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        image_url: imageUrl,
        gallery: galleryFinal,
        published: finalPublished,
        scheduled_publish_at: isScheduledFuture ? scheduledIso : null,
      };

      if (editingId) {
        const { error } = await supabase.from("news").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success(
          isScheduledFuture
            ? "Berita dijadwalkan"
            : finalPublished
              ? "Berita diperbarui & published"
              : "Berita diperbarui (draft)",
        );
      } else {
        const { error } = await supabase.from("news").insert({
          ...payload,
          created_by: session!.user.id,
          published_at: finalPublished ? new Date().toISOString() : scheduledIso,
        });
        if (error) throw error;
        toast.success(
          isScheduledFuture
            ? `Dijadwalkan publish ${new Date(scheduledIso!).toLocaleString("id-ID")}`
            : finalPublished
              ? "Berita dipublish"
              : "Disimpan sebagai draft",
          { description: `/berita/${payload.slug}` },
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchPosts();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Gagal simpan", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("news").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Gagal hapus", { description: error.message });
      return;
    }
    toast.success("Berita dihapus");
    setDeleteTarget(null);
    await fetchPosts();
  };

  const importFromHostinger = async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-hostinger-posts");
      if (error) throw error;
      toast.success("Import selesai", {
        description: `${data?.imported ?? 0} berita ditambahkan, ${data?.skipped ?? 0} dilewati (slug sudah ada)`,
      });
      await fetchPosts();
      setImportDialogOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Import gagal", { description: msg });
    } finally {
      setImporting(false);
    }
  };

  // ============ LOADING / LOGIN VIEW ============
  if (authChecking) {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </section>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Berita</CardTitle>
              <CardDescription>Masuk dengan akun admin SQC</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@saungqurancilegon.id"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loggingIn}>
                  {loggingIn ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</>
                  ) : (
                    <><Lock className="mr-2 h-4 w-4" /> Masuk</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleForgotPassword}
                >
                  <KeyRound className="mr-2 h-3 w-3" /> Lupa Password?
                </Button>
                <Alert>
                  <AlertDescription className="text-xs">
                    Akses hanya untuk admin yang sudah terdaftar. Hubungi pengurus jika butuh akses.
                  </AlertDescription>
                </Alert>
              </form>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center py-16">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Akses Ditolak</CardTitle>
              <CardDescription>Akun Anda tidak memiliki peran admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Admin Berita</h1>
              <p className="text-muted-foreground text-sm">
                Login sebagai <strong>{session.user.email}</strong>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/ganti-password">
                  <KeyRound className="mr-2 h-4 w-4" /> Ganti Password
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                <Download className="mr-2 h-4 w-4" /> Import dari Hostinger
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container grid lg:grid-cols-5 gap-8">
          {/* FORM */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingId ? `Edit: ${form.slug}` : "Berita Baru"}
              </CardTitle>
              {editingId && (
                <CardDescription>
                  <Button variant="ghost" size="sm" onClick={cancelEdit} className="px-0 h-auto">
                    ← Batal edit
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
                      placeholder="17 April 2026"
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
                      disabled={!!editingId}
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
                    placeholder="Auto dari konten kalau kosong"
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
                            setForm({ ...form, imageFile: null, imageUrl: "", imagePreview: null })
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
                        <ImagePlus className="mr-2 h-4 w-4" /> Upload File
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
                            imageFile: null,
                            imagePreview: e.target.value || null,
                          })
                        }
                        className="flex-1 min-w-[200px]"
                      />
                    </div>
                  </div>
                </div>

                {/* GALLERY */}
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
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 opacity-90"
                                onClick={() => removeGalleryItem(idx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              {g.existingSrc && !g.file && (
                                <Badge variant="secondary" className="absolute bottom-1 left-1 text-[10px] h-4 px-1">
                                  tersimpan
                                </Badge>
                              )}
                            </div>
                            <Input
                              value={g.alt}
                              onChange={(e) => updateGalleryAlt(idx, e.target.value)}
                              placeholder="Caption / alt"
                              className="h-7 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("gallery-files")?.click()}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" /> Tambah Foto Gallery (multi-select)
                    </Button>
                    <input
                      id="gallery-files"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleGalleryFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>


                {/* PUBLISH / SCHEDULE */}
                <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published" className="flex items-center gap-2">
                        {form.published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        Status
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {form.published ? "Published — tampil di /event" : "Draft — tersembunyi"}
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={form.published}
                      onCheckedChange={(v) => setForm({ ...form, published: v, scheduledPublishAt: v ? form.scheduledPublishAt : form.scheduledPublishAt })}
                      disabled={!!form.scheduledPublishAt && new Date(form.scheduledPublishAt).getTime() > Date.now()}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduled" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Jadwalkan Publish (opsional)
                    </Label>
                    <Input
                      id="scheduled"
                      type="datetime-local"
                      value={form.scheduledPublishAt}
                      onChange={(e) => setForm({ ...form, scheduledPublishAt: e.target.value })}
                      className="mt-1"
                    />
                    {form.scheduledPublishAt && new Date(form.scheduledPublishAt).getTime() > Date.now() && (
                      <p className="text-xs text-primary mt-1">
                        Akan auto-publish: {new Date(form.scheduledPublishAt).toLocaleString("id-ID")}
                      </p>
                    )}
                    {form.scheduledPublishAt && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs mt-1"
                        onClick={() => setForm({ ...form, scheduledPublishAt: "" })}
                      >
                        <X className="h-3 w-3 mr-1" /> Hapus jadwal
                      </Button>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                  ) : editingId ? (
                    <><Pencil className="mr-2 h-4 w-4" /> Update Berita</>
                  ) : form.scheduledPublishAt && new Date(form.scheduledPublishAt).getTime() > Date.now() ? (
                    <><Calendar className="mr-2 h-4 w-4" /> Jadwalkan Berita</>
                  ) : form.published ? (
                    <><Plus className="mr-2 h-4 w-4" /> Publish Berita</>
                  ) : (
                    <><Plus className="mr-2 h-4 w-4" /> Simpan sebagai Draft</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* DAFTAR POSTS */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Berita ({posts.length})</CardTitle>
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
                    Belum ada berita. Buat berita baru atau import dari Hostinger.
                  </p>
                ) : (
                  posts.map((p) => (
                    <div key={p.id} className="border rounded-lg p-3 hover:bg-accent/30 transition-colors">
                      <div className="flex items-start gap-3">
                        {p.image_url && (
                          <img src={p.image_url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="mb-1 text-xs">{p.category}</Badge>
                          <h3 className="font-medium text-sm line-clamp-2">{p.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{p.date_label}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => startEdit(p)}>
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
                        <a href={`/berita/${p.slug}`} target="_blank" rel="noopener noreferrer" className="ml-auto">
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
              Berita <strong>"{deleteTarget?.title}"</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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

      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import berita dari Hostinger?</AlertDialogTitle>
            <AlertDialogDescription>
              Sistem akan fetch <code>posts.php</code> di saungqurancilegon.id, download semua gambar ke storage Lovable, lalu insert ke database. Slug yang sudah ada akan dilewati. Aman dijalankan berkali-kali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={importFromHostinger} disabled={importing}>
              {importing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengimport...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Mulai Import</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
