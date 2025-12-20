import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChatProvider } from '../store/ChatStore';
import { AnimationProvider } from '../store/AnimationStore';

export default function RootLayout() {
  return (
    <ChatProvider>
      <AnimationProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar style="light" />
      </AnimationProvider>
    </ChatProvider>
  );
}

