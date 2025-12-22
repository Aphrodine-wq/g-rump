import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Grump2 from './Grump2';

interface OnboardingViewProps {
  onComplete: () => void;
}

interface OnboardingPage {
  title: string;
  description: string;
  showAvatar: boolean;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages: OnboardingPage[] = [
    {
      title: "Oh good. You're here.",
      description: "I'm Grump. The world's crankiest AI. I'll help, but I won't be happy about it.",
      showAvatar: true,
    },
    {
      title: "I'm not mean.",
      description: "Just perpetually unimpressed. But I'll help anyway.",
      showAvatar: true,
    },
    {
      title: "Ready? I guess.",
      description: "Ask me anything. I'll complain, but I'll help.",
      showAvatar: true,
    },
  ];

  const handleContinue = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {pages[currentPage].showAvatar && (
          <View style={styles.avatarContainer}>
            <Grump2 mood="annoyed" size={250} />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{pages[currentPage].title}</Text>
          <Text style={styles.description}>{pages[currentPage].description}</Text>
        </View>

        <View style={styles.indicators}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentPage && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>
            {currentPage < pages.length - 1 ? 'Continue' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  skipContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  avatarContainer: {
    marginBottom: 40,
  },
  textContainer: {
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 16,
    color: '#ffffff',
    fontFamily: 'Georgia',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    marginBottom: 40,
    fontWeight: '300',
    textAlign: 'center',
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#222222',
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    minWidth: 200,
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});

