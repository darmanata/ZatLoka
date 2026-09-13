# PRD Tahap 2: Eksplorasi Zat (Level 1-4) - Integrasi UI & Konten Materi

## 1. Spesifikasi Tata Letak & Navigasi Utama
* **Maskot Kima:** Menggunakan aset `mascot-kima-waving.json` (berada di kanan bawah). Muncul dengan animasi *fade-in*, menampilkan balon teks: *"Hebat! Kamu menemukan petunjuk baru, mari amati!"*, lalu menghilang otomatis setelah 5-7 detik.
* **Navigasi Layar:** Menggunakan ikon panah minimalis (Kiri untuk `[ < Back ]`, Kanan untuk `[ Next > ]`) di bagian bawah layar[cite: 3].
* **Tombol Cepat:** Ikon `[ Home ]` di sudut atas untuk kembali ke Menu Beranda[cite: 3].
* **Sistem Modal/Pop-up:** Teks panjang dan penjelasan fakta disajikan dalam *Pop-up* transparan gelap di tengah layar yang dilengkapi tombol "Tutup (X)".

---

## 2. Struktur Layar & Naskah Materi (Data Binding)
*Instruksi untuk Antigravity: Eksekusi antarmuka di bawah ini beserta teks konten pastinya secara statis/reaktif di dalam file komponen Vue/HTML.*

### LEVEL 1: DETEKTIF PEMULA (Fokus: Wujud Zat & Model Partikel)[cite: 3]
**Layar 1.1: Rahasia Penyulingan Arak Bali**[cite: 3]
* **Instruksi Layar:** "Ketuk salah satu objek pada alat penyulingan arak di bawah ini untuk menyelidiki wujudnya!"[cite: 3]
* **Logika UI:** Menggunakan `tungku-panci.png` (Relatif) sebagai dasar. Objek lainnya menggunakan *Absolute Positioning*. Saat objek diklik, muncul *Pop-up* teks berikut:
  * Klik `bambu-suling.png` $\rightarrow$ **Wujud Padat:** "Bambu penyulingan memiliki wujud PADAT. Zat padat memiliki bentuk dan volume yang selalu tetap, serta tidak berubah meskipun dipindahkan ke tempat yang berbeda."[cite: 3]
  * Klik `tetesan-cair.png` $\rightarrow$ **Wujud Cair:** "Tetesan arak memiliki wujud CAIR. Zat cair memiliki volume yang tetap, tetapi bentuknya selalu berubah mengikuti bentuk wadah penampungnya."[cite: 3]
  * Klik `uap-gas.png` $\rightarrow$ **Wujud Gas:** "Uap panas yang mengepul memiliki wujud GAS. Zat gas tidak memiliki bentuk dan volume yang tetap; bentuk dan volumenya selalu berubah memenuhi seluruh ruang yang ditempatinya."[cite: 3]

**Layar 1.2: Menembus Partikel Rahasia**[cite: 3]
* **Instruksi Layar:** "Pilih tab wujud zat di bawah ini untuk melihat susunan partikel mikroskopisnya!"[cite: 3]
* **Logika UI:** Membuat 3 Tab Navigasi ([Tab Padat], [Tab Cair], [Tab Gas]). Setiap tab menampilkan animasi susunan molekul dan teks berikut:
  * **[Tab Padat]:** *Visual:* Partikel biru rapat bergetar. *Teks:* "Catatan Penting Detektif: Tahukah kamu? Partikel pada benda padat seperti bambu sebenarnya TIDAK DIAM MUTLAK! Partikelnya selalu bergetar di tempatnya dan tetap memiliki rongga/jarak antarpartikel yang sangat sempit, meskipun ikatan antarpartikelnya sangat kuat."[cite: 3]
  * **[Tab Cair]:** *Visual:* Partikel agak renggang bergeser. *Teks:* "Partikel zat cair seperti arak tersusun agak renggang. Gaya tarik antarpartikelnya tidak sekuat zat padat, sehingga partikel cair dapat bergerak bebas bergeser namun tidak sampai lepas dari kelompoknya."[cite: 3]
  * **[Tab Gas]:** *Visual:* Partikel berjauhan gerak acak. *Teks:* "Partikel zat gas tersusun sangat berjauhan. Gaya tarik antarpartikelnya sangat lemah sehingga partikel gas bebas melesat cepat ke seluruh sudut ruangan."[cite: 3]

### LEVEL 2: PENJELAJAH MATERI (Fokus: Perubahan Wujud Zat)[cite: 3]
**Layar 2.1: Menjemur Air Laut di Pesisir Bali**[cite: 3]
* **Instruksi Layar:** "Geser slider suhu matahari ke kanan untuk menaikkan panas terik dan amati perubahan air laut!"[cite: 3]
* **Logika UI:** Slider Suhu (Mendung $\rightarrow$ Panas Terik).
  * *Slider di Geser:* Opasitas `air-laut.png` menurun. Animasi `uap-air.png` naik. Muncul teks: "Proses Menguap: Panas matahari memberikan energi kalor pada air laut. Partikel air menyerap kalor tersebut, bergerak semakin cepat, lalu merenggangkan jaraknya hingga berubah menjadi wujud gas (uap air)."[cite: 3]
  * *Slider Maksimal:* `air-laut.png` hilang, `kristal-garam.png` muncul. Muncul teks: "Proses Mengkristal: Setelah cairan air menguap, partikel garam yang tertinggal menyatukan diri, saling melepaskan energi panas, dan merapat kaku menjadi butiran kristal garam padat."[cite: 3]

**Layar 2.2: Rahasia di Balik Perubahan Wujud**[cite: 3]
* **Teks Pop-up Utama:** "FAKTA SAINS ILMIAH: Perubahan wujud dari cair menjadi gas (menguap) maupun menjadi padat (mengkristal) HANYA MENGUBAH JARAK DAN PERGERAKAN ANTARPARTIKELNYA SAJA. Identitas, jenis, dan massa dari partikel zat itu sendiri TIDAK PERNAH BERUBAH. Partikel garam cair dan partikel kristal garam padat memiliki sifat materi yang sama persis!"[cite: 3]

### LEVEL 3: ILMUWAN MUDA (Fokus: Perubahan Fisika dan Kimia)[cite: 3]
**Layar 3.1 & 3.2: Mengamati Pembakaran Dupa & Analisis**[cite: 3]
* **Instruksi Layar:** "Tekan tombol untuk menyalakan dupa dan amati dua jenis perubahan yang terjadi!"[cite: 3]
* **Logika UI:** Tombol [ Nyalakan Dupa ]. Saat ditekan, aset `wadah-pasepan.png` ditukar posisinya (state swapping) dengan `dupa-abu.png`. Kemudian, tampilkan 2 Kotak Analisis:
  * **[Perubahan Fisika]:** "Penguapan Aroma Terapi Dupa. Proses: Saat dupa menghangat, zat wewangian di dalam dupa berubah dari cair menjadi gas aroma terapi yang memenuhi ruangan. Sifat: TIDAK MENGHASILKAN ZAT BARU."[cite: 3]
  * **[Perubahan Kimia]:** "Pembakaran Serbuk Kayu Dupa. Proses: Api membakar serbuk kayu pada batang dupa secara perlahan hingga berubah menjadi abu dan asap karbon hitam. Sifat: MENGHASILKAN ZAT BARU. Proses pembakaran merombak ikatan kimia partikel kayu dupa menjadi abu dan gas karbon yang memiliki sifat sepenuhnya berbeda (Irreversible)."[cite: 3]

### LEVEL 4: MASTER SAINS (Fokus: Kerapatan Zat)[cite: 3]
**Layar 4.1: Rahasia Mengapung dan Tenggelam**[cite: 3]
* **Instruksi Layar:** "Seret (drag) bambu dan koin logam ke dalam kolam air untuk menguji kerapatan massa jenisnya!"[cite: 3]
* **Logika UI:** Fitur Drag-and-Drop menggunakan rumus $\rho = \frac{m}{V}$[cite: 3].
  * *Drag `bambu-potong.png`:* Objek mengapung di atas air. Tampilkan *Pop-up* Zoom Bambu dan Teks: "Bambu Mengapung: Bambu memiliki struktur dengan banyak rongga udara di dalamnya. Hal ini membuat partikel penyusunnya tidak terlalu rapat dalam volume tersebut, sehingga Massa Jenis Bambu lebih kecil daripada Massa Jenis Air ($\rho_{\text{bambu}} < \rho_{\text{air}}$)."[cite: 3]
  * *Drag `koin-logam.png`:* Objek tenggelam di dasar kolam. Tampilkan *Pop-up* Zoom Logam dan Teks: "Koin Logam Tenggelam: Koin logam tersusun atas partikel-partikel atom yang sangat amat rapat dan padat. Hal ini membuat jumlah massa per satuan volumenya sangat besar, sehingga Massa Jenis Logam lebih besar daripada Massa Jenis Air."[cite: 3]

---
*Setelah Layar 4 selesai, munculkan dua tombol navigasi akhir: [ Kembali ke Beranda ] atau [ Lanjutkan ke Kuis ].*