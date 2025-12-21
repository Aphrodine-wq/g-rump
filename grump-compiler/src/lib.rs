//! G-Rump Compiler Library
//! 
//! The core compiler implementation for the G-Rump programming language.

pub mod lexer;
pub mod parser;
pub mod analyzer;
pub mod optimizer;
pub mod codegen;
pub mod runtime;
pub mod error;
pub mod animation;

pub use error::{GrumpError, GrumpResult};

