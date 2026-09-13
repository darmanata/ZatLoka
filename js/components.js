/* ==========================================================================
   ZATLOKA COMPONENT & MODAL MANAGER
   Mengatur logika dialog (Bantuan & Profil), Unggah & Kompresi Foto Profil,
   First-Time Onboarding, serta sinkronisasi state profil siswa di localStorage.
   ========================================================================== */

// Helper untuk menghasilkan Data URL Base64 Avatar Siluet Default (JPEG Kompresi Ringan)
function getDefaultAvatarBase64() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'assets/images/logo-undiksha.webp';

        // Background gradient melingkar (Cyan/Blue Theme ZatLoka)
        const grad = ctx.createLinearGradient(0, 0, 160, 160);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#0369a1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(80, 80, 80, 0, Math.PI * 2);
        ctx.fill();

        // Lingkaran border halus putih
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Kepala siluet putih
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(80, 60, 26, 0, Math.PI * 2);
        ctx.fill();

        // Bahu & badan siluet putih
        ctx.beginPath();
        ctx.ellipse(80, 130, 48, 36, 0, Math.PI, 0, true);
        ctx.fill();

        return canvas.toDataURL('image/jpeg', 0.75);
    } catch (e) {
        console.warn('Fallback canvas avatar gagal:', e);
        return 'assets/images/logo-undiksha.webp';
    }
}

// Helper untuk kompresi file gambar menggunakan HTML5 Canvas
// CRITICAL RULE: Batas max-dimension 300px & JPEG 0.7 agar hemat localStorage
function compressImageFile(file, maxDimension = 300, quality = 0.7) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('File tidak ditemukan'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Pertahankan aspect ratio dengan batas maxDimension
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                // Gambar ulang pada HTML5 Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Gagal mendapatkan 2D context canvas'));
                    return;
                }

                // Latar belakang putih jika gambar memiliki transparansi PNG
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Ekspor ke JPEG kualitas sedang (0.7)
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = (err) => reject(err);
            img.src = event.target.result;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

class ComponentManager {
    constructor(appState) {
        this.state = appState;
        this.tempCompressedPhoto = null;
        this.isOnboarding = false;
        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        // Modal elements
        this.modals = {
            help: document.getElementById('help-modal'),
            profile: document.getElementById('profile-modal')
        };
        
        // Buttons
        this.buttons = {
            helpOpen: document.getElementById('help-btn'),
            profileOpen: document.getElementById('profile-widget'),
            saveProfile: document.getElementById('save-profile-btn'),
            uploadPhoto: document.getElementById('btn-upload-photo'),
            avatarUploadBox: document.getElementById('avatar-upload-box'),
            profilePrintBtn: document.getElementById('profile-print-btn'),
            modalCloseBtn: document.getElementById('profile-modal-close-btn'),
            cancelBtn: document.getElementById('profile-cancel-btn')
        };
        
        // Input fields
        this.inputs = {
            studentName: document.getElementById('student-name-input'),
            photoFile: document.getElementById('profile-photo-input')
        };

        // Profile UI Display Elements (modal & widget)
        this.display = {
            widgetName: document.getElementById('widget-name'),
            widgetRank: document.getElementById('widget-rank'),
            widgetExp: document.getElementById('widget-exp'),
            widgetAvatar: document.getElementById('widget-avatar'),
            modalRank: document.getElementById('profile-rank-val'),
            modalExp: document.getElementById('profile-exp-val'),
            modalTitle: document.getElementById('profile-modal-title'),
            avatarLarge: document.getElementById('profile-avatar-large'),
            avatarHint: document.getElementById('avatar-photo-hint'),
            onboardingBanner: document.getElementById('onboarding-welcome-banner'),
            statsDisplay: document.getElementById('profile-stats-display')
        };
    }

    bindEvents() {
        // Open Help Modal
        if (this.buttons.helpOpen) {
            this.buttons.helpOpen.addEventListener('click', () => this.openModal('help'));
        }

        // Open Profile Modal via Capsule Widget (Langsung klik profil kapsul)
        if (this.buttons.profileOpen) {
            this.buttons.profileOpen.addEventListener('click', () => {
                this.openModal('profile', { isOnboarding: false });
            });
        }

        // Close buttons (all elements with close-modal-btn)
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Jangan izinkan tutup jika dalam mode onboarding (wajib isi)
                if (this.isOnboarding && btn.getAttribute('data-modal') === 'profile-modal') {
                    return;
                }
                const modalId = btn.getAttribute('data-modal');
                this.closeModalById(modalId);
            });
        });

        // Close on overlay click (hanya jika bukan onboarding)
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (this.isOnboarding && modal === this.modals.profile) {
                            return; // cegah tutup saat onboarding
                        }
                        this.closeModal(modal);
                    }
                });
            }
        });

        // Trigger Upload Photo saat tombol atau kotak avatar diklik
        const triggerPhotoUpload = () => {
            if (this.inputs.photoFile) {
                this.inputs.photoFile.click();
            }
        };

        if (this.buttons.uploadPhoto) {
            this.buttons.uploadPhoto.addEventListener('click', triggerPhotoUpload);
        }
        if (this.buttons.avatarUploadBox) {
            this.buttons.avatarUploadBox.addEventListener('click', triggerPhotoUpload);
        }

        // Event listener saat file foto dipilih
        if (this.inputs.photoFile) {
            this.inputs.photoFile.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
                    return;
                }

                if (this.display.avatarHint) {
                    this.display.avatarHint.textContent = '⏳ Mengompresi foto...';
                    this.display.avatarHint.style.color = '#0284c7';
                }

                try {
                    // Jalankan kompresi HTML5 Canvas (max 300px, quality 0.7)
                    const compressedBase64 = await compressImageFile(file, 300, 0.7);
                    this.tempCompressedPhoto = compressedBase64;

                    // Preview langsung ke UI modal profil
                    if (this.display.avatarLarge) {
                        this.display.avatarLarge.src = compressedBase64;
                    }

                    if (this.display.avatarHint) {
                        this.display.avatarHint.textContent = '✅ Foto berhasil diunggah & dikompresi!';
                        this.display.avatarHint.style.color = '#059669';
                    }
                } catch (err) {
                    console.error('Kompresi gambar gagal:', err);
                    alert('Gagal memproses gambar. Silakan coba gambar lain.');
                    if (this.display.avatarHint) {
                        this.display.avatarHint.textContent = '❌ Gagal memproses gambar.';
                        this.display.avatarHint.style.color = '#e11d48';
                    }
                }
            });
        }

        // Save Profile button
        if (this.buttons.saveProfile) {
            this.buttons.saveProfile.addEventListener('click', () => this.handleSaveProfile());
        }

        // Print Report button in Profile modal
        if (this.buttons.profilePrintBtn) {
            this.buttons.profilePrintBtn.addEventListener('click', () => {
                if (window.ZatlokaKuis) {
                    window.ZatlokaKuis.printReport();
                }
            });
        }
        
        // Form submit on enter
        if (this.inputs.studentName) {
            this.inputs.studentName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSaveProfile();
                }
            });
        }
    }

    // Modal Actions
    openModal(type, options = {}) {
        const modal = this.modals[type];
        if (!modal) return;

        if (type === 'profile') {
            this.isOnboarding = !!options.isOnboarding;
            this.tempCompressedPhoto = null; // Reset foto sementara

            const currentName = localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || '';
            const currentPhoto = localStorage.getItem('studentPhoto') || getDefaultAvatarBase64();

            // Set foto preview
            if (this.display.avatarLarge) {
                this.display.avatarLarge.src = currentPhoto;
            }

            // Reset teks hint foto
            if (this.display.avatarHint) {
                this.display.avatarHint.textContent = 'Dari Galeri atau Kamera HP';
                this.display.avatarHint.style.color = '#64748b';
            }

            if (this.isOnboarding) {
                // Tampilan khusus First-Time Onboarding
                if (this.display.onboardingBanner) this.display.onboardingBanner.style.display = 'flex';
                if (this.buttons.modalCloseBtn) this.buttons.modalCloseBtn.style.display = 'none';
                if (this.buttons.cancelBtn) this.buttons.cancelBtn.style.display = 'none';
                if (this.buttons.profilePrintBtn) this.buttons.profilePrintBtn.style.display = 'none';
                if (this.display.statsDisplay) this.display.statsDisplay.style.display = 'none';
                if (this.display.modalTitle) this.display.modalTitle.textContent = 'Daftar Detektif Sains Baru';
                if (this.buttons.saveProfile) this.buttons.saveProfile.textContent = 'Mulai Petualangan 🚀';

                if (this.inputs.studentName) {
                    this.inputs.studentName.value = '';
                    setTimeout(() => this.inputs.studentName.focus(), 300);
                }
            } else {
                // Tampilan Edit Profil Normal
                if (this.display.onboardingBanner) this.display.onboardingBanner.style.display = 'none';
                if (this.buttons.modalCloseBtn) this.buttons.modalCloseBtn.style.display = 'block';
                if (this.buttons.cancelBtn) this.buttons.cancelBtn.style.display = 'inline-block';
                if (this.buttons.profilePrintBtn) this.buttons.profilePrintBtn.style.display = 'inline-block';
                if (this.display.statsDisplay) this.display.statsDisplay.style.display = 'flex';
                if (this.display.modalTitle) this.display.modalTitle.textContent = 'Profil Detektif Zat';
                if (this.buttons.saveProfile) this.buttons.saveProfile.textContent = 'Simpan';

                if (this.inputs.studentName) {
                    this.inputs.studentName.value = currentName && currentName !== 'Siswa Baru' ? currentName : '';
                }
            }
        }

        modal.style.display = 'flex';
        // Force redraw/reflow for smooth scale transition
        modal.offsetHeight;
        modal.classList.add('active');
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modal.style.display = 'none';
                }
            }, 300);
        }
    }

    closeModalById(modalId) {
        const modal = document.getElementById(modalId);
        this.closeModal(modal);
    }

    // Save profile logic with Developer Cheat Codes & Base64 Compression Support
    handleSaveProfile() {
        const inputName = this.inputs.studentName ? this.inputs.studentName.value.trim() : '';
        
        if (!inputName) {
            alert('Nama lengkap wajib diisi untuk melanjutkan!');
            if (this.inputs.studentName) this.inputs.studentName.focus();
            return;
        }

        // --- KODE CHEAT DEVELOPER ---
        if (inputName === 'DEV-UNLOCK') {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.devUnlockAll();
            }
            this.state.profile.name = 'Developer Master';
            this.state.profile.rank = 'Master Sains';
            localStorage.setItem('studentName', 'Developer Master');
            localStorage.setItem('zatloka_profile_name', 'Developer Master');
            this.updateProfileUI();
            this.isOnboarding = false;
            this.closeModal(this.modals.profile);
            alert("🔓 Kode Cheat 'DEV-UNLOCK' Berhasil!\n\nSeluruh Level Materi 1-4, Kuis 1-4, dan Gelar Master Sains berhasil dibuka sepenuhnya!");
            return;
        }

        if (inputName === 'DEV-RESET') {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.devResetAll();
            }
            this.state.profile.name = 'Siswa Baru';
            this.state.profile.rank = 'Calon Ilmuwan';
            localStorage.removeItem('studentName');
            localStorage.setItem('zatloka_profile_name', 'Siswa Baru');
            localStorage.removeItem('studentPhoto');
            this.updateProfileUI();
            this.isOnboarding = false;
            this.closeModal(this.modals.profile);
            alert("🔄 Kode Cheat 'DEV-RESET' Berhasil!\n\nSeluruh progres telah direset ke status awal.");
            return;
        }

        // Tentukan foto profil yang akan disimpan (Foto baru terkompresi / Foto lama / Fallback Siluet)
        let finalPhoto = this.tempCompressedPhoto || localStorage.getItem('studentPhoto');
        if (!finalPhoto) {
            finalPhoto = getDefaultAvatarBase64();
        }

        // Update state internal
        this.state.profile.name = inputName;
        this.state.profile.photo = finalPhoto;
        
        // Simpan ke localStorage sesuai spesifikasi PRD
        localStorage.setItem('studentName', inputName);
        localStorage.setItem('zatloka_profile_name', inputName); // kompatibilitas modul kuis/laporan
        localStorage.setItem('studentPhoto', finalPhoto);
        
        // Update seluruh UI (Header, Kapsul Profil, dsb.)
        this.updateProfileUI();
        
        const wasOnboarding = this.isOnboarding;
        this.isOnboarding = false;

        // Tutup modal profil
        this.closeModal(this.modals.profile);

        // Langsung arahkan ke halaman Menu Utama (Home Screen)
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
            homeScreen.classList.add('active');
            this.state.currentScreen = 'home';
        }

        // Jika ini adalah onboarding pertama, putar musik pembuka BGM jika belum berputar
        if (wasOnboarding) {
            const bgmPlayer = document.getElementById('bgm-player');
            if (bgmPlayer && !this.state.audio.muted) {
                bgmPlayer.play().catch(e => console.log('BGM Play after onboarding: ', e));
            }
        }
    }

    // Helper to calculate rank based on Passed Quizzes
    getRank(exp) {
        if (window.ZatlokaProgression) {
            const data = window.ZatlokaProgression.get();
            if (data.passedKuis.includes(4)) return 'Master Sains';
            if (data.passedKuis.includes(3)) return 'Ilmuwan Muda';
            if (data.passedKuis.includes(2)) return 'Penjelajah Materi';
            if (data.passedKuis.includes(1)) return 'Detektif Pemula';
            return 'Calon Ilmuwan';
        }
        return localStorage.getItem('zatloka_profile_rank') || 'Calon Ilmuwan';
    }

    // Sync state into UI elements (Header capsule, modal, widgets)
    updateProfileUI() {
        const profile = this.state.profile;
        
        // Ambil nama dari localStorage (studentName atau zatloka_profile_name)
        const studentName = localStorage.getItem('studentName') || localStorage.getItem('zatloka_profile_name') || profile.name || 'Siswa Baru';
        profile.name = studentName;

        // Ambil foto dari localStorage (studentPhoto atau fallback siluet)
        const studentPhoto = localStorage.getItem('studentPhoto') || profile.photo || getDefaultAvatarBase64();
        profile.photo = studentPhoto;

        // Calculate rank dynamically based on progression
        const calculatedRank = this.getRank(profile.exp || 0);
        profile.rank = calculatedRank;
        localStorage.setItem('zatloka_profile_rank', calculatedRank);

        const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || profile.exp || 0;
        profile.exp = currentExp;

        // Render teks nama & status di widget kapsul
        if (this.display.widgetName) this.display.widgetName.textContent = studentName;
        if (this.display.widgetRank) this.display.widgetRank.textContent = calculatedRank;
        if (this.display.widgetExp) this.display.widgetExp.textContent = `✨ ${currentExp} EXP`;
        
        // Render foto di widget header Menu Utama
        if (this.display.widgetAvatar) {
            this.display.widgetAvatar.src = studentPhoto;
        }

        // Render foto di modal profil
        if (this.display.avatarLarge) {
            this.display.avatarLarge.src = studentPhoto;
        }

        // Render data di modal
        if (this.display.modalRank) this.display.modalRank.textContent = calculatedRank;
        if (this.display.modalExp) this.display.modalExp.textContent = `${currentExp} EXP`;
    }
}

window.ComponentManager = ComponentManager;
window.getDefaultAvatarBase64 = getDefaultAvatarBase64;
window.compressImageFile = compressImageFile;


