"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './elydria.css';
import CinematicCharacter from '../../components/CinematicCharacter';

// ==========================================
// 1. DATA DEFINITIONS & DATABASE MODULES
// ==========================================

interface RelicItem {
    name: string;
    icon: string;
    desc: string;
    effect: (state: GameState) => { toast: string };
}

const ITEM_DATABASE: Record<string, RelicItem> = {
    'moonflower': {
        name: 'Moonflower Essence',
        icon: '🌸',
        desc: 'A glowing blossom that grows in secret forest groves. Restores +12 Harmony and purifies world corruption by 10%.',
        effect: (state) => {
            state.player.harmony += 12;
            state.world.corruption = Math.max(0, state.world.corruption - 10);
            return { toast: "🌸 Drank Moonflower: +12 Harmony, Purity restored!" };
        }
    },
    'runestone': {
        name: 'Glimmering Runestone',
        icon: '🪨',
        desc: 'An ancient relic carved with stellar druidic leylines. Activating it grants +10 Wisdom and unlocks deep secrets.',
        effect: (state) => {
            state.player.wisdom += 10;
            return { toast: "🪨 Activated Runestone: +10 Wisdom!" };
        }
    },
    'corrupted-seed': {
        name: 'Corrupted Heart-Seed',
        icon: '💀',
        desc: 'An oily seed pulsing with shadow energy. Awards +15 Shadow magic but increases world corruption by 12%.',
        effect: (state) => {
            state.player.shadow += 15;
            state.world.corruption = Math.min(100, state.world.corruption + 12);
            return { toast: "💀 Consumed Heart-Seed: +15 Shadow, Corruption spreading!" };
        }
    },
    'wildroot': {
        name: 'Sovereign Wildroot',
        icon: '🌱',
        desc: 'A bitter root found near marshes. Grants +6 Harmony when infused, loved by wild sylvan beasts.',
        effect: (state) => {
            state.player.harmony += 6;
            return { toast: "🌱 Infused Wildroot: +6 Harmony!" };
        }
    },
    'staff-of-harmony': {
        name: 'Staff of Elden',
        icon: '🦯',
        desc: 'A legendary staff of an ancient Archdruid. Grants a passive +15 Harmony and +15 Wisdom to your essence.',
        effect: (state) => {
            state.player.harmony += 15;
            state.player.wisdom += 15;
            return { toast: "🦯 Equipped Staff of Elden: +15 Harmony & Wisdom!" };
        }
    },
    'shadow-scroll': {
        name: 'Forbidden Shadow Scroll',
        icon: '📜',
        desc: 'A dusty text detailing shadow druidism. Reading it opens a door to absolute forbidden power (+20 Shadow).',
        effect: (state) => {
            state.player.shadow += 20;
            return { toast: "📜 Read Forbidden Scroll: +20 Shadow!" };
        }
    }
};

interface Companion {
    name: string;
    icon: string;
    trait: string;
    desc: string;
    portrait: string;
    onEquip: (state: GameState) => void;
}

const COMPANION_DATABASE: Record<string, Companion> = {
    'fox': {
        name: 'Aurelia the Sylvan Fox',
        icon: '🦊',
        trait: '🍃 Cunning Spirit (+6 Wisdom)',
        desc: 'An amber fox with three glowing tails. Helps Elowen decipher ancient ruins and find hidden relics.',
        portrait: '/assets/companion_fawn.png',
        onEquip: (state) => { state.player.wisdom += 6; }
    },
    'bear': {
        name: 'Mossbeard the Bear',
        icon: '🐻',
        trait: '🛡️ Forest Protector (+8 Harmony)',
        desc: 'A massive grizzly whose back is covered in dense moss and spring ferns. Shields Elowen from shadows.',
        portrait: '/assets/companion_bear.png',
        onEquip: (state) => { state.player.harmony += 8; }
    },
    'raven': {
        name: 'Nevermore the Shadow Raven',
        icon: '🐦',
        trait: '👁️ Void Whispers (+10 Shadow)',
        desc: 'A majestic dark bird whose feathers shine with violet light. Whispers forbidden secrets of the void.',
        portrait: '/assets/companion_raven.png',
        onEquip: (state) => { state.player.shadow += 10; }
    },
    'wolf': {
        name: 'Luna the Star Wolf',
        icon: '🐺',
        trait: '🐺 Loyal Guardian (+8 Harmony & +5 Wisdom)',
        desc: 'A noble grey wolf with intelligent amber eyes and glowing emerald markings. Defends you fiercely.',
        portrait: '/assets/companion_wolf.png',
        onEquip: (state) => { state.player.harmony += 8; state.player.wisdom += 5; }
    },
    'owl': {
        name: 'Sage the Star Owl',
        icon: '🦉',
        trait: '🦉 Stellar Sight (+8 Wisdom)',
        desc: 'An ancient barn owl with stardust runic feathers. Guides you through the dense mist lands.',
        portrait: '/assets/companion_owl.png',
        onEquip: (state) => { state.player.wisdom += 8; }
    },
    'fawn': {
        name: 'Amber the Spirit Fawn',
        icon: '🦌',
        trait: '🦌 Nature Bond (+10 Harmony)',
        desc: 'A gentle glowing fawn whose footsteps cause vibrant magical forest flowers to instantly blossom.',
        portrait: '/assets/companion_fawn.png',
        onEquip: (state) => { state.player.harmony += 10; }
    }
};

interface Choice {
    text: string;
    condition: (state: GameState) => boolean;
    action: (state: GameState, triggerQuestComplete: (t: string, d: string, r: string[]) => void) => void;
}

interface Quest {
    title: string;
    speaker: string;
    role: string;
    avatar: string;
    text: string;
    choices: Choice[];
}

const QUEST_DATABASE: Record<string, Quest> = {
    'whispering-woods': {
        title: "The Elder Tree's Plague",
        speaker: "Elder Corin",
        role: "High Druid of Leaves",
        avatar: "avatar-corin",
        text: `"Young Elowen, a rot creeps up from the deep roots of our great Elder Tree. It is the blood-plague of the shadow leylines. I have gathered the last Moonflower, but its magic is weak without a druid's focus. Will you sacrifice your energy to purify the great tree's roots, or will you consume the decaying core's raw magic for yourself?"`,
        choices: [
            {
                text: `"I will weave the Moonflower's pure magic to heal the roots." (Costs 1 Moonflower, Restores Nature)`,
                condition: (state) => state.player.inventory.includes('moonflower'),
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.max(0, state.world.corruption - 15);
                    state.player.harmony += 10;
                    state.player.age_seasons += 4; // Travel/ritual takes 1 year
                    
                    const idx = state.player.inventory.indexOf('moonflower');
                    if (idx !== -1) state.player.inventory[idx] = null;
                    
                    state.player.companion = 'fox'; // Bond with fox
                    
                    triggerQuestComplete("Whispering Woods Saved", "You purified the sacred Elder Tree. Nature blossoms in gratitude. Aurelia the Sylvan Fox has bonded to your soul!", [
                        "+10 Druidic Harmony",
                        "Aged by 1 Year (Time passes during ritual)",
                        "World Corruption decreased by 15%",
                        "Bonded Companion unlocked: Sylvan Fox!"
                    ]);
                }
            },
            {
                text: `"The weak must fade. I will absorb the decaying core's dark essence." (Increases Corruption)`,
                condition: (state) => true,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.min(100, state.world.corruption + 20);
                    state.player.shadow += 15;
                    state.player.age_seasons += 4;
                    
                    // Add shadow scroll
                    for (let i = 0; i < state.player.inventory.length; i++) {
                        if (state.player.inventory[i] === null) {
                            state.player.inventory[i] = 'shadow-scroll';
                            break;
                        }
                    }
                    
                    triggerQuestComplete("Elder Tree Siphoned", "You allowed the Elder Tree to rot, absorbing its decaying magical energy to expand your own raw spellcraft.", [
                        "+15 Shadow Magic",
                        "Aged by 1 Year (Time passes during ritual)",
                        "World Corruption increased by 20%",
                        "Acquired Relic: Forbidden Shadow Scroll"
                    ]);
                }
            }
        ]
    },
    'elorian-fields': {
        title: "The Wounded Wolf",
        speaker: "Sentinel Lyra",
        role: "Protector of Stars",
        avatar: "avatar-fawn",
        text: `"Greetings, traveller. A noble wild wolf lies caught in a ruthless poacher's claw-trap in the Elorian fields. It is bleeding, but its eyes glow with stellar energy. Will you calm the beast and release it from the iron clutches using your Druidic Wisdom, or will you harvest its magical fur to weave relic garments?"`,
        choices: [
            {
                text: `"Calm the wolf and release it with your stardust wisdom." (Requires 10 Wisdom)`,
                condition: (state) => state.player.wisdom >= 10,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.max(0, state.world.corruption - 15);
                    state.player.harmony += 10;
                    state.player.age_seasons += 2;
                    state.player.companion = 'wolf'; // Bond with Wolf
                    
                    triggerQuestComplete("Luna the Wolf Saved", "You carefully soothed the beast and released its paw. Luna stands up in awe, bonding to your soul as a loyal guardian!", [
                        "+10 Druidic Harmony, +10 Wisdom",
                        "Aged by 2 Seasons",
                        "World Corruption decreased by 15%",
                        "Bonded Companion unlocked: Luna the Star Wolf!"
                    ]);
                }
            },
            {
                text: `"Harvest its raw magical essence and fur." (Increases Corruption)`,
                condition: (state) => true,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.min(100, state.world.corruption + 15);
                    state.player.shadow += 15;
                    state.player.age_seasons += 2;
                    
                    // Add runestone
                    for (let i = 0; i < state.player.inventory.length; i++) {
                        if (state.player.inventory[i] === null) {
                            state.player.inventory[i] = 'runestone';
                            break;
                        }
                    }
                    
                    triggerQuestComplete("Wolf Essenced", "You harvested the poor beast's essence, gaining a stardust runestone but deeply scarring the Elorian grasslands.", [
                        "+15 Shadow Magic",
                        "Aged by 2 Seasons",
                        "World Corruption increased by 15%",
                        "Acquired Relic: Glimmering Runestone"
                    ]);
                }
            }
        ]
    },
    'silent-peaks': {
        title: "The Volcanic Heart of Peaks",
        speaker: "Ignis",
        role: "Primordial Fire Spirit",
        avatar: "avatar-dragon",
        text: `"The mountain peaks scream! The volcanic furnace beneath Silent Peaks burns out of control. Elowen, the giants have awoken in sheer fury. You must quiet the volcano's raging heart. If you offer a Glimmering Runestone, we can balance the earth. If not, you must dominate the elemental core!"`,
        choices: [
            {
                text: `"Offer the ancient Runestone to calm the volcano." (Requires 1 Runestone)`,
                condition: (state) => state.player.inventory.includes('runestone'),
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.max(0, state.world.corruption - 12);
                    state.player.harmony += 15;
                    state.player.wisdom += 15;
                    state.player.age_seasons += 3;
                    
                    const idx = state.player.inventory.indexOf('runestone');
                    if (idx !== -1) state.player.inventory[idx] = null;
                    
                    triggerQuestComplete("Silent Peaks Pacified", "You offered the stellar runestone, soothing the volcanic giant's heart. The snow-clad peaks cool down into a harmonious hot spring haven.", [
                        "+15 Harmony, +15 Wisdom",
                        "Aged by 3 Seasons",
                        "World Corruption decreased by 12%",
                        "Earned Title: Forest Warden!"
                    ]);
                }
            },
            {
                text: `"Slay the fire core and bind its power to your staff." (Earn Staff of Elden, Costs Nature)`,
                condition: (state) => true,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.min(100, state.world.corruption + 20);
                    state.player.shadow += 20;
                    state.player.age_seasons += 3;
                    
                    // Add Staff
                    for (let i = 0; i < state.player.inventory.length; i++) {
                        if (state.player.inventory[i] === null) {
                            state.player.inventory[i] = 'staff-of-harmony';
                            break;
                        }
                    }
                    
                    triggerQuestComplete("Fire Core Bound", "You destroyed the volcanic giant. While the mountain spews molten ash, you bind its fiery spark to the Staff of Elden.", [
                        "+20 Shadow Magic",
                        "Aged by 3 Seasons",
                        "World Corruption increased by 20%",
                        "Acquired Relic: Staff of Elden"
                    ]);
                }
            }
        ]
    },
    'naevian-coast': {
        title: "The Siren's Tidal Call",
        speaker: "Spectral Tide Mother",
        role: "Ocean Apparition",
        avatar: "avatar-corrupted-spirit",
        text: `"Mortal... dark ocean tides are washing up on the Naevian beaches, drowning the sylvan coast in shadow froth. A magical young fawn lies stranded on a reef, crying out. Will you use a healing Wildroot to save it, or harvest its starlight life force for forbidden magic?"`,
        choices: [
            {
                text: `"Cast a coastal healing circle using Wildroot." (Requires 1 Wildroot, Restores Nature)`,
                condition: (state) => state.player.inventory.includes('wildroot'),
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.max(0, state.world.corruption - 15);
                    state.player.harmony += 15;
                    state.player.age_seasons += 2;
                    
                    const idx = state.player.inventory.indexOf('wildroot');
                    if (idx !== -1) state.player.inventory[idx] = null;
                    
                    state.player.companion = 'fawn'; // Bond Fawn
                    
                    triggerQuestComplete("Amber the Fawn Saved", "You healed the stranded fawn. Amber bonds with you, and the ocean spirits sing in pure golden light!", [
                        "+15 Druidic Harmony",
                        "Aged by 2 Seasons",
                        "World Corruption decreased by 15%",
                        "Bonded Companion unlocked: Amber the Fawn!"
                    ]);
                }
            },
            {
                text: `"Harvest the fawn's radiant coastal soul." (Increases Corruption)`,
                condition: (state) => true,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.min(100, state.world.corruption + 25);
                    state.player.shadow += 25;
                    state.player.age_seasons += 2;
                    state.player.companion = 'raven'; // Bond Raven
                    
                    triggerQuestComplete("Nature Splintered", "You drained the baby fawn's magic. The Naevian Coast turns black and toxic, and Nevermore the Shadow Raven joins your side.", [
                        "+25 Shadow Magic",
                        "Aged by 2 Seasons",
                        "World Corruption increased by 25%",
                        "Bonded Companion unlocked: Nevermore the Shadow Raven!"
                    ]);
                }
            }
        ]
    },
    'sunken-vale': {
        title: "The Portal of Fates",
        speaker: "Nereid Vanya",
        role: "Guardian of Springs",
        avatar: "avatar-vanya",
        text: `"Archdruid Elowen, you have reached the glowing lake center of the Sunken Vale. Here lies the ancient Leyline Portal. You must make your final choice: Seal the portal forever to secure absolute nature harmony, or step through to balance both pure light and deep shadow."`,
        choices: [
            {
                text: `"Seal the portal forever to purge all shadows." (Requires 20 Harmony, Pure Ending)`,
                condition: (state) => state.player.harmony >= 20,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = 0;
                    state.player.age_seasons += 4;
                    
                    triggerQuestComplete("The Great Purge (Pure Ending)", "You sealed the Sunken Portal. All shadow rot dissolves. Elydria enters an eternal golden era of spring! You are crowned as the legendary Archdruid of Elysium!", [
                        "World Corruption reduced to 0%",
                        "Elected: Grand Archdruid of Elydria!",
                        "YOU HAVE SUCCESSFULLY COMPLETED ELYDRIA!"
                    ]);
                }
            },
            {
                text: `"Step through to govern both shadow and light." (Requires 20 Shadow, Dark Ending)`,
                condition: (state) => state.player.shadow >= 20,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = 50;
                    state.player.age_seasons += 4;
                    
                    triggerQuestComplete("The Twilight Weaver (Balance Ending)", "You stepped into the void portal. You transcend mortal magic, wielding both the beautiful blooming leaves and the catastrophic shadow rot.", [
                        "World Corruption balanced at 50%",
                        "Elected: Sovereign Twilight Weaver!",
                        "YOU HAVE COMPLETED ELYDRIA'S TWILIGHT PATH!"
                    ]);
                }
            }
        ]
    },
    'withered-lands': {
        title: "The Obsidian Corruption Core",
        speaker: "Withered Avatar",
        role: "Corrupted Spirit",
        avatar: "avatar-corrupted-spirit",
        text: `"Mortal, you dare walk the Withered Lands? The ancient runes here are fractured. Will you spend your Wisdom to purify the leylines, or will you crush the core to gain the legendary Forbidden Shadow Scroll?"`,
        choices: [
            {
                text: `"Purify the corrupted leylines with stardust wisdom." (Requires 15 Wisdom)`,
                condition: (state) => state.player.wisdom >= 15,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.max(0, state.world.corruption - 20);
                    state.player.harmony += 20;
                    state.player.age_seasons += 3;
                    state.player.companion = 'owl'; // Bond Owl
                    
                    triggerQuestComplete("Withered Lands Purged", "You purged the shadow rot. Pure flowers bloom from the ash. Sage the Star Owl emerges to pledge his ancient sight to you.", [
                        "+20 Harmony, +3 Seasons Age",
                        "World Corruption decreased by 20%",
                        "Bonded Companion Unlocked: Sage the Star Owl!"
                    ]);
                }
            },
            {
                text: `"Crush the core to siphon the absolute void." (Increases Corruption)`,
                condition: (state) => true,
                action: (state, triggerQuestComplete) => {
                    state.world.corruption = Math.min(100, state.world.corruption + 30);
                    state.player.shadow += 30;
                    state.player.age_seasons += 3;
                    
                    // Add shadow scroll
                    for (let i = 0; i < state.player.inventory.length; i++) {
                        if (state.player.inventory[i] === null) {
                            state.player.inventory[i] = 'shadow-scroll';
                            break;
                        }
                    }
                    
                    triggerQuestComplete("Shadow Core Absorbed", "You shattered the obsidian rune, sending an earthquake through Elydria and unlocking absolute shadow magic.", [
                        "+30 Shadow Magic",
                        "World Corruption increased by 30%",
                        "Acquired Relic: Forbidden Shadow Scroll"
                    ]);
                }
            }
        ]
    }
};

interface GameState {
    player: {
        name: string;
        rank: string;
        age_seasons: number;
        harmony: number;
        wisdom: number;
        shadow: number;
        companion: string | null;
        inventory: (string | null)[];
        skills: Record<string, boolean>;
    };
    world: {
        corruption: number;
        regions: Record<string, { status: string; explored: boolean }>;
    };
    activeQuestKey: string | null;
    currentLocation: string | null;
}

const defaultGameState: GameState = {
    player: {
        name: "Elowen Windrider",
        rank: "Novice Druid",
        age_seasons: 72, // 18 years old * 4 seasons
        harmony: 10,
        wisdom: 10,
        shadow: 0,
        companion: null,
        inventory: ['moonflower', 'wildroot', null, null, null, null, null, null],
        skills: {
            'wild-growth': false,
            'solar-flare': false,
            'natures-grace': false,
            'spore-rot': false,
            'eclipse': false,
            'wither': false
        }
    },
    world: {
        corruption: 25,
        regions: {
            'whispering-woods': { status: 'pure', explored: false },
            'elorian-fields': { status: 'pure', explored: false },
            'silent-peaks': { status: 'pure', explored: false },
            'naevian-coast': { status: 'neutral', explored: false },
            'sunken-vale': { status: 'pure', explored: false },
            'withered-lands': { status: 'corrupted', explored: false }
        }
    },
    activeQuestKey: null,
    currentLocation: null
};

// ==========================================
// 2. MAIN REACT COMPONENT
// ==========================================

export default function ElydriaRPG() {
    // Game state hooks
    const [state, setState] = useState<GameState>(defaultGameState);
    const [activeTab, setActiveTab] = useState<'character' | 'satchel' | 'skills'>('character');
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [screenShake, setScreenShake] = useState<boolean>(false);
    const [bookOpen, setBookOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [questCompleteData, setQuestCompleteData] = useState<{
        title: string;
        desc: string;
        rewards: string[];
    } | null>(null);

    // Audio synthesizer refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    
    // Canvas particles refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Save to localStorage
    const saveState = (newState: GameState) => {
        setState(newState);
        try {
            localStorage.setItem("elydria_next_save", JSON.stringify(newState));
        } catch (e) {
            console.error("Save failure", e);
        }
    };

    // Toast alert triggers
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("elydria_next_save");
            if (saved) {
                setState(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Load failure", e);
        }
        
        // Welcome anim
        gsap.fromTo(".welcome-title", 
            { opacity: 0, y: 80, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "expo.out" }
        );
    }, []);

    // Canvas particle engine
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        interface Particle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            speedX: number;
            alpha: number;
            color: string;
        }

        const particles: Particle[] = [];
        const maxParticles = 60;

        const generateParticle = (): Particle => {
            const isPure = state.world.corruption < 50;
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 20,
                size: 2 + Math.random() * 4,
                speedY: -(0.5 + Math.random() * 1.5),
                speedX: (Math.random() - 0.5) * 0.8,
                alpha: 0.2 + Math.random() * 0.6,
                color: isPure 
                    ? (Math.random() < 0.65 ? '16, 185, 129' : '255, 215, 0')
                    : (Math.random() < 0.65 ? '139, 92, 246' : '239, 68, 68')
            };
        };

        for (let i = 0; i < maxParticles; i++) {
            particles.push(generateParticle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.y * 0.015) * 0.3;
                p.alpha -= 0.0018;

                if (p.y < -10 || p.alpha <= 0) {
                    particles[idx] = generateParticle();
                }

                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [state.world.corruption]);

    // Local Web Audio synthesizer controls
    const initSynthesizer = () => {
        if (audioContextRef.current) return;
        
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const masterGain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 drone

            filter.type = 'lowpass';
            filter.Q.setValueAtTime(3, ctx.currentTime);

            masterGain.gain.setValueAtTime(0, ctx.currentTime); // Muted initially

            osc.connect(filter);
            filter.connect(masterGain);
            masterGain.connect(ctx.destination);

            osc.start();

            oscillatorRef.current = osc;
            filterRef.current = filter;
            masterGainRef.current = masterGain;

            // Warm melodic lfo filter sweeps
            sweepFilter(ctx, filter);
        } catch (e) {
            console.error("Synthesizer launch failure:", e);
        }
    };

    const sweepFilter = (ctx: AudioContext, filter: BiquadFilterNode) => {
        const sweep = () => {
            const isPure = state.world.corruption < 50;
            const centerFreq = isPure ? 500 : 250;
            const range = isPure ? 300 : 150;
            const duration = isPure ? 4 + Math.random() * 4 : 8 + Math.random() * 4;

            filter.frequency.exponentialRampToValueAtTime(
                centerFreq + (Math.random() - 0.5) * range, 
                ctx.currentTime + duration
            );
            setTimeout(sweep, duration * 1000);
        };
        sweep();
    };

    const toggleAudio = () => {
        initSynthesizer();
        const ctx = audioContextRef.current;
        const gain = masterGainRef.current;
        if (!ctx || !gain) return;

        if (isMuted) {
            // Unmute with slow cinematic volume ramp
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);
            setIsMuted(false);
            triggerToast("🔊 Nature soundscape activated.");
        } else {
            // Mute
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setIsMuted(true);
            triggerToast("🔇 Soundscape deactivated.");
        }
    };

    // Play quick procedural synthesized sound effects
    const playSynthesizerBeep = (freq: number, dur: number, type: OscillatorType = 'sine') => {
        const ctx = audioContextRef.current;
        if (!ctx || isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + dur);
    };

    // Stat changes, actions, inventory items
    const useItem = (index: number) => {
        const itemKey = state.player.inventory[index];
        if (!itemKey) return;
        
        const dbItem = ITEM_DATABASE[itemKey];
        if (dbItem) {
            playSynthesizerBeep(440, 0.4, 'sine'); // light chime
            const copy = JSON.parse(JSON.stringify(state));
            const result = dbItem.effect(copy);
            copy.player.inventory[index] = null;
            setActiveItemIndex(null);
            saveState(copy);
            triggerToast(result.toast);
        }
    };

    const travelToRegion = (regionId: string) => {
        playSynthesizerBeep(330, 0.3, 'triangle');
        const copy: GameState = JSON.parse(JSON.stringify(state));
        copy.currentLocation = regionId;
        copy.player.age_seasons += 1; // Resande kostar 1 säsong
        saveState(copy);
        triggerToast(`✨ Traveled to ${regionId.replace('-', ' ').toUpperCase()}`);
    };

    const returnToWorldMap = () => {
        playSynthesizerBeep(220, 0.2, 'triangle');
        const copy = JSON.parse(JSON.stringify(state));
        copy.currentLocation = null;
        copy.activeQuestKey = null;
        saveState(copy);
    };

    const tryUnlockSkillNode = (skillId: string) => {
        if (state.player.skills[skillId]) {
            triggerToast("✨ Rune is already awakened!");
            return;
        }

        const skill = SKILL_DATABASE[skillId];
        if (state.player.wisdom >= skill.cost) {
            playSynthesizerBeep(880, 0.6, 'sine'); // magical chime
            
            // Trigger rumble
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 350);

            const copy = JSON.parse(JSON.stringify(state));
            copy.player.skills[skillId] = true;
            
            // Add stats
            if (skill.bonus.harmony) copy.player.harmony += skill.bonus.harmony;
            if (skill.bonus.shadow) copy.player.shadow += skill.bonus.shadow;

            saveState(copy);
            triggerToast(`🌟 Awakened Rune: ${skill.label}!`);
        } else {
            playSynthesizerBeep(180, 0.25, 'sawtooth');
            triggerToast(`⚠️ Requires ${skill.cost} Wisdom!`);
        }
    };

    // Quest flow
    const executeQuestChoice = (choice: Choice) => {
        const copy = JSON.parse(JSON.stringify(state));
        
        choice.action(copy, (title, desc, rewards) => {
            setQuestCompleteData({ title, desc, rewards });
        });

        saveState(copy);
    };

    // Calculate details
    const realAge = Math.floor(state.player.age_seasons / 4);
    const isPure = state.world.corruption < 50;

    let druidRank = "Novice Druid";
    if (realAge >= 26 || state.player.harmony >= 25 || state.player.shadow >= 25) {
        druidRank = state.player.shadow > state.player.harmony ? "Archdruid of Shadows" : "Grand Archdruid";
    } else if (realAge >= 21) {
        druidRank = state.player.shadow > state.player.harmony ? "Night Warden" : "Forest Warden";
    }

    let druidAvatar = "/assets/druid_young.png";
    if (realAge < 18) druidAvatar = "/assets/druid_child.png";
    else if (realAge < 25) druidAvatar = "/assets/druid_young.png";
    else if (realAge < 60) druidAvatar = "/assets/druid_adult.png";
    else druidAvatar = "/assets/druid_elder.png";

    return (
        <div className={`elydria-app ${isPure ? 'state-pure' : 'state-corrupted'} ${screenShake ? 'shake-active' : ''}`}>
            {/* Background Canvas Particles */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />
            
            {/* CRT filters */}
            <div className="crt-vignette" />
            <div className="scanlines-overlay" />

            {/* Letterbox margins */}
            <div className="cinematic-letterbox top" />
            <div className="cinematic-letterbox bottom" />

            {/* Welcome banner Overlay */}
            {!bookOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070908] px-8 text-center">
                    <div className="welcome-title flex flex-col items-center">
                        <span className="text-[11px] md:text-sm tracking-[0.8em] text-[#10b981] font-mono mb-4 uppercase">
                            A Playable Lore Book & RPG Prototype
                        </span>
                        <h1 className="text-7xl md:text-9xl font-bold tracking-[0.2em] font-fantasy bg-clip-text text-transparent bg-gradient-to-b from-[#ffd700] to-[#b45309] drop-shadow-[0_0_40px_rgba(180,83,9,0.3)]">
                            ELYDRIA
                        </h1>
                        <p className="max-w-2xl font-serif italic text-white/70 text-base md:text-xl leading-relaxed mt-6 mb-12">
                            "A living world shaped by stardust and deep wood leylines. Mankind is nature, together, not apart—yet understood only by the masters of the cosmic storm."
                        </p>
                        
                        <button 
                            onClick={() => {
                                setBookOpen(true);
                                initSynthesizer();
                                if (isMuted) toggleAudio();
                            }}
                            className="px-10 py-4 font-fantasy text-lg tracking-[0.25em] text-[#ffd700] border-2 border-[#ffd700]/30 hover:border-[#ffd700] bg-black/40 hover:bg-[#ffd700]/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] rounded-md transition-all cursor-pointer"
                        >
                            📖 Awaken the Chronicles
                        </button>
                    </div>
                </div>
            )}

            {/* Main Interactive Screen */}
            {bookOpen && (
                <div className="relative z-10 pt-16 pb-24 px-4 md:px-8">
                    {/* Header HUD */}
                    <header className="game-viewport fantasy-panel hud-grid z-20">
                        <div className="flex flex-col">
                            <span className="text-[9px] tracking-[0.4em] text-white/50 font-mono uppercase">Your legacy awaits</span>
                            <h2 className="text-3xl font-bold tracking-[0.15em] font-fantasy bg-gradient-to-r from-[#ffd700] to-[#fbbf24] bg-clip-text text-transparent">
                                ELYDRIA
                            </h2>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="flex justify-between w-full text-[10px] tracking-widest uppercase mb-1">
                                <span className="text-[#10b981] font-bold">🍃 Harmony ({100 - state.world.corruption}%)</span>
                                <span className="text-[#8b5cf6] font-bold">Corruption ({state.world.corruption}%) 💀</span>
                            </div>
                            <div className="balance-track">
                                <div className="balance-fill-pure" style={{ width: `${100 - state.world.corruption}%` }} />
                                <div className="balance-fill-corrupt" style={{ width: `${state.world.corruption}%` }} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={toggleAudio} className="px-3 py-2 bg-black/60 border border-white/10 hover:border-white/30 rounded text-sm cursor-pointer" title="Toggle audio track">
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem("elydria_next_save");
                                    setState(JSON.parse(JSON.stringify(defaultGameState)));
                                    triggerToast("🔄 Journey reset to Child!");
                                }} 
                                className="px-4 py-2 bg-red-950/40 border border-red-500/20 hover:border-red-500/50 text-red-200 text-xs tracking-wider rounded font-fantasy cursor-pointer"
                            >
                                RESET
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Lorebook Chapters */}
                    <section className="game-viewport my-12">
                        <div className="text-center mb-10">
                            <h2 className="text-sm tracking-[0.6em] text-[#ffd700] uppercase font-mono mb-2">Chapters of Elydria</h2>
                            <h3 className="text-4xl font-fantasy font-bold tracking-widest text-white">THE DRUIDIC CIVILIZATIONS</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Chapter 1: The Shifters */}
                            <div className="fantasy-panel p-6 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                                <div>
                                    <div className="text-3xl mb-3">🐺</div>
                                    <h4 className="text-xl font-bold font-fantasy text-[#10b981] mb-2 tracking-wide">1. THE SHIFTERS</h4>
                                    <p className="font-serif italic text-white/50 text-sm mb-4">"Mankind is nature itself."</p>
                                    <p className="text-white/70 text-xs leading-relaxed font-serif">
                                        Primal druids who rejected civilization. They integrated deep into the Whispering Woods, shedding human forms to walk as sylvan wolves, shadow panthers, and high forest bears. They wield direct savage instincts.
                                    </p>
                                </div>
                                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] tracking-widest uppercase text-white/40 group-hover:text-[#ffd700] transition-colors">
                                    Path of Savage Transformation &rarr;
                                </div>
                            </div>

                            {/* Chapter 2: The Beastmasters */}
                            <div className="fantasy-panel p-6 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                                <div>
                                    <div className="text-3xl mb-3">🦌</div>
                                    <h4 className="text-xl font-bold font-fantasy text-[#ffd700] mb-2 tracking-wide">2. THE BEASTMASTERS</h4>
                                    <p className="font-serif italic text-white/50 text-sm mb-4">"Together, not apart."</p>
                                    <p className="text-white/70 text-xs leading-relaxed font-serif">
                                        Philosophers of direct union. They believe in sacred spiritual bonds between intelligent life forms and woodland beast gods, maintaining the cosmic sanctuary lines of the Elorian fields and Sunken pools.
                                    </p>
                                </div>
                                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] tracking-widest uppercase text-white/40 group-hover:text-[#ffd700] transition-colors">
                                    Path of Sacred Guardianship &rarr;
                                </div>
                            </div>

                            {/* Chapter 3: The Elementalists */}
                            <div className="fantasy-panel p-6 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                                <div>
                                    <div className="text-3xl mb-3">✨</div>
                                    <h4 className="text-xl font-bold font-fantasy text-[#8b5cf6] mb-2 tracking-wide">3. THE ELEMENTALISTS</h4>
                                    <p className="font-serif italic text-white/50 text-sm mb-4">"The world must be understood."</p>
                                    <p className="text-white/70 text-xs leading-relaxed font-serif">
                                        Master builders who carved floating castles and stone arrays into the Silent Peaks. They tamed wind, lightning, and geothermal lava flows to fuel colossal stellar devices, culminating in the tragic Sundering.
                                    </p>
                                </div>
                                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] tracking-widest uppercase text-white/40 group-hover:text-[#ffd700] transition-colors">
                                    Path of Ancient Technology &rarr;
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Game Interface Split screen */}
                    <div className="game-viewport grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left column (Tabs & Profile sheet) */}
                        <aside className="lg:col-span-4 fantasy-panel p-5">
                            <div className="sidebar-nav-tabs">
                                <button 
                                    onClick={() => setActiveTab('character')}
                                    className={`sidebar-tab-btn ${activeTab === 'character' ? 'active' : ''}`}
                                >
                                    DRUID
                                </button>
                                <button 
                                    onClick={() => setActiveTab('satchel')}
                                    className={`sidebar-tab-btn ${activeTab === 'satchel' ? 'active' : ''}`}
                                >
                                    SATCHEL
                                </button>
                                <button 
                                    onClick={() => setActiveTab('skills')}
                                    className={`sidebar-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                                >
                                    GROWTH
                                </button>
                            </div>

                            {/* TAB 1: Character profile */}
                            {activeTab === 'character' && (
                                <div className="fade-in duration-300">
                                    <div className="text-center py-4">
                                        <div className="mb-4">
                                            <CinematicCharacter 
                                                harmony={state.player.harmony}
                                                shadow={state.player.shadow}
                                                wisdom={state.player.wisdom}
                                                companion={state.player.companion}
                                                isMuted={isMuted}
                                            />
                                        </div>
                                        <h3 className="font-fantasy text-xl font-bold tracking-wide text-white">{state.player.name}</h3>
                                        <span className="text-[#ffd700] text-xs font-mono tracking-widest uppercase block mt-1">{druidRank}</span>
                                        <span className="text-white/50 text-[10px] block mt-1">Year {Math.floor(state.player.age_seasons / 4)} • Season {state.player.age_seasons % 4 + 1}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 my-4">
                                        <div className="stat-metric-card" title="Your power over plants and healing spells">
                                            <span className="text-lg font-bold text-[#10b981] block">{state.player.harmony}</span>
                                            <span className="text-[9px] tracking-widest uppercase text-white/40 block mt-1">Harmony</span>
                                        </div>
                                        <div className="stat-metric-card" title="Your capacity to spend on Awakening Skills">
                                            <span className="text-lg font-bold text-[#ffd700] block">{state.player.wisdom}</span>
                                            <span className="text-[9px] tracking-widest uppercase text-white/40 block mt-1">Wisdom</span>
                                        </div>
                                        <div className="stat-metric-card" title="Your dark druidic void power">
                                            <span className="text-lg font-bold text-[#8b5cf6] block">{state.player.shadow}</span>
                                            <span className="text-[9px] tracking-widest uppercase text-white/40 block mt-1">Shadow</span>
                                        </div>
                                    </div>

                                    {/* Active Companion Slot */}
                                    <div className="border-t border-white/5 pt-4 mt-6">
                                        <h4 className="font-fantasy text-xs tracking-widest uppercase text-white/70 mb-3 text-center">Bonded Guardian</h4>
                                        {state.player.companion ? (
                                            <div className="flex gap-4 p-3 bg-black/40 border border-white/5 rounded-lg items-center">
                                                <div className="text-3xl bg-black/60 p-2 rounded-full border border-white/10">
                                                    {COMPANION_DATABASE[state.player.companion].icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-fantasy text-sm text-[#ffd700] font-bold">{COMPANION_DATABASE[state.player.companion].name}</h5>
                                                    <span className="text-[9px] text-white/40 italic block mt-1">{COMPANION_DATABASE[state.player.companion].trait}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6 border border-dashed border-white/10 rounded-lg text-xs font-serif text-white/40">
                                                🐾 No active companion. Walk the leylines to find wild spirits.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Satchel Reliquary */}
                            {activeTab === 'satchel' && (
                                <div className="fade-in duration-300">
                                    <h4 className="font-fantasy text-sm tracking-widest uppercase text-white/80 mb-3 text-center">Relics Reliquary</h4>
                                    <div className="reliquary-grid">
                                        {state.player.inventory.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => item && setActiveItemIndex(activeItemIndex === idx ? null : idx)}
                                                className={`reliquary-slot ${activeItemIndex === idx ? 'active-item' : ''} ${!item ? 'opacity-30' : ''}`}
                                            >
                                                {item ? ITEM_DATABASE[item].icon : ''}
                                            </div>
                                        ))}
                                    </div>

                                    {activeItemIndex !== null && state.player.inventory[activeItemIndex] && (
                                        <div className="p-4 bg-black/40 border border-white/5 rounded-lg mt-5 flex flex-col gap-2">
                                            <h5 className="font-fantasy text-[#ffd700] text-sm font-bold">
                                                {ITEM_DATABASE[state.player.inventory[activeItemIndex]!].name}
                                            </h5>
                                            <p className="text-white/60 text-xs font-serif leading-relaxed">
                                                {ITEM_DATABASE[state.player.inventory[activeItemIndex]!].desc}
                                            </p>
                                            <button 
                                                onClick={() => useItem(activeItemIndex!)}
                                                className="w-full py-2 bg-[#10b981]/20 hover:bg-[#10b981]/40 border border-[#10b981]/30 text-white font-fantasy text-xs tracking-widest uppercase block rounded transition-all cursor-pointer"
                                            >
                                                Use Relic
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: Skill Unlock Tree */}
                            {activeTab === 'skills' && (
                                <div className="fade-in duration-300">
                                    <h4 className="font-fantasy text-sm tracking-widest uppercase text-white/80 mb-3 text-center">Awaken Runic Skills</h4>
                                    
                                    <div className="runic-skill-container">
                                        <div className="runic-node-btn core" title="Elowen Windrider's Core Soul">
                                            🌳
                                        </div>

                                        <div className="skill-path-title purity-title font-fantasy mt-4">Harmony Path</div>
                                        <div className="skills-row mt-2">
                                            <button 
                                                onClick={() => tryUnlockSkillNode('wild-growth')}
                                                className={`runic-node-btn purity ${state.player.skills['wild-growth'] ? 'unlocked' : ''}`}
                                            >
                                                🍃
                                                <span className="runic-tooltip-box">
                                                    <strong>Wild Growth</strong><br/>Requires 10 Wisdom.<br/>+5 Harmony. Purify forest.
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => tryUnlockSkillNode('solar-flare')}
                                                className={`runic-node-btn purity ${state.player.skills['solar-flare'] ? 'unlocked' : ''}`}
                                            >
                                                ✨
                                                <span className="runic-tooltip-box">
                                                    <strong>Solar Flare</strong><br/>Requires 15 Wisdom.<br/>+8 Harmony. Dispel shadow.
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => tryUnlockSkillNode('natures-grace')}
                                                className={`runic-node-btn purity ${state.player.skills['natures-grace'] ? 'unlocked' : ''}`}
                                            >
                                                🌸
                                                <span className="runic-tooltip-box">
                                                    <strong>Nature's Grace</strong><br/>Requires 20 Wisdom.<br/>+12 Harmony. Bond animals.
                                                </span>
                                            </button>
                                        </div>

                                        <div className="skill-path-title shadow-title font-fantasy mt-6">Shadow Path</div>
                                        <div className="skills-row mt-2">
                                            <button 
                                                onClick={() => tryUnlockSkillNode('spore-rot')}
                                                className={`runic-node-btn shadow ${state.player.skills['spore-rot'] ? 'unlocked' : ''}`}
                                            >
                                                🍄
                                                <span className="runic-tooltip-box">
                                                    <strong>Spore Rot</strong><br/>Requires 10 Wisdom.<br/>+5 Shadow. Spread rot.
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => tryUnlockSkillNode('eclipse')}
                                                className={`runic-node-btn shadow ${state.player.skills['eclipse'] ? 'unlocked' : ''}`}
                                            >
                                                🌑
                                                <span className="runic-tooltip-box">
                                                    <strong>Eclipse</strong><br/>Requires 15 Wisdom.<br/>+8 Shadow. Channel void.
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => tryUnlockSkillNode('wither')}
                                                className={`runic-node-btn shadow ${state.player.skills['wither'] ? 'unlocked' : ''}`}
                                            >
                                                💀
                                                <span className="runic-tooltip-box">
                                                    <strong>Wither</strong><br/>Requires 20 Wisdom.<br/>+12 Shadow. Consume decay.
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </aside>

                        {/* Right column (Map, Lore and Active Quest views) */}
                        <main className="lg:col-span-8 flex flex-col gap-6">
                            
                            {/* VIEW 1: Interactive parchment World Map */}
                            {state.currentLocation === null && (
                                <div className="fantasy-panel p-5">
                                    <div className="text-center mb-4">
                                        <span className="text-[10px] tracking-[0.4em] text-[#ffd700] uppercase font-mono block">Tactical parchment overlay</span>
                                        <h3 className="text-xl font-bold font-fantasy text-white tracking-widest mt-1">THE SHATTERED CONTINENT</h3>
                                    </div>

                                    <div className="map-canvas-container relative aspect-[1.53] w-full">
                                        <svg viewBox="0 0 1000 650" className="w-full h-full">
                                            {/* Grid layout lines */}
                                            <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 0,400 L 1000,400 M 0,500 L 1000,500 M 100,0 L 100,650 M 200,0 L 200,650 M 300,0 L 300,650 M 400,0 L 400,650 M 500,0 L 500,650 M 600,0 L 600,650 M 700,0 L 700,650 M 800,0 L 800,650 M 900,0 L 900,650" stroke="rgba(255,215,0,0.03)" strokeWidth="1" fill="none"/>
                                            
                                            {/* Whispering Woods */}
                                            <path 
                                                onClick={() => travelToRegion('whispering-woods')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 100,80 Q 200,40 320,90 Q 380,180 300,260 Q 180,280 120,200 Q 80,140 100,80 Z" 
                                            />
                                            {/* Elorian Fields */}
                                            <path 
                                                onClick={() => travelToRegion('elorian-fields')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 320,90 Q 450,40 550,110 Q 560,200 450,230 Q 380,180 300,260 Q 350,160 320,90 Z" 
                                            />
                                            {/* Silent Peaks */}
                                            <path 
                                                onClick={() => travelToRegion('silent-peaks')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 550,110 Q 700,40 850,100 Q 920,180 850,280 Q 720,300 600,240 Q 560,200 550,110 Z" 
                                            />
                                            {/* Naevian Coast */}
                                            <path 
                                                onClick={() => travelToRegion('naevian-coast')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 80,220 Q 200,280 220,380 Q 200,480 100,460 Q 50,400 80,220 Z" 
                                            />
                                            {/* Sunken Vale */}
                                            <path 
                                                onClick={() => travelToRegion('sunken-vale')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 280,360 Q 450,300 550,380 Q 500,520 380,540 Q 250,480 280,360 Z" 
                                            />
                                            {/* Withered Lands */}
                                            <path 
                                                onClick={() => travelToRegion('withered-lands')}
                                                className={`map-path-region ${state.world.corruption >= 50 ? 'corrupted' : ''}`}
                                                d="M 620,260 Q 780,280 880,360 Q 900,500 780,520 Q 650,480 600,380 Q 600,320 620,260 Z" 
                                            />
                                        </svg>

                                        {/* Floating dynamic status labels */}
                                        <div className="floating-map-label" style={{ top: '15%', left: '22%' }}>
                                            <span className="font-fantasy text-white text-[11px]">Whispering Woods</span>
                                            <span className={`text-[8px] mt-1 font-bold ${state.world.corruption >= 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {state.world.corruption >= 50 ? '💀 CORRUPTED' : '🍃 SACRED'}
                                            </span>
                                        </div>
                                        <div className="floating-map-label" style={{ top: '14%', left: '45%' }}>
                                            <span className="font-fantasy text-white text-[11px]">Elorian Fields</span>
                                            <span className="text-[8px] mt-1 font-bold text-emerald-500">🌾 MEADOWS</span>
                                        </div>
                                        <div className="floating-map-label" style={{ top: '15%', left: '74%' }}>
                                            <span className="font-fantasy text-white text-[11px]">The Silent Peaks</span>
                                            <span className="text-[8px] mt-1 font-bold text-cyan-400">❄️ PEAKS</span>
                                        </div>
                                        <div className="floating-map-label" style={{ top: '50%', left: '16%' }}>
                                            <span className="font-fantasy text-white text-[11px]">Naevian Coast</span>
                                            <span className="text-[8px] mt-1 font-bold text-blue-400">🌊 OCEAN</span>
                                        </div>
                                        <div className="floating-map-label" style={{ top: '60%', left: '45%' }}>
                                            <span className="font-fantasy text-white text-[11px]">The Sunken Vale</span>
                                            <span className="text-[8px] mt-1 font-bold text-[#ffd700]">✨ SPRINGS</span>
                                        </div>
                                        <div className="floating-map-label" style={{ top: '55%', left: '76%' }}>
                                            <span className="font-fantasy text-white text-[11px]">The Withered Lands</span>
                                            <span className="text-[8px] mt-1 font-bold text-purple-500">🌫️ OBSIDIAN</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VIEW 2: Region Travel Lore details */}
                            {state.currentLocation !== null && state.activeQuestKey === null && !questCompleteData && (
                                <div className="fantasy-panel p-6 flex flex-col gap-6 fade-in duration-300">
                                    <button 
                                        onClick={returnToWorldMap}
                                        className="self-start text-white/50 hover:text-white font-fantasy text-xs tracking-wider cursor-pointer"
                                    >
                                        &larr; Return to Map
                                    </button>

                                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                        <h3 className="text-3xl font-fantasy font-bold text-[#10b981] tracking-widest uppercase">
                                            {state.currentLocation.replace('-', ' ')}
                                        </h3>
                                        <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest border ${
                                            state.world.corruption >= 50 ? 'border-red-500 bg-red-950/20 text-red-400' : 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                                        }`}>
                                            {state.world.corruption >= 50 ? '💀 SHADOW ROT' : '🍃 SACRED PURE'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                                        {/* Visual card */}
                                        <div className="md:col-span-2 aspect-[0.8] w-full rounded-lg border border-white/5 relative overflow-hidden bg-cover bg-center flex flex-col justify-end p-4 shadow-lg
                                            whispering-woods-visual"
                                            style={{ backgroundImage: `url('/assets/speaker_${state.currentLocation === 'elorian-fields' ? 'lyra' : state.currentLocation === 'silent-peaks' ? 'ignis' : state.currentLocation === 'sunken-vale' ? 'vanya' : 'corin'}.png')` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                            <span className="relative z-10 text-[9px] tracking-widest uppercase text-white/60 font-mono">Territorial Guardianship</span>
                                            <h4 className="relative z-10 font-fantasy text-[#ffd700] text-sm font-bold mt-1">Sacred Sanctum</h4>
                                        </div>

                                        <div className="md:col-span-3 flex flex-col gap-4">
                                            <h4 className="font-fantasy text-sm text-[#ffd700] tracking-widest uppercase border-b border-white/5 pb-1">Historical Leylines</h4>
                                            <p className="font-serif text-white/70 text-sm leading-relaxed">
                                                {QUEST_DATABASE[state.currentLocation] ? QUEST_DATABASE[state.currentLocation].text.substring(0, 160) + '...' : 'An ancient root leylines cluster where different druid tribes fought during the Sundering crisis.'}
                                            </p>
                                            
                                            <button 
                                                onClick={() => {
                                                    playSynthesizerBeep(440, 0.35, 'sine');
                                                    const copy = JSON.parse(JSON.stringify(state));
                                                    copy.activeQuestKey = state.currentLocation;
                                                    saveState(copy);
                                                }}
                                                className="self-end mt-4 px-6 py-3 bg-[#10b981]/20 hover:bg-[#10b981]/40 border border-[#10b981]/30 text-white font-fantasy text-xs tracking-widest uppercase rounded transition-all cursor-pointer"
                                            >
                                                Begin Exploring
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VIEW 3: Dialogue / Quest view */}
                            {state.activeQuestKey !== null && !questCompleteData && (
                                <div className="fantasy-panel p-6 flex flex-col gap-6 fade-in duration-300">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] tracking-[0.3em] text-[#10b981] font-mono uppercase">Sacred mission active</span>
                                            <h3 className="text-xl font-bold font-fantasy text-white tracking-widest mt-1">
                                                {QUEST_DATABASE[state.activeQuestKey].title}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-fantasy text-[#ffd700] text-sm font-bold block">
                                                {QUEST_DATABASE[state.activeQuestKey].speaker}
                                            </span>
                                            <span className="text-white/40 text-[9px] tracking-widest uppercase block mt-0.5">
                                                {QUEST_DATABASE[state.activeQuestKey].role}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        <div className="md:col-span-3 flex justify-center">
                                            <div 
                                                className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-[#ffd700] bg-cover bg-center shadow-md avatar-custom"
                                                style={{ backgroundImage: `url('/assets/speaker_${state.activeQuestKey === 'elorian-fields' ? 'lyra' : state.activeQuestKey === 'silent-peaks' ? 'ignis' : state.activeQuestKey === 'sunken-vale' ? 'vanya' : 'corin'}.png')` }}
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-9 p-4 bg-black/40 border border-white/5 rounded-lg">
                                            <p className="font-dialogue text-white/80 text-base md:text-lg italic leading-relaxed">
                                                {QUEST_DATABASE[state.activeQuestKey].text}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Choice list */}
                                    <div className="flex flex-col gap-3 mt-4">
                                        {QUEST_DATABASE[state.activeQuestKey].choices.map((choice, index) => {
                                            const allowed = choice.condition(state);
                                            const isDark = choice.text.toLowerCase().includes('dark') || choice.text.toLowerCase().includes('absorb') || choice.text.toLowerCase().includes('slay') || choice.text.toLowerCase().includes('harvest') || choice.text.toLowerCase().includes('decay') || choice.text.toLowerCase().includes('crush');
                                            
                                            return (
                                                <button
                                                    key={index}
                                                    disabled={!allowed}
                                                    onClick={() => executeQuestChoice(choice)}
                                                    className={`w-full text-left p-4 rounded-lg border font-serif text-sm flex gap-3 transition-all cursor-pointer
                                                        ${!allowed 
                                                            ? 'opacity-40 border-white/5 bg-black/25 cursor-not-allowed text-white/30' 
                                                            : isDark 
                                                                ? 'border-red-500/25 bg-red-950/5 hover:bg-red-950/20 hover:border-red-500/60 text-white/80' 
                                                                : 'border-[#10b981]/25 bg-[#10b981]/5 hover:bg-[#10b981]/20 hover:border-[#10b981]/60 text-white/80'
                                                        }`}
                                                >
                                                    <span className={`font-bold font-fantasy ${isDark ? 'text-red-400' : 'text-[#10b981]'}`}>{index + 1}.</span>
                                                    <span>{choice.text} {!allowed ? '(Missing Relic requirements)' : ''}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* VIEW 4: Quest Completed modal */}
                            {questCompleteData && (
                                <div className="fantasy-panel p-8 text-center flex flex-col items-center gap-4 fade-in duration-300">
                                    <span className="text-5xl">{state.world.corruption >= 50 ? '💀' : '🌟'}</span>
                                    <h3 className="text-3xl font-fantasy font-bold text-white tracking-widest animate-pulse uppercase">
                                        Quest Concluded
                                    </h3>
                                    
                                    <div className="glass-panel p-5 max-w-xl border border-white/5 rounded-lg bg-black/40 mt-2">
                                        <h4 className="font-fantasy text-[#ffd700] text-lg font-bold">{questCompleteData.title}</h4>
                                        <p className="font-serif text-white/70 text-sm leading-relaxed mt-2 mb-4">
                                            {questCompleteData.desc}
                                        </p>
                                        
                                        <div className="text-left border-t border-white/5 pt-3">
                                            <h5 className="font-fantasy text-[10px] tracking-widest uppercase text-white/40 mb-2">Ramifications</h5>
                                            <ul className="list-disc list-inside text-xs font-serif text-[#10b981] flex flex-col gap-1.5">
                                                {questCompleteData.rewards.map((reward, i) => (
                                                    <li key={i} className={reward.includes('Shadow') ? 'text-purple-400' : 'text-[#10b981]'}>{reward}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setQuestCompleteData(null);
                                            returnToWorldMap();
                                        }}
                                        className="mt-6 px-10 py-3 bg-[#ffd700]/10 hover:bg-[#ffd700]/20 border border-[#ffd700]/30 text-[#ffd700] font-fantasy text-xs tracking-widest uppercase rounded transition-all cursor-pointer"
                                    >
                                        Return to Chronicle Map
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>

                    {/* HUD toast alerts */}
                    {toastMessage && (
                        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 border border-[#ffd700]/30 px-6 py-3 rounded shadow-lg text-xs font-fantasy tracking-wider text-white z-50 animate-bounce">
                            ✨ {toastMessage}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ==========================================
// 3. STATS SKILLS CONFIG DATABASE
// ==========================================

interface SkillConfig {
    cost: number;
    type: string;
    bonus: { harmony?: number; shadow?: number };
    label: string;
}

const SKILL_DATABASE: Record<string, SkillConfig> = {
    'wild-growth': { cost: 10, type: 'purity', bonus: { harmony: 5 }, label: 'Wild Growth' },
    'solar-flare': { cost: 15, type: 'purity', bonus: { harmony: 8 }, label: 'Solar Flare' },
    'natures-grace': { cost: 20, type: 'purity', bonus: { harmony: 12 }, label: "Nature's Grace" },
    'spore-rot': { cost: 10, type: 'shadow', bonus: { shadow: 5 }, label: 'Spore Rot' },
    'eclipse': { cost: 15, type: 'shadow', bonus: { shadow: 8 }, label: 'Eclipse' },
    'wither': { cost: 20, type: 'shadow', bonus: { shadow: 12 }, label: 'Wither' }
};
