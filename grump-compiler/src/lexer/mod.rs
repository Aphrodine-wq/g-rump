//! Lexer (Tokenizer) for G-Rump
//! 
//! Handles tokenization of G-Rump source code, including:
//! - Keywords
//! - Identifiers
//! - Literals (numbers, strings, colors)
//! - Units (px, pt, s, ms, deg, rad, etc.)
//! - Operators
//! - Punctuation

use logos::Logos;
use crate::error::{GrumpError, GrumpResult};

#[derive(Logos, Debug, PartialEq, Clone)]
#[logos(skip r"[ \t\r\n]+")]  // Skip whitespace
#[logos(skip r"//.*")]        // Skip single-line comments
#[logos(skip r"/\*[\s\S]*?\*/")]  // Skip multi-line comments
pub enum Token {
    // Keywords
    #[token("app")]
    App,
    #[token("scene")]
    Scene,
    #[token("entity")]
    Entity,
    #[token("component")]
    Component,
    #[token("system")]
    System,
    #[token("fn")]
    Fn,
    #[token("let")]
    Let,
    #[token("mut")]
    Mut,
    #[token("if")]
    If,
    #[token("else")]
    Else,
    #[token("match")]
    Match,
    #[token("for")]
    For,
    #[token("while")]
    While,
    #[token("loop")]
    Loop,
    #[token("return")]
    Return,
    #[token("break")]
    Break,
    #[token("continue")]
    Continue,
    #[token("use")]
    Use,
    #[token("pub")]
    Pub,
    #[token("as")]
    As,
    #[token("in")]
    In,
    #[token("true")]
    True,
    #[token("false")]
    False,
    #[token("none")]
    None,
    #[token("some")]
    Some,
    #[token("ok")]
    Ok,
    #[token("err")]
    Err,
    
    // Animation keywords
    #[token("animate")]
    Animate,
    #[token("timeline")]
    Timeline,
    #[token("keyframes")]
    Keyframes,
    #[token("ease")]
    Ease,
    #[token("spring")]
    Spring,
    #[token("particles")]
    Particles,
    #[token("skeleton")]
    Skeleton,
    #[token("animation")]
    Animation,
    #[token("clip")]
    Clip,
    #[token("pose")]
    Pose,
    
    // NEW: Async/Await keywords
    #[token("async")]
    Async,
    #[token("await")]
    Await,
    
    // NEW: Behavior Tree keywords
    #[token("behavior_tree")]
    BehaviorTree,
    #[token("selector")]
    Selector,
    #[token("sequence")]
    Sequence,
    #[token("condition")]
    Condition,
    #[token("action")]
    Action,
    #[token("decorator")]
    Decorator,
    
    // NEW: Shader keywords
    #[token("shader")]
    Shader,
    #[token("vertex")]
    Vertex,
    #[token("fragment")]
    Fragment,
    #[token("uniforms")]
    Uniforms,
    #[token("varying")]
    Varying,
    
    // NEW: Networking keywords
    #[token("network")]
    Network,
    #[token("sync")]
    Sync,
    #[token("rpc")]
    Rpc,
    #[token("replicate")]
    Replicate,
    
    // NEW: Macro keywords
    #[token("macro")]
    Macro,
    #[token("expand")]
    Expand,
    
    // NEW: Plugin keywords
    #[token("plugin")]
    Plugin,
    #[token("import")]
    Import,
    
    // NEW: Debugger keywords
    #[token("debugger")]
    Debugger,
    #[token("breakpoint")]
    Breakpoint,
    #[token("watch")]
    Watch,
    
    // NEW: Package keywords
    #[token("package")]
    Package,
    #[token("dependencies")]
    Dependencies,
    
    // Type keywords
    #[token("int")]
    Int,
    #[token("int64")]
    Int64,
    #[token("float")]
    Float,
    #[token("double")]
    Double,
    #[token("bool")]
    Bool,
    #[token("string")]
    String,
    #[token("char")]
    Char,
    #[token("vec2")]
    Vec2,
    #[token("vec3")]
    Vec3,
    #[token("vec4")]
    Vec4,
    #[token("color")]
    Color,
    #[token("angle")]
    Angle,
    #[token("rotation")]
    Rotation,
    #[token("transform")]
    Transform,
    #[token("duration")]
    Duration,
    
    // Literals
    #[regex(r"-?\d+", |lex| lex.slice().parse().ok())]
    Integer(i64),
    
    #[regex(r"-?\d+\.\d+", |lex| lex.slice().parse().ok())]
    FloatLiteral(f64),
    
    #[regex(r#""([^"\\]|\\.)*""#, |lex| {
        let s = lex.slice();
        s[1..s.len()-1].to_string()
    })]
    StringLiteral(String),
    
    #[regex(r"'([^'\\]|\\.)'", |lex| {
        let s = lex.slice();
        s.chars().nth(1).unwrap_or('\0')
    })]
    CharLiteral(char),
    
    // Units (attached to numbers)
    #[regex(r"-?\d+(\.\d+)?px", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-2].parse::<f64>().ok()?;
        Some((num, Unit::Pixels))
    })]
    NumberWithUnit(f64, Unit),
    
    #[regex(r"-?\d+(\.\d+)?pt", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-2].parse::<f64>().ok()?;
        Some((num, Unit::Points))
    })]
    NumberWithUnit(f64, Unit),
    
    #[regex(r"-?\d+(\.\d+)?s", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-1].parse::<f64>().ok()?;
        Some((num, Unit::Seconds))
    })]
    NumberWithUnit(f64, Unit),
    
    #[regex(r"-?\d+(\.\d+)?ms", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-2].parse::<f64>().ok()?;
        Some((num * 0.001, Unit::Seconds))
    })]
    NumberWithUnit(f64, Unit),
    
    #[regex(r"-?\d+(\.\d+)?deg", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-3].parse::<f64>().ok()?;
        Some((num, Unit::Degrees))
    })]
    NumberWithUnit(f64, Unit),
    
    #[regex(r"-?\d+(\.\d+)?rad", |lex| {
        let s = lex.slice();
        let num = s[..s.len()-3].parse::<f64>().ok()?;
        Some((num, Unit::Radians))
    })]
    NumberWithUnit(f64, Unit),
    
    // Identifiers
    #[regex(r"[a-zA-Z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    Identifier(String),
    
    // Operators
    #[token("+")]
    Plus,
    #[token("-")]
    Minus,
    #[token("*")]
    Star,
    #[token("/")]
    Slash,
    #[token("%")]
    Percent,
    #[token("=")]
    Equals,
    #[token("==")]
    EqualsEquals,
    #[token("!=")]
    NotEquals,
    #[token("<")]
    LessThan,
    #[token(">")]
    GreaterThan,
    #[token("<=")]
    LessThanEquals,
    #[token(">=")]
    GreaterThanEquals,
    #[token("&&")]
    AndAnd,
    #[token("||")]
    OrOr,
    #[token("!")]
    Not,
    #[token("&")]
    And,
    #[token("|")]
    Or,
    #[token("^")]
    Xor,
    #[token("<<")]
    ShiftLeft,
    #[token(">>")]
    ShiftRight,
    
    // Assignment operators
    #[token("+=")]
    PlusEquals,
    #[token("-=")]
    MinusEquals,
    #[token("*=")]
    StarEquals,
    #[token("/=")]
    SlashEquals,
    #[token("%=")]
    PercentEquals,
    
    // Special operators
    #[token("->")]
    Arrow,
    #[token("=>")]
    FatArrow,
    #[token("..")]
    DotDot,
    #[token("...")]
    DotDotDot,
    #[token("::")]
    ColonColon,
    #[token(":=")]
    ColonEquals,  // Bind operator
    
    // Punctuation
    #[token("(")]
    LeftParen,
    #[token(")")]
    RightParen,
    #[token("[")]
    LeftBracket,
    #[token("]")]
    RightBracket,
    #[token("{")]
    LeftBrace,
    #[token("}")]
    RightBrace,
    #[token(",")]
    Comma,
    #[token(";")]
    Semicolon,
    #[token(":")]
    Colon,
    #[token(".")]
    Dot,
    #[token("?")]
    Question,
    #[token("@")]
    At,
    #[token("#")]
    Hash,
    #[token("$")]
    Dollar,
    #[token("_")]
    Underscore,
}

#[derive(Debug, PartialEq, Clone)]
pub enum Unit {
    Pixels,
    Points,
    Seconds,
    Milliseconds,
    Degrees,
    Radians,
    // TODO: Add more units (%, vw, vh, frames, beats, etc.)
}

pub struct Lexer<'source> {
    inner: logos::Lexer<'source, Token>,
    line: usize,
    column: usize,
}

impl<'source> Lexer<'source> {
    pub fn new(source: &'source str) -> Self {
        Self {
            inner: Token::lexer(source),
            line: 1,
            column: 1,
        }
    }
    
    pub fn next_token(&mut self) -> GrumpResult<Option<(Token, usize, usize)>> {
        let token = self.inner.next();
        
        match token {
            Some(Ok(tok)) => {
                let span = self.inner.span();
                let (line, column) = self.calculate_position(span.start);
                Ok(Some((tok, line, column)))
            }
            Some(Err(())) => {
                let span = self.inner.span();
                let (line, column) = self.calculate_position(span.start);
                Err(GrumpError::Lexer {
                    line,
                    column,
                    message: format!("Unexpected character: '{}'", 
                        self.inner.source()[span.start..span.end].chars().next().unwrap_or('?')),
                })
            }
            None => Ok(None),
        }
    }
    
    fn calculate_position(&self, offset: usize) -> (usize, usize) {
        // Simple implementation - in production, we'd track this more efficiently
        let source = self.inner.source();
        let mut line = 1;
        let mut column = 1;
        
        for (i, ch) in source[..offset].char_indices() {
            if ch == '\n' {
                line += 1;
                column = 1;
            } else {
                column += 1;
            }
        }
        
        (line, column)
    }
    
    pub fn source(&self) -> &'source str {
        self.inner.source()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_basic_tokens() {
        let mut lexer = Lexer::new("let x = 42");
        assert_eq!(lexer.next_token().unwrap(), Some((Token::Let, 1, 1)));
        assert_eq!(lexer.next_token().unwrap(), Some((Token::Identifier("x".to_string()), 1, 5)));
        assert_eq!(lexer.next_token().unwrap(), Some((Token::Equals, 1, 7)));
        assert_eq!(lexer.next_token().unwrap(), Some((Token::Integer(42), 1, 9)));
        assert_eq!(lexer.next_token().unwrap(), None);
    }
    
    #[test]
    fn test_units() {
        let mut lexer = Lexer::new("10px 0.5s 90deg");
        // Note: The regex matching for units needs refinement
        // This test will need adjustment based on final implementation
    }
}

