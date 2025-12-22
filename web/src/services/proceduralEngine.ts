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

  if (p.includes('glitch')) {
    return {
      name: 'glitch-custom',
      duration: '3s',
      timing: 'steps(10)',
      iteration: 'infinite',
      keyframes: `
@keyframes glitch-custom {
  0% { transform: translate(0); clip-path: inset(0 0 0 0); }
  10% { transform: translate(-2px, 2px); clip-path: inset(10% 0 85% 0); }
  20% { transform: translate(2px, -2px); clip-path: inset(85% 0 5% 0); }
  30% { transform: translate(-2px, -2px); clip-path: inset(50% 0 30% 0); }
  40% { transform: translate(2px, 2px); clip-path: inset(10% 0 60% 0); }
  50% { transform: translate(0); clip-path: inset(0 0 0 0); }
}`
    };
  }

  if (p.includes('orbit')) {
    return {
      name: 'orbit-custom',
      duration: '3s',
      timing: 'linear',
      iteration: 'infinite',
      keyframes: `
@keyframes orbit-custom {
  0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
}`
    };
  }

  if (p.includes('type') || p.includes('write')) {
    return {
      name: 'typewriter-custom',
      duration: '2s',
      timing: 'steps(20)',
      iteration: 'infinite',
      keyframes: `
@keyframes typewriter-custom {
  0% { width: 0; border-right: 2px solid white; }
  90% { width: 100%; border-right: 2px solid white; }
  100% { width: 100%; border-right: none; }
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
