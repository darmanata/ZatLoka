# Product Requirement Document (PRD) — Tahap 1: Arsitektur Dasar, Loading Screen, & Menu Beranda
**Nama Proyek:** ZatLoka (Media Pembelajaran IPA Terintegrasi Kearifan Lokal Bali)  
**Target Pengguna:** Siswa SMP/MTs Kelas VII (Fase D - Kurikulum Merdeka)  
**Platform Target:** Website Responsive (Landscape) $\rightarrow$ Konversi ke Android APK via "Web 2 APK"  
**Pengembang:** Mahasiswa S1 Pendidikan IPA, Universitas Pendidikan Ganesha (Undiksha)  

---

## 1. Visi & Identitas Produk
**ZatLoka** adalah media pembelajaran interaktif berbasis gamifikasi yang dirancang untuk memvisualisasikan konsep abstrak mikroskopis pada bab **"Zat dan Perubahannya"** menjadi konkret dan membumi. Aplikasi ini mengintegrasikan **Kearifan Lokal Bali (Etnosains)** sebagai jembatan kontekstual, seperti proses kristalisasi pada garam tradisional pesisir Bali, destilasi pada pembuatan Arak Bali (konteks teknis ilmiah), serta perubahan fisika dan kimia pada aktivitas di rumah tradisional Bali (*Paon*, *Bale Dangin*, *Mebanten*).

---

## 2. Spesifikasi Teknis & Tech Stack (Tahap 1)
* **Orientasi Layar:** **Landscape (Horizontal)**, dioptimalkan untuk tampilan layar penuh pada *smartphone* dan *desktop*.
* **Bahasa & Framework:** HTML5, CSS3, dan JavaScript (ES6+). Direkomendasikan menggunakan pendekatan *Single Page Application* (SPA) dengan **Vue.js** atau **React.js** agar transisi antar menu mulus tanpa muat ulang (*reload*) halaman.
* **Styling & UI:** **Tailwind CSS**, dengan tema desain minimalis modern berdominasi warna **Putih** dan **Biru Gradasi/Biru Menyala (*Glowing Blue*)**.
* **Penyimpanan Lokal:** Menggunakan **LocalStorage** atau **IndexedDB** untuk menyimpan memori status pangkat/level siswa, skor, koin, dan pengaturan audio agar data tidak hilang saat aplikasi ditutup secara *offline*.
* **Manajemen Aset (Naming Convention):**  
  Seluruh file aset menggunakan huruf kecil (*lowercase*) dan tanda hubung (`-`).
  * `assets/images/` (Format `.svg` untuk ikon/ilustrasi UI, `.webp` untuk foto nyata).
  * `assets/audio/` (Format `.mp3` di bawah 1 MB dengan *bitrate* 64–96 kbps).
  * `assets/videos/` (Video tertanam/embed untuk menjaga ukuran APK tetap ringan).
  * `docs/PRD.md` (Dokumen rancangan pengembang).

---

## 3. Spesifikasi Fitur Tahap 1

### A. Loading Screen (Layar Pemuatan Hybrid)
Layar pembuka yang menggabungkan estetika visual dan pemuatan sistem nyata (*hybrid preloading*).

* **Tata Letak (Header Area):**
  * **Kiri Atas:** Logo Universitas Pendidikan Ganesha (`assets/images/logo-undiksha.png`).
  * **Kanan Atas:** Logo Merdeka Belajar (`assets/images/logo-merdeka-belajar.png`).
* **Pusat Layar (Center Area):**
  * **Judul Aplikasi:** Teks **"ZatLoka"** berukuran besar dengan tipografi tebal (sans-serif) bergaya modern putih-biru.
  * **Tagline:** Teks pendukung di bawah judul: *"Eksplorasi Dunia Materi & Kearifan Lokal Bali"*.
  * **Animasi Utama:** Animasi molekul/partikel 3D ringan yang melayang (*floating particles*) mengelilingi teks judul. Sebagian partikel bergerombol rapat (merepresentasikan zat padat) dan sebagian bergerak bebas menyebar (merepresentasikan gas).
* **Bagian Bawah (Footer Area):**
  * **Loading Bar Kristalisasi:** Garis progres minimalis berwarna biru menyala (*glowing blue*) yang bertumbuh dari kiri ke kanan dengan efek visual seperti pembentukan kristal garam.
  * **Indikator Progres:** Menampilkan persentase angka (0% – 100%) dan teks dinamis: *"Memuat partikel sains..."*, *"Menyiapkan laboratorium virtual..."*.
* **Audio Pembuka:** Memutar musik latar ceria (`assets/images/bgm-opening.mp3`) bernuansa akustik/modern dengan sentuhan alunan *Rindik* Bali.
* **Logika Sistem:** Layar bertahan minimal **3 hingga 4 detik** untuk menampilkan estetika visual sembari sistem memeriksa data LocalStorage (profil siswa & status gembok level). Setelah 100%, layar bertransisi halus (*fade-out / fade-in*) menuju **Menu Beranda**.

---

### B. Menu Beranda (Dashboard Utama Landscape)
Layar navigasi utama yang menyajikan antarmuka luas, bersih, dan berorientasi *edutainment*.

* **Sudut Kiri Atas (Judul Bab):**
  * Menampilkan teks judul bab: **"Zat & Perubahannya"** dengan tipografi putih/biru yang tegas dan bersih.
* **Sudut Kanan Atas (Widget Profil & Pengaturan):**
  * **Kartu Profil Mini:** Komponen berbentuk kapsul/melengkung yang menampilkan Ikon Avatar siswa, Nama Siswa, Pangkat/Gelar saat ini (Default awal: **Detektif Pemula**), dan akumulasi Koin/Poin. Dapat diklik untuk membuka modal/pop-up Profil lengkap.
  * **Tombol Pengaturan:** Ikon kontrol audio untuk mengaktifkan/mematikan BGM (*Mute / Unmute*).
  * **Tombol Bantuan (`?`):** Ikon untuk memunculkan petunjuk navigasi cepat aplikasi.
* **Pusat Layar (Grid Kartu Menu Utama):**
  Menampilkan 5 tombol kartu visual (*interactive visual cards*) dengan efek *hover/scale* saat disentuh:
  1. **Eksplorasi Zat (Materi Utama):** Kartu visual paling menonjol. Berfungsi mengarahkan siswa ke halaman Peta 4 Level Materi (*Detektif Pemula*, *Penjelajah Materi*, *Ilmuwan Muda*, *Master Sains*).
  2. **Loka-Play (Arena Game):** Kartu menuju permainan mandiri (*standalone game*) bermuatan kearifan lokal (seperti *Card Matching* benda budaya dengan proses sains).
  3. **Uji Kompetensi (Kuis Interaktif):** Kartu menuju evaluasi akhir bab dengan sistem gamifikasi dan syarat kelulusan 100% untuk membuka gembok level berikutnya.
  4. **Nonton & Amati (Galeri Video):** Kartu menuju kumpulan video eksperimen sains dan fenomena tradisi Bali yang diputar dalam *Embedded Web Player* di dalam aplikasi.
  5. **Info Akademik (Kurikulum):** Kartu menuju halaman informasi Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan profil pengembang tugas akhir Undiksha.

---

## 4. Instruksi Pengujian Tahap 1 untuk Antigravity
1. Bangun komponen **Loading Screen** sesuai spesifikasi tata letak dan animasi partikel/kristalisasi.
2. Bangun komponen **Menu Beranda** dengan tata letak *landscape*, widget profil di kanan atas, judul di kiri atas, dan 5 kartu menu di tengah.
3. Pastikan transisi dari Loading Screen ke Menu Beranda berjalan mulus tanpa *refresh* browser.
4. Siapkan *router/state management* dasar agar kelima tombol pada Menu Beranda dapat diklik dan mengarahkan ke halaman *placeholder* (halaman sementara) sebelum dikembangkan pada Tahap 2.