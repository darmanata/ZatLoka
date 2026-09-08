/* ==========================================================================
   ZATLOKA SPA ENGINE (MAIN ENTRY POINT)
   Mengintegrasikan preloader, audio manager, state management, & SPA router.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. STATE MANAGEMENT DEFAULT
    const appState = {
        profile: {
            name: localStorage.getItem('zatloka_profile_name') || 'Siswa Baru',
            rank: localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan',
            exp: parseInt(localStorage.getItem('zatloka_profile_exp')) || 0
        },
        audio: {
            muted: localStorage.getItem('zatloka_audio_muted') === 'true'
        },
        currentScreen: 'loading'
    };

    // 2. INISIALISASI KOMPONEN & PARTIKEL
    // Inisialisasi Canvas Partikel
    const particles = new ParticleSystem('particles-canvas');

    // Inisialisasi Component Manager (Modal & Profil UI)
    const components = new ComponentManager(appState);
    components.updateProfileUI();

    // 3. AUDIO MANAGEMENT (BGM Opening)
    const bgmPlayer = document.getElementById('bgm-player');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');

    // Update UI Tombol Audio Berdasarkan State Mute
    function updateAudioButtonUI() {
        if (!audioToggleBtn) return;
        
        if (appState.audio.muted) {
            audioToggleBtn.innerHTML = `
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            `;
            audioToggleBtn.classList.add('muted');
            if (bgmPlayer) bgmPlayer.muted = true;
        } else {
            audioToggleBtn.innerHTML = `
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
            `;
            audioToggleBtn.classList.remove('muted');
            if (bgmPlayer) bgmPlayer.muted = false;
        }
    }

    // Fungsi Mulai BGM (Menangani Kebijakan Autoplay Browser)
    function playBGM() {
        if (!bgmPlayer || appState.audio.muted) return;
        
        bgmPlayer.volume = 0.4; // Volume sedang agar tidak terlalu berisik
        bgmPlayer.play().catch(error => {
            console.log("Autoplay dicegah oleh browser. Menunggu interaksi pengguna untuk memutar musik.");
            // Daftarkan event listener untuk memutar musik begitu ada interaksi pertama
            const startPlayOnInteraction = () => {
                if (!appState.audio.muted) {
                    bgmPlayer.play().catch(e => console.log(e));
                }
                document.removeEventListener('click', startPlayOnInteraction);
                document.removeEventListener('touchstart', startPlayOnInteraction);
            };
            document.addEventListener('click', startPlayOnInteraction);
            document.addEventListener('touchstart', startPlayOnInteraction);
        });
    }

    // Toggle Mute / Unmute
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            appState.audio.muted = !appState.audio.muted;
            localStorage.setItem('zatloka_audio_muted', appState.audio.muted);
            updateAudioButtonUI();
            
            if (!appState.audio.muted && bgmPlayer) {
                bgmPlayer.play().catch(e => console.log("Play failed: ", e));
            } else if (bgmPlayer) {
                bgmPlayer.pause();
            }
        });
    }

    // Sinkronisasi status audio awal
    updateAudioButtonUI();

    // --- PENGHENTIAN OTOMATIS AUDIO KETIKA APLIKASI DI KELUARKAN / DI LATAR BELAKANG ---
    // Menangani siklus hidup Android WebView, APK, dan peramban ponsel (Home button, minimize, switch app, exit)
    function handleBackgroundPause() {
        if (bgmPlayer) {
            bgmPlayer.pause();
        }
        if (window.ZatlokaVideo && typeof window.ZatlokaVideo.pauseAllVideos === 'function') {
            window.ZatlokaVideo.pauseAllVideos();
        }
    }

    function handleForegroundResume() {
        if (!appState.audio.muted && bgmPlayer && appState.currentScreen !== 'loading') {
            bgmPlayer.play().catch(e => console.log("Resume audio prevented: ", e));
        }
    }

    // 1. Visibility Change API (Ketika beralih aplikasi atau menekan tombol home)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            handleBackgroundPause();
        } else {
            handleForegroundResume();
        }
    });

    // 2. Page Hide & BeforeUnload (Ketika aplikasi/halaman ditutup atau dikeluarkan)
    window.addEventListener('pagehide', handleBackgroundPause);
    window.addEventListener('beforeunload', handleBackgroundPause);

    // 3. Android Freeze Event (Lifecycle event khusus Android WebView)
    window.addEventListener('freeze', handleBackgroundPause);

    // 4. PRELOADER & LOGIKA LOADING SCREEN
    const progressBar = document.getElementById('loading-progress-bar');
    const progressPercentage = document.getElementById('loading-percentage');
    const progressStatus = document.getElementById('loading-status');

    // Teks status loading dinamis
    const statusTexts = [
        { limit: 20, text: "Memuat partikel sains..." },
        { limit: 45, text: "Mengkristalkan garam tradisional Kusamba..." },
        { limit: 70, text: "Menyiapkan laboratorium virtual zat..." },
        { limit: 90, text: "Menghubungkan etnosains & kearifan lokal..." },
        { limit: 100, text: "Menyelesaikan penyusunan materi..." }
    ];

    let currentProgress = 0;
    const loadingDuration = 3500; // 3.5 Detik sesuai PRD (3-4 detik)
    const intervalTime = 30; 
    const increment = 100 / (loadingDuration / intervalTime);

    const loadingInterval = setInterval(() => {
        currentProgress += increment + (Math.random() * 0.5); // Progres dinamis sedikit acak
        
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(loadingInterval);
            finishLoading();
        }

        // Update Progress Bar & Teks Persentase
        if (progressBar) progressBar.style.width = `${currentProgress}%`;
        if (progressPercentage) progressPercentage.textContent = `${Math.floor(currentProgress)}%`;

        // Update Deskripsi Status
        const matchedStatus = statusTexts.find(s => currentProgress <= s.limit);
        if (matchedStatus && progressStatus) {
            progressStatus.textContent = matchedStatus.text;
        }
    }, intervalTime);

    // Transisi setelah Loading selesai
    function finishLoading() {
        setTimeout(() => {
            // Hentikan sistem partikel loading canvas untuk menghemat RAM/performa
            particles.destroy();

            // Transisi Screen (Loading -> Home)
            const loadingScreen = document.getElementById('loading-screen');
            const homeScreen = document.getElementById('home-screen');
            
            if (loadingScreen) loadingScreen.classList.remove('active');
            if (homeScreen) homeScreen.classList.add('active');
            
            appState.currentScreen = 'home';

            // Jalankan audio setelah loading selesai
            playBGM();
        }, 500); // Penundaan visual setelah 100%
    }

    // 5. SPA ROUTING (MANAJEMEN NAVIGASI HALAMAN)
    const activeScreens = {
        home: document.getElementById('home-screen'),
        materi: document.getElementById('materi-screen'),
        game: document.getElementById('game-screen'),
        quiz: document.getElementById('quiz-screen'),
        video: document.getElementById('video-screen'),
        info: document.getElementById('info-screen')
    };

    // Navigasi ke halaman detail
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetPage = card.getAttribute('data-page');
            navigateTo(targetPage);
        });
    });

    // Tombol Kembali
    document.querySelectorAll('.back-btn:not(#materi-home-btn)').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target') || 'home';
            navigateTo(target);
        });
    });

    function navigateTo(targetPage) {
        // Validasi target screen
        const targetScreen = activeScreens[targetPage];
        if (!targetScreen) return;

        // Hilangkan layar aktif saat ini
        Object.values(activeScreens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Tampilkan layar baru
        targetScreen.classList.add('active');
        appState.currentScreen = targetPage;

        // Jika meninggalkan Nonton & Amati, hentikan dan reset seluruh video
        if (targetPage !== 'video' && window.ZatlokaVideo && typeof window.ZatlokaVideo.stopAndResetAllVideos === 'function') {
            window.ZatlokaVideo.stopAndResetAllVideos();
        }

        // Jika masuk ke arena Loka-play, render menu game hub
        if (targetPage === 'game' && window.ZatlokaLokaPlay) {
            window.ZatlokaLokaPlay.cleanupGhosts();
            window.ZatlokaLokaPlay.showHub();
        } else if (window.ZatlokaLokaPlay) {
            window.ZatlokaLokaPlay.cleanupGhosts();
        }

        // Jika masuk ke menu Kuis, render Peta Kuis
        if (targetPage === 'quiz' && window.ZatlokaKuis) {
            window.ZatlokaKuis.showLevelMap();
        }

        // Jika masuk ke Eksplorasi Zat, refresh Peta Level
        if (targetPage === 'materi' && window.ZatlokaMateri) {
            window.ZatlokaMateri.refreshLevelMapUI();
        }

        // Jika masuk ke Nonton & Amati, refresh Video Gallery
        if (targetPage === 'video' && window.ZatlokaVideo) {
            window.ZatlokaVideo.init();
        }
    }

    // Expose app router to global window for cross-module SPA navigation
    window.ZatlokaApp = {
        navigateTo,
        appState
    };
});

