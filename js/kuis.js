/* ==========================================================================
   ZATLOKA KUIS & PROGRESI LINIER ENGINE
   Mekanika Kuis 5 PG (Acak) + 3 Esai (Validasi >= 3 kata),
   Sistem Terkunci Linier, Gelar Bertahap, & Ekspor Cetak PDF.
   ========================================================================== */

(function () {
    'use strict';

    // --- 1. DATASET LENGKAP KUIS LEVEL 1 - 4 ---
    // Sesuai teks presisi docs/prd_kuis_progresi.md
    const KUIS_DATA = {
        1: {
            level: 1,
            title: "Wujud Zat & Model Partikel",
            badge: "Level 1: Detektif Pemula",
            rankTitle: "Detektif Pemula",
            pg: [
                {
                    id: "1.1",
                    asset: "kuis1-kompresi-gas.webp", // ANIMASI
                    question: "Ketika gas uap arak dipindahkan dari wadah tabung bervolume besar ke wadah tabung kecil yang tertutup rapat, partikel gas tersebut tetap mampu memenuhi seluruh ruangan wadah yang baru. Berdasarkan konsep sub-mikroskopis, analisis mengapa hal tersebut dapat terjadi...",
                    options: [
                        { text: "Ukuran partikel gas berubah menjadi mengecil saat dipindahkan ke tabung yang lebih sempit.", correct: false },
                        { text: "Gaya tarik antarpartikel gas sangat lemah dan jarak antarpartikelnya sangat berjauhan sehingga partikel dapat dimampatkan dan bergerak bebas menyesuaikan ruang wadah.", correct: true },
                        { text: "Partikel gas berhenti bergerak dan menempel rapat di dinding wadah tabung.", correct: false },
                        { text: "Tekanan dari luar menekan partikel gas agar berubah menjadi zat cair berukuran mikro.", correct: false }
                    ]
                },
                {
                    id: "1.2",
                    asset: "kuis1-grafik-jarak.svg",
                    question: "Zat X memiliki partikel yang tersusun teratur, berjarak sangat rapat, namun partikelnya tetap menunjukkan aktivitas getaran kecil. Jika zat X dimasukkan ke wadah berbeda bentuk, kesimpulan logis apakah yang terjadi?",
                    options: [
                        { text: "Bentuk zat X akan berubah menyesuaikan bentuk wadah barunya.", correct: false },
                        { text: "Zat X akan mencair dengan sendirinya karena partikelnya bergetar terus-menerus.", correct: false },
                        { text: "Bentuk dan volume zat X akan tetap sama persis seperti semula karena gaya tarik antarpartikelnya sangat kuat.", correct: true },
                        { text: "Partikel zat X akan merenggang bebas lepas keluar dari wadah.", correct: false }
                    ]
                },
                {
                    id: "1.3",
                    asset: "kuis1-rongga-bambu.svg",
                    question: "Mengapa bambu (zat padat) masih memungkinkan untuk menyerap sejumlah kecil uap air atau mengalami pemuaian saat dipanaskan?",
                    options: [
                        { text: "Karena partikel zat padat pada bambu dapat memutuskan ikatan dan bergerak acak mengalir.", correct: false },
                        { text: "Karena partikel zat padat tidak diam mutlak dan tetap memiliki rongga/jarak antarpartikel yang memungkinkan getaran partikel meluas.", correct: true },
                        { text: "Karena zat padat sebenarnya tidak memiliki massa jenis yang tetap.", correct: false },
                        { text: "Karena ikatan kimia pada zat padat bersifat cair ketika berada di suhu ruangan.", correct: false }
                    ]
                },
                {
                    id: "1.4",
                    asset: "kuis1-diagram-wujud.svg",
                    question: "Cairan nira dipanaskan berubah menjadi uap panas. Bagaimana perubahan susunan dan energi kinetik partikel yang terjadi?",
                    options: [
                        { text: "Jarak partikel semakin rapat dan energi kinetik gerak partikel melambat.", correct: false },
                        { text: "Susunan partikel berubah dari renggang menjadi teratur serta gaya tariknya menguat.", correct: false },
                        { text: "Jarak partikel berubah dari agak renggang menjadi sangat berjauhan, disertai peningkatan kecepatan gerak partikel secara signifikan.", correct: true },
                        { text: "Ukuran fisik setiap partikel membesar hingga memenuhi udara di sekitarnya.", correct: false }
                    ]
                },
                {
                    id: "1.5",
                    asset: "kuis1-piston-gas.svg",
                    question: "Mengapa volume gas dapat dimampatkan menjadi lebih kecil, sementara sangat sulit pada zat cair?",
                    options: [
                        { text: "Karena gas memiliki ruang kosong yang sangat luas di antara partikel-partikelnya dibandingkan zat cair yang partikelnya sudah bergeseran rapat.", correct: true },
                        { text: "Karena massa partikel gas akan hilang sebagian saat ditekan kuat ke dalam piston.", correct: false },
                        { text: "Karena partikel zat cair tidak memiliki gaya tarik-menarik satu sama lain.", correct: false },
                        { text: "Karena molekul gas dapat melebur menjadi zat padat saat dimampatkan secara perlahan.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e1.1",
                    num: 1,
                    question: "Saat proses penyulingan arak, uap panas yang mengalir dari periuk melewati pipa bambu didinginkan dengan air hingga menetes menjadi cairan. Analisislah mengapa uap gas tersebut bisa berubah kembali menjadi tetesan cairan ketika melewati pipa dingin!"
                },
                {
                    id: "e1.2",
                    num: 2,
                    question: "Banyak orang beranggapan bahwa benda-benda padat (batu, kayu) memiliki partikel penyusun yang diam total. Evaluasilah pernyataan tersebut berdasarkan konsep sains modern pada tingkat sub-mikroskopis!"
                },
                {
                    id: "e1.3",
                    num: 3,
                    question: "Seorang siswa memasukkan bola karet berisi udara ke dalam air dingin, lalu memindahkannya ke tempat panas. Bola tampak lebih tegang dan mengembang. Hubungkan peristiwa ini dengan perubahan jarak antarpartikel dan pergerakan partikel gas!"
                }
            ]
        },

        2: {
            level: 2,
            title: "Perubahan Wujud & Titik Suhu",
            badge: "Level 2: Penjelajah Materi",
            rankTitle: "Penjelajah Materi",
            pg: [
                {
                    id: "2.1",
                    asset: "kuis2-grafik-pemanasan.svg",
                    question: "Saat grafik menunjukkan garis mendatar pada suhu 0°C dan 100°C, suhu zat tidak mengalami kenaikan meski dipanaskan. Analisis mengapa fenomena tersebut terjadi...",
                    options: [
                        { text: "Panas diserap digunakan untuk menaikkan kecepatan gerak partikel secara cepat.", correct: false },
                        { text: "Panas yang diserap digunakan sepenuhnya untuk memutuskan atau merenggangkan ikatan antarpartikel saat mengalami perubahan wujud.", correct: true },
                        { text: "Partikel zat berhenti bergerak sama sekali saat mencapai titik suhu kritis tersebut.", correct: false },
                        { text: "Massa zat mengalami penyusutan sehingga energi panas terbuang ke lingkungan.", correct: false }
                    ]
                },
                {
                    id: "2.2",
                    asset: "kuis2-evaporasi-didih.svg",
                    question: "Perbedaan mendasar penguapan air laut dengan proses air mendidih di dalam panci adalah...",
                    options: [
                        { text: "Penguapan memerlukan api besar, sedangkan mendidih hanya butuh sinar matahari.", correct: false },
                        { text: "Penguapan mengubah identitas kimia air menjadi gas racun, sedangkan mendidih tidak.", correct: false },
                        { text: "Penguapan terjadi pada suhu berapa pun di permukaan zat cair, sedangkan mendidih terjadi pada suhu tertentu di seluruh bagian cairan.", correct: true },
                        { text: "Penguapan melepaskan panas ke lingkungan, sedangkan mendidih menyerap seluruh panas wadah.", correct: false }
                    ]
                },
                {
                    id: "2.3",
                    asset: "kuis2-pipa-pendingin.svg",
                    question: "Jika aliran air dingin pada pipa bambu dihentikan, apa dampak langsung pada perubahan wujud?",
                    options: [
                        { text: "Tetesan arak berubah menjadi kristal padat di ujung corong bambu.", correct: false },
                        { text: "Proses mencair berlangsung lebih cepat karena suhu pipa naik tajam.", correct: false },
                        { text: "Uap gas tidak akan mengalami pengembunan secara maksimal dan akan terus berwujud gas yang lolos keluar.", correct: true },
                        { text: "Suhu di dalam pipa akan turun drastis dan membekukan cairan.", correct: false }
                    ]
                },
                {
                    id: "2.4",
                    asset: "kuis2-kapur-barus.svg",
                    question: "Analisis jarak antarpartikel dan kebutuhan panas pada peristiwa kapur barus (menyublim)...",
                    options: [
                        { text: "Melepaskan panas, jarak berubah sangat rapat.", correct: false },
                        { text: "Menyerap panas, jarak partikel berubah langsung dari sangat rapat (padat) menjadi sangat berjauhan (gas) tanpa melalui fase cair.", correct: true },
                        { text: "Melepaskan panas, jarak berubah dari cair ke padat.", correct: false },
                        { text: "Menyerap panas, ukuran molekul menyusut.", correct: false }
                    ]
                },
                {
                    id: "2.5",
                    asset: "kuis2-grafik-leleh-didih.svg",
                    question: "Mengapa waktu yang dibutuhkan air berubah menjadi uap jauh lebih lama daripada es mencair seluruhnya?",
                    options: [
                        { text: "Karena massa es lebih ringan daripada massa uap air.", correct: false },
                        { text: "Karena titik leleh memerlukan energi panas lebih besar dari panas penguapan.", correct: false },
                        { text: "Karena pemutusan ikatan total dari fase cair menjadi gas memerlukan energi panas yang jauh lebih besar daripada sekadar merenggangkan ikatan padat ke cair.", correct: true },
                        { text: "Karena partikel gas berukuran lebih besar dibanding partikel cair.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e2.1",
                    num: 1,
                    question: "Jika seandainya cuaca mendung total terus menerus selama seminggu, jelaskan kendala apa yang terjadi pada pergerakan partikel air laut dan pembentukan kristal garam Kusamba berdasarkan konsep penyerapan panas!"
                },
                {
                    id: "e2.2",
                    num: 2,
                    question: "Air di pantai mendidih pada suhu 100°C, namun di puncak gunung mendidih pada suhu di bawah 100°C. Evaluasi dan jelaskan mengapa perbedaan tekanan udara luar dapat memengaruhi titik didih ditinjau dari gerakan partikelnya!"
                },
                {
                    id: "e2.3",
                    num: 3,
                    question: "Mengapa luka melepuh akibat terkena uap air mendidih (100°C) terasa jauh lebih parah dibandingkan air panas biasa dengan suhu yang sama? Hubungkan jawabanmu dengan proses pelepasan panas (energi panas laten penguapan)!"
                }
            ]
        },

        3: {
            level: 3,
            title: "Perubahan Fisika & Kimia",
            badge: "Level 3: Ilmuwan Muda",
            rankTitle: "Ilmuwan Muda",
            pg: [
                {
                    id: "3.1",
                    asset: "kuis3-dupa-bakar.svg",
                    question: "Mengapa pembakaran dupa dikategorikan perubahan kimia, sedangkan penguapan aromanya perubahan fisika...",
                    options: [
                        { text: "Pembakaran mengubah wujud padat ke gas secara langsung tanpa sisa.", correct: false },
                        { text: "Pembakaran dupa menghasilkan zat baru yang tidak dapat kembali ke bentuk semula, sedangkan penguapan aroma hanya mengubah wujud zat tanpa mengubah struktur molekulnya.", correct: true },
                        { text: "Pembakaran menyerap panas sedangkan penguapan aroma melepaskan panas.", correct: false },
                        { text: "Pembakaran tidak melibatkan perubahan warna maupun bau pada zat asalnya.", correct: false }
                    ]
                },
                {
                    id: "3.2",
                    asset: "kuis3-fermentasi.svg",
                    question: "Tradisi pembuatan tuak/tape dari nira dengan ragi termasuk jenis perubahan apakah dan apa alasannya?",
                    options: [
                        { text: "Fisika, karena wujud ketan tetap cair/padat.", correct: false },
                        { text: "Fisika, karena prosesnya dibalik dengan pendinginan.", correct: false },
                        { text: "Kimia, karena terjadi pembentukan zat jenis baru yang disertai perubahan rasa dan sifat zat akibat kerja mikroorganisme.", correct: true },
                        { text: "Kimia, karena wujud zat berubah dari gas ke padat secara perlahan.", correct: false }
                    ]
                },
                {
                    id: "3.3",
                    asset: "kuis3-lilin.svg",
                    question: "Analisis perubahan zat pada batang lilin yang meleleh dan sumbu lilin yang terbakar secara berurutan adalah...",
                    options: [
                        { text: "Perubahan kimia dan perubahan kimia.", correct: false },
                        { text: "Perubahan fisika dan perubahan kimia.", correct: true },
                        { text: "Perubahan fisika dan perubahan fisika.", correct: false },
                        { text: "Perubahan kimia dan perubahan fisika.", correct: false }
                    ]
                },
                {
                    id: "3.4",
                    asset: "kuis3-es-karat.svg",
                    question: "Perbedaan sifat kekekalan zat dari peristiwa es mencair dan besi pagar berkarat adalah...",
                    options: [
                        { text: "Besi berkarat bersifat reversible sedangkan es mencair irreversible.", correct: false },
                        { text: "Es mencair tidak menghasilkan zat baru, sedangkan besi berkarat menghasilkan zat jenis baru yang sifatnya berbeda dari besi asal.", correct: true },
                        { text: "Kedua peristiwa merupakan perubahan kimia karena sama-sama menyerap zat di udara.", correct: false },
                        { text: "Karat besi diubah kembali menjadi besi murni dengan cara dipanaskan biasa.", correct: false }
                    ]
                },
                {
                    id: "3.5",
                    asset: null, // Tanpa Gambar
                    question: "Pencampuran es batu, cincau, santan, dan air aren cair pada Es Daluman apakah tergolong perubahan kimia?",
                    options: [
                        { text: "Ya, karena warna berubah menjadi kehijauan kecokelatan.", correct: false },
                        { text: "Ya, karena rasa manis gula aren mendominasi minuman.", correct: false },
                        { text: "Tidak, karena pencampuran tersebut tidak menghasilkan zat jenis baru; masing-masing bahan masih mempertahankan sifat aslinya dan hanya tercampur secara fisik.", correct: true },
                        { text: "Tidak, karena bahan langsung menguap ke udara saat diaduk rata.", correct: false }
                    ]
                }
            ],
            essay: [
                {
                    id: "e3.1",
                    num: 1,
                    question: "Analisislah mana di antara kedua peristiwa berikut: pembuatan garam Kusamba vs pembusukan sisa canang sari yang termasuk perubahan fisika dan kimia beserta alasannya!"
                },
                {
                    id: "e3.2",
                    num: 2,
                    question: "Siti merebus telur hingga matang, lalu mencoba mendinginkannya di kulkas agar kembali menjadi cair seperti semula. Apakah usaha Siti berhasil? Evaluasi berdasarkan karakteristik perubahan zat!"
                },
                {
                    id: "e3.3",
                    num: 3,
                    question: "Seorang tukang las menyambungkan pagar besi hingga memercikkan api terang dan sebagian besi meleleh menyatu. Ibu berkata ini murni perubahan fisika. Setujukah kamu? Berikan argumen ilmiahmu!"
                }
            ]
        },

        4: {
            level: 4,
            title: "Kerapatan & Massa Jenis",
            badge: "Level 4: Master Sains",
            rankTitle: "Master Sains",
            pg: [
                {
                    id: "4.1",
                    asset: "kuis4-timbang-bambu.svg",
                    question: "Bambu suling m = 120 gram dan V = 150 cm3. Massa jenis air 1,0 g/cm3. Analisis massa jenis dan posisi bambu...",
                    options: [
                        { text: "0,8 g/cm3, posisi benda tenggelam ke dasar wadah.", correct: false },
                        { text: "0,8 g/cm3, posisi benda akan mengapung di atas permukaan air.", correct: true },
                        { text: "1,25 g/cm3, posisi benda melayang tepat di tengah cairan.", correct: false },
                        { text: "1,25 g/cm3, posisi benda tenggelam karena massanya besar.", correct: false }
                    ]
                },
                {
                    id: "4.2",
                    asset: "kuis4-bambu-koin.svg",
                    question: "Mengapa bambu berukuran sama persis dengan koin logam bisa mengapung sementara logam tenggelam?",
                    options: [
                        { text: "Massa logam lebih ringan dari massa jenis air laut.", correct: false },
                        { text: "Logam menyerap air lebih cepat daripada bambu yang berongga.", correct: false },
                        { text: "Karena bambu memiliki struktur dengan banyak rongga udara yang membuat kerapatan totalnya lebih kecil dari air, sedangkan koin logam tersusun atas partikel padat rapat tanpa rongga.", correct: true },
                        { text: "Gaya dorong ke atas koin logam lebih besar daripada bambu.", correct: false }
                    ]
                },
                {
                    id: "4.3",
                    asset: "kuis4-telur-garam.svg",
                    question: "Telur segar yang tenggelam di air tawar akan melayang di air garam pekat. Analisis yang terjadi...",
                    options: [
                        { text: "Massa telur bertambah besar saat terkena air garam pekat.", correct: false },
                        { text: "Penambahan zat terlarut (garam) meningkatkan nilai massa jenis air hingga menjadi sama persis dengan massa jenis telur (ρ benda = ρ cairan).", correct: true },
                        { text: "Garam membuat volume telur menyusut sehingga massa jenisnya turun drastis.", correct: false },
                        { text: "Air garam menarik udara masuk ke dalam cangkang telur.", correct: false }
                    ]
                },
                {
                    id: "4.4",
                    asset: "kuis4-lapisan-cairan.svg",
                    question: "Tiga cairan: Minyak kelapa 0,8 g/cm3, Air murni 1,0 g/cm3, Larutan gula 1,3 g/cm3 dicampur tanpa melarut. Urutan lapisan dari atas ke bawah adalah...",
                    options: [
                        { text: "Larutan gula - Air murni - Minyak kelapa", correct: false },
                        { text: "Minyak kelapa - Air murni - Larutan gula", correct: true },
                        { text: "Air murni - Minyak kelapa - Larutan gula", correct: false },
                        { text: "Larutan gula - Minyak kelapa - Air murni", correct: false }
                    ]
                },
                {
                    id: "4.5",
                    asset: "kuis4-batu-gelasukur.svg",
                    question: "Batu dicelup ke gelas ukur. Permukaan air naik dari 50 mL menjadi 90 mL. Massa batu 100 gram. Massa jenis batu adalah...",
                    options: [
                        { text: "0,9 g/cm3", correct: false },
                        { text: "1,25 g/cm3", correct: false },
                        { text: "2,0 g/cm3", correct: false },
                        { text: "2,5 g/cm3", correct: true }
                    ]
                }
            ],
            essay: [
                {
                    id: "e4.1",
                    num: 1,
                    question: "Patung A (kayu) m = 140 gr, V = 200 cm3. Patung B (batu) m = 500 gr, V = 200 cm3. Jika dimasukkan ke air (1,0 g/cm3), hitunglah massa jenis keduanya dan prediksikan posisi akhirnya!"
                },
                {
                    id: "e4.2",
                    num: 2,
                    question: "Mengapa kubus besi memiliki massa jenis yang berlipat-lipat kali lebih besar daripada kubus es batu murni meski ukuran volumenya sama persis? Jelaskan tinjauan jarak antarpartikel dan massanya!"
                },
                {
                    id: "e4.3",
                    num: 3,
                    question: "Kade ingin merancang replika perahu agar melayang tepat di tengah kedalaman air (tidak tenggelam dan tidak muncul di permukaan). Saran strategi apa yang harus dilakukan terhadap bahan perahunya?"
                }
            ]
        }
    };

    // --- 2. PROGRESSION & PERSISTENCE MANAGER ---
    const ProgressionManager = {
        STORAGE_KEY: 'zatloka_linear_progress',

        getDefault() {
            return {
                unlockedMateri: [1], // Level 1 Materi terbuka secara default
                completedMateri: [],  // Materi yang sudah selesai dibaca
                unlockedKuis: [],     // Kuis yang sudah terbuka
                passedKuis: [],       // Kuis yang lulus 100% (5/5)
                scores: {},           // Level -> score ({ "1": 5, ... })
                essays: {},           // Level -> [ans1, ans2, ans3]
                essayDates: {}        // Level -> timestamp
            };
        },

        get() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (!raw) return this.getDefault();
                const parsed = JSON.parse(raw);
                return {
                    unlockedMateri: Array.isArray(parsed.unlockedMateri) ? parsed.unlockedMateri : [1],
                    completedMateri: Array.isArray(parsed.completedMateri) ? parsed.completedMateri : [],
                    unlockedKuis: Array.isArray(parsed.unlockedKuis) ? parsed.unlockedKuis : [],
                    passedKuis: Array.isArray(parsed.passedKuis) ? parsed.passedKuis : [],
                    scores: parsed.scores || {},
                    essays: parsed.essays || {},
                    essayDates: parsed.essayDates || {}
                };
            } catch (e) {
                return this.getDefault();
            }
        },

        save(data) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.syncRankWithState(data);
            this.notifyChange();
        },

        syncRankWithState(data) {
            // Gelar bertahap berdasarkan Kuis yang lulus 100%
            let rank = "Calon Ilmuwan";
            if (data.passedKuis.includes(4)) {
                rank = "Master Sains";
            } else if (data.passedKuis.includes(3)) {
                rank = "Ilmuwan Muda";
            } else if (data.passedKuis.includes(2)) {
                rank = "Penjelajah Materi";
            } else if (data.passedKuis.includes(1)) {
                rank = "Detektif Pemula";
            }

            localStorage.setItem('zatloka_profile_rank', rank);
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.rank = rank;
            }

            // Update UI widgets
            const widgetRank = document.getElementById('widget-rank');
            const modalRank = document.getElementById('profile-rank-val');
            if (widgetRank) widgetRank.textContent = rank;
            if (modalRank) modalRank.textContent = rank;
        },

        isMateriUnlocked(level) {
            const data = this.get();
            return data.unlockedMateri.includes(level);
        },

        isKuisUnlocked(level) {
            const data = this.get();
            return data.unlockedKuis.includes(level);
        },

        isKuisPassed(level) {
            const data = this.get();
            return data.passedKuis.includes(level);
        },

        // Triggered when user reaches the end of Materi Level N
        completeMateri(level) {
            const data = this.get();
            let changed = false;

            if (!data.completedMateri.includes(level)) {
                data.completedMateri.push(level);
                changed = true;
            }

            // Membuka Kuis level bersangkutan
            if (!data.unlockedKuis.includes(level)) {
                data.unlockedKuis.push(level);
                changed = true;
            }

            if (changed) {
                this.save(data);
            }
        },

        // Triggered when user passes Kuis Level N (100% PG)
        passKuis(level, score, essayAnswers) {
            const data = this.get();
            if (!data.passedKuis.includes(level)) {
                data.passedKuis.push(level);
            }

            data.scores[level] = Math.max(data.scores[level] || 0, score);
            data.essays[level] = essayAnswers;
            data.essayDates[level] = new Date().toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            // Unlock next Materi level (Linear progression)
            const nextLevel = level + 1;
            if (nextLevel <= 4 && !data.unlockedMateri.includes(nextLevel)) {
                data.unlockedMateri.push(nextLevel);
            }

            this.save(data);
        },

        // Save attempt score without passing
        recordAttempt(level, score, essayAnswers) {
            const data = this.get();
            data.scores[level] = Math.max(data.scores[level] || 0, score);
            data.essays[level] = essayAnswers;
            data.essayDates[level] = new Date().toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            this.save(data);
        },

        // DEV CHEAT: UNLOCK ALL
        devUnlockAll() {
            const data = {
                unlockedMateri: [1, 2, 3, 4],
                completedMateri: [1, 2, 3, 4],
                unlockedKuis: [1, 2, 3, 4],
                passedKuis: [1, 2, 3, 4],
                scores: { "1": 5, "2": 5, "3": 5, "4": 5 },
                essays: {
                    "1": ["Uap panas mengalami kondensasi karena penurunan suhu dingin pada pipa bambu.", "Partikel zat padat bergetar di tempatnya dan tidak diam total secara mikroskopis.", "Udara memuai saat panas karena energi kinetik dan jarak partikel gas bertambah."],
                    "2": ["Air laut sulit menguap tanpa adanya transfer energi panas dari sinar matahari.", "Tekanan udara di gunung lebih rendah sehingga partikel lebih mudah lepas menjadi uap.", "Uap air menyimpan energi panas laten penguapan yang dilepas seketika saat menyentuh kulit."],
                    "3": ["Garam adalah perubahan fisika sedangkan pembusukan canang sari menghasilkan zat baru (kimia).", "Tidak berhasil karena putih dan kuning telur mengalami denaturasi protein kimiawi permanen.", "Pengelasan melibatkan pelelehan besi (fisika) dan pembakaran oksidasi percikan api (kimia)."],
                    "4": ["Patung kayu mengapung (rho < 1 g/cm3), patung batu tenggelam (rho > 1 g/cm3).", "Partikel besi tersusun sangat padat dengan massa atom yang jauh lebih besar daripada es.", "Menyesuaikan rongga dan beban agar massa jenis total sama dengan massa jenis air."]
                },
                essayDates: {
                    "1": "Cheat Developer Unlocked",
                    "2": "Cheat Developer Unlocked",
                    "3": "Cheat Developer Unlocked",
                    "4": "Cheat Developer Unlocked"
                }
            };
            this.save(data);

            // Add EXP bonus
            const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || 0;
            const newExp = Math.max(currentExp, 600);
            localStorage.setItem('zatloka_profile_exp', newExp);
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.exp = newExp;
            }

            const widgetExp = document.getElementById('widget-exp');
            const modalExp = document.getElementById('profile-exp-val');
            if (widgetExp) widgetExp.textContent = `✨ ${newExp} EXP`;
            if (modalExp) modalExp.textContent = `${newExp} EXP`;
        },

        // DEV CHEAT: RESET ALL
        devResetAll() {
            const def = this.getDefault();
            this.save(def);
            localStorage.setItem('zatloka_profile_rank', 'Calon Ilmuwan');
            localStorage.setItem('zatloka_profile_exp', '0');
            localStorage.removeItem('zatloka_exp');

            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.rank = 'Calon Ilmuwan';
                window.ZatlokaApp.appState.profile.exp = 0;
            }

            const widgetRank = document.getElementById('widget-rank');
            const modalRank = document.getElementById('profile-rank-val');
            const widgetExp = document.getElementById('widget-exp');
            const modalExp = document.getElementById('profile-exp-val');
            if (widgetRank) widgetRank.textContent = 'Calon Ilmuwan';
            if (modalRank) modalRank.textContent = 'Calon Ilmuwan';
            if (widgetExp) widgetExp.textContent = '✨ 0 EXP';
            if (modalExp) modalExp.textContent = '0 EXP';
        },

        notifyChange() {
            // Trigger refresh on both Kuis and Materi UI
            if (window.ZatlokaKuis && window.ZatlokaKuis.refreshMapUI) {
                window.ZatlokaKuis.refreshMapUI();
            }
            if (window.ZatlokaMateri && window.ZatlokaMateri.refreshLevelMapUI) {
                window.ZatlokaMateri.refreshLevelMapUI();
            }
        }
    };

    // --- 3. HELPER RANDOMIZER (Fisher-Yates) ---
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Helper Sound Synthesizer (Web Audio API)
    const KuisSound = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },
        play(type) {
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                if (type === 'click') {
                    osc.frequency.setValueAtTime(480, now);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    osc.start(now);
                    osc.stop(now + 0.06);
                } else if (type === 'correct') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                    osc.start(now);
                    osc.stop(now + 0.45);
                } else if (type === 'wrong') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.setValueAtTime(180, now + 0.12);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === 'victory') {
                    const notes = [523.25, 659.25, 783.99, 1046.5];
                    notes.forEach((freq, idx) => {
                        const o = this.ctx.createOscillator();
                        const g = this.ctx.createGain();
                        o.type = 'triangle';
                        o.frequency.setValueAtTime(freq, now + idx * 0.12);
                        g.gain.setValueAtTime(0.12, now + idx * 0.12);
                        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
                        o.connect(g);
                        g.connect(this.ctx.destination);
                        o.start(now + idx * 0.12);
                        o.stop(now + idx * 0.12 + 0.3);
                    });
                }
            } catch (e) {
                // Audio fallback silence
            }
        }
    };

    // --- 4. KUIS CONTROLLER CLASS ---
    class KuisController {
        constructor() {
            this.container = null;
            this.currentLevel = null;
            this.activeQuestions = []; // Shuffled PG
            this.userAnswersPG = {};   // qId -> selectedOptionObj
            this.userAnswersEssay = {};// eId -> string text
        }

        init() {
            this.container = document.getElementById('quiz-screen');
            if (!this.container) return;
            this.showLevelMap();
        }

        // ==========================================
        // 1. PETA SELEKTOR LEVEL KUIS
        // ==========================================
        showLevelMap() {
            if (!this.container) return;
            const prog = ProgressionManager.get();

            this.container.innerHTML = `
                <div class="kuis-screen-wrapper">
                    <!-- Header -->
                    <header class="lokaplay-header">
                        <div class="header-left">
                            <button class="back-btn" data-target="home">← Beranda</button>
                            <div class="lokaplay-title-wrapper">
                                <span class="lokaplay-badge">UJI KOMPETENSI</span>
                                <h2>Peta Tantangan Kuis</h2>
                            </div>
                        </div>
                        <div class="header-right">
                            <button class="btn btn-secondary btn-print-all" id="btn-print-summary">
                                📄 Cetak Laporan
                            </button>
                        </div>
                    </header>

                    <!-- Main Map Content -->
                    <main class="kuis-map-content">
                        <div class="hub-welcome-banner">
                            <div class="hub-banner-text">
                                <h3>Uji Pemahaman Sains Etnosains Bali!</h3>
                                <p>Selesaikan 5 Pilihan Ganda & 3 Esai. Raih skor 100% untuk membuka Gelar & Materi selanjutnya.</p>
                            </div>
                        </div>

                        <div class="kuis-level-grid">
                            ${[1, 2, 3, 4].map(lvl => {
                                const qData = KUIS_DATA[lvl];
                                const isUnlocked = ProgressionManager.isKuisUnlocked(lvl);
                                const isPassed = ProgressionManager.isKuisPassed(lvl);
                                const score = prog.scores[lvl];
                                
                                let statusClass = 'locked';
                                let statusBadge = '🔒 Terkunci';
                                let statusBtnText = 'Terkunci';

                                if (isPassed) {
                                    statusClass = 'passed';
                                    statusBadge = '⭐ Lulus (5/5)';
                                    statusBtnText = 'Ulangi Kuis ▶';
                                } else if (isUnlocked) {
                                    statusClass = 'unlocked';
                                    statusBadge = score !== undefined ? `Skor Terakhir: ${score}/5` : '🔓 Terbuka';
                                    statusBtnText = 'Mulai Kuis ▶';
                                } else {
                                    statusBadge = `🔒 Baca Materi Lvl ${lvl} Dahulu`;
                                }

                                return `
                                    <div class="kuis-level-card ${statusClass}" data-level="${lvl}">
                                        <div class="kuis-card-header">
                                            <span class="kuis-card-badge">${qData.badge}</span>
                                            <span class="kuis-card-status">${statusBadge}</span>
                                        </div>
                                        <div class="kuis-card-body">
                                            <div class="kuis-card-icon">
                                                ${lvl === 1 ? '🔍' : lvl === 2 ? '🔥' : lvl === 3 ? '🧪' : '🏆'}
                                            </div>
                                            <h3>${qData.title}</h3>
                                            <p>5 Pilihan Ganda • 3 Soal Esai Ilmiah</p>
                                        </div>
                                        <div class="kuis-card-footer">
                                            <span class="kuis-tag-gelar">Gelar: ${qData.rankTitle}</span>
                                            <button class="btn ${isUnlocked ? 'btn-primary' : 'btn-secondary'} btn-start-kuis" 
                                                    data-level="${lvl}" ${!isUnlocked ? 'disabled' : ''}>
                                                ${statusBtnText}
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </main>
                </div>
            `;

            // Bind Navigation Events
            const backBtn = this.container.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    KuisSound.play('click');
                    if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                        window.ZatlokaApp.navigateTo('home');
                    }
                });
            }

            const printSummaryBtn = document.getElementById('btn-print-summary');
            if (printSummaryBtn) {
                printSummaryBtn.addEventListener('click', () => {
                    KuisSound.play('click');
                    this.openPrintDialog();
                });
            }

            // Bind Start Quiz Buttons
            this.container.querySelectorAll('.btn-start-kuis').forEach(btn => {
                btn.addEventListener('click', () => {
                    const lvl = parseInt(btn.dataset.level, 10);
                    if (ProgressionManager.isKuisUnlocked(lvl)) {
                        KuisSound.play('click');
                        this.startKuis(lvl);
                    }
                });
            });
        }

        refreshMapUI() {
            if (this.container && this.currentLevel === null) {
                this.showLevelMap();
            }
        }

        // ==========================================
        // 2. MEMULAI KUIS LEVEL TERTENTU
        // ==========================================
        startKuis(levelNum) {
            const rawData = KUIS_DATA[levelNum];
            if (!rawData) return;

            this.currentLevel = levelNum;
            this.userAnswersPG = {};
            this.userAnswersEssay = {};

            // Acak urutan 5 soal PG
            const shuffledPG = shuffleArray(rawData.pg).map(q => {
                // Acak urutan 4 opsi opsi A-B-C-D
                return {
                    ...q,
                    shuffledOptions: shuffleArray(q.options)
                };
            });

            this.activeQuestions = shuffledPG;
            this.renderKuisArena(rawData);
        }

        renderKuisArena(qData) {
            const letters = ['A', 'B', 'C', 'D'];

            this.container.innerHTML = `
                <div class="kuis-screen-wrapper">
                    <!-- Header -->
                    <header class="lokaplay-header">
                        <div class="header-left">
                            <button class="back-btn" id="btn-kuis-back-map">← Peta Kuis</button>
                            <div class="lokaplay-title-wrapper">
                                <span class="lokaplay-badge">${qData.badge}</span>
                                <h2>${qData.title}</h2>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="lokaplay-progress-pill" id="kuis-answered-pill">
                                Terjawab: 0 / 5 PG • 0 / 3 Esai
                            </div>
                        </div>
                    </header>

                    <!-- Quiz Content (Scrollable) -->
                    <main class="kuis-arena-content">
                        <!-- PETUNJUK PENGERJAAN -->
                        <div class="kuis-inst-banner">
                            <span class="inst-icon">💡</span>
                            <div class="inst-text">
                                <strong>Petunjuk:</strong> Jawab 5 soal Pilihan Ganda & 3 soal Esai di bawah ini dengan teliti untuk menguji pemahaman sainsmu.
                            </div>
                        </div>

                        <!-- BAGIAN 1: PILIHAN GANDA -->
                        <div class="kuis-section-title">
                            <h3>Bagian I: Pilihan Ganda (5 Soal)</h3>
                            <span class="kuis-req-note">Syarat Lulus: 100% Benar (5 dari 5)</span>
                        </div>

                        <div class="kuis-questions-list">
                            ${this.activeQuestions.map((q, qIndex) => `
                                <div class="kuis-question-card" id="qcard-${q.id}">
                                    <div class="qcard-header">
                                        <span class="qcard-num">Soal ${qIndex + 1} dari 5</span>
                                    </div>

                                    ${q.asset ? `
                                        <div class="qcard-asset-box">
                                            <img src="assets/images/kuis/${q.asset}" 
                                                 alt="Ilustrasi Soal ${qIndex + 1}"
                                                 onerror="this.style.display='none'" />
                                        </div>
                                    ` : ''}

                                    <p class="qcard-text">${q.question}</p>

                                    <div class="qcard-options-list">
                                        ${q.shuffledOptions.map((opt, optIndex) => `
                                            <label class="qcard-option-label" data-qid="${q.id}" data-opt-idx="${optIndex}">
                                                <input type="radio" name="pg_${q.id}" value="${optIndex}" class="qcard-radio" />
                                                <span class="qcard-opt-letter">${letters[optIndex]}</span>
                                                <span class="qcard-opt-text">${opt.text}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- BAGIAN 2: SOAL ESAI -->
                        <div class="kuis-section-title" style="margin-top: 2rem;">
                            <h3>Bagian II: Soal Esai Ilmiah (3 Soal)</h3>
                            <span class="kuis-req-note">Murni Analisis Teks</span>
                        </div>

                        <div class="kuis-essay-list">
                            ${qData.essay.map((e, eIndex) => `
                                <div class="kuis-essay-card" id="ecard-${e.id}">
                                    <div class="ecard-header">
                                        <span class="ecard-num">Esai #${e.num}</span>
                                    </div>
                                    <p class="ecard-text">${e.question}</p>
                                    <div class="ecard-input-wrapper">
                                        <textarea class="ecard-textarea" data-eid="${e.id}" 
                                                  placeholder="Tuliskan argumen dan penjelasan ilmiahmu di sini..."></textarea>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- TOMBOL SUBMIT -->
                        <div class="kuis-submit-bar">
                            <button class="btn btn-secondary" id="btn-kuis-cancel">Batal & Kembali</button>
                            <button class="btn btn-primary" id="btn-kuis-submit">
                                ✓ Kirim & Selesaikan Kuis
                            </button>
                        </div>
                    </main>

                    <!-- MODAL EVALUASI & FEEDBACK AKHIR -->
                    <div class="kuis-modal-overlay hidden" id="kuis-modal-feedback">
                        <div class="kuis-modal-card" id="kuis-modal-card">
                            <div class="kuis-modal-icon" id="km-icon">🎉</div>
                            <h3 id="km-title">Hasil Evaluasi Kuis</h3>
                            <div class="km-score-badge" id="km-score-badge">Skor: 5 / 5</div>
                            <p class="km-desc" id="km-desc">Keterangan hasil kuis</p>
                            <div class="km-actions" id="km-actions">
                                <!-- Tombol aksi dinamis -->
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Bind Back to Map
            document.getElementById('btn-kuis-back-map').addEventListener('click', () => {
                KuisSound.play('click');
                this.currentLevel = null;
                this.showLevelMap();
            });

            document.getElementById('btn-kuis-cancel').addEventListener('click', () => {
                KuisSound.play('click');
                this.currentLevel = null;
                this.showLevelMap();
            });

            // Bind Options Selection
            this.container.querySelectorAll('.qcard-option-label').forEach(label => {
                label.addEventListener('click', () => {
                    const qId = label.dataset.qid;
                    const optIdx = parseInt(label.dataset.optIdx, 10);
                    const qObj = this.activeQuestions.find(q => q.id === qId);
                    if (qObj) {
                        KuisSound.play('click');
                        this.userAnswersPG[qId] = qObj.shuffledOptions[optIdx];

                        // Update styling
                        const card = document.getElementById(`qcard-${qId}`);
                        if (card) {
                            card.querySelectorAll('.qcard-option-label').forEach(l => l.classList.remove('selected'));
                            label.classList.add('selected');
                        }

                        this.updateProgressPill(qData);
                    }
                });
            });

            // Bind Essay Textarea live validation
            this.container.querySelectorAll('.ecard-textarea').forEach(textarea => {
                textarea.addEventListener('input', () => {
                    const eId = textarea.dataset.eid;
                    const val = textarea.value.trim();
                    this.userAnswersEssay[eId] = val;
                    this.updateProgressPill(qData);
                });
            });

            // Bind Submit Button
            document.getElementById('btn-kuis-submit').addEventListener('click', () => {
                this.handleSubmitKuis(qData);
            });
        }

        updateProgressPill(qData) {
            const answeredPGCount = Object.keys(this.userAnswersPG).length;
            let answeredEssayCount = 0;

            qData.essay.forEach(e => {
                const text = (this.userAnswersEssay[e.id] || '').trim();
                const wordCount = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
                if (wordCount >= 3) {
                    answeredEssayCount++;
                }
            });

            const pill = document.getElementById('kuis-answered-pill');
            if (pill) {
                pill.textContent = `Terjawab: ${answeredPGCount} / 5 PG • ${answeredEssayCount} / 3 Esai`;
            }
        }

        // ==========================================
        // 3. SUBMIT & EVALUASI KUIS
        // ==========================================
        handleSubmitKuis(qData) {
            // 1. Validasi PG Lengkap
            const answeredPGCount = Object.keys(this.userAnswersPG).length;
            if (answeredPGCount < 5) {
                KuisSound.play('wrong');
                alert("Harap jawab seluruh 5 soal Pilihan Ganda sebelum mengirimkan kuis!");
                return;
            }

            // 2. Validasi Esai (Wajib diisi)
            for (let i = 0; i < qData.essay.length; i++) {
                const e = qData.essay[i];
                const text = (this.userAnswersEssay[e.id] || '').trim();
                const wordCount = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
                if (wordCount < 3) {
                    KuisSound.play('wrong');
                    alert(`Soal Esai #${e.num} belum diisi dengan lengkap. Silakan lengkapi jawabanmu terlebih dahulu.`);
                    const textarea = document.querySelector(`.ecard-textarea[data-eid="${e.id}"]`);
                    if (textarea) textarea.focus();
                    return;
                }
            }

            // 3. Hitung Skor Pilihan Ganda (Benar / 5)
            let correctCount = 0;
            this.activeQuestions.forEach(q => {
                const userChoice = this.userAnswersPG[q.id];
                if (userChoice && userChoice.correct) {
                    correctCount++;
                }
            });

            // Kumpulkan jawaban esai dalam array
            const essayAnswersList = qData.essay.map(e => (this.userAnswersEssay[e.id] || '').trim());

            // Tampilkan Feedback Modal
            this.showFeedbackModal(qData, correctCount, essayAnswersList);
        }

        showFeedbackModal(qData, correctCount, essayAnswersList) {
            const modal = document.getElementById('kuis-modal-feedback');
            const card = document.getElementById('kuis-modal-card');
            const icon = document.getElementById('km-icon');
            const title = document.getElementById('km-title');
            const badge = document.getElementById('km-score-badge');
            const desc = document.getElementById('km-desc');
            const actions = document.getElementById('km-actions');

            if (!modal) return;

            const isPassed = (correctCount === 5); // 100% Syarat Lulus

            if (isPassed) {
                KuisSound.play('victory');
                ProgressionManager.passKuis(this.currentLevel, correctCount, essayAnswersList);

                // Tambahkan EXP bonus (+150 EXP)
                const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || 0;
                const newExp = currentExp + 150;
                localStorage.setItem('zatloka_profile_exp', newExp);
                if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                    window.ZatlokaApp.appState.profile.exp = newExp;
                }

                card.className = 'kuis-modal-card modal-passed';
                icon.textContent = '🏆';
                title.textContent = 'Selamat, Kamu Lulus 100%!';
                badge.className = 'km-score-badge badge-passed';
                badge.textContent = `Skor Pilihan Ganda: 5 / 5 (+150 EXP)`;

                const nextLvl = this.currentLevel + 1;
                let nextNote = nextLvl <= 4 
                    ? `Gelar <strong>"${qData.rankTitle}"</strong> & Materi Level ${nextLvl} berhasil terbuka!`
                    : `Luar biasa! Kamu telah menuntaskan seluruh tingkatan kuis dan meraih gelar tertinggi <strong>Master Sains</strong>!`;

                desc.innerHTML = `Analisis sainsmu sangat tajam dan tepat. ${nextNote}`;

                actions.innerHTML = `
                    <button class="btn btn-secondary" id="btn-modal-print">📄 Cetak Laporan</button>
                    <button class="btn btn-secondary" id="btn-modal-map">Peta Kuis</button>
                    ${nextLvl <= 4 ? `
                        <button class="btn btn-primary" id="btn-modal-next-materi">
                            Lanjut Eksplorasi Zat Lvl ${nextLvl} ▶
                        </button>
                    ` : `
                        <button class="btn btn-primary" id="btn-modal-finish">
                            Selesai & Ke Beranda 🏠
                        </button>
                    `}
                `;

                modal.classList.remove('hidden');

                document.getElementById('btn-modal-print').onclick = () => {
                    this.printReport(this.currentLevel);
                };

                document.getElementById('btn-modal-map').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.currentLevel = null;
                    this.showLevelMap();
                };

                const nextMateriBtn = document.getElementById('btn-modal-next-materi');
                if (nextMateriBtn) {
                    nextMateriBtn.onclick = () => {
                        KuisSound.play('click');
                        modal.classList.add('hidden');
                        if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                            window.ZatlokaApp.navigateTo('materi');
                        }
                    };
                }

                const finishBtn = document.getElementById('btn-modal-finish');
                if (finishBtn) {
                    finishBtn.onclick = () => {
                        KuisSound.play('click');
                        modal.classList.add('hidden');
                        if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                            window.ZatlokaApp.navigateTo('home');
                        }
                    };
                }

            } else {
                // TIDAK LULUS (< 5/5): PRD feedback tanpa membocorkan jawaban yang salah
                KuisSound.play('wrong');
                ProgressionManager.recordAttempt(this.currentLevel, correctCount, essayAnswersList);

                card.className = 'kuis-modal-card modal-retry';
                icon.textContent = '💡';
                title.textContent = 'Terus Berjuang, Detektif!';
                badge.className = 'km-score-badge badge-retry';
                badge.textContent = `Skor Pilihan Ganda: ${correctCount} / 5`;

                const wrongCount = 5 - correctCount;
                desc.textContent = `Skor: ${correctCount}/5. Kamu hebat, tapi ada ${wrongCount} konsep yang masih bersembunyi. Syarat kelulusan adalah 5/5. Pelajari kembali materi dan coba lagi!`;

                actions.innerHTML = `
                    <button class="btn btn-secondary" id="btn-modal-map-fail">Peta Kuis</button>
                    <button class="btn btn-primary" id="btn-modal-retry">🔄 Coba Lagi Kuis</button>
                `;

                modal.classList.remove('hidden');

                document.getElementById('btn-modal-map-fail').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.currentLevel = null;
                    this.showLevelMap();
                };

                document.getElementById('btn-modal-retry').onclick = () => {
                    KuisSound.play('click');
                    modal.classList.add('hidden');
                    this.startKuis(this.currentLevel); // Acak ulang kuis
                };
            }
        }

        // ==========================================
        // 4. EKSPOR LAPORAN CETAK / PDF (window.print)
        // ==========================================
        printReport(specificLevel = null) {
            const prog = ProgressionManager.get();
            const studentName = localStorage.getItem('zatloka_profile_name') || 'Siswa ZatLoka';
            const studentRank = localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan';
            const studentExp = localStorage.getItem('zatloka_profile_exp') || '0';

            const levelsToPrint = specificLevel ? [specificLevel] : [1, 2, 3, 4].filter(l => prog.scores[l] !== undefined);

            if (levelsToPrint.length === 0) {
                alert("Belum ada riwayat kuis yang diselesaikan untuk dicetak.");
                return;
            }

            // Buat iframe tersembunyi khusus cetak agar tidak merusak tampilan SPA
            let printFrame = document.getElementById('zatloka-print-frame');
            if (printFrame) printFrame.remove();

            printFrame = document.createElement('iframe');
            printFrame.id = 'zatloka-print-frame';
            printFrame.style.position = 'fixed';
            printFrame.style.top = '-9999px';
            printFrame.style.left = '-9999px';
            printFrame.style.width = '1000px';
            printFrame.style.height = '1000px';
            document.body.appendChild(printFrame);

            let reportsHtml = levelsToPrint.map(lvl => {
                const qData = KUIS_DATA[lvl];
                const score = prog.scores[lvl] || 0;
                const isPassed = prog.passedKuis.includes(lvl);
                const essayAnswers = prog.essays[lvl] || [];
                const dateStr = prog.essayDates[lvl] || '-';

                return `
                    <div class="print-level-block">
                        <div class="print-level-header">
                            <h3>${qData.badge}: ${qData.title}</h3>
                            <span class="print-status-tag ${isPassed ? 'tag-lulus' : 'tag-belum'}">
                                ${isPassed ? '✓ LULUS (100%)' : 'BELUM LULUS'}
                            </span>
                        </div>
                        <div class="print-meta-grid">
                            <div><strong>Skor Pilihan Ganda:</strong> ${score} / 5 (${score * 20}%)</div>
                            <div><strong>Waktu Pengerjaan:</strong> ${dateStr}</div>
                        </div>

                        <div class="print-essay-section">
                            <h4>Lembar Jawaban Esai Siswa:</h4>
                            ${qData.essay.map((e, idx) => `
                                <div class="print-essay-item">
                                    <p class="print-q-text"><strong>Soal ${e.num}:</strong> ${e.question}</p>
                                    <div class="print-ans-box">
                                        <strong>Jawaban:</strong><br/>
                                        ${essayAnswers[idx] ? essayAnswers[idx].replace(/\n/g, '<br/>') : '<em>(Belum dijawab)</em>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('<hr class="print-divider"/>');

            const printDocumentContent = `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <title>Laporan Hasil Kuis Sains - ${studentName}</title>
                    <style>
                        @page { size: A4; margin: 15mm; }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            color: #0f172a;
                            background: #ffffff;
                            margin: 0;
                            padding: 10px;
                            font-size: 11pt;
                            line-height: 1.5;
                        }
                        .print-header {
                            border-bottom: 2px solid #0284c7;
                            padding-bottom: 12px;
                            margin-bottom: 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .print-header h1 {
                            font-size: 18pt;
                            color: #0284c7;
                            margin: 0 0 4px 0;
                        }
                        .print-header p {
                            margin: 0;
                            color: #64748b;
                            font-size: 9pt;
                        }
                        .print-student-info {
                            background: #f0f9ff;
                            border: 1px solid #bae6fd;
                            border-radius: 8px;
                            padding: 12px 16px;
                            margin-bottom: 20px;
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            gap: 10px;
                        }
                        .print-student-info div {
                            font-size: 10pt;
                        }
                        .print-level-block {
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .print-level-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #cbd5e1;
                            padding-bottom: 6px;
                            margin-bottom: 10px;
                        }
                        .print-level-header h3 {
                            margin: 0;
                            font-size: 13pt;
                            color: #0369a1;
                        }
                        .print-status-tag {
                            font-weight: bold;
                            font-size: 9pt;
                            padding: 3px 8px;
                            border-radius: 4px;
                        }
                        .tag-lulus { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
                        .tag-belum { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
                        .print-meta-grid {
                            display: flex;
                            gap: 24px;
                            font-size: 10pt;
                            margin-bottom: 12px;
                            color: #334155;
                        }
                        .print-essay-section h4 {
                            margin: 10px 0 6px 0;
                            font-size: 11pt;
                            color: #0f172a;
                        }
                        .print-essay-item {
                            margin-bottom: 12px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 8px 12px;
                        }
                        .print-q-text {
                            margin: 0 0 6px 0;
                            font-size: 9.5pt;
                            color: #1e293b;
                        }
                        .print-ans-box {
                            background: #ffffff;
                            border: 1px solid #cbd5e1;
                            border-radius: 4px;
                            padding: 6px 10px;
                            font-size: 9.5pt;
                            color: #0f172a;
                        }
                        .print-divider {
                            border: none;
                            border-top: 1.5px dashed #cbd5e1;
                            margin: 24px 0;
                        }
                        .print-footer {
                            margin-top: 30px;
                            text-align: right;
                            font-size: 9pt;
                            color: #64748b;
                            border-top: 1px solid #e2e8f0;
                            padding-top: 8px;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <div>
                            <h1>ZATLOKA • Laporan Hasil Kuis IPA</h1>
                            <p>Media Pembelajaran Etnosains Bali SMP Kelas VII (Kurikulum Merdeka)</p>
                        </div>
                    </div>

                    <div class="print-student-info">
                        <div><strong>Nama Siswa:</strong> ${studentName}</div>
                        <div><strong>Gelar Saat Ini:</strong> ${studentRank}</div>
                        <div><strong>Total EXP:</strong> ${studentExp} EXP</div>
                    </div>

                    ${reportsHtml}

                    <div class="print-footer">
                        Dicetak secara otomatis dari Aplikasi Media Pembelajaran ZatLoka pada ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </body>
                </html>
            `;

            const doc = printFrame.contentWindow.document;
            doc.open();
            doc.write(printDocumentContent);
            doc.close();

            setTimeout(() => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            }, 400);
        }

        openPrintDialog() {
            this.printReport();
        }
    }

    // Expose Global Singletons
    window.ZatlokaProgression = ProgressionManager;
    window.ZatlokaKuis = new KuisController();

    // Auto-init on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ZatlokaKuis.init();
        // Initial rank sync
        ProgressionManager.syncRankWithState(ProgressionManager.get());
    });

})();
