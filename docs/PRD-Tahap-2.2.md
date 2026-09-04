# PRD Tahap 2.2: Peta Level & Integrasi Materi Eksplorasi Zat (Level 1-4)

## 1. Tata Letak Global & Pembaruan UI/UX
* **Fullscreen Desktop & Mobile Responsif:** Wadah utama aplikasi (`app-container`) menggunakan `width: 100vw; height: 100vh; overflow: hidden; display: flex; flex-direction: column;`. Hapus latar gelap/letterbox. 
* **Batas Konten Visual:** Area simulasi di tengah harus menggunakan `max-width: 1200px; margin: 0 auto; min-height: 0; flex: 1;` agar gambar tidak menjadi raksasa di desktop, sementara *header* dan *footer* tetap memanjang penuh. Gambar menggunakan `object-fit: contain;`.
* **Sampul Beranda:** Gunakan format `.webp` untuk kartu menu di beranda (`menu-eksplorasi.webp`, `menu-lokaplay.webp`, `menu-kuis.webp`, `menu-video.webp`, `menu-akademik.webp`) yang terletak di dalam folder `image/`.
* **Menu Peta Level:** Saat masuk ke Eksplorasi Zat, tampilkan 4 tombol vertikal berjejer ke bawah yang menyajikan daftar level secara terbuka (tanpa gembok), lengkap dengan spoiler judulnya:
  1. Level 1: Wujud Zat & Model Partikel
  2. Level 2: Perubahan Wujud & Titik Suhu
  3. Level 3: Perubahan Fisika & Kimia
  4. Level 4: Kerapatan & Massa Jenis
* **Perombakan Sistem Reward (Global):** Hapus total seluruh sistem, variabel, logika, dan antarmuka (UI) "Koin" dari seluruh bagian aplikasi (termasuk Beranda dan Widget Profil Siswa). Ganti sepenuhnya dengan sistem **"EXP" (Experience Points)**. EXP hanya bisa didapatkan melalui penyelesaian di menu Kuis, bukan dari Eksplorasi Zat. Tampilkan indikator/bar progres EXP ini hanya pada Profil Siswa. Pada layar materi, pastikan UI bagian atas bersih dari indikator *reward* apa pun.

---

## 2. Naskah Materi & Logika Interaksi per Level

### LEVEL 1: DETEKTIF PEMULA (Fokus: Wujud Zat & Model Partikel)
**Layar 1.1: Rahasia Penyulingan Arak Bali**[cite: 1]
* **Instruksi:** "Ketuk salah satu objek pada alat penyulingan arak di bawah ini untuk menyelidiki wujudnya!"[cite: 1]
* **Interaksi (Hotspot Klik):**
  * Ketuk `bambu-suling.png` $\rightarrow$ **Wujud Padat:** "Bambu penyulingan memiliki wujud PADAT. Zat padat memiliki bentuk dan volume yang selalu tetap, serta tidak berubah meskipun dipindahkan ke tempat yang berbeda."[cite: 1]
  * Ketuk `tetesan-cair.png` $\rightarrow$ **Wujud Cair:** "Tetesan arak memiliki wujud CAIR. Zat cair memiliki volume yang tetap, tetapi bentuknya selalu berubah mengikuti bentuk wadah penampungnya."[cite: 1]
  * Ketuk `uap-gas.png` $\rightarrow$ **Wujud Gas:** "Uap panas yang mengepul memiliki wujud GAS. Zat gas tidak memiliki bentuk dan volume yang tetap; bentuk dan volumenya selalu berubah memenuhi seluruh ruang yang ditempatinya."[cite: 1]

**Layar 1.2: Menembus Partikel Rahasia**[cite: 1]
* **Instruksi:** "Pilih tab wujud zat di bawah ini untuk melihat susunan partikel mikroskopisnya!"[cite: 1]
* **Interaksi (Tab):**
  * **[Tab Padat]:** "Catatan Penting Detektif: Tahukah kamu? Partikel pada benda padat seperti bambu sebenarnya TIDAK DIAM MUTLAK! Partikelnya selalu bergetar di tempatnya dan tetap memiliki rongga/jarak antarpartikel yang sangat sempit, meskipun ikatan antarpartikelnya sangat kuat."[cite: 1]
  * **[Tab Cair]:** "Partikel zat cair seperti arak tersusun agak renggang. Gaya tarik antarpartikelnya tidak seluas zat padat, sehingga partikel cair dapat bergerak bebas bergeser namun tidak sampai lepas dari kelompoknya."[cite: 1]
  * **[Tab Gas]:** "Partikel zat gas tersusun sangat berjauhan. Gaya tarik antarpartikelnya sangat lemah sehingga partikel gas bebas melesat cepat ke seluruh sudut ruangan."[cite: 1]

### LEVEL 2: PENJELAJAH MATERI (Fokus: Perubahan Wujud Zat)

**Layar 2.1: Rahasia Es Daluman Bali**
* **Instruksi:** "Pilih aksi di bawah ini untuk mengamati proses perubahan wujud meleleh dan membeku!"
* **Interaksi & Aset:**
  * **Tampilan Awal:** Menampilkan aset `es-daluman-padat.png` (mangkuk dengan es batu).
  * Tombol **[Panaskan Es]**: State gambar menjadi `daluman-cair.png`. Teks: "Meleleh (Mencair) adalah perubahan wujud dari padat menjadi cair akibat MENYERAP KALOR. Energi panas membuat energi kinetik partikel meningkat sehingga ikatan antarpartikel yang kaku menjadi merenggang."
  * Tombol **[Bekukan Air]**: State gambar kembali ke `es-daluman-padat.png`. Teks: "Membeku adalah perubahan wujud dari cair menjadi padat akibat MELEPASKAN KALOR. Penurunan suhu membuat pergerakan partikel melambat sehingga gaya tarik antarpartikel kembali mengikatnya secara kaku dan teratur."

**Layar 2.2: Tradisi Penyulingan Arak (Menguap & Mengembun)**
* **Instruksi:** "Pilih aksi di bawah ini untuk menyelidiki proses menguap dan mengembun!"
* **Visual Utama:** Gunakan tata letak Alat Penyulingan Arak (Tungku, Panci, Bambu) seperti pada Level 1.
* **Interaksi:**
  * Tombol **[Didihkan Cairan]**: Memunculkan animasi uap panas yang mengepul dari panci. Teks: "Menguap adalah perubahan wujud dari cair menjadi gas akibat MENYERAP KALOR. Partikel menyerap energi panas hingga pergerakannya sangat cepat dan memutus ikatan antarpartikel cair."
  * Tombol **[Dinginkan Uap]**: Memunculkan animasi tetesan air yang jatuh dari ujung bambu. Teks: "Mengembun adalah perubahan wujud dari gas menjadi cair akibat MELEPASKAN KALOR. Pelepasan energi panas membuat gerak acak partikel gas melambat dan merapat kembali."

**Layar 2.3: Pengharum Kamar (Menyublim)**
* **Instruksi:** "Tekan tombol untuk melihat bagaimana zat padat berubah langsung menjadi gas!"
* **Visual Utama:** Area kiri menampilkan wadah dengan `kapur-padat.png`. Area kanan disiapkan untuk teks penjelasan.
* **Interaksi:**
  * Tombol **[Panaskan Kapur Barus]**: Objek `kapur-padat.png` memudar (*fade-out*), lalu `gas-sublimasi.png` muncul dan melayang ke atas. Teks muncul di sebelah gambar: "Menyublim adalah perubahan wujud dari padat menjadi gas akibat MENYERAP KALOR. Partikel padat langsung melepaskan diri menjadi pergerakan bebas gas."

**Layar 2.4: Tradisi Garam Kusamba (Mengkristal)**
* **Instruksi:** "Geser ikon matahari untuk menguapkan air dan membentuk kristal garam!"
* **Visual Utama:** Palung kayu berisi air laut. Di bawah gambar terdapat Slider UI dengan ikon Matahari.
* **Interaksi (Slider Matahari):**
  * Saat slider digeser ke kanan (panas meningkat): Gambar air di dalam palung perlahan memudar (transparansi menurun), dan visual butiran kristal garam perlahan muncul dari dasar palung. 
  * Teks penjelasan muncul: "Mengkristal (Mendeposisi) adalah perubahan wujud dari gas menjadi padat akibat MELEPASKAN KALOR. Partikel gas melepaskan energi panas dan merapat kaku."

**Layar 2.5: Batas Suhu Perubahan Wujud**
* **Instruksi:** "Geser slider termometer untuk mengamati fenomena Titik Leleh dan Titik Didih!"
* **Interaksi (Slider Suhu 0-100 & Kode UI Murni):** Angka di tengah layar berubah real-time sesuai geseran slider. 
  * Saat slider menyentuh $0^{\circ}C$: "Titik Leleh adalah suhu konstan saat suatu zat padat berubah wujud menjadi cair (misal: es batu mencair pada suhu $0^{\circ}C$). Selama proses mencair terjadi, suhu zat akan tetap stabil..."
  * Saat slider menyentuh $100^{\circ}C$: "Titik Didih adalah suhu konstan saat suatu zat cair mendidih dan berubah wujud menjadi gas secara menyeluruh (misal: air murni mendidih pada suhu $100^{\circ}C$ pada tekanan 1 atm)."

### LEVEL 3: ILMUWAN MUDA (Fokus: Perubahan Fisika & Kimia)
**Layar 3.1: Pembakaran Dupa & Kartu Analisis**
* **Logika Awal:** Tampilkan `wadah-pasepan.png` (Dupa Utuh). Siswa menekan tombol **[Nyalakan Dupa]**.
* **Logika Lanjutan:** Gambar berganti menjadi `dupa-abu.png` + asap. Kemudian muncul 1 objek *Flip Card* di layar. Tampilkan teks berkedip di atas kartu: *"💡 Ketuk kartu untuk membalik dan melihat perbedaannya!"*
* **Interaksi Flip Card:**
  * **SISI DEPAN (Perubahan Fisika):** "Penguapan Aroma Terapi Dupa. TIDAK MENGHASILKAN ZAT BARU. Perubahan hanya terjadi pada wujud, bentuk, atau ukurannya saja, sedangkan susunan molekul kimianya tetap sama. Bersifat reversible."
  * **SISI BELAKANG (Perubahan Kimia):** "Pembakaran Serbuk Kayu Dupa. MENGHASILKAN ZAT BARU dengan sifat kimia dan struktur molekul yang sepenuhnya berbeda dari zat asalnya. Bersifat irreversible (terbentuk abu dan asap)."

### LEVEL 4: MASTER SAINS (Fokus: Kerapatan Zat & Perhitungan)
**Layar 4.1: Rahasia Mengapung, Melayang, dan Tenggelam (Simulasi)**
* **Instruksi:** "Seret (drag) masing-masing benda ke dalam kolam air untuk menguji posisi dan kerapatan massa jenisnya! Ketuk benda di dalam air untuk mengembalikannya."
* **Interaksi Drag & Drop (dan event onClick untuk reset posisi benda):**
  * **Drag Bambu (Mengapung):** "Bambu memiliki struktur dengan banyak rongga udara di dalamnya, sehingga partikel penyusunnya tidak terlalu rapat. Syarat Fisika: $\rho_{\text{benda}} < \rho_{\text{cairan}}$ ($0,8~g/cm^{3} < 1,0~g/cm^{3}$)." (Sertakan kotak rumus $\rho = \frac{m}{V}$ di pop-up ini).
  * **Drag Telur (Melayang):** Telur berhenti di tengah kolam. "Penambahan garam Kusamba meningkatkan kerapatan partikel terlarut dalam air sehingga massa jenis air garam menjadi sama persis dengan massa jenis telur. Syarat Fisika: $\rho_{\text{benda}} = \rho_{\text{cairan}}$ ($1,0~g/cm^{3} = 1,0~g/cm^{3}$)."
  * **Drag Koin Logam (Tenggelam):** "Koin logam tersusun atas partikel atom yang sangat amat rapat tanpa rongga udara, sehingga jumlah massa per satuan volumenya sangat besar. Syarat Fisika: $\rho_{\text{benda}} > \rho_{\text{cairan}}$ ($7,8~g/cm^{3} > 1,0~g/cm^{3}$)." (HAPUS kotak rumus pada pop-up ini).

**Layar 4.2: Perhitungan Massa Jenis**
* **Teks Soal:** "Seorang perajin di Bali ingin menguji kerapatan sepotong kayu bambu suling arak. Bambu tersebut memiliki massa ($m$) = 120 gram dan volume ($V$) = 150 $cm^{3}$. Berapakah nilai massa jenis ($\rho$) bambu tersebut?"
* **Langkah Penyelesaian (Tampil berurutan):**
  1. Diketahui: Massa ($m$) = 120 gram, Volume ($V$) = 150 $cm^{3}$.
  2. Rumus: Massa Jenis ($\rho$) = $\frac{\text{Massa } (m)}{\text{Volume } (V)}$.
  3. Perhitungan: $\rho = \frac{120\text{ g}}{150\text{ cm}^{3}} = 0,8\text{ g/cm}^{3}$.
  4. Kesimpulan: Massa jenis bambu suling tersebut adalah $0,8\text{ g/cm}^{3}$.
* **Navigasi Akhir:** Hilangkan pop-up raksasa di akhir layar. Ganti tombol navigasi "Lanjut" dengan dua tombol sejajar di sudut kanan bawah: **[ Kembali ke Beranda ]** dan **[ Lanjutkan ke Kuis ]**.