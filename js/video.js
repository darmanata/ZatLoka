/* ==========================================================================
   ZATLOKA NONTON & AMATI (VIDEO GALLERY ENGINE)
   - Vertical List View (Kiri: Vimeo Responsif Embed, Kanan: Metadata & Tombol)
   - Bebas Buffering & Error CORS (Vimeo Player Engine)
   - Validasi Interaksi Presisi: Vimeo Player API (.on('play'))
   - Pembatasan Tombol: Tombol awalnya Disabled, Aktif otomatis setelah tombol play ditekan
   - Gamifikasi: +10 EXP, Animasi Toast, Efek Audio Web Audio API
   ========================================================================== */

(function () {
    'use strict';

    // 1. DATASET LENGKAP VIDEO (Vimeo Embeds)
    const VIDEO_CATEGORIES = [
        {
            category: "Kategori 1: Eksperimen Tradisional & Etnosains Bali",
            icon: "🏺",
            videos: [
                {
                    id: "v1_1",
                    vimeoSrc: "https://player.vimeo.com/video/1224104516?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "RUMITNYA PEMBUATAN GARAM KUSAMBA BALI",
                    code: "Video 1.1",
                    title: "Rumitnya Pembuatan Garam Kusamba Bali",
                    desc: "Mengamati proses tradisional pembuatan garam organik di Pesisir Kusamba yang memanfaatkan energi panas matahari."
                },
                {
                    id: "v1_2",
                    vimeoSrc: "https://player.vimeo.com/video/1224105342?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "TERNYATA BEGINI PROSES PEMBUATAN ARAK BALI YANG TRADISIONAL",
                    code: "Video 1.2",
                    title: "Proses Pembuatan Arak Bali Tradisional",
                    desc: "Observasi teknik destilasi (penyulingan) tradisional menggunakan bambu pendingin untuk mengubah uap menjadi zat cair."
                },
                {
                    id: "v1_3",
                    vimeoSrc: "https://player.vimeo.com/video/1224104450?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "Proses Pembuatan Dupa Kaori",
                    code: "Video 1.3",
                    title: "Proses Pembuatan Dupa Harum Kaori",
                    desc: "Melihat langsung bagaimana bahan baku padat dicampur dan diolah menjadi batang dupa harum khas Bali."
                }
            ]
        },
        {
            category: "Kategori 2: Wujud Zat & Model Partikel",
            icon: "🔬",
            videos: [
                {
                    id: "v2_1",
                    vimeoSrc: "https://player.vimeo.com/video/1224104404?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "Karakteristik Wujud Benda",
                    code: "Video 2.1",
                    title: "Karakteristik Wujud Benda (Padat, Cair, Gas)",
                    desc: "Penjelasan visual mengenai jarak antarpartikel dan bagaimana wujud zat memengaruhi bentuk serta volume benda."
                }
            ]
        },
        {
            category: "Kategori 3: Perubahan Wujud Zat",
            icon: "🔥",
            videos: [
                {
                    id: "v3_1",
                    vimeoSrc: "https://player.vimeo.com/video/1224104407?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "Macam-macam Zat dan Perubahannya",
                    code: "Video 3.1",
                    title: "Macam-macam Zat dan Perubahannya",
                    desc: "Animasi dan penjelasan mengenai pengaruh penyerapan serta pelepasan panas terhadap titik leleh dan titik didih suatu materi."
                }
            ]
        },
        {
            category: "Kategori 4: Perubahan Fisika dan Kimia",
            icon: "🧪",
            videos: [
                {
                    id: "v4_1",
                    vimeoSrc: "https://player.vimeo.com/video/1224104405?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "PERUBAHAN FISIKA DAN PERUBAHAN KIMIA",
                    code: "Video 4.1",
                    title: "Sifat dan Perubahan Fisika vs Kimia",
                    desc: "Membedakan peristiwa di lingkungan sekitar mana yang tergolong perubahan wujud biasa dan mana yang menghasilkan zat jenis baru."
                }
            ]
        },
        {
            category: "Kategori 5: Kerapatan Zat (Massa Jenis)",
            icon: "⚖️",
            videos: [
                {
                    id: "v5_1",
                    vimeoSrc: "https://player.vimeo.com/video/1224104406?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
                    vimeoTitle: "Pengaruh Massa Jenis Benda",
                    code: "Video 5.1",
                    title: "Pengaruh Massa Jenis Benda (Hukum Archimedes)",
                    desc: "Simulasi eksperimen benda mengapung, melayang, dan tenggelam berdasarkan perbedaan tingkat kerapatan partikelnya."
                }
            ]
        }
    ];

    // Helper Sound Synthesizer (Web Audio API)
    const VideoAudio = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },
        playSuccess() {
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

                osc.start(now);
                osc.stop(now + 0.5);
            } catch (e) {
                console.log("Audio play error", e);
            }
        },
        playUnlock() {
            try {
                this.init();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(880, now + 0.09);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                osc.start(now);
                osc.stop(now + 0.25);
            } catch (e) {
                console.log("Audio play error", e);
            }
        }
    };

    // 2. VIDEO CONTROLLER SINGLETON
    class VideoController {
        constructor() {
            this.container = document.getElementById('video-screen');
            this.storageKey = 'zatloka_watched_videos';
            this.unlockedVideos = new Set(); // Videos that student has pressed play on
            this.players = {}; // Vimeo Player instances
        }

        init() {
            if (!this.container) return;
            this.render();
        }

        getWatchedVideos() {
            try {
                const raw = localStorage.getItem(this.storageKey);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        }

        saveWatchedVideo(videoId) {
            const watched = this.getWatchedVideos();
            if (!watched.includes(videoId)) {
                watched.push(videoId);
                localStorage.setItem(this.storageKey, JSON.stringify(watched));
            }
        }

        render() {
            const watchedList = this.getWatchedVideos();
            let totalVideos = 0;
            VIDEO_CATEGORIES.forEach(cat => totalVideos += cat.videos.length);
            const watchedCount = watchedList.length;

            this.container.innerHTML = `
                <div class="video-screen-wrapper">
                    <!-- HEADER SCREEN (STICKY FULL WIDTH) -->
                    <header class="video-header">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <button class="back-btn" data-target="home" id="btn-video-back">← Beranda</button>
                            <div class="video-header-title-box">
                                <span class="video-badge">GALERI VIDEO</span>
                                <h2 class="video-screen-title">Nonton & Amati</h2>
                            </div>
                        </div>
                        <div class="video-progress-pill" id="video-progress-pill">
                            👁️ Ditonton: ${watchedCount} / ${totalVideos} Video
                        </div>
                    </header>

                    <!-- CONTENT SCROLLABLE LIST -->
                    <main class="video-content-scroll">
                        <!-- BANNER PETUNJUK -->
                        <div class="video-inst-banner">
                            <span class="v-inst-icon">📺</span>
                            <div class="v-inst-text">
                                <strong>Eksplorasi Video Sains:</strong> Putar dan tonton video sains nyata di bawah ini. Tombol <strong>"Selesai Ditonton ✅"</strong> akan terbuka secara otomatis setelah kamu memutar video, dan berhadiah <strong>+10 EXP</strong>!
                            </div>
                        </div>

                        <!-- VERTICAL LIST PER KATEGORI -->
                        <div class="video-categories-container">
                            ${VIDEO_CATEGORIES.map(cat => `
                                <section class="video-cat-group">
                                    <div class="video-cat-header">
                                        <span class="video-cat-icon">${cat.icon}</span>
                                        <h3 class="video-cat-title">${cat.category}</h3>
                                    </div>
                                    <div class="video-cards-list">
                                        ${cat.videos.map(v => {
                                            const isWatched = watchedList.includes(v.id);
                                            const isUnlocked = isWatched || this.unlockedVideos.has(v.id);
                                            return `
                                                <div class="video-card ${isWatched ? 'watched' : ''}" id="vcard-${v.id}">
                                                    <!-- KIRI: VIMEO RESPONSIVE EMBED IFRAME -->
                                                    <div class="video-iframe-wrapper" data-vid="${v.id}">
                                                        <div style="padding:56.25% 0 0 0;position:relative;">
                                                            <iframe 
                                                                id="vimeo-iframe-${v.id}"
                                                                src="${v.vimeoSrc}" 
                                                                frameborder="0" 
                                                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                                                                referrerpolicy="strict-origin-when-cross-origin" 
                                                                style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                                                                title="${v.vimeoTitle}">
                                                            </iframe>
                                                        </div>
                                                    </div>

                                                    <!-- KANAN: METADATA & TOMBOL GAMIFIKASI -->
                                                    <div class="video-info-box">
                                                        <div class="vinfo-top">
                                                            <span class="video-code-badge">${v.code}</span>
                                                            <h4 class="video-item-title">${v.title}</h4>
                                                            <p class="video-item-desc">${v.desc}</p>
                                                        </div>
                                                        <div class="vinfo-bottom">
                                                            <button class="btn-watch-action ${isWatched ? 'completed' : (isUnlocked ? 'unlocked' : 'locked')}" 
                                                                    id="btn-watch-${v.id}"
                                                                    data-vid="${v.id}" 
                                                                    ${(isWatched || !isUnlocked) ? 'disabled' : ''}>
                                                                ${isWatched ? 'Sudah Ditonton' : (isUnlocked ? 'Selesai Ditonton ✅' : '🔒 Tonton Video Dahulu')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </section>
                            `).join('')}
                        </div>
                    </main>
                </div>

                <!-- FLOATING EXP TOAST CONTAINER -->
                <div id="video-exp-toast" class="video-exp-toast hidden">+10 EXP ✨</div>
            `;

            this.bindEvents();
            this.initVimeoPlayers();
        }

        bindEvents() {
            // Back Button
            const backBtn = document.getElementById('btn-video-back');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    this.stopAndResetAllVideos();
                    if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                        window.ZatlokaApp.navigateTo('home');
                    }
                });
            }

            // Listen to browser/tab visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopAndResetAllVideos();
                }
            });

            // Watch Action Buttons
            this.container.querySelectorAll('.btn-watch-action').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vid = btn.getAttribute('data-vid');
                    const isWatched = this.getWatchedVideos().includes(vid);
                    const isUnlocked = this.unlockedVideos.has(vid);

                    if (isWatched) return;

                    if (!isUnlocked) {
                        this.showNotificationToast("Silakan putar dan tonton videonya terlebih dahulu!");
                        return;
                    }

                    this.handleMarkWatched(vid, btn, e);
                });
            });
        }

        initVimeoPlayers() {
            this.players = {};

            if (typeof Vimeo === 'undefined' || !Vimeo.Player) {
                // Retry if script is still loading asynchronously
                setTimeout(() => this.initVimeoPlayers(), 300);
                return;
            }

            VIDEO_CATEGORIES.forEach(cat => {
                cat.videos.forEach(v => {
                    const iframeEl = document.getElementById(`vimeo-iframe-${v.id}`);
                    if (iframeEl) {
                        try {
                            const player = new Vimeo.Player(iframeEl);
                            this.players[v.id] = player;

                            // Listen to Vimeo 'play' event:
                            // 1. Auto-pause all other videos (Only 1 video plays at a time)
                            // 2. Unlock gamification button
                            player.on('play', () => {
                                this.pauseOtherVideos(v.id);
                                this.unlockVideo(v.id);
                            });
                        } catch (err) {
                            console.warn(`[Vimeo] Player initialization for ${v.id}:`, err);
                        }
                    }
                });
            });
        }

        pauseOtherVideos(currentVideoId) {
            if (this.players) {
                Object.entries(this.players).forEach(([vid, player]) => {
                    if (vid !== currentVideoId && player && typeof player.pause === 'function') {
                        try {
                            player.pause().catch(() => {});
                        } catch (e) {}
                    }
                });
            }
        }

        stopAndResetAllVideos() {
            if (this.players) {
                Object.values(this.players).forEach(player => {
                    if (player && typeof player.pause === 'function') {
                        try {
                            player.pause().then(() => {
                                if (typeof player.setCurrentTime === 'function') {
                                    player.setCurrentTime(0).catch(() => {});
                                }
                            }).catch(() => {});
                        } catch (e) {}
                    }
                });
            }
        }

        unlockVideo(videoId) {
            if (this.unlockedVideos.has(videoId)) return;
            this.unlockedVideos.add(videoId);

            const isWatched = this.getWatchedVideos().includes(videoId);
            if (isWatched) return;

            const btn = document.getElementById(`btn-watch-${videoId}`);
            if (btn) {
                btn.removeAttribute('disabled');
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
                btn.classList.add('pulse-unlock');
                btn.textContent = 'Selesai Ditonton ✅';
                VideoAudio.playUnlock();
                setTimeout(() => btn.classList.remove('pulse-unlock'), 800);
            }
        }

        handleMarkWatched(videoId, btnEl, event) {
            this.saveWatchedVideo(videoId);
            VideoAudio.playSuccess();

            // 1. Update Button State
            btnEl.classList.remove('unlocked');
            btnEl.classList.add('completed');
            btnEl.setAttribute('disabled', 'true');
            btnEl.textContent = 'Sudah Ditonton';

            // 2. Update Card Container
            const cardEl = document.getElementById(`vcard-${videoId}`);
            if (cardEl) {
                cardEl.classList.add('watched');
            }

            // 3. Award +10 EXP to profile
            let currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || 0;
            currentExp += 10;
            localStorage.setItem('zatloka_profile_exp', currentExp);

            // Sync with global profile widget
            const widgetExp = document.getElementById('widget-exp');
            const modalExp = document.getElementById('profile-exp-val');
            if (widgetExp) widgetExp.textContent = `✨ ${currentExp} EXP`;
            if (modalExp) modalExp.textContent = `${currentExp} EXP`;
            if (window.ZatlokaApp && window.ZatlokaApp.appState && window.ZatlokaApp.appState.profile) {
                window.ZatlokaApp.appState.profile.exp = currentExp;
            }

            // 4. Update Header Pill
            const watchedList = this.getWatchedVideos();
            let totalVideos = 0;
            VIDEO_CATEGORIES.forEach(cat => totalVideos += cat.videos.length);
            const pill = document.getElementById('video-progress-pill');
            if (pill) {
                pill.textContent = `👁️ Ditonton: ${watchedList.length} / ${totalVideos} Video`;
            }

            // 5. Show Animated +10 EXP Floating Toast
            this.showExpToast(event);
        }

        showExpToast(event) {
            const toast = document.getElementById('video-exp-toast');
            if (!toast) return;

            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;

            if (event && event.clientX && event.clientY) {
                x = event.clientX;
                y = event.clientY - 30;
            }

            toast.textContent = '+10 EXP ✨';
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            toast.style.left = `${x}px`;
            toast.style.top = `${y}px`;
            toast.classList.remove('hidden');
            toast.classList.add('animate-pop');

            setTimeout(() => {
                toast.classList.remove('animate-pop');
                toast.classList.add('hidden');
            }, 1200);
        }

        showNotificationToast(message) {
            const toast = document.getElementById('video-exp-toast');
            if (!toast) return;

            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;

            toast.textContent = `ℹ️ ${message}`;
            toast.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';
            toast.style.left = `${x}px`;
            toast.style.top = `${y}px`;
            toast.classList.remove('hidden');
            toast.classList.add('animate-pop');

            setTimeout(() => {
                toast.classList.remove('animate-pop');
                toast.classList.add('hidden');
            }, 1800);
        }
    }

    // Expose Global
    window.ZatlokaVideo = new VideoController();

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ZatlokaVideo.init();
    });

})();
