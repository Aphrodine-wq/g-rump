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
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
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
            <View style={styles.avatarFace}>
              <Grump2 mood={mood} size={200} />
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
          showsVerticalScrollIndicator={false}
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
        <View style={[styles.inputSection, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Say something..."
              placeholderTextColor="#86868b"
              value={messageText}
              onChangeText={handleTextChange}
              onSubmitEditing={handleSend}
              editable={!isTyping}
              multiline={false}
              returnKeyType="send"
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7', // Apple standard gray
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    zIndex: 10,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBtnText: {
    color: '#1d1d1f',
    fontSize: 20,
    fontWeight: '400',
    marginTop: -2,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 32,
    backgroundColor: '#f5f5f7',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  avatarFace: {
    position: 'relative',
    zIndex: 1,
  },
  statusText: {
    marginTop: 20,
    fontSize: 14,
    color: '#86868b',
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'lowercase',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 200,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#86868b',
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#aeaeb2',
    fontWeight: '400',
  },
  errorMessage: {
    padding: 12,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    zIndex: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#f5f5f7',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 0,
  },
  inputField: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'transparent',
    color: '#1d1d1f',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1d1d1f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    opacity: 0.3,
    backgroundColor: '#86868b',
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: -2,
  },
});
