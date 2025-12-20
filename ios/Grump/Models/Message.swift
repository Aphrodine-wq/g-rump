import Foundation
import SwiftData

@Model
final class Message {
    var id: UUID
    var content: String
    var sender: MessageSender
    var timestamp: Date
    var session: ChatSession?
    
    init(id: UUID = UUID(), content: String, sender: MessageSender, timestamp: Date = Date(), session: ChatSession? = nil) {
        self.id = id
        self.content = content
        self.sender = sender
        self.timestamp = timestamp
        self.session = session
    }
}

enum MessageSender: String, Codable {
    case user
    case grump
}

