/* ======  GRUMP 3.0  HYPER-REALISTIC ENGINE  ======
   Physics-based animation system + Advanced Procedural States
   120FPS Optimized | Delta-Time Corrected | Spring Physics
*/
(function initGrump3() {
  const waitForElements = () => {
    return new Promise((resolve) => {
      const check = () => {
        const face = document.querySelector('.grump2-container .face');
        if (face) {
          resolve({ 
            face, 
            styleTarget: document.querySelector('.grump2-wrapper') || document.documentElement 
          });
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  };

  waitForElements().then(({ face, styleTarget }) => {
    console.log('Grump3: Engine Ignition');

    // --- PHYSICS SYSTEM ---
    const springSystem = {
      pupils: { x: { pos: 0, vel: 0, target: 0 }, y: { pos: 0, vel: 0, target: 0 } },
      face: { x: { pos: 0, vel: 0, target: 0 }, y: { pos: 0, vel: 0, target: 0 }, rotate: { pos: 0, vel: 0, target: 0 } },
      eyebrows: { left: { pos: 0, vel: 0, target: 0 }, right: { pos: 0, vel: 0, target: 0 } },
      mouth: { open: { pos: 0, vel: 0, target: 0 } },
      scale: { val: { pos: 1, vel: 0, target: 1 } }
    };

    const PHYSICS_CONFIG = {
      stiffness: 0.15, // Spring stiffness
      damping: 0.82,    // Damping factor (0-1)
      mass: 1.0        // Mass
    };

    let lastTime = performance.now();
    let mousePos = { x: 0, y: 0 };
    let isTracking = false;

    // --- RENDER LOOP (120FPS+) ---
    const updatePhysics = (dt) => {
      // 10x Speed Multiplier for "Super Efficiency"
      const speedMultiplier = 10.0;
      
      // Helper for spring physics
      const updateSpring = (spring, config = PHYSICS_CONFIG) => {
        const force = (spring.target - spring.pos) * config.stiffness;
        const acceleration = force / config.mass;
        spring.vel = (spring.vel + acceleration) * config.damping;
        spring.pos += spring.vel * speedMultiplier * dt; // Applied speed boost
      };

      // Update all springs
      updateSpring(springSystem.pupils.x);
      updateSpring(springSystem.pupils.y);
      updateSpring(springSystem.face.x);
      updateSpring(springSystem.face.y);
      updateSpring(springSystem.face.rotate);
      updateSpring(springSystem.eyebrows.left);
      updateSpring(springSystem.eyebrows.right);
      updateSpring(springSystem.mouth.open);
      updateSpring(springSystem.scale.val, { ...PHYSICS_CONFIG, stiffness: 0.2, damping: 0.6 }); // Bouncier scale
    };

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 16.667, 2); // Cap at 2x frame time
      lastTime = now;

      // Mouse Tracking Logic
      if (isTracking && Math.random() > 0.05) { // 95% focus
        const rect = face.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = (mousePos.x - centerX) / 15;
        const dy = (mousePos.y - centerY) / 15;
        
        springSystem.pupils.x.target = Math.max(-14, Math.min(14, dx));
        springSystem.pupils.y.target = Math.max(-14, Math.min(14, dy));
        springSystem.face.rotate.target = dx / 5;
      }

      updatePhysics(dt);

      // Apply to DOM (Batch writes)
      styleTarget.style.setProperty('--pupil-x', `${springSystem.pupils.x.pos.toFixed(2)}px`);
      styleTarget.style.setProperty('--pupil-y', `${springSystem.pupils.y.pos.toFixed(2)}px`);
      styleTarget.style.setProperty('--face-x', `${springSystem.face.x.pos.toFixed(2)}px`);
      styleTarget.style.setProperty('--face-y', `${springSystem.face.y.pos.toFixed(2)}px`);
      styleTarget.style.setProperty('--face-rotate', `${springSystem.face.rotate.pos.toFixed(2)}deg`);
      styleTarget.style.setProperty('--eyebrow-left-rotate', `${springSystem.eyebrows.left.pos.toFixed(2)}deg`);
      styleTarget.style.setProperty('--eyebrow-right-rotate', `${springSystem.eyebrows.right.pos.toFixed(2)}deg`);
      styleTarget.style.setProperty('--mouth-open', `${springSystem.mouth.open.pos.toFixed(2)}px`);
      styleTarget.style.setProperty('--face-scale', springSystem.scale.val.pos.toFixed(3));

      requestAnimationFrame(render);
    };

    // --- BEHAVIOR SYSTEM ---
    const behaviors = {
      idle: () => {
        // Random micro-movements
        if (Math.random() < 0.02) {
          springSystem.face.x.target = (Math.random() - 0.5) * 5;
          springSystem.face.y.target = (Math.random() - 0.5) * 5;
        }
        if (Math.random() < 0.01) {
           // Blink
           const eyes = face.querySelectorAll('.eye');
           eyes.forEach(e => e.style.transform = 'scaleY(0.1)');
           setTimeout(() => eyes.forEach(e => e.style.transform = ''), 150);
        }
      },
      bored: () => {
        springSystem.eyebrows.left.target = 2;
        springSystem.eyebrows.right.target = -2;
        springSystem.mouth.open.target = -2;
      },
      rage: () => {
        springSystem.eyebrows.left.target = 25;
        springSystem.eyebrows.right.target = -25;
        springSystem.mouth.open.target = -15;
        springSystem.face.x.target = (Math.random() - 0.5) * 10; // Shake
        springSystem.face.y.target = (Math.random() - 0.5) * 10;
        springSystem.scale.val.target = 1.1;
      },
      coding: () => {
        springSystem.pupils.x.target = Math.sin(Date.now() / 200) * 8; // Scanning code
        springSystem.pupils.y.target = 5;
        springSystem.eyebrows.left.target = 5;
        springSystem.eyebrows.right.target = 5;
      }
    };

    let currentMode = 'idle';

    // Loop for behavior updates
    setInterval(() => {
      if (behaviors[currentMode]) behaviors[currentMode]();
    }, 50); // 20 ticks per second for logic

    // --- EVENT LISTENERS ---
    document.addEventListener('mousemove', (e) => {
      mousePos = { x: e.clientX, y: e.clientY };
      isTracking = true;
      clearTimeout(window.trackingTimeout);
      window.trackingTimeout = setTimeout(() => { isTracking = false; springSystem.pupils.x.target = 0; springSystem.pupils.y.target = 0; }, 2000);
    });

    // --- STATE SYSTEM ---
    let grumpState = {
      mood: 'grumpy',
      intensity: 5,
      energy: 5,
      annoyance: 0
    };

    const emitStateUpdate = () => {
      const event = new CustomEvent('grump-state-update', { detail: { ...grumpState } });
      window.dispatchEvent(event);
    };

    // React Interaction API
    window.GrumpEngine = {
      setMode: (mode) => {
        console.log('Grump3: Mode set to', mode);
        currentMode = mode;
        grumpState.mood = mode;
        if (mode === 'rage') {
            springSystem.scale.val.target = 1.2;
            setTimeout(() => springSystem.scale.val.target = 1.0, 200);
        }
        emitStateUpdate();
      },
      setMood: (mood) => {
        window.GrumpEngine.setMode(mood);
      },
      trigger: (action) => {
        if (action === 'jump') {
            springSystem.face.y.vel = -20;
            springSystem.scale.val.vel = 0.05;
        }
        if (action === 'squash') {
            springSystem.scale.val.vel = -0.1;
        }
      },
      getState: () => {
        return { ...grumpState };
      },
      annoy: (amount) => {
        grumpState.annoyance = Math.min(10, grumpState.annoyance + amount);
        grumpState.mood = grumpState.annoyance > 8 ? 'rage' : 'annoyed';
        currentMode = grumpState.mood;
        emitStateUpdate();
        return grumpState.annoyance;
      },
      soothe: (amount) => {
        grumpState.annoyance = Math.max(0, grumpState.annoyance - amount);
        if (grumpState.annoyance < 3) {
            grumpState.mood = 'idle';
            currentMode = 'idle';
        }
        emitStateUpdate();
        return grumpState.annoyance;
      }
    };

    // Start Loop
    requestAnimationFrame(render);
  });
})();
