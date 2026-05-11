/**
 * Automated RLS test suite for SQC Lovable Cloud backend.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... bun scripts/rls-test.ts
 *
 * Optional (untuk menjalankan suite admin):
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... bun scripts/rls-test.ts
 *
 * Exit code 0 = semua lulus, 1 = ada FAIL.
 */

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
  process.exit(2);
}

type Result = { name: string; pass: boolean; detail?: string };
const results: Result[] = [];

const record = (name: string, pass: boolean, detail?: string) => {
  results.push({ name, pass, detail });
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} ${name}${detail ? `  — ${detail}` : ""}`);
};

const restHeaders = (token = ANON_KEY!) => ({
  apikey: ANON_KEY!,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const rest = (path: string, init: RequestInit = {}, token = ANON_KEY!) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...restHeaders(token), ...(init.headers as Record<string, string> | undefined) },
  });

// ============ ANON SUITE ============
async function runAnonSuite() {
  console.log("\n=== ANON suite ===");

  // 1. Public read published news/announcements
  for (const tbl of ["news", "announcements"] as const) {
    const r = await rest(`${tbl}?published=eq.true&select=id&limit=1`);
    record(`anon SELECT ${tbl} published=true`, r.ok, `HTTP ${r.status}`);
  }

  // 2. Should NOT see drafts
  for (const tbl of ["news", "announcements"] as const) {
    const r = await rest(`${tbl}?published=eq.false&select=id&limit=1`);
    const body = await r.json().catch(() => []);
    record(
      `anon SELECT ${tbl} drafts hidden`,
      r.ok && Array.isArray(body) && body.length === 0,
      `HTTP ${r.status}, rows=${Array.isArray(body) ? body.length : "?"}`,
    );
  }

  // 3. pendaftaran & user_roles → DENY (empty)
  for (const tbl of ["pendaftaran", "user_roles"] as const) {
    const r = await rest(`${tbl}?select=id&limit=1`);
    const body = await r.json().catch(() => []);
    record(
      `anon SELECT ${tbl} denied`,
      r.ok && Array.isArray(body) && body.length === 0,
      `HTTP ${r.status}, rows=${Array.isArray(body) ? body.length : "?"}`,
    );
  }

  // 4. INSERT news/announcements blocked
  for (const tbl of ["news", "announcements"] as const) {
    const r = await rest(tbl, {
      method: "POST",
      body: JSON.stringify({ slug: `rls-test-${Date.now()}`, title: "x", content: "x" }),
    });
    record(`anon INSERT ${tbl} blocked`, r.status === 401 || r.status === 403, `HTTP ${r.status}`);
  }

  // 5. INSERT pendaftaran with valid data → 201
  const validRow = {
    nama_lengkap: "RLS TestUser",
    tempat_lahir: "Cilegon",
    tanggal_lahir: "2015-01-01",
    jenis_kelamin: "Laki-laki",
    alamat: "Jl. Test No. 1, Cilegon",
    nama_ayah: "Ayah Test",
    nama_ibu: "Ibu Test",
    no_telepon: "081234567890",
    program: "Tamyiz",
  };
  // Anon tidak punya SELECT di pendaftaran → tidak bisa pakai return=representation.
  // Cleanup ditangani lewat suite admin (atau dilewati bila admin tidak diset).
  let createdId: string | null = null;
  {
    const r = await rest("pendaftaran", {
      method: "POST",
      body: JSON.stringify(validRow),
    });
    record("anon INSERT pendaftaran valid → 201", r.status === 201, `HTTP ${r.status}`);
  }

  // 6. INSERT pendaftaran with invalid program → blocked
  {
    const r = await rest("pendaftaran", {
      method: "POST",
      body: JSON.stringify({ ...validRow, program: "INVALID" }),
    });
    record(
      "anon INSERT pendaftaran invalid program blocked",
      r.status >= 400,
      `HTTP ${r.status}`,
    );
  }

  // 7. INSERT pendaftaran trying to set status=diterima → blocked by INSERT policy
  {
    const r = await rest("pendaftaran", {
      method: "POST",
      body: JSON.stringify({ ...validRow, status: "diterima" }),
    });
    record(
      "anon INSERT pendaftaran status=diterima blocked",
      r.status >= 400,
      `HTTP ${r.status}`,
    );
  }

  // 8. UPDATE / DELETE pendaftaran → 0 rows affected (silent deny)
  if (createdId) {
    const u = await rest(`pendaftaran?id=eq.${createdId}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "diterima" }),
    });
    const ub = await u.json().catch(() => []);
    record("anon UPDATE pendaftaran no-op", Array.isArray(ub) && ub.length === 0, `HTTP ${u.status}, rows=${Array.isArray(ub) ? ub.length : "?"}`);

    const d = await rest(`pendaftaran?id=eq.${createdId}`, {
      method: "DELETE",
      headers: { Prefer: "return=representation" },
    });
    const db = await d.json().catch(() => []);
    record("anon DELETE pendaftaran no-op", Array.isArray(db) && db.length === 0, `HTTP ${d.status}, rows=${Array.isArray(db) ? db.length : "?"}`);
  }

  // 9. Storage list news-images
  {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/list/news-images`, {
      method: "POST",
      headers: { ...restHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 1, prefix: "" }),
    });
    const body = await r.json().catch(() => []);
    record(
      "anon LIST news-images denied",
      r.ok && Array.isArray(body) && body.length === 0,
      `HTTP ${r.status}, rows=${Array.isArray(body) ? body.length : "?"}`,
    );
  }

  // 10. Storage upload
  {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/news-images/rls-test-${Date.now()}.txt`, {
      method: "POST",
      headers: { apikey: ANON_KEY!, Authorization: `Bearer ${ANON_KEY!}`, "Content-Type": "text/plain" },
      body: "blocked",
    });
    record("anon UPLOAD news-images blocked", r.status === 403 || r.status === 401, `HTTP ${r.status}`);
  }

  return createdId;
}

// ============ ADMIN SUITE ============
async function runAdminSuite(cleanupId: string | null) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("\n(skip) ADMIN suite — set ADMIN_EMAIL & ADMIN_PASSWORD untuk menjalankan.");
    // Best-effort cleanup: anon can't delete, so the row will linger. Warn.
    if (cleanupId) console.log(`   ⚠️  Row test pendaftaran ${cleanupId} tidak bisa di-cleanup tanpa admin.`);
    return;
  }

  console.log("\n=== AUTHENTICATED ADMIN suite ===");

  // Sign in
  const signin = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const auth = await signin.json();
  if (!signin.ok || !auth.access_token) {
    record("admin sign-in", false, `HTTP ${signin.status} ${JSON.stringify(auth).slice(0, 80)}`);
    return;
  }
  const token = auth.access_token as string;
  record("admin sign-in", true);

  // News CRUD
  const slug = `rls-test-news-${Date.now()}`;
  const ins = await rest("news", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ slug, title: "RLS test", content: "x", published: false }),
  }, token);
  const insBody = await ins.json().catch(() => null);
  const newsId = Array.isArray(insBody) ? insBody[0]?.id : null;
  record("admin INSERT news", !!newsId, `HTTP ${ins.status}`);

  if (newsId) {
    const upd = await rest(`news?id=eq.${newsId}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ title: "RLS test updated" }),
    }, token);
    const updBody = await upd.json().catch(() => []);
    record("admin UPDATE news", Array.isArray(updBody) && updBody.length === 1, `HTTP ${upd.status}`);

    const del = await rest(`news?id=eq.${newsId}`, { method: "DELETE" }, token);
    record("admin DELETE news", del.ok, `HTTP ${del.status}`);
  }

  // Pendaftaran admin operations
  const pendList = await rest("pendaftaran?select=id&limit=1", {}, token);
  record("admin SELECT pendaftaran", pendList.ok, `HTTP ${pendList.status}`);

  if (cleanupId) {
    // Try update + cleanup
    const upd = await rest(`pendaftaran?id=eq.${cleanupId}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "diproses" }),
    }, token);
    const updBody = await upd.json().catch(() => []);
    record("admin UPDATE pendaftaran status", Array.isArray(updBody) && updBody.length === 1, `HTTP ${upd.status}`);

    // Try invalid status to confirm WITH CHECK guard
    const bad = await rest(`pendaftaran?id=eq.${cleanupId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "INVALID" }),
    }, token);
    record("admin UPDATE pendaftaran invalid status blocked", bad.status >= 400, `HTTP ${bad.status}`);

    const del = await rest(`pendaftaran?id=eq.${cleanupId}`, { method: "DELETE" }, token);
    record("admin DELETE pendaftaran (cleanup)", del.ok, `HTTP ${del.status}`);
  }
}

// ============ RUN ============
(async () => {
  const cleanupId = await runAnonSuite();
  await runAdminSuite(cleanupId);

  const failed = results.filter((r) => !r.pass);
  const total = results.length;
  console.log(`\n${total - failed.length}/${total} passed`);
  if (failed.length) {
    console.log("\nFAILED:");
    failed.forEach((f) => console.log(`  - ${f.name}${f.detail ? `  (${f.detail})` : ""}`));
    process.exit(1);
  }
  process.exit(0);
})();
