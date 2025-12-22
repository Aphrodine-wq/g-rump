import { useState, useEffect } from 'react';

declare global {
  interface Window {
    GrumpEngine?: {
      setMood: (mood: string) => void;
      annoy: (amount: number) => number;
      soothe: (amount: number) => number;
      getState: () => GrumpState;
    };
  }
}

export interface GrumpState {
  mood: string;
  intensity: number;
  energy: number;
  annoyance: number;
}

export function useGrumpEngine() {
  const [state, setState] = useState<GrumpState>({
    mood: 'grumpy',
    intensity: 5,
    energy: 5,
    annoyance: 0
  });

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<GrumpState>) => {
      setState(e.detail);
    };

    window.addEventListener('grump-state-update', handleUpdate as EventListener);
    
    // Initial sync
    if (window.GrumpEngine) {
      setState(window.GrumpEngine.getState());
    }

    return () => {
      window.removeEventListener('grump-state-update', handleUpdate as EventListener);
    };
  }, []);

  const actions = {
    annoy: (amount: number) => window.GrumpEngine?.annoy(amount),
    soothe: (amount: number) => window.GrumpEngine?.soothe(amount),
    setMood: (mood: string) => window.GrumpEngine?.setMood(mood)
  };

  return { state, actions };
}
