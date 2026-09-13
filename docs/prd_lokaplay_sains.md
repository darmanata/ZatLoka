### PRD & INSTRUKSI PENGEMBANGAN: FITUR LOKA-PLAY

**1. SINKRONISASI WARNA GLOBAL (WAJIB)**
Terapkan palet warna Beranda (Slate/Off-white untuk latar belakang, Primary Blue untuk tombol aktif) dan font membulat (rounded sans-serif) ke SELURUH halaman (Peta Level, Eksplorasi Zat, Kuis, Profil Siswa, dan Loka-play).

**2. GAME 1: DRAG AND DROP VISUAL ("Misteri Wujud Benda")**
**Mekanika UI:** Papan Kategori (Drop Zone) di atas layar berjajar horizontal (gunakan flex-wrap). Bank Kartu di bawah layar menggunakan Horizontal Scroll (geser kiri/kanan) dengan efek bayangan (fade) di tepi area scroll. Saat kartu ditarik ke atas, kartu di bawah otomatis bergeser merapat. Tarikan salah terpental kembali, tarikan benar menempel.
**Aset:** Gunakan format .webp dari folder `image/lokaplay/`.

**Konten Soal 1 (Wujud Zat):**
Instruksi: "Seret setiap kartu benda etnosains Bali di bawah ini ke dalam Papan Wujud Zat yang sesuai!"
Drop Zone: Padat, Cair, Gas.
Kunci: Padat (`card-dupa.webp`, `card-kayu.webp`), Cair (`card-minyak.webp`, `card-arak.webp`), Gas (`card-asap.webp`).

**Konten Soal 2 (Perubahan Wujud Zat):**
Instruksi: "Seret kartu proses perubahan wujud zat pada tradisi Bali berikut ke dalam wadah jenis keterlibatan energi panasnya!"
Drop Zone: Memerlukan Kalor, Melepaskan Kalor.
Kunci: Memerlukan (`card-garam-uap.webp`, `card-es-daluman.webp`), Melepaskan (`card-embun-arak.webp`, `card-adonan.webp`).

**Konten Soal 3 (Kerapatan Zat):**
Instruksi: "Seret benda-benda di bawah ini ke posisi keterserapannya di dalam bejana berisi Air Laut Pekat Kusamba!"
Drop Zone: Terapung, Tenggelam.
Kunci: Terapung (`card-telur.webp`, `card-batang-dupa.webp`), Tenggelam (`card-batu.webp`).

**Konten Soal 4 (Perubahan Fisika & Kimia):**
Instruksi: "Kelompokkan fenomena kearifan lokal Bali di bawah ini ke dalam jenis perubahan zat yang tepat!"
Drop Zone: Perubahan Fisika, Perubahan Kimia.
Kunci: Fisika (`card-kristal.webp`, `card-garam-larut.webp`), Kimia (`card-bakar-dupa.webp`, `card-janur.webp`, `card-fermentasi.webp`).

---

**3. GAME 2: DRAG THE WORDS ("Detektif Kalor")**
**Mekanika UI:** Tanpa aset gambar ilustrasi, fokus pada tipografi besar dan jelas. Paragraf berada di tengah atas dengan kotak kosong [ Drop ]. Lebar kotak dinamis mengikuti panjang kata. Bank Kata di bawah layar dengan Horizontal Scroll. Validasi menggunakan tombol "Cek Jawaban" di akhir (kata benar hijau/terkunci, kata salah merah lalu terpental).

**Konten Teks & Kunci Jawaban:**
Soal 1: "Saat membuat dupa harum, adonan bahan dipadatkan hingga berwujud [Padat] yang memiliki bentuk dan volume tetap karena partikelnya tersusun rapat. Ketika dupa dibakar, muncul asap berwujud [Gas] yang bentuknya berubah-ubah mengikuti ruang karena gaya tarik antarpartikelnya sangat [Lemah]." (Bank Kata: Padat, Gas, Lemah, Cair, Kuat).

Soal 2: "Minyak atraktan dupa berwujud cair dapat dituangkan ke berbagai botol karena partikelnya dapat saling [Menggelincir]. Jarak antarpartikel zat cair lebih [Renggang] dibandingkan zat padat..." (Bank Kata: Menggelincir, Renggang, Rapat, Kaku).

Soal 3: "Dalam pembuatan Arak Bali, uap alkohol hasil pemanasan mengalami perubahan wujud menjadi tetesan cair yang disebut [Mengembun]. Perubahan dari fase gas ke cair ini terjadi karena uap alkohol [Melepaskan] energi panas (kalor) saat melewati pipa pendingin." (Bank Kata: Mengembun, Melepaskan, Menguap, Menyerap).

Soal 4: "Ketika es batu dipanaskan hingga meleleh, partikel air akan [Menyerap] kalor dari lingkungan. Penambahan energi ini menyebabkan energi kinetik partikel [Meningkat] sehingga pergerakan partikel semakin cepat..." (Bank Kata: Menyerap, Meningkat, Melepaskan, Menurun).

Soal 5: "Air laut pekat pada petakan garam Kusamba memiliki massa jenis yang lebih [Tinggi] dibandingkan air tawar. Besarnya massa jenis ini disebabkan oleh susunan partikel terlarut yang sangat [Rapat]..." (Bank Kata: Tinggi, Rapat, Rendah, Renggang).

Soal 6: "Massa jenis didefinisikan sebagai perbandingan antara massa dengan [Volume] suatu zat. Semakin rapat partikel-partikel tersusun dalam suatu ruang, maka massa jenis zat tersebut akan semakin [Besar]." (Bank Kata: Volume, Besar, Suhu, Kecil).

Soal 7: "Pembakaran dupa Bali yang menghasilkan asap beraroma serta pembusukan janur banten tergolong ke dalam Perubahan [Kimia]. Hal ini dikarenakan proses tersebut menghasilkan [Zat Baru] yang sifatnya tidak dapat kembali ke bentuk semula." (Bank Kata: Kimia, Zat Baru, Fisika, Endapan).

Soal 8: "Proses pembuatan garam Kusamba melalui penguapan air laut merupakan contoh Perubahan [Fisika]. Proses ini hanya melibatkan perubahan wujud dan pemisahan campuran tanpa [Membentuk] zat kimia baru." (Bank Kata: Fisika, Membentuk, Kimia, Pemisahan).

---

**4. GAME 3: TANTANGAN MASTER SAINS (MULTIPLE CHOICE)**
**Mekanika UI:** Tema Game Show (100% CSS). Acak urutan 8 soal secara dinamis. Tampilkan 3 Nyawa (♥️ ♥️ ♥️). Jika menjawab benar: Popup hijau, selebrasi emoji, teks pujian + "Pembahasan", lanjut soal berikutnya. Jika salah: Popup oranye, teks "Pembahasan", kurangi 1 nyawa, lanjut soal berikutnya. Jika 3 nyawa habis: Game Over. Jika selesai 8 soal: Victory Screen.

**Konten Soal (Opsi benar ditandai asteriks *):**
1. Saat proses pembuatan dupa harum Bali, adonan bahan dipadatkan menjadi bentuk batang dupa. Pernyataan yang benar mengenai sifat wujud zat padat pada batang dupa tersebut berdasarkan teori partikel adalah...
A. Bentuk berubah-ubah, volume tetap, dan jarak antarpartikel sangat berjauhan
B. Bentuk dan volume tetap, serta partikel-partikelnya terikat kuat dan beraturan (*)
C. Bentuk dan volume berubah-ubah, serta partikelnya bergerak bebas
D. Bentuk tetap, volume berubah, dan partikelnya mudah berpindah tempat
Pembahasan: Batang dupa merupakan zat padat. Zat padat memiliki bentuk dan volume yang tetap karena gaya tarik antarpartikelnya sangat kuat serta tersusun rapat dan teratur.

2. Ketika minyak atraktan dupa (zat cair) dituangkan ke dalam wadah yang berbeda, bentuknya mengikuti wadah namun volumenya tetap. Hal ini terjadi karena partikel zat cair...
A. Memiliki gaya tarik sangat kuat sehingga tidak bisa bergerak sama sekali
B. Terikat sangat lemah dan bebas meninggalkan kelompoknya
C. Masih memiliki gaya tarik cukup kuat, namun partikelnya dapat saling menggelincir/berpindah (*)
D. Tidak memiliki massa dan tidak menempati ruang
Pembahasan: Pada zat cair, jarak antarpartikel sedikit lebih renggang dibanding zat padat dan gaya tariknya agak lemah, memungkinkan partikel untuk saling berpindah/menggelincir tetapi tidak lepas sepenuhnya.

3. Pada proses pembuatan Arak Bali tradisional, uap alkohol hasil pemanasan dimandikan melalui pipa pendingin hingga menetes menjadi cairan arak murni. Proses perubahan wujud yang terjadi pada pipa pendingin tersebut adalah...
A. Menguap (memerlukan kalor)
B. Mengembun/Kondensasi (melepaskan kalor) (*)
C. Menyublim (melepaskan kalor)
D. Membeku (memerlukan kalor)
Pembahasan: Perubahan wujud dari gas (uap arak) menjadi cair (tetesan arak) disebut mengembun/kondensasi. Proses ini terjadi karena uap melepaskan energi panas (kalor) ke lingkungan pendingin.

4. Ketika es batu dipanaskan hingga meleleh menjadi air cair, terjadi perubahan pada tingkat partikel, yaitu...
A. Energi kinetik partikel berkurang sehingga partikel bergerak lebih lambat
B. Partikel air bertambah banyak dan ukurannya membesar
C. Partikel menyerap energi panas sehingga gerakan partikel semakin cepat dan ikatan merenggang (*)
D. Partikel zat padat berubah menjadi partikel udara
Pembahasan: Saat meleleh/mencair, zat menyerap kalor. Kalor ini meningkatkan energi kinetik partikel sehingga pergerakannya lebih cepat dan mampu mengatasi gaya tarik antarpartikel yang tadinya kaku.

5. Saat pembuatan garam di Kusamba, air laut yang pekat memiliki massa jenis ($\rho$) lebih besar dibandingkan air tawar biasa. Hal ini menyebabkan benda yang dimasukkan ke dalam air laut pekat akan lebih mudah...
A. Tenggelam ke dasar wadah
B. Terapung karena gaya ke atas air laut lebih besar (*)
C. Lenyap dan mencair
D. Menyerap air laut hingga habis
Pembahasan: Semakin besar massa jenis suatu zat cair, makin besar pula gaya apung (gaya ke atas) yang dihasilkannya, sehingga benda lebih mudah terapung di air laut pekat daripada air tawar.

6. Massa jenis suatu zat menunjukkan seberapa rapat partikel-partikel tersusun dalam suatu volume. Zat yang memiliki massa jenis paling besar pada umumnya memiliki ciri...
A. Partikelnya tersusun sangat rapat dan jumlah massa per satuan volumenya tinggi (*)
B. Jarak antarpartikelnya sangat berjauhan
C. Partikelnya bergerak bebas dengan kecepatan tinggi
D. Memiliki volume yang selalu berubah-ubah
Pembahasan: Kerapatan partikel berbanding lurus dengan massa jenis. Semakin rapat susunan partikel dalam suatu ruang, semakin besar massa per satuan volumenya.

7. Di antara peristiwa dalam kehidupan masyarakat Bali berikut: (1) Garam melarut dalam air kopyokan, (2) Pembakaran dupa menghasilkan abu/asap, (3) Es batu meleleh, (4) Pembusukan janur banten. Peristiwa yang tergolong ke dalam Perubahan Kimia ditunjukkan oleh nomor...
A. 1 dan 3
B. 1 dan 4
C. 2 dan 4 (*)
D. 2 dan 3
Pembahasan: Perubahan kimia menghasilkan zat baru yang sifatnya berbeda dan tidak dapat kembali ke bentuk semula. Pembakaran dupa (2) dan pembusukan janur (4) menghasilkan zat baru.

8. Pada pembuatan garam di Kusamba, air laut dialirkan dan diuapkan di bawah sinar matahari hingga menyisakan kristal garam putih. Proses ini dikategorikan sebagai Perubahan Fisika karena...
A. Terbentuk zat kimia baru yang beracun
B. Sifat kimia garam berubah total dibanding saat berada di dalam air laut
C. Tidak menghasilkan zat baru, hanya terjadi pemisahan campuran dan perubahan wujud (*)
D. Terjadi perubahan warna secara permanen
Pembahasan: Pengkristalan garam melalui penguapan air laut tidak menghasilkan zat baru. Garam yang mengkristal tetap memiliki rumus dan sifat kimia yang sama seperti saat terlarut dalam air laut.