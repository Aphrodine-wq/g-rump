//! Animation Reasoner for G-Rump
//! 
//! This module implements the six-layer animation reasoning system:
//! 1. Narrative Intent
//! 2. Attention Hierarchy
//! 3. Beat Structure
//! 4. Causal Chains
//! 5. Temporal Relationships
//! 6. Settling & Residue
//!
//! Core principle: Animation is decision compression over time, not interpolation.

use crate::error::GrumpResult;

// ============================================================================
// LAYER 1: NARRATIVE INTENT
// ============================================================================

/// The root of all animation decisions
#[derive(Debug, Clone)]
pub struct NarrativeIntent {
    /// Primary message the audience must understand
    pub primary: String,
    
    /// Secondary messages that support the primary
    pub secondary: Vec<String>,
    
    /// Explicitly forbidden interpretations
    pub forbidden: Vec<String>,
    
    /// Emotional tone
    pub emotion: Emotion,
    
    /// Intensity level (0.0 = subtle, 1.0 = extreme)
    pub intensity: f64,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Emotion {
    Neutral,
    Annoyed,
    Happy,
    Sad,
    Surprised,
    Thinking,
    Judging,
    Impressed,
    Working,
    Proud,
    Error,
    // Add more as needed
}

impl NarrativeIntent {
    /// Validate that a proposed motion aligns with intent
    pub fn allows_motion(&self, motion_description: &str) -> bool {
        // Check if motion could be interpreted as forbidden
        for forbidden in &self.forbidden {
            if motion_description.to_lowercase().contains(&forbidden.to_lowercase()) {
                return false;
            }
        }
        true
    }
    
    /// Get timing characteristics based on emotion
    pub fn timing_profile(&self) -> TimingProfile {
        match self.emotion {
            Emotion::Annoyed => TimingProfile {
                anticipation_ms: 80,
                action_ms: 120,
                recovery_ms: 600,
                ease_in: EaseType::FastOut,
                ease_out: EaseType::Heavy,
            },
            Emotion::Thinking => TimingProfile {
                anticipation_ms: 150,
                action_ms: 300,
                recovery_ms: 400,
                ease_in: EaseType::Smooth,
                ease_out: EaseType::Smooth,
            },
            Emotion::Happy => TimingProfile {
                anticipation_ms: 60,
                action_ms: 200,
                recovery_ms: 300,
                ease_in: EaseType::Bounce,
                ease_out: EaseType::Light,
            },
            _ => TimingProfile::default(),
        }
    }
}

// ============================================================================
// LAYER 2: ATTENTION HIERARCHY
// ============================================================================

/// Defines what leads the animation and in what order
#[derive(Debug, Clone)]
pub struct AttentionHierarchy {
    /// Primary attention leader (always moves first)
    pub leader: AttentionTarget,
    
    /// Secondary supports (follow leader)
    pub secondary: Vec<AttentionTarget>,
    
    /// Tertiary supports (follow secondary)
    pub tertiary: Vec<AttentionTarget>,
    
    /// What must remain still
    pub still: Vec<AttentionTarget>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum AttentionTarget {
    Eyes,
    Brows,
    Head,
    Body,
    Limbs,
    Accessories,
    Particles,
}

impl AttentionHierarchy {
    /// Get the order in which targets should move
    pub fn movement_order(&self) -> Vec<&AttentionTarget> {
        let mut order = vec![&self.leader];
        order.extend(self.secondary.iter());
        order.extend(self.tertiary.iter());
        order
    }
    
    /// Check if a target is allowed to move
    pub fn can_move(&self, target: &AttentionTarget) -> bool {
        !self.still.contains(target)
    }
    
    /// Get delay for a target based on hierarchy
    pub fn delay_for(&self, target: &AttentionTarget) -> f64 {
        if target == &self.leader {
            0.0
        } else if self.secondary.contains(target) {
            0.05 // 50ms delay after leader
        } else if self.tertiary.contains(target) {
            0.12 // 120ms delay after leader
        } else {
            // Not in hierarchy, should not move
            f64::INFINITY
        }
    }
}

// ============================================================================
// LAYER 3: BEAT STRUCTURE
// ============================================================================

/// A perceptual unit of meaning in time
#[derive(Debug, Clone)]
pub struct Beat {
    /// Name/description of this beat
    pub name: String,
    
    /// Duration in seconds
    pub duration: f64,
    
    /// Delay before this beat starts (relative to previous)
    pub delay: f64,
    
    /// What drives this beat
    pub driver: Option<AttentionTarget>,
    
    /// Easing type
    pub ease: EaseType,
    
    /// Is this a stillness beat?
    pub stillness: bool,
    
    /// Priority (higher = more important)
    pub priority: u8,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EaseType {
    FastOut,
    Heavy,
    Smooth,
    Bounce,
    Light,
    Sharp,
}

/// Collection of beats that form an animation
#[derive(Debug, Clone)]
pub struct BeatStructure {
    pub beats: Vec<Beat>,
}

impl BeatStructure {
    /// Create a beat structure from intent and hierarchy
    pub fn from_intent(intent: &NarrativeIntent, hierarchy: &AttentionHierarchy) -> Self {
        let timing = intent.timing_profile();
        let mut beats = Vec::new();
        
        // Beat 1: Anticipation (stillness)
        beats.push(Beat {
            name: "anticipation".to_string(),
            duration: timing.anticipation_ms / 1000.0,
            delay: 0.0,
            driver: None,
            ease: EaseType::Smooth,
            stillness: true,
            priority: 10,
        });
        
        // Beat 2: Leader action
        beats.push(Beat {
            name: format!("{}_action", hierarchy.leader),
            duration: timing.action_ms / 1000.0,
            delay: 0.0,
            driver: Some(hierarchy.leader.clone()),
            ease: timing.ease_in.clone(),
            stillness: false,
            priority: 10,
        });
        
        // Beat 3: Followers (with delays)
        for (i, target) in hierarchy.secondary.iter().enumerate() {
            beats.push(Beat {
                name: format!("{}_follow", target),
                duration: timing.action_ms / 1000.0 * 1.5,
                delay: hierarchy.delay_for(target),
                driver: Some(target.clone()),
                ease: timing.ease_out.clone(),
                stillness: false,
                priority: 7,
            });
        }
        
        // Beat 4: Recovery
        beats.push(Beat {
            name: "recovery".to_string(),
            duration: timing.recovery_ms / 1000.0,
            delay: 0.0,
            driver: None,
            ease: EaseType::Smooth,
            stillness: false,
            priority: 5,
        });
        
        Self { beats }
    }
    
    /// Get total duration
    pub fn total_duration(&self) -> f64 {
        self.beats.iter()
            .map(|b| b.delay + b.duration)
            .fold(0.0, f64::max)
    }
}

// ============================================================================
// LAYER 4: CAUSAL CHAINS
// ============================================================================

/// Represents a cause → effect relationship
#[derive(Debug, Clone)]
pub struct CausalChain {
    /// What causes the motion
    pub cause: String,
    
    /// What is affected
    pub effect: AttentionTarget,
    
    /// Delay between cause and effect (seconds)
    pub delay: f64,
    
    /// Strength of the effect (0.0 = none, 1.0 = full)
    pub strength: f64,
}

/// Collection of causal relationships
#[derive(Debug, Clone)]
pub struct CausalModel {
    pub chains: Vec<CausalChain>,
}

impl CausalModel {
    /// Create default causal chains for humanoid animation
    pub fn humanoid_default() -> Self {
        Self {
            chains: vec![
                // Eye movements cause lid movements
                CausalChain {
                    cause: "eye_roll".to_string(),
                    effect: AttentionTarget::Brows,
                    delay: 0.02, // 20ms
                    strength: 0.6,
                },
                // Head tilt causes neck compression
                CausalChain {
                    cause: "head_tilt".to_string(),
                    effect: AttentionTarget::Body,
                    delay: 0.05, // 50ms
                    strength: 0.3,
                },
                // Emotional state causes brow movement
                CausalChain {
                    cause: "emotion_change".to_string(),
                    effect: AttentionTarget::Brows,
                    delay: 0.08, // 80ms
                    strength: 0.8,
                },
            ],
        }
    }
    
    /// Get effects for a given cause
    pub fn effects_of(&self, cause: &str) -> Vec<&CausalChain> {
        self.chains.iter()
            .filter(|chain| chain.cause == cause)
            .collect()
    }
}

// ============================================================================
// LAYER 5: TEMPORAL RELATIONSHIPS
// ============================================================================

/// Timing profile for different emotional states
#[derive(Debug, Clone)]
pub struct TimingProfile {
    /// Anticipation duration (ms)
    pub anticipation_ms: u32,
    
    /// Main action duration (ms)
    pub action_ms: u32,
    
    /// Recovery duration (ms)
    pub recovery_ms: u32,
    
    /// Ease in type
    pub ease_in: EaseType,
    
    /// Ease out type
    pub ease_out: EaseType,
}

impl Default for TimingProfile {
    fn default() -> Self {
        Self {
            anticipation_ms: 100,
            action_ms: 200,
            recovery_ms: 400,
            ease_in: EaseType::Smooth,
            ease_out: EaseType::Smooth,
        }
    }
}

/// Temporal relationships between animation elements
#[derive(Debug, Clone)]
pub struct TemporalRelations {
    /// Eye movement duration (ms)
    pub eye_movement_ms: u32,
    
    /// Head lag after eyes (ms)
    pub head_lag_ms: u32,
    
    /// Body lag after head (ms)
    pub body_lag_ms: u32,
    
    /// Emotional action start speed multiplier
    pub emotion_start_speed: f64,
    
    /// Recovery speed multiplier (slower than action)
    pub recovery_speed: f64,
}

impl Default for TemporalRelations {
    fn default() -> Self {
        Self {
            eye_movement_ms: 120,
            head_lag_ms: 60,
            body_lag_ms: 120,
            emotion_start_speed: 1.5, // Faster start
            recovery_speed: 0.6, // Slower recovery
        }
    }
}

// ============================================================================
// LAYER 6: SETTLING & RESIDUE
// ============================================================================

/// Micro-movements that make animation feel alive
#[derive(Debug, Clone)]
pub struct Settling {
    /// Micro-settles after main motion
    pub micro_settles: Vec<MicroSettle>,
    
    /// Slight overshoot amount (0.0 = none, 1.0 = full)
    pub overshoot: f64,
    
    /// Asymmetry factor (0.0 = symmetric, 1.0 = asymmetric)
    pub asymmetry: f64,
    
    /// Delayed stop duration (ms)
    pub delayed_stop_ms: u32,
}

#[derive(Debug, Clone)]
pub struct MicroSettle {
    /// Target that settles
    pub target: AttentionTarget,
    
    /// Delay before settling starts (ms)
    pub delay_ms: u32,
    
    /// Settle duration (ms)
    pub duration_ms: u32,
    
    /// Amount of settle (0.0 = none, 1.0 = full)
    pub amount: f64,
}

impl Default for Settling {
    fn default() -> Self {
        Self {
            micro_settles: vec![
                MicroSettle {
                    target: AttentionTarget::Head,
                    delay_ms: 50,
                    duration_ms: 200,
                    amount: 0.1,
                },
            ],
            overshoot: 0.05, // 5% overshoot
            asymmetry: 0.15, // 15% asymmetry
            delayed_stop_ms: 30, // 30ms delayed stop
        }
    }
}

// ============================================================================
// ANIMATION IR (INTERMEDIATE REPRESENTATION)
// ============================================================================

/// Complete animation reasoning result
#[derive(Debug, Clone)]
pub struct AnimationIR {
    /// Layer 1: What are we trying to communicate?
    pub intent: NarrativeIntent,
    
    /// Layer 2: What leads the motion?
    pub hierarchy: AttentionHierarchy,
    
    /// Layer 3: What are the beats?
    pub beats: BeatStructure,
    
    /// Layer 4: What causes what?
    pub causality: CausalModel,
    
    /// Layer 5: How do things relate in time?
    pub timing: TemporalRelations,
    
    /// Layer 6: How does it settle?
    pub settling: Settling,
}

impl AnimationIR {
    /// Create an animation IR from intent
    pub fn from_intent(intent: NarrativeIntent) -> Self {
        // Determine hierarchy from intent
        let hierarchy = Self::hierarchy_from_intent(&intent);
        
        // Create beat structure
        let beats = BeatStructure::from_intent(&intent, &hierarchy);
        
        // Use default causal model (can be customized)
        let causality = CausalModel::humanoid_default();
        
        // Use default timing (can be customized)
        let timing = TemporalRelations::default();
        
        // Use default settling (can be customized)
        let settling = Settling::default();
        
        Self {
            intent,
            hierarchy,
            beats,
            causality,
            timing,
            settling,
        }
    }
    
    /// Determine attention hierarchy from intent
    fn hierarchy_from_intent(intent: &NarrativeIntent) -> AttentionHierarchy {
        match intent.emotion {
            Emotion::Annoyed | Emotion::Judging => {
                AttentionHierarchy {
                    leader: AttentionTarget::Eyes,
                    secondary: vec![AttentionTarget::Brows, AttentionTarget::Head],
                    tertiary: vec![AttentionTarget::Body],
                    still: vec![AttentionTarget::Limbs, AttentionTarget::Accessories],
                }
            }
            Emotion::Thinking => {
                AttentionHierarchy {
                    leader: AttentionTarget::Eyes,
                    secondary: vec![AttentionTarget::Head],
                    tertiary: vec![],
                    still: vec![AttentionTarget::Body, AttentionTarget::Limbs],
                }
            }
            Emotion::Happy | Emotion::Proud => {
                AttentionHierarchy {
                    leader: AttentionTarget::Eyes,
                    secondary: vec![AttentionTarget::Brows, AttentionTarget::Head],
                    tertiary: vec![AttentionTarget::Body],
                    still: vec![],
                }
            }
            _ => {
                AttentionHierarchy {
                    leader: AttentionTarget::Eyes,
                    secondary: vec![AttentionTarget::Head],
                    tertiary: vec![],
                    still: vec![],
                }
            }
        }
    }
    
    /// Validate animation against human heuristics
    pub fn validate(&self) -> ValidationResult {
        let mut issues = Vec::new();
        
        // Silhouette test: Does it read without details?
        // (Would need actual rendering to test, but we can check complexity)
        if self.beats.beats.len() > 8 {
            issues.push("Too many beats - may not read clearly".to_string());
        }
        
        // Speed test: Check timing ranges
        for beat in &self.beats.beats {
            if beat.duration < 0.05 {
                issues.push(format!("Beat '{}' too fast - may not read at 0.25x", beat.name));
            }
            if beat.duration > 2.0 {
                issues.push(format!("Beat '{}' too slow - may not read at 2x", beat.name));
            }
        }
        
        // Animator test: Check for unnecessary motion
        if self.beats.beats.iter().all(|b| !b.stillness) {
            issues.push("No stillness beats - animation may feel busy".to_string());
        }
        
        // Check for synchronized stops (forbidden unless intentional)
        // This would need more analysis, but we can flag it
        
        ValidationResult {
            valid: issues.is_empty(),
            issues,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ValidationResult {
    pub valid: bool,
    pub issues: Vec<String>,
}

// ============================================================================
// ANIMATION REASONER
// ============================================================================

/// Main animation reasoning engine
pub struct AnimationReasoner {
    /// Default causal model
    causal_model: CausalModel,
    
    /// Default timing relationships
    timing: TemporalRelations,
}

impl AnimationReasoner {
    pub fn new() -> Self {
        Self {
            causal_model: CausalModel::humanoid_default(),
            timing: TemporalRelations::default(),
        }
    }
    
    /// Reason about an animation from a text description
    pub fn reason(&self, description: &str, emotion: Emotion, intensity: f64) -> GrumpResult<AnimationIR> {
        // Parse intent from description
        let intent = NarrativeIntent {
            primary: description.to_string(),
            secondary: Vec::new(),
            forbidden: Self::forbidden_for_emotion(&emotion),
            emotion: emotion.clone(),
            intensity,
        };
        
        // Create IR
        let mut ir = AnimationIR::from_intent(intent);
        
        // Customize based on description
        // (In full implementation, this would use NLP to extract intent)
        
        Ok(ir)
    }
    
    /// Get forbidden interpretations for an emotion
    fn forbidden_for_emotion(emotion: &Emotion) -> Vec<String> {
        match emotion {
            Emotion::Annoyed => vec!["anger".to_string(), "hostility".to_string(), "aggression".to_string()],
            Emotion::Happy => vec!["sarcasm".to_string(), "mockery".to_string()],
            Emotion::Thinking => vec!["confusion".to_string(), "boredom".to_string()],
            _ => Vec::new(),
        }
    }
}

impl Default for AnimationReasoner {
    fn default() -> Self {
        Self::new()
    }
}

