"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CinematicCharacterProps {
    harmony: number;
    shadow: number;
    wisdom: number;
    companion: string | null;
    isMuted: boolean;
}

export default function CinematicCharacter({
    harmony,
    shadow,
    wisdom,
    companion,
    isMuted
}: CinematicCharacterProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Weather States
    const [weather, setWeather] = useState<'clear' | 'rain' | 'snow' | 'storm'>('clear');
    const [mudAmount, setMudAmount] = useState<number>(10); // 0 to 100
    const [snowAmount, setSnowAmount] = useState<number>(0); // 0 to 100
    const [wetness, setWetness] = useState<number>(20); // 0 to 100
    const [windStrength, setWindStrength] = useState<number>(30); // 0 to 100

    // Animation States
    const [stance, setStance] = useState<'idle' | 'walk' | 'run' | 'combat' | 'jump'>('idle');
    const [showHood, setShowHood] = useState<boolean>(true);
    const [equippedStaff, setEquippedStaff] = useState<boolean>(true);
    const [activeTerrain, setActiveTerrain] = useState<'grass' | 'mud' | 'snow' | 'stone'>('grass');

    // Controls Status
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const keysPressed = useRef<{ [key: string]: boolean }>({});

    // References for Three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    // Character Mesh & Bone Group References
    const characterGroup = useRef<THREE.Group | null>(null);
    const bodyTorso = useRef<THREE.Mesh | null>(null);
    const headGroup = useRef<THREE.Group | null>(null);
    const leftEye = useRef<THREE.Mesh | null>(null);
    const rightEye = useRef<THREE.Mesh | null>(null);
    
    // Limb hierarchies
    const leftArmGroup = useRef<THREE.Group | null>(null);
    const rightArmGroup = useRef<THREE.Group | null>(null);
    const leftLegGroup = useRef<THREE.Group | null>(null);
    const rightLegGroup = useRef<THREE.Group | null>(null);
    const staffGroup = useRef<THREE.Group | null>(null);

    // Cloth and Hair segments for physics
    const capeMesh = useRef<THREE.Mesh | null>(null);
    const hairStrands = useRef<THREE.Group[]>([]);
    
    // Environmental / Particle systems
    const weatherParticles = useRef<THREE.Points | null>(null);
    const weatherParticleCount = 800;
    const weatherParticleData = useRef<{ x: number; y: number; z: number; sy: number; sx: number }[]>([]);

    const footstepParticles = useRef<THREE.Points | null>(null);
    const footstepPool = useRef<{ mesh: THREE.Mesh; age: number; maxAge: number; type: string }[]>([]);

    // Procedural Sound Synth (Web Audio API)
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Animation control parameters
    const animTime = useRef<number>(0);
    const walkPhase = useRef<number>(0);
    const runPhase = useRef<number>(0);
    const jumpPhase = useRef<number>(0); // 0 = ground, 1 = peak, 2 = landing
    const jumpProgress = useRef<number>(0); // 0 to 1
    const targetBodyRotation = useRef<number>(0);
    const currentBodyRotation = useRef<number>(0);
    const bodySpeed = useRef<number>(0);
    const momentum = useRef<THREE.Vector3>(new THREE.Vector3());
    const cameraShake = useRef<number>(0);
    const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Blink timer
    const blinkTimer = useRef<number>(0);
    const isBlinking = useRef<boolean>(false);

    // Sound effect synthesis for realistic footsteps
    const playSynthesizedFootstep = (terrain: 'grass' | 'mud' | 'snow' | 'stone', speedMultiplier: number = 1.0) => {
        if (isMuted) return;
        try {
            if (!audioCtxRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gainNode = ctx.createGain();

            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            if (terrain === 'grass') {
                // Soft sweeping high-pass rustle
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.12);

                filter.type = 'highpass';
                filter.frequency.setValueAtTime(800, now);
                filter.frequency.exponentialRampToValueAtTime(3000, now + 0.1);

                gainNode.gain.setValueAtTime(0.04 * speedMultiplier, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

                osc.start(now);
                osc.stop(now + 0.16);
            } else if (terrain === 'stone') {
                // Crisp wood/stone resonance tap
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1200, now);

                gainNode.gain.setValueAtTime(0.06 * speedMultiplier, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

                osc.start(now);
                osc.stop(now + 0.11);
            } else if (terrain === 'snow') {
                // Squelchy crunch low-pass noise sweep
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.linearRampToValueAtTime(30, now + 0.2);

                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(400, now);
                filter.frequency.exponentialRampToValueAtTime(100, now + 0.18);

                gainNode.gain.setValueAtTime(0.07 * speedMultiplier, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.start(now);
                osc.stop(now + 0.22);
            } else if (terrain === 'mud') {
                // Heavy, wet squelch sweep
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(90, now);
                osc.frequency.exponentialRampToValueAtTime(15, now + 0.25);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, now);
                filter.frequency.linearRampToValueAtTime(50, now + 0.2);

                gainNode.gain.setValueAtTime(0.08 * speedMultiplier, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

                osc.start(now);
                osc.stop(now + 0.3);
            }
        } catch (err) {
            console.error("Synthesizer step failed", err);
        }
    };

    // Emit footstep particles (leaves/snow/splashes)
    const emitFootstepEffect = (x: number, z: number, terrain: 'grass' | 'mud' | 'snow' | 'stone') => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;

        // Colors based on terrain
        let color = 0x10b981; // emerald grass
        if (terrain === 'snow') color = 0xffffff;
        if (terrain === 'mud') color = 0x4a3b32; // dark brown mud
        if (terrain === 'stone') color = 0xffd700; // runic golden sparks

        // Create ring helper
        const ringGeo = new THREE.RingGeometry(0.05, 0.2, 8);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, 0.02, z);
        scene.add(ring);

        // Add to pools
        footstepPool.current.push({
            mesh: ring,
            age: 0,
            maxAge: 40,
            type: 'ring'
        });

        // Add small splashes / sparks
        const count = terrain === 'stone' ? 8 : 5;
        for (let i = 0; i < count; i++) {
            const size = 0.03 + Math.random() * 0.05;
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.9
            });
            const p = new THREE.Mesh(geo, mat);
            
            // Random splash velocity
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.05 + Math.random() * 0.15;
            p.position.set(x + Math.cos(angle) * radius, 0.04, z + Math.sin(angle) * radius);
            
            const velocity = new THREE.Vector3(
                Math.cos(angle) * (0.01 + Math.random() * 0.02),
                0.03 + Math.random() * 0.05,
                Math.sin(angle) * (0.01 + Math.random() * 0.02)
            );
            
            scene.add(p);
            
            footstepPool.current.push({
                mesh: p,
                age: 0,
                maxAge: 25 + Math.floor(Math.random() * 15),
                type: 'spark'
            });

            // Attach dynamic velocity as custom property
            (p as any).velocity = velocity;
        }
    };

    // Track mouse rotation inside canvas
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mousePos.current = {
                x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
                y: -((e.clientY - rect.top) / rect.height) * 2 + 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Stance keyboard trigger listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFocused) return;
            keysPressed.current[e.key.toLowerCase()] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key.toLowerCase()] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isFocused]);

    // Handle environment settings triggers
    useEffect(() => {
        if (weather === 'rain') {
            setWetness(90);
            setWindStrength(60);
            setSnowAmount(0);
        } else if (weather === 'snow') {
            setWetness(30);
            setWindStrength(30);
            setSnowAmount(80);
        } else if (weather === 'storm') {
            setWetness(60);
            setWindStrength(100);
            setMudAmount(50);
            setSnowAmount(10);
        } else {
            setWindStrength(20);
            setWetness(Math.max(10, wetness - 15));
            setSnowAmount(Math.max(0, snowAmount - 20));
        }
    }, [weather]);

    // Init Three.js Renderer
    useEffect(() => {
        if (!canvasRef.current) return;

        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;

        // 1. Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(0x0a0c0b, 0.08);

        // Weather tint background
        if (weather === 'clear') {
            scene.background = new THREE.Color(0x060807);
            scene.fog.color.setHex(0x060807);
        } else if (weather === 'rain') {
            scene.background = new THREE.Color(0x080b0e);
            scene.fog.color.setHex(0x080b0e);
        } else if (weather === 'snow') {
            scene.background = new THREE.Color(0x101316);
            scene.fog.color.setHex(0x101316);
        } else {
            scene.background = new THREE.Color(0x0a060d); // purple storm/corrupt
            scene.fog.color.setHex(0x0a060d);
        }

        // 2. Camera setup
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 1.8, 4.2);
        cameraRef.current = camera;

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // 4. Lighting setup (Cinematic high contrast shadows)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
        scene.add(ambientLight);

        // Warm stardust directional key light
        const dirLight = new THREE.DirectionalLight(0xfff3d1, 1.5);
        dirLight.position.set(5, 8, 4);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.bias = -0.001;
        scene.add(dirLight);

        // Fill Light (Cool emerald/violet hue depending on path)
        const fillLightColor = shadow > harmony ? 0x8b5cf6 : 0x10b981;
        const fillLight = new THREE.DirectionalLight(fillLightColor, 0.8);
        fillLight.position.set(-4, 3, -2);
        scene.add(fillLight);

        // Dynamic spot/rim light highlighting shoulders and hood edges
        const rimLight = new THREE.SpotLight(0xffffff, 3.0, 8, Math.PI / 6, 0.5, 1);
        rimLight.position.set(0, 5, -3);
        rimLight.target.position.set(0, 1, 0);
        scene.add(rimLight);
        scene.add(rimLight.target);

        // 5. Floor/Terrain plane
        const floorGeo = new THREE.PlaneGeometry(20, 20, 10, 10);
        
        // Colors based on path (shadow vs harmony)
        const groundBaseColor = shadow > harmony ? new THREE.Color(0x130a1c) : new THREE.Color(0x0e1713);
        
        const floorMat = new THREE.MeshStandardMaterial({
            color: groundBaseColor,
            roughness: 0.85,
            metalness: 0.05,
            flatShading: true
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Dynamic light paths / leyline runs on floor
        const gridHelper = new THREE.GridHelper(10, 10, fillLightColor, 0x222222);
        gridHelper.position.y = 0.005;
        scene.add(gridHelper);

        // ==========================================
        // 6. BUILD PROCEDURAL 3D CHARACTER (ELOWEN)
        // ==========================================
        const charGroup = new THREE.Group();
        charGroup.position.set(0, 0, 0);
        scene.add(charGroup);
        characterGroup.current = charGroup;

        // Custom organic shaders or premium materials
        const skinMat = new THREE.MeshStandardMaterial({
            color: 0xe8c3a7,
            roughness: 0.6,
            metalness: 0.0
        });

        // Layered fantasy fabrics: Tunic (emerald green / deep charcoal)
        const fabricColor = shadow > harmony ? 0x2a173d : 0x143c2c;
        const tunicMat = new THREE.MeshStandardMaterial({
            color: fabricColor,
            roughness: 0.9,
            metalness: 0.05,
            flatShading: true
        });

        // Leather shoulder armor and vest (rich weathered brown)
        const leatherMat = new THREE.MeshStandardMaterial({
            color: 0x3d2314,
            roughness: 0.7,
            metalness: 0.1
        });

        // Runic glowing gold details
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.15,
            metalness: 0.9
        });

        // 6a. Main body torso
        const torsoGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.9, 12);
        const torso = new THREE.Mesh(torsoGeo, tunicMat);
        torso.position.y = 1.05;
        torso.castShadow = true;
        torso.receiveShadow = true;
        charGroup.add(torso);
        bodyTorso.current = torso;

        // Add leather breastplate vest on top of torso
        const vestGeo = new THREE.CylinderGeometry(0.21, 0.29, 0.5, 12);
        const vest = new THREE.Mesh(vestGeo, leatherMat);
        vest.position.y = 0.1;
        torso.add(vest);

        // Add gold ornate neck trim and leylines on the vest
        const runeVest = new THREE.Mesh(
            new THREE.CylinderGeometry(0.215, 0.215, 0.08, 12),
            goldMat
        );
        runeVest.position.y = 0.22;
        torso.add(runeVest);

        // 6b. Humanoid Head & Face structure
        const head = new THREE.Group();
        head.position.set(0, 0.6, 0);
        torso.add(head);
        headGroup.current = head;

        // Face mesh
        const faceMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 16, 16),
            skinMat
        );
        head.add(faceMesh);

        // Draped Cinematic hood
        const hoodGeo = new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
        const hoodMat = new THREE.MeshStandardMaterial({
            color: fabricColor,
            roughness: 0.95,
            side: THREE.DoubleSide
        });
        const hood = new THREE.Mesh(hoodGeo, hoodMat);
        hood.rotation.x = 0.25;
        hood.position.set(0, 0.03, -0.02);
        hood.scale.set(1.05, 1.1, 1.15);
        hood.castShadow = true;
        head.add(hood);

        // Glowing runic stardust eyes (following cursor, reactive to lighting)
        const eyeGeo = new THREE.SphereGeometry(0.022, 8, 8);
        const eyeColor = shadow > harmony ? 0xa78bfa : 0x34d399; // Violet glowing vs emerald
        const eyeMat = new THREE.MeshBasicMaterial({
            color: eyeColor
        });

        const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
        leftEyeMesh.position.set(-0.06, 0.02, 0.14);
        head.add(leftEyeMesh);
        leftEye.current = leftEyeMesh;

        const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
        rightEyeMesh.position.set(0.06, 0.02, 0.14);
        head.add(rightEyeMesh);
        rightEye.current = rightEyeMesh;

        // Lush procedural druidic crown hair sways (strands cascading below hood)
        const hairGrp = new THREE.Group();
        hairGrp.position.set(0, 0, -0.05);
        head.add(hairGrp);

        const strandCount = 12;
        hairStrands.current = [];
        for (let i = 0; i < strandCount; i++) {
            const strand = new THREE.Group();
            
            // Random angular hair strands hanging down sides
            const angle = -Math.PI / 4 + (i / strandCount) * (Math.PI / 2);
            const x = Math.sin(angle) * 0.16;
            const z = Math.cos(angle) * 0.16;
            strand.position.set(x, -0.05, z);

            // Construct chain of joint segments for smooth spring-bone physics
            let parentNode: THREE.Object3D = strand;
            const segments = 4;
            const segmentGeo = new THREE.CylinderGeometry(0.02, 0.012, 0.15, 6);
            segmentGeo.translate(0, -0.075, 0); // pivot at top joint

            const hairMat = new THREE.MeshStandardMaterial({
                color: fillLightColor, // luminous emerald/purple tips
                roughness: 0.8,
                emissive: fillLightColor,
                emissiveIntensity: 0.15
            });

            for (let j = 0; j < segments; j++) {
                const node = new THREE.Mesh(segmentGeo, hairMat);
                node.castShadow = true;
                node.position.y = j === 0 ? 0 : -0.15;
                parentNode.add(node);
                parentNode = node;
            }

            hairGrp.add(strand);
            hairStrands.current.push(strand);
        }

        // 6c. Arm joint hierarchies (Left and Right)
        const armGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.45, 8);
        armGeo.translate(0, -0.225, 0); // pivot at shoulder

        const lArm = new THREE.Group();
        lArm.position.set(-0.35, 0.35, 0);
        torso.add(lArm);
        leftArmGroup.current = lArm;

        const lArmMesh = new THREE.Mesh(armGeo, fabricColor === 0x143c2c ? tunicMat : leatherMat);
        lArmMesh.castShadow = true;
        lArm.add(lArmMesh);

        // Leather wrist guard bracer
        const lBracer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.05, 0.18, 8),
            leatherMat
        );
        lBracer.position.y = -0.32;
        lArm.add(lBracer);

        const rArm = new THREE.Group();
        rArm.position.set(0.35, 0.35, 0);
        torso.add(rArm);
        rightArmGroup.current = rArm;

        const rArmMesh = new THREE.Mesh(armGeo, fabricColor === 0x143c2c ? tunicMat : leatherMat);
        rArmMesh.castShadow = true;
        rArm.add(rArmMesh);

        // Leather wrist guard bracer
        const rBracer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.05, 0.18, 8),
            leatherMat
        );
        rBracer.position.y = -0.32;
        rArm.add(rBracer);

        // 6d. Leg joint hierarchies (Left and Right)
        const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.55, 8);
        legGeo.translate(0, -0.275, 0); // pivot at hip joint

        const lLeg = new THREE.Group();
        lLeg.position.set(-0.16, 0.55, 0); // connected to lower body
        charGroup.add(lLeg);
        leftLegGroup.current = lLeg;

        const lLegMesh = new THREE.Mesh(legGeo, leatherMat);
        lLegMesh.castShadow = true;
        lLegMesh.receiveShadow = true;
        lLeg.add(lLegMesh);

        // Shin boots
        const lBoot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.078, 0.072, 0.22, 8),
            leatherMat
        );
        lBoot.position.y = -0.45;
        lLeg.add(lBoot);

        const rLeg = new THREE.Group();
        rLeg.position.set(0.16, 0.55, 0);
        charGroup.add(rLeg);
        rightLegGroup.current = rLeg;

        const rLegMesh = new THREE.Mesh(legGeo, leatherMat);
        rLegMesh.castShadow = true;
        rLegMesh.receiveShadow = true;
        rLeg.add(rLegMesh);

        // Shin boots
        const rBoot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.078, 0.072, 0.22, 8),
            leatherMat
        );
        rBoot.position.y = -0.45;
        rLeg.add(rBoot);

        // 6e. Cinematic Flowing Cape/Cloak (Segmented planes with wind mechanics)
        const cape = new THREE.Group();
        cape.position.set(0, 0.35, -0.15);
        torso.add(cape);

        // 5 segments of cape mesh bones cascading down to simulate cloth draping
        const capeWidth = 0.55;
        const capeSegHeight = 0.22;
        const capeSegments = 6;
        const capeSegGeo = new THREE.PlaneGeometry(capeWidth, capeSegHeight, 4, 1);
        capeSegGeo.translate(0, -capeSegHeight / 2, 0); // pivot top

        const capeFabricMat = new THREE.MeshStandardMaterial({
            color: fabricColor,
            roughness: 0.95,
            metalness: 0.0,
            side: THREE.DoubleSide,
            flatShading: true
        });

        let prevCapeSeg: THREE.Object3D = cape;
        const capeBonesList: THREE.Object3D[] = [];

        for (let j = 0; j < capeSegments; j++) {
            const seg = new THREE.Mesh(capeSegGeo, capeFabricMat);
            seg.castShadow = true;
            seg.receiveShadow = true;
            seg.position.set(0, j === 0 ? 0 : -capeSegHeight, -0.01 * j);
            
            // Subtly flare the cape outwards at the bottom
            const flare = 1.0 + j * 0.12;
            seg.scale.set(flare, 1.0, 1.0);

            prevCapeSeg.add(seg);
            prevCapeSeg = seg;
            capeBonesList.push(seg);
        }
        (cape as any).bones = capeBonesList;

        // 6f. Elder Runic wood staff with floating crystal
        const staff = new THREE.Group();
        staff.position.set(0, 0, 0.05); // on back default
        staffGroup.current = staff;

        const shaftGeo = new THREE.CylinderGeometry(0.016, 0.02, 1.8, 8);
        const shaftMat = new THREE.MeshStandardMaterial({
            color: 0x5c4033, // rich mahogany
            roughness: 0.9
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.castShadow = true;
        staff.add(shaft);

        // Top crystal vine bindings
        const gemGeo = new THREE.OctahedronGeometry(0.08, 0);
        const gemMat = new THREE.MeshStandardMaterial({
            color: fillLightColor,
            emissive: fillLightColor,
            emissiveIntensity: 1.0,
            metalness: 0.9,
            roughness: 0.05
        });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.y = 0.98;
        staff.add(gem);

        // Runic star ring surrounding the crystal
        const ringTorus = new THREE.Mesh(
            new THREE.TorusGeometry(0.12, 0.01, 8, 24),
            goldMat
        );
        ringTorus.position.y = 0.98;
        staff.add(ringTorus);

        // Add staff to back by default
        charGroup.add(staff);

        // ==========================================
        // 7. ENVIRONMENT PARTICLE WEATHER EFFECTS
        // ==========================================
        const partGeo = new THREE.BufferGeometry();
        const partPos = new Float32Array(weatherParticleCount * 3);
        weatherParticleData.current = [];

        for (let i = 0; i < weatherParticleCount; i++) {
            const px = (Math.random() - 0.5) * 12;
            const py = Math.random() * 8;
            const pz = (Math.random() - 0.5) * 12;
            
            partPos[i * 3] = px;
            partPos[i * 3 + 1] = py;
            partPos[i * 3 + 2] = pz;

            weatherParticleData.current.push({
                x: px,
                y: py,
                z: pz,
                sy: -(1.5 + Math.random() * 2.5), // fall speed
                sx: (Math.random() - 0.5) * 0.5  // drift
            });
        }

        partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
        
        let weatherMatColor = 0xffffff;
        let weatherSize = 0.05;
        if (weather === 'rain' || weather === 'storm') {
            weatherMatColor = 0xa3e635; // wet glow spores
            weatherSize = 0.03;
        }

        const weatherPartMat = new THREE.PointsMaterial({
            color: weatherMatColor,
            size: weatherSize,
            transparent: true,
            opacity: 0.6,
            depthWrite: false
        });

        const weatherPoints = new THREE.Points(partGeo, weatherPartMat);
        scene.add(weatherPoints);
        weatherParticles.current = weatherPoints;

        // Light setup check on first run
        if (weather === 'clear') {
            weatherPoints.visible = false;
        }

        // ==========================================
        // 8. RENDER AND ANIMATION LOOP ENGINE
        // ==========================================
        let animationFrameId: number;
        let prevTime = performance.now();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const currentTime = performance.now();
            const delta = Math.min((currentTime - prevTime) / 1000, 0.1); // clamp delta
            prevTime = currentTime;

            animTime.current += delta;
            const time = animTime.current;

            // Character movement inputs (WASD control logic)
            let moveX = 0;
            let moveZ = 0;
            if (isFocused) {
                if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveZ = -1;
                if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveZ = 1;
                if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX = -1;
                if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX = 1;
            }

            // Stance state interpolation
            let currentSpeed = 0.0;
            let activeStance = stance;

            if (moveX !== 0 || moveZ !== 0) {
                // If keyboard keys are held, transition to walk or run automatically
                const isRunning = keysPressed.current['shift'];
                activeStance = isRunning ? 'run' : 'walk';
                currentSpeed = isRunning ? 2.5 : 1.0;
                
                // Target angle calculated relative to isometric space
                targetBodyRotation.current = Math.atan2(moveX, moveZ);
            } else if (stance === 'walk' || stance === 'run') {
                activeStance = 'idle';
            }

            // Smooth body rotation interpolation
            const rotDiff = targetBodyRotation.current - currentBodyRotation.current;
            // Shortest angle sweep
            const shortRotDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
            currentBodyRotation.current += shortRotDiff * 0.15;
            charGroup.rotation.y = currentBodyRotation.current;

            // Position updates based on keyboard velocity
            if (currentSpeed > 0 && stance !== 'jump') {
                const speedScale = currentSpeed * delta;
                momentum.current.set(
                    Math.sin(currentBodyRotation.current) * speedScale,
                    0,
                    Math.cos(currentBodyRotation.current) * speedScale
                );
                charGroup.position.add(momentum.current);
            } else {
                momentum.current.multiplyScalar(0.85); // drag/brake speed
                charGroup.position.add(momentum.current);
            }

            // Boundary containment
            if (charGroup.position.x > 4.5) charGroup.position.x = 4.5;
            if (charGroup.position.x < -4.5) charGroup.position.x = -4.5;
            if (charGroup.position.z > 4.5) charGroup.position.z = 4.5;
            if (charGroup.position.z < -4.5) charGroup.position.z = -4.5;

            // Staff attachment toggle (hold in combat vs back in rest)
            if (staffGroup.current) {
                const staffObj = staffGroup.current;
                if (activeStance === 'combat') {
                    // Attach to Right Hand Group
                    if (rightArmGroup.current && staffObj.parent !== rightArmGroup.current) {
                        rightArmGroup.current.add(staffObj);
                        staffObj.position.set(0, -0.4, 0.08);
                        staffObj.rotation.set(-Math.PI / 2, 0, 0);
                    }
                } else {
                    // Attach back to Spine/Torso back
                    if (staffObj.parent !== charGroup) {
                        charGroup.add(staffObj);
                        staffObj.position.set(0.1, 0.9, -0.2);
                        staffObj.rotation.set(0, 0, -0.4);
                    }
                }
            }

            // Hood toggle visibility
            hood.visible = showHood;

            // Dynamic camera floating parallax
            const targetCamX = charGroup.position.x + mousePos.current.x * 0.6;
            const targetCamY = 1.6 + Math.sin(time * 0.5) * 0.05 + mousePos.current.y * 0.3;
            const targetCamZ = charGroup.position.z + 3.8 + Math.abs(mousePos.current.x) * 0.2;

            camera.position.x += (targetCamX - camera.position.x) * 0.08;
            camera.position.y += (targetCamY - camera.position.y) * 0.08;
            camera.position.z += (targetCamZ - camera.position.z) * 0.08;
            
            // Add subtle cinematic camera shake (increases during sprints)
            if (activeStance === 'run') {
                cameraShake.current = Math.sin(time * 18) * 0.015;
            } else {
                cameraShake.current *= 0.9; // decay
            }
            camera.position.y += cameraShake.current;

            // Focus target stays on Elowen
            const targetGaze = new THREE.Vector3(charGroup.position.x, 1.0, charGroup.position.z);
            camera.lookAt(targetGaze);

            // Reactive stardust eyes focus towards mouse pointer
            if (leftEye.current && rightEye.current) {
                const lEye = leftEye.current;
                const rEye = rightEye.current;

                const lookTargetX = mousePos.current.x * 0.02;
                const lookTargetY = Math.max(-0.01, mousePos.current.y * 0.02);

                lEye.position.x = -0.06 + lookTargetX;
                lEye.position.y = 0.02 + lookTargetY;

                rEye.position.x = 0.06 + lookTargetX;
                rEye.position.y = 0.02 + lookTargetY;

                // Random blinking logic
                blinkTimer.current += delta;
                if (blinkTimer.current > 4.0 + Math.random() * 3.0) {
                    isBlinking.current = true;
                    blinkTimer.current = 0;
                }

                if (isBlinking.current) {
                    lEye.scale.y -= delta * 15;
                    rEye.scale.y -= delta * 15;
                    if (lEye.scale.y <= 0.1) {
                        isBlinking.current = false;
                    }
                } else {
                    lEye.scale.y += (1.0 - lEye.scale.y) * 0.25;
                    rEye.scale.y += (1.0 - rEye.scale.y) * 0.25;
                }
            }

            // ==========================================
            // 9. ANIMATION STATEMACHINE & PHYSICS SWAYS
            // ==========================================
            const defaultHipsY = 1.05;
            const shiverIntensity = weather === 'snow' ? 0.025 : weather === 'rain' ? 0.018 : 0.0;
            const shiverFreq = 42;
            const shiverOffset = Math.sin(time * shiverFreq) * shiverIntensity;

            // Breathing dynamics based on physical fatigue
            const isTired = activeStance === 'run' || weather === 'storm';
            const breatheFreq = isTired ? 4.5 : 2.0;
            const breatheAmp = isTired ? 0.05 : 0.02;
            const breatheScale = Math.sin(time * breatheFreq);

            // Torso breathing expander
            torso.scale.set(1 + breatheScale * breatheAmp * 0.5, 1 + breatheScale * breatheAmp, 1 + breatheScale * breatheAmp * 0.5);
            torso.position.y = defaultHipsY + breatheScale * breatheAmp * 0.15 + shiverOffset;

            // 9a. IDLE STANCE
            if (activeStance === 'idle') {
                // Reset limb positioning smoothly
                leftLegGroup.current!.rotation.set(0, 0, 0);
                rightLegGroup.current!.rotation.set(0, 0, 0);
                leftArmGroup.current!.rotation.set(0, 0, 0.1);
                rightArmGroup.current!.rotation.set(0, 0, -0.1);

                // Natural swaying head gaze adjustment
                headGroup.current!.rotation.y = Math.sin(time * 0.7) * 0.15 + mousePos.current.x * 0.2;
                headGroup.current!.rotation.x = Math.cos(time * 0.4) * 0.08 + Math.max(-0.15, mousePos.current.y * 0.2);

                // Breath body lean
                torso.rotation.x = 0.04 + Math.sin(time * 2) * 0.015;
            }

            // 9b. WALK STANCE
            if (activeStance === 'walk') {
                walkPhase.current += delta * 7.5; // step rate
                const phase = walkPhase.current;

                // Leg swing matching hip-sway
                leftLegGroup.current!.rotation.x = Math.sin(phase) * 0.4;
                rightLegGroup.current!.rotation.x = -Math.sin(phase) * 0.4;

                // Arm counter-swing rhythm
                leftArmGroup.current!.rotation.x = -Math.sin(phase) * 0.3;
                leftArmGroup.current!.rotation.z = 0.1;
                
                rightArmGroup.current!.rotation.x = Math.sin(phase) * 0.3;
                rightArmGroup.current!.rotation.z = -0.1;

                // Body vertical hip bounce (double rate)
                torso.position.y = defaultHipsY - Math.abs(Math.sin(phase)) * 0.06;

                // Leaning forward slightly
                torso.rotation.x = 0.1 + Math.sin(time * 4) * 0.02;
                headGroup.current!.rotation.x = -0.05 + Math.cos(phase * 2) * 0.03;

                // Trigger footstep sound & splash triggers at peak leg points
                const prevSin = Math.sin(phase - delta * 7.5);
                const currSin = Math.sin(phase);
                if ((prevSin < 0 && currSin >= 0) || (prevSin > 0 && currSin <= 0)) {
                    playSynthesizedFootstep(activeTerrain, 0.6);
                    emitFootstepEffect(charGroup.position.x, charGroup.position.z, activeTerrain);
                }
            }

            // 9c. RUN STANCE
            if (activeStance === 'run') {
                runPhase.current += delta * 13.0; // intense sprint rate
                const phase = runPhase.current;

                // Deep leg strides leaning forward
                leftLegGroup.current!.rotation.x = Math.sin(phase) * 0.72;
                rightLegGroup.current!.rotation.x = -Math.sin(phase) * 0.72;

                // Intense high arm swings
                leftArmGroup.current!.rotation.x = -Math.sin(phase) * 0.65;
                leftArmGroup.current!.rotation.z = 0.2;
                
                rightArmGroup.current!.rotation.x = Math.sin(phase) * 0.65;
                rightArmGroup.current!.rotation.z = -0.2;

                // Dynamic deep hip drop
                torso.position.y = defaultHipsY - 0.05 - Math.abs(Math.sin(phase)) * 0.12;

                // Forward body pivot
                torso.rotation.x = 0.28;
                headGroup.current!.rotation.x = -0.18 + Math.cos(phase * 2) * 0.05;

                // Sprint feet impact footsteps
                const prevSin = Math.sin(phase - delta * 13.0);
                const currSin = Math.sin(phase);
                if ((prevSin < 0 && currSin >= 0) || (prevSin > 0 && currSin <= 0)) {
                    playSynthesizedFootstep(activeTerrain, 1.2);
                    emitFootstepEffect(charGroup.position.x, charGroup.position.z, activeTerrain);
                }
            }

            // 9d. COMBAT STANCE
            if (activeStance === 'combat') {
                // Low alert rooted posture
                leftLegGroup.current!.rotation.set(0.15, 0.1, -0.05);
                rightLegGroup.current!.rotation.set(-0.25, -0.1, 0.05);
                
                // Hands raised forward channeling staff sparks
                leftArmGroup.current!.rotation.set(-0.8, 0, 0.35);
                rightArmGroup.current!.rotation.set(-1.0, 0, -0.15);

                // Body combat tilt
                torso.position.y = defaultHipsY - 0.08 + shiverOffset;
                torso.rotation.set(0.12, 0.2, 0);

                headGroup.current!.rotation.set(0.05, -0.15 + mousePos.current.x * 0.35, 0);

                // Staff glowing particle orbits
                if (gem) {
                    gem.rotation.y = time * 8;
                    gem.scale.setScalar(1 + Math.sin(time * 12) * 0.15);
                }
            }

            // 9e. JUMP STANCE
            if (activeStance === 'jump') {
                jumpProgress.current += delta * 1.8;
                const progress = jumpProgress.current;

                if (progress <= 0.3) {
                    // 1. Takeoff bend
                    const bend = progress / 0.3;
                    torso.position.y = defaultHipsY - bend * 0.18;
                    leftLegGroup.current!.rotation.x = -bend * 0.5;
                    rightLegGroup.current!.rotation.x = -bend * 0.5;
                    leftArmGroup.current!.rotation.x = bend * 0.3;
                    rightArmGroup.current!.rotation.x = bend * 0.3;
                } else if (progress <= 0.75) {
                    // 2. Midair leap fly
                    const flight = (progress - 0.3) / 0.45;
                    const peakHeight = 0.95;
                    // Parabolic arc curve height
                    const flightY = Math.sin(flight * Math.PI) * peakHeight;
                    
                    charGroup.position.y = flightY;

                    // Legs tucked, arms spread like wings
                    leftLegGroup.current!.rotation.x = 0.25;
                    rightLegGroup.current!.rotation.x = 0.25;
                    leftArmGroup.current!.rotation.set(-0.5, 0, 0.75);
                    rightArmGroup.current!.rotation.set(-0.5, 0, -0.75);
                    
                    // Wind drag cloak trail
                    capeBonesList.forEach((bone, idx) => {
                        bone.rotation.x = -0.55 + idx * 0.08;
                    });
                } else if (progress < 1.0) {
                    // 3. Heavy impact land squash
                    const land = (progress - 0.75) / 0.25;
                    charGroup.position.y = 0; // rooted floor
                    
                    // Body compression bounce absorption
                    torso.position.y = defaultHipsY - (1 - land) * 0.25;
                    
                    leftLegGroup.current!.rotation.x = -(1 - land) * 0.65;
                    rightLegGroup.current!.rotation.x = -(1 - land) * 0.65;

                    leftArmGroup.current!.rotation.x = (1 - land) * 0.4;
                    rightArmGroup.current!.rotation.x = (1 - land) * 0.4;

                    // Execute land splash visual sparks
                    if (progress - delta * 1.8 <= 0.75) {
                        playSynthesizedFootstep(activeTerrain, 1.6);
                        emitFootstepEffect(charGroup.position.x, charGroup.position.z, activeTerrain);
                        
                        // Shake the camera heavily on landing
                        cameraShake.current = 0.15;
                    }
                } else {
                    // Finish jump stance loop reset
                    setStance('idle');
                    jumpProgress.current = 0;
                    charGroup.position.y = 0;
                }
            }

            // ==========================================
            // 10. CLOTH CAPE & HAIR SPRING BONE PHYSICS
            // ==========================================
            // Dynamic wind vector
            const activeWindStr = windStrength / 100.0;
            const windForceX = Math.sin(time * 3.5) * 0.22 * activeWindStr;
            const windForceZ = -0.15 - Math.abs(Math.sin(time * 2.0)) * 0.3 * activeWindStr;

            // Momentum forces added to cape
            const speedVector = momentum.current;
            const momentumDrag = -speedVector.z * 1.5;

            // Iterate over segments of cape
            if (activeStance !== 'jump') {
                capeBonesList.forEach((bone, idx) => {
                    const depthFactor = idx / capeSegments;
                    
                    // Dynamic wind flutter wave
                    const wave = Math.sin(time * 12.0 - idx * 1.8) * 0.12 * activeWindStr;
                    
                    // Combine gravity pull, wind force, body velocity inertia
                    const targetRotX = 0.25 + depthFactor * 0.15 + momentumDrag + wave + Math.abs(windForceZ) * 0.8;
                    const targetRotZ = windForceX * (1 + depthFactor * 0.5) - speedVector.x * 1.2;

                    // Lerp joint rotation for soft fabric inertia
                    bone.rotation.x += (targetRotX - bone.rotation.x) * 0.18;
                    bone.rotation.z += (targetRotZ - bone.rotation.z) * 0.18;
                });
            }

            // Spring bone physics applied to druid's glowing hair strands
            hairStrands.current.forEach((strand, strandIdx) => {
                const bones = strand.children;
                if (bones.length > 0) {
                    let parentJoint = strand;
                    
                    for (let j = 0; j < bones.length; j++) {
                        const boneObj = bones[j] as THREE.Mesh;
                        const depthFactor = j / bones.length;
                        
                        // Hair wind rustle
                        const hairRustle = Math.sin(time * 16.0 - strandIdx * 0.8 - j * 1.2) * 0.08 * activeWindStr;
                        
                        // Body speed drag
                        const dragX = -speedVector.x * 0.6;
                        const dragZ = speedVector.z * 0.6;

                        const targetRotX = 0.1 + depthFactor * 0.18 + dragZ + hairRustle + shiverOffset * 2;
                        const targetRotZ = (strandIdx % 2 === 0 ? 0.05 : -0.05) + dragX + windForceX * 0.3;

                        boneObj.rotation.x += (targetRotX - boneObj.rotation.x) * 0.2;
                        boneObj.rotation.z += (targetRotZ - boneObj.rotation.z) * 0.2;
                    }
                }
            });

            // ==========================================
            // 11. WEATHER FALLING PARTICLES ENGINE
            // ==========================================
            if (weatherParticles.current && weather !== 'clear') {
                const pointsObj = weatherParticles.current;
                const posArr = pointsObj.geometry.attributes.position.array as Float32Array;
                
                const windShiftX = windForceX * 0.8;

                for (let i = 0; i < weatherParticleCount; i++) {
                    const data = weatherParticleData.current[i];
                    
                    // Rain drops drop faster than snow
                    const speedMultiplier = weather === 'snow' ? 0.35 : 1.0;
                    posArr[i * 3 + 1] += data.sy * speedMultiplier * delta; // falling Y
                    posArr[i * 3] += (data.sx + windShiftX) * delta;       // drifting X

                    // Recycle out of bounds particles
                    if (posArr[i * 3 + 1] < 0) {
                        posArr[i * 3 + 1] = 6.5 + Math.random() * 1.5;
                        posArr[i * 3] = (Math.random() - 0.5) * 8;
                        posArr[i * 3 + 2] = (Math.random() - 0.5) * 8;
                    }
                }
                pointsObj.geometry.attributes.position.needsUpdate = true;
            }

            // Update footstep active sparks / rings and fade them out
            const activePool = footstepPool.current;
            for (let i = activePool.length - 1; i >= 0; i--) {
                const item = activePool[i];
                item.age += 1;

                if (item.type === 'ring') {
                    // Expand and fade ring opacity
                    const scale = 1.0 + (item.age / item.maxAge) * 1.5;
                    item.mesh.scale.set(scale, scale, 1);
                    (item.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0 - (item.age / item.maxAge);
                } else if (item.type === 'spark') {
                    // Update physics sparks gravities
                    const vel = (item.mesh as any).velocity as THREE.Vector3;
                    vel.y -= 0.003; // gravity drop
                    item.mesh.position.add(vel);
                    (item.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0 - (item.age / item.maxAge);
                }

                // Remove aged out particles
                if (item.age >= item.maxAge) {
                    scene.remove(item.mesh);
                    item.mesh.geometry.dispose();
                    if (Array.isArray(item.mesh.material)) {
                        item.mesh.material.forEach(m => m.dispose());
                    } else {
                        item.mesh.material.dispose();
                    }
                    activePool.splice(i, 1);
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        // 12. Handle window size responsive canvas scaling
        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.clientWidth;
            const h = canvasRef.current.clientHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            
            // Dispose geometries and materials
            scene.traverse((object) => {
                if (!(object instanceof THREE.Mesh)) return;
                
                object.geometry.dispose();
                
                if (object.material instanceof Array) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            });
            
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [harmony, shadow, wisdom, activeTerrain, weather, showHood, equippedStaff]);

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Top Interactive Stance Controller & Focus Overlay */}
            <div 
                ref={containerRef}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                tabIndex={0}
                className={`relative aspect-[1.3] w-full rounded-lg overflow-hidden border-2 transition-all duration-300 outline-none
                    ${isFocused 
                        ? 'border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.15)]' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
            >
                {/* 3D WebGL Canvas Rendering */}
                <canvas ref={canvasRef} className="w-full h-full block bg-black" />

                {/* HUD: Focus Indicator overlay */}
                {!isFocused && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none backdrop-blur-[1px] transition-all">
                        <span className="text-[10px] tracking-[0.4em] text-[#ffd700] uppercase font-mono mb-2">Click viewport to take control</span>
                        <span className="px-4 py-2 border border-white/20 bg-black/80 rounded text-xs text-white/80 font-fantasy tracking-widest uppercase">
                            🎮 Interactive Control
                        </span>
                    </div>
                )}

                {/* Keyboard Controls visual hotkey map HUD */}
                {isFocused && (
                    <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 px-3 py-2 rounded text-[10px] text-white/70 font-mono flex gap-4 pointer-events-none select-none z-20">
                        <div>
                            <span className="text-[#ffd700] font-bold">WASD / ARROWS</span> Move
                        </div>
                        <div>
                            <span className="text-[#ffd700] font-bold">SHIFT</span> Sprint
                        </div>
                        <div>
                            <span className="text-[#ffd700] font-bold">CLICK</span> Rotate view
                        </div>
                    </div>
                )}

                {/* Stance Quick HUD indicators */}
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <span className="px-3 py-1 bg-black/80 border border-white/10 rounded text-[9px] font-mono uppercase tracking-widest text-[#10b981] flex items-center gap-1.5 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                        Live State: {stance}
                    </span>
                </div>

                {/* Environmental overlay filter indicators */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {weather === 'rain' && <span className="px-2 py-1 bg-blue-950/80 border border-blue-500/20 text-blue-300 rounded text-[9px] font-mono">🌧️ Wet</span>}
                    {weather === 'snow' && <span className="px-2 py-1 bg-slate-900/80 border border-white/20 text-white rounded text-[9px] font-mono">❄️ Snowy</span>}
                    {weather === 'storm' && <span className="px-2 py-1 bg-purple-950/80 border border-purple-500/20 text-purple-300 rounded text-[9px] font-mono">🌀 Storm</span>}
                </div>
            </div>

            {/* Custom Interactive Controls Deck */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg flex flex-col gap-4">
                
                {/* 1. Character Stances Controller */}
                <div>
                    <h5 className="font-fantasy text-xs tracking-widest uppercase text-white/50 mb-2.5">Stances & Movements</h5>
                    <div className="grid grid-cols-5 gap-2">
                        {(['idle', 'walk', 'run', 'combat', 'jump'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    setStance(s);
                                    if (s === 'jump') jumpProgress.current = 0;
                                }}
                                className={`py-2 text-[10px] font-fantasy tracking-wider uppercase border rounded cursor-pointer transition-all
                                    ${stance === s
                                        ? 'bg-[#ffd700]/10 border-[#ffd700] text-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,0.1)]'
                                        : 'bg-black/40 border-white/10 hover:border-white/30 text-white/70'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Weather & Environment Deck */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    {/* Weather Presets */}
                    <div>
                        <h5 className="font-fantasy text-xs tracking-widest uppercase text-white/50 mb-2">Weather Environment</h5>
                        <div className="grid grid-cols-4 gap-1.5">
                            {(['clear', 'rain', 'snow', 'storm'] as const).map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setWeather(w)}
                                    className={`py-1.5 text-[9px] font-mono uppercase border rounded cursor-pointer transition-all
                                        ${weather === w
                                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                                            : 'bg-black/40 border-white/10 hover:border-white/20 text-white/60'
                                        }`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Terrain Footstep Sounds Selection */}
                    <div>
                        <h5 className="font-fantasy text-xs tracking-widest uppercase text-white/50 mb-2">Terrain Sound Footsteps</h5>
                        <div className="grid grid-cols-4 gap-1.5">
                            {(['grass', 'mud', 'snow', 'stone'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setActiveTerrain(t);
                                        playSynthesizedFootstep(t, 1.0);
                                    }}
                                    className={`py-1.5 text-[9px] font-mono uppercase border rounded cursor-pointer transition-all
                                        ${activeTerrain === t
                                            ? 'bg-blue-950/40 border-blue-500 text-blue-400'
                                            : 'bg-black/40 border-white/10 hover:border-white/20 text-white/60'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Clothing Accessories & Customization sliders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4 text-xs font-mono text-white/60">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-white/40 font-fantasy">Weather Wetness ({wetness}%)</label>
                        <input 
                            type="range" min="0" max="100" value={wetness} 
                            onChange={(e) => setWetness(parseInt(e.target.value))}
                            className="accent-[#10b981] w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-white/40 font-fantasy">Snow Cover ({snowAmount}%)</label>
                        <input 
                            type="range" min="0" max="100" value={snowAmount} 
                            onChange={(e) => setSnowAmount(parseInt(e.target.value))}
                            className="accent-white w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-white/40 font-fantasy">Runic Wind Strength ({windStrength}%)</label>
                        <input 
                            type="range" min="0" max="100" value={windStrength} 
                            onChange={(e) => setWindStrength(parseInt(e.target.value))}
                            className="accent-purple-500 w-full"
                        />
                    </div>
                </div>

                {/* 4. Equipment & Apparel toggles */}
                <div className="flex gap-4 border-t border-white/5 pt-4 text-xs font-fantasy uppercase text-white/80">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" checked={showHood} 
                            onChange={(e) => setShowHood(e.target.checked)}
                            className="accent-[#ffd700]"
                        />
                        <span>Draw Fabric Hood</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" checked={equippedStaff} 
                            onChange={(e) => setEquippedStaff(e.target.checked)}
                            className="accent-[#ffd700]"
                        />
                        <span>Equip Star-Seed Staff</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
