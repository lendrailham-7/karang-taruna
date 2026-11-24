# Website Karang Taruna 14 Antapani Kidul

Website resmi **Karang Taruna 14 Antapani Kidul** yang dibangun dengan **React (Vite)** + **Tailwind CSS** dan backend **Supabase** (PostgreSQL, Storage, Auth) langsung dari frontend tanpa server sendiri. Siap di-deploy gratis di **Vercel**.

---

## Fitur Utama

### Halaman Publik
- **Beranda (`/`)**: Hero dengan nama & tagline, statistik interaktif, profil singkat (visi, misi, bidang gerak), serta 3 kegiatan terbaru.
- **Kegiatan (`/kegiatan` & `/kegiatan/:id`)**: Daftar kartu kegiatan urut terbaru, pencarian & filter tahun/akan datang, halaman detail lengkap dengan fitur perbesar foto (lightbox), tautan Google Maps, dan tombol bagikan.
- **Anggota (`/anggota`)**: Grid kartu pengurus & anggota (foto bulat, nama, jabatan — pengurus inti otomatis tampil di atas), kolom pencarian nama/jabatan, dan pratinjau foto.
- **Footer & Kontak**: Alamat sekretariat, tombol WhatsApp, email, telepon, media sosial, serta tautan ke panel admin.

### Panel Admin (`/admin`)
- Login menggunakan **Supabase Auth** (email + kata sandi).
- **Dasbor**: Ringkasan jumlah kegiatan, anggota, dan kegiatan yang akan datang.
- **CRUD Kegiatan**: Tambah, ubah, dan hapus kegiatan (judul, deskripsi, tanggal, lokasi, foto).
- **CRUD Anggota**: Tambah, ubah, dan hapus anggota (nama, jabatan, foto).
- **Kompresi Foto Otomatis di Browser**: Foto yang dipilih otomatis dikompres sebelum diunggah (maksimal sisi `800px`, target `<= 200 KB`, format WebP/JPEG) untuk menghemat kuota gratis Supabase Storage.
- **Hapus Aman**: Dialog konfirmasi sebelum menghapus data; file foto di Storage ikut terhapus otomatis agar tidak meninggalkan sampah file.

### Desain & Pengalaman Pengguna
- Tema **Merah Marun & Gold** yang bersih, responsif (mobile-first), dan sangat interaktif.
- Loading skeleton dan tampilan kosong (*empty state*) yang rapi.
- Warna utama mudah diganti lewat satu tempat di `tailwind.config.js`.

---

## Struktur Proyek

```text
karang-taruna/
├── public/
│   └── favicon.svg
├── supabase/
│   └── schema.sql            # Skema tabel, RLS, bucket Storage, dan policy
├── src/
│   ├── components/
│   │   ├── admin/            # Komponen khusus panel admin (Modal, Form, Upload, dll.)
│   │   └── ...               # Komponen publik (Navbar, Footer, Kartu, Skeleton, dll.)
│   ├── config/
│   │   └── site.js           # Teks profil, kontak, dan tautan media sosial
│   ├── context/              # AuthContext & ToastContext
│   ├── hooks/                # Custom hooks (useAsync, useInView, useDocumentTitle)
│   ├── lib/
│   │   ├── supabase.js       # Inisialisasi klien Supabase (anon key)
│   │   ├── api.js            # Query CRUD & Storage foto
│   │   ├── imageCompression.js
│   │   └── format.js
│   └── pages/
│       ├── admin/            # Login, Dashboard, KegiatanAdmin, AnggotaAdmin
│       ├── Home.jsx
│       ├── Kegiatan.jsx
│       ├── KegiatanDetail.jsx
│       ├── Anggota.jsx
│       └── NotFound.jsx
├── .env.example
├── tailwind.config.js
├── vercel.json               # Rewrite SPA agar React Router tidak 404 saat refresh
└── vite.config.js
```

---

## Panduan Setup Supabase (Step-by-Step)

### 1. Buat Proyek Supabase
1. Buka [supabase.com](https://supabase.com) lalu masuk atau daftar akun gratis.
2. Klik **New project**.
3. Isi:
   - **Name**: misal `karang-taruna-14`
   - **Database Password**: buat kata sandi yang kuat dan simpan baik-baik.
   - **Region**: pilih yang terdekat, misalnya **Southeast Asia (Singapore)**.
4. Klik **Create new project** dan tunggu ±1–2 menit sampai proyek siap.

### 2. Jalankan `supabase/schema.sql`
1. Di dashboard proyek Supabase Anda, buka menu **SQL Editor** di sidebar kiri.
2. Klik **New query**.
3. Buka file [`supabase/schema.sql`](./supabase/schema.sql) di repositori ini, salin **seluruh isinya**, lalu tempel ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Pastikan muncul pesan **`Success. No rows returned`**.

Script tersebut otomatis membuat:
- Tabel `public.kegiatan` dan `public.anggota`.
- **Row Level Security (RLS)** aktif:
  - Publik (`anon` & `authenticated`) hanya boleh `SELECT` (baca).
  - Hanya user terautentikasi (`authenticated`) yang boleh `INSERT`, `UPDATE`, dan `DELETE`.
- Bucket Storage bernama **`foto`** (akses baca publik, batas ukuran 1 MB per file, hanya gambar JPEG/PNG/WebP) beserta policy Storage-nya.

> *(Opsional)* Jika ingin langsung melihat contoh data, hapus tanda komentar `--` di bagian paling bawah `supabase/schema.sql` sebelum klik **Run**.

### 3. Buat User Admin
1. Di sidebar kiri Supabase, buka **Authentication** → **Users**.
2. Klik **Add user** → **Create new user**.
3. Masukkan **Email** dan **Password** untuk admin (misal `admin@kt14.id`).
4. **Pastikan centang `Auto Confirm User`** agar akun langsung bisa login tanpa verifikasi email.
5. Klik **Create user**.

> **Tips keamanan**: Jika Anda tidak ingin orang lain mendaftar akun sendiri, buka **Authentication** → **Providers** → **Email**, lalu matikan opsi **Confirm email** tidak perlu diubah, dan di **Authentication** → **Sign In / Providers** (atau **User Signups**) matikan **Allow new users to sign up**. Dengan begitu, hanya admin yang Anda buat manual di dashboard yang dapat login.

### 4. Ambil URL dan Anon Key Supabase
1. Buka **Project Settings** (ikon gerigi di kiri bawah) → **API** (atau **Data API** / **API Keys**).
2. Salin dua nilai berikut:
   - **Project URL** → untuk `VITE_SUPABASE_URL`
   - **anon / public key** (atau *Publishable key*) → untuk `VITE_SUPABASE_ANON_KEY`

> **PENTING**: Frontend **hanya** boleh menggunakan **`anon` key**. **JANGAN PERNAH** menaruh `service_role` / `secret` key di file `.env`, kode frontend, atau Vercel Environment Variables!

---

## Menjalankan Secara Lokal

Pastikan **Node.js** (versi 18+) sudah terpasang.

```bash
# 1. Clone repositori
git clone https://github.com/lendrailham-7/karang-taruna.git
cd karang-taruna

# 2. Pasang dependensi
npm install

# 3. Salin contoh environment
cp .env.example .env
```

Buka file `.env` lalu isi dengan URL dan Anon Key dari Langkah 4 di atas:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> File `.env` sudah terdaftar di `.gitignore` sehingga tidak akan pernah ikut ter-commit ke Git.

Jalankan server pengembangan:

```bash
npm run dev
```

Buka browser di alamat yang tampil (biasanya `http://localhost:3000`). Untuk masuk panel admin, buka `http://localhost:3000/admin`.

---

## Deploy Gratis ke Vercel (dari GitHub)

1. Buka [vercel.com](https://vercel.com) lalu login menggunakan akun **GitHub**.
2. Klik **Add New…** → **Project**.
3. Pilih repositori **`lendrailham-7/karang-taruna`** lalu klik **Import**.
4. Di bagian **Configure Project**:
   - **Framework Preset**: pastikan terdeteksi **Vite**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Buka bagian **Environment Variables**, lalu tambahkan dua variabel:
   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | *(Project URL Supabase Anda)* |
   | `VITE_SUPABASE_ANON_KEY` | *(anon public key Supabase Anda)* |
6. Klik **Deploy** dan tunggu ±1 menit hingga selesai.
7. Setelah live, cek halaman publik dan coba refresh di `/kegiatan` atau `/admin` — file `vercel.json` sudah mengatur rewrite agar React Router tidak pernah 404 saat di-refresh.

Setiap kali Anda melakukan `git push origin main`, Vercel akan otomatis mem-build dan memperbarui website.

---

## Kustomisasi Cepat

- **Ganti warna tema**: Edit palet `primary` (merah marun) dan `accent` (gold) di [`tailwind.config.js`](./tailwind.config.js).
- **Ubah teks profil, visi-misi, kontak, & media sosial**: Edit [`src/config/site.js`](./src/config/site.js).

---

## Perintah NPM

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan lokal |
| `npm run build` | Mem-build aplikasi untuk produksi ke folder `dist/` |
| `npm run preview` | Melihat pratinjau hasil build produksi secara lokal |
