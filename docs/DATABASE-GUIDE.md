# Database Guide - How to Add Data

This guide explains how to add data to the database across different platforms in the Grump system.

## Overview

The Grump system uses different storage mechanisms depending on the platform:
- **iOS**: SwiftData (Core Data successor)
- **Web/Mobile (React Native)**: LocalStorage (browser) / AsyncStorage (mobile)
- **Backend**: No persistent database (currently stateless API)

---

## iOS (SwiftData)

### Data Models

The iOS app uses two main models:

1. **ChatSession** - Represents a conversation session
2. **Message** - Individual messages within a session

### Location
- Models: `ios/Grump/Models/ChatSession.swift` and `ios/Grump/Models/Message.swift`
- Service: `ios/Grump/Services/ChatService.swift`

### How to Add a Message

Messages are automatically saved when sent through `ChatService.sendMessage()`:

```swift
// In ChatService.swift - this happens automatically
let userMessage = Message(
    content: content,
    sender: .user,
    timestamp: Date(),
    session: currentSession
)

modelContext.insert(userMessage)  // Add to database
currentSession?.addMessage(userMessage)  // Link to session

try modelContext.save()  // Persist to disk
```

### Manual Database Operations

#### Create a New Session
```swift
func createNewSession() {
    let newSession = ChatSession()
    modelContext.insert(newSession)  // Add to database
    currentSession = newSession
    
    do {
        try modelContext.save()  // Save to disk
    } catch {
        print("Error creating session: \(error)")
    }
}
```

#### Add a Message Manually
```swift
func addMessageManually(content: String, sender: MessageSender) {
    guard let session = currentSession else { return }
    
    let message = Message(
        content: content,
        sender: sender,
        timestamp: Date(),
        session: session
    )
    
    modelContext.insert(message)
    session.addMessage(message)
    
    do {
        try modelContext.save()
        messages.append(message)
    } catch {
        print("Error saving message: \(error)")
    }
}
```

#### Query Messages
```swift
// Fetch all sessions
let descriptor = FetchDescriptor<ChatSession>(
    sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
)

do {
    let sessions = try modelContext.fetch(descriptor)
    // Process sessions...
} catch {
    print("Error fetching sessions: \(error)")
}

// Fetch messages from a session
let messages = session.messages.sorted { $0.timestamp < $1.timestamp }
```

#### Update Existing Data
```swift
// Update a message
message.content = "Updated content"
message.timestamp = Date()

do {
    try modelContext.save()
} catch {
    print("Error updating message: \(error)")
}
```

#### Delete Data
```swift
// Delete a message
modelContext.delete(message)

do {
    try modelContext.save()
} catch {
    print("Error deleting message: \(error)")
}

// Delete a session (cascade deletes messages due to .cascade deleteRule)
modelContext.delete(session)

do {
    try modelContext.save()
} catch {
    print("Error deleting session: \(error)")
}
```

---

## Web (React/TypeScript)

### Storage Method: LocalStorage

The web app stores chat history in browser localStorage.

### Location
- Store: `web/src/store/ChatStore.tsx`

### How to Add a Message

Messages are saved automatically when sent:

```typescript
const sendMessage = async (content: string) => {
  const userMessage: Message = {
    id: Date.now().toString(),
    content: content.trim(),
    sender: 'user',
    timestamp: new Date(),
  };

  // Add to state
  setMessages(prev => [...prev, userMessage]);

  // Save to localStorage
  saveSessionToHistory([...messages, userMessage]);
};
```

### Manual Database Operations

#### Save Session to History
```typescript
const saveSessionToHistory = (messages: Message[]) => {
  try {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({
      id: Date.now().toString(),
      messages,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('chatHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
```

#### Load Session from History
```typescript
const loadSessionFromHistory = (sessionId: string): Message[] => {
  try {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const session = history.find((s: any) => s.id === sessionId);
    return session?.messages || [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};
```

#### Clear All History
```typescript
const clearAllHistory = () => {
  localStorage.removeItem('chatHistory');
  setMessages([]);
};
```

---

## Mobile (React Native/Expo)

### Storage Method: AsyncStorage

Similar to web but uses AsyncStorage instead of localStorage.

### Location
- Store: `mobile/store/ChatStore.tsx`

### How to Add Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save messages
const saveMessages = async (messages: Message[]) => {
  try {
    await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

// Load messages
const loadMessages = async (): Promise<Message[]> => {
  try {
    const data = await AsyncStorage.getItem('chatMessages');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};
```

---

## Adding Custom Data Models

### iOS: Adding a New Model

1. Create a new Swift file in `ios/Grump/Models/`:

```swift
import Foundation
import SwiftData

@Model
final class UserPreference {
    var key: String
    var value: String
    var updatedAt: Date
    
    init(key: String, value: String, updatedAt: Date = Date()) {
        self.key = key
        self.value = value
        self.updatedAt = updatedAt
    }
}
```

2. Register in `GrumpApp.swift`:

```swift
.modelContainer(for: [ChatSession.self, Message.self, UserPreference.self])
```

3. Use in your service:

```swift
let preference = UserPreference(key: "theme", value: "dark")
modelContext.insert(preference)
try modelContext.save()
```

### Web: Adding Custom Data

```typescript
// Create a new store or extend existing
interface CustomData {
  id: string;
  data: any;
  timestamp: Date;
}

const saveCustomData = (data: CustomData) => {
  const existing = JSON.parse(localStorage.getItem('customData') || '[]');
  existing.push(data);
  localStorage.setItem('customData', JSON.stringify(existing));
};
```

---

## Best Practices

### iOS (SwiftData)
- Always wrap `modelContext.save()` in a do-catch block
- Use `@MainActor` for UI-related database operations
- Leverage relationships for data consistency (e.g., `.cascade` delete rules)
- Consider batch operations for performance

### Web/Mobile
- Use try-catch for localStorage/AsyncStorage operations
- Implement error handling for corrupted data
- Consider size limits (localStorage typically 5-10MB)
- Use JSON.stringify/parse for complex objects

### General
- Always validate data before saving
- Handle errors gracefully
- Consider data migration strategies for schema changes
- Implement data cleanup/archival for old records

---

## Troubleshooting

### iOS: "Error saving message"
- Check that modelContext is properly initialized
- Verify the model is registered in modelContainer
- Ensure you're on the main actor for UI-related saves

### Web: localStorage quota exceeded
- Implement data cleanup for old sessions
- Consider using IndexedDB for larger datasets
- Compress data before storing

### Data not persisting
- Verify save operations complete successfully
- Check for errors in console/logs
- Ensure proper error handling is in place

---

## Next Steps

For more advanced database features, consider:
- Backend database integration (PostgreSQL, MongoDB, etc.)
- Data synchronization across devices
- Cloud storage integration
- Data encryption for sensitive information
- Migration strategies for schema updates
