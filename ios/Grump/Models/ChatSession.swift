import Foundation
import SwiftData

@Model
final class ChatSession {
    var id: UUID
    @Relationship(deleteRule: .cascade) var messages: [Message] = []
    var createdAt: Date
    var updatedAt: Date
    
    init(id: UUID = UUID(), createdAt: Date = Date(), updatedAt: Date = Date()) {
        self.id = id
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
    
    func addMessage(_ message: Message) {
        messages.append(message)
        message.session = self
        updatedAt = Date()
    }
}

