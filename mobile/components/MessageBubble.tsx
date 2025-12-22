import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'grump';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  index?: number;
}

export default function MessageBubble({ message, index = 0 }: MessageBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const isGrump = message.sender === 'grump';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    if (isGrump) {
      // Character-by-character reveal for Grump messages
      let index = 0;
      const chars = message.content.split('');
      const speed = 30; // ms per character
      
      const timer = setInterval(() => {
        if (index < chars.length) {
          setDisplayedText(message.content.substring(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, isGrump]);

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isGrump ? styles.grumpMessage : styles.userMessage,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={isGrump ? styles.messageContent : styles.userMessageContent}>
        {displayedText}
        {isGrump && displayedText.length < message.content.length && (
          <Text style={styles.cursor}>|</Text>
        )}
      </Text>
      <Text style={isGrump ? styles.messageTimestamp : styles.userMessageTimestamp}>
        {formatTime(message.timestamp)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 4,
  },
  grumpMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#222222',
    borderBottomLeftRadius: 4,
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E5E5EA', // Off-white for readability
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  userMessageContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E', // Dark gray text on white bubble
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  cursor: {
    opacity: 0.5,
    color: '#32D74B', // Cursor color matches accent
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  userMessageTimestamp: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 2,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
});

