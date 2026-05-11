import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Search, RefreshCw, Loader2, Phone, Mail } from "lucide-react";

interface Pendaftar {
  id: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  nama_ayah: string;
  nama_ibu: string;
  no_telepon: string;
  email: string | null;
  program: string;
  asal_sekolah: string | null;
  catatan: string | null;
  status: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["pending", "diproses", "diterima", "ditolak"] as const;

const statusColor = (s: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (s) {
    case "diterima": return "default";
    case "diproses": return "secondary";
    case "ditolak": return "destructive";
    default: return "outline";
  }
};

export const AdminPendaftaranPanel = () => {
  const [rows, setRows] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pendaftar | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pendaftaran")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Gagal memuat pendaftaran", { description: error.message });
      setRows([]);
    } else {
      setRows((data ?? []) as Pendaftar[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    const { error } = await supabase.from("pendaftaran").update({ status: newStatus }).eq("id", id);
    setUpdating(null);
    if (error) {
      toast.error("Gagal update status", { description: error.message });
      return;
    }
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Status diubah ke ${newStatus}`);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("pendaftaran").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Gagal hapus", { description: error.message }); return; }
    toast.success("Data pendaftaran dihapus");
    setDeleteTarget(null);
    await fetchRows();
  };

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && (r.status ?? "pending") !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.nama_lengkap.toLowerCase().includes(q) ||
        r.no_telepon.includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        r.program.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = rows.filter((r) => (r.status ?? "pending") === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Pendaftaran ({rows.length})</CardTitle>
            <CardDescription>Kelola data calon santri yang masuk via formulir publik.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-3">
          {STATUS_OPTIONS.map((s) => (
            <Badge key={s} variant={statusColor(s)} className="capitalize">
              {s}: {counts[s] ?? 0}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, telepon, email, program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            {rows.length === 0 ? "Belum ada pendaftaran masuk." : "Tidak ada hasil yang cocok."}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{r.nama_lengkap}</h3>
                      <Badge variant="secondary" className="text-xs">{r.program}</Badge>
                      <Badge variant="outline" className="text-xs">{r.jenis_kelamin}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {r.tempat_lahir}, {new Date(r.tanggal_lahir).toLocaleDateString("id-ID")}
                      {r.asal_sekolah ? ` • ${r.asal_sekolah}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Daftar: {new Date(r.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={r.status ?? "pending"}
                      onValueChange={(v) => updateStatus(r.id, v)}
                      disabled={updating === r.id}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updating === r.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(r)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm border-t pt-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Orang Tua / Wali</p>
                    <p>Ayah: {r.nama_ayah}</p>
                    <p>Ibu: {r.nama_ibu}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Kontak</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <a href={`https://wa.me/${r.no_telepon.replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {r.no_telepon}
                      </a>
                    </p>
                    {r.email && (
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${r.email}`} className="text-primary hover:underline">{r.email}</a>
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Alamat</p>
                    <p className="whitespace-pre-wrap">{r.alamat}</p>
                  </div>
                  {r.catatan && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Catatan</p>
                      <p className="whitespace-pre-wrap text-muted-foreground">{r.catatan}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pendaftaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Data <strong>{deleteTarget?.nama_lengkap}</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
