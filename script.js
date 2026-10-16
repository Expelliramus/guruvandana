/* =========================================================
   TablaGyan – GuruVandan 2026
   Human-crafted interactions & micro-animations
   ========================================================= */

// ---------- 1. FIXED EVENT DATE (12 Dec 2026, 3:00 PM IST) ----------
const EVENT_DATE = new Date('2026-12-12T15:00:00+05:30').getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = EVENT_DATE - now;
    const format = (n) => String(Math.max(0, n)).padStart(2, '0');

    if (diff <= 0) {
        ['timer-days', 'timer-hours', 'timer-mins', 'timer-secs',
            'm-timer-days', 'm-timer-hours', 'm-timer-mins', 'm-timer-secs']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '00';
            });
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const map = {
        'timer-days': days, 'timer-hours': hours, 'timer-mins': mins, 'timer-secs': secs,
        'm-timer-days': days, 'm-timer-hours': hours, 'm-timer-mins': mins, 'm-timer-secs': secs
    };
    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = format(val);
    });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ---------- 2. HERO CAROUSEL ----------
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.slide-dot');
let autoTimer = null;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === index);
        slide.classList.toggle('opacity-0', i !== index);
        slide.classList.toggle('scale-105', i === index);
        slide.classList.toggle('scale-100', i !== index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('bg-gold-400', i === index);
        dot.classList.toggle('w-6', i === index);
        dot.classList.toggle('bg-white/40', i !== index);
        dot.classList.toggle('w-3', i !== index);
    });
    currentSlide = index;
}

function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length); }
function setSlide(i) { showSlide(i); resetAuto(); }

function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6500);
}

document.getElementById('next-slide')?.addEventListener('click', () => { nextSlide(); resetAuto(); });
document.getElementById('prev-slide')?.addEventListener('click', () => { prevSlide(); resetAuto(); });
resetAuto();

// Expose for inline onclick
window.setSlide = setSlide;

// ---------- 3. MOBILE MENU ----------
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    }
});

mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        }
    });
});

// ---------- 4. LIGHTBOX ----------
function openLightbox(url) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = url;
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
}
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox' || e.target.closest('button')) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeGuruModal();
    }
});

// ---------- 5. GURU DATA (single source of truth) ----------
const GURUS = [
    {
        name: "Shri Dilip Puranik",
        shortName: "Shri Dilip Puranik",
        gharana: "Tabla",
        title: "Tabla Guru & Founder, TablaGyan",
        img: "https://tablagyan.com/static/images/tabla-professor-2.jpeg",
        bio: "Shri. DILIP PURANIK is the visionary founder and principal architect of TablaGyan - Academy of Music. He has earned a distinguished place in Indian classical music as a performer, guru, and mentor, instrumental in spreading the art of tabla globally. Son of Shri Ramesh Puranik (harmonium) and Smt. Kasturi Puranik (vocalist), his journey reflects a perfect blend of divine grace and rigorous discipline.",
        specialty: "Kayda, Rela & rare Bandishes of Farrukhabad"
    },
    {
        name: "Smt. Sneha Pathak",
        shortName: "Smt. Sneha Pathak",
        gharana: "Vocals",
        title: "Vocals Guru",
        img: "https://tablagyan.com/static/images/sneha-pathak.jpeg",
        bio: "Smt. Sneha Pathak is a dedicated vocals teacher at TablaGyan, originally from Maharashtra. Her musical journey is a testament to strong foundations and successful mastery of the Visharad grade in Hindustani classical music.",
        specialty: "Hindustani classical vocals · Visharad"
    }
];

// ---------- 5a. RENDER GURUS INTO HTML CONTAINERS ----------
function renderGurus() {
    const meetGrid = document.getElementById('meet-gurus-grid');
    const fullGrid = document.getElementById('gurus-grid');

    if (meetGrid) {
        meetGrid.innerHTML = GURUS.map((g, i) => `
            <div class="flex flex-col items-center group cursor-pointer" onclick="openGuruModal(${i})">
                <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-gold-400 via-gold-500 to-maroon-900 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img src="${g.img}" alt="${g.name}" class="w-full h-full object-cover rounded-full"
                         onerror="this.src='https://placehold.co/200x200/58111A/D4AF37?text=Guru'">
                </div>
                <h3 class="font-playfair font-bold text-maroon-900 text-sm text-center mt-3 group-hover:text-gold-600 transition-colors">${g.shortName}</h3>
                <p class="text-[10px] text-gray-600 text-center">${g.gharana}</p>
            </div>
        `).join('');
    }

    if (fullGrid) {
        fullGrid.innerHTML = GURUS.map((g, i) => `
            <div class="bg-cream-100 rounded-2xl p-6 gold-border-glow text-center card-lift cursor-pointer" onclick="openGuruModal(${i})">
                <div class="w-32 h-32 mx-auto rounded-full p-1.5 bg-gradient-to-br from-gold-400 via-gold-500 to-maroon-900 shadow-md">
                    <img src="${g.img}" alt="${g.name}" class="w-full h-full object-cover rounded-full"
                         onerror="this.src='https://placehold.co/300x300/58111A/D4AF37?text=Guru'">
                </div>
                <h3 class="font-playfair font-bold text-maroon-900 text-lg mt-4">${g.name}</h3>
                <p class="text-xs text-gold-600 font-semibold mt-1">${g.gharana}</p>
                <p class="text-[11px] text-gray-500 mt-2">${g.title}</p>
            </div>
        `).join('');
    }
}

// Run as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGurus);
} else {
    renderGurus();
}

// ---------- 5b. GURU MODAL ----------
function openGuruModal(index) {
    const g = GURUS[index];
    if (!g) return;

    const modal = document.getElementById('guru-modal');
    const content = document.getElementById('guru-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="relative">
            <button onclick="closeGuruModal()" class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-maroon-900 text-gold-300 hover:bg-gold-500 hover:text-maroon-950 flex items-center justify-center transition-all z-10 shadow-lg" aria-label="Close">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0 mx-auto md:mx-0">
                    <div class="w-36 h-36 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-br from-gold-400 via-gold-500 to-maroon-900 shadow-xl">
                        <img src="${g.img}" alt="${g.name}" class="w-full h-full object-cover rounded-full" onerror="this.src='https://placehold.co/300x300/58111A/D4AF37?text=Guru'">
                    </div>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h3 class="font-cinzel text-2xl md:text-3xl font-bold text-maroon-900">${g.name}</h3>
                    <p class="text-gold-600 font-semibold text-sm mt-1 tracking-wide">${g.gharana}</p>
                    <p class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">${g.title}</p>
                    <div class="w-16 h-0.5 bg-gold-500 mx-auto md:mx-0 mt-3 mb-4"></div>
                    <p class="font-playfair text-sm md:text-base text-gray-700 leading-relaxed">${g.bio}</p>
                    <div class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 border border-gold-300/60">
                        <i class="fa-solid fa-music text-gold-600 text-xs"></i>
                        <span class="text-xs font-medium text-maroon-900">${g.specialty}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    });
}

function closeGuruModal() {
    const modal = document.getElementById('guru-modal');
    const content = document.getElementById('guru-modal-content');
    if (!modal || !content) return;

    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 280);
}

window.openGuruModal = openGuruModal;
window.closeGuruModal = closeGuruModal;

document.getElementById('guru-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'guru-modal') closeGuruModal();
});


// ---------- 6. SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- 7. HEADER SHRINK ----------
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header?.classList.add('header-scrolled');
    } else {
        header?.classList.remove('header-scrolled');
    }
}, { passive: true });

// ---------- 8. ACTIVE NAV HIGHLIGHT ----------
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                const href = link.getAttribute('href')?.slice(1);
                if (href === id) {
                    link.classList.add('nav-active');
                } else {
                    link.classList.remove('nav-active');
                }
            });
        }
    });
}, { threshold: 0.25, rootMargin: '-20% 0px -55% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

// ---------- 9. FLOATING MOTIFS ----------
function createFloatingMotifs() {
    const container = document.getElementById('floating-motifs');
    if (!container) return;

    const symbols = ['ॐ', '♪', '♫', '◦'];
    for (let i = 0; i < 8; i++) {
        const span = document.createElement('span');
        span.className = 'floating-motif';
        span.textContent = symbols[i % symbols.length];
        span.style.left = (8 + Math.random() * 84) + '%';
        span.style.animationDuration = (18 + Math.random() * 14) + 's';
        span.style.animationDelay = (Math.random() * 10) + 's';
        span.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
        container.appendChild(span);
    }
}
createFloatingMotifs();

// ---------- 10. HERO PARALLAX ----------
const hero = document.querySelector('#hero-carousel');
window.addEventListener('scroll', () => {
    if (!hero) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        hero.style.transform = 'translateY(' + (scrolled * 0.22) + 'px)';
    }
}, { passive: true });

// ---------- 11. BUTTON RIPPLE ----------
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('%cTablaGyan GuruVandan 2026 – crafted with reverence', 'color:#D4AF37;font-family:serif;font-size:14px;');

// ---------- 12. BACKGROUND MUSIC TOGGLE ----------
(function () {
    const btn = document.getElementById('music-toggle');
    const icon = document.getElementById('music-icon');
    const label = document.getElementById('music-label');
    const audio = document.getElementById('bg-audio');
    if (!btn || !audio) return;

    let playing = false;
    let ctx = null, master = null, droneNodes = [];

    // Soft tanpura-style drone (Pa–Sa–Sa–Sa) used when bg-music.mp3 isn't available
    function startDrone() {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!ctx) ctx = new AC();
        if (ctx.state === 'suspended') ctx.resume();
        master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
        master.connect(ctx.destination);

        const base = 130.81; // C3
        [base * 1.5, base * 2, base * 2, base].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            osc.detune.value = (i - 1.5) * 4;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 900;
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 0.18 + i * 0.03;
            lfoGain.gain.value = 0.25;
            g.gain.value = 0.35;
            lfo.connect(lfoGain).connect(g.gain);
            osc.connect(filter).connect(g).connect(master);
            osc.start(); lfo.start();
            droneNodes.push(osc, lfo);
        });
    }

    function stopDrone() {
        if (!ctx || !master) return;
        const m = master, nodes = droneNodes;
        m.gain.cancelScheduledValues(ctx.currentTime);
        m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
        m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => { nodes.forEach(n => { try { n.stop(); } catch (e) { } }); m.disconnect(); }, 900);
        droneNodes = []; master = null;
    }

    function setUI(on) {
        icon.className = on ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        label.textContent = on ? 'Music On' : 'Music Off';
        btn.setAttribute('aria-pressed', String(on));
        btn.classList.toggle('bg-maroon-800', on);
        btn.classList.toggle('text-white', on);
    }

    async function turnOn() {
        audio.volume = 0.35;
        try {
            await audio.play();
        } catch (err) {
            startDrone(); // mp3 missing or blocked → synthesized drone
        }
        playing = true;
        setUI(true);
    }

    function turnOff() {
        audio.pause();
        stopDrone();
        playing = false;
        setUI(false);
    }

    btn.addEventListener('click', () => (playing ? turnOff() : turnOn()));
})();
