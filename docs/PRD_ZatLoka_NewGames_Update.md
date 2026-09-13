# PRODUCT REQUIREMENTS DOCUMENT (PRD) - ZATLOKA LOKA-PLAY
## UPDATE: PENAMBAHAN TIPE GAME BARU

**PENTING UNTUK DEVELOPER (ANTIGRAVITY):** 
Dokumen ini memuat spesifikasi untuk beberapa tipe permainan baru (True/False, Memory Game, dan Multiple Choice). Tambahkan permainan-permainan ini ke dalam menu `Loka-play` **TANPA MENGHAPUS, MENIMPA, ATAU MENGHILANGKAN** game-game yang sudah ada sebelumnya. Sistem global state (seperti EXP utama pemain) harus saling terhubung dengan lancar.

---

## 🎮 TRUE/FALSE QUESTION (KUIS CEPAT)

### 1. Deskripsi & UI
Kuis berpacu dengan waktu (Time-Attack).
*   **UI Atas:** Timer hitung mundur (15 detik), Skor/EXP saat ini, dan Indikator *Combo Strike*.
*   **UI Tengah:** Kartu Teks Pernyataan.
*   **UI Bawah:** Dua tombol besar (🟢 BENAR dan 🔴 SALAH).

### 2. Mekanisme & Logika Gamifikasi
*   **Waktu:** 15 detik per soal. Jika waktu habis, langsung **Game Over** (melompat ke layar evaluasi akhir).
*   **Randomisasi:** Urutan ke-7 soal harus diacak (Random/Shuffle) setiap kali permainan dimulai.
*   **EXP & Bonus:**
    *   Skor Dasar: **+10 EXP** per jawaban benar.
    *   Speed Bonus: Jika dijawab dalam $\le$ 3 detik, EXP menjadi **+15 EXP**.
    *   Combo Strike: Benar 3x beruntun (Multiplier x2). Benar 5x beruntun (Multiplier x3 + animasi pendaran cahaya).
*   **Feedback:** Muncul popup "Umpan Balik Cepat" sekilas setiap selesai menjawab satu soal (baik benar maupun salah).

### 3. Data Soal (7 Soal)
**Soal 1 (Dupa)**
*   Pernyataan: "Batang dupa harum Bali memiliki bentuk dan volume yang selalu tetap karena gaya tarik antarpartikel penyusunnya sangat lemah dan bergerak bebas."
*   Kunci: **SALAH**
*   Feedback: "Salah! Batang dupa berwujud padat, sehingga gaya tarik antarpartikelnya sangat kuat dan tersusun rapat."

**Soal 2 (Minyak Atraktan)**
*   Pernyataan: "Minyak atraktan dupa dapat dituangkan ke berbagai wadah karena partikel zat cair masih memiliki gaya tarik cukup kuat, tetapi partikelnya dapat saling menggelincir."
*   Kunci: **BENAR**
*   Feedback: "Tepat sekali! Partikel zat cair dapat saling menggelincir sehingga bentuknya menyesuaikan wadah."

**Soal 3 (Destilasi Arak)**
*   Pernyataan: "Proses pembentukan tetesan Arak Bali dari uap alkohol pada pipa pendingin merupakan peristiwa mengembun yang membutuhkan/menyerap kalor dari lingkungan."
*   Kunci: **SALAH**
*   Feedback: "Salah! Mengembun adalah proses melepaskan kalor, bukan menyerap kalor."

**Soal 4 (Es Daluman)**
*   Pernyataan: "Saat es batu dalam es daluman menyerap kalor dan mencair, energi kinetik partikelnya meningkat sehingga pergerakan partikel semakin cepat."
*   Kunci: **BENAR**
*   Feedback: "Benar! Penyerapan kalor membuat energi kinetik partikel meningkat dan ikatan kaku merenggang."

**Soal 5 (Garam Kusamba)**
*   Pernyataan: "Benda lebih mudah terapung di atas air laut pekat petakan Garam Kusamba karena air laut pekat memiliki massa jenis ($\rho$) yang lebih kecil daripada air tawar biasa."
*   Kunci: **SALAH**
*   Feedback: "Salah! Air laut pekat memiliki massa jenis yang lebih besar, sehingga menghasilkan gaya apung yang lebih tinggi."

**Soal 6 (Pembakaran Dupa)**
*   Pernyataan: "Pembakaran batang dupa harum tergolong ke dalam Perubahan Kimia karena menghasilkan zat baru (abu dan gas) yang sifatnya tidak dapat kembali ke bentuk semula."
*   Kunci: **BENAR**
*   Feedback: "Tepat! Pembakaran dupa menghasilkan zat baru dan bersifat irreversible (Perubahan Kimia)."

**Soal 7 (Kristalisasi Garam)**
*   Pernyataan: "Proses terbentuknya kristal garam dari penguapan air laut Kusamba tergolong Perubahan Kimia karena terjadi perubahan warna pada air laut."
*   Kunci: **SALAH**
*   Feedback: "Salah! Pengkristalan garam adalah Perubahan Fisika karena hanya pemisahan campuran tanpa membentuk zat kimia baru."

---

## 🎮 MEMORY GAME (PENCOCOKAN KARTU)

### 1. Deskripsi & UI
Mencari pasangan kartu antara fenomena Etnosains dan Konsep Sains Sub-Mikroskopis.
*   **Tata Letak:** Grid 3 x 4 (3 Baris, 4 Kolom) responsif untuk layar Landscape.
*   **UI/Visual:** Menggunakan murni CSS 3D Transform (`rotateY`) untuk efek membalik kartu. Bagian belakang kartu berhiaskan pola CSS berulang tema Bali dan teks "ZatLoka". Menggunakan *native emoji* (🏆, 👏, 🎆) untuk animasi.
*   **Path Gambar Depan:** `/assets/images/memory_game/`

### 2. Mekanisme & Logika Gamifikasi
*   **Aturan Main:** Klik 2 kartu. Jika cocok (Etnosains $\leftrightarrow$ Sains), kartu tetap terbuka, *glow* hijau, dan muncul emoji 🏆. Jika salah, tertutup kembali (delay 0.8 detik). Klik dikunci selama kartu sedang mengecek kecocokan (cegah *spam click*).
*   **Penilaian (Berbasis Langkah/Move):**
    *   $\le$ 12 Langkah = 3 Bintang (**+50 EXP**)
    *   13 - 18 Langkah = 2 Bintang (**+30 EXP**)
    *   $>$ 18 Langkah = 1 Bintang (**+10 EXP**)
*   **Pop-up Menang:** Muncul animasi confetti (JS Confetti) & emoji tepuk tangan dengan teks "Suksma! Memorimu Sangat Tajam!".

### 3. Data Kartu (6 Pasang / 12 Kartu)
*   **Pasangan 1:** [Batang Dupa / Bentuk Tetap] $\leftrightarrow$ [Partikel Padat Rapat]
*   **Pasangan 2:** [Asap Dupa / Bergerak Bebas] $\leftrightarrow$ [Partikel Gas Acak / Tarik Lemah]
*   **Pasangan 3:** [Destilasi Arak / Tetesan] $\leftrightarrow$ [Kondensasi / Lepas Kalor]
*   **Pasangan 4:** [Es Daluman Meleleh] $\leftrightarrow$ [Mencair / Serap Kalor]
*   **Pasangan 5:** [Garam Kusamba / Terapung] $\leftrightarrow$ [Larutan Pekat / Massa Jenis Besar]
*   **Pasangan 6:** [Pembakaran Dupa] $\leftrightarrow$ [Perubahan Kimia / Zat Baru]

---

## 🎮 MULTIPLE CHOICE (SUDDEN DEATH)

### 1. Deskripsi & UI
Kuis pilihan ganda dengan 8 soal, alur progresif, dan hukuman berat (ulang dari awal) jika salah.
*   **UI Atas:** Indikator Level (Cth: *Level 1/4: Wujud Zat*), dan *Count-up Timer* (Waktu berjalan maju dari 00:00).
*   **UI Tengah:** 1 Soal tampil di layar dengan 4 tombol opsi (A, B, C, D).

### 2. Mekanisme & Logika Gamifikasi
*   **Struktur Level:** Urutan level bersifat pasti (Level 1 $\rightarrow$ 2 $\rightarrow$ 3 $\rightarrow$ 4).
*   **Randomisasi Internal:** Di dalam setiap level terdapat 2 soal. Urutan ke-2 soal ini harus DIACAK.
*   **Reward:** **+20 EXP** per soal yang dijawab benar. Bonus **+50 EXP** jika menyelesaikan seluruh 8 soal di bawah **05:00 menit**.
*   **Kondisi BENAR:** Menampilkan *SweetAlert/Modal* popup "Pembahasan" (sesuai data soal di bawah), lalu klik "Lanjut" ke soal berikutnya.
*   **Kondisi SALAH (Sudden Death):** Layar bergetar. EXP hangus. Muncul *Pop-up Game Over* dengan 2 tombol:
    1. **"Ulangi Kuis dari Awal"**: Reset murni ke Soal 1 Level 1, timer reset, urutan soal diacak ulang.
    2. **"Kembali ke Menu Loka-play"**.

### 3. Data Soal (8 Soal, 4 Opsi)

**LEVEL 1: WUJUD ZAT**
*   **Soal 1:** Saat proses pembuatan dupa harum Bali, adonan bahan dipadatkan menjadi bentuk batang dupa. Pernyataan yang benar mengenai sifat wujud zat padat...
    *   A. Bentuk berubah-ubah, volume tetap...
    *   B. Bentuk dan volume tetap, serta partikel terikat kuat...
    *   C. Bentuk dan volume berubah-ubah...
    *   D. Bentuk tetap, volume berubah...
    *   *Kunci:* **B** | *Pembahasan:* Batang dupa merupakan zat padat. Memiliki bentuk dan volume tetap karena gaya tarik antarpartikel sangat kuat serta tersusun rapat.
*   **Soal 2:** Ketika minyak atraktan dupa dituangkan ke wadah, bentuk mengikuti wadah namun volume tetap. Hal ini karena partikel zat cair...
    *   A. Memiliki gaya tarik sangat kuat sehingga tidak bergerak...
    *   B. Terikat sangat lemah dan bebas...
    *   C. Masih memiliki gaya tarik cukup kuat, namun partikel dapat saling menggelincir...
    *   D. Tidak memiliki massa...
    *   *Kunci:* **C** | *Pembahasan:* Jarak antarpartikel sedikit renggang dan gaya tariknya agak lemah, memungkinkan partikel untuk saling berpindah/menggelincir.

**LEVEL 2: PERUBAHAN WUJUD**
*   **Soal 3:** Pada proses pembuatan Arak Bali, uap alkohol dimandikan melalui pipa pendingin hingga menetes menjadi cairan. Proses perubahan wujudnya adalah...
    *   A. Menguap (memerlukan kalor)
    *   B. Mengembun/Kondensasi (melepaskan kalor)
    *   C. Menyublim (melepaskan kalor)
    *   D. Membeku (memerlukan kalor)
    *   *Kunci:* **B** | *Pembahasan:* Perubahan wujud gas menjadi cair disebut mengembun. Proses ini terjadi karena uap melepaskan kalor ke lingkungan pendingin.
*   **Soal 4:** Ketika es batu dipanaskan hingga meleleh, terjadi perubahan pada partikel, yaitu...
    *   A. Energi kinetik berkurang...
    *   B. Partikel bertambah banyak...
    *   C. Partikel menyerap panas sehingga gerakan cepat dan ikatan merenggang...
    *   D. Partikel zat padat berubah menjadi udara...
    *   *Kunci:* **C** | *Pembahasan:* Saat mencair, zat menyerap kalor yang meningkatkan energi kinetik partikel sehingga pergerakannya cepat mengatasi gaya tarik yang kaku.

**LEVEL 3: MASSA JENIS**
*   **Soal 5:** Air laut pekat di Kusamba memiliki massa jenis ($\rho$) lebih besar dibandingkan air tawar. Benda di dalam air laut pekat akan lebih mudah...
    *   A. Tenggelam ke dasar...
    *   B. Terapung karena gaya ke atas air laut lebih besar...
    *   C. Lenyap dan mencair...
    *   D. Menyerap air laut...
    *   *Kunci:* **B** | *Pembahasan:* Semakin besar massa jenis cairan, makin besar gaya apungnya, sehingga benda lebih mudah terapung.
*   **Soal 6:** Zat yang memiliki massa jenis paling besar pada umumnya memiliki ciri...
    *   A. Partikelnya tersusun sangat rapat dan jumlah massa per satuan volumenya tinggi...
    *   B. Jarak antarpartikelnya sangat berjauhan...
    *   C. Partikel bergerak bebas...
    *   D. Volume berubah-ubah...
    *   *Kunci:* **A** | *Pembahasan:* Kerapatan partikel berbanding lurus dengan massa jenis. Makin rapat partikel, makin besar massa per satuan volumenya.

**LEVEL 4: PERUBAHAN FISIKA & KIMIA**
*   **Soal 7:** Di antara peristiwa: 1) Garam melarut, 2) Pembakaran dupa menghasilkan abu, 3) Es meleleh, 4) Pembusukan janur. Yang tergolong Perubahan Kimia adalah...
    *   A. 1 dan 3
    *   B. 1 dan 4
    *   C. 2 dan 4
    *   D. 2 dan 3
    *   *Kunci:* **C** | *Pembahasan:* Perubahan kimia menghasilkan zat baru yang sifatnya tidak dapat kembali ke asal. Pembakaran dupa (2) dan pembusukan janur (4) menghasilkan zat baru.
*   **Soal 8:** Pembuatan garam di Kusamba dengan menguapkan air laut dikategorikan sebagai Perubahan Fisika karena...
    *   A. Terbentuk zat kimia baru beracun...
    *   B. Sifat kimia garam berubah total...
    *   C. Tidak menghasilkan zat baru, hanya pemisahan campuran dan perubahan wujud...
    *   D. Terjadi perubahan warna permanen...
    *   *Kunci:* **C** | *Pembahasan:* Pengkristalan garam melalui penguapan tidak menghasilkan zat baru. Garam yang mengkristal tetap memiliki rumus dan sifat kimia yang sama.