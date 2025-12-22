import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Claude-style palette: Warm, sophisticated, natural
const PALETTE = {
  backgroundTop: '#1a1a1c',
  backgroundBottom: '#0d0d0e',
  accent: '#d4d4ce', // Warm off-white/beige
  particle: 'rgba(212, 212, 206, 0.1)',
  spotlight: 'rgba(255, 255, 255, 0.03)',
};

const PARTICLE_COUNT = 15;

interface ParticleProps {
  index: number;
}

const Particle = ({ index }: ParticleProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  const horizontalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 4000 + Math.random() * 6000;
    const delay = Math.random() * 5000;

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            delay: delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(horizontalAnim, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
          Animated.timing(horizontalAnim, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const translateX = horizontalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20 + Math.random() * 40, 20 + Math.random() * 40],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  const size = 2 + Math.random() * 4;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: Math.random() * width,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
};

export default function GameEnvironment() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Base Background */}
      <LinearGradient
        colors={[PALETTE.backgroundTop, PALETTE.backgroundBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient Spotlight (Top Center) */}
      <View style={styles.spotlightContainer}>
        <LinearGradient
          colors={[PALETTE.spotlight, 'transparent']}
          style={styles.spotlight}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      {/* Atmospheric Particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}

      {/* Floor Shadow/Grounding */}
      <View style={styles.floorContainer}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.floor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spotlightContainer: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: height * 0.6,
    alignItems: 'center',
  },
  spotlight: {
    width: width * 1.5,
    height: '100%',
    borderRadius: width,
    transform: [{ scaleX: 1.5 }],
  },
  particle: {
    position: 'absolute',
    backgroundColor: PALETTE.accent,
  },
  floorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  floor: {
    flex: 1,
  },
});
