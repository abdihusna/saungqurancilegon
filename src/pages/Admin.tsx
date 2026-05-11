import { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Lock, LogOut, Loader2, Download, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { AdminPostsPanel } from "@/components/admin/AdminPostsPanel";
import { AdminPendaftaranPanel } from "@/components/admin/AdminPendaftaranPanel";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) setIsAdmin(false);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) console.error("Role check failed:", error);
      setIsAdmin(!!data);
    })();
  }, [session]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Admin — Saung Qur'an Cilegon";
    return () => { document.head.removeChild(meta); document.title = prevTitle; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Email & password wajib"); return; }
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoggingIn(false);
    if (error) { toast.error("Login gagal", { description: error.message }); return; }
    setPassword("");
    toast.success("Berhasil login");
  };

  const handleForgotPassword = async () => {
    const target = email.trim();
    if (!target) { toast.error("Isi email dulu"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { toast.error("Gagal kirim email reset", { description: error.message }); return; }
    toast.success("Email reset dikirim", { description: `Cek inbox ${target}` });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Logout berhasil");
  };

  const importFromHostinger = useCallback(async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-hostinger-posts");
      if (error) throw error;
      toast.success("Import selesai", {
        description: `${data?.imported ?? 0} berita ditambahkan, ${data?.skipped ?? 0} dilewati`,
      });
      setImportDialogOpen(false);
    } catch (err) {
      toast.error("Import gagal", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setImporting(false);
    }
  }, []);

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
              <CardTitle>Admin SQC</CardTitle>
              <CardDescription>Masuk dengan akun admin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@saungqurancilegon.id" autoComplete="email" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loggingIn}>
                  {loggingIn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</> : <><Lock className="mr-2 h-4 w-4" /> Masuk</>}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="w-full text-xs" onClick={handleForgotPassword}>
                  <KeyRound className="mr-2 h-3 w-3" /> Lupa Password?
                </Button>
                <Alert>
                  <AlertDescription className="text-xs">
                    Akses hanya untuk admin terdaftar.
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

  return (
    <Layout>
      <section className="py-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">Panel Admin</h1>
              <p className="text-muted-foreground text-sm">
                Login sebagai <strong>{session.user.email}</strong>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/ganti-password"><KeyRound className="mr-2 h-4 w-4" /> Ganti Password</Link>
              </Button>
              {activeTab === "berita" && (
                <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                  <Download className="mr-2 h-4 w-4" /> Import dari Hostinger
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="berita">Berita</TabsTrigger>
              <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
              <TabsTrigger value="pendaftaran">Pendaftaran</TabsTrigger>
            </TabsList>

            <TabsContent value="berita">
              <AdminPostsPanel
                table="news"
                defaultCategory="Berita"
                detailPathPrefix="/berita"
                labelSingular="Berita"
                userId={session.user.id}
              />
            </TabsContent>

            <TabsContent value="pengumuman">
              <AdminPostsPanel
                table="announcements"
                defaultCategory="Pengumuman"
                detailPathPrefix="/pengumuman"
                labelSingular="Pengumuman"
                userId={session.user.id}
              />
            </TabsContent>

            <TabsContent value="pendaftaran">
              <AdminPendaftaranPanel />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import berita dari Hostinger?</AlertDialogTitle>
            <AlertDialogDescription>
              Sistem akan fetch <code>posts.php</code>, download semua gambar, dan insert ke database. Slug yang sudah ada akan dilewati.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={importFromHostinger} disabled={importing}>
              {importing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengimport...</> : <><Download className="mr-2 h-4 w-4" /> Mulai Import</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
