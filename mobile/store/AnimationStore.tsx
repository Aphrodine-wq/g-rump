import { create } from 'zustand';

export type EmotionalState = 
  | 'idle' | 'listening' | 'processing' | 'responding'
  | 'skeptical' | 'annoyed' | 'impressed' | 'suspicious'
  | 'softMode' | 'maximumGrump' | 'sleepy' | 'error'
  | 'thinkingDeep' | 'smug' | 'exasperatedSigh' | 'reluctantAgreement'
  | 'sleep' | 'jumpscare' | 'birthday' | 'threeAM';

export type BlinkType = 'standard' | 'slow' | 'heavy' | 'quickDouble' | 'half' | 'wink';
export type ParticleType = 'sleepZ' | 'confetti' | 'coffeeSteam' | 'angerParticle' | 'sparkle' | 'glitchRectangle' | null;
export type AccessoryType = 'coffeeMug' | 'partyHat' | null;
export type MouthState = 'flat' | 'frown' | 'slightFrown' | 'smirk' | 'open' | 'pursed' | 'tight' | 'almostSmile' | 'part' | 'muttering' | 'exaggeratedFrown' | 'neutral' | 'wavy';
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
  rightPupilX: number;
  rightPupilY: number;
  leftEyebrowRotation: number;
  rightEyebrowRotation: number;
  mouthState: MouthState;
  // Extended properties (optional for mobile)
  particleType?: ParticleType;
  showAccessories?: boolean;
  accessoryType?: AccessoryType;
  eyeRollActive?: boolean;
  screenShake?: boolean;
}

interface AnimationStore {
  state: AnimationState;
  transitionToState: (newState: EmotionalState) => void;
  triggerBlink: () => void;
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
  rightPupilX: 0,
  rightPupilY: 0,
  leftEyebrowRotation: 15,
  rightEyebrowRotation: 15,
  mouthState: 'frown',
};

export const useAnimation = create<AnimationStore>((set) => ({
  state: initialState,

  transitionToState: (newState: EmotionalState) => {
    set((state) => ({
      state: {
        ...state.state,
        currentState: newState,
      },
    }));
  },

  triggerBlink: () => {
    set((state) => ({
      state: {
        ...state.state,
        isBlinking: true,
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

