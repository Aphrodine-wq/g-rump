
// Procedural CSS Animation Generator
// Generates keyframes based on intent detection

interface AnimationProperties {
  name: string;
  duration: string;
  timing: string;
  iteration: string;
  keyframes: string;
}

const generateKeyframes = (prompt: string): AnimationProperties => {
  const p = prompt.toLowerCase();
  
  if (p.includes('bounce')) {
    return {
      name: 'bounce-custom',
      duration: '1s',
      timing: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
      iteration: 'infinite',
      keyframes: `
@keyframes bounce-custom {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}`
    };
  }
  
  if (p.includes('spin') || p.includes('rotate') || p.includes('loading')) {
    return {
      name: 'spin-custom',
      duration: '1s',
      timing: 'linear',
      iteration: 'infinite',
      keyframes: `
@keyframes spin-custom {
  to { transform: rotate(360deg); }
}`
    };
  }

  if (p.includes('fade')) {
    return {
      name: 'fade-custom',
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: `
@keyframes fade-custom {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`
    };
  }
  
  if (p.includes('shake')) {
    return {
      name: 'shake-custom',
      duration: '0.5s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: `
@keyframes shake-custom {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}`
    };
  }
  
  if (p.includes('pulse') || p.includes('scale') || p.includes('grow')) {
    return {
      name: 'pulse-custom',
      duration: '1.5s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: `
@keyframes pulse-custom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`
    };
  }

  // ENHANCED GLITCH: Chromatic Aberration + Clip Path
  if (p.includes('glitch')) {
    return {
      name: 'glitch-custom',
      duration: '2s',
      timing: 'steps(2, end)',
      iteration: 'infinite',
      keyframes: `
@keyframes glitch-custom {
  0% { transform: translate(0); text-shadow: none; clip-path: inset(0 0 0 0); }
  10% { transform: translate(-2px, 1px); text-shadow: 2px 0 red, -2px 0 blue; clip-path: inset(10% 0 85% 0); }
  20% { transform: translate(1px, -1px); text-shadow: -2px 0 red, 2px 0 blue; clip-path: inset(85% 0 5% 0); }
  30% { transform: translate(-1px, 2px); text-shadow: 2px 0 red, -2px 0 blue; clip-path: inset(50% 0 30% 0); }
  40% { transform: translate(2px, -1px); text-shadow: -2px 0 red, 2px 0 blue; clip-path: inset(10% 0 60% 0); }
  50% { transform: translate(0); text-shadow: none; clip-path: inset(0 0 0 0); }
}`
    };
  }

  // ENHANCED ORBIT: Complex Transform Origin
  if (p.includes('orbit')) {
    return {
      name: 'orbit-custom',
      duration: '3s',
      timing: 'linear',
      iteration: 'infinite',
      keyframes: `
@keyframes orbit-custom {
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) translateX(40px) rotate(-90deg) scale(0.8); }
  50% { transform: rotate(180deg) translateX(40px) rotate(-180deg) scale(0.6); z-index: -1; opacity: 0.5; }
  75% { transform: rotate(270deg) translateX(40px) rotate(-270deg) scale(0.8); }
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg) scale(1); }
}`
    };
  }

  // ENHANCED TYPEWRITER: Character-by-character reveal
  if (p.includes('type') || p.includes('write')) {
    return {
      name: 'typewriter-custom',
      duration: '2s',
      timing: 'steps(40, end)',
      iteration: 'infinite',
      keyframes: `
@keyframes typewriter-custom {
  0% { width: 0; border-right: 2px solid rgba(255,255,255,0.75); }
  90% { width: 100%; border-right: 2px solid rgba(255,255,255,0.75); }
  100% { width: 100%; border-right: none; }
}`
    };
  }

  // NEW: NEON PULSE
  if (p.includes('neon') || p.includes('glow')) {
    return {
      name: 'neon-pulse',
      duration: '1.5s',
      timing: 'ease-in-out',
      iteration: 'infinite',
      keyframes: `
@keyframes neon-pulse {
  0%, 100% { 
    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073;
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073;
  }
  50% { 
    box-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6;
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff4da6;
  }
}`
    };
  }

  // Default: Wiggle
  return {
    name: 'wiggle-custom',
    duration: '2s',
    timing: 'ease-in-out',
    iteration: 'infinite',
    keyframes: `
@keyframes wiggle-custom {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}`
  };
};

const generatePhaserCode = (props: AnimationProperties): string => {
  return `
class AnimationScene extends Phaser.Scene {
    preload() {
        this.load.image('hero', 'assets/hero.png');
    }

    create() {
        const hero = this.add.sprite(400, 300, 'hero');
        
        // Generated Animation: ${props.name}
        this.tweens.add({
            targets: hero,
            duration: ${parseInt(props.duration) * 1000},
            ease: '${props.timing === 'linear' ? 'Linear' : 'Sine.easeInOut'}',
            yoyo: true,
            repeat: -1,
            // Mapping CSS keyframes to Tween props (simplified)
            y: ${props.name.includes('bounce') ? '-=100' : '+=0'},
            angle: ${props.name.includes('spin') ? 360 : 0},
            alpha: ${props.name.includes('fade') ? 0.3 : 1},
            scale: ${props.name.includes('pulse') ? 1.2 : 1}
        });
    }
}
`.trim();
};

const generateReactCanvasCode = (props: AnimationProperties): string => {
  return `
import React, { useRef, useEffect } from 'react';

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameId;
    let startTime;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / ${parseInt(props.duration) * 1000};
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6366f1';
      
      // Animation Logic: ${props.name}
      const y = 150 + Math.sin(progress * Math.PI * 2) * ${props.name.includes('bounce') ? 50 : 0};
      const rotation = progress * Math.PI * 2 * ${props.name.includes('spin') ? 1 : 0};
      
      ctx.save();
      ctx.translate(150, y);
      ctx.rotate(rotation);
      ctx.fillRect(-25, -25, 50, 50);
      ctx.restore();
      
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};
`.trim();
};

const generateSVGCode = (props: AnimationProperties): string => {
  return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="75" y="75" width="50" height="50" fill="#6366f1">
    ${props.name.includes('spin') ? 
    `<animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="${props.duration}" repeatCount="indefinite"/>` : ''}
    ${props.name.includes('bounce') ? 
    `<animate attributeName="y" values="75;25;75" dur="${props.duration}" repeatCount="indefinite"/>` : ''}
    ${props.name.includes('fade') ? 
    `<animate attributeName="opacity" values="1;0.3;1" dur="${props.duration}" repeatCount="indefinite"/>` : ''}
  </rect>
</svg>
`.trim();
};

export const createProceduralAnimation = (prompt: string) => {
  const props = generateKeyframes(prompt);
  const css = `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  animation: ${props.name} ${props.duration} ${props.timing} ${props.iteration};
  ${props.name.includes('type') ? 'overflow: hidden; white-space: nowrap;' : ''}
}

${props.keyframes}
  `.trim();

  return {
    css,
    phaser: generatePhaserCode(props),
    reactCanvas: generateReactCanvasCode(props),
    svg: generateSVGCode(props),
    ...props
  };
};
