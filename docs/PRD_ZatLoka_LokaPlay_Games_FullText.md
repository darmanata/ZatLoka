# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## ZatLoka Mobile Learning - Integrasi Fitur LokaPlay Games & Micro-Learning (Full Content)

Dokumen ini memuat spesifikasi teknis lengkap, aturan permainan, sistem ekonomi EXP, serta teks pop-up edukatif dan clue persis sesuai draft untuk tiga tipe permainan interaktif di dalam aplikasi ZatLoka.

---

### 1. GAME 1: TEKA-TEKI SILANG (TTS INTERAKTIF)
*   **Spesifikasi Grid (15x15 Matriks):**
    *   **Mendatar (Across):**
        1. MENGEMBUN -> [11, 1], Panjang: 9. (Clue: Perubahan wujud uap alkohol menjadi tetesan cairan pada pipa pendingin Arak)
        2. ARAK -> [9, 3], Panjang: 4. (Clue: Minuman tradisional Bali hasil fermentasi nira dan destilasi)
        3. SUBMIKROSKOPIS -> [5, 2], Panjang: 14. (Clue: Level representasi IPA tentang wujud zat berdasarkan struktur dan jarak partikel)
        4. UAP -> [6, 1], Panjang: 3. (Clue: Wujud zat yang terbentuk saat air laut Kusamba menguap)
        5. SUHU -> [14, 5], Panjang: 4. (Clue: Derajat panas zat yang jika ditingkatkan mempercepat energi kinetik)
    *   **Menurun (Down):**
        1. MASSAJENIS -> [5, 5], Panjang: 10. (Clue: Ukuran kerapatan partikel. Benda mudah terapung karena nilai ini tinggi)
        2. CAIR -> [3, 14], Panjang: 4. (Clue: Wujud zat minyak atraktan dupa yang bentuknya mengikuti wadah)
        3. DUPA -> [4, 3], Panjang: 4. (Clue: Sarana upakara berwujud padat dengan partikel kaku dan rapat)
        4. KALOR -> [5, 7], Panjang: 5. (Clue: Bentuk energi panas yang diserap/dilepaskan saat perubahan wujud)
        5. KIMIA -> [9, 6], Panjang: 5. (Clue: Jenis perubahan zat pada pembakaran dupa yang menghasilkan abu)

*   **Sistem Bantuan & Validasi EXP:**
    *   Hint 1 Huruf (-50 EXP) | Hint Kata (-30 EXP). Validasi: jika EXP kurang, tampilkan peringatan.

*   **Teks Pop-up Insight Edukatif (Exact Text):**
    *   **MENGEMBUN:** "Luar biasa! Saat uap alkohol berubah menjadi tetesan Arak, partikel uap melepaskan kalor ke pipa bambu yang dingin, membuat jarak antarpartikelnya merapat menjadi wujud cair."
    *   **ARAK:** "Tepat! Arak Bali dihasilkan dari proses penyulingan. Di mana cairan dipanaskan agar partikelnya menguap, lalu didinginkan kembali agar merapat menjadi cair."
    *   **SUBMIKROSKOPIS:** "Hebat! Dengan melihat sesuatu secara sub-mikroskopis, kamu sedang membayangkan benda dari struktur, jarak, dan kecepatan pergerakan partikel terkecilnya!"
    *   **UAP:** "Benar! Saat air laut dipanaskan matahari, partikel air menyerap energi panas. Gerakannya semakin cepat hingga terlepas dari ikatan dan menyebar menjadi uap."
    *   **SUHU:** "Tepat! Suhu adalah derajat panas. Semakin tinggi suhu, semakin besar energi yang diterima partikel untuk bergerak menjauhi satu sama lain."
    *   **MASSAJENIS:** "Kerja bagus! Massa Jenis menunjukkan seberapa rapat partikel di dalam benda. Semakin rapat partikelnya, semakin berat benda itu walau ukurannya kecil!"
    *   **CAIR:** "Tepat! Pada zat cair, gaya tarik antarpartikelnya agak lemah. Partikelnya bisa saling menggelincir, itu sebabnya minyak wangi bisa dituang dan berubah bentuk."
    *   **DUPA:** "Hebat! Batang dupa adalah benda padat. Karena gaya tarik partikelnya kuat, posisinya kaku dan beraturan sehingga bentuknya tidak mudah berubah."
    *   **KALOR:** "Benar! Kalor adalah energi panas. Ketika suatu zat menyerap kalor, partikelnya akan meregang. Saat melepaskan kalor, partikelnya akan merapat."
    *   **KIMIA:** "Tepat sekali! Pembakaran dupa adalah perubahan kimia. Panas menghancurkan ikatan partikel awal dan membentuk molekul zat jenis baru berupa asap yang tak bisa kembali seperti semula."

---

### 2. GAME 2: CARI KATA RAHASIA (FIND THE WORDS)
*   **Spesifikasi:** Matriks dinamis **15 x 15** dengan kata target: `DUPA`, `PADAT`, `MENGEMBUN`, `KALOR`, `MASSAJENIS`, `KIMIA`.
*   **Timer & Bonus:** Count-up timer. Selesai < 01:30 $\rightarrow$ Gelar "Siswa ZatLoka Cendekia" + Bonus +50 EXP.
*   **Hint Sistem:** Biaya 30 EXP untuk menyorot huruf pertama.
*   **Teks Pop-up Insight Edukatif (Exact Text):**
    *   **DUPA:** "Batang dupa merupakan contoh wujud zat padat dalam kearifan lokal Bali yang memiliki bentuk dan volume tetap."
    *   **PADAT:** "Pada zat padat, partikel penyusunnya tersusun sangat rapat, teratur, dan terikat kuat."
    *   **MENGEMBUN:** "Proses perubahan wujud dari gas ke cair pada destilasi Arak Bali, terjadi karena uap melepaskan kalor."
    *   **KALOR:** "Energi panas yang memengaruhi energi kinetik dan kecepatan pergerakan partikel zat."
    *   **MASSAJENIS:** "Ukuran kerapatan partikel (ρ). Air laut pekat Kusamba memiliki massa jenis tinggi sehingga gaya apungnya besar."
    *   **KIMIA:** "Perubahan zat yang menghasilkan zat baru dan bersifat tidak dapat kembali ke bentuk semula (irreversible), seperti pembakaran dupa."

---

### 3. GAME 3: TEBAK JAWABAN (GUESS THE ANSWER)
*   **Struktur Teka-Teki Lengkap (Exact Text):**
    *   **Level 1 (Jawaban: DUPAHARUM)**
        *   Petunjuk 1: "Aku adalah benda beraroma wangi yang selalu hadir dalam setiap upakara yadnya di Bali."
        *   Petunjuk 2: "Bentuk dan volumeku selalu tetap meskipun aku dipindahkan ke berbagai tempat."
        *   Petunjuk 3: "Partikel-partikel penyusunku tersusun sangat rapat, teratur, dan terikat gaya tarik yang sangat kuat."
        *   Umpan Balik: "Hebat! Dupa Harum adalah contoh zat padat dengan susunan partikel sangat rapat dan terikat kuat."
    *   **Level 2 (Jawaban: MENGEMBUN)**
        *   Petunjuk 1: "Aku adalah bagian penting dalam tradisi pembuatan Arak Bali di dalam pipa bambu pendingin."
        *   Petunjuk 2: "Aku mengubah uap alkohol yang panas menjadi tetesan cairan Arak Bali yang murni."
        *   Petunjuk 3: "Prosesku terjadi karena partikel gas melepaskan energi panas (kalor) sehingga pergerakannya merapat."
        *   Umpan Balik: "Suksma! Mengembun (kondensasi) adalah perubahan uap gas menjadi cair akibat pelepasan kalor."
    *   **Level 3 (Jawaban: AIRLAUTPEKAT)**
        *   Petunjuk 1: "Aku berada di petakan kayu kelapa khas petani di daerah pesisir pantai Karangasem Bali."
        *   Petunjuk 2: "Kandungan zat terlarutku yang tinggi membuat benda lebih mudah terapung di atas permukaanku."
        *   Petunjuk 3: "Susunan partikelku sangat rapat sehingga aku memiliki massa jenis (ρ) yang lebih besar dari air tawar."
        *   Umpan Balik: "Luar biasa! Air laut pekat Kusamba memiliki massa jenis tinggi karena kerapatan partikel terlarutnya besar."
    *   **Level 4 (Jawaban: PERUBAHANKIMIA)**
        *   Petunjuk 1: "Aku terjadi ketika dupa Bali dibakar hingga menghasilkan abu dan asap beraroma."
        *   Petunjuk 2: "Prosesku tidak dapat dikembalikan lagi ke bentuk semula (irreversible)."
        *   Petunjuk 3: "Aku menghasilkan zat baru yang memiliki struktur molekul dan sifat kimia berbeda dari bahan asalnya."
        *   Umpan Balik: "Pintar! Pembakaran dupa tergolong Perubahan Kimia karena menghasilkan zat baru (abu dan asap)."

*   **Mekanisme Nyawa & Konversi EXP:**
    *   3 Nyawa Emoji (🪷). Habis $\rightarrow$ Game Over global (mengulang dari awal).
    *   Konversi Poin ke EXP (Rasio 10:1): 3 Bintang = +30 EXP | 2 Bintang = +20 EXP | 1 Bintang = +10 EXP.