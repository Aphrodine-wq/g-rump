import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Grump2 from './Grump2';

interface OnboardingViewProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState<'intro' | 'tutorial' | 'ready'>('intro');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Sequence: Grump fades in -> Wait -> Text fades in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setShowButton(true));
  }, []);

  const handleContinue = () => {
    if (step === 'intro') {
      setStep('tutorial');
    } else if (step === 'tutorial') {
      setStep('ready');
    } else {
      onComplete();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <View style={styles.textWrapper}>
            <Text style={styles.title}>G-RUMP</Text>
            <Text style={styles.subtitle}>The Anti-Assistant</Text>
          </View>
        );
      case 'tutorial':
        return (
          <View style={styles.textWrapper}>
            <Text style={styles.instruction}>
              I'm here to help, but I won't pretend to like it.
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bullet}>• Swipe to ignore me</Text>
              <Text style={styles.bullet}>• Tap to annoy me</Text>
              <Text style={styles.bullet}>• Type to make me work</Text>
            </View>
          </View>
        );
      case 'ready':
        return (
          <View style={styles.textWrapper}>
            <Text style={styles.instruction}>
              Let's get this over with.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.grumpContainer, { opacity: fadeAnim }]}>
        <Grump2 mood={step === 'ready' ? 'annoyed' : 'neutral'} size={width * 0.8} />
      </Animated.View>

      <Animated.View style={[styles.contentContainer, { opacity: textAnim }]}>
        {renderContent()}
        
        {showButton && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {step === 'ready' ? 'Enter' : 'Next'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  grumpContainer: {
    marginTop: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    fontWeight: '400',
    letterSpacing: 1,
  },
  instruction: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 32,
    marginBottom: 20,
  },
  bulletPoints: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

