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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.logo}>grump</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 12,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 20,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: -0.02,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: '#ffffff',
    fontSize: 18,
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
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
    letterSpacing: 0.02,
    textTransform: 'lowercase',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 200,
  },
  emptyStateText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ffffff',
    opacity: 0.4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '300',
  },
  errorMessage: {
    padding: 8,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ffffff',
  },
  inputSection: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  inputField: {
    flex: 1,
    height: 52,
    paddingHorizontal: 24,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '400',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 26,
    color: '#ffffff',
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 20,
  },
});

