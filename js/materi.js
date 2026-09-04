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
                btn.setAttribute('disabled', 'true');
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
    const evapTetesanL22 = document.getElementById('evap-tetesan-l22');
    const evapUapL22 = document.getElementById('evap-uap-l22');
    const evapTextL22 = document.getElementById('evap-text-l22');
    const vignetteOverlayL22 = document.getElementById('vignette-overlay-l22');
    const screenVignetteGlobal = document.getElementById('screen-vignette-global');

    if (btnDidihL22 && btnDinginL22) {
        btnDidihL22.addEventListener('click', () => {
            if (evapUapL22) evapUapL22.style.opacity = '0.85';
            if (evapTetesanL22) evapTetesanL22.style.opacity = '0';
            if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay vignette-red';
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-red';
            
            if (evapTextL22) {
                evapTextL22.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #dc2626; font-size: 0.95rem; font-weight: 700;">Menguap & Mendidih (Cair → Gas)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Menguap:</strong> Perubahan wujud zat dari cair menjadi uap (gas) yang terjadi di permukaan zat cair dan dapat terjadi di bawah titik didih (contoh: pakaian basah yang dijemur lama-kelamaan menjadi kering).</li>
                            <li><strong>Mendidih:</strong> Perubahan wujud cair menjadi gas yang terjadi di seluruh bagian zat cair pada titik didihnya (ditandai dengan munculnya gelembung-gelembung air yang naik ke permukaan).</li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Cairan arak di panci menyerap panas dan menguap!");
        });

        btnDinginL22.addEventListener('click', () => {
            if (evapTetesanL22) evapTetesanL22.style.opacity = '1';
            if (evapUapL22) evapUapL22.style.opacity = '0';
            if (vignetteOverlayL22) vignetteOverlayL22.className = 'vignette-overlay vignette-blue';
            if (screenVignetteGlobal) screenVignetteGlobal.className = 'screen-vignette-overlay vignette-blue';
            
            if (evapTextL22) {
                evapTextL22.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <h4 style="margin: 0; color: #2563eb; font-size: 0.95rem; font-weight: 700;">Mengembun / Kondensasi (Gas → Cair)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.3rem;">
                            <li><strong>Pengertian:</strong> Perubahan wujud zat dari gas menjadi cair (kebalikan dari proses menguap).</li>
                            <li><strong>Penyebab:</strong> Gas kehilangan energi panas karena panasnya berpindah ke udara di sekitarnya.</li>
                            <li><strong>Mekanisme:</strong> Akibat kehilangan energi panas tersebut, partikel-partikel gas merapat kembali dan berubah wujud menjadi tetesan zat cair.</li>
                        </ul>
                    </div>
                `;
            }
            showMascotBubble("Uap gas mendingin di bambu dan mengembun!");
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

    // 13. LEVEL 4.1: DENSITY DRAG AND DROP (WITH CLICK FALLBACK)
    const dragBambu = document.getElementById('density-drag-bambu');
    const dragTelur = document.getElementById('density-drag-telur');
    const dragKoin = document.getElementById('density-drag-koin');
    const densityPond = document.getElementById('density-pond');
    const pondBambu = document.getElementById('pond-floater-bambu');
    const pondTelur = document.getElementById('pond-floater-telur');
    const pondKoin = document.getElementById('pond-sinker-koin');

    // 13.1 Drag Events
    const dragItems = [dragBambu, dragTelur, dragKoin];
    dragItems.forEach(item => {
        if (item) {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-item'));
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        }
    });

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
            handleDropItem(itemType);
        });
    }

    // 13.2 Click Fallback
    if (dragBambu) {
        dragBambu.addEventListener('click', () => {
            if (!droppedItems.bambu) handleDropItem('bambu');
        });
    }
    if (dragTelur) {
        dragTelur.addEventListener('click', () => {
            if (!droppedItems.telur) handleDropItem('telur');
        });
    }
    if (dragKoin) {
        dragKoin.addEventListener('click', () => {
            if (!droppedItems.koin) handleDropItem('koin');
        });
    }

    // 13.3 Drop Action Logic
    function handleDropItem(itemType) {
        if (itemType === 'bambu' && !droppedItems.bambu) {
            droppedItems.bambu = true;
            if (dragBambu) dragBambu.classList.add('hidden');
            if (pondBambu) {
                pondBambu.classList.remove('hidden');
                pondBambu.offsetHeight; // reflow
                pondBambu.style.opacity = '1';
            }
            setTimeout(() => {
                showBambuDensityPopup();
            }, 600);
        } else if (itemType === 'telur' && !droppedItems.telur) {
            droppedItems.telur = true;
            if (dragTelur) dragTelur.classList.add('hidden');
            if (pondTelur) {
                pondTelur.classList.remove('hidden');
                pondTelur.offsetHeight;
                pondTelur.style.opacity = '1';
            }
            setTimeout(() => {
                showTelurDensityPopup();
            }, 600);
        } else if (itemType === 'koin' && !droppedItems.koin) {
            droppedItems.koin = true;
            if (dragKoin) dragKoin.classList.add('hidden');
            if (pondKoin) {
                pondKoin.classList.remove('hidden');
                pondKoin.offsetHeight;
                pondKoin.style.opacity = '1';
            }
            setTimeout(() => {
                showKoinDensityPopup();
            }, 600);
        }
    }

    // 13.4 Click to Return/Reset dropped items
    if (pondBambu) {
        pondBambu.addEventListener('click', () => {
            pondBambu.classList.add('hidden');
            pondBambu.style.opacity = '0';
            if (dragBambu) dragBambu.classList.remove('hidden');
            droppedItems.bambu = false;
            showMascotBubble("Bambu dikembalikan ke keranjang!");
        });
    }
    if (pondTelur) {
        pondTelur.addEventListener('click', () => {
            pondTelur.classList.add('hidden');
            pondTelur.style.opacity = '0';
            if (dragTelur) dragTelur.classList.remove('hidden');
            droppedItems.telur = false;
            showMascotBubble("Telur dikembalikan ke keranjang!");
        });
    }
    if (pondKoin) {
        pondKoin.addEventListener('click', () => {
            pondKoin.classList.add('hidden');
            pondKoin.style.opacity = '0';
            if (dragKoin) dragKoin.classList.remove('hidden');
            droppedItems.koin = false;
            showMascotBubble("Koin logam dikembalikan ke keranjang!");
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
        if (dalumanImgPadat) dalumanImgPadat.style.opacity = '1';
        if (dalumanImgCair) dalumanImgCair.style.opacity = '0';
        if (dalumanTextDesc) dalumanTextDesc.innerHTML = 'Es Daluman dalam kondisi beku (padat). Pilih aksi "Panaskan Es" untuk melihat proses pelelehan zat!';

        // Reset Level 2.2
        if (evapTetesanL22) evapTetesanL22.style.opacity = '0';
        if (evapUapL22) evapUapL22.style.opacity = '0';
        if (evapTextL22) evapTextL22.innerHTML = 'Pilih aksi di atas untuk memulai penyelidikan proses penguapan dan pengembunan pada penyulingan arak Bali!';

        // Reset Level 2.3
        if (sublimKapur) sublimKapur.style.opacity = '1';
        if (sublimGas) {
            sublimGas.style.opacity = '0';
            sublimGas.style.transform = 'translateY(0)';
        }
        if (sublimTextDesc) sublimTextDesc.innerHTML = 'Tekan tombol "Panaskan Kapur Barus" untuk mengamati proses menyublim zat padat menjadi gas!';

        // Reset Level 2.4
        if (saltSunSlider) {
            saltSunSlider.value = 0;
        }
        if (saltWaterImg) saltWaterImg.style.opacity = '1';
        if (saltCrystalsImg) saltCrystalsImg.style.opacity = '0';
        if (saltSteamImg) saltSteamImg.style.opacity = '0';
        if (saltTextDesc) saltTextDesc.innerHTML = 'Geser slider matahari ke kanan untuk menguapkan air laut dan membentuk endapan kristal garam tradisional.';

        // Reset Level 2.5
        if (tempSlider) {
            tempSlider.value = 25;
            tempSlider.dispatchEvent(new Event('input'));
        }

        // Reset Level 3.1
        dupaGameCompleted = false;
        if (dupaFresh) dupaFresh.style.opacity = '1';
        if (dupaBurnt) dupaBurnt.style.opacity = '0';
        if (dupaSmoke) {
            dupaSmoke.style.opacity = '0';
            dupaSmoke.classList.remove('smoking');
        }
        if (dupaToggleBtn) {
            dupaToggleBtn.textContent = '🔥 Nyalakan Dupa';
            dupaToggleBtn.style.background = '';
        }
        if (dupaPlaceholder) dupaPlaceholder.style.display = 'flex';
        if (dupaFlipContainer) dupaFlipContainer.style.display = 'none';
        if (cardFisika) cardFisika.classList.remove('flipped');
        if (cardKimia) cardKimia.classList.remove('flipped');

        // Reset Level 4.1
        droppedItems.bambu = false;
        droppedItems.telur = false;
        droppedItems.koin = false;
        if (dragBambu) dragBambu.classList.remove('hidden');
        if (dragTelur) dragTelur.classList.remove('hidden');
        if (dragKoin) dragKoin.classList.remove('hidden');
        if (pondBambu) {
            pondBambu.classList.add('hidden');
            pondBambu.style.opacity = '0';
        }
        if (pondTelur) {
            pondTelur.classList.add('hidden');
            pondTelur.style.opacity = '0';
        }
        if (pondKoin) {
            pondKoin.classList.add('hidden');
            pondKoin.style.opacity = '0';
        }
    }

    // Initialize Level Map view
    showLevelMap();
});
