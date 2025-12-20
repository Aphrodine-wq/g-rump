import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

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
    fontSize: 15,
    lineHeight: 22,
    color: '#ffffff',
    marginBottom: 4,
  },
  cursor: {
    opacity: 0.5,
  },
  messageTimestamp: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
    fontWeight: '300',
  },
  userMessageTimestamp: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
    fontWeight: '300',
  },
});

