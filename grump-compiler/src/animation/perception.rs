//! Perceptual Engineering for Animation
//! 
//! This module implements animation as **information flow over time**,
//! not just motion. Every micro-motion is treated as a **message**,
//! optimized for human perceptual decoding.

use crate::error::GrumpResult;

// ============================================================================
// PART 1: HIERARCHY OF SIGNALS IN HUMAN PERCEPTION
// ============================================================================

/// Represents a signal (message) encoded in motion
#[derive(Debug, Clone)]
pub struct MotionSignal {
    /// What information this signal conveys
    pub intent: SignalIntent,
    
    /// Priority level (higher = more important)
    pub priority: u8,
    
    /// Perceptual salience (0.0 = background, 1.0 = foreground)
    pub salience: f64,
    
    /// Timing window (when this signal is active)
    pub timing: SignalTiming,
    
    /// What body part conveys this signal
    pub carrier: SignalCarrier,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SignalIntent {
    /// Macro-intent: big picture communication
    MacroIntent(String),
    
    /// Emotional state
    Emotion(String),
    
    /// Physical state
    Physical(String),
    
    /// Social context
    Social(String),
    
    /// Environmental response
    Environmental(String),
}

#[derive(Debug, Clone)]
pub struct SignalTiming {
    /// When signal starts (seconds)
    pub start: f64,
    
    /// When signal peaks (seconds)
    pub peak: f64,
    
    /// When signal ends (seconds)
    pub end: f64,
    
    /// Anticipation window (seconds before start)
    pub anticipation: f64,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SignalCarrier {
    Eyes,
    Brows,
    Head,
    Torso,
    Limbs,
    Accessories,
    Environment,
}

/// Hierarchy of signals in human perception
#[derive(Debug, Clone)]
pub struct SignalHierarchy {
    /// Macro-intent (big picture - determines all else)
    pub macro_intent: MotionSignal,
    
    /// Kinematic exaggeration signals
    pub exaggeration: Vec<MotionSignal>,
    
    /// Micro-expressions and timing signals
    pub micro_expressions: Vec<MotionSignal>,
    
    /// Secondary motion signals (followers)
    pub secondary: Vec<MotionSignal>,
    
    /// Environmental response signals
    pub environmental: Vec<MotionSignal>,
}

impl SignalHierarchy {
    /// Get all signals ordered by priority
    pub fn by_priority(&self) -> Vec<&MotionSignal> {
        let mut signals = Vec::new();
        signals.push(&self.macro_intent);
        signals.extend(self.exaggeration.iter());
        signals.extend(self.micro_expressions.iter());
        signals.extend(self.secondary.iter());
        signals.extend(self.environmental.iter());
        
        signals.sort_by(|a, b| b.priority.cmp(&a.priority));
        signals
    }
    
    /// Filter signals by salience threshold
    pub fn foreground_signals(&self, threshold: f64) -> Vec<&MotionSignal> {
        self.by_priority()
            .into_iter()
            .filter(|s| s.salience >= threshold)
            .collect()
    }
}

// ============================================================================
// PART 2: TEMPORAL COGNITION AND EXPECTATION
// ============================================================================

/// Models human temporal expectations
#[derive(Debug, Clone)]
pub struct TemporalCognition {
    /// Anticipation windows for different motion types
    pub anticipation_windows: AnticipationWindows,
    
    /// Velocity asymmetry curves
    pub velocity_asymmetry: VelocityAsymmetry,
    
    /// Rhythmic coherence model
    pub rhythm: RhythmModel,
    
    /// Expectation violation generator
    pub violations: ViolationModel,
}

#[derive(Debug, Clone)]
pub struct AnticipationWindows {
    /// Small motions (50-150ms)
    pub small_motion_ms: (u32, u32),
    
    /// Full-body actions (150-400ms)
    pub full_body_ms: (u32, u32),
    
    /// Emotional actions (80-200ms)
    pub emotional_ms: (u32, u32),
}

impl Default for AnticipationWindows {
    fn default() -> Self {
        Self {
            small_motion_ms: (50, 150),
            full_body_ms: (150, 400),
            emotional_ms: (80, 200),
        }
    }
}

#[derive(Debug, Clone)]
pub struct VelocityAsymmetry {
    /// Fast-in multiplier (action start)
    pub fast_in: f64,
    
    /// Slow-out multiplier (action end)
    pub slow_out: f64,
    
    /// Curve type for acceleration
    pub curve: AccelerationCurve,
}

impl Default for VelocityAsymmetry {
    fn default() -> Self {
        Self {
            fast_in: 1.5,  // 50% faster into action
            slow_out: 0.6, // 40% slower into rest
            curve: AccelerationCurve::Exponential,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum AccelerationCurve {
    Linear,
    Exponential,
    Logarithmic,
    Bezier(f64, f64, f64, f64), // Control points
}

#[derive(Debug, Clone)]
pub struct RhythmModel {
    /// Pulse duration (seconds)
    pub pulse_duration: f64,
    
    /// Pulse intervals (seconds)
    pub intervals: Vec<f64>,
    
    /// Coherence threshold (max deviation before dissonance)
    pub coherence_threshold: f64,
}

impl Default for RhythmModel {
    fn default() -> Self {
        Self {
            pulse_duration: 0.2, // 200ms pulses
            intervals: vec![0.1, 0.15, 0.2, 0.25], // Variable intervals
            coherence_threshold: 0.05, // 50ms max deviation
        }
    }
}

#[derive(Debug, Clone)]
pub struct ViolationModel {
    /// Probability of anticipation overshoot (0.0-1.0)
    pub overshoot_probability: f64,
    
    /// Probability of subtle delays (0.0-1.0)
    pub delay_probability: f64,
    
    /// Maximum violation magnitude (0.0-1.0)
    pub max_magnitude: f64,
}

impl Default for ViolationModel {
    fn default() -> Self {
        Self {
            overshoot_probability: 0.3, // 30% chance
            delay_probability: 0.2,    // 20% chance
            max_magnitude: 0.1,        // 10% max deviation
        }
    }
}

impl TemporalCognition {
    /// Get anticipation window for motion type
    pub fn anticipation_for(&self, motion_type: MotionType) -> (u32, u32) {
        match motion_type {
            MotionType::Small => self.anticipation_windows.small_motion_ms,
            MotionType::FullBody => self.anticipation_windows.full_body_ms,
            MotionType::Emotional => self.anticipation_windows.emotional_ms,
        }
    }
    
    /// Generate velocity curve with asymmetry
    pub fn velocity_curve(&self, duration: f64) -> Vec<(f64, f64)> {
        // Generate curve points with fast-in, slow-out
        let mut points = Vec::new();
        let steps = 20;
        
        for i in 0..=steps {
            let t = i as f64 / steps as f64;
            let velocity = match self.velocity_asymmetry.curve {
                AccelerationCurve::Exponential => {
                    if t < 0.5 {
                        // Fast in
                        self.velocity_asymmetry.fast_in * (t * 2.0).powf(2.0)
                    } else {
                        // Slow out
                        self.velocity_asymmetry.slow_out * (1.0 - (t - 0.5) * 2.0).powf(2.0)
                    }
                }
                _ => 1.0, // Default linear
            };
            points.push((t * duration, velocity));
        }
        
        points
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum MotionType {
    Small,
    FullBody,
    Emotional,
}

// ============================================================================
// PART 3: COGNITIVE LOAD MANAGEMENT
// ============================================================================

/// Manages cognitive load to prevent information overload
#[derive(Debug, Clone)]
pub struct CognitiveLoadManager {
    /// Foreground motion threshold (salience)
    pub foreground_threshold: f64,
    
    /// Background motion threshold (salience)
    pub background_threshold: f64,
    
    /// Maximum simultaneous foreground signals
    pub max_foreground: usize,
    
    /// Noise filter sensitivity
    pub noise_sensitivity: f64,
}

impl Default for CognitiveLoadManager {
    fn default() -> Self {
        Self {
            foreground_threshold: 0.7,
            background_threshold: 0.3,
            max_foreground: 3, // Max 3 foreground signals at once
            noise_sensitivity: 0.1, // Filter out <10% salience
        }
    }
}

impl CognitiveLoadManager {
    /// Classify signals into foreground/background
    pub fn classify(&self, signals: &[MotionSignal]) -> (Vec<&MotionSignal>, Vec<&MotionSignal>) {
        let mut foreground = Vec::new();
        let mut background = Vec::new();
        
        for signal in signals {
            if signal.salience >= self.foreground_threshold {
                foreground.push(signal);
            } else if signal.salience >= self.background_threshold {
                background.push(signal);
            }
            // Below background_threshold = noise, filtered out
        }
        
        // Limit foreground signals
        foreground.sort_by(|a, b| b.priority.cmp(&a.priority));
        if foreground.len() > self.max_foreground {
            foreground.truncate(self.max_foreground);
        }
        
        (foreground, background)
    }
    
    /// Check if signal hierarchy is cognitively manageable
    pub fn is_manageable(&self, hierarchy: &SignalHierarchy) -> bool {
        let (foreground, _) = self.classify(&hierarchy.by_priority());
        foreground.len() <= self.max_foreground
    }
    
    /// Reduce cognitive load by lowering salience of less important signals
    pub fn reduce_load(&self, hierarchy: &mut SignalHierarchy) {
        let signals = hierarchy.by_priority();
        let (foreground, background) = self.classify(&signals);
        
        // If too many foreground, demote some
        if foreground.len() > self.max_foreground {
            // Demote excess signals to background
            for signal in foreground.iter().skip(self.max_foreground) {
                // In real implementation, would modify signal salience
                // For now, this is a placeholder
            }
        }
    }
}

// ============================================================================
// PART 4: SOCIAL CONTEXT ENCODING
// ============================================================================

/// Maps gestures to social meanings
#[derive(Debug, Clone)]
pub struct SocialSemantics {
    /// Gesture → meaning mappings
    pub gesture_meanings: Vec<GestureMeaning>,
    
    /// Cultural context
    pub cultural_context: CulturalContext,
    
    /// Intent clarity matrix
    pub intent_clarity: IntentClarityMatrix,
}

#[derive(Debug, Clone)]
pub struct GestureMeaning {
    /// Gesture description
    pub gesture: String,
    
    /// Primary meaning
    pub primary_meaning: String,
    
    /// Secondary meanings
    pub secondary_meanings: Vec<String>,
    
    /// Intensity levels
    pub intensity_levels: Vec<(f64, String)>, // (intensity, meaning)
}

#[derive(Debug, Clone)]
pub struct CulturalContext {
    /// Cultural identifier
    pub culture: String,
    
    /// Culture-specific gesture mappings
    pub mappings: Vec<GestureMeaning>,
}

#[derive(Debug, Clone)]
pub struct IntentClarityMatrix {
    /// Maps gestures to human-readable meanings
    pub matrix: Vec<(String, String)>, // (gesture, meaning)
}

impl SocialSemantics {
    /// Get meaning for a gesture
    pub fn meaning_for(&self, gesture: &str, intensity: f64) -> Option<String> {
        for gm in &self.gesture_meanings {
            if gm.gesture == gesture {
                // Find appropriate intensity level
                for (int, meaning) in &gm.intensity_levels {
                    if intensity <= *int {
                        return Some(meaning.clone());
                    }
                }
                return Some(gm.primary_meaning.clone());
            }
        }
        None
    }
    
    /// Check if gesture is culturally appropriate
    pub fn is_culturally_appropriate(&self, gesture: &str) -> bool {
        // Check against cultural context
        self.cultural_context.mappings.iter()
            .any(|gm| gm.gesture == gesture)
    }
}

impl Default for SocialSemantics {
    fn default() -> Self {
        Self {
            gesture_meanings: vec![
                GestureMeaning {
                    gesture: "shoulder_shrug".to_string(),
                    primary_meaning: "confusion".to_string(),
                    secondary_meanings: vec!["uncertainty".to_string(), "dismissal".to_string()],
                    intensity_levels: vec![
                        (0.3, "mild confusion".to_string()),
                        (0.6, "confusion".to_string()),
                        (1.0, "comedic effect".to_string()),
                    ],
                },
                GestureMeaning {
                    gesture: "eye_roll".to_string(),
                    primary_meaning: "annoyance".to_string(),
                    secondary_meanings: vec!["dismissal".to_string(), "impatience".to_string()],
                    intensity_levels: vec![
                        (0.4, "mild annoyance".to_string()),
                        (0.7, "annoyance".to_string()),
                        (1.0, "exasperation".to_string()),
                    ],
                },
            ],
            cultural_context: CulturalContext {
                culture: "western".to_string(),
                mappings: Vec::new(),
            },
            intent_clarity: IntentClarityMatrix {
                matrix: Vec::new(),
            },
        }
    }
}

// ============================================================================
// PART 5: INTERNAL MOTION CONSISTENCY
// ============================================================================

/// Validates kinematic coherence
#[derive(Debug, Clone)]
pub struct MotionConsistency {
    /// Anatomical constraints
    pub anatomy: AnatomicalConstraints,
    
    /// Physical causality rules
    pub causality: CausalityRules,
    
    /// Energy flow model
    pub energy: EnergyFlow,
    
    /// Microphysics model
    pub microphysics: Microphysics,
}

#[derive(Debug, Clone)]
pub struct AnatomicalConstraints {
    /// Joint limits (angle ranges)
    pub joint_limits: Vec<(String, (f64, f64))>, // (joint, (min_angle, max_angle))
    
    /// Limb proportions
    pub proportions: Vec<(String, f64)>, // (limb, ratio)
    
    /// Mass distribution
    pub mass_distribution: Vec<(String, f64)>, // (body_part, mass_ratio)
}

#[derive(Debug, Clone)]
pub struct CausalityRules {
    /// Rules: cause → effect
    pub rules: Vec<CausalityRule>,
}

#[derive(Debug, Clone)]
pub struct CausalityRule {
    /// What causes the motion
    pub cause: String,
    
    /// What is affected
    pub effect: String,
    
    /// Required delay (seconds)
    pub delay: f64,
    
    /// Strength of effect (0.0-1.0)
    pub strength: f64,
}

#[derive(Debug, Clone)]
pub struct EnergyFlow {
    /// Momentum transfer rules
    pub momentum_rules: Vec<MomentumRule>,
}

#[derive(Debug, Clone)]
pub struct MomentumRule {
    /// Source of momentum
    pub source: String,
    
    /// Target of momentum
    pub target: String,
    
    /// Transfer efficiency (0.0-1.0)
    pub efficiency: f64,
}

#[derive(Debug, Clone)]
pub struct Microphysics {
    /// Head bob parameters
    pub head_bob: HeadBob,
    
    /// Torso sway parameters
    pub torso_sway: TorsoSway,
    
    /// Muscle contraction model
    pub muscle: MuscleModel,
}

#[derive(Debug, Clone)]
pub struct HeadBob {
    /// Enabled
    pub enabled: bool,
    
    /// Frequency (Hz)
    pub frequency: f64,
    
    /// Amplitude (0.0-1.0)
    pub amplitude: f64,
}

#[derive(Debug, Clone)]
pub struct TorsoSway {
    /// Enabled
    pub enabled: bool,
    
    /// Frequency (Hz)
    pub frequency: f64,
    
    /// Amplitude (0.0-1.0)
    pub amplitude: f64,
}

#[derive(Debug, Clone)]
pub struct MuscleModel {
    /// Contraction intensity (0.0-1.0)
    pub intensity: f64,
    
    /// Contraction timing (seconds)
    pub timing: f64,
}

impl MotionConsistency {
    /// Validate motion against all constraints
    pub fn validate(&self, motion: &MotionSignal) -> ConsistencyResult {
        let mut issues = Vec::new();
        
        // Check anatomical constraints
        // (Would need actual motion data to validate)
        
        // Check causality
        // (Would need motion graph to validate)
        
        ConsistencyResult {
            valid: issues.is_empty(),
            issues,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ConsistencyResult {
    pub valid: bool,
    pub issues: Vec<String>,
}

// ============================================================================
// PART 6: MULTI-MODAL INTEGRATION
// ============================================================================

/// Integrates animation with other modalities
#[derive(Debug, Clone)]
pub struct MultiModalIntegration {
    /// Voice/speech sync
    pub voice_sync: VoiceSync,
    
    /// Sound cue alignment
    pub sound_cues: SoundCues,
    
    /// Environment interaction
    pub environment: EnvironmentInteraction,
}

#[derive(Debug, Clone)]
pub struct VoiceSync {
    /// Lip sync parameters
    pub lip_sync: LipSync,
    
    /// Facial expression sync
    pub facial_sync: FacialSync,
    
    /// Breathing rhythm sync
    pub breathing: BreathingSync,
}

#[derive(Debug, Clone)]
pub struct LipSync {
    /// Enabled
    pub enabled: bool,
    
    /// Sync accuracy threshold (0.0-1.0)
    pub accuracy: f64,
}

#[derive(Debug, Clone)]
pub struct FacialSync {
    /// Enabled
    pub enabled: bool,
    
    /// Expression timing offset (seconds)
    pub timing_offset: f64,
}

#[derive(Debug, Clone)]
pub struct BreathingSync {
    /// Enabled
    pub enabled: bool,
    
    /// Breathing rate (breaths per second)
    pub rate: f64,
}

#[derive(Debug, Clone)]
pub struct SoundCues {
    /// Footfall timing
    pub footfalls: FootfallTiming,
    
    /// Cloth rustling
    pub cloth: ClothTiming,
    
    /// Environmental sounds
    pub environmental: EnvironmentalSounds,
}

#[derive(Debug, Clone)]
pub struct FootfallTiming {
    /// Enabled
    pub enabled: bool,
    
    /// Timing offset (seconds before/after contact)
    pub offset: f64,
}

#[derive(Debug, Clone)]
pub struct ClothTiming {
    /// Enabled
    pub enabled: bool,
    
    /// Timing offset (seconds)
    pub offset: f64,
}

#[derive(Debug, Clone)]
pub struct EnvironmentalSounds {
    /// Enabled
    pub enabled: bool,
    
    /// Sound triggers
    pub triggers: Vec<SoundTrigger>,
}

#[derive(Debug, Clone)]
pub struct SoundTrigger {
    /// Motion event that triggers sound
    pub motion_event: String,
    
    /// Sound to play
    pub sound: String,
    
    /// Timing offset (seconds)
    pub offset: f64,
}

#[derive(Debug, Clone)]
pub struct EnvironmentInteraction {
    /// Feedback loops
    pub feedback_loops: Vec<FeedbackLoop>,
}

#[derive(Debug, Clone)]
pub struct FeedbackLoop {
    /// Character motion affects environment
    pub character_to_env: String,
    
    /// Environment affects next motion
    pub env_to_character: String,
    
    /// Delay (seconds)
    pub delay: f64,
}

// ============================================================================
// PART 7: PERCEPTUAL VALIDATION
// ============================================================================

/// Validates animation from human perceptual perspective
#[derive(Debug, Clone)]
pub struct PerceptualValidator {
    /// Contrast detection threshold
    pub contrast_threshold: f64,
    
    /// Signal-to-noise ratio threshold
    pub snr_threshold: f64,
    
    /// Salience timing tolerance
    pub timing_tolerance: f64,
}

impl Default for PerceptualValidator {
    fn default() -> Self {
        Self {
            contrast_threshold: 0.3, // 30% contrast needed
            snr_threshold: 2.0,      // 2:1 signal-to-noise
            timing_tolerance: 0.05,  // 50ms tolerance
        }
    }
}

impl PerceptualValidator {
    /// Validate signal hierarchy for perceptual clarity
    pub fn validate(&self, hierarchy: &SignalHierarchy) -> PerceptualResult {
        let mut issues = Vec::new();
        
        // Check contrast
        let signals = hierarchy.by_priority();
        if signals.len() > 1 {
            let max_salience = signals[0].salience;
            let min_salience = signals.last().unwrap().salience;
            let contrast = max_salience - min_salience;
            
            if contrast < self.contrast_threshold {
                issues.push("Insufficient contrast between signals".to_string());
            }
        }
        
        // Check signal-to-noise
        let (foreground, background) = CognitiveLoadManager::default().classify(&signals);
        let signal_power: f64 = foreground.iter().map(|s| s.salience).sum();
        let noise_power: f64 = background.iter().map(|s| s.salience).sum();
        
        if noise_power > 0.0 {
            let snr = signal_power / noise_power;
            if snr < self.snr_threshold {
                issues.push(format!("Low signal-to-noise ratio: {:.2}", snr));
            }
        }
        
        PerceptualResult {
            valid: issues.is_empty(),
            issues,
        }
    }
}

#[derive(Debug, Clone)]
pub struct PerceptualResult {
    pub valid: bool,
    pub issues: Vec<String>,
}

