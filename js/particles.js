/* ==========================================================================
   ZATLOKA CANVAS PARTICLES ENGINE
   Membuat animasi partikel melayang:
   1. Partikel Padat (Solid): Bergerombol rapat di tengah & bergetar/melayang perlahan.
   2. Partikel Gas (Gas): Bergerak bebas menyebar di seluruh layar.
   ========================================================================== */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.animationFrameId = null;
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.particles = [];
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2 - 30; // Sedikit di atas pusat untuk melingkari judul

        // 1. Inisialisasi Partikel Padat (Solid) - Bergerombol di tengah
        const solidCount = 28;
        const solidRadiusMax = 70; // Jari-jari gerombolan
        for (let i = 0; i < solidCount; i++) {
            // Posisi acak di dalam lingkaran gerombolan
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * solidRadiusMax;
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            
            this.particles.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                type: 'solid',
                size: Math.random() * 3 + 3, // Lebih besar
                baseSize: 0,
                color: 'rgba(0, 210, 255, 0.75)', // Biru terang
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                angle: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatRange: Math.random() * 5 + 3
            });
        }

        // 2. Inisialisasi Partikel Gas - Menyebar bebas
        const gasCount = 35;
        for (let i = 0; i < gasCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                type: 'gas',
                size: Math.random() * 1.5 + 1.5,
                color: 'rgba(128, 232, 255, 0.4)', // Biru tipis menyebar
                speedX: (Math.random() - 0.5) * 1.2,
                speedY: (Math.random() - 0.5) * 1.2,
                wobbleSpeed: Math.random() * 0.05,
                wobbleRange: Math.random() * 2
            });
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.init(); // Rekonstruksi posisi agar sesuai dimensi baru
        });

        // Interaksi mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Dukungan Sentuhan (Mobile)
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });

        window.addEventListener('touchend', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2 - 30;

        // Gambar koneksi antar partikel padat (solid molecular bonds)
        this.ctx.beginPath();
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].type !== 'solid') continue;
            for (let j = i + 1; j < this.particles.length; j++) {
                if (this.particles[j].type !== 'solid') continue;
                
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 55) {
                    this.ctx.strokeStyle = `rgba(0, 210, 255, ${0.18 - (distance / 55) * 0.18})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Update dan gambar partikel
        this.particles.forEach(p => {
            if (p.type === 'solid') {
                // Perilaku Partikel Padat: Melayang melingkar lembut di sekitar posisi asal
                p.angle += p.floatSpeed;
                const targetX = p.originX + Math.cos(p.angle) * p.floatRange;
                const targetY = p.originY + Math.sin(p.angle) * p.floatRange;
                
                // Lerp menuju target
                p.x += (targetX - p.x) * 0.1;
                p.y += (targetY - p.y) * 0.1;

                // Interaksi mouse (efek elastis jika didekati cursor)
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = p.x - this.mouse.x;
                    const dy = p.y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.mouse.radius) {
                        const force = (this.mouse.radius - dist) / this.mouse.radius;
                        // Dorongan menjauh lembut
                        p.x += (dx / dist) * force * 15;
                        p.y += (dy / dist) * force * 15;
                    }
                }
            } else {
                // Perilaku Partikel Gas: Bergerak bebas menyebar
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Sedikit getaran acak
                p.x += (Math.random() - 0.5) * 0.2;
                p.y += (Math.random() - 0.5) * 0.2;

                // Pantulan di batas layar
                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;

                // Interaksi mouse: Repulsif kuat untuk gas
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = p.x - this.mouse.x;
                    const dy = p.y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.mouse.radius) {
                        const force = (this.mouse.radius - dist) / this.mouse.radius;
                        p.x += (dx / dist) * force * 4;
                        p.y += (dy / dist) * force * 4;
                    }
                }
            }

            // Gambar Cahaya Pijar Partikel
            this.ctx.shadowBlur = p.type === 'solid' ? 8 : 2;
            this.ctx.shadowColor = 'rgba(0, 210, 255, 0.5)';
            
            // Gambar Partikel
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Reset shadow
        this.ctx.shadowBlur = 0;

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Global hook agar bisa diinisialisasi dari app.js
window.ParticleSystem = ParticleSystem;
