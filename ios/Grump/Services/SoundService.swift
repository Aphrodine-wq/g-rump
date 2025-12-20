import AVFoundation
import AudioToolbox
import UIKit

class SoundService {
    static let shared = SoundService()
    
    private var audioPlayers: [String: AVAudioPlayer] = [:]
    private var isMuted: Bool = false
    private var respectsDoNotDisturb: Bool = true
    
    private init() {
        setupAudioSession()
        loadSounds()
    }
    
    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to setup audio session: \(error)")
        }
    }
    
    private func loadSounds() {
        // In a real implementation, you would load actual sound files
        // For now, we'll use system sounds as placeholders
        // Sound files would be: grump_hmph.caf, grump_sigh.caf, etc.
    }
    
    func playSound(_ soundType: SoundType) {
        guard !isMuted else { return }
        
        if respectsDoNotDisturb {
            // Check if Do Not Disturb is active
            // This is a simplified check - in production, you'd use proper DND detection
        }
        
        // System sound IDs for placeholder sounds
        var soundID: SystemSoundID = 0
        
        switch soundType {
        case .messageReceived:
            // Low grumbly "hmph"
            AudioServicesPlaySystemSound(1057) // System sound as placeholder
            
        case .eyeRoll:
            // Soft exhale/sigh
            AudioServicesPlaySystemSound(1054)
            
        case .typing:
            // Reluctant keyboard taps (would be custom sound)
            // For now, silent or very quiet
            break
            
        case .impressed:
            // Surprised short breath
            AudioServicesPlaySystemSound(1053)
            
        case .appOpen:
            // Single heavy "ugh"
            AudioServicesPlaySystemSound(1054)
            
        case .notification:
            // Grumpy mumble
            AudioServicesPlaySystemSound(1057)
        }
    }
    
    func setMuted(_ muted: Bool) {
        isMuted = muted
    }
    
    func setRespectsDoNotDisturb(_ respects: Bool) {
        respectsDoNotDisturb = respects
    }
}

enum SoundType {
    case messageReceived
    case eyeRoll
    case typing
    case impressed
    case appOpen
    case notification
}

