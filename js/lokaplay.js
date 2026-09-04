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

    // Helper to add EXP to user profile
    function addExp(points) {
        try {
            const expEl = document.getElementById('widget-exp');
            const expProfileEl = document.getElementById('profile-exp-val');
            let current = 0;
            if (expEl && expEl.textContent) {
                const match = expEl.textContent.match(/\d+/);
                if (match) current = parseInt(match[0], 10);
            }
            const updated = current + points;
            if (expEl) expEl.textContent = `✨ ${updated} EXP`;
            if (expProfileEl) expProfileEl.textContent = `${updated} EXP`;
            localStorage.setItem('zatloka_exp', updated);
        } catch (e) { }
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
                { id: "c1", name: "Dupa Harum", img: "card-dupa.webp", target: "padat" },
                { id: "c2", name: "Kayu Cendana", img: "card-kayu.webp", target: "padat" },
                { id: "c3", name: "Minyak Atraktan", img: "card-minyak.webp", target: "cair" },
                { id: "c4", name: "Arak Bali", img: "card-arak.webp", target: "cair" },
                { id: "c5", name: "Asap Aroma", img: "card-asap.webp", target: "gas" }
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
                { id: "c6", name: "Penguapan Garam", img: "card-garam-uap.webp", target: "memerlukan" },
                { id: "c7", name: "Es Daluman Mencair", img: "card-es-daluman.webp", target: "memerlukan" },
                { id: "c8", name: "Pengembunan Uap Arak", img: "card-embun-arak.webp", target: "melepaskan" },
                { id: "c9", name: "Pemadatan Adonan", img: "card-adonan.webp", target: "melepaskan" }
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
                { id: "c10", name: "Telur Segar", img: "card-telur.webp", target: "terapung" },
                { id: "c11", name: "Batang Dupa Bambu", img: "card-batang-dupa.webp", target: "terapung" },
                { id: "c12", name: "Batu Kali", img: "card-batu.webp", target: "tenggelam" }
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
                { id: "c13", name: "Kristalisasi Garam", img: "card-kristal.webp", target: "fisika" },
                { id: "c14", name: "Garam Melarut", img: "card-garam-larut.webp", target: "fisika" },
                { id: "c15", name: "Pembakaran Dupa", img: "card-bakar-dupa.webp", target: "kimia" },
                { id: "c16", name: "Pembusukan Janur", img: "card-janur.webp", target: "kimia" },
                { id: "c17", name: "Fermentasi Tuak", img: "card-fermentasi.webp", target: "kimia" }
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

    // --- 5. LOKA-PLAY CONTROLLER CLASS ---
    class LokaPlayController {
        constructor() {
            this.container = null;
            this.currentGame = null; // 'hub', 'game1', 'game2', 'game3'
            
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
        }

        cleanupGhosts() {
            document.querySelectorAll('.g1-card-dragging, .g2-chip-dragging').forEach(el => el.remove());
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
                            <p>Uji pemahaman wujud zat, energi panas, dan perubahan materi melalui 3 permainan interaktif yang menyenangkan.</p>
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

                        // Check if all cards in this question are solved
                        if (this.g1SolvedCards.size === qData.cards.length) {
                            addExp(25);
                            setTimeout(() => {
                                this.showGame1SuccessModal();
                            }, 500);
                        }
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
                                ${qData.bank.map((word, i) => `
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
    }

    // Expose instance globally
    window.ZatlokaLokaPlay = new LokaPlayController();

    // Auto-init when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ZatlokaLokaPlay.init();
    });
})();
