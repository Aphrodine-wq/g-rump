//! Animation System for G-Rump
//! 
//! This module implements the six-layer animation reasoning system
//! plus perceptual, cognitive, and social aspects of animation
//! that produces human-trusted animation, not just technically correct motion.
//!
//! Includes meta-engineering layer for complete human-like animation AI.

pub mod reasoner;
pub mod perception;
pub mod perceptual_engine;
pub mod meta_engine;

pub use reasoner::*;
pub use perception::*;
pub use perceptual_engine::*;
pub use meta_engine::*;

