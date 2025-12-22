import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Grump2Props {
  mood?: 'neutral' | 'typing' | 'annoyed' | 'angry' | 'happy' | 'surprised';
  size?: number;
}

const BASE_SIZE = 300;

export default function Grump2({ mood = 'annoyed', size = 300 }: Grump2Props) {
  // Animation Values
  const breathAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  
  // Mood-based interpolated values
  const eyebrowRotateLeft = useRef(new Animated.Value(0)).current;
  const eyebrowRotateRight = useRef(new Animated.Value(0)).current;
  const mouthOpen = useRef(new Animated.Value(0)).current;
  
  const scale = size / BASE_SIZE;

  // Mood Definitions
  const moods = {
    neutral: { color: '#888888', eyebrowL: 0, eyebrowR: 0, mouth: 0 },
    annoyed: { color: '#966666', eyebrowL: 12, eyebrowR: -8, mouth: -5 },
    typing: { color: '#777777', eyebrowL: 5, eyebrowR: -5, mouth: 5 },
    angry: { color: '#ff4444', eyebrowL: 15, eyebrowR: -15, mouth: -10 },
    happy: { color: '#88cc88', eyebrowL: -5, eyebrowR: -5, mouth: 10 },
    surprised: { color: '#8888cc', eyebrowL: -10, eyebrowR: -10, mouth: 15 },
  };

  const currentMood = moods[mood] || moods.neutral;

  useEffect(() => {
    // Breathing Animation (Scale)
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating Animation (TranslateY)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Random Blinking
    const blinkLoop = () => {
      const delay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => blinkLoop());
      }, delay);
    };
    blinkLoop();
  }, []);

  // Mood Transitions
  useEffect(() => {
    Animated.parallel([
      Animated.timing(eyebrowRotateLeft, {
        toValue: currentMood.eyebrowL,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(eyebrowRotateRight, {
        toValue: currentMood.eyebrowR,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mouthOpen, {
        toValue: currentMood.mouth,
        duration: 300,
        useNativeDriver: false, // height/path not supported by native driver usually
      }),
    ]).start();
  }, [mood]);

  // Interpolations for rotation strings
  const leftBrowRotateStr = eyebrowRotateLeft.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });
  
  const rightBrowRotateStr = eyebrowRotateRight.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scale },
              { scaleX: breathAnim }, // Breathing effect
              { scaleY: breathAnim },
              { translateY: floatAnim }
            ],
            width: BASE_SIZE,
            height: BASE_SIZE,
          },
        ]}
      >
        {/* ARMS */}
        <View style={[styles.arm, styles.armLeft]} />
        <View style={[styles.arm, styles.armRight]} />

        {/* HANDS */}
        <View style={[styles.hand, styles.handLeft]}>
           <View style={[styles.finger, { left: 5, height: 16 }]} />
           <View style={[styles.finger, { left: 18, height: 22 }]} />
           <View style={[styles.finger, { left: 31, height: 24 }]} />
           <View style={[styles.finger, { left: 44, height: 20 }]} />
           <View style={[styles.thumb, styles.thumbLeft]} />
        </View>

        <View style={[styles.hand, styles.handRight]}>
           <View style={[styles.finger, { left: 5, height: 20 }]} />
           <View style={[styles.finger, { left: 18, height: 24 }]} />
           <View style={[styles.finger, { left: 31, height: 22 }]} />
           <View style={[styles.finger, { left: 44, height: 16 }]} />
           <View style={[styles.thumb, styles.thumbRight]} />
        </View>

        {/* FACE */}
        <View style={[styles.face, { backgroundColor: currentMood.color }]}>
          {/* Eyebrows */}
          <Animated.View style={[styles.eyebrow, styles.eyebrowLeft, { transform: [{ rotate: leftBrowRotateStr }] }]} />
          <Animated.View style={[styles.eyebrow, styles.eyebrowRight, { transform: [{ rotate: rightBrowRotateStr }] }]} />

          {/* Eyes */}
          <View style={[styles.eye, styles.eyeLeft]}>
            <Animated.View style={[styles.pupil, { transform: [{ scaleY: blinkAnim }] }]} />
          </View>
          <View style={[styles.eye, styles.eyeRight]}>
             <Animated.View style={[styles.pupil, { transform: [{ scaleY: blinkAnim }] }]} />
          </View>

          {/* Nose */}
          <View style={styles.nose} />

          {/* Mouth */}
          <View style={styles.mouthContainer}>
             <View style={styles.mouthLineTop} />
             <Animated.View style={[styles.mouthLineBottom, { marginTop: mouthOpen }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  container: {
    position: 'absolute', // Centered in wrapper
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: 300,
    height: 300,
    borderRadius: 150,
    position: 'absolute',
    top: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 2,
  },
  // Eyes
  eye: {
    width: 45,
    height: 45,
    backgroundColor: '#000', // Inverted from web: black eyes on face? No, web has white eyes.
    // Wait, web css: .eye { background: var(--theme-text); } -> Usually black.
    // Let's stick to the design. Web: eye is theme-text (black), pupil is face-bg (white/gray).
    // Actually grump.html says: .eye { background: var(--theme-text); } which is #000.
    borderRadius: 22.5,
    position: 'absolute',
    top: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeLeft: { left: 60 },
  eyeRight: { right: 60 },
  pupil: {
    width: 14,
    height: 14,
    backgroundColor: '#fff', // Pupil is light to contrast with black eye
    borderRadius: 7,
  },
  // Eyebrows
  eyebrow: {
    width: 60,
    height: 10,
    backgroundColor: '#000',
    position: 'absolute',
    top: 58,
    borderRadius: 5,
    zIndex: 3,
  },
  eyebrowLeft: { left: 55 },
  eyebrowRight: { right: 55 },
  // Nose
  nose: {
    width: 18,
    height: 35,
    backgroundColor: '#000',
    position: 'absolute',
    top: 148,
    left: 141, // 300/2 - 18/2
    borderRadius: 9,
    opacity: 0.8,
  },
  // Mouth
  mouthContainer: {
    position: 'absolute',
    bottom: 55,
    left: 105, // 300/2 - 90/2
    width: 90,
    alignItems: 'center',
  },
  mouthLineTop: {
    width: 90,
    height: 10,
    backgroundColor: '#000',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  mouthLineBottom: {
    width: 80,
    height: 10,
    backgroundColor: '#000',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  // Arms
  arm: {
    position: 'absolute',
    width: 28,
    height: 120,
    backgroundColor: '#888', // Should match face color ideally, but hardcoded for now or needs props
    borderRadius: 14,
    zIndex: 1,
    top: 150,
  },
  armLeft: {
    left: -20,
    transform: [{ rotate: '25deg' }],
  },
  armRight: {
    right: -20,
    transform: [{ rotate: '-25deg' }],
  },
  // Hands
  hand: {
    width: 60,
    height: 60,
    backgroundColor: '#888',
    position: 'absolute',
    borderRadius: 15,
    zIndex: 5,
    top: 250,
  },
  handLeft: {
    left: -40,
    transform: [{ rotate: '15deg' }],
  },
  handRight: {
    right: -40,
    transform: [{ rotate: '-15deg' }],
  },
  finger: {
    width: 12,
    backgroundColor: '#888',
    position: 'absolute',
    top: -15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  thumb: {
    width: 16,
    height: 25,
    backgroundColor: '#888',
    position: 'absolute',
    top: 10,
    borderRadius: 8,
  },
  thumbLeft: { right: -10, transform: [{ rotate: '-20deg' }] },
  thumbRight: { left: -10, transform: [{ rotate: '20deg' }] },
});
