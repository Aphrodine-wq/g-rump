import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '../store/ChatStore';
import Grump2 from './Grump2';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatView() {
  const { messages, isTyping, errorMessage, sendMessage, createNewSession } = useChat();
  const [messageText, setMessageText] = useState('');
  const [mood, setMood] = useState<'neutral' | 'typing' | 'annoyed' | 'angry' | 'happy' | 'surprised'>('annoyed');
  const [statusText, setStatusText] = useState('what do you want');
  const [darkMode] = useState(true); // Always dark for now
  const messagesEndRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) {
      setMood('typing');
      setStatusText('typing...');
    } else if (messages.length > 0 && messages[messages.length - 1].sender === 'grump') {
      setMood('annoyed');
      setStatusText('hmph.');
      setTimeout(() => {
        setMood('annoyed');
        setStatusText('what do you want');
      }, 2000);
    } else {
      setMood('annoyed');
      setStatusText('what do you want');
    }
  }, [isTyping, messages]);

  useEffect(() => {
    if (errorMessage) {
      setMood('angry');
      setStatusText('something went wrong. great.');
    }
  }, [errorMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    
    if (text.length > 0) {
      setMood('typing');
      setStatusText('you\'re typing. great.');
    } else {
      setMood('annoyed');
      setStatusText('what do you want');
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    const text = messageText.trim();
    setMessageText('');
    setMood('typing');
    setStatusText('typing...');
    
    await sendMessage(text);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      locations={[0, 0.5, 1]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.logo}>G-RUMP</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                createNewSession();
                setMood('annoyed');
                setStatusText('what do you want');
              }}
            >
              <Text style={styles.iconBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {/* <View style={styles.avatarRing} /> Ring removed for new design */}
          <View style={styles.avatarFace}>
            <Grump2 mood={mood} size={250} />
          </View>
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={messagesEndRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
      >
        {messages.length === 0 && !isTyping ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>"Go ahead. I'm listening."</Text>
            <Text style={styles.emptyStateSubtext}>(reluctantly)</Text>
          </View>
        ) : (
          <>
            {messages.map((message, i) => (
              <MessageBubble key={message.id} message={message} index={i} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
      </ScrollView>

      {/* Error Message */}
      {errorMessage && (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputSection, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="say something..."
            placeholderTextColor="#666666"
            value={messageText}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSend}
            editable={!isTyping}
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!messageText.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || isTyping}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBtnText: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#222222',
  },
  avatarFace: {
    position: 'relative',
    zIndex: 1,
  },
  statusText: {
    marginTop: 24,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 200,
  },
  emptyStateText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 18,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  errorMessage: {
    padding: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputField: {
    flex: 1,
    height: 48,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '400',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#1a1a1a',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sendButtonDisabled: {
    opacity: 0.4,
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
});

