export const GrumpConfig = {
  appearance: {
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    secondaryColor: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: '24px',
    animationSpeed: 1.0, // Multiplier
  },
  behavior: {
    grumpLevel: 1.0, // 0.0 to 1.0
    sarcasmEnabled: true,
    rageModeTriggerThreshold: 0.8,
    responseDelay: 500, // ms
  },
  features: {
    voiceEnabled: false,
    soundEnabled: true,
    hapticsEnabled: true,
    autoSave: true,
  },
  animations: {
    targetFPS: 120,
    physicsEnabled: true,
    particleCount: 50,
  }
};

export type GrumpConfigType = typeof GrumpConfig;

export const updateConfig = (newConfig: Partial<GrumpConfigType>) => {
  Object.assign(GrumpConfig, newConfig);
};
