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
    ...props
  };
};
