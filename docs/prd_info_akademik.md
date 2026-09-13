# PRD & INSTRUKSI PENGEMBANGAN: FITUR INFO AKADEMIK

## 1. KONSEP & UI/UX
* **Tata Letak:** Gunakan tampilan *Vertical Full Scroll*. Semua informasi digelar ke bawah tanpa disembunyikan dalam akordeon.
* **Desain Visual:** Gunakan sistem *Card* (kartu dengan latar belakang putih/terang dan bayangan *drop-shadow* lembut) untuk memisahkan 4 bagian utama: (1) Capaian Pembelajaran, (2) Tujuan Pembelajaran, (3) Profil Penyusun, dan (4) Daftar Pustaka.

## 2. KONTEN 1: CAPAIAN PEMBELAJARAN (CP)
**Elemen Pemahaman IPA:**
Peserta didik mampu melakukan klasifikasi benda berdasarkan karakteristik yang diamati, mengidentifikasi sifat dan karakteristik zat, membedakan perubahan fisik dan kimia serta memisahkan campuran sederhana[cite: 2].

## 3. KONTEN 2: MATERI POKOK & TUJUAN PEMBELAJARAN (TP)
* **Wujud Zat dan Model Partikel:** Melalui pengamatan simulasi animasi sub-mikroskopis dan pengintegrasian kearifan lokal Bali pada aplikasi, peserta didik kelas VII dapat mengklasifikasikan karakteristik tiga wujud zat serta mendeskripsikan model partikelnya secara tepat tanpa miskonsepsi[cite: 2].
* **Perubahan Wujud Zat:** Melalui pengamatan pada aplikasi, peserta didik kelas VII dapat menganalisis 6 jenis perubahan wujud zat berdasarkan penyerapan/pelepasan kalor serta membedakan konsep titik leleh dan titik didih secara tepat[cite: 2].
* **Perubahan Fisika dan Kimia:** Melalui pemanfaatan fitur interaktif dan studi kasus kearifan lokal Bali (garam, arak, dan dupa) pada aplikasi, peserta didik kelas VII dapat membedakan ciri-ciri serta mengategorikan contoh perubahan fisika dan perubahan kimia secara tepat dan rasional[cite: 2].
* **Kerapatan Zat:** Melalui simulasi perhitungan dan aktivitas pada kolam virtual aplikasi, peserta didik kelas VII dapat menghitung nilai massa jenis (ρ = m/V) serta menganalisis syarat fenomena mengapung, melayang, dan tenggelam secara akurat[cite: 2].

## 4. KONTEN 3: PROFIL PENYUSUN
* **Instruksi Foto:** Ambil aset gambar dari *path*: **`image/info/profil_pengembang.png`**. Terapkan CSS `border-radius: 50%` dan `object-fit: cover` agar foto tampil melingkar sempurna (*circular avatar*). Posisikan di tengah atas kartu profil.
* **Data Profil:**
  * **Nama:** Ni Wayan Putri Juniantari Dewi[cite: 2].
  * **NIM:** 2313071005[cite: 2].
  * **E-mail:** putri.juniantari@student.undiksha.ac.id[cite: 2].
  * **Judul:** Pengembangan Aplikasi Mobile Learning IPA Terintegrasi Kearifan Lokal Pada Materi Zat dan Perubahannya untuk Siswa SMP/MTs[cite: 2].

## 5. KONTEN 4: DAFTAR PUSTAKA
**Instruksi CSS Khusus (Hanging Indent & Tanpa Nomor):** 
Bungkus daftar pustaka dalam elemen daftar tanpa nomor (`<ul>` dengan CSS `list-style-type: none`), lalu terapkan properti CSS `padding-left: 20px; text-indent: -20px; margin-bottom: 10px;` pada setiap baris referensi agar baris kedua dan seterusnya menjorok ke dalam dengan rapi tanpa adanya penomoran angka di depannya.

**Daftar Teks (Tanpa Nomor):**
* Arikunto, S. (2021). Dasar-Dasar Evaluasi Pendidikan Edisi 3. Bumi Aksara[cite: 2].
* Ayunita, N. L. M., Suardana, I. N., & Priyanka, L. M. (2022). Analisis Budaya Lokal Ngaben di Bali sebagai Pendukung Materi dalam Pembelajaran IPA SMP. Jurnal Pendidikan Dan Pembelajaran Sains Indonesia (JPPSI)[cite: 2].
* Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). (2022). Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) pada Kurikulum Merdeka untuk Jenjang Pendidikan Dasar dan Menengah. Jakarta: Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia[cite: 2].
* Cahaya, N., Fauziah, N., Ferazona, S., & Hidayati, N. (2024). Lembar Praktikalitas: Instrumen yang Digunakan untuk Menilai Produk yang Dikembangkan pada Penelitian Pengembangan Bidang Pendidikan. Biology and Education Journal[cite: 2].
* Dewi, N. L. P. P. P., Suardana, I. N., & Priyanka, L. M. (2022). Kajian Etnosains Proses Pembuatan Arak Bali di Desa Tri Eka Buana sebagai Suplemen Materi IPA SMP. Jurnal Pendidikan Dan Pembelajaran Sains Indonesia (JPPSI)[cite: 2].
* Inabuy, V., Sutia, C., Maryana, O. F. T., Hardanie, B. D., & Lestari, S. H. (2021). Ilmu Pengetahuan Alam untuk SMP Kelas VII. Pusat Kurikulum dan Perbukuan Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi[cite: 2].
* Khoirunnabila, A. I., Wakhidah, N., Fajar Arum, W., Inayah, N., & Ummah, K. (2025). Keterampilan Proses Sains Siswa Pada Materi Zat Dan Perubahannya. JPFT (Jurnal Pendidikan Fisika Tadulako Online)[cite: 2].
* Wahyuni, S., Wulandari, E. U. P., Rusdianto, Fadilah, R. E., & Yusmar, F. (2022). PENGEMBANGAN MOBILE LEARNING MODULE BERBASIS ANDROID UNTUK MENINGKATKAN LITERASI DIGITAL SISWA SMP. LENSA (Lentera Sains): Jurnal Pendidikan IPA[cite: 2].