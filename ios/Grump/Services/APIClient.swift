import Foundation

struct ChatRequest: Codable {
    let message: String
    let conversationHistory: [MessageHistoryItem]?
}

struct MessageHistoryItem: Codable {
    let sender: String
    let content: String
    let timestamp: String?
}

struct ChatResponse: Codable {
    let response: String
    let timestamp: String
}

enum APIError: Error {
    case invalidURL
    case invalidResponse
    case httpError(Int)
    case decodingError
    case networkError(Error)
}

class APIClient {
    static let shared = APIClient()
    
    // Configure your backend URL here
    #if DEBUG
    private let baseURL = "http://localhost:3000"
    #else
    private let baseURL = "https://your-production-api.com"
    #endif
    
    private init() {}
    
    func sendMessage(_ message: String, conversationHistory: [Message] = []) async throws -> String {
        guard let url = URL(string: "\(baseURL)/api/chat") else {
            throw APIError.invalidURL
        }
        
        let historyItems = conversationHistory.map { msg in
            MessageHistoryItem(
                sender: msg.sender.rawValue,
                content: msg.content,
                timestamp: ISO8601DateFormatter().string(from: msg.timestamp)
            )
        }
        
        let requestBody = ChatRequest(
            message: message,
            conversationHistory: historyItems.isEmpty ? nil : historyItems
        )
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(requestBody)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                throw APIError.httpError(httpResponse.statusCode)
            }
            
            let chatResponse = try JSONDecoder().decode(ChatResponse.self, from: data)
            return chatResponse.response
        } catch let error as DecodingError {
            print("Decoding error: \(error)")
            throw APIError.decodingError
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
}

