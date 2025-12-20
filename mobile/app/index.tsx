import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatView from '../components/ChatView';
import OnboardingView from '../components/OnboardingView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setHasCompletedOnboarding(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  };

  if (hasCompletedOnboarding === null) {
    return null; // Loading state
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!hasCompletedOnboarding ? (
        <OnboardingView onComplete={handleCompleteOnboarding} />
      ) : (
        <ChatView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

