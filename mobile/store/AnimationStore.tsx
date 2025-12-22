import { create } from 'zustand';

export type EmotionalState =
  | 'idle' | 'listening' | 'processing' | 'responding'
  | 'skeptical' | 'annoyed' | 'impressed' | 'suspicious'
  | 'softMode' | 'maximumGrump' | 'sleepy' | 'error'
  | 'thinkingDeep' | 'smug' | 'exasperatedSigh' | 'reluctantAgreement'
  | 'sleep' | 'jumpscare' | 'birthday' | 'threeAM'
  | 'codeReview' | 'designMode' | 'animationFlow' | 'debugMode' | 'playtesting'
  | 'bored' | 'confused' | 'ecstatic' | 'panicked' | 'triumphant'
  | 'judging' | 'mocking' | 'sarcastic' | 'deadpan' | 'furious'
  | 'kafkaesque' | 'existentialDread' | 'zen' | 'wired' | 'caffeinated';

export type BlinkType = 'standard' | 'slow' | 'heavy' | 'quickDouble' | 'half' | 'wink' | 'flutter' | 'wide';
export type ParticleType = 'sleepZ' | 'confetti' | 'coffeeSteam' | 'angerParticle' | 'sparkle' | 'glitchRectangle' | 'rain' | 'binary' | 'fire' | 'heart' | null;
export type AccessoryType = 'coffeeMug' | 'partyHat' | 'sunglasses' | 'monocle' | 'headset' | 'crown' | null;
export type MouthState = 'flat' | 'frown' | 'slightFrown' | 'smirk' | 'open' | 'pursed' | 'tight' | 'almostSmile' | 'part' | 'muttering' | 'exaggeratedFrown' | 'neutral' | 'wavy' | 'wideOpen' | 'gritTeeth' | 'tongueOut';
export type GlowColor = 'red' | 'orange' | 'soft' | 'intense';

export interface AnimationState {
  currentState: EmotionalState;
  isBlinking: boolean;
  blinkType: BlinkType;
  breathingScale: number;
  glowIntensity: number;
  glowPulseRate: number;
  glowColor: GlowColor;
  leftPupilX: number;
  leftPupilY: number;
  leftPupilSize: number;
  rightPupilX: number;
  rightPupilY: number;
  rightPupilSize: number;
  leftEyebrowRotation: number;
  rightEyebrowRotation: number;
  leftEyebrowY: number;
  rightEyebrowY: number;
  leftEyelidTopY: number;
  rightEyelidTopY: number;
  mouthState: MouthState;
  // Extended properties
  particleType?: ParticleType;
  showAccessories?: boolean;
  accessoryType?: AccessoryType;
  eyeRollActive?: boolean;
  screenShake?: boolean;
}

interface AnimationStore {
  state: AnimationState;
  transitionToState: (newState: EmotionalState) => void;
  triggerBlink: (type?: BlinkType) => void;
  updateEyeTracking: (position: number) => void;
}

const initialState: AnimationState = {
  currentState: 'annoyed',
  isBlinking: false,
  blinkType: 'standard',
  breathingScale: 1.0,
  glowIntensity: 0.4,
  glowPulseRate: 2.0,
  glowColor: 'red',
  leftPupilX: 0,
  leftPupilY: 0,
  leftPupilSize: 12,
  rightPupilX: 0,
  rightPupilY: 0,
  rightPupilSize: 12,
  leftEyebrowRotation: 15,
  rightEyebrowRotation: 15,
  leftEyebrowY: 0,
  rightEyebrowY: 0,
  leftEyelidTopY: -24,
  rightEyelidTopY: -24,
  mouthState: 'frown',
};

const getStateConfig = (state: EmotionalState): Partial<AnimationState> => {
  const configs: Record<EmotionalState, Partial<AnimationState>> = {
    idle: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'flat',
      glowIntensity: 0.4,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    listening: {
      leftEyebrowRotation: -3,
      rightEyebrowRotation: 3,
      mouthState: 'open',
      glowIntensity: 0.6,
      glowPulseRate: 1.0,
      glowColor: 'orange'
    },
    processing: {
      leftEyebrowRotation: -12,
      rightEyebrowRotation: 12,
      mouthState: 'pursed',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    responding: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'open',
      glowIntensity: 0.3,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    skeptical: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -18,
      mouthState: 'smirk',
      glowIntensity: 0.4,
      glowPulseRate: 1.5,
      glowColor: 'red'
    },
    annoyed: {
      leftEyebrowRotation: -18,
      rightEyebrowRotation: 18,
      mouthState: 'tight',
      glowIntensity: 0.6,
      glowPulseRate: 1.2,
      glowColor: 'red'
    },
    maximumGrump: {
      leftEyebrowRotation: -25,
      rightEyebrowRotation: 25,
      mouthState: 'exaggeratedFrown',
      glowIntensity: 0.8,
      glowPulseRate: 0.8,
      glowColor: 'intense'
    },
    impressed: {
      leftEyebrowRotation: 2,
      rightEyebrowRotation: -2,
      mouthState: 'almostSmile',
      glowIntensity: 0.5,
      glowPulseRate: 1.8,
      glowColor: 'orange'
    },
    suspicious: {
      leftEyebrowRotation: -20,
      rightEyebrowRotation: -8,
      mouthState: 'tight',
      glowIntensity: 0.4,
      glowPulseRate: 1.8,
      glowColor: 'red'
    },
    softMode: {
      leftEyebrowRotation: 5,
      rightEyebrowRotation: -5,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 2.5,
      glowColor: 'soft'
    },
    sleepy: {
      leftEyebrowRotation: 8,
      rightEyebrowRotation: -8,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 4.0,
      glowColor: 'soft'
    },
    error: {
      leftEyebrowRotation: -10,
      rightEyebrowRotation: 15,
      mouthState: 'frown',
      glowIntensity: 0.6,
      glowPulseRate: 0.5,
      glowColor: 'intense'
    },
    thinkingDeep: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      mouthState: 'pursed',
      glowIntensity: 0.5,
      glowPulseRate: 1.2,
      glowColor: 'orange'
    },
    smug: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -20,
      mouthState: 'smirk',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'red'
    },
    exasperatedSigh: {
      leftEyebrowRotation: -8,
      rightEyebrowRotation: 8,
      mouthState: 'open',
      glowIntensity: 0.4,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    reluctantAgreement: {
      leftEyebrowRotation: -3,
      rightEyebrowRotation: 3,
      mouthState: 'flat',
      glowIntensity: 0.3,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    sleep: {
      leftEyebrowRotation: 10,
      rightEyebrowRotation: -10,
      mouthState: 'flat',
      glowIntensity: 0.1,
      glowPulseRate: 5.0,
      glowColor: 'soft'
    },
    jumpscare: {
      leftEyebrowRotation: 0,
      rightEyebrowRotation: 0,
      mouthState: 'open',
      glowIntensity: 0.8,
      glowPulseRate: 0.3,
      glowColor: 'intense'
    },
    birthday: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      mouthState: 'tight',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    threeAM: {
      leftEyebrowRotation: 5,
      rightEyebrowRotation: -5,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 3.0,
      glowColor: 'soft'
    },
    codeReview: {
      leftEyebrowRotation: -12,
      rightEyebrowRotation: 12,
      leftEyebrowY: -3,
      rightEyebrowY: -3,
      mouthState: 'pursed',
      glowIntensity: 0.55,
      glowPulseRate: 1.3,
      glowColor: 'orange'
    },
    designMode: {
      leftEyebrowRotation: -8,
      rightEyebrowRotation: 8,
      mouthState: 'open',
      glowIntensity: 0.5,
      glowPulseRate: 1.8,
      glowColor: 'orange'
    },
    animationFlow: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      mouthState: 'almostSmile',
      glowIntensity: 0.45,
      glowPulseRate: 2.2,
      glowColor: 'orange'
    },
    debugMode: {
      leftEyebrowRotation: -10,
      rightEyebrowRotation: 10,
      leftEyebrowY: 5,
      rightEyebrowY: 5,
      mouthState: 'frown',
      glowIntensity: 0.7,
      glowPulseRate: 0.9,
      glowColor: 'intense'
    },
    playtesting: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'open',
      glowIntensity: 0.6,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    bored: {
      leftEyebrowRotation: 0,
      rightEyebrowRotation: 0,
      leftEyelidTopY: -10,
      rightEyelidTopY: -10,
      mouthState: 'flat',
      glowIntensity: 0.1,
      glowPulseRate: 0.5,
      glowColor: 'soft'
    },
    confused: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 5,
      leftEyebrowY: -5,
      rightEyebrowY: 0,
      mouthState: 'wavy',
      glowIntensity: 0.4,
      glowPulseRate: 2.0,
      glowColor: 'orange'
    },
    ecstatic: {
      leftEyebrowRotation: 10,
      rightEyebrowRotation: -10,
      leftEyebrowY: -10,
      rightEyebrowY: -10,
      mouthState: 'wideOpen',
      glowIntensity: 1.0,
      glowPulseRate: 4.0,
      glowColor: 'intense'
    },
    panicked: {
      leftEyebrowRotation: 15,
      rightEyebrowRotation: -15,
      leftPupilSize: 6,
      rightPupilSize: 6,
      mouthState: 'open',
      glowIntensity: 0.9,
      glowPulseRate: 6.0,
      glowColor: 'red'
    },
    triumphant: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'smirk',
      glowIntensity: 0.8,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    judging: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -5,
      leftEyelidTopY: -15,
      rightEyelidTopY: -15,
      mouthState: 'tight',
      glowIntensity: 0.3,
      glowPulseRate: 1.0,
      glowColor: 'soft'
    },
    mocking: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: -5,
      mouthState: 'tongueOut',
      glowIntensity: 0.6,
      glowPulseRate: 2.5,
      glowColor: 'orange'
    },
    sarcastic: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -15,
      mouthState: 'smirk',
      leftEyelidTopY: -18,
      rightEyelidTopY: -12,
      glowIntensity: 0.4,
      glowPulseRate: 1.2,
      glowColor: 'orange'
    },
    deadpan: {
      leftEyebrowRotation: 0,
      rightEyebrowRotation: 0,
      mouthState: 'flat',
      leftEyelidTopY: -20,
      rightEyelidTopY: -20,
      glowIntensity: 0.2,
      glowPulseRate: 0.5,
      glowColor: 'soft'
    },
    furious: {
      leftEyebrowRotation: -30,
      rightEyebrowRotation: 30,
      leftEyebrowY: 5,
      rightEyebrowY: 5,
      mouthState: 'gritTeeth',
      glowIntensity: 1.0,
      glowPulseRate: 8.0,
      glowColor: 'intense'
    },
    kafkaesque: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 15,
      leftPupilSize: 4,
      rightPupilSize: 14,
      mouthState: 'wavy',
      glowIntensity: 0.1,
      glowPulseRate: 0.2,
      glowColor: 'soft'
    },
    existentialDread: {
      leftEyebrowRotation: 10,
      rightEyebrowRotation: -10,
      leftPupilSize: 16,
      rightPupilSize: 16,
      mouthState: 'open',
      glowIntensity: 0.05,
      glowPulseRate: 0.1,
      glowColor: 'soft'
    },
    zen: {
      leftEyebrowRotation: 0,
      rightEyebrowRotation: 0,
      leftEyelidTopY: 0,
      rightEyelidTopY: 0,
      mouthState: 'almostSmile',
      glowIntensity: 0.6,
      glowPulseRate: 0.5,
      glowColor: 'soft'
    },
    wired: {
      leftEyebrowRotation: -10,
      rightEyebrowRotation: 10,
      leftPupilSize: 4,
      rightPupilSize: 4,
      mouthState: 'tight',
      glowIntensity: 0.9,
      glowPulseRate: 10.0,
      glowColor: 'intense'
    },
    caffeinated: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      leftPupilSize: 14,
      rightPupilSize: 14,
      mouthState: 'wideOpen',
      glowIntensity: 0.8,
      glowPulseRate: 5.0,
      glowColor: 'orange'
    }
  };

  return configs[state] || configs.idle;
};

export const useAnimation = create<AnimationStore>((set) => ({
  state: initialState,

  transitionToState: (newState: EmotionalState) => {
    const newStateConfig = getStateConfig(newState);
    set((state) => ({
      state: {
        ...state.state,
        currentState: newState,
        ...newStateConfig,
      },
    }));
  },

  triggerBlink: (type: BlinkType = 'standard') => {
    set((state) => ({
      state: {
        ...state.state,
        isBlinking: true,
        blinkType: type,
      },
    }));
    setTimeout(() => {
      set((state) => ({
        state: {
          ...state.state,
          isBlinking: false,
        },
      }));
    }, 150);
  },

  updateEyeTracking: (position: number) => {
    set((state) => ({
      state: {
        ...state.state,
        leftPupilX: position,
        rightPupilX: position,
      },
    }));
  },
}));

export const AnimationProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

