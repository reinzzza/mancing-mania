/* =========================================================================
    * SOUND FX SYSTEM (Web Audio API Synthesizer - No external audio required)
    * ========================================================================= */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSplash() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        // White noise burst with lowpass filter sweep
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    playCast() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    playStrike() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        // Two punchy tones
        [750, 950].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.4, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.15);
        });
    }

    playReelClick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
    }

    playVictory() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // Major chord A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);

            gain.gain.setValueAtTime(0.25, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.45);
        });
    }
}

const sound = new SoundEngine();

/* =========================================================================
    * DATA DEFINITIONS: FISH SPECIES & SHOP UPGRADES
    * ========================================================================= */
const RARITY = {
    COMMON: { name: 'Biasa', color: '#94a3b8', bg: 'bg-slate-700/80 text-slate-200' },
    RARE: { name: 'Langka', color: '#38bdf8', bg: 'bg-sky-700/80 text-sky-200' },
    EPIC: { name: 'Epik', color: '#a855f7', bg: 'bg-purple-700/80 text-purple-200' },
    LEGENDARY: { name: 'Legendaris', color: '#f59e0b', bg: 'bg-amber-600/90 text-amber-100' }
};

const FISH_SPECIES = [
    {
        id: 'nila',
        name: 'Ikan Nila Danau',
        rarity: RARITY.COMMON,
        minWeight: 0.6,
        maxWeight: 2.2,
        basePrice: 15,
        colorMain: '#5a8275',
        colorBelly: '#9ca3af',
        finColor: '#3d5a50',
        difficulty: 1.0,
        desc: 'Ikan air tawar yang tangkas, sering berkumpul di permukaan dekat bebatuan.'
    },
    {
        id: 'lele',
        name: 'Lele Sungai Karang',
        rarity: RARITY.COMMON,
        minWeight: 1.2,
        maxWeight: 4.5,
        basePrice: 25,
        colorMain: '#475569',
        colorBelly: '#64748b',
        finColor: '#334155',
        difficulty: 1.1,
        desc: 'Ikan berkumis yang tenang namun memiliki tenaga tarikan yang kokoh.'
    },
    {
        id: 'mas_komet',
        name: 'Komet Jingga',
        rarity: RARITY.RARE,
        minWeight: 1.5,
        maxWeight: 5.8,
        basePrice: 55,
        colorMain: '#f97316',
        colorBelly: '#fdba74',
        finColor: '#ea580c',
        difficulty: 1.35,
        desc: 'Memiliki ekor panjang menyerupai selendang dan sisik berkilau keemasan.'
    },
    {
        id: 'kakap_merah',
        name: 'Kakap Karang Liar',
        rarity: RARITY.RARE,
        minWeight: 3.0,
        maxWeight: 9.0,
        basePrice: 85,
        colorMain: '#e11d48',
        colorBelly: '#fda4af',
        finColor: '#be123c',
        difficulty: 1.55,
        desc: 'Pemangsa tangguh berbadan kuat dengan warna merah ruby yang memikat.'
    },
    {
        id: 'tuna_sirip_biru',
        name: 'Tuna Royal Kerdil',
        rarity: RARITY.EPIC,
        minWeight: 8.0,
        maxWeight: 22.0,
        basePrice: 160,
        colorMain: '#2563eb',
        colorBelly: '#93c5fd',
        finColor: '#1d4ed8',
        difficulty: 1.9,
        desc: 'Perenang cepat samudra dengan akselerasi mendadak saat terkena kail.'
    },
    {
        id: 'arowana_emas',
        name: 'Arwana Emas Mahkota',
        rarity: RARITY.EPIC,
        minWeight: 5.0,
        maxWeight: 16.0,
        basePrice: 240,
        colorMain: '#eab308',
        colorBelly: '#fef08a',
        finColor: '#ca8a04',
        difficulty: 2.2,
        desc: 'Ikan purba eksotis lambang keberuntungan dengan sisik poligonal reflektif.'
    },
    {
        id: 'marlin_bayangan',
        name: 'Marlin Badai Biru',
        rarity: RARITY.LEGENDARY,
        minWeight: 25.0,
        maxWeight: 65.0,
        basePrice: 480,
        colorMain: '#0284c7',
        colorBelly: '#7dd3fc',
        finColor: '#0369a1',
        difficulty: 2.7,
        desc: 'Penguasa perairan dalam dengan paruh runcing tajam dan lompatan spektakuler.'
    },
    {
        id: 'leviathan_poly',
        name: 'Naga Air Neon',
        rarity: RARITY.LEGENDARY,
        minWeight: 45.0,
        maxWeight: 110.0,
        basePrice: 950,
        colorMain: '#06b6d4',
        colorBelly: '#ec4899',
        finColor: '#8b5cf6',
        difficulty: 3.2,
        desc: 'Ikan mitos bersinar misterius yang jarang sekali menampakkan wujudnya.'
    }
];

const SHOP_ITEMS = [
    {
        id: 'rod_bamboo',
        category: 'rod',
        name: 'Joran Bambu Tradisional',
        price: 0,
        unlocked: true,
        sweetSpotBonus: 1.0,
        pullStrength: 1.0,
        icon: 'fa-wand-magic',
        desc: 'Joran awal yang ringan dan mudah digunakan.'
    },
    {
        id: 'rod_carbon',
        category: 'rod',
        name: 'Joran Karbon Pro',
        price: 220,
        unlocked: false,
        sweetSpotBonus: 1.3,
        pullStrength: 1.35,
        icon: 'fa-wand-magic-sparkles',
        desc: 'Memperlebar area tarikan stabil (Sweet Spot +30%).'
    },
    {
        id: 'rod_titanium',
        category: 'rod',
        name: 'Joran Titanium Emas',
        price: 650,
        unlocked: false,
        sweetSpotBonus: 1.6,
        pullStrength: 1.7,
        icon: 'fa-certificate',
        desc: 'Tangguh melawan ikan legenda, sweet spot jauh lebih stabil.'
    },
    {
        id: 'bait_worm',
        category: 'bait',
        name: 'Cacing Segar',
        price: 0,
        unlocked: true,
        rareChance: 0.1,
        icon: 'fa-cookie-bite',
        desc: 'Umpan dasar kesukaan ikan air tawar.'
    },
    {
        id: 'bait_shrimp',
        category: 'bait',
        name: 'Udang Kristal',
        price: 180,
        unlocked: false,
        rareChance: 0.35,
        icon: 'fa-shrimp',
        desc: 'Meningkatkan peluang menemukan spesies Rare dan Epic.'
    },
    {
        id: 'bait_lure_glow',
        category: 'bait',
        name: 'Lure Neon Pendar',
        price: 520,
        unlocked: false,
        rareChance: 0.65,
        icon: 'fa-sun',
        desc: 'Umpan bercahaya penarik ikan Epic & Legendary!'
    }
];

/* =========================================================================
    * GAME STATE MACHINE & PLAYER PROGRESSION
    * ========================================================================= */
const GameState = {
    IDLE: 'IDLE',
    CASTING: 'CASTING',
    WAITING: 'WAITING',
    BITING: 'BITING',
    REELING: 'REELING',
    CELEBRATION: 'CELEBRATION'
};

const state = {
    current: GameState.IDLE,
    coins: 120,
    equippedRod: 'rod_bamboo',
    equippedBait: 'bait_worm',
    codex: {}, // id: { count, maxWeight }
    
    // Casting mechanics
    castPower: 0,
    castDirection: 1,
    castHolding: false,
    bobberPos: { x: 0, y: 0 },
    targetBobberPos: { x: 0, y: 0 },
    bobberInWater: false,

    // Bite timer & fish
    biteTimer: 0,
    biteWindow: 0,
    currentFish: null,

    // Reeling minigame physics
    tension: 50, // 0 to 100
    sweetSpotCenter: 50,
    sweetSpotSize: 28,
    fishDistance: 30, // meters to reel in
    catchProgress: 25, // 0 to 100%
    isTensionHeld: false,

    // Day / Night Cycle (0 to 1)
    dayTime: 0.25, // 0 = dawn, 0.25 = noon, 0.65 = sunset, 0.85 = night
    timeScale: 0.0003
};

/* =========================================================================
    * GRAPHICS ENGINE: LOW POLY ISOMETRIC WATER, MOUNTAINS, AND LIGHTING
    * ========================================================================= */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const previewCanvas = document.getElementById('fishPreviewCanvas');
const pCtx = previewCanvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initWaterMesh();
}
window.addEventListener('resize', resizeCanvas);

// Low Poly Water Mesh Points
let waterCols = 24;
let waterRows = 16;
let waterVertices = [];

function initWaterMesh() {
    waterVertices = [];
    const colWidth = width / (waterCols - 1);
    const rowHeight = (height * 0.65) / (waterRows - 1);
    const startY = height * 0.35;

    for (let r = 0; r < waterRows; r++) {
        waterVertices[r] = [];
        for (let c = 0; c < waterCols; c++) {
            waterVertices[r][c] = {
                baseX: c * colWidth,
                baseY: startY + r * rowHeight,
                x: c * colWidth,
                y: startY + r * rowHeight,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.02,
                amp: 5 + (r / waterRows) * 10
            };
        }
    }
}

// Low Poly Background Mountains
const mountains = [
    { x: 0.15, height: 0.38, width: 0.45, color: '#2d3748', shade: '#1a202c' },
    { x: 0.5, height: 0.48, width: 0.6, color: '#334155', shade: '#1e293b' },
    { x: 0.85, height: 0.36, width: 0.5, color: '#1f2937', shade: '#111827' }
];

// Swimming ambient silhouettes of fish under water
const ambientFish = [];
for (let i = 0; i < 7; i++) {
    ambientFish.push({
        x: Math.random() * 800,
        y: 350 + Math.random() * 300,
        speed: 0.6 + Math.random() * 1.0,
        size: 15 + Math.random() * 25,
        angle: Math.random() * Math.PI * 2,
        turnSpeed: 0.015
    });
}

// Ripple particle effects
const ripples = [];
function createRipple(x, y, maxRadius = 40, color = 'rgba(255,255,255,0.7)') {
    ripples.push({ x, y, r: 2, maxR: maxRadius, alpha: 1.0, color });
}

/* =========================================================================
    * SKY & ATMOSPHERIC LIGHTING PALETTES
    * ========================================================================= */
function getSkyColors(t) {
    // t = 0..1 (0: Sunrise, 0.3: Noon, 0.65: Sunset, 0.85: Night)
    if (t < 0.25) { // Dawn to Morning
        return {
            top: '#4338ca',
            mid: '#f97316',
            bottom: '#fde047',
            waterDeep: '#0e7490',
            waterSurface: '#22d3ee',
            sunColor: '#fef08a',
            timeText: 'Fajar Emas',
            icon: 'fa-cloud-sun'
        };
    } else if (t < 0.6) { // Clear Noon
        return {
            top: '#0284c7',
            mid: '#38bdf8',
            bottom: '#bae6fd',
            waterDeep: '#0369a1',
            waterSurface: '#38bdf8',
            sunColor: '#fffbeb',
            timeText: 'Siang Cerah',
            icon: 'fa-sun'
        };
    } else if (t < 0.8) { // Golden Hour / Sunset
        return {
            top: '#4c1d95',
            mid: '#e11d48',
            bottom: '#fb923c',
            waterDeep: '#831843',
            waterSurface: '#fb7185',
            sunColor: '#fed7aa',
            timeText: 'Senja Indah',
            icon: 'fa-mountain-sun'
        };
    } else { // Midnight / Stars
        return {
            top: '#020617',
            mid: '#0f172a',
            bottom: '#1e293b',
            waterDeep: '#090d16',
            waterSurface: '#1e3a5f',
            sunColor: '#e2e8f0', // Moon
            timeText: 'Malam Berbintang',
            icon: 'fa-moon'
        };
    }
}

/* =========================================================================
    * DRAWING LOW POLY ELEMENTS: BOAT, ANGLER, ROD & FISH
    * ========================================================================= */
function drawBoatAndFisher(ctx, bx, by, rodAngle, isHookBending) {
    ctx.save();
    ctx.translate(bx, by);

    // Floating bobbing effect
    const bobbing = Math.sin(Date.now() * 0.003) * 4;
    const tilt = Math.cos(Date.now() * 0.0025) * 0.02;
    ctx.translate(0, bobbing);
    ctx.rotate(tilt);

    // Boat Hull (Flat-shaded faceted low poly polygons)
    // Bottom shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 75, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lower Hull Side
    ctx.fillStyle = '#653a1d';
    ctx.beginPath();
    ctx.moveTo(-75, 4);
    ctx.lineTo(-60, 24);
    ctx.lineTo(60, 24);
    ctx.lineTo(75, 4);
    ctx.closePath();
    ctx.fill();

    // Upper Hull Facet 1 (Left shade)
    ctx.fillStyle = '#854d24';
    ctx.beginPath();
    ctx.moveTo(-75, 4);
    ctx.lineTo(-50, -4);
    ctx.lineTo(0, 5);
    ctx.lineTo(-30, 14);
    ctx.closePath();
    ctx.fill();

    // Upper Hull Facet 2 (Right highlight)
    ctx.fillStyle = '#9c5b2b';
    ctx.beginPath();
    ctx.moveTo(75, 4);
    ctx.lineTo(50, -4);
    ctx.lineTo(0, 5);
    ctx.lineTo(30, 14);
    ctx.closePath();
    ctx.fill();

    // Interior Boat Bench
    ctx.fillStyle = '#532f17';
    ctx.fillRect(-35, -2, 70, 7);

    // Lantern on boat front (Glow effect at night)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(62, -10, 6, 8);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(65, -6, 3, 0, Math.PI * 2);
    ctx.fill();

    // --- FISHERMAN CHARACTER (Low poly geometric stylization) ---
    const fx = -12;
    const fy = -4;

    // Fisherman Coat / Body
    ctx.fillStyle = '#0284c7'; // Blue raincoat
    ctx.beginPath();
    ctx.moveTo(fx - 12, fy + 4);
    ctx.lineTo(fx + 10, fy + 4);
    ctx.lineTo(fx + 6, fy - 22);
    ctx.lineTo(fx - 10, fy - 22);
    ctx.closePath();
    ctx.fill();

    // Fisherman Head
    ctx.fillStyle = '#fed7aa'; // Skin tone
    ctx.beginPath();
    ctx.arc(fx - 2, fy - 28, 7, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Bucket Fishing Hat
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(fx - 14, fy - 30);
    ctx.lineTo(fx + 10, fy - 30);
    ctx.lineTo(fx + 6, fy - 38);
    ctx.lineTo(fx - 10, fy - 38);
    ctx.closePath();
    ctx.fill();
    // Hat Brim
    ctx.fillRect(fx - 15, fy - 30, 26, 3);

    // Fisherman Arms holding Fishing Rod
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx, fy - 16);
    ctx.lineTo(fx + 16, fy - 14);
    ctx.stroke();

    // --- FISHING ROD ---
    const rodBaseX = fx + 16;
    const rodBaseY = fy - 14;
    const rodLength = 95;
    
    // Rod bend deflection based on state
    let currentRodAngle = rodAngle;
    if (isHookBending) {
        currentRodAngle += Math.sin(Date.now() * 0.02) * 0.08 + 0.15;
    }

    const tipX = rodBaseX + Math.cos(currentRodAngle) * rodLength;
    const tipY = rodBaseY + Math.sin(currentRodAngle) * rodLength;

    // Rod body (Tapered line)
    ctx.strokeStyle = state.equippedRod === 'rod_titanium' ? '#f59e0b' : (state.equippedRod === 'rod_carbon' ? '#475569' : '#ca8a04');
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rodBaseX, rodBaseY);
    ctx.quadraticCurveTo((rodBaseX + tipX) / 2 + 5, (rodBaseY + tipY) / 2 - 10, tipX, tipY);
    ctx.stroke();

    // Rod Reel Wheel
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(rodBaseX + 5, rodBaseY + 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    return {
        tipX: bx + tipX + bobbing * 0.2,
        tipY: by + tipY + bobbing
    };
}

// Low Poly 3D/Flat shaded Fish Model Renderer (Used in Preview Canvas & Catch Celebration)
function drawLowPolyFish(context, cx, cy, fishSpec, angle, scale = 1.0) {
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.scale(scale, scale);

    // Fish Body Top Facet
    context.fillStyle = fishSpec.colorMain;
    context.beginPath();
    context.moveTo(45, 0); // Nose tip
    context.lineTo(0, -18); // Top dorsal spine
    context.lineTo(-40, -6); // Upper tail base
    context.lineTo(0, 0); // Lateral center ridge
    context.closePath();
    context.fill();

    // Fish Body Bottom Facet (Lighter belly)
    context.fillStyle = fishSpec.colorBelly;
    context.beginPath();
    context.moveTo(45, 0);
    context.lineTo(0, 0);
    context.lineTo(-40, 0);
    context.lineTo(-20, 16);
    context.closePath();
    context.fill();

    // Dorsal Fin (Low Poly Triangle)
    context.fillStyle = fishSpec.finColor;
    context.beginPath();
    context.moveTo(5, -16);
    context.lineTo(-20, -32);
    context.lineTo(-25, -10);
    context.closePath();
    context.fill();

    // Tail Fin (Faceted caudal fin)
    context.beginPath();
    context.moveTo(-40, -4);
    context.lineTo(-70, -22);
    context.lineTo(-58, 0);
    context.lineTo(-70, 22);
    context.lineTo(-38, 4);
    context.closePath();
    context.fill();

    // Side Pectoral Fin
    context.fillStyle = fishSpec.finColor;
    context.beginPath();
    context.moveTo(12, 2);
    context.lineTo(0, 15);
    context.lineTo(-10, 8);
    context.closePath();
    context.fill();

    // Low poly geometric eye
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(32, -4, 4, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#0f172a';
    context.beginPath();
    context.arc(33, -4, 2, 0, Math.PI * 2);
    context.fill();

    // Shiny specular highlight
    context.fillStyle = 'rgba(255,255,255,0.4)';
    context.beginPath();
    context.moveTo(25, -3);
    context.lineTo(5, -12);
    context.lineTo(8, -5);
    context.closePath();
    context.fill();

    context.restore();
}

function renderLowPolyWater(timeOfDay) {
    const sky = getSkyColors(timeOfDay);

    // Update vertex wave positions
    for (let r = 0; r < waterRows; r++) {
        for (let c = 0; c < waterCols; c++) {
            const v = waterVertices[r][c];
            v.phase += v.speed;
            v.x = v.baseX + Math.sin(v.phase) * (v.amp * 0.4);
            v.y = v.baseY + Math.cos(v.phase) * v.amp;
        }
    }

    // Draw Faceted Triangles (Dual triangles per quad)
    for (let r = 0; r < waterRows - 1; r++) {
        for (let c = 0; c < waterCols - 1; c++) {
            const p1 = waterVertices[r][c];
            const p2 = waterVertices[r][c + 1];
            const p3 = waterVertices[r + 1][c + 1];
            const p4 = waterVertices[r + 1][c];

            // Compute elevation tilt for flat lighting calculation
            const depthFactor = r / waterRows; // Deeper water is darker
            const slope1 = (p2.y - p1.y + p3.x - p1.x) * 0.04;
            const slope2 = (p4.y - p1.y + p3.y - p2.y) * 0.04;

            // Triangle 1 (p1 -> p2 -> p3)
            const lum1 = Math.sin(slope1 + Date.now() * 0.001) * 12;
            ctx.fillStyle = adjustBrightness(sky.waterSurface, sky.waterDeep, depthFactor, lum1);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();

            // Subtle polygon wire/facet edge highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Triangle 2 (p1 -> p3 -> p4)
            const lum2 = Math.cos(slope2 + Date.now() * 0.0012) * 12;
            ctx.fillStyle = adjustBrightness(sky.waterSurface, sky.waterDeep, depthFactor, lum2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

// Color interpolation helper for low poly facet illumination
function adjustBrightness(hexTop, hexDeep, depth, lumen) {
    // Simple hex parse
    const r1 = parseInt(hexTop.slice(1, 3), 16);
    const g1 = parseInt(hexTop.slice(3, 5), 16);
    const b1 = parseInt(hexTop.slice(5, 7), 16);

    const r2 = parseInt(hexDeep.slice(1, 3), 16);
    const g2 = parseInt(hexDeep.slice(3, 5), 16);
    const b2 = parseInt(hexDeep.slice(5, 7), 16);

    let r = Math.round(r1 * (1 - depth) + r2 * depth + lumen);
    let g = Math.round(g1 * (1 - depth) + g2 * depth + lumen);
    let b = Math.round(b1 * (1 - depth) + b2 * depth + lumen);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return `rgb(${r},${g},${b})`;
}

/* =========================================================================
    * INTERACTIVE INPUT CONTROLS
    * ========================================================================= */
let pointerDown = false;
let pointerX = 0;
let pointerY = 0;

function handlePointerStart(x, y) {
    sound.init();
    pointerDown = true;
    pointerX = x;
    pointerY = y;

    if (state.current === GameState.IDLE) {
        // Start charging casting power meter
        state.current = GameState.CASTING;
        state.castPower = 0;
        state.castDirection = 1;
        document.getElementById('castMeterBox').style.opacity = '1';
        updateInstructions('Tahan untuk mengisi tenaga lemparan!');
    } else if (state.current === GameState.BITING) {
        // Strike triggered in time!
        triggerHookStrike();
    } else if (state.current === GameState.REELING) {
        // Tension pull
        state.isTensionHeld = true;
    }
}

function handlePointerEnd() {
    if (state.current === GameState.CASTING) {
        // Release to throw hook
        executeCast();
    } else if (state.current === GameState.REELING) {
        state.isTensionHeld = false;
    }
    pointerDown = false;
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    handlePointerStart(e.clientX - rect.left, e.clientY - rect.top);
});
window.addEventListener('mouseup', handlePointerEnd);

// Touch event handlers for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    handlePointerStart(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });

window.addEventListener('touchend', (e) => {
    handlePointerEnd();
});

// Keyboard Spacebar alternative
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
        if (state.current === GameState.IDLE || state.current === GameState.BITING || state.current === GameState.REELING) {
            handlePointerStart(width * 0.65, height * 0.65);
        }
    }
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        handlePointerEnd();
    }
});

/* =========================================================================
    * FISHING LOGIC: CASTING, NIBBLING, STRIKE & REELING TENSION
    * ========================================================================= */
const boatPos = { x: 0, y: 0 };

function updateBoatPosition() {
    boatPos.x = width * 0.22;
    boatPos.y = height * 0.52;
}

function executeCast() {
    document.getElementById('castMeterBox').style.opacity = '0';
    sound.playCast();

    // Calculate landing coordinates based on cast power
    const minX = width * 0.45;
    const maxX = width * 0.88;
    const targetX = minX + (maxX - minX) * (state.castPower / 100);
    const targetY = height * 0.55 + Math.random() * (height * 0.25);

    state.targetBobberPos = { x: targetX, y: targetY };
    state.bobberPos = { x: boatPos.x + 60, y: boatPos.y - 30 };
    state.bobberInWater = false;
    state.current = GameState.WAITING;

    updateInstructions('Menunggu ikan mendekati umpan...');

    // Splash after arc animation finishes
    setTimeout(() => {
        state.bobberInWater = true;
        sound.playSplash();
        createRipple(state.targetBobberPos.x, state.targetBobberPos.y, 50, '#38bdf8');
        
        // Random time until fish nibbles (2.0s to 4.5s)
        state.biteTimer = Date.now() + 2000 + Math.random() * 2500;
    }, 650);
}

function startBiteAlert() {
    state.current = GameState.BITING;
    state.biteWindow = Date.now() + 1600; // 1.6 seconds to react!
    sound.playStrike();

    // Pick candidate fish according to equipped bait
    state.currentFish = selectRandomFish();

    const alertEl = document.getElementById('biteAlert');
    alertEl.classList.remove('opacity-0', 'scale-75');
    alertEl.classList.add('opacity-100', 'scale-110');
    updateInstructions('⚠️ STRIKE! Klik atau tekan Spasi sekarang juga!');

    // Spawn aggressive ripples around bobber
    createRipple(state.bobberPos.x, state.bobberPos.y, 65, '#f43f5e');
}

function selectRandomFish() {
    const bait = SHOP_ITEMS.find(item => item.id === state.equippedBait);
    const rareBonus = bait ? bait.rareChance : 0.1;

    const roll = Math.random();
    let pool = [];

    if (roll < 0.15 * rareBonus) {
        // Legendary pool
        pool = FISH_SPECIES.filter(f => f.rarity === RARITY.LEGENDARY);
    } else if (roll < 0.35 * rareBonus + 0.15) {
        // Epic pool
        pool = FISH_SPECIES.filter(f => f.rarity === RARITY.EPIC);
    } else if (roll < 0.65) {
        // Rare pool
        pool = FISH_SPECIES.filter(f => f.rarity === RARITY.RARE);
    } else {
        // Common pool
        pool = FISH_SPECIES.filter(f => f.rarity === RARITY.COMMON);
    }

    if (!pool.length) pool = FISH_SPECIES.filter(f => f.rarity === RARITY.COMMON);
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    // Randomize weight & price
    const weight = parseFloat((chosen.minWeight + Math.random() * (chosen.maxWeight - chosen.minWeight)).toFixed(2));
    const price = Math.round(chosen.basePrice * (weight / chosen.minWeight));

    return { ...chosen, weight, finalPrice: price };
}

function triggerHookStrike() {
    const alertEl = document.getElementById('biteAlert');
    alertEl.classList.add('opacity-0', 'scale-75');
    alertEl.classList.remove('opacity-100', 'scale-110');

    // Begin Reeling Minigame!
    state.current = GameState.REELING;
    state.fishDistance = 35 + Math.floor(state.currentFish.weight * 2.5);
    state.tension = 50;
    state.catchProgress = 35;
    state.sweetSpotCenter = 50;

    const rod = SHOP_ITEMS.find(r => r.id === state.equippedRod);
    state.sweetSpotSize = 26 * (rod ? rod.sweetSpotBonus : 1.0);

    document.getElementById('reelMinigame').classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
    document.getElementById('reelMinigame').classList.add('opacity-100', 'scale-100');
    document.getElementById('reelingFishName').innerText = state.currentFish.name;

    updateInstructions('Tahan KLIK untuk menaikkan tension, lepaskan untuk menurunkan. Pertahankan di area HIJAU!');
}

function updateReelingMechanics(delta) {
    const rod = SHOP_ITEMS.find(r => r.id === state.equippedRod);
    const pullBonus = rod ? rod.pullStrength : 1.0;
    const diff = state.currentFish.difficulty;

    // Player tension physics
    if (state.isTensionHeld) {
        state.tension += 55 * pullBonus * delta;
        sound.playReelClick();
    } else {
        state.tension -= 48 * delta;
    }
    state.tension = Math.max(0, Math.min(100, state.tension));

    // Dynamic Sweet Spot wandering movement
    state.sweetSpotCenter += (Math.sin(Date.now() * 0.003 * diff) * 45 + (Math.random() - 0.5) * 20) * delta;
    state.sweetSpotCenter = Math.max(15, Math.min(85, state.sweetSpotCenter));

    // Check if player's tension needle is inside the green sweet spot zone
    const halfSize = state.sweetSpotSize / 2;
    const isInZone = (state.tension >= state.sweetSpotCenter - halfSize) &&
                        (state.tension <= state.sweetSpotCenter + halfSize);

    if (isInZone) {
        state.catchProgress += 18 * pullBonus * delta;
        state.fishDistance -= 8 * delta;
    } else {
        state.catchProgress -= 14 * diff * delta;
    }

    state.fishDistance = Math.max(0, state.fishDistance);
    state.catchProgress = Math.max(0, Math.min(100, state.catchProgress));

    // Update Minigame UI Elements
    const sweetSpotEl = document.getElementById('sweetSpotZone');
    const needleEl = document.getElementById('reelNeedle');
    const progressEl = document.getElementById('catchProgress');
    const distEl = document.getElementById('fishDistance');

    sweetSpotEl.style.left = `${state.sweetSpotCenter - halfSize}%`;
    sweetSpotEl.style.width = `${state.sweetSpotSize}%`;
    needleEl.style.left = `${state.tension}%`;
    progressEl.style.width = `${state.catchProgress}%`;
    distEl.innerText = `${Math.ceil(state.fishDistance)}m`;

    // Victory or Line Snap / Fish Escaped
    if (state.catchProgress >= 100 || state.fishDistance <= 0) {
        finishCatch(true);
    } else if (state.catchProgress <= 0) {
        finishCatch(false);
    }
}

function finishCatch(success) {
    document.getElementById('reelMinigame').classList.add('opacity-0', 'scale-90', 'pointer-events-none');
    document.getElementById('reelMinigame').classList.remove('opacity-100', 'scale-100');

    if (success) {
        sound.playVictory();
        state.current = GameState.CELEBRATION;

        // Add coins
        state.coins += state.currentFish.finalPrice;
        document.getElementById('coinDisplay').innerText = state.coins;

        // Update Codex
        if (!state.codex[state.currentFish.id]) {
            state.codex[state.currentFish.id] = { count: 1, maxWeight: state.currentFish.weight };
        } else {
            state.codex[state.currentFish.id].count++;
            state.codex[state.currentFish.id].maxWeight = Math.max(state.codex[state.currentFish.id].maxWeight, state.currentFish.weight);
        }

        // Show Catch Celebration Modal
        showCatchModal(state.currentFish);
    } else {
        // Fish got away
        state.current = GameState.IDLE;
        updateInstructions('Ikan berhasil kabur! Coba lempar umpan lagi.');
        createRipple(state.bobberPos.x, state.bobberPos.y, 40, '#64748b');
    }
}

function showCatchModal(fish) {
    document.getElementById('modalFishName').innerText = fish.name;
    document.getElementById('modalFishWeight').innerText = `${fish.weight} kg`;
    document.getElementById('modalFishCoins').innerText = `+${fish.finalPrice}`;

    const badge = document.getElementById('modalRarityBadge');
    badge.innerText = `${fish.rarity.name}`;
    badge.className = `inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 shadow-sm ${fish.rarity.bg}`;

    const modal = document.getElementById('catchModal');
    modal.classList.add('modal-active');

    // Render 3D preview rotation in modal
    previewFishModel(fish);
}

let previewAnimFrame = null;
function previewFishModel(fish) {
    let rotation = 0;
    function loopPreview() {
        pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        rotation += 0.025;
        drawLowPolyFish(pCtx, previewCanvas.width / 2, previewCanvas.height / 2, fish, Math.sin(rotation) * 0.25, 1.3);
        if (state.current === GameState.CELEBRATION) {
            previewAnimFrame = requestAnimationFrame(loopPreview);
        }
    }
    if (previewAnimFrame) cancelAnimationFrame(previewAnimFrame);
    loopPreview();
}

document.getElementById('collectBtn').addEventListener('click', () => {
    document.getElementById('catchModal').classList.remove('modal-active');
    state.current = GameState.IDLE;
    updateInstructions('Klik dan Tahan di air untuk melempar umpan!');
});

// CODEX MODAL RENDERING
document.getElementById('codexBtn').addEventListener('click', () => {
    renderCodex();
    document.getElementById('codexModal').classList.add('modal-active');
});
document.getElementById('closeCodexBtn').addEventListener('click', () => {
    document.getElementById('codexModal').classList.remove('modal-active');
});

function renderCodex() {
    const list = document.getElementById('codexList');
    list.innerHTML = '';
    let discovered = 0;

    FISH_SPECIES.forEach(fish => {
        const info = state.codex[fish.id];
        if (info) discovered++;

        const card = document.createElement('div');
        card.className = `p-3.5 rounded-2xl flex items-center justify-between border ${info ? 'bg-white/5 border-white/10' : 'bg-black/30 border-white/5 opacity-50'}`;

        card.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg" style="background: ${info ? fish.colorMain + '33' : '#1e293b'}; color: ${info ? fish.colorMain : '#64748b'}">
                    <i class="fa-solid fa-fish"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-sm text-white">${info ? fish.name : '??? (Belum Ditemukan)'}</h4>
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${fish.rarity.bg}">${fish.rarity.name}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${info ? fish.desc : 'Pancing di perairan luas untuk menemukan ikan ini.'}</p>
                </div>
            </div>
            <div class="text-right pl-3">
                <div class="text-[10px] uppercase text-slate-400">Tertangkap</div>
                <div class="font-bold text-cyan-300 text-sm">${info ? info.count + 'x' : '0'}</div>
                ${info ? `<div class="text-[10px] text-slate-400">Rekor: ${info.maxWeight} kg</div>` : ''}
            </div>
        `;
        list.appendChild(card);
    });

    document.getElementById('codexCountText').innerText = `${discovered} / ${FISH_SPECIES.length} Spesies Terkumpul`;
}

// SHOP MODAL RENDERING
document.getElementById('shopBtn').addEventListener('click', () => {
    renderShop();
    document.getElementById('shopModal').classList.add('modal-active');
});
document.getElementById('closeShopBtn').addEventListener('click', () => {
    document.getElementById('shopModal').classList.remove('modal-active');
});

function renderShop() {
    const container = document.getElementById('shopItemsContainer');
    container.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
        const isEquipped = (item.category === 'rod' && state.equippedRod === item.id) || 
                            (item.category === 'bait' && state.equippedBait === item.id);
        const canBuy = !item.unlocked && state.coins >= item.price;

        const el = document.createElement('div');
        el.className = 'glass-panel p-4 rounded-2xl flex items-center justify-between border-white/10';

        el.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300 text-xl">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-sm text-white">${item.name}</h4>
                        <span class="text-[10px] uppercase font-bold text-slate-400">${item.category === 'rod' ? 'Joran' : 'Umpan'}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${item.desc}</p>
                </div>
            </div>
            <div>
                ${isEquipped ? `
                    <span class="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                        Digunakan
                    </span>
                ` : item.unlocked ? `
                    <button onclick="equipItem('${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-transform active:scale-95 shadow">
                        Pasang
                    </button>
                ` : `
                    <button onclick="buyItem('${item.id}')" class="px-3.5 py-1.5 rounded-xl ${canBuy ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400 cursor-not-allowed'} font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow">
                        <i class="fa-solid fa-coins"></i> ${item.price}
                    </button>
                `}
            </div>
        `;
        container.appendChild(el);
    });
}

window.buyItem = function(id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (item && !item.unlocked && state.coins >= item.price) {
        state.coins -= item.price;
        item.unlocked = true;
        document.getElementById('coinDisplay').innerText = state.coins;
        equipItem(id);
        renderShop();
    }
};

window.equipItem = function(id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (item && item.unlocked) {
        if (item.category === 'rod') {
            state.equippedRod = id;
            document.getElementById('hudRodName').innerText = item.name;
        } else if (item.category === 'bait') {
            state.equippedBait = id;
            document.getElementById('hudBaitName').innerText = item.name;
        }
        renderShop();
    }
};

// Sound toggle button
document.getElementById('soundBtn').addEventListener('click', () => {
    sound.muted = !sound.muted;
    const icon = document.getElementById('soundIcon');
    if (sound.muted) {
        icon.className = 'fa-solid fa-volume-xmark text-rose-400';
    } else {
        icon.className = 'fa-solid fa-volume-high text-slate-300';
        sound.playReelClick();
    }
});

function updateInstructions(text) {
    document.getElementById('instructionText').innerText = text;
}

/* =========================================================================
    * MAIN 60 FPS GAME LOOP & CANVAS RENDERING
    * ========================================================================= */
let lastTime = performance.now();

function gameLoop(now) {
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    updateBoatPosition();

    // Advance Time of Day Cycle
    state.dayTime = (state.dayTime + state.timeScale) % 1.0;
    const sky = getSkyColors(state.dayTime);
    document.getElementById('timeLabel').innerText = sky.timeText;
    document.getElementById('timeIcon').innerHTML = `<i class="fa-solid ${sky.icon} text-amber-400"></i>`;

    // --- 1. RENDER SKY GRADIENT ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
    skyGrad.addColorStop(0, sky.top);
    skyGrad.addColorStop(0.65, sky.mid);
    skyGrad.addColorStop(1, sky.bottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Sun / Moon Orb
    const sunY = height * 0.18 + Math.sin(state.dayTime * Math.PI * 2) * 50;
    ctx.fillStyle = sky.sunColor;
    ctx.beginPath();
    ctx.arc(width * 0.78, sunY, 32, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. RENDER BACKGROUND LOW POLY MOUNTAINS ---
    mountains.forEach(m => {
        const mx = width * m.x;
        const my = height * 0.38;
        const mHeight = height * m.height;
        const halfW = width * (m.width * 0.5);

        // Mountain Left Facet (Light)
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.moveTo(mx, my - mHeight);
        ctx.lineTo(mx - halfW, my);
        ctx.lineTo(mx, my);
        ctx.closePath();
        ctx.fill();

        // Mountain Right Facet (Shadowed)
        ctx.fillStyle = m.shade;
        ctx.beginPath();
        ctx.moveTo(mx, my - mHeight);
        ctx.lineTo(mx, my);
        ctx.lineTo(mx + halfW, my);
        ctx.closePath();
        ctx.fill();
    });

    // Atmospheric Fog over mountains
    const fogGrad = ctx.createLinearGradient(0, height * 0.28, 0, height * 0.38);
    fogGrad.addColorStop(0, 'transparent');
    fogGrad.addColorStop(1, sky.bottom);
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, height * 0.28, width, height * 0.1);

    // --- 3. RENDER LOW POLY WATER SURFACE ---
    renderLowPolyWater(state.dayTime);

    // --- 4. RENDER AMBIENT SWIMMING FISH SHADOWS ---
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ambientFish.forEach(af => {
        af.x += Math.cos(af.angle) * af.speed;
        af.y += Math.sin(af.angle) * (af.speed * 0.5);
        af.angle += (Math.random() - 0.5) * af.turnSpeed;

        if (af.x < -50) af.x = width + 50;
        if (af.x > width + 50) af.x = -50;
        if (af.y < height * 0.42) af.y = height * 0.42 + 10;
        if (af.y > height * 0.88) af.y = height * 0.88 - 10;

        ctx.save();
        ctx.translate(af.x, af.y);
        ctx.rotate(af.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, af.size, af.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // --- 5. RENDER WATER RIPPLES ---
    for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 24 * delta;
        rp.alpha -= 0.8 * delta;

        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        if (rp.alpha <= 0) ripples.splice(i, 1);
    }

    // --- 6. STATE UPDATES (CASTING CHARGE & REELING) ---
    if (state.current === GameState.CASTING) {
        state.castPower += state.castDirection * 85 * delta;
        if (state.castPower >= 100) {
            state.castPower = 100;
            state.castDirection = -1;
        } else if (state.castPower <= 0) {
            state.castPower = 0;
            state.castDirection = 1;
        }
        document.getElementById('castBar').style.width = `${state.castPower}%`;
    } else if (state.current === GameState.WAITING && state.bobberInWater) {
        // Check if fish starts biting
        if (Date.now() >= state.biteTimer) {
            startBiteAlert();
        }
    } else if (state.current === GameState.BITING) {
        // If player reacted too slow
        if (Date.now() >= state.biteWindow) {
            document.getElementById('biteAlert').classList.add('opacity-0', 'scale-75');
            state.current = GameState.IDLE;
            updateInstructions('Ikan memakan umpan lalu kabur! Lempar lagi.');
            createRipple(state.bobberPos.x, state.bobberPos.y, 40, '#ef4444');
        }
    } else if (state.current === GameState.REELING) {
        updateReelingMechanics(delta);
    }

    // --- 7. RENDER BOAT, ANGLER & FISHING LINE ---
    let rodAngle = -0.55; // Angle in radians
    if (state.current === GameState.CASTING) {
        rodAngle = -0.85 + (state.castPower / 100) * 0.25;
    } else if (state.current === GameState.REELING) {
        rodAngle = -0.75;
    }

    const rodTip = drawBoatAndFisher(ctx, boatPos.x, boatPos.y, rodAngle, state.current === GameState.REELING);

    // Draw Bobber & Line if active
    if (state.current === GameState.WAITING || state.current === GameState.BITING || state.current === GameState.REELING) {
        // Lerp bobber to target
        if (!state.bobberInWater) {
            state.bobberPos.x += (state.targetBobberPos.x - state.bobberPos.x) * 0.12;
            state.bobberPos.y += (state.targetBobberPos.y - state.bobberPos.y) * 0.12;
        } else {
            // Floating in water
            state.bobberPos.x = state.targetBobberPos.x + Math.sin(Date.now() * 0.002) * 4;
            state.bobberPos.y = state.targetBobberPos.y + Math.cos(Date.now() * 0.003) * 3;
        }

        // Fishing line string
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rodTip.tipX, rodTip.tipY);
        // Line sag curvature
        const midX = (rodTip.tipX + state.bobberPos.x) / 2;
        const midY = (rodTip.tipY + state.bobberPos.y) / 2 + (state.current === GameState.REELING ? 5 : 25);
        ctx.quadraticCurveTo(midX, midY, state.bobberPos.x, state.bobberPos.y);
        ctx.stroke();

        // Low Poly Float/Bobber (Red & White capsule)
        ctx.save();
        ctx.translate(state.bobberPos.x, state.bobberPos.y);
        // Top red half
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -4, 5, Math.PI, 0);
        ctx.fill();
        // Bottom white half
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, -4, 5, 0, Math.PI);
        ctx.fill();
        // Small antenna
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(0, -4);
        ctx.stroke();
        ctx.restore();
    }

    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    resizeCanvas();
    renderCodex();
    renderShop();
    requestAnimationFrame(gameLoop);
};