/* ==========================================================================
   ZATLOKA MATERI CONTROLLER (LEVEL 1-4)
   Handles Slide engine, Peta Level, Lottie Mascot, and interactive simulations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS & STATE
    const materiScreen = document.getElementById('materi-screen');
    if (!materiScreen) return; // Exit if not in index.html (safety check)

    const slides = document.querySelectorAll('.materi-slide');
    const prevBtn = document.getElementById('materi-prev-btn');
    const nextBtn = document.getElementById('materi-next-btn');
    const slideNumDisplay = document.getElementById('materi-slide-number');
    const levelBadge = document.getElementById('materi-level-badge');
    const slideTitle = document.getElementById('materi-slide-title');
    const dotsContainer = document.getElementById('materi-dots-container');
    
    // Popup Elements
    const popupOverlay = document.getElementById('materi-popup');
    const popupBody = document.getElementById('materi-popup-body');
    const popupClose = document.getElementById('materi-popup-close');

    // Mascot Elements
    const mascotContainer = document.getElementById('kima-mascot-container');
    const mascotBubbleText = document.getElementById('kima-bubble-text');

    let currentLevel = null;
    let levelSlides = [];
    let currentSlideIndex = 0;
    let currentSlide = 1;
    let kimaLottie = null;
    let mascotTimeout = null;
    
    // State of interactions
    const clickedHotspots = { bambu: false, tetesan: false, uap: false };
    let dupaGameCompleted = false;
    const droppedItems = { bambu: false, telur: false, koin: false };

    // Slide Metadata (Level and Title for Header)
    const slideMetadata = {
        1: { level: 'Level 1: Wujud Zat & Model Partikel', title: 'Rahasia Penyulingan Arak Bali' },
        2: { level: 'Level 1: Wujud Zat & Model Partikel', title: 'Menembus Partikel Rahasia' },
        3: { level: 'Level 2: Perubahan Wujud & Titik Suhu', title: 'Rahasia Es Daluman Bali' },
        4: { level: 'Level 2: Perubahan Wujud & Titik Suhu', title: 'Tradisi Penyulingan Arak (Menguap & Mengembun)' },
        5: { level: 'Level 2: Perubahan Wujud & Titik Suhu', title: 'Pengharum Kamar (Menyublim)' },
        6: { level: 'Level 2: Perubahan Wujud & Titik Suhu', title: 'Tradisi Garam Kusamba (Mengkristal)' },
        7: { level: 'Level 2: Perubahan Wujud & Titik Suhu', title: 'Batas Suhu Perubahan Wujud' },
        8: { level: 'Level 3: Perubahan Fisika & Kimia', title: 'Pembakaran Dupa & Kartu Analisis' },
        9: { level: 'Level 4: Kerapatan & Massa Jenis', title: 'Rahasia Mengapung, Melayang, dan Tenggelam' },
        10: { level: 'Level 4: Kerapatan & Massa Jenis', title: 'Perhitungan Massa Jenis' }
    };

    // 2. LEVEL MAP NAVIGATION & SPA LINKING
    function refreshLevelMapUI() {
        if (!window.ZatlokaProgression) return;
        const prog = window.ZatlokaProgression.get();

        document.querySelectorAll('.level-map-btn').forEach(btn => {
            const lvl = parseInt(btn.getAttribute('data-level'), 10);
            const isUnlocked = window.ZatlokaProgression.isMateriUnlocked(lvl);
            const isCompleted = prog.completedMateri.includes(lvl);
            const statusIcon = btn.querySelector('.level-status-icon');

            if (isUnlocked) {
                btn.classList.remove('locked-level');
                btn.removeAttribute('disabled');
                if (statusIcon) {
                    statusIcon.innerHTML = isCompleted ? '⭐ Selesai Dibaca' : '🔓 Mulai';
                    statusIcon.className = 'level-status-icon status-unlocked';
                }
            } else {
                btn.classList.add('locked-level');
                btn.removeAttribute('disabled'); // Keep clickable so startLevel can show feedback alert
                if (statusIcon) {
                    statusIcon.innerHTML = `🔒 Lulus Kuis Lvl ${lvl - 1}`;
                    statusIcon.className = 'level-status-icon status-locked';
                }
            }
        });
    }

    function clearAllVignettes() {
        const screenVignetteGlobal = document.getElementById('screen-vignette-global');
        if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay';
        const vignetteOverlayL22 = document.getElementById('vignette-overlay-l22');
        if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay';
    }

    function showLevelMap() {
        clearAllVignettes();
        document.getElementById('materi-header').style.display = 'none';
        document.getElementById('materi-footer').style.display = 'none';
        slides.forEach(slide => slide.classList.remove('active'));
        document.getElementById('materi-level-map').style.display = 'flex';
        currentLevel = null;
        levelSlides = [];
        currentSlideIndex = 0;
        refreshLevelMapUI();
    }

    function exitLevelToMap(isCompleted = false) {
        clearAllVignettes();
        resetMateriSlides();
        if (isCompleted && currentLevel) {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.completeMateri(currentLevel);
            }
            showMascotBubble(`Luar biasa! Kamu menyelesaikan Level ${currentLevel}! Kuis Level ${currentLevel} sekarang telah TERBUKA!`);
        }
        showLevelMap();
    }

    function startLevel(levelNum) {
        if (window.ZatlokaProgression && !window.ZatlokaProgression.isMateriUnlocked(levelNum)) {
            alert(`🔒 Materi Level ${levelNum} masih terkunci!\n\nSelesaikan membaca materi dan raih skor 100% pada Kuis Level ${levelNum - 1} untuk membukanya.`);
            return;
        }

        resetMateriSlides();
        currentLevel = levelNum;
        if (levelNum === 1) {
            levelSlides = [1, 2];
        } else if (levelNum === 2) {
            levelSlides = [3, 4, 5, 6, 7];
        } else if (levelNum === 3) {
            levelSlides = [8];
        } else if (levelNum === 4) {
            levelSlides = [9, 10];
        }
        currentSlideIndex = 0;
        currentSlide = levelSlides[currentSlideIndex];
        
        // Hide Level Map
        document.getElementById('materi-level-map').style.display = 'none';
        
        // Show Header and Footer
        document.getElementById('materi-header').style.display = 'flex';
        document.getElementById('materi-footer').style.display = 'flex';
        
        // Dynamically build progress dots
        buildProgressDots();
        
        updateSlidesUI();
    }

    function buildProgressDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        levelSlides.forEach((slideNum, idx) => {
            const dot = document.createElement('span');
            dot.className = 'progress-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('data-target-slide', slideNum);
            dot.addEventListener('click', () => {
                currentSlideIndex = idx;
                currentSlide = levelSlides[currentSlideIndex];
                updateSlidesUI();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Attach level map button click events
    document.querySelectorAll('.level-map-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lvl = parseInt(btn.getAttribute('data-level'), 10);
            startLevel(lvl);
        });
    });

    // Back to map buttons
    document.querySelectorAll('#materi-home-btn, [id="materi-level-map"] .back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.id === 'materi-home-btn') {
                e.stopPropagation();
                exitLevelToMap();
            }
        });
    });

    // Expose for external SPA syncing
    window.ZatlokaMateri = {
        refreshLevelMapUI,
        showLevelMap,
        startLevel
    };


    // 3. SLIDE NAVIGATION ENGINE
    function updateSlidesUI() {
        // Reset any atmospheric vignette overlay on slide transition
        const screenVignetteGlobal = document.getElementById('screen-vignette-global');
        if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay';
        const vignetteOverlayL22 = document.getElementById('vignette-overlay-l22');
        if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay';

        slides.forEach(slide => {
            slide.classList.remove('active');
            if (parseInt(slide.getAttribute('data-slide')) === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Ensure navigation footer is visible
        const footer = document.getElementById('materi-footer');
        if (footer) footer.style.display = 'flex';

        // Update progress text (based on level slides)
        slideNumDisplay.textContent = `${currentSlideIndex + 1} / ${levelSlides.length}`;

        // Update header metadata
        if (slideMetadata[currentSlide]) {
            levelBadge.textContent = slideMetadata[currentSlide].level;
            slideTitle.textContent = slideMetadata[currentSlide].title;
        }

        // Update dots
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.getAttribute('data-target-slide')) === currentSlide) {
                dot.classList.add('active');
            }
        });

        // Trigger Mascot dialogue on entry to a new level
        triggerLevelMascotTalk();
    }

    // Footer buttons event binding
    prevBtn.onclick = () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            currentSlide = levelSlides[currentSlideIndex];
            updateSlidesUI();
        } else {
            exitLevelToMap();
        }
    };

    nextBtn.onclick = () => {
        if (currentSlideIndex < levelSlides.length - 1) {
            currentSlideIndex++;
            currentSlide = levelSlides[currentSlideIndex];
            updateSlidesUI();
        } else {
            if (currentLevel) {
                showLevelCompleteModal(currentLevel);
            } else {
                exitLevelToMap(true);
            }
        }
    };

    // Modal Pilihan Akhir Level (Lanjut ke Kuis / Kembali ke Peta)
    function showLevelCompleteModal(levelNum) {
        clearAllVignettes();
        
        // Tandai materi level ini selesai di sistem progresi
        if (window.ZatlokaProgression) {
            window.ZatlokaProgression.completeMateri(levelNum);
        }

        const levelNames = {
            1: "Wujud Zat & Model Partikel",
            2: "Perubahan Wujud & Titik Suhu",
            3: "Perubahan Fisika & Kimia",
            4: "Kerapatan & Massa Jenis"
        };

        const modal = document.getElementById('materi-level-complete-modal');
        if (!modal) {
            exitLevelToMap(true);
            return;
        }

        const titleEl = document.getElementById('materi-complete-title');
        const descEl = document.getElementById('materi-complete-desc');
        const badgeEl = document.getElementById('materi-complete-badge');
        const quizLvlSpan = document.getElementById('materi-complete-quiz-lvl');

        if (badgeEl) badgeEl.textContent = `LEVEL ${levelNum} SELESAI!`;
        if (titleEl) titleEl.textContent = `Selamat! Materi Level ${levelNum} Tuntas`;
        if (descEl) descEl.innerHTML = `Kamu telah menyelesaikan seluruh materi <strong>${levelNames[levelNum] || `Level ${levelNum}`}</strong>. Kuis untuk Level ${levelNum} sekarang telah terbuka!`;
        if (quizLvlSpan) quizLvlSpan.textContent = levelNum;

        modal.classList.remove('hidden');

        // Button 1: Langsung Lanjut ke Kuis Level Ini
        const btnGoQuiz = document.getElementById('btn-materi-go-quiz');
        if (btnGoQuiz) {
            btnGoQuiz.onclick = () => {
                modal.classList.add('hidden');
                resetMateriSlides();
                showLevelMap();
                if (window.ZatlokaApp && window.ZatlokaApp.navigateTo) {
                    window.ZatlokaApp.navigateTo('quiz');
                }
                if (window.ZatlokaKuis && typeof window.ZatlokaKuis.startKuis === 'function') {
                    window.ZatlokaKuis.startKuis(levelNum);
                }
            };
        }

        // Button 2: Kembali ke Peta Level
        const btnGoMap = document.getElementById('btn-materi-go-map');
        if (btnGoMap) {
            btnGoMap.onclick = () => {
                modal.classList.add('hidden');
                exitLevelToMap(true);
            };
        }
    }

    // 4. MASCOT (KIMA) CONTROLLER
    function initKimaMascot() {
        if (!document.getElementById('kima-lottie')) return;
        
        try {
            kimaLottie = lottie.loadAnimation({
                container: document.getElementById('kima-lottie'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: window.KIMA_MASCOT_DATA
            });
        } catch (e) {
            console.log("Lottie failed to load, falling back. Error: ", e);
        }
    }

    function showMascotBubble(text) {
        if (mascotTimeout) clearTimeout(mascotTimeout);
        
        mascotBubbleText.textContent = text;
        mascotContainer.classList.add('visible');

        mascotTimeout = setTimeout(() => {
            mascotContainer.classList.remove('visible');
        }, 6000);
    }

    function triggerLevelMascotTalk() {
        if (currentSlide === 1) {
            showMascotBubble("Hebat! Kamu menemukan petunjuk baru, mari amati wujud zat!");
        } else if (currentSlide === 3) {
            showMascotBubble("Es Daluman segar sekali! Mari pelajari pelelehan zat!");
        } else if (currentSlide === 8) {
            showMascotBubble("Dupa ini harum sekali, ayo selidiki perubahannya!");
        } else if (currentSlide === 9) {
            showMascotBubble("Wah, kolam air! Mari uji kerapatan benda-benda ini!");
        }
    }

    // Initialize mascot immediately
    initKimaMascot();

    // 5. POPUP SYSTEM HANDLERS
    function openMateriPopup(htmlContent) {
        popupBody.innerHTML = htmlContent;
        popupOverlay.style.display = 'flex';
        popupOverlay.offsetHeight; // Force reflow
        popupOverlay.classList.add('active');
    }

    function closeMateriPopup() {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    }

    popupClose.addEventListener('click', closeMateriPopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) closeMateriPopup();
    });

    // 6. LEVEL 1.1: ARAK BALI HOTSPOTS
    const hotspots = {
        bambu: {
            element: document.getElementById('hotspot-bambu'),
            title: 'Wujud Padat (Bambu Suling)',
            text: 'Bambu penyulingan memiliki wujud <strong>PADAT</strong>. Zat padat memiliki bentuk dan volume yang selalu tetap, serta tidak berubah meskipun dipindahkan ke tempat yang berbeda.'
        },
        tetesan: {
            element: document.getElementById('hotspot-tetesan'),
            title: 'Wujud Cair (Tetesan Arak)',
            text: 'Tetesan arak memiliki wujud <strong>CAIR</strong>. Zat cair memiliki volume yang tetap, tetapi bentuknya selalu berubah mengikuti bentuk wadah penampungnya.'
        },
        uap: {
            element: document.getElementById('hotspot-uap'),
            title: 'Wujud Gas (Uap Panas)',
            text: 'Uap panas yang mengepul memiliki wujud <strong>GAS</strong>. Zat gas tidak memiliki bentuk dan volume yang tetap; bentuk dan volumenya selalu berubah memenuhi seluruh ruang yang ditempatinya.'
        }
    };

    Object.keys(hotspots).forEach(key => {
        const hotspot = hotspots[key];
        if (hotspot.element) {
            hotspot.element.addEventListener('click', () => {
                const content = `
                    <div class="popup-inner-wujud">
                        <h3>${hotspot.title}</h3>
                        <p>${hotspot.text}</p>
                    </div>
                `;
                openMateriPopup(content);

                if (!clickedHotspots[key]) {
                    clickedHotspots[key] = true;
                    if (clickedHotspots.bambu && clickedHotspots.tetesan && clickedHotspots.uap) {
                        setTimeout(() => {
                            showMascotBubble("Hebat, kamu menemukan semua wujud zat di penyulingan ini!");
                        }, 500);
                    }
                }
            });
        }
    });

    // 7. LEVEL 1.2: TAB HANDLERS
    const tabButtons = document.querySelectorAll('.tab-materi-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === `tab-${targetTab}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 8. LEVEL 2.1: ES DALUMAN (STATE SWAPPING & CROSS-FADE ANIMATION)
    const dalumanImgPadat = document.getElementById('daluman-img-padat');
    const dalumanImgCair = document.getElementById('daluman-img-cair');
    const btnPanasDaluman = document.getElementById('btn-panas-daluman');
    const btnBekuDaluman = document.getElementById('btn-beku-daluman');
    const dalumanTextDesc = document.getElementById('daluman-text-desc');

    if (btnPanasDaluman && btnBekuDaluman) {
        btnPanasDaluman.addEventListener('click', () => {
            if (dalumanImgPadat) dalumanImgPadat.style.opacity = '0';
            if (dalumanImgCair) dalumanImgCair.style.opacity = '1';
            if (dalumanTextDesc) {
                dalumanTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #d97706; font-size: 0.95rem; font-weight: 700;">Meleleh (Padat → Cair)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari padat menjadi cair (contoh: es batu yang dipanaskan hingga mencair).</li>
                            <li><strong>Penyebab:</strong> Adanya penyerapan energi panas dari api atau lingkungan sekitar.</li>
                            <li><strong>Mekanisme Partikel:</strong>
                                <ul style="margin-top: 0.2rem; padding-left: 1.2rem; list-style-type: circle; display: flex; flex-direction: column; gap: 0.15rem;">
                                    <li>Panas memberikan energi bagi partikel untuk bergetar lebih cepat.</li>
                                    <li>Terbentuk ruang antarpeluang kecil, dan ikatan antarpartikel lama-kelamaan melemah sehingga wujudnya berubah menjadi cair.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Daluman mencair saat menyerap energi panas!");
        });

        btnBekuDaluman.addEventListener('click', () => {
            if (dalumanImgPadat) dalumanImgPadat.style.opacity = '1';
            if (dalumanImgCair) dalumanImgCair.style.opacity = '0';
            if (dalumanTextDesc) {
                dalumanTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">Membeku (Cair → Padat)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari cair menjadi padat (contoh: air yang dimasukkan ke dalam freezer menjadi es).</li>
                            <li><strong>Penyebab:</strong> Pelepasan energi panas karena suhu yang sangat dingin (panas keluar ke udara sekitar).</li>
                            <li><strong>Mekanisme Partikel:</strong>
                                <ul style="margin-top: 0.2rem; padding-left: 1.2rem; list-style-type: circle; display: flex; flex-direction: column; gap: 0.15rem;">
                                    <li>Kehilangan panas membuat partikel air bergerak lebih lambat dan saling mendekat.</li>
                                    <li>Terbentuk ikatan yang lebih kuat antarpartikel sehingga partikel tidak bisa bebas bergerak lagi dan hanya bergetar di tempat.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Daluman kembali membeku saat melepaskan energi panas!");
        });
    }

    // 9. LEVEL 2.2: ARAK (MENGUAP & MENGEMBUN)
    const btnDidihL22 = document.getElementById('btn-didih-l22');
    const btnDinginL22 = document.getElementById('btn-dingin-l22');
    const arakImgDefault = document.getElementById('arak-img-default');
    const arakImgHeating = document.getElementById('arak-img-heating');
    const arakImgCooling = document.getElementById('arak-img-cooling');
    const arakTextCol = document.getElementById('arak-text-col') || document.getElementById('evap-text-l22');
    const screenVignetteGlobal = document.getElementById('screen-vignette-global');

    if (btnDidihL22 && btnDinginL22) {
        btnDidihL22.addEventListener('click', () => {
            // Logika Animasi Fade Gambar: arak_2_heating opacity = 1, arak_3_cooling opacity = 0
            if (arakImgHeating) arakImgHeating.style.opacity = '1';
            if (arakImgCooling) arakImgCooling.style.opacity = '0';

            // Ubah state/warna tombol agar terlihat aktif
            btnDidihL22.classList.add('active');
            btnDinginL22.classList.remove('active');

            // Efek visual atmosfer layar
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-red';

            // Render teks di Kolom Kanan: Materi PENGUAPAN (Sains & Etnosains)
            if (arakTextCol) {
                arakTextCol.innerHTML = `
                    <div class="arak-content-fade">
                        <div style="display: inline-block; background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                            🔥 Proses Pemanasan (Menyerap Kalor)
                        </div>
                        <h3 style="margin: 0 0 0.4rem 0; color: #b91c1c; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                            Menguap & Mendidih (Cair → Gas)
                        </h3>
                        <p style="margin: 0 0 0.5rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                            <strong>Kearifan Etnosains Bali:</strong> Wadah tembaga di atas tungku batu bata dipanaskan menggunakan bara api kayu bakar. Kalor panas diserap oleh cairan bahan arak (tuak nira) hingga mendidih. Karena alkohol memiliki titik didih lebih rendah (~78°C) dibanding air (~100°C), partikel alkohol akan menguap lebih dahulu membubung naik ke bagian atas wadah penyulingan.
                        </p>
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0 0 0.3rem 0; color: #991b1b; font-size: 0.82rem; font-weight: 700;">Konsep Sains Penting:</h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #374151; line-height: 1.45; display: flex; flex-direction: column; gap: 0.25rem;">
                                <li><strong>Menguap (Evaporasi):</strong> Perubahan wujud zat dari cair menjadi uap (gas) yang terjadi di permukaan zat cair pada sembarang suhu di bawah titik didih.</li>
                                <li><strong>Mendidih:</strong> Perubahan wujud cair menjadi gas yang terjadi secara serentak di seluruh bagian cairan pada titik didihnya (ditandai gelembung-gelembung uap yang naik cepat ke permukaan).</li>
                                <li><strong>Tinjauan Sub-Mikroskopis:</strong> Penyerapan kalor membuat energi kinetik partikel meningkat sehingga gerakannya semakin cepat, gaya tarik antarpartikel melemah, dan partikel merenggang lepas menjadi fasa gas.</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            if (typeof showMascotBubble === 'function') {
                showMascotBubble("Cairan tuak arak di panci menyerap kalor hingga mendidih dan menguap!");
            }
        });

        btnDinginL22.addEventListener('click', () => {
            // Logika Animasi Fade Gambar: arak_3_cooling opacity = 1, arak_2_heating opacity = 0
            if (arakImgCooling) arakImgCooling.style.opacity = '1';
            if (arakImgHeating) arakImgHeating.style.opacity = '0';

            // Ubah state/warna tombol agar terlihat aktif
            btnDinginL22.classList.add('active');
            btnDidihL22.classList.remove('active');

            // Efek visual atmosfer layar
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-blue';

            // Render teks di Kolom Kanan: Materi PENGEMBUNAN / KONDENSASI (Sains & Etnosains)
            if (arakTextCol) {
                arakTextCol.innerHTML = `
                    <div class="arak-content-fade">
                        <div style="display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                            ❄️ Proses Pendinginan (Melepaskan Kalor)
                        </div>
                        <h3 style="margin: 0 0 0.4rem 0; color: #1d4ed8; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                            Mengembun / Kondensasi (Gas → Cair)
                        </h3>
                        <p style="margin: 0 0 0.5rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                            <strong>Kearifan Etnosains Bali:</strong> Uap arak yang membubung diarahkan melewati pipa bambu panjang (*bumbung penyulingan*). Pipa bambu bersentuhan langsung dengan udara lingkungan yang lebih dingin, berfungsi sebagai pendingin (kondensor) alami. Saat uap panas mengenai dinding bambu yang sejuk, uap melepaskan kalor dan terkondensasi menjadi tetesan arak cair murni yang ditampung ke gentong.
                        </p>
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0 0 0.3rem 0; color: #1e40af; font-size: 0.82rem; font-weight: 700;">Konsep Sains Penting:</h4>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #374151; line-height: 1.45; display: flex; flex-direction: column; gap: 0.25rem;">
                                <li><strong>Pengertian Mengembun:</strong> Perubahan wujud zat dari fasa gas (uap) menjadi fasa cair (kebalikan dari proses penguapan).</li>
                                <li><strong>Pelepasan Kalor (Eksoterm):</strong> Uap gas kehilangan energi panas karena panasnya berpindah ke medium yang suhunya lebih rendah (dinding pipa bambu).</li>
                                <li><strong>Tinjauan Sub-Mikroskopis:</strong> Akibat kehilangan energi termal, gerakan partikel gas melambat, gaya tarik antarpartikel kembali kuat, sehingga partikel saling merapat dan berikatan kembali menjadi tetesan zat cair.</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            if (typeof showMascotBubble === 'function') {
                showMascotBubble("Uap gas arak mendingin di dalam bambu dan mengembun!");
            }
        });
    }

    // 10. LEVEL 2.3: BARUS (SUBLIMASI)
    const btnPanasBarus = document.getElementById('btn-panas-barus');
    const sublimBg = document.getElementById('sublim-bg');
    const sublimKapur = document.getElementById('sublim-kapur');
    const sublimGas = document.getElementById('sublim-gas');
    const sublimTextDesc = document.getElementById('sublim-text-desc');

    if (btnPanasBarus) {
        btnPanasBarus.addEventListener('click', () => {
            if (sublimKapur) sublimKapur.style.opacity = '0'; // Kapur memudar
            if (sublimGas) {
                sublimGas.style.opacity = '0.85';
                sublimGas.style.transform = 'translateY(-25px)';
            }
            if (sublimTextDesc) {
                sublimTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #b45309; font-size: 0.95rem; font-weight: 700;">Menyublim (Padat → Gas)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari padat langsung menjadi gas tanpa melalui tahapan cair terlebih dahulu.</li>
                            <li><strong>Contoh dalam Kehidupan Sehari-hari:</strong>
                                <ul style="margin-top: 0.2rem; padding-left: 1.2rem; list-style-type: circle; display: flex; flex-direction: column; gap: 0.2rem;">
                                    <li>Es kering (<em>dry ice</em>) yang digunakan untuk menciptakan efek kabut atau asap pada konser musik, pertunjukan seni, atau acara pernikahan.</li>
                                    <li>Kapur barus (kamper) yang diletakkan di dalam lemari pakaian atau kamar mandi yang lama-kelamaan habis menguap ke udara.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Kapur barus menyublim langsung menjadi gas aroma wangi!");
        });
    }

    // 10.5 LEVEL 2.4: GARAM KUSAMBA (MENGKRISTAL)
    const saltSunSlider = document.getElementById('salt-sun-slider');
    const saltWaterImg = document.getElementById('salt-water-img');
    const saltCrystalsImg = document.getElementById('salt-crystals-img');
    const saltSteamImg = document.getElementById('salt-steam-img');
    const saltTextDesc = document.getElementById('salt-text-desc');

    if (saltSunSlider) {
        saltSunSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            const opacityWater = (100 - val) / 100;
            const opacityCrystals = val / 100;

            if (saltWaterImg) saltWaterImg.style.opacity = opacityWater;
            if (saltCrystalsImg) saltCrystalsImg.style.opacity = opacityCrystals;

            // Evaporation steam opacity curve (reaches max at 50% and fades out by 100%)
            if (val > 0 && val < 100) {
                const steamOpacity = Math.sin((val / 100) * Math.PI) * 0.85;
                if (saltSteamImg) saltSteamImg.style.opacity = steamOpacity;
            } else {
                if (saltSteamImg) saltSteamImg.style.opacity = 0;
            }

            if (val === 100) {
                saltTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">Mengkristal (Gas → Padat)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari gas langsung menjadi padat.</li>
                            <li><strong>Keterangan:</strong> Proses ini merupakan kebalikan dari peristiwa menyublim. Partikel gas melepaskan energi panas dan merapat kaku menjadi kristal padat.</li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Air laut menguap habis meninggalkan endapan kristal garam Kusamba!");
            } else if (val > 0) {
                saltTextDesc.innerHTML = `Panas matahari meningkat sebesar <strong>${val}%</strong>. Air laut mulai menguap perlahan dan butiran garam mulai terbentuk...`;
            } else {
                saltTextDesc.innerHTML = 'Geser slider matahari ke kanan untuk menguapkan air laut dan membentuk endapan kristal garam tradisional.';
            }
        });
    }

    // 11. LEVEL 2.5: TERMOMETER TITIK DIDIH & LELEH
    const tempSlider = document.getElementById('temp-slider-l24');
    const tempDisplay = document.getElementById('temp-val-display');
    const tempFill = document.getElementById('thermometer-fill');
    const tempTextDesc = document.getElementById('temp-text-desc');

    if (tempSlider) {
        tempSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (tempDisplay) tempDisplay.textContent = val;
            
            // Adjust thermometer graphic fill
            const fillHeight = 15 + (val * 0.85); // min 15%, max 100%
            if (tempFill) tempFill.style.height = `${fillHeight}%`;

            if (val === 0) {
                tempTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #0284c7; font-size: 0.95rem; font-weight: 700;">Titik Leleh</h4>
                        <p style="margin: 0; font-size: 0.82rem; line-height: 1.45;"><strong>Pengertian:</strong> Suhu tertentu ketika suatu zat padat mulai mencair dan berubah wujud menjadi zat cair sepenuhnya.</p>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Perubahan Wujud:</strong> Zat Padat → Zat Cair (Contoh: Es batu yang berubah menjadi air cair).</li>
                            <li><strong>Kondisi Suhu:</strong> Ketika suatu zat mencapai titik lelehnya, penambahan energi panas membuat partikel-partikel zat padat yang tadinya bergetar rapat mulai longgar, merenggang, dan mencair. Suhu zat akan tetap konstan selama proses pelelehan berlangsung hingga seluruh zat padat berubah menjadi cair.</li>
                            <li><strong>Contoh dalam Kehidupan:</strong>
                                <ul style="margin-top: 0.2rem; padding-left: 1.2rem; list-style-type: circle; display: flex; flex-direction: column; gap: 0.2rem;">
                                    <li>Es murni memiliki titik leleh pada suhu 0°C.</li>
                                    <li>Logam emas memiliki titik leleh yang sangat tinggi (± 1.064°C) sehingga harus dipanaskan dengan api khusus oleh perajin perhiasan di Bali untuk bisa dicetak.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Suhu 0°C! Ini adalah Titik Leleh air!");
            } else if (val === 100) {
                tempTextDesc.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #dc2626; font-size: 0.95rem; font-weight: 700;">Titik Didih</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Pengertian:</strong> Suhu tertentu ketika suatu zat cair mulai mendidih dan berubah wujud menjadi gas (uap) secara serentak di seluruh bagian zat cair.</li>
                            <li><strong>Perubahan Wujud:</strong> Zat Cair → Gas / Uap (Contoh: Air mendidih di dalam panci yang mengeluarkan uap).</li>
                            <li><strong>Kondisi Suhu:</strong> Berbeda dengan penguapan biasa (yang bisa terjadi di permukaan pada suhu berapa pun), titik didih terjadi pada suhu tetap di mana tekanan uap jenuh cairan sama dengan tekanan udara luar. Saat tercapai, suhu cairan tidak akan naik lagi melebihi titik didihnya sebelum seluruh cairan habis menguap.</li>
                            <li><strong>Contoh dalam Kehidupan:</strong>
                                <ul style="margin-top: 0.2rem; padding-left: 1.2rem; list-style-type: circle; display: flex; flex-direction: column; gap: 0.2rem;">
                                    <li>Air murni memiliki titik didih standar pada suhu 100°C di tekanan normal.</li>
                                    <li>Pada proses penyulingan arak Bali (destilasi), uap alkohol dan air dipisahkan berdasarkan perbedaan titik didihnya masing-masing.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                `;
                showMascotBubble("Suhu 100°C! Air mendidih sempurna menjadi uap!");
            } else {
                tempTextDesc.innerHTML = `Suhu air saat ini berada pada <strong>${val}°C</strong>. Geser slider termometer ke arah <strong>0°C</strong> untuk mengamati Titik Leleh es, atau ke arah <strong>100°C</strong> untuk mengamati Titik Didih air!`;
            }
        });
    }

    // 12. LEVEL 3.1: DUPA BURNING & FLIP CARD
    const dupaToggleBtn = document.getElementById('dupa-toggle-btn');
    const dupaFresh = document.getElementById('dupa-fresh');
    const dupaBurnt = document.getElementById('dupa-burnt');
    const dupaSmoke = document.getElementById('dupa-smoke');
    const dupaPlaceholder = document.getElementById('dupa-placeholder');
    const dupaFlipContainer = document.getElementById('dupa-flip-container');
    const cardFisika = document.getElementById('card-fisika');
    const cardKimia = document.getElementById('card-kimia');

    if (dupaToggleBtn) {
        dupaToggleBtn.addEventListener('click', () => {
            if (dupaGameCompleted) return;

            // Trigger animations
            if (dupaFresh) dupaFresh.style.opacity = '0';
            if (dupaBurnt) dupaBurnt.style.opacity = '1';
            if (dupaSmoke) {
                dupaSmoke.style.opacity = '0.85';
                dupaSmoke.classList.add('smoking');
            }

            // Button update
            dupaToggleBtn.textContent = '🔥 Dupa Menyala';
            dupaToggleBtn.style.background = '#64748b';

            // Show Flip Card Container
            if (dupaPlaceholder) dupaPlaceholder.style.display = 'none';
            if (dupaFlipContainer) {
                dupaFlipContainer.classList.remove('hidden');
                dupaFlipContainer.style.display = 'flex';
            }

            dupaGameCompleted = true;
            
            setTimeout(() => {
                showMascotBubble("Ketuk masing-masing kartu dupa untuk membalik dan melihat perbedaannya!");
            }, 800);
        });
    }

    if (cardFisika) {
        cardFisika.addEventListener('click', () => {
            cardFisika.classList.toggle('flipped');
        });
    }
    if (cardKimia) {
        cardKimia.addEventListener('click', () => {
            cardKimia.classList.toggle('flipped');
        });
    }

    // 13. LEVEL 4.1: DENSITY DRAG AND DROP (UNIVERSAL POINTER EVENTS: MOBILE & DESKTOP)
    const dragBambu = document.getElementById('density-drag-bambu');
    const dragTelur = document.getElementById('density-drag-telur');
    const dragKoin = document.getElementById('density-drag-koin');
    const densityPond = document.getElementById('density-pond');
    const pondBambu = document.getElementById('pond-floater-bambu');
    const pondTelur = document.getElementById('pond-floater-telur');
    const pondKoin = document.getElementById('pond-sinker-koin');

    function updatePondIndicatorState() {
        if (!densityPond) return;
        const count = (droppedItems.bambu ? 1 : 0) + (droppedItems.telur ? 1 : 0) + (droppedItems.koin ? 1 : 0);
        if (count === 3) {
            densityPond.classList.add('all-items');
            densityPond.classList.remove('has-items');
        } else if (count > 0) {
            densityPond.classList.add('has-items');
            densityPond.classList.remove('all-items');
        } else {
            densityPond.classList.remove('has-items', 'all-items');
        }
    }

    // 13.1 Drop Action Logic
    function handleDropItem(itemType) {
        if (itemType === 'bambu' && !droppedItems.bambu) {
            droppedItems.bambu = true;
            if (dragBambu) dragBambu.classList.add('hidden');
            if (pondBambu) {
                pondBambu.classList.remove('hidden');
                pondBambu.offsetHeight; // force reflow
                pondBambu.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showBambuDensityPopup();
            }, 450);
        } else if (itemType === 'telur' && !droppedItems.telur) {
            droppedItems.telur = true;
            if (dragTelur) dragTelur.classList.add('hidden');
            if (pondTelur) {
                pondTelur.classList.remove('hidden');
                pondTelur.offsetHeight;
                pondTelur.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showTelurDensityPopup();
            }, 450);
        } else if (itemType === 'koin' && !droppedItems.koin) {
            droppedItems.koin = true;
            if (dragKoin) dragKoin.classList.add('hidden');
            if (pondKoin) {
                pondKoin.classList.remove('hidden');
                pondKoin.offsetHeight;
                pondKoin.style.opacity = '1';
            }
            updatePondIndicatorState();
            setTimeout(() => {
                showKoinDensityPopup();
            }, 450);
        }
    }

    // 13.2 Return/Reset Dropped Items from Pond Back to Tray
    function returnItemFromPond(itemType) {
        if (itemType === 'bambu' && droppedItems.bambu) {
            droppedItems.bambu = false;
            if (pondBambu) {
                pondBambu.classList.add('hidden');
                pondBambu.style.opacity = '0';
            }
            if (dragBambu) {
                dragBambu.classList.remove('hidden', 'dragging-original');
                dragBambu.style.opacity = '1';
                dragBambu.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Bambu potong dikembalikan ke wadah!");
        } else if (itemType === 'telur' && droppedItems.telur) {
            droppedItems.telur = false;
            if (pondTelur) {
                pondTelur.classList.add('hidden');
                pondTelur.style.opacity = '0';
            }
            if (dragTelur) {
                dragTelur.classList.remove('hidden', 'dragging-original');
                dragTelur.style.opacity = '1';
                dragTelur.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Telur mentah dikembalikan ke wadah!");
        } else if (itemType === 'koin' && droppedItems.koin) {
            droppedItems.koin = false;
            if (pondKoin) {
                pondKoin.classList.add('hidden');
                pondKoin.style.opacity = '0';
            }
            if (dragKoin) {
                dragKoin.classList.remove('hidden', 'dragging-original');
                dragKoin.style.opacity = '1';
                dragKoin.style.transform = 'none';
            }
            updatePondIndicatorState();
            showMascotBubble("Koin logam dikembalikan ke wadah!");
        }
    }

    // Attach click and pointerup listeners to pond items so they can always be clicked to return
    [
        { el: pondBambu, type: 'bambu' },
        { el: pondTelur, type: 'telur' },
        { el: pondKoin, type: 'koin' }
    ].forEach(({ el, type }) => {
        if (el) {
            const handleReturn = (e) => {
                e.preventDefault();
                e.stopPropagation();
                returnItemFromPond(type);
            };
            el.addEventListener('click', handleReturn);
            el.addEventListener('pointerup', handleReturn);
        }
    });

    // 13.3 Universal Pointer Drag System (Seamless Touch on Mobile + Mouse on Desktop)
    const densityDragItems = [dragBambu, dragTelur, dragKoin];

    densityDragItems.forEach(item => {
        if (!item) return;

        let startX = 0, startY = 0;
        let isDragging = false;
        let ghostEl = null;
        let dragOffset = { x: 0, y: 0 };
        const itemType = item.getAttribute('data-item');

        const onPointerDown = (e) => {
            // Only primary button (left mouse) or touch
            if (e.button && e.button !== 0) return;
            if (droppedItems[itemType]) return;

            // Cleanup any ghost element
            document.querySelectorAll('.density-drag-ghost').forEach(g => g.remove());

            startX = e.clientX;
            startY = e.clientY;
            isDragging = false;
            ghostEl = null;

            const rect = item.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            window.addEventListener('pointermove', onPointerMove, { passive: false });
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        };

        const onPointerMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dist = Math.hypot(dx, dy);

            // Drag threshold (> 5px) to separate tap vs drag
            if (!isDragging && dist > 5) {
                isDragging = true;
                const rect = item.getBoundingClientRect();
                ghostEl = item.cloneNode(true);
                ghostEl.classList.add('density-drag-ghost');
                ghostEl.style.width = `${rect.width}px`;
                ghostEl.style.height = `${rect.height}px`;
                ghostEl.style.left = `${e.clientX - dragOffset.x}px`;
                ghostEl.style.top = `${e.clientY - dragOffset.y}px`;
                document.body.appendChild(ghostEl);

                item.classList.add('dragging-original');
            }

            if (isDragging && ghostEl) {
                if (e.cancelable) e.preventDefault();
                ghostEl.style.left = `${e.clientX - dragOffset.x}px`;
                ghostEl.style.top = `${e.clientY - dragOffset.y}px`;

                if (densityPond) {
                    const pondRect = densityPond.getBoundingClientRect();
                    const isOver = (
                        e.clientX >= pondRect.left &&
                        e.clientX <= pondRect.right &&
                        e.clientY >= pondRect.top &&
                        e.clientY <= pondRect.bottom
                    );
                    if (isOver) {
                        densityPond.classList.add('dragover');
                    } else {
                        densityPond.classList.remove('dragover');
                    }
                }
            }
        };

        const onPointerUp = (e) => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);

            if (densityPond) densityPond.classList.remove('dragover');

            if (!isDragging) {
                // Click fallback: direct tap to drop into pond
                if (!droppedItems[itemType]) {
                    handleDropItem(itemType);
                }
                return;
            }

            isDragging = false;

            // Check if dropped inside densityPond
            let droppedInside = false;
            if (densityPond) {
                const pondRect = densityPond.getBoundingClientRect();
                droppedInside = (
                    e.clientX >= pondRect.left &&
                    e.clientX <= pondRect.right &&
                    e.clientY >= pondRect.top &&
                    e.clientY <= pondRect.bottom
                );
            }

            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }

            item.classList.remove('dragging-original');

            if (droppedInside && !droppedItems[itemType]) {
                handleDropItem(itemType);
            }
        };

        item.addEventListener('pointerdown', onPointerDown);

        // Native HTML5 Drag fallback for desktop browsers
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', itemType);
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    // Native Dragover & Drop support on densityPond
    if (densityPond) {
        densityPond.addEventListener('dragover', (e) => {
            e.preventDefault();
            densityPond.classList.add('dragover');
        });
        densityPond.addEventListener('dragleave', () => {
            densityPond.classList.remove('dragover');
        });
        densityPond.addEventListener('drop', (e) => {
            e.preventDefault();
            densityPond.classList.remove('dragover');
            const itemType = e.dataTransfer.getData('text/plain');
            if (itemType) handleDropItem(itemType);
        });
    }

    function showBambuDensityPopup() {
        const content = `
            <div class="popup-zoom-density">
                <div class="zoom-graphic-box">
                    <img src="assets/images/level4/zoom-bambu.png" alt="Struktur Bambu Zoom">
                </div>
                <div class="zoom-details">
                    <h3>Bambu Mengapung</h3>
                    <p>Bambu memiliki struktur dengan banyak rongga udara di dalamnya, sehingga partikel penyusunnya tidak terlalu rapat. Syarat Fisika: &rho;<sub>benda</sub> &lt; &rho;<sub>cairan</sub> (0,8 g/cm³ &lt; 1,0 g/cm³).</p>
                    
                    <div class="formula-container" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #e0f2fe; padding: 0.5rem; border-radius: 8px; font-weight: 800; color: #0284c7; margin-top: 0.5rem;">
                        Rumus Massa Jenis: &rho; = m / V
                    </div>
                </div>
            </div>
        `;
        openMateriPopup(content);
    }

    function showTelurDensityPopup() {
        const content = `
            <div class="popup-zoom-density">
                <div class="zoom-graphic-box" style="display:flex; justify-content:center; align-items:center;">
                    <img src="assets/images/level4/telur-mentah.png" alt="Telur Melayang" style="max-height:100px; object-fit:contain;">
                </div>
                <div class="zoom-details">
                    <h3>Telur Melayang</h3>
                    <p>Penambahan garam Kusamba meningkatkan kerapatan partikel terlarut dalam air sehingga massa jenis air garam menjadi sama persis dengan massa jenis telur. Syarat Fisika: &rho;<sub>benda</sub> = &rho;<sub>cairan</sub> (1,0 g/cm³ = 1,0 g/cm³).</p>
                </div>
            </div>
        `;
        openMateriPopup(content);
    }

    function showKoinDensityPopup() {
        const content = `
            <div class="popup-zoom-density">
                <div class="zoom-graphic-box">
                    <img src="assets/images/level4/zoom-logam.png" alt="Struktur Logam Zoom">
                </div>
                <div class="zoom-details">
                    <h3>Koin Logam Tenggelam</h3>
                    <p>Koin logam tersusun atas partikel atom yang sangat amat rapat tanpa rongga udara, sehingga jumlah massa per satuan volumenya sangat besar. Syarat Fisika: &rho;<sub>benda</sub> &gt; &rho;<sub>cairan</sub> (7,8 g/cm³ &gt; 1,0 g/cm³).</p>
                </div>
            </div>
        `;
        openMateriPopup(content);
    }

    // 14. SLIDE 9 & 10 ACTION BUTTONS & RESET ENGINE
    const btnFinalHome = document.getElementById('btn-final-home');
    const btnFinalQuiz = document.getElementById('btn-final-quiz');

    if (btnFinalHome) {
        btnFinalHome.addEventListener('click', () => {
            showLevelCompleteModal(4);
        });
    }

    if (btnFinalQuiz) {
        btnFinalQuiz.addEventListener('click', () => {
            showLevelCompleteModal(4);
        });
    }

    // Reset simulator states when leaving the screen
    function resetMateriSlides() {
        clearAllVignettes();
        currentSlide = 1;
        currentSlideIndex = 0;

        const completeModal = document.getElementById('materi-level-complete-modal');
        if (completeModal) completeModal.classList.add('hidden');
        
        // Reset hotspots clicks
        clickedHotspots.bambu = false;
        clickedHotspots.tetesan = false;
        clickedHotspots.uap = false;
        
        // Reset Level 2.1
        if (typeof dalumanImgPadat !== 'undefined' && dalumanImgPadat) dalumanImgPadat.style.opacity = '1';
        if (typeof dalumanImgCair !== 'undefined' && dalumanImgCair) dalumanImgCair.style.opacity = '0';
        if (typeof dalumanTextDesc !== 'undefined' && dalumanTextDesc) dalumanTextDesc.innerHTML = 'Es Daluman dalam kondisi beku (padat). Pilih aksi "Panaskan Es" untuk melihat proses pelelehan zat!';

        // Reset Level 2.2 (Split View Arak Bali)
        const arakDefaultEl = document.getElementById('arak-img-default');
        const arakHeatingEl = document.getElementById('arak-img-heating');
        const arakCoolingEl = document.getElementById('arak-img-cooling');
        const btnDidihEl = document.getElementById('btn-didih-l22');
        const btnDinginEl = document.getElementById('btn-dingin-l22');
        const arakTextColEl = document.getElementById('arak-text-col') || document.getElementById('evap-text-l22');

        if (arakDefaultEl) arakDefaultEl.style.opacity = '1';
        if (arakHeatingEl) arakHeatingEl.style.opacity = '0';
        if (arakCoolingEl) arakCoolingEl.style.opacity = '0';
        if (btnDidihEl) btnDidihEl.classList.remove('active');
        if (btnDinginEl) btnDinginEl.classList.remove('active');
        if (arakTextColEl) {
            arakTextColEl.innerHTML = `
                <div class="arak-content-fade">
                    <div style="display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.72rem; padding: 2px 10px; border-radius: 12px; margin-bottom: 0.4rem;">
                        🏺 Etnosains Tradisi Bali
                    </div>
                    <h3 style="margin: 0 0 0.4rem 0; color: #0f172a; font-size: clamp(0.9rem, 2.2vh, 1.05rem); font-weight: 700;">
                        Penyulingan Arak Tradisional Bali
                    </h3>
                    <p style="margin: 0 0 0.6rem 0; color: #475569; font-size: clamp(0.72rem, 1.9vh, 0.82rem); line-height: 1.5;">
                        Masyarakat Bali secara turun-temurun memproduksi arak dari fermentasi tuak nira kelapa atau lontar melalui metode <strong>penyulingan (destilasi)</strong>. Proses tradisional ini menerapkan dua perubahan wujud zat sekaligus: <strong>menguap</strong> dan <strong>mengembun</strong>.
                    </p>
                    <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: clamp(0.7rem, 1.8vh, 0.8rem); color: #334155; line-height: 1.4;">
                        👉 <strong>Misi Penyelidikan:</strong><br>
                        Klik tombol <span style="color: #dc2626; font-weight: 700;">🔥 Didihkan Cairan</span> untuk mengamati proses pemanasan dan perubahan wujud cair ke gas (menguap).<br>
                        Klik tombol <span style="color: #2563eb; font-weight: 700;">❄️ Dinginkan Uap</span> untuk mengamati proses pendinginan dan perubahan wujud gas kembali menjadi cair (mengembun).
                    </div>
                </div>
            `;
        }

        // Reset Level 2.3
        if (typeof sublimKapur !== 'undefined' && sublimKapur) sublimKapur.style.opacity = '1';
        if (typeof sublimGas !== 'undefined' && sublimGas) {
            sublimGas.style.opacity = '0';
            sublimGas.style.transform = 'translateY(0)';
        }
        if (typeof sublimTextDesc !== 'undefined' && sublimTextDesc) sublimTextDesc.innerHTML = 'Tekan tombol "Panaskan Kapur Barus" untuk mengamati proses menyublim zat padat menjadi gas!';

        // Reset Level 2.4
        if (typeof saltSunSlider !== 'undefined' && saltSunSlider) {
            saltSunSlider.value = 0;
        }
        if (typeof saltWaterImg !== 'undefined' && saltWaterImg) saltWaterImg.style.opacity = '1';
        if (typeof saltCrystalsImg !== 'undefined' && saltCrystalsImg) saltCrystalsImg.style.opacity = '0';
        if (typeof saltSteamImg !== 'undefined' && saltSteamImg) saltSteamImg.style.opacity = '0';
        if (typeof saltTextDesc !== 'undefined' && saltTextDesc) saltTextDesc.innerHTML = 'Geser slider matahari ke kanan untuk menguapkan air laut dan membentuk endapan kristal garam tradisional.';

        // Reset Level 2.5
        if (typeof tempSlider !== 'undefined' && tempSlider) {
            tempSlider.value = 25;
            tempSlider.dispatchEvent(new Event('input'));
        }

        // Reset Level 3.1
        dupaGameCompleted = false;
        if (typeof dupaFresh !== 'undefined' && dupaFresh) dupaFresh.style.opacity = '1';
        if (typeof dupaBurnt !== 'undefined' && dupaBurnt) dupaBurnt.style.opacity = '0';
        if (typeof dupaSmoke !== 'undefined' && dupaSmoke) {
            dupaSmoke.style.opacity = '0';
            dupaSmoke.classList.remove('smoking');
        }
        if (typeof dupaToggleBtn !== 'undefined' && dupaToggleBtn) {
            dupaToggleBtn.textContent = '🔥 Nyalakan Dupa';
            dupaToggleBtn.style.background = '';
        }
        if (typeof dupaPlaceholder !== 'undefined' && dupaPlaceholder) dupaPlaceholder.style.display = 'flex';
        if (typeof dupaFlipContainer !== 'undefined' && dupaFlipContainer) dupaFlipContainer.style.display = 'none';
        if (typeof cardFisika !== 'undefined' && cardFisika) cardFisika.classList.remove('flipped');
        if (typeof cardKimia !== 'undefined' && cardKimia) cardKimia.classList.remove('flipped');

        // Reset Level 4.1
        droppedItems.bambu = false;
        droppedItems.telur = false;
        droppedItems.koin = false;
        if (typeof dragBambu !== 'undefined' && dragBambu) {
            dragBambu.classList.remove('hidden', 'dragging-original');
            dragBambu.style.opacity = '1';
            dragBambu.style.transform = 'none';
        }
        if (typeof dragTelur !== 'undefined' && dragTelur) {
            dragTelur.classList.remove('hidden', 'dragging-original');
            dragTelur.style.opacity = '1';
            dragTelur.style.transform = 'none';
        }
        if (typeof dragKoin !== 'undefined' && dragKoin) {
            dragKoin.classList.remove('hidden', 'dragging-original');
            dragKoin.style.opacity = '1';
            dragKoin.style.transform = 'none';
        }
        if (typeof pondBambu !== 'undefined' && pondBambu) {
            pondBambu.classList.add('hidden');
            pondBambu.style.opacity = '0';
        }
        if (typeof pondTelur !== 'undefined' && pondTelur) {
            pondTelur.classList.add('hidden');
            pondTelur.style.opacity = '0';
        }
        if (typeof pondKoin !== 'undefined' && pondKoin) {
            pondKoin.classList.add('hidden');
            pondKoin.style.opacity = '0';
        }
        if (typeof updatePondIndicatorState === 'function') {
            updatePondIndicatorState();
        }
    }

    // Initialize Level Map view
    showLevelMap();
});
