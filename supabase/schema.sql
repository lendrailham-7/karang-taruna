-- =====================================================================
--  SKEMA DATABASE — Karang Taruna 14 Antapani Kidul
--  Jalankan seluruh isi file ini di: Supabase Dashboard > SQL Editor
--  Aman dijalankan berulang kali (idempotent).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TABEL KEGIATAN
-- ---------------------------------------------------------------------
create table if not exists public.kegiatan (
  id          uuid primary key default gen_random_uuid(),
  judul       text not null check (char_length(judul) between 1 and 200),
  deskripsi   text,
  tanggal     date not null,
  lokasi      text,
  foto_url    text,
  created_at  timestamptz not null default now()
);

create index if not exists kegiatan_tanggal_idx
  on public.kegiatan (tanggal desc, created_at desc);

-- ---------------------------------------------------------------------
-- 2. TABEL ANGGOTA
-- ---------------------------------------------------------------------
create table if not exists public.anggota (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null check (char_length(nama) between 1 and 150),
  jabatan     text not null default 'Anggota',
  foto_url    text,
  created_at  timestamptz not null default now()
);

create index if not exists anggota_created_idx
  on public.anggota (created_at);

-- ---------------------------------------------------------------------
-- 3. HAK AKSES DASAR (GRANT)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.kegiatan, public.anggota to anon, authenticated;
grant insert, update, delete on public.kegiatan, public.anggota to authenticated;

-- ---------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
--    - Semua orang (anon) boleh SELECT
--    - Hanya user terautentikasi boleh INSERT / UPDATE / DELETE
-- ---------------------------------------------------------------------
alter table public.kegiatan enable row level security;
alter table public.anggota  enable row level security;

-- Kegiatan
drop policy if exists "Publik dapat melihat kegiatan"     on public.kegiatan;
drop policy if exists "Admin dapat menambah kegiatan"     on public.kegiatan;
drop policy if exists "Admin dapat mengubah kegiatan"     on public.kegiatan;
drop policy if exists "Admin dapat menghapus kegiatan"    on public.kegiatan;

create policy "Publik dapat melihat kegiatan"
  on public.kegiatan for select
  to anon, authenticated
  using (true);

create policy "Admin dapat menambah kegiatan"
  on public.kegiatan for insert
  to authenticated
  with check (true);

create policy "Admin dapat mengubah kegiatan"
  on public.kegiatan for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin dapat menghapus kegiatan"
  on public.kegiatan for delete
  to authenticated
  using (true);

-- Anggota
drop policy if exists "Publik dapat melihat anggota"      on public.anggota;
drop policy if exists "Admin dapat menambah anggota"      on public.anggota;
drop policy if exists "Admin dapat mengubah anggota"      on public.anggota;
drop policy if exists "Admin dapat menghapus anggota"     on public.anggota;

create policy "Publik dapat melihat anggota"
  on public.anggota for select
  to anon, authenticated
  using (true);

create policy "Admin dapat menambah anggota"
  on public.anggota for insert
  to authenticated
  with check (true);

create policy "Admin dapat mengubah anggota"
  on public.anggota for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin dapat menghapus anggota"
  on public.anggota for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 5. STORAGE: bucket "foto" (baca publik)
--    Batas 1 MB per file & hanya gambar (foto sudah dikompres di browser).
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'foto',
  'foto',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Policy Storage
drop policy if exists "Publik dapat melihat foto"   on storage.objects;
drop policy if exists "Admin dapat upload foto"     on storage.objects;
drop policy if exists "Admin dapat mengubah foto"   on storage.objects;
drop policy if exists "Admin dapat menghapus foto"  on storage.objects;

create policy "Publik dapat melihat foto"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'foto');

create policy "Admin dapat upload foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'foto');

create policy "Admin dapat mengubah foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'foto')
  with check (bucket_id = 'foto');

create policy "Admin dapat menghapus foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'foto');

-- =====================================================================
--  (OPSIONAL) DATA CONTOH — hapus tanda komentar jika ingin mencoba
-- =====================================================================
-- insert into public.kegiatan (judul, deskripsi, tanggal, lokasi) values
--   ('Kerja Bakti Lingkungan', 'Membersihkan saluran air dan taman warga.', '2026-10-12', 'RW 14 Antapani Kidul'),
--   ('Lomba 17 Agustus', 'Perlombaan tradisional untuk anak-anak dan remaja.', '2026-08-17', 'Lapangan RW 14'),
--   ('Santunan Anak Yatim', 'Berbagi bersama anak yatim di lingkungan sekitar.', '2026-03-20', 'Masjid Al-Ikhlas');
--
-- insert into public.anggota (nama, jabatan) values
--   ('Nama Ketua', 'Ketua'),
--   ('Nama Wakil', 'Wakil Ketua'),
--   ('Nama Sekretaris', 'Sekretaris'),
--   ('Nama Bendahara', 'Bendahara');
