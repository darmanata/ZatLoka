/**
 * ============================================================================
 * ZATLOKA - LOKA-PLAY ARENA GAME ENGINE
 * Game 1: Misteri Wujud Benda (Visual Drag and Drop)
 * Game 2: Detektif Zat (Drag the Words)
 * Game 3: Tantangan Master Sains (Game Show Multiple Choice)
 * ============================================================================
 */

(function () {
    'use strict';

    // --- 1. SOUND EFFECTS SYNTHESIZER (Web Audio API - No External Files Required) ---
    const SoundFx = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },
        play(type) {
            try {
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                if (type === 'click') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                } else if (type === 'correct') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                    osc.start(now);
                    osc.stop(now + 0.45);
                } else if (type === 'wrong') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(140, now + 0.25);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === 'snap') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                } else if (type === 'bounce') {
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                } else if (type === 'victory') {
                    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                    notes.forEach((freq, i) => {
                        const noteOsc = this.ctx.createOscillator();
                        const noteGain = this.ctx.createGain();
                        noteOsc.type = 'triangle';
                        noteOsc.frequency.setValueAtTime(freq, now + i * 0.1);
                        noteGain.gain.setValueAtTime(0.2, now + i * 0.1);
                        noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                        noteOsc.connect(noteGain);
                        noteGain.connect(this.ctx.destination);
                        noteOsc.start(now + i * 0.1);
                        noteOsc.stop(now + i * 0.1 + 0.3);
                    });
                }
            } catch (e) {
                // Audio fallback silence
            }
        }
    };

    // Helper to get current global EXP
    function getExp() {
        try {
            const storedProfile = localStorage.getItem('zatloka_profile_exp');
            if (storedProfile !== null && !isNaN(parseInt(storedProfile, 10))) {
                return parseInt(storedProfile, 10);
            }
            const stored = localStorage.getItem('zatloka_exp');
            if (stored !== null && !isNaN(parseInt(stored, 10))) {
                return parseInt(stored, 10);
            }
            const expEl = document.getElementById('widget-exp');
            if (expEl && expEl.textContent) {
                const match = expEl.textContent.match(/\d+/);
                if (match) return parseInt(match[0], 10);
            }
        } catch (e) { }
        return 0;
    }

    // Helper to add EXP to user profile
    function addExp(points) {
        try {
            const current = getExp();
            const updated = Math.max(0, current + points);
            const expEl = document.getElementById('widget-exp');
            const expProfileEl = document.getElementById('profile-exp-val');
            if (expEl) expEl.textContent = `✨ ${updated} EXP`;
            if (expProfileEl) expProfileEl.textContent = `${updated} EXP`;
            localStorage.setItem('zatloka_profile_exp', updated);
            localStorage.setItem('zatloka_exp', updated);
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.exp = updated;
            }
            return updated;
        } catch (e) { }
        return 0;
    }

    // Helper to safely deduct EXP if sufficient
    function deductExp(points) {
        const current = getExp();
        if (current < points) {
            return false;
        }
        addExp(-points);
        return true;
    }

    // Helper to shuffle array elements (Fisher-Yates Shuffle)
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // --- 2. DATA GAME 1: MISTERI WUJUD BENDA (VISUAL DRAG AND DROP) ---
    const GAME1_DATA = [
        {
            id: 1,
            title: "Soal 1: Klasifikasi Wujud Zat",
            instruction: "Seret setiap kartu benda etnosains Bali di bawah ini ke dalam Papan Wujud Zat yang sesuai!",
            dropZones: [
                { id: "padat", label: "Padat", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.1)" },
                { id: "cair", label: "Cair", color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)" },
                { id: "gas", label: "Gas", color: "#818cf8", bg: "rgba(129, 140, 248, 0.1)" }
            ],
            cards: [
                { 
                    id: "c1", 
                    name: "Dupa Harum", 
                    img: "card-dupa.webp", 
                    target: "padat",
                    explanation: "Tepat sekali! **Dupa Harum** adalah zat padat. Susunan partikel di dalamnya sangat rapat dan teratur, sehingga bentuk maupun volumenya tidak berubah. Dupa menjadi elemen esensial dalam tradisi dan keseharian masyarakat Bali."
                },
                { 
                    id: "c2", 
                    name: "Kayu Cendana", 
                    img: "card-kayu.webp", 
                    target: "padat",
                    explanation: "Benar! **Kayu Cendana** tergolong zat padat. Gaya tarik antarpartikel kayu sangat kuat sehingga teksturnya keras. Kayu ini sering dimanfaatkan masyarakat lokal karena menghasilkan aroma khas saat diproses menjadi dupa."
                },
                { 
                    id: "c3", 
                    name: "Minyak Atraktan", 
                    img: "card-minyak.webp", 
                    target: "cair",
                    explanation: "Kerja bagus! **Minyak Atraktan** berwujud cair. Jarak antarpartikelnya agak renggang, sehingga cairan ini bisa mengalir dan bentuknya selalu berubah mengikuti botol wadahnya. Minyak ini digunakan pembuat dupa lokal untuk mengikat aroma."
                },
                { 
                    id: "c4", 
                    name: "Arak Bali", 
                    img: "card-arak.webp", 
                    target: "cair",
                    explanation: "Tepat! **Arak Bali** merupakan zat cair. Meskipun volumenya tetap, bentuk cairan arak ini sangat adaptif. Arak adalah produk kearifan lokal yang dihasilkan melalui teknik pemisahan campuran, yaitu penyulingan (destilasi)."
                },
                { 
                    id: "c5", 
                    name: "Asap Aroma", 
                    img: "card-asap.webp", 
                    target: "gas",
                    explanation: "Hebat! **Asap Aroma** yang mengepul adalah wujud gas. Partikel gas bergerak sangat bebas, acak, dan saling berjauhan. Sifat partikel inilah yang membuat wangi dupa bisa dengan cepat menyebar ke seluruh penjuru ruangan!"
                }
            ]
        },
        {
            id: 2,
            title: "Soal 2: Perubahan Wujud & Energi Panas",
            instruction: "Seret kartu proses perubahan wujud zat pada tradisi Bali berikut ke dalam wadah jenis keterlibatan energi panasnya!",
            dropZones: [
                { id: "memerlukan", label: "Memerlukan Panas", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" },
                { id: "melepaskan", label: "Melepaskan Panas", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)" }
            ],
            cards: [
                { 
                    id: "c6", 
                    name: "Penguapan Garam", 
                    img: "card-garam-uap.webp", 
                    target: "memerlukan",
                    explanation: "Tepat! Proses **Penguapan Garam** memerlukan energi panas. Petani garam di pesisir Kusamba menjemur air laut agar partikel airnya menyerap panas matahari, lalu berubah wujud menjadi gas dan menyisakan kristal garam."
                },
                { 
                    id: "c7", 
                    name: "Es Daluman Mencair", 
                    img: "card-es-daluman.webp", 
                    target: "memerlukan",
                    explanation: "Benar sekali! Agar **Es Daluman Mencair**, es tersebut harus menyerap panas dari cairan manis di sekelilingnya. Penyerapan kalor ini membuat ikatan partikel es yang rapat menjadi merenggang menjadi zat cair."
                },
                { 
                    id: "c8", 
                    name: "Pengembunan Uap Arak", 
                    img: "card-embun-arak.webp", 
                    target: "melepaskan",
                    explanation: "Kerja bagus! Pada proses penyulingan, **Pengembunan Uap Arak** terjadi karena uap panas dialirkan ke pipa bambu yang dingin. Uap tersebut melepaskan panas ke lingkungan sehingga partikelnya kembali merapat menjadi tetesan cairan arak."
                },
                { 
                    id: "c9", 
                    name: "Pemadatan Adonan", 
                    img: "card-adonan.webp", 
                    target: "melepaskan",
                    explanation: "Hebat! Proses **Pemadatan Adonan** perekat dupa yang awalnya cair menjadi keras terjadi karena adonan melepaskan panas ke udara sekitarnya. Proses ini membuat jarak antarpartikel zat kembali rapat dan kaku."
                }
            ]
        },
        {
            id: 3,
            title: "Soal 3: Kerapatan Zat di Air Laut Kusamba",
            instruction: "Seret benda-benda di bawah ini ke posisi keterserapannya di dalam bejana berisi Air Laut Pekat Kusamba!",
            dropZones: [
                { id: "terapung", label: "Terapung", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
                { id: "tenggelam", label: "Tenggelam", color: "#64748b", bg: "rgba(100, 116, 139, 0.1)" }
            ],
            cards: [
                { 
                    id: "c10", 
                    name: "Telur Segar", 
                    img: "card-telur.webp", 
                    target: "terapung",
                    explanation: "Tepat sekali! **Telur Segar** akan terapung. Ini terjadi karena massa jenis telur lebih kecil dibandingkan massa jenis Air Laut Pekat Kusamba. Faktanya, petani garam tradisional menggunakan trik mengapungkan telur ini untuk mengukur tingkat kepekatan air laut sebelum dijemur!"
                },
                { 
                    id: "c11", 
                    name: "Batang Dupa Bambu", 
                    img: "card-batang-dupa.webp", 
                    target: "terapung",
                    explanation: "Benar! **Batang Dupa Bambu** akan terapung di air. Bambu memiliki partikel penyusun dan rongga yang membuat massa jenis totalnya lebih kecil dari air laut. Sifat bambu yang ringan dan kuat ini menjadikannya bahan ideal untuk gagang dupa."
                },
                { 
                    id: "c12", 
                    name: "Batu Kali", 
                    img: "card-batu.webp", 
                    target: "tenggelam",
                    explanation: "Kerja bagus! **Batu Kali** akan langsung tenggelam ke dasar bejana. Susunan partikel batu sangat padat sehingga massa jenisnya jauh lebih besar daripada massa jenis air laut. Gaya dorong ke atas dari air tidak mampu menahan berat batu ini."
                }
            ]
        },
        {
            id: 4,
            title: "Soal 4: Perubahan Fisika & Kimia",
            instruction: "Kelompokkan fenomena kearifan lokal Bali di bawah ini ke dalam jenis perubahan zat yang tepat!",
            dropZones: [
                { id: "fisika", label: "Perubahan Fisika", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
                { id: "kimia", label: "Perubahan Kimia", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" }
            ],
            cards: [
                { 
                    id: "c13", 
                    name: "Kristalisasi Garam", 
                    img: "card-kristal.webp", 
                    target: "fisika",
                    explanation: "Tepat sekali! **Kristalisasi Garam** adalah perubahan fisika. Proses penguapan air laut oleh panas matahari hanya memisahkan air dan menyisakan kristal garam. Tidak ada zat jenis baru yang terbentuk, sifat aslinya tetap sama!"
                },
                { 
                    id: "c14", 
                    name: "Garam Melarut", 
                    img: "card-garam-larut.webp", 
                    target: "fisika",
                    explanation: "Benar! **Garam Melarut** di dalam air hanyalah perubahan fisika. Garam hanya tercampur dan wujudnya seolah menghilang, tetapi rasa asinnya membuktikan bahwa zat aslinya tidak berubah dan tidak menghasilkan zat baru."
                },
                { 
                    id: "c15", 
                    name: "Pembakaran Dupa", 
                    img: "card-bakar-dupa.webp", 
                    target: "kimia",
                    explanation: "Kerja bagus! **Pembakaran Dupa** merupakan reaksi kimia. Proses pembakaran ini menghancurkan bentuk asli dupa dan menghasilkan zat jenis baru yang sama sekali berbeda, yaitu abu dan gas (asap aroma)."
                },
                { 
                    id: "c16", 
                    name: "Pembusukan Janur", 
                    img: "card-janur.webp", 
                    target: "kimia",
                    explanation: "Tepat! **Pembusukan Janur** pada sisa banten adalah perubahan kimia. Bakteri dan jamur menguraikan janur tersebut, sehingga menghasilkan zat baru yang ditandai dengan perubahan warna menjadi kecokelatan dan timbulnya bau."
                },
                { 
                    id: "c17", 
                    name: "Fermentasi Tuak", 
                    img: "card-fermentasi.webp", 
                    target: "kimia",
                    explanation: "Hebat! **Fermentasi Tuak** dari nira adalah perubahan kimia murni. Mikroorganisme pada ragi merombak kandungan gula di dalam nira menjadi zat yang benar-benar baru, yaitu alkohol!"
                }
            ]
        }
    ];

    // --- 3. DATA GAME 2: DETEKTIF ZAT (DRAG THE WORDS) ---
    const GAME2_DATA = [
        {
            id: 1,
            title: "Soal 1: Pembuatan Dupa Harum",
            text: "Saat membuat dupa harum, adonan bahan dipadatkan hingga berwujud {0} yang memiliki bentuk dan volume tetap karena partikelnya tersusun rapat. Ketika dupa dibakar, muncul asap berwujud {1} yang bentuknya berubah-ubah mengikuti ruang karena gaya tarik antarpartikelnya sangat {2}.",
            answers: ["Padat", "Gas", "Lemah"],
            bank: ["Padat", "Gas", "Lemah", "Cair", "Kuat"]
        },
        {
            id: 2,
            title: "Soal 2: Sifat Alir Minyak Atraktan",
            text: "Minyak atraktan dupa berwujud cair dapat dituangkan ke berbagai botol karena partikelnya dapat saling {0}. Jarak antarpartikel zat cair lebih {1} dibandingkan zat padat...",
            answers: ["Menggelincir", "Renggang"],
            bank: ["Menggelincir", "Renggang", "Rapat", "Kaku"]
        },
        {
            id: 3,
            title: "Soal 3: Destilasi Arak Bali",
            text: "Dalam pembuatan Arak Bali, uap alkohol hasil pemanasan mengalami perubahan wujud menjadi tetesan cair yang disebut {0}. Perubahan dari fase gas ke cair ini terjadi karena uap alkohol {1} energi panas saat melewati pipa pendingin.",
            answers: ["Mengembun", "Melepaskan"],
            bank: ["Mengembun", "Melepaskan", "Menguap", "Menyerap"]
        },
        {
            id: 4,
            title: "Soal 4: Perubahan Partikel Saat Es Meleleh",
            text: "Ketika es batu dipanaskan hingga meleleh, partikel air akan {0} panas dari lingkungan. Penambahan energi ini menyebabkan energi kinetik partikel {1} sehingga pergerakan partikel semakin cepat...",
            answers: ["Menyerap", "Meningkat"],
            bank: ["Menyerap", "Meningkat", "Melepaskan", "Menurun"]
        },
        {
            id: 5,
            title: "Soal 5: Massa Jenis Garam Kusamba",
            text: "Air laut pekat pada petakan garam Kusamba memiliki massa jenis yang lebih {0} dibandingkan air tawar. Besarnya massa jenis ini disebabkan oleh susunan partikel terlarut yang sangat {1}...",
            answers: ["Tinggi", "Rapat"],
            bank: ["Tinggi", "Rapat", "Rendah", "Renggang"]
        },
        {
            id: 6,
            title: "Soal 6: Konsep Massa Jenis",
            text: "Massa jenis didefinisikan sebagai perbandingan antara massa dengan {0} suatu zat. Semakin rapat partikel-partikel tersusun dalam suatu ruang, maka massa jenis zat tersebut akan semakin {1}.",
            answers: ["Volume", "Besar"],
            bank: ["Volume", "Besar", "Suhu", "Kecil"]
        },
        {
            id: 7,
            title: "Soal 7: Pembakaran Dupa & Janur Banten",
            text: "Pembakaran dupa Bali yang menghasilkan asap beraroma serta pembusukan janur banten tergolong ke dalam Perubahan {0}. Hal ini dikarenakan proses tersebut menghasilkan {1} yang sifatnya tidak dapat kembali ke bentuk semula.",
            answers: ["Kimia", "Zat Baru"],
            bank: ["Kimia", "Zat Baru", "Fisika", "Endapan"]
        },
        {
            id: 8,
            title: "Soal 8: Kristalisasi Garam Kusamba",
            text: "Proses pembuatan garam Kusamba melalui penguapan air laut merupakan contoh Perubahan {0}. Proses ini hanya melibatkan perubahan wujud dan pemisahan campuran tanpa {1} zat kimia baru.",
            answers: ["Fisika", "Membentuk"],
            bank: ["Fisika", "Membentuk", "Kimia", "Pemisahan"]
        }
    ];

    // --- 4. DATA GAME 3: TANTANGAN MASTER SAINS (MULTIPLE CHOICE) ---
    const GAME3_DATA = [
        {
            id: 1,
            question: "Saat proses pembuatan dupa harum Bali, adonan bahan dipadatkan menjadi bentuk batang dupa. Pernyataan yang benar mengenai sifat wujud zat padat pada batang dupa tersebut berdasarkan teori partikel adalah...",
            options: [
                "Bentuk berubah-ubah, volume tetap, dan jarak antarpartikel sangat berjauhan",
                "Bentuk dan volume tetap, serta partikel-partikelnya terikat kuat dan beraturan",
                "Bentuk dan volume berubah-ubah, serta partikelnya bergerak bebas",
                "Bentuk tetap, volume berubah, dan partikelnya mudah berpindah tempat"
            ],
            correct: 1, // B
            explanation: "Batang dupa merupakan zat padat. Zat padat memiliki bentuk dan volume yang tetap karena gaya tarik antarpartikelnya sangat kuat serta tersusun rapat dan teratur."
        },
        {
            id: 2,
            question: "Ketika minyak atraktan dupa (zat cair) dituangkan ke dalam wadah yang berbeda, bentuknya mengikuti wadah namun volumenya tetap. Hal ini terjadi karena partikel zat cair...",
            options: [
                "Memiliki gaya tarik sangat kuat sehingga tidak bisa bergerak sama sekali",
                "Terikat sangat lemah dan bebas meninggalkan kelompoknya",
                "Masih memiliki gaya tarik cukup kuat, namun partikelnya dapat saling menggelincir/berpindah",
                "Tidak memiliki massa dan tidak menempati ruang"
            ],
            correct: 2, // C
            explanation: "Pada zat cair, jarak antarpartikel sedikit lebih renggang dibanding zat padat dan gaya tariknya agak lemah, memungkinkan partikel untuk saling berpindah/menggelincir tetapi tidak lepas sepenuhnya."
        },
        {
            id: 3,
            question: "Pada proses pembuatan Arak Bali tradisional, uap alkohol hasil pemanasan dimandikan melalui pipa pendingin hingga menetes menjadi cairan arak murni. Proses perubahan wujud yang terjadi pada pipa pendingin tersebut adalah...",
            options: [
                "Menguap (memerlukan panas)",
                "Mengembun/Kondensasi (melepaskan panas)",
                "Menyublim (melepaskan panas)",
                "Membeku (memerlukan panas)"
            ],
            correct: 1, // B
            explanation: "Perubahan wujud dari gas (uap arak) menjadi cair (tetesan arak) disebut mengembun/kondensasi. Proses ini terjadi karena uap melepaskan energi panas ke lingkungan pendingin."
        },
        {
            id: 4,
            question: "Ketika es batu dipanaskan hingga meleleh menjadi air cair, terjadi perubahan pada tingkat partikel, yaitu...",
            options: [
                "Energi kinetik partikel berkurang sehingga partikel bergerak lebih lambat",
                "Partikel air bertambah banyak dan ukurannya membesar",
                "Partikel menyerap energi panas sehingga gerakan partikel semakin cepat dan ikatan merenggang",
                "Partikel zat padat berubah menjadi partikel udara"
            ],
            correct: 2, // C
            explanation: "Saat meleleh/mencair, zat menyerap panas. Panas ini meningkatkan energi kinetik partikel sehingga pergerakannya lebih cepat dan mampu mengatasi gaya tarik antarpartikel yang tadinya kaku."
        },
        {
            id: 5,
            question: "Saat pembuatan garam di Kusamba, air laut yang pekat memiliki massa jenis (ρ) lebih besar dibandingkan air tawar biasa. Hal ini menyebabkan benda yang dimasukkan ke dalam air laut pekat akan lebih mudah...",
            options: [
                "Tenggelam ke dasar wadah",
                "Terapung karena gaya ke atas air laut lebih besar",
                "Lenyap dan mencair",
                "Menyerap air laut hingga habis"
            ],
            correct: 1, // B
            explanation: "Semakin besar massa jenis suatu zat cair, makin besar pula gaya apung (gaya ke atas) yang dihasilkannya, sehingga benda lebih mudah terapung di air laut pekat daripada air tawar."
        },
        {
            id: 6,
            question: "Massa jenis suatu zat menunjukkan seberapa rapat partikel-partikel tersusun dalam suatu volume. Zat yang memiliki massa jenis paling besar pada umumnya memiliki ciri...",
            options: [
                "Partikelnya tersusun sangat rapat dan jumlah massa per satuan volumenya tinggi",
                "Jarak antarpartikelnya sangat berjauhan",
                "Partikelnya bergerak bebas dengan kecepatan tinggi",
                "Memiliki volume yang selalu berubah-ubah"
            ],
            correct: 0, // A
            explanation: "Kerapatan partikel berbanding lurus dengan massa jenis. Semakin rapat susunan partikel dalam suatu ruang, semakin besar massa per satuan volumenya."
        },
        {
            id: 7,
            question: "Di antara peristiwa dalam kehidupan masyarakat Bali berikut: (1) Garam melarut dalam air kopyokan, (2) Pembakaran dupa menghasilkan abu/asap, (3) Es batu meleleh, (4) Pembusukan janur banten. Peristiwa yang tergolong ke dalam Perubahan Kimia ditunjukkan oleh nomor...",
            options: [
                "1 dan 3",
                "1 dan 4",
                "2 dan 4",
                "2 dan 3"
            ],
            correct: 2, // C (2 dan 4)
            explanation: "Perubahan kimia menghasilkan zat baru yang sifatnya berbeda dan tidak dapat kembali ke bentuk semula. Pembakaran dupa (2) dan pembusukan janur (4) menghasilkan zat baru."
        },
        {
            id: 8,
            question: "Pada pembuatan garam di Kusamba, air laut dialirkan dan diuapkan di bawah sinar matahari hingga menyisakan kristal garam putih. Proses ini dikategorikan sebagai Perubahan Fisika karena...",
            options: [
                "Terbentuk zat kimia baru yang beracun",
                "Sifat kimia garam berubah total dibanding saat berada di dalam air laut",
                "Tidak menghasilkan zat baru, hanya terjadi pemisahan campuran dan perubahan wujud",
                "Terjadi perubahan warna secara permanen"
            ],
            correct: 2, // C
            explanation: "Pengkristalan garam melalui penguapan air laut tidak menghasilkan zat baru. Garam yang mengkristal tetap memiliki rumus dan sifat kimia yang sama seperti saat terlarut dalam air laut."
        }
    ];

    // --- 5. DATA GAME 4: TEKA-TEKI SILANG (TTS 15x15) ---
    const TTS_DATA = {
        gridSize: 15,
        across: [
            {
                id: "A1",
                num: 1,
                word: "MENGEMBUN",
                row: 11,
                col: 1,
                length: 9,
                clue: "Perubahan wujud uap alkohol menjadi tetesan cairan pada pipa pendingin Arak",
                insight: "Luar biasa! Saat uap alkohol berubah menjadi tetesan Arak, partikel uap melepaskan kalor ke pipa bambu yang dingin, membuat jarak antarpartikelnya merapat menjadi wujud cair."
            },
            {
                id: "A2",
                num: 2,
                word: "ARAK",
                row: 9,
                col: 3,
                length: 4,
                clue: "Minuman tradisional Bali hasil fermentasi nira dan destilasi",
                insight: "Tepat! Arak Bali dihasilkan dari proses penyulingan. Di mana cairan dipanaskan agar partikelnya menguap, lalu didinginkan kembali agar merapat menjadi cair."
            },
            {
                id: "A3",
                num: 3,
                word: "SUBMIKROSKOPIS",
                row: 5,
                col: 2,
                length: 14,
                clue: "Level representasi IPA tentang wujud zat berdasarkan struktur dan jarak partikel",
                insight: "Hebat! Dengan melihat sesuatu secara sub-mikroskopis, kamu sedang membayangkan benda dari struktur, jarak, dan kecepatan pergerakan partikel terkecilnya!"
            },
            {
                id: "A4",
                num: 4,
                word: "UAP",
                row: 6,
                col: 1,
                length: 3,
                clue: "Wujud zat yang terbentuk saat air laut Kusamba menguap",
                insight: "Benar! Saat air laut dipanaskan matahari, partikel air menyerap energi panas. Gerakannya semakin cepat hingga terlepas dari ikatan dan menyebar menjadi uap."
            },
            {
                id: "A5",
                num: 5,
                word: "SUHU",
                row: 14,
                col: 5,
                length: 4,
                clue: "Derajat panas zat yang jika ditingkatkan mempercepat energi kinetik",
                insight: "Tepat! Suhu adalah derajat panas. Semakin tinggi suhu, semakin besar energi yang diterima partikel untuk bergerak menjauhi satu sama lain."
            }
        ],
        down: [
            {
                id: "D1",
                num: 1,
                word: "MASSAJENIS",
                row: 5,
                col: 5,
                length: 10,
                clue: "Ukuran kerapatan partikel. Benda mudah terapung karena nilai ini tinggi",
                insight: "Kerja bagus! Massa Jenis menunjukkan seberapa rapat partikel di dalam benda. Semakin rapat partikelnya, semakin berat benda itu walau ukurannya kecil!"
            },
            {
                id: "D2",
                num: 2,
                word: "CAIR",
                row: 3,
                col: 14,
                length: 4,
                clue: "Wujud zat minyak atraktan dupa yang bentuknya mengikuti wadah",
                insight: "Tepat! Pada zat cair, gaya tarik antarpartikelnya agak lemah. Partikelnya bisa saling menggelincir, itu sebabnya minyak wangi bisa dituang dan berubah bentuk."
            },
            {
                id: "D3",
                num: 3,
                word: "DUPA",
                row: 4,
                col: 3,
                length: 4,
                clue: "Sarana upakara berwujud padat dengan partikel kaku dan rapat",
                insight: "Hebat! Batang dupa adalah benda padat. Karena gaya tarik partikelnya kuat, posisinya kaku dan beraturan sehingga bentuknya tidak mudah berubah."
            },
            {
                id: "D4",
                num: 4,
                word: "KALOR",
                row: 5,
                col: 7,
                length: 5,
                clue: "Bentuk energi panas yang diserap/dilepaskan saat perubahan wujud",
                insight: "Benar! Kalor adalah energi panas. Ketika suatu zat menyerap kalor, partikelnya akan meregang. Saat melepaskan kalor, partikelnya akan merapat."
            },
            {
                id: "D5",
                num: 5,
                word: "KIMIA",
                row: 9,
                col: 6,
                length: 5,
                clue: "Jenis perubahan zat pada pembakaran dupa yang menghasilkan abu",
                insight: "Tepat sekali! Pembakaran dupa adalah perubahan kimia. Panas menghancurkan ikatan partikel awal dan membentuk molekul zat jenis baru berupa asap yang tak bisa kembali seperti semula."
            }
        ]
    };

    // --- 6. DATA GAME 5: CARI KATA RAHASIA (15x15) ---
    const CARI_KATA_DATA = {
        gridSize: 15,
        words: [
            {
                id: "w1",
                word: "DUPA",
                row: 14,
                col: 6,
                dir: "H",
                insight: "Batang dupa merupakan contoh wujud zat padat dalam kearifan lokal Bali yang memiliki bentuk dan volume tetap."
            },
            {
                id: "w2",
                word: "PADAT",
                row: 5,
                col: 4,
                dir: "H",
                insight: "Pada zat padat, partikel penyusunnya tersusun sangat rapat, teratur, dan terikat kuat."
            },
            {
                id: "w3",
                word: "MENGEMBUN",
                row: 2,
                col: 2,
                dir: "H",
                insight: "Proses perubahan wujud dari gas ke cair pada destilasi Arak Bali, terjadi karena uap melepaskan kalor."
            },
            {
                id: "w4",
                word: "KALOR",
                row: 7,
                col: 3,
                dir: "V",
                insight: "Energi panas yang memengaruhi energi kinetik dan kecepatan pergerakan partikel zat."
            },
            {
                id: "w5",
                word: "MASSAJENIS",
                row: 4,
                col: 12,
                dir: "V",
                insight: "Ukuran kerapatan partikel (ρ). Air laut pekat Kusamba memiliki massa jenis tinggi sehingga gaya apungnya besar."
            },
            {
                id: "w6",
                word: "KIMIA",
                row: 9,
                col: 7,
                dir: "D",
                insight: "Perubahan zat yang menghasilkan zat baru dan bersifat tidak dapat kembali ke bentuk semula (irreversible), seperti pembakaran dupa."
            }
        ]
    };

    // --- 7. DATA GAME 6: TEBAK JAWABAN (GUESS THE ANSWER) ---
    const TEBAK_DATA = [
        {
            level: 1,
            title: "Level 1: Misteri Upakara Yadnya",
            answer: "DUPAHARUM",
            displayAnswer: "DUPA HARUM",
            clues: [
                "Aku adalah benda beraroma wangi yang selalu hadir dalam setiap upakara yadnya di Bali.",
                "Bentuk dan volumeku selalu tetap meskipun aku dipindahkan ke berbagai tempat.",
                "Partikel-partikel penyusunku tersusun sangat rapat, teratur, dan terikat gaya tarik yang sangat kuat."
            ],
            feedback: "Hebat! Dupa Harum adalah contoh zat padat dengan susunan partikel sangat rapat dan terikat kuat."
        },
        {
            level: 2,
            title: "Level 2: Tradisi Pipa Bambu Pendingin",
            answer: "MENGEMBUN",
            displayAnswer: "MENGEMBUN",
            clues: [
                "Aku adalah bagian penting dalam tradisi pembuatan Arak Bali di dalam pipa bambu pendingin.",
                "Aku mengubah uap alkohol yang panas menjadi tetesan cairan Arak Bali yang murni.",
                "Prosesku terjadi karena partikel gas melepaskan energi panas (kalor) sehingga pergerakannya merapat."
            ],
            feedback: "Suksma! Mengembun (kondensasi) adalah perubahan uap gas menjadi cair akibat pelepasan kalor."
        },
        {
            level: 3,
            title: "Level 3: Petakan Pesisir Karangasem",
            answer: "AIRLAUTPEKAT",
            displayAnswer: "AIR LAUT PEKAT",
            clues: [
                "Aku berada di petakan kayu kelapa khas petani di daerah pesisir pantai Karangasem Bali.",
                "Kandungan zat terlarutku yang tinggi membuat benda lebih mudah terapung di atas permukaanku.",
                "Susunan partikelku sangat rapat sehingga aku memiliki massa jenis (ρ) yang lebih besar dari air tawar."
            ],
            feedback: "Luar biasa! Air laut pekat Kusamba memiliki massa jenis tinggi karena kerapatan partikel terlarutnya besar."
        },
        {
            level: 4,
            title: "Level 4: Reaksi Pembakaran Dupa",
            answer: "PERUBAHANKIMIA",
            displayAnswer: "PERUBAHAN KIMIA",
            clues: [
                "Aku terjadi ketika dupa Bali dibakar hingga menghasilkan abu dan asap beraroma.",
                "Prosesku tidak dapat dikembalikan lagi ke bentuk semula (irreversible).",
                "Aku menghasilkan zat baru yang memiliki struktur molekul dan sifat kimia berbeda dari bahan asalnya."
            ],
            feedback: "Pintar! Pembakaran dupa tergolong Perubahan Kimia karena menghasilkan zat baru (abu dan asap)."
        }
    ];

    // --- 8. DATA GAME 7: TRUE/FALSE QUESTION (KUIS CEPAT) ---
    const TF_GAME_DATA = [
        {
            id: 1,
            topic: "Dupa Harum",
            statement: "Batang dupa harum Bali memiliki bentuk dan volume yang selalu tetap karena gaya tarik antarpartikel penyusunnya sangat lemah dan bergerak bebas.",
            answer: false, // SALAH
            feedback: "Salah! Batang dupa berwujud padat, sehingga gaya tarik antarpartikelnya sangat kuat dan tersusun rapat."
        },
        {
            id: 2,
            topic: "Minyak Atraktan",
            statement: "Minyak atraktan dupa dapat dituangkan ke berbagai wadah karena partikel zat cair masih memiliki gaya tarik cukup kuat, tetapi partikelnya dapat saling menggelincir.",
            answer: true, // BENAR
            feedback: "Tepat sekali! Partikel zat cair dapat saling menggelincir sehingga bentuknya menyesuaikan wadah."
        },
        {
            id: 3,
            topic: "Destilasi Arak",
            statement: "Proses pembentukan tetesan Arak Bali dari uap alkohol pada pipa pendingin merupakan peristiwa mengembun yang membutuhkan/menyerap kalor dari lingkungan.",
            answer: false, // SALAH
            feedback: "Salah! Mengembun adalah proses melepaskan kalor, bukan menyerap kalor."
        },
        {
            id: 4,
            topic: "Es Daluman",
            statement: "Saat es batu dalam es daluman menyerap kalor dan mencair, energi kinetik partikelnya meningkat sehingga pergerakan partikel semakin cepat.",
            answer: true, // BENAR
            feedback: "Benar! Penyerapan kalor membuat energi kinetik partikel meningkat dan ikatan kaku merenggang."
        },
        {
            id: 5,
            topic: "Garam Kusamba",
            statement: "Benda lebih mudah terapung di atas air laut pekat petakan Garam Kusamba karena air laut pekat memiliki massa jenis (ρ) yang lebih kecil daripada air tawar biasa.",
            answer: false, // SALAH
            feedback: "Salah! Air laut pekat memiliki massa jenis yang lebih besar, sehingga menghasilkan gaya apung yang lebih tinggi."
        },
        {
            id: 6,
            topic: "Pembakaran Dupa",
            statement: "Pembakaran batang dupa harum tergolong ke dalam Perubahan Kimia karena menghasilkan zat baru (abu dan gas) yang sifatnya tidak dapat kembali ke bentuk semula.",
            answer: true, // BENAR
            feedback: "Tepat! Pembakaran dupa menghasilkan zat baru dan bersifat irreversible (Perubahan Kimia)."
        },
        {
            id: 7,
            topic: "Kristalisasi Garam",
            statement: "Proses terbentuknya kristal garam dari penguapan air laut Kusamba tergolong Perubahan Kimia karena terjadi perubahan warna pada air laut.",
            answer: false, // SALAH
            feedback: "Salah! Pengkristalan garam adalah Perubahan Fisika karena hanya pemisahan campuran tanpa membentuk zat kimia baru."
        },
        {
            id: 8,
            topic: "Asap Dupa Harum",
            statement: "Asap wangi dupa menyebar memenuhi ruangan upacara secara spontan karena partikel gas bergerak acak, berkecepatan tinggi, dan kerapatannya sangat renggang.",
            answer: true, // BENAR
            feedback: "Tepat sekali! Partikel gas berjarak sangat renggang dan bergerak cepat ke segala arah sehingga terjadi peristiwa difusi yang memenuhi ruangan."
        },
        {
            id: 9,
            topic: "Penyulingan Arak",
            statement: "Pemisahan alkohol dari tuak pada proses destilasi Arak Bali dapat terjadi karena titik didih alkohol lebih tinggi daripada titik didih air murni.",
            answer: false, // SALAH
            feedback: "Salah! Titik didih alkohol (etanol ~78°C) lebih rendah daripada air murni (100°C), sehingga alkohol menguap lebih dahulu."
        },
        {
            id: 10,
            topic: "Pipa Bambu Arak",
            statement: "Pada pipa bambu destilasi arak, uap alkohol didinginkan sehingga melepaskan kalor ke lingkungan dan berubah wujud menjadi tetesan cairan arak (mengembun).",
            answer: true, // BENAR
            feedback: "Benar! Proses kondensasi (mengembun) adalah perubahan wujud dari gas ke cair yang disertai pelepasan energi kalor."
        },
        {
            id: 11,
            topic: "Palung Garam Kusamba",
            statement: "Air laut yang dijemur di atas palung batang kelapa menguap lebih lambat jika hembusan angin pantai semakin kencang dan suhu terik matahari semakin panas.",
            answer: false, // SALAH
            feedback: "Salah! Suhu yang lebih tinggi dan tiupan angin pantai justru mempercepat laju penguapan (evaporasi) air laut."
        },
        {
            id: 12,
            topic: "Uji Telur Kusamba",
            statement: "Petani garam Kusamba mengetahui air laut sudah cukup pekat jika sebutir telur ayam mentah dapat terapung di permukaan air garam tersebut.",
            answer: true, // BENAR
            feedback: "Tepat sekali! Semakin pekat larutan garam, semakin besar massa jenisnya, sehingga mampu menghasilkan gaya apung yang membuat telur terapung."
        },
        {
            id: 13,
            topic: "Peleburan Perunggu Gong",
            statement: "Logam perunggu yang dipanaskan hingga melebur menjadi cairan merah membara di prapen gamelan Bali tergolong ke dalam Perubahan Kimia.",
            answer: false, // SALAH
            feedback: "Salah! Peleburan logam adalah Perubahan Fisika (mencair) karena susunan kimianya tetap dan dapat memadat kembali saat didinginkan."
        },
        {
            id: 14,
            topic: "Santan Kelapa Daluman",
            statement: "Campuran santan kelapa pada Es Daluman merupakan zat cair yang memiliki volume tetap, namun bentuknya selalu berubah mengikuti bentuk wadah penyajiannya.",
            answer: true, // BENAR
            feedback: "Benar! Zat cair memiliki volume yang tetap karena partikelnya masih terikat cukup rapat, tetapi bentuknya fleksibel mengikuti wadah."
        },
        {
            id: 15,
            topic: "Pengeringan Janur Canang",
            statement: "Janur canang sari yang mengering dan mengeras di bawah terik matahari mengalami peristiwa Perubahan Kimia karena menghasilkan gas beracun baru.",
            answer: false, // SALAH
            feedback: "Salah! Pengeringan janur adalah pelepasan kadar air melalui penguapan biasa (Perubahan Fisika), bukan pembentukan senyawa kimia baru."
        }
    ];

    // --- 9. DATA GAME 8: MEMORY GAME (PENCOCOKAN KARTU CSS 3D) ---
    const MEMORY_GAME_DATA = [
        {
            pairId: "pair_1",
            type: "ethno",
            name: "Batang Dupa",
            subtext: "Bentuk & Volume Tetap",
            image: "assets/images/memory_game/card_ethno_dupa_batang.jpg"
        },
        {
            pairId: "pair_1",
            type: "sci",
            name: "Partikel Padat Rapat",
            subtext: "Gaya Tarik Kuat & Kaku",
            image: "assets/images/memory_game/card_sci_padat.jpg"
        },
        {
            pairId: "pair_2",
            type: "ethno",
            name: "Asap Dupa Harum",
            subtext: "Menyebar Bebas",
            image: "assets/images/memory_game/card_ethno_dupa_asap.jpg"
        },
        {
            pairId: "pair_2",
            type: "sci",
            name: "Partikel Gas Acak",
            subtext: "Gaya Tarik Sangat Lemah",
            image: "assets/images/memory_game/card_sci_gas.jpg"
        },
        {
            pairId: "pair_3",
            type: "ethno",
            name: "Destilasi Arak Bali",
            subtext: "Tetesan Cairan Murni",
            image: "assets/images/memory_game/card_ethno_arak.jpg"
        },
        {
            pairId: "pair_3",
            type: "sci",
            name: "Kondensasi (Mengembun)",
            subtext: "Partikel Melepas Kalor",
            image: "assets/images/memory_game/card_sci_kondensasi.jpg"
        },
        {
            pairId: "pair_4",
            type: "ethno",
            name: "Es Daluman Meleleh",
            subtext: "Es Berubah Cair",
            image: "assets/images/memory_game/card_ethno_daluman.jpg"
        },
        {
            pairId: "pair_4",
            type: "sci",
            name: "Mencair (Peleburan)",
            subtext: "Partikel Menyerap Kalor",
            image: "assets/images/memory_game/card_sci_mencair.jpg"
        },
        {
            pairId: "pair_5",
            type: "ethno",
            name: "Garam Kusamba",
            subtext: "Benda Lebih Terapung",
            image: "assets/images/memory_game/card_ethno_garam.jpg"
        },
        {
            pairId: "pair_5",
            type: "sci",
            name: "Larutan Air Laut Pekat",
            subtext: "Massa Jenis (ρ) Besar",
            image: "assets/images/memory_game/card_sci_massa_jenis.jpg"
        },
        {
            pairId: "pair_6",
            type: "ethno",
            name: "Pembakaran Dupa",
            subtext: "Menghasilkan Abu & Asap",
            image: "assets/images/memory_game/card_ethno_dupa_bakar.jpg"
        },
        {
            pairId: "pair_6",
            type: "sci",
            name: "Perubahan Kimia",
            subtext: "Membentuk Zat Baru",
            image: "assets/images/memory_game/card_sci_kimia.jpg"
        }
    ];

    // --- 10. DATA GAME 9: MULTIPLE CHOICE (SUDDEN DEATH) ---
    const SUDDEN_DEATH_DATA = [
        {
            level: 1,
            levelTitle: "Wujud Zat",
            questions: [
                {
                    id: 1,
                    question: "Saat proses pembuatan dupa harum Bali, adonan bahan dipadatkan menjadi bentuk batang dupa. Pernyataan yang benar mengenai sifat wujud zat padat...",
                    options: [
                        "Bentuk berubah-ubah, volume tetap",
                        "Bentuk dan volume tetap, serta partikel terikat kuat",
                        "Bentuk dan volume berubah-ubah",
                        "Bentuk tetap, volume berubah"
                    ],
                    correct: 1, // B
                    explanation: "Batang dupa merupakan zat padat. Memiliki bentuk dan volume tetap karena gaya tarik antarpartikel sangat kuat serta tersusun rapat."
                },
                {
                    id: 2,
                    question: "Ketika minyak atraktan dupa dituangkan ke wadah, bentuk mengikuti wadah namun volume tetap. Hal ini karena partikel zat cair...",
                    options: [
                        "Memiliki gaya tarik sangat kuat sehingga tidak bergerak",
                        "Terikat sangat lemah dan bebas",
                        "Masih memiliki gaya tarik cukup kuat, namun partikel dapat saling menggelincir",
                        "Tidak memiliki massa"
                    ],
                    correct: 2, // C
                    explanation: "Jarak antarpartikel sedikit renggang dan gaya tariknya agak lemah, memungkinkan partikel untuk saling berpindah/menggelincir."
                }
            ]
        },
        {
            level: 2,
            levelTitle: "Perubahan Wujud",
            questions: [
                {
                    id: 3,
                    question: "Pada proses pembuatan Arak Bali, uap alkohol dimandikan melalui pipa pendingin hingga menetes menjadi cairan. Proses perubahan wujudnya adalah...",
                    options: [
                        "Menguap (memerlukan kalor)",
                        "Mengembun/Kondensasi (melepaskan kalor)",
                        "Menyublim (melepaskan kalor)",
                        "Membeku (memerlukan kalor)"
                    ],
                    correct: 1, // B
                    explanation: "Perubahan wujud gas menjadi cair disebut mengembun. Proses ini terjadi karena uap melepaskan kalor ke lingkungan pendingin."
                },
                {
                    id: 4,
                    question: "Ketika es batu dipanaskan hingga meleleh, terjadi perubahan pada partikel, yaitu...",
                    options: [
                        "Energi kinetik berkurang",
                        "Partikel bertambah banyak",
                        "Partikel menyerap panas sehingga gerakan cepat dan ikatan merenggang",
                        "Partikel zat padat berubah menjadi udara"
                    ],
                    correct: 2, // C
                    explanation: "Saat mencair, zat menyerap kalor yang meningkatkan energi kinetik partikel sehingga pergerakannya cepat mengatasi gaya tarik yang kaku."
                }
            ]
        },
        {
            level: 3,
            levelTitle: "Massa Jenis",
            questions: [
                {
                    id: 5,
                    question: "Air laut pekat di Kusamba memiliki massa jenis (ρ) lebih besar dibandingkan air tawar. Benda di dalam air laut pekat akan lebih mudah...",
                    options: [
                        "Tenggelam ke dasar",
                        "Terapung karena gaya ke atas air laut lebih besar",
                        "Lenyap dan mencair",
                        "Menyerap air laut"
                    ],
                    correct: 1, // B
                    explanation: "Semakin besar massa jenis cairan, makin besar gaya apungnya, sehingga benda lebih mudah terapung."
                },
                {
                    id: 6,
                    question: "Zat yang memiliki massa jenis paling besar pada umumnya memiliki ciri...",
                    options: [
                        "Partikelnya tersusun sangat rapat dan jumlah massa per satuan volumenya tinggi",
                        "Jarak antarpartikelnya sangat berjauhan",
                        "Partikel bergerak bebas",
                        "Volume berubah-ubah"
                    ],
                    correct: 0, // A
                    explanation: "Kerapatan partikel berbanding lurus dengan massa jenis. Makin rapat partikel, makin besar massa per satuan volumenya."
                }
            ]
        },
        {
            level: 4,
            levelTitle: "Perubahan Fisika & Kimia",
            questions: [
                {
                    id: 7,
                    question: "Di antara peristiwa: (1) Garam melarut, (2) Pembakaran dupa menghasilkan abu, (3) Es meleleh, (4) Pembusukan janur. Yang tergolong Perubahan Kimia adalah...",
                    options: [
                        "1 dan 3",
                        "1 dan 4",
                        "2 dan 4",
                        "2 dan 3"
                    ],
                    correct: 2, // C
                    explanation: "Perubahan kimia menghasilkan zat baru yang sifatnya tidak dapat kembali ke asal. Pembakaran dupa (2) dan pembusukan janur (4) menghasilkan zat baru."
                },
                {
                    id: 8,
                    question: "Pembuatan garam di Kusamba dengan menguapkan air laut dikategorikan sebagai Perubahan Fisika karena...",
                    options: [
                        "Terbentuk zat kimia baru beracun",
                        "Sifat kimia garam berubah total",
                        "Tidak menghasilkan zat baru, hanya pemisahan campuran dan perubahan wujud",
                        "Terjadi perubahan warna permanen"
                    ],
                    correct: 2, // C
                    explanation: "Pengkristalan garam melalui penguapan tidak menghasilkan zat baru. Garam yang mengkristal tetap memiliki rumus dan sifat kimia yang sama."
                }
            ]
        }
    ];

    // --- 11. LOKA-PLAY CONTROLLER CLASS ---
    class LokaPlayController {
        constructor() {
            this.container = null;
            this.currentGame = null; // 'hub', 'game1', 'game2', 'game3', 'game_tts', 'game_carikata', 'game_tebak'
            
            // Game 1 State
            this.g1QuestionIndex = 0;
            this.g1SolvedCards = new Set();
            this.activeDragElement = null;
            this.dragOffset = { x: 0, y: 0 };
            
            // Game 2 State
            this.g2QuestionIndex = 0;
            this.g2Placements = {}; // slotIndex -> word
            
            // Game 3 State
            this.g3Questions = [];
            this.g3CurrentIndex = 0;
            this.g3Lives = 3;
            this.g3Score = 0;
            this.g3IsAnswered = false;

            // Game 4 State (TTS 15x15)
            this.ttsActiveCell = { r: 5, c: 2 };
            this.ttsActiveDir = 'across'; // 'across' or 'down'
            this.ttsUserInputs = {}; // "r,c" -> letter
            this.ttsSolvedWords = new Set();
            this.ttsRevealedCells = new Set();

            // Game 5 State (Cari Kata 15x15)
            this.wsTimer = null;
            this.wsSeconds = 0;
            this.wsFoundWords = new Set();
            this.wsSelectedCells = [];
            this.wsWordColors = {
                "DUPA": "#f59e0b",
                "PADAT": "#0284c7",
                "MENGEMBUN": "#06b6d4",
                "KALOR": "#ef4444",
                "MASSAJENIS": "#10b981",
                "KIMIA": "#8b5cf6"
            };

            // Game 6 State (Tebak Jawaban)
            this.tebakLevelIndex = 0;
            this.tebakLives = 3;
            this.tebakUnlockedClues = 1;
            this.tebakCurrentAnswer = [];
            this.tebakEarnedExpTotal = 0;
            this.tebakTotalStars = 0;

            // Game 7 State (True/False Time-Attack)
            this.tfQuestions = [];
            this.tfCurrentIndex = 0;
            this.tfScore = 0;
            this.tfEarnedExp = 0;
            this.tfCombo = 0;
            this.tfMaxCombo = 0;
            this.tfTimer = null;
            this.tfTimeLeft = 15;
            this.tfQuestionStartTime = 0;

            // Game 8 State (Memory Game CSS 3D)
            this.memCards = [];
            this.memFlipped = [];
            this.memMatchedPairs = 0;
            this.memMoves = 0;
            this.memIsLocked = false;

            // Game 9 State (Sudden Death Multiple Choice)
            this.sdLevelIndex = 0;
            this.sdQuestions = [];
            this.sdCurrentIndex = 0;
            this.sdTimer = null;
            this.sdSeconds = 0;
            this.sdEarnedExp = 0;
            this.sdIsAnswered = false;
        }

        cleanupGhosts() {
            document.querySelectorAll('.g1-card-dragging, .g2-chip-dragging').forEach(el => el.remove());
            if (this.stopWSTimer) this.stopWSTimer();
            if (this.stopTFTimer) this.stopTFTimer();
            if (this.stopSDTimer) this.stopSDTimer();
        }

        init() {
            this.container = document.getElementById('game-screen');
            if (!this.container) return;
            this.cleanupGhosts();
            this.showHub();
        }

        // ==========================================
        // HUB: MENU SELEKTOR GAME LOKA-PLAY
        // ==========================================
        showHub() {
            this.cleanupGhosts();
            this.currentGame = 'hub';
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" data-target="home">← Beranda</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge">ARENA ETNOSAINS</span>
                            <h2>Loka-Play</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="lokaplay-status-capsule">
                            <span class="loka-star-icon">⭐</span>
                            <span class="loka-score-text">Belajar Sains Sambil Bermain</span>
                        </div>
                    </div>
                </header>

                <main class="lokaplay-hub-content">
                    <div class="hub-welcome-banner">
                        <div class="hub-banner-text">
                            <h3>Pilih Arena Tantangan Sains Bali!</h3>
                            <p>Uji pemahaman wujud zat, energi panas, dan perubahan materi melalui 6 permainan interaktif yang seru dan menantang.</p>
                        </div>
                    </div>

                    <div class="game-select-grid">
                        <!-- GAME 1 CARD -->
                        <div class="game-card" id="btn-start-game1">
                            <div class="game-card-badge">Game 1 • Visual Drag & Drop</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🃏</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Misteri Wujud Benda</h3>
                                <p>Seret kartu benda etnosains Bali (Dupa, Arak, Garam Kusamba) ke papan kategori yang tepat.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">4 Level Soal</span>
                                <button class="btn-play-game">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 2 CARD -->
                        <div class="game-card" id="btn-start-game2">
                            <div class="game-card-badge">Game 2 • Drag The Words</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🔍</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Detektif Zat</h3>
                                <p>Lengkapi narasi ilmiah kearifan lokal Bali dengan menyeret kata kunci sains yang sesuai.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">8 Soal Wujud Zat</span>
                                <button class="btn-play-game">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 3 CARD -->
                        <div class="game-card" id="btn-start-game3">
                            <div class="game-card-badge">Game 3 • Game Show Quiz</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🏆</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Tantangan Master Sains</h3>
                                <p>Jawab kuis bergaya Game Show berhadiah bintang! Jaga 3 nyawamu dan raih gelar Master.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">3 Nyawa • 8 Soal Acak</span>
                                <button class="btn-play-game">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 4 CARD (TTS 15x15) -->
                        <div class="game-card" id="btn-start-game-tts">
                            <div class="game-card-badge" style="background:#fef3c7; color:#b45309;">Game 4 • TTS Interaktif</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🧩</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Teka-Teki Silang</h3>
                                <p>Pecahkan teka-teki silang sains Bali dalam matriks 15x15! Dapatkan insight edukatif sub-mikroskopis.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">Matriks 15x15 • Bantuan EXP</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #d97706, #b45309);">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 5 CARD (CARI KATA) -->
                        <div class="game-card" id="btn-start-game-carikata">
                            <div class="game-card-badge" style="background:#ecfdf5; color:#059669;">Game 5 • Cari Kata</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🔎</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Cari Kata Rahasia</h3>
                                <p>Temukan 6 kata kunci sains tersembunyi di grid 15x15! Selesaikan &lt; 01:30 untuk bonus Cendekia.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">Timer & Bonus • Hint EXP</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #059669, #047857);">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 6 CARD (TEBAK JAWABAN) -->
                        <div class="game-card" id="btn-start-game-tebak">
                            <div class="game-card-badge" style="background:#fdf2f8; color:#be185d;">Game 6 • Tebak Jawaban</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🪷</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Tebak Jawaban</h3>
                                <p>Buka 3 lapis petunjuk rahasia dan tebak wujud zatnya! Jaga 3 nyawa teratai sucimu agar tidak gugur.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">4 Level • 3 Clue • 3 Nyawa</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #db2777, #be185d);">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 7 CARD (TRUE/FALSE TIME-ATTACK) -->
                        <div class="game-card" id="btn-start-game-tf">
                            <div class="game-card-badge" style="background:#ecfeff; color:#0891b2;">Game 7 • Time-Attack</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">⚡</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Kuis Cepat (True / False)</h3>
                                <p>Berpacu dengan waktu 15 detik! Jawab Benar atau Salah, raih Speed Bonus dan Combo Strike Multiplier.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">15 Detik • Speed & Combo</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 8 CARD (MEMORY GAME CSS 3D) -->
                        <div class="game-card" id="btn-start-game-memory">
                            <div class="game-card-badge" style="background:#fefce8; color:#ca8a04;">Game 8 • Memory 3D</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">🎴</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Pencocokan Kartu 3D</h3>
                                <p>Uji ketajaman memorimu! Cocokkan fenomena Etnosains Bali dengan konsep sains sub-mikroskopis.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">Grid 3x4 • 3D Flip • Bintang</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #eab308, #ca8a04);">Mulai Main ▶</button>
                            </div>
                        </div>

                        <!-- GAME 9 CARD (MULTIPLE CHOICE SUDDEN DEATH) -->
                        <div class="game-card" id="btn-start-game-suddendeath">
                            <div class="game-card-badge" style="background:#fff1f2; color:#e11d48;">Game 9 • Sudden Death</div>
                            <div class="game-card-icon-box">
                                <span class="game-emoji">💀</span>
                            </div>
                            <div class="game-card-body">
                                <h3>Tantangan Sudden Death</h3>
                                <p>Taklukkan 4 Level Wujud Zat tanpa boleh salah satu kali pun! Salah sekali, ulang dari awal Level 1.</p>
                            </div>
                            <div class="game-card-footer">
                                <span class="game-tag">4 Level • 8 Soal • No Mistake</span>
                                <button class="btn-play-game" style="background: linear-gradient(135deg, #f43f5e, #e11d48);">Mulai Main ▶</button>
                            </div>
                        </div>
                    </div>
                </main>
            `;

            // Bind events for hub
            const backBtn = this.container.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    SoundFx.play('click');
                    this.cleanupGhosts();
                    if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                        window.ZatlokaApp.navigateTo('home');
                    }
                });
            }

            document.getElementById('btn-start-game1').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame1();
            });
            document.getElementById('btn-start-game2').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame2();
            });
            document.getElementById('btn-start-game3').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame3();
            });
            document.getElementById('btn-start-game-tts').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameTTS();
            });
            document.getElementById('btn-start-game-carikata').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameCariKata();
            });
            document.getElementById('btn-start-game-tebak').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameTebak();
            });
            document.getElementById('btn-start-game-tf').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameTF();
            });
            document.getElementById('btn-start-game-memory').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameMemory();
            });
            document.getElementById('btn-start-game-suddendeath').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGameSuddenDeath();
            });
        }

        // ==========================================
        // GAME 1: MISTERI WUJUD BENDA (DRAG AND DROP)
        // ==========================================
        initGame1(questionIdx = 0) {
            this.cleanupGhosts();
            this.currentGame = 'game1';
            this.g1QuestionIndex = questionIdx;
            this.g1SolvedCards = new Set();
            this.renderGame1();
        }

        renderGame1() {
            this.cleanupGhosts();
            const qData = GAME1_DATA[this.g1QuestionIndex];
            if (!qData) {
                this.renderGame1Victory();
                return;
            }

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-g1-hub">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge">GAME 1 • DRAG & DROP</span>
                            <h2>Misteri Wujud Benda</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="lokaplay-progress-pill">
                            Soal ${this.g1QuestionIndex + 1} / ${GAME1_DATA.length}
                        </div>
                    </div>
                </header>

                <main class="g1-arena">
                    <!-- Instruction bar -->
                    <div class="g1-instruction-bar">
                        <span class="g1-inst-icon">💡</span>
                        <p>${qData.instruction}</p>
                    </div>

                    <!-- Drop Zones Area (Top) -->
                    <div class="g1-dropzones-wrapper" id="g1-dropzones-container">
                        ${qData.dropZones.map(dz => `
                            <div class="g1-dropzone" data-target-id="${dz.id}" style="border-color: ${dz.color};">
                                <div class="g1-dz-header" style="background: ${dz.bg}; color: ${dz.color};">
                                    <span class="dz-label">${dz.label}</span>
                                    <span class="dz-count" id="dz-count-${dz.id}">0 kartu</span>
                                </div>
                                <div class="g1-dz-slots" id="dz-slot-${dz.id}"></div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Card Bank Area (Bottom Horizontal Scroll with Fade Edges) -->
                    <div class="g1-bank-wrapper">
                        <div class="g1-bank-scroll-fade left"></div>
                        <div class="g1-card-bank" id="g1-card-bank">
                            ${qData.cards.map(card => `
                                <div class="g1-card" id="card-${card.id}" data-card-id="${card.id}" data-target="${card.target}">
                                    <div class="g1-card-img-box">
                                        <img src="assets/images/lokaplay/${card.img}" alt="${card.name}" 
                                             onerror="this.src='image/lokaplay/${card.img}'" />
                                    </div>
                                    <span class="g1-card-name">${card.name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="g1-bank-scroll-fade right"></div>
                    </div>
                </main>

                <!-- Modal Feedback Kartu Edukatif Game 1 -->
                <div class="g1-card-feedback-modal hidden" id="g1-card-feedback-modal">
                    <div class="g1-card-feedback-card">
                        <div class="g1-fb-topbar">
                            <span class="g1-fb-badge">✨ Penjelasan Konsep & Etnosains</span>
                            <span class="g1-fb-category" id="g1-fb-category">Kategori</span>
                        </div>
                        <div class="g1-fb-card-preview">
                            <div class="g1-fb-img-box">
                                <img id="g1-fb-card-img" src="" alt="Kartu" />
                            </div>
                            <div class="g1-fb-item-info">
                                <span class="g1-fb-item-tag">Benda Terpilih</span>
                                <h4 id="g1-fb-card-name" class="g1-fb-item-name">Nama Benda</h4>
                            </div>
                        </div>
                        <div class="g1-fb-explanation-box">
                            <div class="g1-fb-sparkle-icon">💡</div>
                            <p id="g1-fb-text" class="g1-fb-text"></p>
                        </div>
                        <div class="g1-fb-actions">
                            <button class="btn-fb-continue" id="btn-g1-fb-ok">
                                <span>Lanjut Belajar</span>
                                <span class="btn-arrow">▶</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mini Success Popup -->
                <div class="g1-success-modal hidden" id="g1-success-modal">
                    <div class="g1-success-card">
                        <div class="g1-success-icon">🎉</div>
                        <h3>Luar Biasa!</h3>
                        <p>Semua benda berhasil dikelompokkan dengan tepat sesuai konsep sains.</p>
                        <button class="btn btn-primary" id="btn-g1-next">Lanjut Soal Berikutnya ▶</button>
                    </div>
                </div>
            `;

            // Hub back button
            document.getElementById('btn-g1-hub').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });

            // Bind drag interactions (Pointer Events: Works for both Touch and Mouse)
            this.setupGame1DragInteractions(qData);
        }

        setupGame1DragInteractions(qData) {
            const cards = this.container.querySelectorAll('.g1-card');
            const dropzones = this.container.querySelectorAll('.g1-dropzone');
            const bank = document.getElementById('g1-card-bank');

            cards.forEach(card => {
                let startX = 0, startY = 0;
                let isDragging = false;
                let ghostEl = null;

                // Prevent double click native selection
                card.addEventListener('dblclick', (e) => e.preventDefault());

                const onPointerDown = (e) => {
                    if (this.g1SolvedCards.has(card.dataset.cardId)) return;
                    if (e.button && e.button !== 0) return;

                    this.cleanupGhosts();
                    startX = e.clientX;
                    startY = e.clientY;
                    isDragging = false;
                    ghostEl = null;

                    const rect = card.getBoundingClientRect();
                    this.dragOffset.x = e.clientX - rect.left;
                    this.dragOffset.y = e.clientY - rect.top;

                    window.addEventListener('pointermove', onPointerMove);
                    window.addEventListener('pointerup', onPointerUp);
                    window.addEventListener('pointercancel', onPointerUp);
                };

                const onPointerMove = (e) => {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    const dist = Math.hypot(dx, dy);

                    // Threshold: only start drag if moved more than 6px
                    if (!isDragging && dist > 6) {
                        isDragging = true;
                        SoundFx.play('snap');
                        const rect = card.getBoundingClientRect();
                        ghostEl = card.cloneNode(true);
                        ghostEl.classList.add('g1-card-dragging');
                        ghostEl.style.width = `${rect.width}px`;
                        ghostEl.style.height = `${rect.height}px`;
                        ghostEl.style.left = `${rect.left}px`;
                        ghostEl.style.top = `${rect.top}px`;
                        document.body.appendChild(ghostEl);

                        card.style.opacity = '0.3';
                        card.style.transform = 'scale(0.95)';
                    }

                    if (isDragging && ghostEl) {
                        e.preventDefault();
                        ghostEl.style.left = `${e.clientX - this.dragOffset.x}px`;
                        ghostEl.style.top = `${e.clientY - this.dragOffset.y}px`;

                        // Check hover on dropzones
                        dropzones.forEach(dz => {
                            const dzRect = dz.getBoundingClientRect();
                            if (
                                e.clientX >= dzRect.left &&
                                e.clientX <= dzRect.right &&
                                e.clientY >= dzRect.top &&
                                e.clientY <= dzRect.bottom
                            ) {
                                dz.classList.add('g1-dz-hover');
                            } else {
                                dz.classList.remove('g1-dz-hover');
                            }
                        });
                    }
                };

                const onPointerUp = (e) => {
                    window.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    window.removeEventListener('pointercancel', onPointerUp);

                    dropzones.forEach(dz => dz.classList.remove('g1-dz-hover'));

                    if (!isDragging || !ghostEl) {
                        // Simple click or double click: reset card style immediately
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                        if (ghostEl) {
                            ghostEl.remove();
                            ghostEl = null;
                        }
                        return;
                    }

                    isDragging = false;

                    // Find which dropzone was dropped into
                    let matchedDz = null;
                    dropzones.forEach(dz => {
                        const dzRect = dz.getBoundingClientRect();
                        if (
                            e.clientX >= dzRect.left &&
                            e.clientX <= dzRect.right &&
                            e.clientY >= dzRect.top &&
                            e.clientY <= dzRect.bottom
                        ) {
                            matchedDz = dz;
                        }
                    });

                    const cardTarget = card.dataset.target;
                    const cardId = card.dataset.cardId;

                    if (matchedDz && matchedDz.dataset.targetId === cardTarget) {
                        // BENAR! Tarikan benar menempel
                        SoundFx.play('correct');
                        if (ghostEl) {
                            ghostEl.remove();
                            ghostEl = null;
                        }
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                        card.classList.add('g1-card-snapped');

                        const slot = document.getElementById(`dz-slot-${cardTarget}`);
                        if (slot) {
                            slot.appendChild(card);
                        }
                        this.g1SolvedCards.add(cardId);
                        this.updateGame1DropzoneCounts(qData);

                        const cardData = qData.cards.find(c => c.id === cardId);
                        const isLastCard = (this.g1SolvedCards.size === qData.cards.length);

                        // Tampilkan Pop-up Penjelasan Edukatif
                        setTimeout(() => {
                            this.showGame1CardFeedbackModal(cardData, isLastCard, matchedDz);
                        }, 200);
                    } else {
                        // SALAH / LEPAS DI LUAR: Terpental kembali ke bank
                        SoundFx.play('bounce');
                        if (ghostEl) {
                            const currentGhost = ghostEl;
                            currentGhost.classList.add('g1-card-bouncing');
                            const origRect = card.getBoundingClientRect();
                            currentGhost.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            currentGhost.style.left = `${origRect.left}px`;
                            currentGhost.style.top = `${origRect.top}px`;
                            setTimeout(() => {
                                currentGhost.remove();
                                card.style.opacity = '1';
                                card.style.transform = 'none';
                            }, 250);
                            ghostEl = null;
                        } else {
                            card.style.opacity = '1';
                            card.style.transform = 'none';
                        }
                    }
                };

                card.addEventListener('pointerdown', onPointerDown);
            });
        }

        updateGame1DropzoneCounts(qData) {
            qData.dropZones.forEach(dz => {
                const countEl = document.getElementById(`dz-count-${dz.id}`);
                const slot = document.getElementById(`dz-slot-${dz.id}`);
                if (countEl && slot) {
                    const count = slot.querySelectorAll('.g1-card').length;
                    countEl.textContent = `${count} kartu`;
                }
            });
        }

        showGame1CardFeedbackModal(cardData, isLastCard, matchedDz) {
            const modal = document.getElementById('g1-card-feedback-modal');
            if (!modal || !cardData) return;

            const categoryEl = document.getElementById('g1-fb-category');
            const imgEl = document.getElementById('g1-fb-card-img');
            const nameEl = document.getElementById('g1-fb-card-name');
            const textEl = document.getElementById('g1-fb-text');
            const okBtn = document.getElementById('btn-g1-fb-ok');

            if (categoryEl) {
                const dzLabel = matchedDz ? matchedDz.querySelector('.dz-label')?.textContent : '';
                categoryEl.textContent = dzLabel ? `Kategori: ${dzLabel}` : 'Tepat Sekali!';
            }
            if (imgEl) {
                imgEl.src = `assets/images/lokaplay/${cardData.img}`;
                imgEl.onerror = () => {
                    imgEl.src = `image/lokaplay/${cardData.img}`;
                };
            }
            if (nameEl) {
                nameEl.textContent = cardData.name;
            }
            if (textEl) {
                // Konversi format Markdown **teks** menjadi <strong>teks</strong>
                const formatted = (cardData.explanation || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                textEl.innerHTML = formatted;
            }

            modal.classList.remove('hidden');

            if (okBtn) {
                okBtn.onclick = () => {
                    SoundFx.play('click');
                    modal.classList.add('hidden');

                    if (isLastCard) {
                        addExp(25);
                        setTimeout(() => {
                            this.showGame1SuccessModal();
                        }, 350);
                    }
                };
            }
        }

        showGame1SuccessModal() {
            const modal = document.getElementById('g1-success-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            const nextBtn = document.getElementById('btn-g1-next');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    SoundFx.play('click');
                    this.cleanupGhosts();
                    if (this.g1QuestionIndex + 1 < GAME1_DATA.length) {
                        this.initGame1(this.g1QuestionIndex + 1);
                    } else {
                        this.renderGame1Victory();
                    }
                };
            }
        }

        renderGame1Victory() {
            this.cleanupGhosts();
            SoundFx.play('victory');
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-g1-hub-end">← Menu Game</button>
                    <h2>Misteri Wujud Benda Selesai!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card">
                        <div class="victory-icon">🏆</div>
                        <h3>Selamat, Detektif Sains!</h3>
                        <p>Kamu telah berhasil menuntaskan seluruh 4 level tantangan Misteri Wujud Benda dengan sempurna!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">4 / 4</span>
                                <span class="vstat-lbl">Soal Tuntas</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+100 EXP</span>
                                <span class="vstat-lbl">Bonus Belajar</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-g1-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-g1-to-g2">Lanjut Game 2 (Detektif Zat) ▶</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-g1-hub-end').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });
            document.getElementById('btn-g1-replay').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame1(0);
            });
            document.getElementById('btn-g1-to-g2').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame2(0);
            });
        }

        // ==========================================
        // GAME 2: DETEKTIF ZAT (DRAG THE WORDS)
        // ==========================================
        initGame2(questionIdx = 0) {
            this.cleanupGhosts();
            this.currentGame = 'game2';
            this.g2QuestionIndex = questionIdx;
            this.g2Placements = {};
            this.renderGame2();
        }

        renderGame2() {
            this.cleanupGhosts();
            const qData = GAME2_DATA[this.g2QuestionIndex];
            if (!qData) {
                this.renderGame2Victory();
                return;
            }

            this.g2Placements = {};

            // Acak (shuffle) susunan kata pada Bank Kata agar tidak berurutan dan lebih menantang
            const shuffledBank = shuffleArray(qData.bank);

            // Parse text with dynamic drop slots
            let renderedText = qData.text;
            qData.answers.forEach((ans, idx) => {
                const placeholder = `{${idx}}`;
                const slotHtml = `<span class="g2-drop-slot" data-slot-index="${idx}" data-expected-length="${ans.length}">
                    <span class="g2-slot-placeholder">[ Letakkan Kata ]</span>
                    <span class="g2-slot-filled hidden"></span>
                </span>`;
                renderedText = renderedText.replace(placeholder, slotHtml);
            });

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-g2-hub">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge">GAME 2 • DETEKTIF ZAT</span>
                            <h2>${qData.title}</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="lokaplay-progress-pill">
                            Soal ${this.g2QuestionIndex + 1} / ${GAME2_DATA.length}
                        </div>
                    </div>
                </header>

                <main class="g2-arena">
                    <!-- Instruction -->
                    <div class="g2-instruction-bar">
                        <span class="g2-inst-icon">💡</span>
                        <p>Lengkapi narasi etnosains di bawah dengan menyeret kata dari Bank Kata ke kotak yang tepat!</p>
                    </div>

                    <!-- Paragraph Container (Centered Top) -->
                    <div class="g2-paragraph-card">
                        <div class="g2-paragraph-text">
                            ${renderedText}
                        </div>
                    </div>

                    <!-- Bank Kata (Bottom Horizontal Scroll with Fade Edges) -->
                    <div class="g2-bank-section">
                        <div class="g2-bank-header">
                            <span class="g2-bank-title">Pilihan Bank Kata:</span>
                            <span class="g2-bank-hint">Ketuk atau seret kata ke dalam kotak</span>
                        </div>
                        <div class="g2-bank-wrapper">
                            <div class="g2-bank-scroll-fade left"></div>
                            <div class="g2-word-bank" id="g2-word-bank">
                                ${shuffledBank.map((word, i) => `
                                    <div class="g2-word-chip" data-word="${word}" id="chip-word-${i}">
                                        ${word}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="g2-bank-scroll-fade right"></div>
                        </div>
                    </div>

                    <!-- Action Bar -->
                    <div class="g2-action-bar">
                        <button class="btn btn-secondary" id="btn-g2-reset">🔄 Reset Pilihan</button>
                        <button class="btn btn-primary" id="btn-g2-check">✓ Cek Jawaban</button>
                    </div>
                </main>

                <!-- Game 2 Feedback Modal -->
                <div class="g2-modal-overlay hidden" id="g2-modal">
                    <div class="g2-modal-card">
                        <div class="g2-modal-icon" id="g2-modal-icon">🎉</div>
                        <h3 id="g2-modal-title">Hebat Sekali!</h3>
                        <p id="g2-modal-desc">Seluruh kata kunci sains berhasil kamu tempatkan dengan tepat.</p>
                        <button class="btn btn-primary" id="btn-g2-next">Lanjut Soal Berikutnya ▶</button>
                    </div>
                </div>
            `;

            document.getElementById('btn-g2-hub').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });

            this.setupGame2Interactions(qData);
        }

        setupGame2Interactions(qData) {
            const chips = this.container.querySelectorAll('.g2-word-chip');
            const slots = this.container.querySelectorAll('.g2-drop-slot');

            // Slot click to remove placed word
            slots.forEach(slot => {
                slot.addEventListener('click', () => {
                    const slotIdx = slot.dataset.slotIndex;
                    if (this.g2Placements[slotIdx]) {
                        SoundFx.play('click');
                        const word = this.g2Placements[slotIdx];
                        delete this.g2Placements[slotIdx];
                        
                        // Show placeholder again
                        const ph = slot.querySelector('.g2-slot-placeholder');
                        const filled = slot.querySelector('.g2-slot-filled');
                        ph.classList.remove('hidden');
                        filled.classList.add('hidden');
                        filled.textContent = '';
                        slot.classList.remove('has-word', 'correct-lock', 'wrong-flash');

                        // Un-disable chip in bank
                        chips.forEach(chip => {
                            if (chip.dataset.word === word && chip.classList.contains('used')) {
                                chip.classList.remove('used');
                            }
                        });
                    }
                });
            });

            // Pointer & Click Drag for Chips
            chips.forEach(chip => {
                let startX = 0, startY = 0;
                let isDragging = false;
                let ghostEl = null;

                chip.addEventListener('dblclick', (e) => e.preventDefault());

                // Click / Tap chip selection support
                chip.addEventListener('click', () => {
                    if (chip.classList.contains('used')) return;
                    SoundFx.play('click');

                    // Find first empty slot and place
                    for (let i = 0; i < qData.answers.length; i++) {
                        if (!this.g2Placements[i]) {
                            this.placeWordInSlot(chip.dataset.word, i, chip);
                            break;
                        }
                    }
                });

                // Pointer drag support with threshold
                chip.addEventListener('pointerdown', (e) => {
                    if (chip.classList.contains('used')) return;
                    if (e.button && e.button !== 0) return;

                    this.cleanupGhosts();
                    startX = e.clientX;
                    startY = e.clientY;
                    isDragging = false;
                    ghostEl = null;

                    const rect = chip.getBoundingClientRect();
                    const offX = e.clientX - rect.left;
                    const offY = e.clientY - rect.top;

                    const onMove = (me) => {
                        const dist = Math.hypot(me.clientX - startX, me.clientY - startY);
                        if (!isDragging && dist > 6) {
                            isDragging = true;
                            ghostEl = chip.cloneNode(true);
                            ghostEl.classList.add('g2-chip-dragging');
                            ghostEl.style.width = `${rect.width}px`;
                            ghostEl.style.height = `${rect.height}px`;
                            ghostEl.style.left = `${rect.left}px`;
                            ghostEl.style.top = `${rect.top}px`;
                            document.body.appendChild(ghostEl);
                            chip.style.opacity = '0.4';
                        }

                        if (isDragging && ghostEl) {
                            me.preventDefault();
                            ghostEl.style.left = `${me.clientX - offX}px`;
                            ghostEl.style.top = `${me.clientY - offY}px`;

                            slots.forEach(s => {
                                const sRect = s.getBoundingClientRect();
                                if (
                                    me.clientX >= sRect.left &&
                                    me.clientX <= sRect.right &&
                                    me.clientY >= sRect.top &&
                                    me.clientY <= sRect.bottom
                                ) {
                                    s.classList.add('g2-slot-hover');
                                } else {
                                    s.classList.remove('g2-slot-hover');
                                }
                            });
                        }
                    };

                    const onUp = (ue) => {
                        window.removeEventListener('pointermove', onMove);
                        window.removeEventListener('pointerup', onUp);
                        window.removeEventListener('pointercancel', onUp);

                        slots.forEach(s => s.classList.remove('g2-slot-hover'));

                        if (!isDragging || !ghostEl) {
                            chip.style.opacity = '1';
                            if (ghostEl) {
                                ghostEl.remove();
                                ghostEl = null;
                            }
                            return;
                        }

                        isDragging = false;
                        let targetSlot = null;
                        slots.forEach(s => {
                            const sRect = s.getBoundingClientRect();
                            if (
                                ue.clientX >= sRect.left &&
                                ue.clientX <= sRect.right &&
                                ue.clientY >= sRect.top &&
                                ue.clientY <= sRect.bottom
                            ) {
                                targetSlot = s;
                            }
                        });

                        if (ghostEl) {
                            ghostEl.remove();
                            ghostEl = null;
                        }
                        chip.style.opacity = '1';

                        if (targetSlot) {
                            const slotIdx = targetSlot.dataset.slotIndex;
                            this.placeWordInSlot(chip.dataset.word, slotIdx, chip);
                        }
                    };

                    window.addEventListener('pointermove', onMove);
                    window.addEventListener('pointerup', onUp);
                    window.addEventListener('pointercancel', onUp);
                });
            });

            // Reset button
            document.getElementById('btn-g2-reset').addEventListener('click', () => {
                SoundFx.play('click');
                this.renderGame2();
            });

            // Check Answer button
            document.getElementById('btn-g2-check').addEventListener('click', () => {
                this.checkGame2Answers(qData);
            });
        }

        placeWordInSlot(word, slotIndex, chipEl) {
            const slot = this.container.querySelector(`.g2-drop-slot[data-slot-index="${slotIndex}"]`);
            if (!slot) return;

            // If slot already had a word, return that old word to bank
            if (this.g2Placements[slotIndex]) {
                const oldWord = this.g2Placements[slotIndex];
                const oldChip = this.container.querySelector(`.g2-word-chip[data-word="${oldWord}"].used`);
                if (oldChip) oldChip.classList.remove('used');
            }

            SoundFx.play('snap');
            this.g2Placements[slotIndex] = word;
            if (chipEl) chipEl.classList.add('used');

            const ph = slot.querySelector('.g2-slot-placeholder');
            const filled = slot.querySelector('.g2-slot-filled');
            ph.classList.add('hidden');
            filled.classList.remove('hidden');
            filled.textContent = word;
            slot.classList.add('has-word');
        }

        checkGame2Answers(qData) {
            const placedCount = Object.keys(this.g2Placements).length;
            if (placedCount < qData.answers.length) {
                SoundFx.play('wrong');
                alert("Silakan lengkapi semua kotak kosong sebelum memeriksa jawaban.");
                return;
            }

            let allCorrect = true;
            qData.answers.forEach((expected, idx) => {
                const slot = this.container.querySelector(`.g2-drop-slot[data-slot-index="${idx}"]`);
                const placed = this.g2Placements[idx];

                if (placed === expected) {
                    // Benar: hijau + terkunci
                    if (slot) {
                        slot.classList.remove('wrong-flash');
                        slot.classList.add('correct-lock');
                    }
                } else {
                    allCorrect = false;
                    // Salah: merah + terpental kembali ke bank
                    if (slot) {
                        slot.classList.add('wrong-flash');
                        setTimeout(() => {
                            slot.classList.remove('wrong-flash', 'has-word');
                            const ph = slot.querySelector('.g2-slot-placeholder');
                            const filled = slot.querySelector('.g2-slot-filled');
                            ph.classList.remove('hidden');
                            filled.classList.add('hidden');
                            filled.textContent = '';

                            const wrongWord = this.g2Placements[idx];
                            delete this.g2Placements[idx];
                            const chip = this.container.querySelector(`.g2-word-chip[data-word="${wrongWord}"].used`);
                            if (chip) chip.classList.remove('used');
                        }, 800);
                    }
                }
            });

            if (allCorrect) {
                SoundFx.play('correct');
                addExp(20);
                setTimeout(() => {
                    const modal = document.getElementById('g2-modal');
                    if (modal) {
                        modal.classList.remove('hidden');
                        document.getElementById('btn-g2-next').onclick = () => {
                            SoundFx.play('click');
                            if (this.g2QuestionIndex + 1 < GAME2_DATA.length) {
                                this.initGame2(this.g2QuestionIndex + 1);
                            } else {
                                this.renderGame2Victory();
                            }
                        };
                    }
                }, 500);
            } else {
                SoundFx.play('bounce');
            }
        }

        renderGame2Victory() {
            SoundFx.play('victory');
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-g2-hub-end">← Menu Game</button>
                    <h2>Detektif Zat Selesai!</h2>
                </header>
                <main class="g2-victory-screen">
                    <div class="victory-card">
                        <div class="victory-icon">🔥</div>
                        <h3>Luar Biasa, Detektif Zat!</h3>
                        <p>Kamu telah sukses meneliti seluruh 8 fenomena wujud zat dan perubahan materi pada tradisi Bali!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">8 / 8</span>
                                <span class="vstat-lbl">Soal Tuntas</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+160 EXP</span>
                                <span class="vstat-lbl">Bonus Detektif</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-g2-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-g2-to-g3">Lanjut Game 3 (Master Sains) ▶</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-g2-hub-end').addEventListener('click', () => {
                SoundFx.play('click');
                this.showHub();
            });
            document.getElementById('btn-g2-replay').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame2(0);
            });
            document.getElementById('btn-g2-to-g3').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame3();
            });
        }

        // ==========================================
        // GAME 3: TANTANGAN MASTER SAINS (GAME SHOW)
        // ==========================================
        initGame3() {
            this.cleanupGhosts();
            this.currentGame = 'game3';
            this.g3Lives = 3;
            this.g3Score = 0;
            this.g3CurrentIndex = 0;
            this.g3IsAnswered = false;

            // Dynamically shuffle questions (Acak urutan 8 soal)
            this.g3Questions = [...GAME3_DATA].sort(() => Math.random() - 0.5);
            this.renderGame3();
        }

        renderGame3() {
            this.cleanupGhosts();
            if (this.g3Lives <= 0) {
                this.renderGame3GameOver();
                return;
            }

            const q = this.g3Questions[this.g3CurrentIndex];
            if (!q) {
                this.renderGame3Victory();
                return;
            }

            this.g3IsAnswered = false;
            const letters = ['A', 'B', 'C', 'D'];

            // Build hearts display
            let heartsHtml = '';
            for (let i = 0; i < 3; i++) {
                if (i < this.g3Lives) {
                    heartsHtml += '<span class="life-heart alive">♥️</span>';
                } else {
                    heartsHtml += '<span class="life-heart dead">🖤</span>';
                }
            }

            this.container.innerHTML = `
                <header class="lokaplay-header gameshow-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-g3-hub">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge">GAME 3 • MASTER SAINS</span>
                            <h2>Tantangan Master Sains</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <!-- 3 Lives Display -->
                        <div class="gameshow-lives-bar" id="g3-lives-bar">
                            <span class="lives-label">Nyawa:</span>
                            <div class="hearts-box">${heartsHtml}</div>
                        </div>
                        <div class="gameshow-score-pill">
                            Soal ${this.g3CurrentIndex + 1} / ${this.g3Questions.length}
                        </div>
                    </div>
                </header>

                <main class="g3-arena">
                    <!-- Game Show Stage Container -->
                    <div class="g3-stage-card">
                        <!-- Glowing lights decoration -->
                        <div class="g3-stage-lights"></div>

                        <!-- Question Box -->
                        <div class="g3-question-box">
                            <span class="g3-q-num">Pertanyaan #${this.g3CurrentIndex + 1}</span>
                            <p class="g3-q-text">${q.question}</p>
                        </div>

                        <!-- Options Grid (A, B, C, D) -->
                        <div class="g3-options-grid">
                            ${q.options.map((opt, i) => `
                                <button class="g3-option-btn" data-opt-index="${i}">
                                    <span class="opt-letter">${letters[i]}</span>
                                    <span class="opt-text">${opt}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </main>

                <!-- Feedback & Explanation Dialog -->
                <div class="g3-feedback-modal hidden" id="g3-feedback-modal">
                    <div class="g3-feedback-card" id="g3-feedback-card">
                        <div class="feedback-header">
                            <span class="feedback-emoji" id="g3-fb-emoji">🎉</span>
                            <div class="feedback-title-box">
                                <h3 id="g3-fb-title">Jawaban Benar!</h3>
                                <span class="feedback-subtitle" id="g3-fb-subtitle">Luar biasa, analisis sainsmu sangat tepat!</span>
                            </div>
                        </div>
                        <div class="feedback-body">
                            <h4>📖 Pembahasan Materi:</h4>
                            <p id="g3-fb-explanation">${q.explanation}</p>
                        </div>
                        <div class="feedback-footer">
                            <button class="btn btn-primary" id="btn-g3-next-q">Lanjut Soal Berikutnya ▶</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('btn-g3-hub').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });

            this.setupGame3OptionClicks(q);
        }

        setupGame3OptionClicks(q) {
            const optionBtns = this.container.querySelectorAll('.g3-option-btn');

            optionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (this.g3IsAnswered) return;
                    this.g3IsAnswered = true;
                    const selectedIdx = parseInt(btn.dataset.optIndex, 10);
                    const isCorrect = (selectedIdx === q.correct);

                    if (isCorrect) {
                        SoundFx.play('correct');
                        this.g3Score += 100;
                        addExp(30);
                        btn.classList.add('opt-correct');
                        this.showGame3Feedback(true, q);
                    } else {
                        SoundFx.play('wrong');
                        this.g3Lives -= 1;
                        btn.classList.add('opt-wrong');
                        // Highlight correct option as well
                        const correctBtn = this.container.querySelector(`.g3-option-btn[data-opt-index="${q.correct}"]`);
                        if (correctBtn) correctBtn.classList.add('opt-correct-hint');
                        this.showGame3Feedback(false, q);
                    }
                });
            });
        }

        showGame3Feedback(isCorrect, q) {
            const modal = document.getElementById('g3-feedback-modal');
            const card = document.getElementById('g3-feedback-card');
            const emojiEl = document.getElementById('g3-fb-emoji');
            const titleEl = document.getElementById('g3-fb-title');
            const subEl = document.getElementById('g3-fb-subtitle');
            const expEl = document.getElementById('g3-fb-explanation');
            const nextBtn = document.getElementById('btn-g3-next-q');

            if (!modal) return;

            if (isCorrect) {
                card.className = 'g3-feedback-card feedback-correct';
                emojiEl.textContent = '🎉';
                titleEl.textContent = 'Luar Biasa!';
                subEl.textContent = 'Jawaban Tepat Sekali! Pengetahuan sainsmu terbukti.';
            } else {
                card.className = 'g3-feedback-card feedback-wrong';
                emojiEl.textContent = '⚠️';
                titleEl.textContent = 'Kurang Tepat!';
                subEl.textContent = `1 Nyawa berkurang. Tersisa ${this.g3Lives} nyawa.`;
            }

            expEl.textContent = q.explanation;
            modal.classList.remove('hidden');

            nextBtn.onclick = () => {
                SoundFx.play('click');
                modal.classList.add('hidden');
                if (this.g3Lives <= 0) {
                    this.renderGame3GameOver();
                } else if (this.g3CurrentIndex + 1 < this.g3Questions.length) {
                    this.g3CurrentIndex++;
                    this.renderGame3();
                } else {
                    this.renderGame3Victory();
                }
            };
        }

        renderGame3GameOver() {
            this.cleanupGhosts();
            SoundFx.play('wrong');
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-g3-hub-lose">← Menu Game</button>
                    <h2>Game Over</h2>
                </header>
                <main class="g3-gameover-screen">
                    <div class="gameover-card">
                        <div class="gameover-icon">💔</div>
                        <h3>Nyawa Habis!</h3>
                        <p>Jangan menyerah! Setiap kegagalan adalah langkah menuju penemuan ilmiah yang lebih mendalam.</p>
                        <div class="gameover-stats">
                            <div class="gstat-item">
                                <span class="gstat-num">${this.g3CurrentIndex} / 8</span>
                                <span class="gstat-lbl">Soal Terjawab</span>
                            </div>
                            <div class="gstat-item">
                                <span class="gstat-num">${this.g3Score} Poin</span>
                                <span class="gstat-lbl">Skor Diperoleh</span>
                            </div>
                        </div>
                        <div class="gameover-actions">
                            <button class="btn btn-secondary" id="btn-g3-backhub">Kembali ke Menu Game</button>
                            <button class="btn btn-primary" id="btn-g3-retry">🔄 Coba Lagi</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-g3-hub-lose').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });
            document.getElementById('btn-g3-backhub').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });
            document.getElementById('btn-g3-retry').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame3();
            });
        }

        renderGame3Victory() {
            this.cleanupGhosts();
            SoundFx.play('victory');
            addExp(100);
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-g3-hub-win">← Menu Game</button>
                    <h2>Kemenangan Master Sains!</h2>
                </header>
                <main class="g3-victory-screen">
                    <div class="victory-card">
                        <div class="victory-icon">👑</div>
                        <h3>Selamat, Kamu Menjadi Master Sains Bali!</h3>
                        <p>Luar biasa! Kamu berhasil menaklukkan seluruh tantangan sains etnosains dengan sisa ${this.g3Lives} nyawa!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">8 / 8</span>
                                <span class="vstat-lbl">Soal Selesai</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">${this.g3Lives} Nyawa</span>
                                <span class="vstat-lbl">Sisa Nyawa</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+250 EXP</span>
                                <span class="vstat-lbl">Bonus Juara</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-g3-replay-win">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-g3-to-hub">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-g3-hub-win').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });
            document.getElementById('btn-g3-replay-win').addEventListener('click', () => {
                SoundFx.play('click');
                this.initGame3();
            });
            document.getElementById('btn-g3-to-hub').addEventListener('click', () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            });
        }

        // ==========================================
        // SHARED HELPER MODALS (EXP & INSIGHTS)
        // ==========================================
        showExpWarningModal(message) {
            SoundFx.play('wrong');
            const existing = document.getElementById('loka-exp-warning-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'loka-exp-warning-modal';
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card" style="max-width: 400px; text-align: center; border-color: #f59e0b;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">⚠️</div>
                    <h3 style="font-family: var(--font-heading); color: #b45309; margin: 0 0 0.5rem 0;">EXP Tidak Mencukupi!</h3>
                    <div class="g1-fb-explanation-box" style="background: #fffbeb; border-color: #fde68a;">
                        <p class="g1-fb-text" style="color: #92400e; font-size: 0.85rem; line-height: 1.5;">${message}</p>
                    </div>
                    <div style="margin-top: 0.75rem;">
                        <button class="btn btn-primary" id="btn-close-exp-warn" style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 100%;">Mengerti</button>
                    </div>
                </div>
            `;
            this.container.appendChild(modal);
            document.getElementById('btn-close-exp-warn').onclick = () => {
                SoundFx.play('click');
                modal.remove();
            };
        }

        showLokaInsightModal(title, text, onContinue) {
            const existing = document.getElementById('loka-insight-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'loka-insight-modal';
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card">
                    <div class="g1-fb-topbar">
                        <span class="g1-fb-badge">✨ Insight Edukatif & Etnosains</span>
                        <span class="g1-fb-category" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">Sains Bali</span>
                    </div>
                    <div class="g1-fb-card-preview" style="background: #f8fafc;">
                        <div class="g1-fb-img-box" style="background: #e0f2fe; color: #0284c7; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">
                            💡
                        </div>
                        <div class="g1-fb-item-info">
                            <span class="g1-fb-item-tag">Konsep Terpecahkan</span>
                            <h4 class="g1-fb-item-name">${title}</h4>
                        </div>
                    </div>
                    <div class="g1-fb-explanation-box">
                        <div class="g1-fb-sparkle-icon">📖</div>
                        <p class="g1-fb-text">${text}</p>
                    </div>
                    <div class="g1-fb-actions">
                        <button class="btn-fb-continue" id="btn-close-loka-insight">
                            <span>Lanjut Bermain</span>
                            <span class="btn-arrow">▶</span>
                        </button>
                    </div>
                </div>
            `;
            this.container.appendChild(modal);
            document.getElementById('btn-close-loka-insight').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                if (typeof onContinue === 'function') onContinue();
            };
        }

        // ==========================================
        // GAME 4: TEKA-TEKI SILANG (TTS 15x15)
        // ==========================================
        initGameTTS() {
            this.cleanupGhosts();
            this.currentGame = 'game_tts';
            this.ttsActiveCell = { r: 5, c: 2 };
            this.ttsActiveDir = 'across';
            this.ttsUserInputs = {};
            this.ttsSolvedWords = new Set();
            this.ttsRevealedCells = new Set();
            this.renderGameTTS();
        }

        getTTSGridMap() {
            const map = {};
            for (let r = 1; r <= 15; r++) {
                for (let c = 1; c <= 15; c++) {
                    map[`${r},${c}`] = null;
                }
            }

            TTS_DATA.across.forEach(w => {
                for (let i = 0; i < w.word.length; i++) {
                    const r = w.row;
                    const c = w.col + i;
                    const key = `${r},${c}`;
                    if (!map[key]) {
                        map[key] = { char: w.word[i], acrossWord: w, acrossIdx: i, downWord: null, downIdx: -1, num: null };
                    } else {
                        map[key].acrossWord = w;
                        map[key].acrossIdx = i;
                    }
                    if (i === 0) {
                        map[key].num = w.num;
                    }
                }
            });

            TTS_DATA.down.forEach(w => {
                for (let i = 0; i < w.word.length; i++) {
                    const r = w.row + i;
                    const c = w.col;
                    const key = `${r},${c}`;
                    if (!map[key]) {
                        map[key] = { char: w.word[i], acrossWord: null, acrossIdx: -1, downWord: w, downIdx: i, num: null };
                    } else {
                        map[key].downWord = w;
                        map[key].downIdx = i;
                    }
                    if (i === 0) {
                        map[key].num = w.num;
                    }
                }
            });

            return map;
        }

        renderGameTTS() {
            this.cleanupGhosts();
            const gridMap = this.getTTSGridMap();

            let gridHtml = '';
            for (let r = 1; r <= 15; r++) {
                for (let c = 1; c <= 15; c++) {
                    const cellInfo = gridMap[`${r},${c}`];
                    if (!cellInfo) {
                        gridHtml += `<div class="tts-cell tts-cell-blocked"></div>`;
                    } else {
                        const val = this.ttsUserInputs[`${r},${c}`] || '';
                        const numBadge = cellInfo.num ? `<span class="tts-cell-num">${cellInfo.num}</span>` : '';
                        gridHtml += `
                            <div class="tts-cell tts-cell-active" id="tts-cell-${r}-${c}" data-row="${r}" data-col="${c}">
                                ${numBadge}
                                <span class="tts-cell-letter" id="tts-val-${r}-${c}">${val}</span>
                            </div>
                        `;
                    }
                }
            }

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-tts-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#fef3c7; color:#b45309;">GAME 4 • TTS 15x15</span>
                            <h2>Teka-Teki Silang Sains Bali</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="lokaplay-progress-pill" id="tts-progress-pill">
                            ${this.ttsSolvedWords.size} / 10 Kata Terisi
                        </div>
                    </div>
                </header>

                <main class="tts-arena">
                    <!-- Left: Grid & Controls -->
                    <div class="tts-main-column">
                        <div class="tts-grid-wrapper">
                            <div class="tts-grid" id="tts-grid">
                                ${gridHtml}
                            </div>
                        </div>

                        <!-- Action / Hint Bar -->
                        <div class="tts-action-bar">
                            <button class="btn-tts-hint" id="btn-tts-hint-letter">
                                <span>💡 Hint 1 Huruf</span>
                                <span class="hint-cost">-30 EXP</span>
                            </button>
                            <button class="btn-tts-reset" id="btn-tts-reset">🔄 Reset</button>
                        </div>

                        <!-- Onscreen Mobile Keyboard -->
                        <div class="tts-virtual-keyboard">
                            ${"QWERTYUIOPASDFGHJKLZXCVBNM".split('').map(k => `
                                <button class="tts-key" data-key="${k}">${k}</button>
                            `).join('')}
                            <button class="tts-key tts-key-action" data-key="BACKSPACE">⌫ Hapus</button>
                        </div>
                    </div>

                    <!-- Right: Clues Panel -->
                    <div class="tts-clues-column">
                        <div class="tts-clues-section">
                            <h4 class="tts-clues-heading">➡️ Mendatar (Across)</h4>
                            <div class="tts-clues-list">
                                ${TTS_DATA.across.map(w => `
                                    <div class="tts-clue-item ${this.ttsSolvedWords.has(w.id) ? 'tts-clue-solved' : ''}" id="clue-${w.id}" data-word-id="${w.id}" data-dir="across" data-row="${w.row}" data-col="${w.col}">
                                        <span class="tts-clue-num">${w.num}.</span>
                                        <div class="tts-clue-body">
                                            <p class="tts-clue-text">${w.clue}</p>
                                            <span class="tts-clue-len">(${w.length} huruf)</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="tts-clues-section">
                            <h4 class="tts-clues-heading">⬇️ Menurun (Down)</h4>
                            <div class="tts-clues-list">
                                ${TTS_DATA.down.map(w => `
                                    <div class="tts-clue-item ${this.ttsSolvedWords.has(w.id) ? 'tts-clue-solved' : ''}" id="clue-${w.id}" data-word-id="${w.id}" data-dir="down" data-row="${w.row}" data-col="${w.col}">
                                        <span class="tts-clue-num">${w.num}.</span>
                                        <div class="tts-clue-body">
                                            <p class="tts-clue-text">${w.clue}</p>
                                            <span class="tts-clue-len">(${w.length} huruf)</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </main>
            `;

            // Back button
            document.getElementById('btn-tts-back').onclick = () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            };

            this.setupTTSInteractions();
            this.highlightTTSActiveWord();
        }

        setupTTSInteractions() {
            const gridMap = this.getTTSGridMap();

            // Cell click selection
            this.container.querySelectorAll('.tts-cell-active').forEach(cell => {
                cell.addEventListener('click', () => {
                    const r = parseInt(cell.dataset.row, 10);
                    const c = parseInt(cell.dataset.col, 10);
                    const cellInfo = gridMap[`${r},${c}`];
                    if (!cellInfo) return;

                    SoundFx.play('click');
                    if (this.ttsActiveCell.r === r && this.ttsActiveCell.c === c) {
                        // Toggle direction if cell belongs to both across and down
                        if (cellInfo.acrossWord && cellInfo.downWord) {
                            this.ttsActiveDir = (this.ttsActiveDir === 'across') ? 'down' : 'across';
                        }
                    } else {
                        this.ttsActiveCell = { r, c };
                        if (this.ttsActiveDir === 'across' && !cellInfo.acrossWord && cellInfo.downWord) {
                            this.ttsActiveDir = 'down';
                        } else if (this.ttsActiveDir === 'down' && !cellInfo.downWord && cellInfo.acrossWord) {
                            this.ttsActiveDir = 'across';
                        }
                    }
                    this.highlightTTSActiveWord();
                });
            });

            // Clue item click
            this.container.querySelectorAll('.tts-clue-item').forEach(item => {
                item.addEventListener('click', () => {
                    SoundFx.play('click');
                    const r = parseInt(item.dataset.row, 10);
                    const c = parseInt(item.dataset.col, 10);
                    this.ttsActiveDir = item.dataset.dir;
                    this.ttsActiveCell = { r, c };
                    this.highlightTTSActiveWord();
                });
            });

            // Virtual Keyboard click
            this.container.querySelectorAll('.tts-key').forEach(keyBtn => {
                keyBtn.addEventListener('click', () => {
                    const k = keyBtn.dataset.key;
                    if (k === 'BACKSPACE') {
                        this.handleTTSBackspace();
                    } else {
                        this.handleTTSInput(k);
                    }
                });
            });

            // Physical Keyboard Listener
            const onKeyDown = (e) => {
                if (this.currentGame !== 'game_tts') {
                    window.removeEventListener('keydown', onKeyDown);
                    return;
                }
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    this.handleTTSBackspace();
                } else if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    this.handleTTSInput(e.key.toUpperCase());
                } else if (e.key === 'ArrowRight') {
                    this.moveTTSCursor(0, 1);
                } else if (e.key === 'ArrowLeft') {
                    this.moveTTSCursor(0, -1);
                } else if (e.key === 'ArrowDown') {
                    this.moveTTSCursor(1, 0);
                } else if (e.key === 'ArrowUp') {
                    this.moveTTSCursor(-1, 0);
                }
            };
            window.addEventListener('keydown', onKeyDown);

            // Hints
            document.getElementById('btn-tts-hint-letter').onclick = () => {
                this.useTTSHintLetter();
            };
            document.getElementById('btn-tts-reset').onclick = () => {
                SoundFx.play('click');
                this.initGameTTS();
            };
        }

        moveTTSCursor(dr, dc) {
            const nr = this.ttsActiveCell.r + dr;
            const nc = this.ttsActiveCell.c + dc;
            const gridMap = this.getTTSGridMap();
            if (gridMap[`${nr},${nc}`]) {
                this.ttsActiveCell = { r: nr, c: nc };
                this.highlightTTSActiveWord();
            }
        }

        highlightTTSActiveWord() {
            const gridMap = this.getTTSGridMap();
            const { r, c } = this.ttsActiveCell;
            const cellInfo = gridMap[`${r},${c}`];
            if (!cellInfo) return;

            let activeWord = (this.ttsActiveDir === 'across') ? cellInfo.acrossWord : cellInfo.downWord;
            if (!activeWord) {
                activeWord = cellInfo.acrossWord || cellInfo.downWord;
                this.ttsActiveDir = cellInfo.acrossWord ? 'across' : 'down';
            }

            // Remove previous highlights
            this.container.querySelectorAll('.tts-cell-focused, .tts-cell-in-word').forEach(el => {
                el.classList.remove('tts-cell-focused', 'tts-cell-in-word');
            });
            this.container.querySelectorAll('.tts-clue-item.active').forEach(el => el.classList.remove('active'));

            if (!activeWord) return;

            // Highlight word cells
            for (let i = 0; i < activeWord.word.length; i++) {
                const wr = (this.ttsActiveDir === 'across') ? activeWord.row : activeWord.row + i;
                const wc = (this.ttsActiveDir === 'across') ? activeWord.col + i : activeWord.col;
                const cellEl = document.getElementById(`tts-cell-${wr}-${wc}`);
                if (cellEl) {
                    if (wr === r && wc === c) {
                        cellEl.classList.add('tts-cell-focused');
                    } else {
                        cellEl.classList.add('tts-cell-in-word');
                    }
                }
            }

            // Highlight clue in list
            const clueEl = document.getElementById(`clue-${activeWord.id}`);
            if (clueEl) {
                clueEl.classList.add('active');
                clueEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        handleTTSInput(char) {
            const { r, c } = this.ttsActiveCell;
            const gridMap = this.getTTSGridMap();
            const cellInfo = gridMap[`${r},${c}`];
            if (!cellInfo) return;

            SoundFx.play('click');
            this.ttsUserInputs[`${r},${c}`] = char;
            const valEl = document.getElementById(`tts-val-${r}-${c}`);
            if (valEl) valEl.textContent = char;

            // Advance cursor to next cell in current word direction
            const activeWord = (this.ttsActiveDir === 'across') ? cellInfo.acrossWord : cellInfo.downWord;
            if (activeWord) {
                const curIdx = (this.ttsActiveDir === 'across') ? cellInfo.acrossIdx : cellInfo.downIdx;
                if (curIdx < activeWord.word.length - 1) {
                    const nextR = (this.ttsActiveDir === 'across') ? activeWord.row : activeWord.row + curIdx + 1;
                    const nextC = (this.ttsActiveDir === 'across') ? activeWord.col + curIdx + 1 : activeWord.col;
                    this.ttsActiveCell = { r: nextR, c: nextC };
                }
            }

            this.highlightTTSActiveWord();
            this.checkTTSWordCompletion();
        }

        handleTTSBackspace() {
            const { r, c } = this.ttsActiveCell;
            const gridMap = this.getTTSGridMap();
            const cellInfo = gridMap[`${r},${c}`];
            if (!cellInfo) return;

            SoundFx.play('snap');
            if (this.ttsUserInputs[`${r},${c}`]) {
                delete this.ttsUserInputs[`${r},${c}`];
                const valEl = document.getElementById(`tts-val-${r}-${c}`);
                if (valEl) valEl.textContent = '';
            } else {
                // Move back one cell
                const activeWord = (this.ttsActiveDir === 'across') ? cellInfo.acrossWord : cellInfo.downWord;
                if (activeWord) {
                    const curIdx = (this.ttsActiveDir === 'across') ? cellInfo.acrossIdx : cellInfo.downIdx;
                    if (curIdx > 0) {
                        const prevR = (this.ttsActiveDir === 'across') ? activeWord.row : activeWord.row + curIdx - 1;
                        const prevC = (this.ttsActiveDir === 'across') ? activeWord.col + curIdx - 1 : activeWord.col;
                        this.ttsActiveCell = { r: prevR, c: prevC };
                        delete this.ttsUserInputs[`${prevR},${prevC}`];
                        const pVal = document.getElementById(`tts-val-${prevR}-${prevC}`);
                        if (pVal) pVal.textContent = '';
                    }
                }
            }
            this.highlightTTSActiveWord();
        }

        checkTTSWordCompletion() {
            const allWords = [...TTS_DATA.across, ...TTS_DATA.down];

            allWords.forEach(w => {
                if (this.ttsSolvedWords.has(w.id)) return;

                let isComplete = true;
                let isCorrect = true;

                for (let i = 0; i < w.word.length; i++) {
                    const r = (w.id.startsWith('A')) ? w.row : w.row + i;
                    const c = (w.id.startsWith('A')) ? w.col + i : w.col;
                    const key = `${r},${c}`;
                    const entered = (this.ttsUserInputs[key] || '').toUpperCase();
                    if (!entered) {
                        isComplete = false;
                        break;
                    }
                    if (entered !== w.word[i]) {
                        isCorrect = false;
                    }
                }

                if (isComplete && isCorrect) {
                    this.ttsSolvedWords.add(w.id);
                    SoundFx.play('correct');

                    // Mark solved styling on cells
                    for (let i = 0; i < w.word.length; i++) {
                        const r = (w.id.startsWith('A')) ? w.row : w.row + i;
                        const c = (w.id.startsWith('A')) ? w.col + i : w.col;
                        const cellEl = document.getElementById(`tts-cell-${r}-${c}`);
                        if (cellEl) cellEl.classList.add('tts-cell-solved');
                    }

                    // Mark clue item
                    const clueEl = document.getElementById(`clue-${w.id}`);
                    if (clueEl) clueEl.classList.add('tts-clue-solved');

                    // Update progress pill
                    const pill = document.getElementById('tts-progress-pill');
                    if (pill) pill.textContent = `${this.ttsSolvedWords.size} / 10 Kata Terisi`;

                    // Show pop-up insight verbatim from PRD
                    this.showLokaInsightModal(`KATA TUNTAS: ${w.word}`, w.insight, () => {
                        if (this.ttsSolvedWords.size === 10) {
                            addExp(100);
                            setTimeout(() => {
                                this.renderTTSVictory();
                            }, 400);
                        }
                    });
                }
            });
        }

        useTTSHintLetter() {
            if (!deductExp(30)) {
                this.showExpWarningModal("EXP kamu tidak mencukupi untuk membuka 1 Huruf Bantuan (-30 EXP). Kumpulkan EXP melalui materi atau kuis!");
                return;
            }

            SoundFx.play('snap');
            const gridMap = this.getTTSGridMap();
            const { r, c } = this.ttsActiveCell;
            const curInfo = gridMap[`${r},${c}`];

            // If current cell is already filled correctly, search for any unfilled active word cell
            let targetKey = `${r},${c}`;
            let targetChar = curInfo ? curInfo.char : null;

            if (!curInfo || (this.ttsUserInputs[targetKey] === targetChar)) {
                // Find first unfilled cell
                for (let tr = 1; tr <= 15; tr++) {
                    for (let tc = 1; tc <= 15; tc++) {
                        const info = gridMap[`${tr},${tc}`];
                        if (info && this.ttsUserInputs[`${tr},${tc}`] !== info.char) {
                            targetKey = `${tr},${tc}`;
                            targetChar = info.char;
                            this.ttsActiveCell = { r: tr, c: tc };
                            break;
                        }
                    }
                    if (targetChar && this.ttsUserInputs[targetKey] !== targetChar) break;
                }
            }

            if (targetChar) {
                this.ttsUserInputs[targetKey] = targetChar;
                const valEl = document.getElementById(`tts-val-${this.ttsActiveCell.r}-${this.ttsActiveCell.c}`);
                if (valEl) valEl.textContent = targetChar;
                const cellEl = document.getElementById(`tts-cell-${this.ttsActiveCell.r}-${this.ttsActiveCell.c}`);
                if (cellEl) cellEl.classList.add('tts-cell-hinted');
                this.highlightTTSActiveWord();
                this.checkTTSWordCompletion();
            }
        }

        renderTTSVictory() {
            this.cleanupGhosts();
            SoundFx.play('victory');
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-tts-hub-end">← Menu Game</button>
                    <h2>Teka-Teki Silang Tuntas!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card">
                        <div class="victory-icon">🏆</div>
                        <h3>Luar Biasa, Jawara TTS Sains!</h3>
                        <p>Kamu telah berhasil menuntaskan seluruh 10 kata teka-teki silang wujud zat dan etnosains Bali dengan sempurna!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">10 / 10</span>
                                <span class="vstat-lbl">Kata Tuntas</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+100 EXP</span>
                                <span class="vstat-lbl">Bonus Menang</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-tts-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-tts-to-hub">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-tts-hub-end').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-tts-replay').onclick = () => {
                SoundFx.play('click');
                this.initGameTTS();
            };
            document.getElementById('btn-tts-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }

        // ==========================================
        // GAME 5: CARI KATA RAHASIA (15x15)
        // ==========================================
        initGameCariKata() {
            this.cleanupGhosts();
            this.stopWSTimer();
            this.currentGame = 'game_carikata';
            this.wsSeconds = 0;
            this.wsFoundWords = new Set();
            this.wsSelectedCells = [];
            this.renderGameCariKata();
            this.startWSTimer();
        }

        startWSTimer() {
            this.stopWSTimer();
            this.wsTimer = setInterval(() => {
                this.wsSeconds++;
                const timerEl = document.getElementById('ws-timer-val');
                if (timerEl) {
                    const mm = String(Math.floor(this.wsSeconds / 60)).padStart(2, '0');
                    const ss = String(this.wsSeconds % 60).padStart(2, '0');
                    timerEl.textContent = `${mm}:${ss}`;
                }
            }, 1000);
        }

        stopWSTimer() {
            if (this.wsTimer) {
                clearInterval(this.wsTimer);
                this.wsTimer = null;
            }
        }

        generateCariKataGrid() {
            const size = CARI_KATA_DATA.gridSize || 15;
            const wordsList = CARI_KATA_DATA.words;

            // Arah yang diizinkan: H (Horizontal), V (Vertical), D (Diagonal ke kanan bawah)
            const directions = [
                { name: 'H', dr: 0, dc: 1 },
                { name: 'V', dr: 1, dc: 0 },
                { name: 'D', dr: 1, dc: 1 }
            ];

            let placedWords = [];
            let finalGrid = null;

            // Coba generate susunan acak hingga 50 kali
            for (let attempt = 0; attempt < 50; attempt++) {
                const grid = Array.from({ length: size }, () => Array(size).fill(''));
                // Sort kata dari terpanjang ke terpendek agar probabilitas pas lebih tinggi
                const sortedWords = [...wordsList].sort((a, b) => b.word.length - a.word.length);
                let allPlaced = true;
                const tempPlaced = [];

                for (const wObj of sortedWords) {
                    const word = wObj.word;
                    let wordPlaced = false;

                    // Acak arah
                    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

                    for (const d of shuffledDirs) {
                        const maxR = size - (d.dr * (word.length - 1)) - 1;
                        const maxC = size - (d.dc * (word.length - 1)) - 1;
                        if (maxR < 0 || maxC < 0) continue;

                        // Kumpulkan seluruh kandidat posisi awal yang sah
                        const candidatePositions = [];
                        for (let r = 0; r <= maxR; r++) {
                            for (let c = 0; c <= maxC; c++) {
                                candidatePositions.push({ r, c });
                            }
                        }
                        // Acak urutan posisi
                        candidatePositions.sort(() => Math.random() - 0.5);

                        for (const pos of candidatePositions) {
                            let fits = true;
                            for (let i = 0; i < word.length; i++) {
                                const tr = pos.r + (i * d.dr);
                                const tc = pos.c + (i * d.dc);
                                const curChar = grid[tr][tc];
                                if (curChar !== '' && curChar !== word[i]) {
                                    fits = false;
                                    break;
                                }
                            }

                            if (fits) {
                                const cells = [];
                                for (let i = 0; i < word.length; i++) {
                                    const tr = pos.r + (i * d.dr);
                                    const tc = pos.c + (i * d.dc);
                                    grid[tr][tc] = word[i];
                                    cells.push({ r: tr, c: tc });
                                }
                                tempPlaced.push({
                                    ...wObj,
                                    row: pos.r,
                                    col: pos.c,
                                    dir: d.name,
                                    cells: cells
                                });
                                wordPlaced = true;
                                break;
                            }
                        }

                        if (wordPlaced) break;
                    }

                    if (!wordPlaced) {
                        allPlaced = false;
                        break;
                    }
                }

                if (allPlaced) {
                    placedWords = tempPlaced;
                    finalGrid = grid;
                    break;
                }
            }

            // Fallback jika tidak berhasil dalam 50 attempt
            if (!finalGrid) {
                finalGrid = Array.from({ length: size }, () => Array(size).fill(''));
                placedWords = [];
                wordsList.forEach(w => {
                    const cells = [];
                    for (let i = 0; i < w.word.length; i++) {
                        let r = w.row, c = w.col;
                        if (w.dir === 'H') c += i;
                        else if (w.dir === 'V') r += i;
                        else if (w.dir === 'D') { r += i; c += i; }
                        finalGrid[r][c] = w.word[i];
                        cells.push({ r, c });
                    }
                    placedWords.push({ ...w, cells });
                });
            }

            // Isi sel kosong dengan huruf acak sains dan etnosains
            const fillers = "ABDEGILMNOPRSTUY";
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (!finalGrid[r][c]) {
                        finalGrid[r][c] = fillers[Math.floor(Math.random() * fillers.length)];
                    }
                }
            }

            this.wsGrid = finalGrid;
            this.wsActiveWords = placedWords;
            return finalGrid;
        }

        renderGameCariKata() {
            this.cleanupGhosts();
            const grid = this.generateCariKataGrid();

            let gridHtml = '';
            for (let r = 0; r < 15; r++) {
                for (let c = 0; c < 15; c++) {
                    const char = grid[r][c];
                    gridHtml += `
                        <div class="ws-cell" id="ws-cell-${r}-${c}" data-row="${r}" data-col="${c}" data-char="${char}">
                            ${char}
                        </div>
                    `;
                }
            }

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-ws-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#ecfdf5; color:#059669;">GAME 5 • CARI KATA</span>
                            <h2>Cari Kata Rahasia Etnosains</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="ws-timer-pill">
                            <span class="ws-timer-icon">⏱️</span>
                            <span id="ws-timer-val">00:00</span>
                        </div>
                        <div class="lokaplay-progress-pill" id="ws-progress-pill">
                            ${this.wsFoundWords.size} / 6 Ditemukan
                        </div>
                    </div>
                </header>

                <main class="ws-arena">
                    <!-- Left: Grid & Hint -->
                    <div class="ws-main-column">
                        <div class="ws-grid-wrapper">
                            <div class="ws-grid" id="ws-grid">
                                ${gridHtml}
                            </div>
                        </div>

                        <div class="ws-action-bar">
                            <div class="ws-action-btns">
                                <button class="btn-ws-hint" id="btn-ws-hint">
                                    <span>💡 Hint Huruf Pertama</span>
                                    <span class="hint-cost">-30 EXP</span>
                                </button>
                                <button class="btn-ws-reset" id="btn-ws-reset" title="Acak ulang posisi kata & papan">
                                    <span>🔄 Acak Papan</span>
                                </button>
                            </div>
                            <span class="ws-inst-hint">👉 Ketuk huruf awal lalu huruf akhir kata, atau seret langsung!</span>
                        </div>
                    </div>

                    <!-- Right: Word List & Target Panel -->
                    <div class="ws-words-column">
                        <div class="ws-words-card">
                            <div class="ws-words-header">
                                <h4>🎯 Kata Target (${CARI_KATA_DATA.words.length})</h4>
                                <span class="ws-bonus-tag">⚡ Bonus &lt; 01:30: +50 EXP</span>
                            </div>
                            <div class="ws-words-list">
                                ${CARI_KATA_DATA.words.map(w => `
                                    <div class="ws-word-tag ${this.wsFoundWords.has(w.word) ? 'found' : ''}" id="wstag-${w.word}" style="--tag-color: ${this.wsWordColors[w.word] || '#0284c7'}">
                                        <span class="ws-word-name">${w.word}</span>
                                        <span class="ws-word-check">${this.wsFoundWords.has(w.word) ? '✓' : '○'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-ws-back').onclick = () => {
                SoundFx.play('click');
                this.stopWSTimer();
                this.cleanupGhosts();
                this.showHub();
            };

            document.getElementById('btn-ws-hint').onclick = () => {
                this.useWSHintFirstLetter();
            };

            const btnWsReset = document.getElementById('btn-ws-reset');
            if (btnWsReset) {
                btnWsReset.onclick = () => {
                    SoundFx.play('click');
                    this.initGameCariKata();
                };
            }

            this.setupWSInteractions();
        }

        setupWSInteractions() {
            const gridEl = document.getElementById('ws-grid');
            if (!gridEl) return;

            let startCell = null;
            let isPointerDown = false;

            const getCellCoords = (el) => {
                if (!el || !el.dataset || el.dataset.row === undefined) return null;
                return { r: parseInt(el.dataset.row, 10), c: parseInt(el.dataset.col, 10) };
            };

            const selectPath = (p1, p2) => {
                const dr = p2.r - p1.r;
                const dc = p2.c - p1.c;
                const stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
                const stepC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);

                // Must be horizontal, vertical, or diagonal
                if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
                    return null;
                }

                const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
                const cells = [];
                for (let i = 0; i < len; i++) {
                    cells.push({ r: p1.r + (i * stepR), c: p1.c + (i * stepC) });
                }
                return cells;
            };

            const highlightSelection = (cells) => {
                this.container.querySelectorAll('.ws-cell.selecting').forEach(el => el.classList.remove('selecting'));
                if (!cells) return;
                cells.forEach(pos => {
                    const el = document.getElementById(`ws-cell-${pos.r}-${pos.c}`);
                    if (el) el.classList.add('selecting');
                });
            };

            // Touch / Mouse Pointer events
            this.container.querySelectorAll('.ws-cell').forEach(cell => {
                cell.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    isPointerDown = true;
                    startCell = getCellCoords(cell);
                    highlightSelection([startCell]);
                });

                cell.addEventListener('pointerenter', (e) => {
                    if (!isPointerDown || !startCell) return;
                    const cur = getCellCoords(cell);
                    const path = selectPath(startCell, cur);
                    if (path) highlightSelection(path);
                });

                // Also support 2-tap click selection (first tap start, second tap end)
                cell.addEventListener('click', () => {
                    const clicked = getCellCoords(cell);
                    if (!this._wsFirstTap) {
                        this._wsFirstTap = clicked;
                        highlightSelection([clicked]);
                        SoundFx.play('click');
                    } else {
                        const path = selectPath(this._wsFirstTap, clicked);
                        this._wsFirstTap = null;
                        if (path) {
                            highlightSelection(path);
                            this.checkWSPath(path);
                        } else {
                            highlightSelection(null);
                        }
                    }
                });
            });

            const onPointerUp = (e) => {
                if (!isPointerDown) return;
                isPointerDown = false;
                const endEl = document.elementFromPoint(e.clientX, e.clientY);
                const endCell = endEl ? getCellCoords(endEl.closest('.ws-cell')) : null;
                if (startCell && endCell) {
                    const path = selectPath(startCell, endCell);
                    if (path && path.length > 1) {
                        this.checkWSPath(path);
                    } else {
                        highlightSelection(null);
                    }
                } else {
                    highlightSelection(null);
                }
                startCell = null;
            };

            window.addEventListener('pointerup', onPointerUp);
        }

        checkWSPath(cells) {
            if (!this.wsGrid) return;
            let str = '';
            cells.forEach(p => {
                str += (this.wsGrid[p.r] && this.wsGrid[p.r][p.c]) || '';
            });
            const strRev = str.split('').reverse().join('');

            const activeList = this.wsActiveWords || CARI_KATA_DATA.words;
            const matched = activeList.find(w => (w.word === str || w.word === strRev) && !this.wsFoundWords.has(w.word));

            this.container.querySelectorAll('.ws-cell.selecting').forEach(el => el.classList.remove('selecting'));

            if (matched) {
                SoundFx.play('correct');
                this.wsFoundWords.add(matched.word);

                // Permanently color cells
                const color = this.wsWordColors[matched.word] || '#059669';
                cells.forEach(p => {
                    const cellEl = document.getElementById(`ws-cell-${p.r}-${p.c}`);
                    if (cellEl) {
                        cellEl.classList.add('ws-cell-found');
                        cellEl.style.background = color;
                    }
                });

                // Update tag in sidebar
                const tagEl = document.getElementById(`wstag-${matched.word}`);
                if (tagEl) {
                    tagEl.classList.add('found');
                    const check = tagEl.querySelector('.ws-word-check');
                    if (check) check.textContent = '✓';
                }

                const pill = document.getElementById('ws-progress-pill');
                if (pill) pill.textContent = `${this.wsFoundWords.size} / 6 Ditemukan`;

                // Show insight verbatim from PRD
                this.showLokaInsightModal(`KATA DITEMUKAN: ${matched.word}`, matched.insight, () => {
                    if (this.wsFoundWords.size === CARI_KATA_DATA.words.length) {
                        this.stopWSTimer();
                        setTimeout(() => {
                            this.renderWSVictory();
                        }, 400);
                    }
                });
            } else {
                SoundFx.play('wrong');
            }
        }

        useWSHintFirstLetter() {
            if (!deductExp(30)) {
                this.showExpWarningModal("EXP kamu tidak cukup untuk Hint Huruf Pertama (-30 EXP). Ayo kumpulkan EXP dari materi sains!");
                return;
            }

            SoundFx.play('snap');
            const activeList = this.wsActiveWords || CARI_KATA_DATA.words;
            const unfound = activeList.find(w => !this.wsFoundWords.has(w.word));
            if (unfound) {
                const startCellEl = document.getElementById(`ws-cell-${unfound.row}-${unfound.col}`);
                if (startCellEl) {
                    startCellEl.classList.add('ws-cell-hint');
                    startCellEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        startCellEl.classList.remove('ws-cell-hint');
                    }, 4000);
                }
            }
        }

        renderWSVictory() {
            this.cleanupGhosts();
            this.stopWSTimer();
            SoundFx.play('victory');

            const isFast = this.wsSeconds < 90;
            const earnedExp = isFast ? 50 : 30;
            addExp(earnedExp);

            const mm = String(Math.floor(this.wsSeconds / 60)).padStart(2, '0');
            const ss = String(this.wsSeconds % 60).padStart(2, '0');
            const timeStr = `${mm}:${ss}`;

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-ws-hub-end">← Menu Game</button>
                    <h2>Cari Kata Selesai!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card">
                        <div class="victory-icon">🎉</div>
                        <h3>${isFast ? 'Gelar: Siswa ZatLoka Cendekia! 🎓' : 'Hebat, Kata Rahasia Terkuak!'}</h3>
                        <p>${isFast ? `Luar biasa! Kamu menyelesaikan pencarian kata dalam waktu super cepat ${timeStr} (&lt; 01:30) sehingga berhak atas Gelar Cendekia!` : `Semua 6 kata etnosains Bali berhasil kamu temukan dalam waktu ${timeStr}.`}</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">${timeStr}</span>
                                <span class="vstat-lbl">Waktu Tempuh</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${earnedExp} EXP</span>
                                <span class="vstat-lbl">${isFast ? 'Bonus Cendekia' : 'Bonus Selesai'}</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-ws-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-ws-to-hub">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-ws-hub-end').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-ws-replay').onclick = () => {
                SoundFx.play('click');
                this.initGameCariKata();
            };
            document.getElementById('btn-ws-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }

        // ==========================================
        // GAME 6: TEBAK JAWABAN (GUESS THE ANSWER)
        // ==========================================
        initGameTebak(levelIdx = 0, resetAll = true) {
            this.cleanupGhosts();
            this.currentGame = 'game_tebak';
            if (resetAll) {
                this.tebakLives = 3;
                this.tebakEarnedExpTotal = 0;
                this.tebakTotalStars = 0;
            }
            this.tebakLevelIndex = levelIdx;
            this.tebakUnlockedClues = 1;
            this.tebakCurrentAnswer = [];
            this.renderGameTebak();
        }

        renderGameTebak() {
            this.cleanupGhosts();
            const levelData = TEBAK_DATA[this.tebakLevelIndex];
            if (!levelData) {
                this.renderTebakVictory();
                return;
            }

            const livesEmoji = "🪷 ".repeat(this.tebakLives) + "🥀 ".repeat(3 - this.tebakLives);
            const targetLen = levelData.answer.length;

            // Generate scrambled tiles: Target letters + 3 distractors
            const distractors = "SBNKLPRTY".split('');
            const tiles = levelData.answer.split('');
            for (let i = 0; i < 3; i++) {
                tiles.push(distractors[Math.floor(Math.random() * distractors.length)]);
            }
            const scrambledTiles = shuffleArray(tiles);

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-tebak-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#fdf2f8; color:#be185d;">GAME 6 • TEBAK JAWABAN</span>
                            <h2>${levelData.title}</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="tebak-lives-capsule" id="tebak-lives-display">
                            <span class="tebak-lives-label">Nyawa:</span>
                            <span class="tebak-lives-emoji">${livesEmoji}</span>
                        </div>
                        <div class="lokaplay-progress-pill">
                            Level ${this.tebakLevelIndex + 1} / ${TEBAK_DATA.length}
                        </div>
                    </div>
                </header>

                <main class="tebak-arena">
                    <!-- Clues Card -->
                    <div class="tebak-clues-card">
                        <div class="tebak-clues-header">
                            <span class="tebak-clues-title">📜 Lapisan Petunjuk Rahasia</span>
                            <span class="tebak-stars-preview" id="tebak-stars-preview">
                                Hadiah: ${"⭐".repeat(4 - this.tebakUnlockedClues)} (+${(4 - this.tebakUnlockedClues) * 10} EXP)
                            </span>
                        </div>

                        <div class="tebak-clue-layer active">
                            <div class="tebak-clue-badge">Petunjuk 1</div>
                            <p class="tebak-clue-text">"${levelData.clues[0]}"</p>
                        </div>

                        <div class="tebak-clue-layer ${this.tebakUnlockedClues >= 2 ? 'active' : 'locked'}">
                            <div class="tebak-clue-badge">Petunjuk 2</div>
                            ${this.tebakUnlockedClues >= 2
                                ? `<p class="tebak-clue-text">"${levelData.clues[1]}"</p>`
                                : `<button class="btn-unlock-clue" id="btn-unlock-clue2">🔓 Buka Petunjuk 2 (-1 Bintang)</button>`}
                        </div>

                        <div class="tebak-clue-layer ${this.tebakUnlockedClues >= 3 ? 'active' : 'locked'}">
                            <div class="tebak-clue-badge">Petunjuk 3</div>
                            ${this.tebakUnlockedClues >= 3
                                ? `<p class="tebak-clue-text">"${levelData.clues[2]}"</p>`
                                : `<button class="btn-unlock-clue" id="btn-unlock-clue3" ${this.tebakUnlockedClues < 2 ? 'disabled style="opacity:0.5;"' : ''}>🔓 Buka Petunjuk 3 (-1 Bintang)</button>`}
                        </div>
                    </div>

                    <!-- Answer Slots -->
                    <div class="tebak-answer-card">
                        <div class="tebak-slots-label">Tebak Kata Rahasia (${targetLen} Huruf):</div>
                        <div class="tebak-slots-row" id="tebak-slots-row">
                            ${Array.from({ length: targetLen }).map((_, i) => `
                                <div class="tebak-slot" id="tslot-${i}" data-index="${i}">
                                    <span class="tebak-slot-char"></span>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Letter Tile Scramble Bank -->
                        <div class="tebak-tiles-bank" id="tebak-tiles-bank">
                            ${scrambledTiles.map((char, i) => `
                                <button class="tebak-tile" id="ttile-${i}" data-char="${char}">
                                    ${char}
                                </button>
                            `).join('')}
                        </div>

                        <!-- Action Buttons -->
                        <div class="tebak-actions-row">
                            <button class="btn btn-secondary" id="btn-tebak-backspace">⌫ Hapus</button>
                            <button class="btn btn-secondary" id="btn-tebak-reset">🔄 Reset</button>
                            <button class="btn btn-primary" id="btn-tebak-check">✓ Cek Jawaban</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-tebak-back').onclick = () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            };

            this.setupTebakInteractions(levelData);
        }

        setupTebakInteractions(levelData) {
            const tiles = this.container.querySelectorAll('.tebak-tile');
            const slots = this.container.querySelectorAll('.tebak-slot');
            const targetLen = levelData.answer.length;
            this.tebakCurrentAnswer = [];

            const updateSlots = () => {
                slots.forEach((s, idx) => {
                    const charSpan = s.querySelector('.tebak-slot-char');
                    if (this.tebakCurrentAnswer[idx]) {
                        charSpan.textContent = this.tebakCurrentAnswer[idx].char;
                        s.classList.add('filled');
                    } else {
                        charSpan.textContent = '';
                        s.classList.remove('filled');
                    }
                });
            };

            // Tile click
            tiles.forEach(tile => {
                tile.addEventListener('click', () => {
                    if (tile.classList.contains('used')) return;
                    if (this.tebakCurrentAnswer.length >= targetLen) return;

                    SoundFx.play('click');
                    tile.classList.add('used');
                    this.tebakCurrentAnswer.push({ char: tile.dataset.char, tileId: tile.id });
                    updateSlots();
                });
            });

            // Slot click to remove letter
            slots.forEach(slot => {
                slot.addEventListener('click', () => {
                    const idx = parseInt(slot.dataset.index, 10);
                    if (this.tebakCurrentAnswer[idx]) {
                        SoundFx.play('click');
                        const removed = this.tebakCurrentAnswer.splice(idx, 1)[0];
                        const tileEl = document.getElementById(removed.tileId);
                        if (tileEl) tileEl.classList.remove('used');
                        updateSlots();
                    }
                });
            });

            // Backspace button
            document.getElementById('btn-tebak-backspace').onclick = () => {
                if (this.tebakCurrentAnswer.length > 0) {
                    SoundFx.play('click');
                    const removed = this.tebakCurrentAnswer.pop();
                    const tileEl = document.getElementById(removed.tileId);
                    if (tileEl) tileEl.classList.remove('used');
                    updateSlots();
                }
            };

            // Reset button
            document.getElementById('btn-tebak-reset').onclick = () => {
                SoundFx.play('click');
                this.tebakCurrentAnswer = [];
                tiles.forEach(t => t.classList.remove('used'));
                updateSlots();
            };

            // Check Answer button
            document.getElementById('btn-tebak-check').onclick = () => {
                this.checkTebakAnswer(levelData);
            };

            // Clue unlock buttons
            const clue2Btn = document.getElementById('btn-unlock-clue2');
            if (clue2Btn) {
                clue2Btn.onclick = () => {
                    SoundFx.play('snap');
                    this.tebakUnlockedClues = 2;
                    this.renderGameTebak();
                };
            }
            const clue3Btn = document.getElementById('btn-unlock-clue3');
            if (clue3Btn) {
                clue3Btn.onclick = () => {
                    SoundFx.play('snap');
                    this.tebakUnlockedClues = 3;
                    this.renderGameTebak();
                };
            }
        }

        checkTebakAnswer(levelData) {
            const entered = this.tebakCurrentAnswer.map(x => x.char).join('');
            const target = levelData.answer;

            if (entered.length < target.length) {
                SoundFx.play('wrong');
                alert("Silakan isi semua kotak huruf terlebih dahulu!");
                return;
            }

            if (entered === target) {
                SoundFx.play('correct');
                const stars = 4 - this.tebakUnlockedClues;
                const earnedExp = stars * 10;
                addExp(earnedExp);
                this.tebakEarnedExpTotal += earnedExp;
                this.tebakTotalStars += stars;

                this.showTebakFeedbackModal(levelData, stars, earnedExp);
            } else {
                SoundFx.play('wrong');
                const row = document.getElementById('tebak-slots-row');
                if (row) {
                    row.classList.add('tebak-shake');
                    setTimeout(() => row.classList.remove('tebak-shake'), 400);
                }

                this.tebakLives--;
                const livesDisplay = document.getElementById('tebak-lives-display');
                if (livesDisplay) {
                    const emojiEl = livesDisplay.querySelector('.tebak-lives-emoji');
                    if (emojiEl) emojiEl.textContent = "🪷 ".repeat(Math.max(0, this.tebakLives)) + "🥀 ".repeat(3 - Math.max(0, this.tebakLives));
                }

                if (this.tebakLives <= 0) {
                    setTimeout(() => {
                        this.showTebakGameOverModal();
                    }, 400);
                }
            }
        }

        showTebakFeedbackModal(levelData, stars, exp) {
            const starsStr = "⭐".repeat(stars);
            const isLastLevel = (this.tebakLevelIndex + 1 === TEBAK_DATA.length);

            const modal = document.createElement('div');
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card">
                    <div class="g1-fb-topbar">
                        <span class="g1-fb-badge" style="background:#fdf2f8; color:#be185d; border-color:#fbcfe8;">🎉 Jawaban Tepat!</span>
                        <span class="g1-fb-category" style="background:#fef3c7; color:#b45309; border-color:#fde68a;">${starsStr} (+${exp} EXP)</span>
                    </div>
                    <div class="g1-fb-card-preview" style="background: #fdf2f8;">
                        <div class="g1-fb-img-box" style="background: #fbcfe8; color: #be185d; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">
                            🪷
                        </div>
                        <div class="g1-fb-item-info">
                            <span class="g1-fb-item-tag">Jawaban Benar</span>
                            <h4 class="g1-fb-item-name">${levelData.displayAnswer || levelData.answer}</h4>
                        </div>
                    </div>
                    <div class="g1-fb-explanation-box" style="background: #fff5f5; border-color: #fed7d7;">
                        <div class="g1-fb-sparkle-icon">✨</div>
                        <p class="g1-fb-text" style="color: #2d3748;">${levelData.feedback}</p>
                    </div>
                    <div class="g1-fb-actions">
                        <button class="btn-fb-continue" id="btn-tebak-next-lvl" style="background: linear-gradient(135deg, #db2777, #be185d);">
                            <span>${isLastLevel ? 'Lihat Hasil Akhir' : 'Lanjut Level Berikutnya'}</span>
                            <span class="btn-arrow">▶</span>
                        </button>
                    </div>
                </div>
            `;
            this.container.appendChild(modal);

            document.getElementById('btn-tebak-next-lvl').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                if (isLastLevel) {
                    this.renderTebakVictory();
                } else {
                    this.initGameTebak(this.tebakLevelIndex + 1, false);
                }
            };
        }

        showTebakGameOverModal() {
            SoundFx.play('wrong');
            const modal = document.createElement('div');
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card" style="text-align: center; border-color: #ef4444;">
                    <div style="font-size: 3rem; margin-bottom: 0.25rem;">🥀</div>
                    <h3 style="font-family: var(--font-heading); color: #dc2626; margin: 0 0 0.5rem 0;">Game Over!</h3>
                    <p style="font-size: 0.9rem; color: #475569; line-height: 1.5; margin: 0 0 1rem 0;">
                        Seluruh 3 Nyawa Teratai Sucimu telah gugur! Jangan patah semangat, baca kembali petunjuk etnosains dengan teliti dan coba lagi dari Level 1.
                    </p>
                    <button class="btn btn-primary" id="btn-tebak-restart-all" style="background: linear-gradient(135deg, #ef4444, #b91c1c); width: 100%;">
                        🔄 Ulangi Dari Level 1
                    </button>
                </div>
            `;
            this.container.appendChild(modal);

            document.getElementById('btn-tebak-restart-all').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                this.initGameTebak(0, true);
            };
        }

        renderTebakVictory() {
            this.cleanupGhosts();
            SoundFx.play('victory');
            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-tebak-hub-end">← Menu Game</button>
                    <h2>Tebak Jawaban Tuntas!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card" style="border-color: #f472b6;">
                        <div class="victory-icon">🪷</div>
                        <h3>Suksma, Pendekar Sains Bali!</h3>
                        <p>Kamu telah berhasil memecahkan seluruh 4 misteri wujud zat dalam Tebak Jawaban dengan gemilang!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">4 / 4</span>
                                <span class="vstat-lbl">Level Tuntas</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">${this.tebakTotalStars} ⭐</span>
                                <span class="vstat-lbl">Total Bintang</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${this.tebakEarnedExpTotal} EXP</span>
                                <span class="vstat-lbl">Total Hadiah</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-tebak-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-tebak-to-hub" style="background: linear-gradient(135deg, #db2777, #be185d);">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-tebak-hub-end').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-tebak-replay').onclick = () => {
                SoundFx.play('click');
                this.initGameTebak(0, true);
            };
            document.getElementById('btn-tebak-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }

        // ==========================================
        // GAME 7: TRUE/FALSE QUESTION (KUIS CEPAT)
        // ==========================================
        initGameTF() {
            this.cleanupGhosts();
            this.stopTFTimer();
            this.currentGame = 'game_tf';
            // Acak seluruh bank soal dan ambil 7 soal secara dinamis per sesi permainan
            this.tfQuestions = shuffleArray(TF_GAME_DATA).slice(0, 7);
            this.tfCurrentIndex = 0;
            this.tfScore = 0;
            this.tfEarnedExp = 0;
            this.tfCombo = 0;
            this.tfMaxCombo = 0;
            this.renderGameTF();
        }

        stopTFTimer() {
            if (this.tfTimer) {
                clearInterval(this.tfTimer);
                this.tfTimer = null;
            }
        }

        startTFTimer() {
            this.stopTFTimer();
            this.tfTimeLeft = 15;
            this.tfQuestionStartTime = Date.now();
            
            const timerValEl = document.getElementById('tf-timer-num');
            const timerBarEl = document.getElementById('tf-timer-bar-fill');
            if (timerValEl) timerValEl.textContent = '15s';
            if (timerBarEl) timerBarEl.style.width = '100%';

            this.tfTimer = setInterval(() => {
                this.tfTimeLeft--;
                if (timerValEl) timerValEl.textContent = `${this.tfTimeLeft}s`;
                if (timerBarEl) {
                    const pct = Math.max(0, (this.tfTimeLeft / 15) * 100);
                    timerBarEl.style.width = `${pct}%`;
                    if (this.tfTimeLeft <= 5) {
                        timerBarEl.classList.add('danger');
                    } else {
                        timerBarEl.classList.remove('danger');
                    }
                }

                if (this.tfTimeLeft <= 0) {
                    this.stopTFTimer();
                    SoundFx.play('wrong');
                    this.renderTFLose("Waktu 15 Detik Habis!", "Kamu kehabisan waktu sebelum sempat memilih jawaban.");
                }
            }, 1000);
        }

        renderGameTF() {
            this.cleanupGhosts();
            const curQ = this.tfQuestions[this.tfCurrentIndex];
            const comboMultiplier = this.tfCombo >= 5 ? 3 : (this.tfCombo >= 3 ? 2 : 1);
            const comboClass = this.tfCombo >= 5 ? 'combo-fire' : (this.tfCombo >= 3 ? 'combo-spark' : '');

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-tf-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#ecfeff; color:#0891b2;">GAME 7 • TIME-ATTACK</span>
                            <h2>Kuis Cepat: Wujud Zat</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <button class="tf-shuffle-btn" id="btn-tf-shuffle" title="Kocok ulang kumpulan soal secara acak">
                            <span class="tf-shuffle-icon">🔄</span>
                            <span class="tf-shuffle-text">Acak Soal</span>
                        </button>
                        <div class="tf-combo-pill ${comboClass}" id="tf-combo-pill">
                            <span class="tf-combo-icon">${this.tfCombo >= 5 ? '⚡🔥' : (this.tfCombo >= 3 ? '🔥' : '✨')}</span>
                            <span class="tf-combo-text">Combo: ${this.tfCombo}x (x${comboMultiplier})</span>
                        </div>
                        <div class="lokaplay-progress-pill">
                            Soal ${this.tfCurrentIndex + 1} / ${this.tfQuestions.length}
                        </div>
                    </div>
                </header>

                <main class="tf-arena">
                    <!-- Timer Countdown Bar -->
                    <div class="tf-timer-wrapper">
                        <div class="tf-timer-header">
                            <span class="tf-timer-label">⏱️ Sisa Waktu Soal:</span>
                            <span class="tf-timer-num" id="tf-timer-num">15s</span>
                        </div>
                        <div class="tf-timer-bar-track">
                            <div class="tf-timer-bar-fill" id="tf-timer-bar-fill" style="width: 100%;"></div>
                        </div>
                    </div>

                    <!-- Statement Card -->
                    <div class="tf-card">
                        <div class="tf-topic-pill">
                            <span class="tf-topic-icon">🏮</span>
                            <span>Topik: ${curQ.topic}</span>
                        </div>
                        <div class="tf-statement-box">
                            <p class="tf-statement-text">"${curQ.statement}"</p>
                        </div>
                        <div class="tf-inst-hint">
                            Apakah pernyataan ilmiah di atas <strong>BENAR</strong> atau <strong>SALAH</strong>?
                        </div>
                    </div>

                    <!-- Action Buttons: Benar / Salah -->
                    <div class="tf-action-buttons">
                        <button class="btn-tf-choice btn-tf-true" id="btn-tf-true">
                            <div class="tf-choice-icon">🟢</div>
                            <div class="tf-choice-text">
                                <span class="tf-choice-title">BENAR</span>
                                <span class="tf-choice-sub">Sesuai Konsep Sains</span>
                            </div>
                        </button>
                        <button class="btn-tf-choice btn-tf-false" id="btn-tf-false">
                            <div class="tf-choice-icon">🔴</div>
                            <div class="tf-choice-text">
                                <span class="tf-choice-title">SALAH</span>
                                <span class="tf-choice-sub">Tidak Tepat / Keliru</span>
                            </div>
                        </button>
                    </div>
                </main>
            `;

            document.getElementById('btn-tf-back').onclick = () => {
                SoundFx.play('click');
                this.stopTFTimer();
                this.cleanupGhosts();
                this.showHub();
            };

            const btnShuffle = document.getElementById('btn-tf-shuffle');
            if (btnShuffle) {
                btnShuffle.onclick = () => {
                    SoundFx.play('click');
                    this.stopTFTimer();
                    this.cleanupGhosts();
                    this.initGameTF();
                };
            }

            document.getElementById('btn-tf-true').onclick = () => {
                this.handleTFAnswer(true);
            };

            document.getElementById('btn-tf-false').onclick = () => {
                this.handleTFAnswer(false);
            };

            this.startTFTimer();
        }

        handleTFAnswer(userChoice) {
            this.stopTFTimer();
            const elapsedSec = (Date.now() - this.tfQuestionStartTime) / 1000;
            const curQ = this.tfQuestions[this.tfCurrentIndex];
            const isCorrect = (userChoice === curQ.answer);

            let earnedThis = 0;
            let isSpeedBonus = false;
            let curMultiplier = 1;

            if (isCorrect) {
                SoundFx.play('correct');
                this.tfScore++;
                this.tfCombo++;
                if (this.tfCombo > this.tfMaxCombo) this.tfMaxCombo = this.tfCombo;

                curMultiplier = this.tfCombo >= 5 ? 3 : (this.tfCombo >= 3 ? 2 : 1);
                isSpeedBonus = elapsedSec <= 3;
                const baseExp = isSpeedBonus ? 15 : 10;
                earnedThis = baseExp * curMultiplier;

                this.tfEarnedExp += earnedThis;
                addExp(earnedThis);
            } else {
                SoundFx.play('wrong');
                this.tfCombo = 0;
            }

            this.showTFFeedbackModal(isCorrect, curQ.feedback, earnedThis, curMultiplier, isSpeedBonus, () => {
                this.tfCurrentIndex++;
                if (this.tfCurrentIndex < this.tfQuestions.length) {
                    this.renderGameTF();
                } else {
                    this.renderTFVictory();
                }
            });
        }

        showTFFeedbackModal(isCorrect, feedbackText, earnedExp, multiplier, isSpeedBonus, onNext) {
            const existing = document.getElementById('tf-feedback-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'tf-feedback-modal';
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card" style="border-color: ${isCorrect ? '#10b981' : '#f43f5e'};">
                    <div class="g1-fb-topbar">
                        <span class="g1-fb-badge" style="background: ${isCorrect ? '#ecfdf5' : '#fff1f2'}; color: ${isCorrect ? '#059669' : '#e11d48'};">
                            ${isCorrect ? '✅ UMPAN BALIK TEPAT' : '❌ UMPAN BALIK KELIRU'}
                        </span>
                        <span class="g1-fb-category" style="background: #f8fafc; color: #475569;">Etnosains Bali</span>
                    </div>

                    <div style="text-align:center; padding: 0.75rem 0;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">${isCorrect ? '🎉' : '💡'}</div>
                        <h3 style="font-family: var(--font-heading); color: ${isCorrect ? '#059669' : '#e11d48'}; margin: 0 0 0.5rem 0;">
                            ${isCorrect ? 'Jawaban Kamu Benar!' : 'Kurang Tepat!'}
                        </h3>
                        ${isCorrect ? `
                            <div class="tf-fb-exp-pills">
                                <span class="tf-exp-tag">+${earnedExp} EXP</span>
                                ${isSpeedBonus ? '<span class="tf-bonus-tag">⚡ Speed Bonus (&le; 3s)</span>' : ''}
                                ${multiplier > 1 ? `<span class="tf-combo-tag">🔥 Combo Multiplier x${multiplier}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>

                    <div class="g1-fb-explanation-box" style="background: ${isCorrect ? '#f0fdf4' : '#fff5f5'}; border-color: ${isCorrect ? '#bbf7d0' : '#fecdd3'};">
                        <div class="g1-fb-sparkle-icon">📖</div>
                        <p class="g1-fb-text" style="color: ${isCorrect ? '#166534' : '#9f1239'};">${feedbackText}</p>
                    </div>

                    <div class="g1-fb-actions">
                        <button class="btn-fb-continue" id="btn-tf-continue-next">
                            <span>Lanjut Soal Berikutnya</span>
                            <span class="btn-arrow">▶</span>
                        </button>
                    </div>
                </div>
            `;

            this.container.appendChild(modal);
            document.getElementById('btn-tf-continue-next').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                if (typeof onNext === 'function') onNext();
            };
        }

        renderTFVictory() {
            this.cleanupGhosts();
            this.stopTFTimer();
            SoundFx.play('victory');

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-tf-hub-end">← Menu Game</button>
                    <h2>Kuis Cepat Selesai!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card" style="border-color: #06b6d4;">
                        <div class="victory-icon">⚡</div>
                        <h3>Luar Biasa, Pemikir Cepat!</h3>
                        <p>Kamu telah menyelesaikan seluruh 7 soal Time-Attack dengan pemahaman konsep zat yang tangkas!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">${this.tfScore} / ${this.tfQuestions.length}</span>
                                <span class="vstat-lbl">Benar</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">${this.tfMaxCombo}x</span>
                                <span class="vstat-lbl">Max Combo</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${this.tfEarnedExp} EXP</span>
                                <span class="vstat-lbl">Total EXP</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-tf-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-tf-to-hub" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-tf-hub-end').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-tf-replay').onclick = () => {
                SoundFx.play('click');
                this.initGameTF();
            };
            document.getElementById('btn-tf-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }

        renderTFLose(reasonTitle, reasonDesc) {
            this.cleanupGhosts();
            this.stopTFTimer();
            SoundFx.play('wrong');

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-tf-hub-lose">← Menu Game</button>
                    <h2>Waktu Habis!</h2>
                </header>
                <main class="g3-lose-screen">
                    <div class="lose-card" style="border-color: #f43f5e;">
                        <div class="lose-icon">⏱️</div>
                        <h3>${reasonTitle}</h3>
                        <p>${reasonDesc}</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">${this.tfScore} / ${this.tfQuestions.length}</span>
                                <span class="vstat-lbl">Soal Terjawab</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${this.tfEarnedExp} EXP</span>
                                <span class="vstat-lbl">EXP Terkumpul</span>
                            </div>
                        </div>
                        <div class="lose-actions">
                            <button class="btn btn-secondary" id="btn-tf-backhub">Kembali ke Menu Game</button>
                            <button class="btn btn-primary" id="btn-tf-retry" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">🔄 Coba Lagi</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-tf-hub-lose').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-tf-backhub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-tf-retry').onclick = () => {
                SoundFx.play('click');
                this.initGameTF();
            };
        }

        // ==========================================
        // GAME 8: MEMORY GAME (PENCOCOKAN KARTU CSS 3D)
        // ==========================================
        initGameMemory() {
            this.cleanupGhosts();
            this.currentGame = 'game_memory';
            this.memFlipped = [];
            this.memMatchedPairs = 0;
            this.memMoves = 0;
            this.memIsLocked = false;

            // Generate 12 kartu dan acak
            const preparedCards = MEMORY_GAME_DATA.map((item, idx) => ({
                id: `card_${idx}`,
                pairId: item.pairId,
                type: item.type,
                name: item.name,
                subtext: item.subtext,
                image: item.image,
                isFlipped: false,
                isMatched: false
            }));

            this.memCards = shuffleArray(preparedCards);
            this.renderGameMemory();
        }

        renderGameMemory() {
            this.cleanupGhosts();

            const cardsHtml = this.memCards.map((card, idx) => `
                <div class="mem-card-wrapper" data-index="${idx}" id="mem-card-${idx}">
                    <div class="mem-card-inner ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}">
                        <!-- Back Face (Visible initially) -->
                        <div class="mem-card-face mem-card-back">
                            <div class="mem-back-ornament">☸</div>
                            <div class="mem-back-brand">
                                <span class="mem-brand-title">ZatLoka</span>
                                <span class="mem-brand-sub">Sains Bali</span>
                            </div>
                        </div>
                        <!-- Front Face (Revealed on flip) -->
                        <div class="mem-card-face mem-card-front">
                            <div class="mem-front-badge ${card.type}">
                                ${card.type === 'ethno' ? '🏮 Etnosains' : '🔬 Konsep Sains'}
                            </div>
                            <div class="mem-img-wrap">
                                <img src="${card.image}" alt="${card.name}" class="mem-card-img" />
                            </div>
                            <div class="mem-card-info">
                                <h4 class="mem-card-title">${card.name}</h4>
                                <p class="mem-card-sub">${card.subtext}</p>
                            </div>
                            ${card.isMatched ? '<span class="mem-matched-icon">🏆</span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-mem-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#fefce8; color:#ca8a04;">GAME 8 • MEMORY 3D</span>
                            <h2>Pencocokan Kartu Sains & Etnosains</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="mem-moves-pill">
                            <span class="mem-moves-label">Langkah:</span>
                            <span class="mem-moves-val" id="mem-moves-val">${this.memMoves}</span>
                        </div>
                        <div class="lokaplay-progress-pill" id="mem-pairs-pill">
                            ${this.memMatchedPairs} / 6 Pasang Cocok
                        </div>
                    </div>
                </header>

                <main class="mem-arena">
                    <!-- Top Goal & Rules Bar -->
                    <div class="mem-status-bar">
                        <div class="mem-target-rating">
                            <span>🎯 Target Bintang:</span>
                            <span class="mem-rating-item ${this.memMoves <= 12 ? 'active' : ''}">⭐⭐⭐ &le;12 (+50 EXP)</span>
                            <span class="mem-rating-item ${this.memMoves > 12 && this.memMoves <= 18 ? 'active' : ''}">⭐⭐ 13-18 (+30 EXP)</span>
                            <span class="mem-rating-item ${this.memMoves > 18 ? 'active' : ''}">⭐ &gt;18 (+10 EXP)</span>
                        </div>
                        <button class="btn-mem-reset" id="btn-mem-reset" title="Acak ulang posisi kartu">🔄 Acak Ulang</button>
                    </div>

                    <!-- 3x4 Card Grid -->
                    <div class="mem-grid" id="mem-grid">
                        ${cardsHtml}
                    </div>
                </main>
            `;

            document.getElementById('btn-mem-back').onclick = () => {
                SoundFx.play('click');
                this.cleanupGhosts();
                this.showHub();
            };

            document.getElementById('btn-mem-reset').onclick = () => {
                SoundFx.play('click');
                this.initGameMemory();
            };

            this.container.querySelectorAll('.mem-card-wrapper').forEach(cardEl => {
                cardEl.onclick = () => {
                    const idx = parseInt(cardEl.dataset.index, 10);
                    this.handleMemoryCardClick(idx);
                };
            });
        }

        handleMemoryCardClick(idx) {
            if (this.memIsLocked) return;
            const card = this.memCards[idx];
            if (!card || card.isFlipped || card.isMatched) return;

            SoundFx.play('click');
            card.isFlipped = true;

            const cardEl = document.getElementById(`mem-card-${idx}`);
            if (cardEl) {
                const inner = cardEl.querySelector('.mem-card-inner');
                if (inner) inner.classList.add('flipped');
            }

            this.memFlipped.push(idx);

            if (this.memFlipped.length === 2) {
                this.memMoves++;
                const movesEl = document.getElementById('mem-moves-val');
                if (movesEl) movesEl.textContent = this.memMoves;

                this.memIsLocked = true;
                const [idx1, idx2] = this.memFlipped;
                const c1 = this.memCards[idx1];
                const c2 = this.memCards[idx2];

                if (c1.pairId === c2.pairId) {
                    // MATCH SUCCESS
                    SoundFx.play('correct');
                    c1.isMatched = true;
                    c2.isMatched = true;
                    this.memMatchedPairs++;

                    const el1 = document.getElementById(`mem-card-${idx1}`);
                    const el2 = document.getElementById(`mem-card-${idx2}`);
                    if (el1) el1.querySelector('.mem-card-inner')?.classList.add('matched');
                    if (el2) el2.querySelector('.mem-card-inner')?.classList.add('matched');

                    const pairsPill = document.getElementById('mem-pairs-pill');
                    if (pairsPill) pairsPill.textContent = `${this.memMatchedPairs} / 6 Pasang Cocok`;

                    this.memFlipped = [];
                    this.memIsLocked = false;

                    if (this.memMatchedPairs === 6) {
                        setTimeout(() => {
                            this.renderMemoryVictory();
                        }, 500);
                    }
                } else {
                    // MATCH FAILED - Delay 0.8s as per PRD
                    SoundFx.play('wrong');
                    const el1 = document.getElementById(`mem-card-${idx1}`);
                    const el2 = document.getElementById(`mem-card-${idx2}`);
                    if (el1) el1.classList.add('mem-shake');
                    if (el2) el2.classList.add('mem-shake');

                    setTimeout(() => {
                        c1.isFlipped = false;
                        c2.isFlipped = false;
                        if (el1) {
                            el1.classList.remove('mem-shake');
                            el1.querySelector('.mem-card-inner')?.classList.remove('flipped');
                        }
                        if (el2) {
                            el2.classList.remove('mem-shake');
                            el2.querySelector('.mem-card-inner')?.classList.remove('flipped');
                        }
                        this.memFlipped = [];
                        this.memIsLocked = false;
                    }, 800);
                }
            }
        }

        renderMemoryVictory() {
            this.cleanupGhosts();
            SoundFx.play('victory');

            let stars = 1;
            let earnedExp = 10;
            if (this.memMoves <= 12) {
                stars = 3;
                earnedExp = 50;
            } else if (this.memMoves <= 18) {
                stars = 2;
                earnedExp = 30;
            }

            addExp(earnedExp);

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-mem-hub-end">← Menu Game</button>
                    <h2>Pencocokan Memori Tuntas!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card" style="border-color: #ca8a04;">
                        <div class="victory-icon">🏆</div>
                        <h3>Suksma! Memorimu Sangat Tajam! 👏</h3>
                        <p>Hebat sekali! Kamu berhasil menyatukan seluruh 6 fenomena etnosains Bali dengan representasi konsep sains sub-mikroskopisnya!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">${this.memMoves}</span>
                                <span class="vstat-lbl">Total Langkah</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">${"⭐".repeat(stars)}</span>
                                <span class="vstat-lbl">${stars} Bintang</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${earnedExp} EXP</span>
                                <span class="vstat-lbl">Hadiah EXP</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-mem-replay">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-mem-to-hub" style="background: linear-gradient(135deg, #eab308, #ca8a04);">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-mem-hub-end').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-mem-replay').onclick = () => {
                SoundFx.play('click');
                this.initGameMemory();
            };
            document.getElementById('btn-mem-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }

        // ==========================================
        // GAME 9: MULTIPLE CHOICE (SUDDEN DEATH)
        // ==========================================
        initGameSuddenDeath() {
            this.cleanupGhosts();
            this.stopSDTimer();
            this.currentGame = 'game_suddendeath';
            this.sdSeconds = 0;
            this.sdOverallIndex = 0;
            this.sdEarnedExp = 0;
            this.sdIsAnswered = false;

            // Structure: Level 1 -> 2 -> 3 -> 4, with 2 questions internally shuffled in each level
            const l1 = shuffleArray(SUDDEN_DEATH_DATA[0].questions);
            const l2 = shuffleArray(SUDDEN_DEATH_DATA[1].questions);
            const l3 = shuffleArray(SUDDEN_DEATH_DATA[2].questions);
            const l4 = shuffleArray(SUDDEN_DEATH_DATA[3].questions);
            this.sdQuestions = [...l1, ...l2, ...l3, ...l4];

            this.startSDTimer();
            this.renderGameSuddenDeath();
        }

        stopSDTimer() {
            if (this.sdTimer) {
                clearInterval(this.sdTimer);
                this.sdTimer = null;
            }
        }

        startSDTimer() {
            this.stopSDTimer();
            this.sdTimer = setInterval(() => {
                this.sdSeconds++;
                const timerEl = document.getElementById('sd-timer-val');
                if (timerEl) {
                    const mm = String(Math.floor(this.sdSeconds / 60)).padStart(2, '0');
                    const ss = String(this.sdSeconds % 60).padStart(2, '0');
                    timerEl.textContent = `${mm}:${ss}`;
                }
            }, 1000);
        }

        renderGameSuddenDeath() {
            this.cleanupGhosts();
            const curQ = this.sdQuestions[this.sdOverallIndex];
            const curLevelNum = Math.floor(this.sdOverallIndex / 2) + 1;
            const curLevelData = SUDDEN_DEATH_DATA[curLevelNum - 1];

            const mm = String(Math.floor(this.sdSeconds / 60)).padStart(2, '0');
            const ss = String(this.sdSeconds % 60).padStart(2, '0');

            const optionsLabels = ['A', 'B', 'C', 'D'];
            const optionsHtml = curQ.options.map((opt, i) => `
                <button class="sd-option-btn" data-index="${i}" id="sd-opt-${i}">
                    <span class="sd-opt-badge">${optionsLabels[i]}</span>
                    <span class="sd-opt-text">${opt}</span>
                </button>
            `).join('');

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <div class="header-left">
                        <button class="back-btn" id="btn-sd-back">← Menu Game</button>
                        <div class="lokaplay-title-wrapper">
                            <span class="lokaplay-badge" style="background:#fff1f2; color:#e11d48;">GAME 9 • SUDDEN DEATH</span>
                            <h2>Level ${curLevelNum}/4: ${curLevelData.levelTitle}</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="sd-timer-pill">
                            <span class="sd-timer-icon">⏱️</span>
                            <span id="sd-timer-val">${mm}:${ss}</span>
                        </div>
                        <div class="lokaplay-progress-pill">
                            Soal ${this.sdOverallIndex + 1} / 8
                        </div>
                    </div>
                </header>

                <main class="sd-arena" id="sd-arena-container">
                    <div class="sd-card">
                        <div class="sd-card-topbar">
                            <span class="sd-level-indicator">Level ${curLevelNum} • Soal ${(this.sdOverallIndex % 2) + 1}/2</span>
                            <span class="sd-warning-badge">⚠️ Aturan: 1x Salah = Ulang Awal!</span>
                        </div>
                        <div class="sd-question-box">
                            <p class="sd-question-text">${curQ.question}</p>
                        </div>
                    </div>

                    <div class="sd-options-grid">
                        ${optionsHtml}
                    </div>
                </main>
            `;

            document.getElementById('btn-sd-back').onclick = () => {
                SoundFx.play('click');
                this.stopSDTimer();
                this.cleanupGhosts();
                this.showHub();
            };

            this.container.querySelectorAll('.sd-option-btn').forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.index, 10);
                    this.handleSDAnswer(idx);
                };
            });
        }

        handleSDAnswer(selectedIndex) {
            if (this.sdIsAnswered) return;
            this.sdIsAnswered = true;

            const curQ = this.sdQuestions[this.sdOverallIndex];
            const isCorrect = (selectedIndex === curQ.correct);

            const selectedBtn = document.getElementById(`sd-opt-${selectedIndex}`);

            if (isCorrect) {
                SoundFx.play('correct');
                if (selectedBtn) selectedBtn.classList.add('sd-correct');
                this.sdEarnedExp += 20;
                addExp(20);

                setTimeout(() => {
                    this.showSDExplanationModal(curQ.explanation, () => {
                        this.sdIsAnswered = false;
                        this.sdOverallIndex++;
                        if (this.sdOverallIndex < this.sdQuestions.length) {
                            this.renderGameSuddenDeath();
                        } else {
                            this.renderSDVictory();
                        }
                    });
                }, 400);
            } else {
                // SUDDEN DEATH TRIGGER!
                SoundFx.play('wrong');
                this.stopSDTimer();
                if (selectedBtn) selectedBtn.classList.add('sd-wrong');
                const correctBtn = document.getElementById(`sd-opt-${curQ.correct}`);
                if (correctBtn) correctBtn.classList.add('sd-correct');

                const arenaEl = document.getElementById('sd-arena-container');
                if (arenaEl) arenaEl.classList.add('sd-shake-screen');

                setTimeout(() => {
                    this.triggerSuddenDeathGameOver(curQ);
                }, 700);
            }
        }

        showSDExplanationModal(explanationText, onNext) {
            const existing = document.getElementById('sd-explanation-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'sd-explanation-modal';
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card" style="border-color: #10b981;">
                    <div class="g1-fb-topbar">
                        <span class="g1-fb-badge" style="background: #ecfdf5; color: #059669;">
                            ✅ Jawaban Benar! (+20 EXP)
                        </span>
                        <span class="g1-fb-category" style="background: #eff6ff; color: #1d4ed8;">Sudden Death</span>
                    </div>

                    <div style="text-align: center; margin: 0.5rem 0;">
                        <div style="font-size: 2.2rem;">✨🎉</div>
                        <h3 style="font-family: var(--font-heading); color: #0f172a; margin: 0.25rem 0 0.5rem 0;">
                            Pembahasan Konsep Sains
                        </h3>
                    </div>

                    <div class="g1-fb-explanation-box" style="background: #f0fdf4; border-color: #bbf7d0;">
                        <div class="g1-fb-sparkle-icon">📖</div>
                        <p class="g1-fb-text" style="color: #166534;">${explanationText}</p>
                    </div>

                    <div class="g1-fb-actions">
                        <button class="btn-fb-continue" id="btn-sd-continue">
                            <span>Lanjut Soal Berikutnya</span>
                            <span class="btn-arrow">▶</span>
                        </button>
                    </div>
                </div>
            `;

            this.container.appendChild(modal);
            document.getElementById('btn-sd-continue').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                if (typeof onNext === 'function') onNext();
            };
        }

        triggerSuddenDeathGameOver(failedQuestion) {
            SoundFx.play('wrong');
            const existing = document.getElementById('sd-gameover-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'sd-gameover-modal';
            modal.className = 'g1-card-feedback-modal';
            modal.innerHTML = `
                <div class="g1-card-feedback-card" style="border-color: #f43f5e; max-width: 480px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.25rem;">💀⚡</div>
                    <h3 style="font-family: var(--font-heading); color: #e11d48; margin: 0 0 0.4rem 0; font-size: 1.3rem;">
                        SUDDEN DEATH! Jawaban Keliru
                    </h3>
                    <p style="font-size: 0.85rem; color: #64748b; line-height: 1.45; margin-bottom: 0.75rem;">
                        Aturan Sudden Death menyatakan <strong>tidak boleh ada 1 kesalahan pun</strong>! Kuis harus diulang dari awal Level 1.
                    </p>

                    <div class="g1-fb-explanation-box" style="background: #fff1f2; border-color: #fecdd3; text-align: left; margin-bottom: 1rem;">
                        <div style="font-weight: 800; color: #be123c; font-size: 0.8rem; margin-bottom: 0.25rem;">💡 Kunci Jawaban & Pembahasan:</div>
                        <p class="g1-fb-text" style="color: #881337; font-size: 0.82rem;">${failedQuestion.explanation}</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn btn-primary" id="btn-sd-restart-all" style="background: linear-gradient(135deg, #f43f5e, #e11d48); width: 100%;">
                            🔄 Ulangi Kuis dari Awal (Level 1)
                        </button>
                        <button class="btn btn-secondary" id="btn-sd-quit-hub" style="width: 100%;">
                            Kembali ke Menu Loka-play 🏠
                        </button>
                    </div>
                </div>
            `;

            this.container.appendChild(modal);

            document.getElementById('btn-sd-restart-all').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                this.initGameSuddenDeath();
            };

            document.getElementById('btn-sd-quit-hub').onclick = () => {
                SoundFx.play('click');
                modal.remove();
                this.showHub();
            };
        }

        renderSDVictory() {
            this.cleanupGhosts();
            this.stopSDTimer();
            SoundFx.play('victory');

            const isFast = this.sdSeconds < 300; // < 05:00 minutes
            const bonusExp = isFast ? 50 : 0;
            if (bonusExp > 0) {
                addExp(bonusExp);
                this.sdEarnedExp += bonusExp;
            }

            const mm = String(Math.floor(this.sdSeconds / 60)).padStart(2, '0');
            const ss = String(this.sdSeconds % 60).padStart(2, '0');
            const timeStr = `${mm}:${ss}`;

            this.container.innerHTML = `
                <header class="lokaplay-header">
                    <button class="back-btn" id="btn-sd-hub-win">← Menu Game</button>
                    <h2>Sudden Death Tertaklukkan!</h2>
                </header>
                <main class="g1-victory-screen">
                    <div class="victory-card" style="border-color: #f43f5e;">
                        <div class="victory-icon">👑</div>
                        <h3>Sempurna, Master Sudden Death Teruji!</h3>
                        <p>Kamu berhasil menjawab seluruh 8 soal sains 4 Level Wujud Zat berturut-turut tanpa membuat satu kesalahan pun!</p>
                        <div class="victory-stats">
                            <div class="vstat-item">
                                <span class="vstat-num">8 / 8</span>
                                <span class="vstat-lbl">Soal Sempurna</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">${timeStr}</span>
                                <span class="vstat-lbl">Waktu Tempuh</span>
                            </div>
                            <div class="vstat-item">
                                <span class="vstat-num">+${this.sdEarnedExp} EXP</span>
                                <span class="vstat-lbl">${isFast ? 'Total (+50 Bonus Speed)' : 'Total Hadiah'}</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="btn btn-secondary" id="btn-sd-replay-win">🔄 Main Lagi</button>
                            <button class="btn btn-primary" id="btn-sd-to-hub" style="background: linear-gradient(135deg, #f43f5e, #e11d48);">Kembali ke Menu Game 🏠</button>
                        </div>
                    </div>
                </main>
            `;

            document.getElementById('btn-sd-hub-win').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
            document.getElementById('btn-sd-replay-win').onclick = () => {
                SoundFx.play('click');
                this.initGameSuddenDeath();
            };
            document.getElementById('btn-sd-to-hub').onclick = () => {
                SoundFx.play('click');
                this.showHub();
            };
        }
    }

    // Expose instance globally
    window.ZatlokaLokaPlay = new LokaPlayController();

    // Auto-init when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ZatlokaLokaPlay.init();
    });
})();
