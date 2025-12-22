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
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '../store/ChatStore';
import Grump2 from './Grump2';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const { width, height } = Dimensions.get('window');

export default function HomeView() {
  const { messages, isTyping, errorMessage, sendMessage, createNewSession } = useChat();
  const [messageText, setMessageText] = useState('');
  const [mood, setMood] = useState<'neutral' | 'typing' | 'annoyed' | 'angry' | 'happy' | 'surprised'>('annoyed');
  const insets = useSafeAreaInsets();
  const messagesEndRef = useRef<ScrollView>(null);
  
  // Animation for Chat Drawer
  const drawerHeight = useRef(new Animated.Value(height * 0.6)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = height * 0.6 - gestureState.dy;
        if (newHeight > height * 0.3 && newHeight < height * 0.85) {
          drawerHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Snap to positions
        if (gestureState.dy < -50) {
          // Dragged up -> Expand
          Animated.spring(drawerHeight, { toValue: height * 0.85, useNativeDriver: false }).start();
        } else if (gestureState.dy > 50) {
          // Dragged down -> Collapse
          Animated.spring(drawerHeight, { toValue: height * 0.4, useNativeDriver: false }).start();
        } else {
           // Return to default
           Animated.spring(drawerHeight, { toValue: height * 0.6, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) setMood('typing');
    else if (messages.length > 0 && messages[messages.length - 1].sender === 'grump') {
      setMood('annoyed');
      setTimeout(() => setMood('neutral'), 3000);
    } else {
      setMood('neutral');
    }
  }, [isTyping, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const text = messageText.trim();
    setMessageText('');
    setMood('typing');
    await sendMessage(text);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.background} />

      {/* Grump Area (Top) */}
      <View style={[styles.grumpArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
           <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuOpen(true)}>
             <Text style={styles.menuIcon}>☰</Text>
           </TouchableOpacity>
           <Text style={styles.headerTitle}>G-RUMP</Text>
           <TouchableOpacity style={styles.menuButton} onPress={createNewSession}>
             <Text style={styles.menuIcon}>+</Text>
           </TouchableOpacity>
        </View>
        
        <View style={styles.grumpWrapper}>
          <Grump2 mood={mood} size={width * 0.6} />
        </View>
      </View>

      {/* Chat Drawer (Bottom) */}
      <Animated.View style={[styles.chatDrawer, { height: drawerHeight }]}>
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView
          ref={messagesEndRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Say something. If you must.</Text>
            </View>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} index={i} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              placeholderTextColor="#666"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnText}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Hidden Navigation Menu Overlay */}
      {isMenuOpen && (
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1} 
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={[styles.menuContainer, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.menuTitle}>Menu</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>About Grump</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeMenuBtn}
              onPress={() => setIsMenuOpen(false)}
            >
              <Text style={styles.closeMenuText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  grumpArea: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    alignSelf: 'center',
  },
  grumpWrapper: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1e', // Apple-like dark gray
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#3a3a3c',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#2c2c2e',
    borderRadius: 22,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0a84ff', // iOS Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 100,
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: '70%',
    height: '100%',
    backgroundColor: '#1c1c1e',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 40,
    letterSpacing: 1,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  closeMenuBtn: {
    marginTop: 40,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeMenuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
