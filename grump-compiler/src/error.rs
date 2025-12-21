//! Error types for the G-Rump compiler

use thiserror::Error;

pub type GrumpResult<T> = Result<T, GrumpError>;

#[derive(Error, Debug)]
pub enum GrumpError {
    #[error("Lexer error at {line}:{column}: {message}")]
    Lexer {
        line: usize,
        column: usize,
        message: String,
    },
    
    #[error("Parser error at {line}:{column}: {message}")]
    Parser {
        line: usize,
        column: usize,
        message: String,
    },
    
    #[error("Type error: {message}")]
    Type {
        message: String,
    },
    
    #[error("Ownership error: {message}")]
    Ownership {
        message: String,
    },
    
    #[error("Animation error: {message}")]
    Animation {
        message: String,
    },
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Other error: {0}")]
    Other(#[from] anyhow::Error),
}

impl GrumpError {
    /// Create a grumpy error message (with personality!)
    pub fn with_grump_comment(self, comment: &str) -> Self {
        // In the future, we'll add G-Rump's personality to error messages
        self
    }
    
    /// Format error with G-Rump personality
    pub fn format_with_personality(&self) -> String {
        let base = format!("{}", self);
        let grump_comment = match self {
            GrumpError::Type { message } => {
                if message.contains("Undefined") {
                    "Ugh. You're using something that doesn't exist. Classic."
                } else if message.contains("mismatch") || message.contains("wrong type") {
                    "That's not the right type. I'm disappointed, but not surprised."
                } else {
                    "Type error. Fix it."
                }
            }
            GrumpError::Parser { message, .. } => {
                if message.contains("Unexpected") {
                    "I didn't expect that. Neither did the parser."
                } else {
                    "Parse error. Check your syntax."
                }
            }
            GrumpError::Animation { message } => {
                "Animation error. Even I can't animate that."
            }
            _ => "Error. Fix it.",
        };
        format!("{}\n💀 G-Rump: {}", base, grump_comment)
    }
}

