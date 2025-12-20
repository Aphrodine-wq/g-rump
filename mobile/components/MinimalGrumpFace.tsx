import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface MinimalGrumpFaceProps {
  mood?: 'neutral' | 'typing' | 'annoyed';
  size?: number;
}

export default function MinimalGrumpFace({ mood = 'annoyed', size = 80 }: MinimalGrumpFaceProps) {
  const [breathingScale, setBreathingScale] = useState(1);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const breathingCycle = Math.sin(elapsed * (Math.PI / 2)); // 4s cycle
      setBreathingScale(1 + (breathingCycle * 0.08));
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Pissed off look - more furrowed brows, deeper frown
  const eyeOffset = mood === 'typing' ? 1 : mood === 'annoyed' ? -2 : -1;
  const browAngle = mood === 'annoyed' ? 18 : mood === 'typing' ? 10 : 15;
  const eyeSize = mood === 'annoyed' ? 3.5 : 4;
  const mouthPath = mood === 'typing' 
    ? "M 28 58 Q 40 54, 52 58"
    : mood === 'annoyed'
    ? "M 26 60 Q 40 56, 54 60"
    : "M 28 59 Q 40 55, 52 59";

  return (
    <View style={[styles.container, { transform: [{ scale: breathingScale }] }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80" style={styles.svg}>
        {/* Left eye */}
        {/* Brow */}
        <Line
          x1="18"
          y1={28 + eyeOffset}
          x2="32"
          y2={28 + browAngle + eyeOffset}
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Eye */}
        <Circle cx="25" cy={40 + eyeOffset} r={eyeSize} fill="#ffffff" />

        {/* Right eye */}
        {/* Brow */}
        <Line
          x1="62"
          y1={28 + eyeOffset}
          x2="48"
          y2={28 + browAngle + eyeOffset}
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Eye */}
        <Circle cx="55" cy={40 + eyeOffset} r={eyeSize} fill="#ffffff" />

        {/* Mouth - pissed off frown */}
        <Path
          d={mouthPath}
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

