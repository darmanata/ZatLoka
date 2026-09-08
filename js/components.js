/* ==========================================================================
   ZATLOKA COMPONENT & MODAL MANAGER
   Mengatur logika pop-up dialog (Bantuan & Profil) serta penyimpanan profil siswa.
   ========================================================================== */

class ComponentManager {
    constructor(appState) {
        this.state = appState;
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
            saveProfile: document.getElementById('save-profile-btn')
        };
        
        // Input fields
        this.inputs = {
            studentName: document.getElementById('student-name-input')
        };

        // Profile UI Display Elements (modal & widget)
        this.display = {
            widgetName: document.getElementById('widget-name'),
            widgetRank: document.getElementById('widget-rank'),
            widgetExp: document.getElementById('widget-exp'),
            modalRank: document.getElementById('profile-rank-val'),
            modalExp: document.getElementById('profile-exp-val')
        };
    }

    bindEvents() {
        // Open Help Modal
        if (this.buttons.helpOpen) {
            this.buttons.helpOpen.addEventListener('click', () => this.openModal('help'));
        }

        // Open Profile Modal
        if (this.buttons.profileOpen) {
            this.buttons.profileOpen.addEventListener('click', () => {
                // Set input value to current name before opening
                if (this.inputs.studentName) {
                    this.inputs.studentName.value = this.state.profile.name;
                }
                this.openModal('profile');
            });
        }

        // Close buttons (all elements with close-modal-btn)
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                this.closeModalById(modalId);
            });
        });

        // Close on overlay click
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal);
                    }
                });
            }
        });

        // Save Profile button
        if (this.buttons.saveProfile) {
            this.buttons.saveProfile.addEventListener('click', () => this.handleSaveProfile());
        }

        // Print Report button in Profile modal
        const profilePrintBtn = document.getElementById('profile-print-btn');
        if (profilePrintBtn) {
            profilePrintBtn.addEventListener('click', () => {
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
    openModal(type) {
        const modal = this.modals[type];
        if (modal) {
            modal.style.display = 'flex';
            // Force redraw/reflow for smooth scale transition
            modal.offsetHeight;
            modal.classList.add('active');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            // Wait for transition before hiding display
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

    // Save profile logic with Developer Cheat Codes support
    handleSaveProfile() {
        const inputName = this.inputs.studentName.value.trim();
        
        if (!inputName) {
            alert('Nama tidak boleh kosong!');
            return;
        }

        // --- KODE CHEAT DEVELOPER ---
        if (inputName === 'DEV-UNLOCK') {
            if (window.ZatlokaProgression) {
                window.ZatlokaProgression.devUnlockAll();
            }
            this.state.profile.name = 'Developer Master';
            this.state.profile.rank = 'Master Sains';
            localStorage.setItem('zatloka_profile_name', 'Developer Master');
            this.updateProfileUI();
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
            localStorage.setItem('zatloka_profile_name', 'Siswa Baru');
            this.updateProfileUI();
            this.closeModal(this.modals.profile);
            alert("🔄 Kode Cheat 'DEV-RESET' Berhasil!\n\nSeluruh progres telah direset ke status awal. Level 2-4 terkunci dan Gelar kembali menjadi Calon Ilmuwan.");
            return;
        }

        // Update state normal
        this.state.profile.name = inputName;
        
        // Save to localStorage
        localStorage.setItem('zatloka_profile_name', inputName);
        
        // Update UI
        this.updateProfileUI();
        
        // Close modal
        this.closeModal(this.modals.profile);
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

    // Sync state into UI elements
    updateProfileUI() {
        const profile = this.state.profile;
        
        // Calculate rank dynamically based on progression
        const calculatedRank = this.getRank(profile.exp || 0);
        profile.rank = calculatedRank;
        localStorage.setItem('zatloka_profile_rank', calculatedRank);

        const currentExp = parseInt(localStorage.getItem('zatloka_profile_exp')) || profile.exp || 0;
        profile.exp = currentExp;

        if (this.display.widgetName) this.display.widgetName.textContent = profile.name;
        if (this.display.widgetRank) this.display.widgetRank.textContent = calculatedRank;
        if (this.display.widgetExp) this.display.widgetExp.textContent = `✨ ${currentExp} EXP`;
        
        if (this.display.modalRank) this.display.modalRank.textContent = calculatedRank;
        if (this.display.modalExp) this.display.modalExp.textContent = `${currentExp} EXP`;
    }
}

window.ComponentManager = ComponentManager;

