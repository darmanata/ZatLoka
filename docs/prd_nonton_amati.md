# PRD & INSTRUKSI PENGEMBANGAN: FITUR "NONTON & AMATI"

## 1. KONSEP UTAMA
* **Akses Bebas:** Fitur ini tidak terikat oleh sistem *Linear Progression* (penguncian). Siswa dapat mengakses semua video sejak awal aplikasi dibuka.
* **Tujuan:** Memberikan wawasan (*insight*) tambahan secara visual mengenai aplikasi konsep sains dalam kehidupan nyata dan tradisi lokal.
* **Efisiensi Penyimpanan:** Sistem tidak menyimpan file video di server/aplikasi, melainkan menggunakan metode **YouTube Embed IFrame**.

## 2. MEKANIKA ANTARMUKA (UI/UX)
* **Tata Letak (Layout):** Gunakan tampilan **Vertical List View** (berjajar ke bawah). 
* **Desain Kartu Video:**
  * **Kiri:** *Thumbnail* video YouTube dengan sudut membulat (*rounded corners*).
  * **Kanan:** Judul video (teks tebal), deskripsi singkat (teks kecil), dan tombol aksi.
* **Kategori Tampilan:** Video dikelompokkan dengan *Header* teks sederhana (misal: teks tebal dengan garis bawah tipis) sebagai pemisah antar kategori, tanpa perlu sistem folder/tab yang rumit.
* **Tombol Gamifikasi:** Di bagian bawah deskripsi setiap video, sediakan tombol **"Selesai Ditonton ✅"**. Jika ditekan:
  * Tombol berubah warna menjadi abu-abu (disabled).
  * Teks berubah menjadi "Sudah Ditonton".
  * Siswa mendapatkan popup kecil "+10 EXP" (opsional, visualisasi penambahan skor/pengalaman).

## 3. KONTEN VIDEO YOUTUBE (Embed Links & Metadata)

Buatlah *Header* kategori dan masukkan daftar video berikut dengan format IFrame Embed standar YouTube:

### Kategori 1: Eksperimen Tradisional & Etnosains Bali
**Video 1.1**
* **Judul:** Rumitnya Pembuatan Garam Kusamba Bali
* **Deskripsi:** Mengamati proses tradisional pembuatan garam organik di Pesisir Kusamba yang memanfaatkan energi panas matahari (kalor).
* **URL Embed:** `https://www.youtube.com/embed/KEaZa37OC9E`

**Video 1.2**
* **Judul:** Proses Pembuatan Arak Bali Tradisional
* **Deskripsi:** Observasi teknik destilasi (penyulingan) tradisional menggunakan bambu pendingin untuk mengubah uap menjadi zat cair.
* **URL Embed:** `https://www.youtube.com/embed/V3ji1CVrvqA`

**Video 1.3**
* **Judul:** Proses Pembuatan Dupa Harum Kaori
* **Deskripsi:** Melihat langsung bagaimana bahan baku padat dicampur dan diolah menjadi batang dupa harum khas Bali.
* **URL Embed:** `https://www.youtube.com/embed/LWdlBUUAFQ0`

### Kategori 2: Wujud Zat & Model Partikel
**Video 2.1**
* **Judul:** Karakteristik Wujud Benda (Padat, Cair, Gas)
* **Deskripsi:** Penjelasan visual mengenai jarak antarpartikel dan bagaimana wujud zat memengaruhi bentuk serta volume benda.
* **URL Embed:** `https://www.youtube.com/embed/3KYTVTl7JvY`

### Kategori 3: Perubahan Wujud Zat
**Video 3.1**
* **Judul:** Macam-macam Zat dan Perubahannya
* **Deskripsi:** Animasi dan penjelasan mengenai pengaruh penyerapan serta pelepasan kalor terhadap titik leleh dan titik didih suatu materi.
* **URL Embed:** `https://www.youtube.com/embed/CfwPsKdC5w8`

### Kategori 4: Perubahan Fisika dan Kimia
**Video 4.1**
* **Judul:** Sifat dan Perubahan Fisika vs Kimia
* **Deskripsi:** Membedakan peristiwa di lingkungan sekitar mana yang tergolong perubahan wujud biasa dan mana yang menghasilkan zat jenis baru.
* **URL Embed:** `https://www.youtube.com/embed/1mz5YoU0YcQ`

### Kategori 5: Kerapatan Zat (Massa Jenis)
**Video 5.1**
* **Judul:** Pengaruh Massa Jenis Benda (Hukum Archimedes)
* **Deskripsi:** Simulasi eksperimen benda mengapung, melayang, dan tenggelam berdasarkan perbedaan tingkat kerapatan partikelnya.
* **URL Embed:** `https://www.youtube.com/embed/tsNX3k78ITA`

## 4. INSTRUKSI TEKNIS IFRAME YOUTUBE
* Pastikan elemen iframe bersifat responsif (`width: 100%`) agar menyesuaikan ukuran layar *smartphone* siswa tanpa terpotong.
* Tambahkan atribut `allowfullscreen` agar siswa dapat menonton dengan tampilan layar penuh saat video diputar.