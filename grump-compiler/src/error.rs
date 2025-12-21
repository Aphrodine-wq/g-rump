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
}

