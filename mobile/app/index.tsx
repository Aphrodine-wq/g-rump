import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeView from '../components/HomeView';
import OnboardingView from '../components/OnboardingView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

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
    <View style={styles.container}>
      {!hasCompletedOnboarding ? (
        <OnboardingView onComplete={handleCompleteOnboarding} />
      ) : (
        <HomeView />
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

