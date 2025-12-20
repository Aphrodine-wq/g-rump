import Foundation

enum EmotionalState: String, CaseIterable {
    // Core states
    case idle
    case listening
    case processing
    case responding
    
    // Reactive states
    case skeptical
    case annoyed
    case impressed
    case suspicious
    case softMode
    case maximumGrump
    
    // Additional expressions
    case sleepy
    case error
    case thinkingDeep
    case smug
    case exasperatedSigh
    case reluctantAgreement
    
    // Easter eggs
    case sleep
    case jumpscare
    case birthday
    case threeAM
}

struct AnimationState {
    var currentState: EmotionalState = .idle
    var mood: Mood = .neutral
    var lastStateChange: Date = Date()
    
    // Face component states - exact specifications
    var leftEyebrowRotation: Double = -5
    var rightEyebrowRotation: Double = 5
    var leftEyebrowY: Double = 0
    var rightEyebrowY: Double = 0
    var leftEyebrowX: Double = 0
    var rightEyebrowX: Double = 0
    
    // Eye scales (separate X and Y for deformation)
    var leftEyeScaleX: Double = 1.0
    var leftEyeScaleY: Double = 1.0
    var rightEyeScaleX: Double = 1.0
    var rightEyeScaleY: Double = 1.0
    
    // Pupil states
    var leftPupilX: Double = 0
    var leftPupilY: Double = 0
    var leftPupilSize: Double = 12.0 // Default 12pt
    var rightPupilX: Double = 0
    var rightPupilY: Double = 0
    var rightPupilSize: Double = 12.0
    
    // Eyelid positions
    var leftEyelidTopY: Double = -24 // Hidden by default
    var rightEyelidTopY: Double = -24
    var leftEyelidBottomY: Double = 20 // Hidden by default
    var rightEyelidBottomY: Double = 20
    
    var mouthState: MouthState = .flat
    var mouthWidth: Double = 40.0 // Default 40pt
    var mouthHeight: Double = 2.0 // Default 2pt (flat)
    var mouthCurveDepth: Double = 0.0 // For smiles/frowns
    
    // Glow ring
    var glowIntensity: Double = 0.4
    var glowPulseRate: Double = 2.0
    var glowColor: GlowColor = .red
    
    // Breathing
    var breathingScale: Double = 1.0
    
    // Idle timer
    var idleTime: TimeInterval = 0
    
    // Accessories
    var showAccessories: Bool = false
    var accessoryType: AccessoryType = .partyHat
    
    // Particles
    var particleType: ParticleType? = nil
}

enum Mood {
    case neutral
    case annoyed
    case thoughtful
    case sarcastic
    case caring
}

enum MouthState {
    case flat
    case frown
    case slightFrown
    case smirk
    case open
    case pursed
    case tight
    case almostSmile
    case part
    case muttering
    case exaggeratedFrown
    case neutral
    case wavy
}

enum GlowColor {
    case red
    case orange
    case soft
    case intense
}

enum ParticleType {
    case sleepZ
    case confetti
    case coffeeSteam
    case angerParticle
    case sparkle
    case glitchRectangle
}

