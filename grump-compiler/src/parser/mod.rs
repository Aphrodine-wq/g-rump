//! Parser for G-Rump
//! 
//! Builds an Abstract Syntax Tree (AST) from tokens.

use crate::lexer::{Lexer, Token};
use crate::error::{GrumpError, GrumpResult};

// Import extended AST nodes and parsing functions
pub mod extensions;
use extensions::*;

// Import parsing functions for extensions
mod parse_extensions;
use parse_extensions::*;

#[derive(Debug, Clone)]
pub struct Program {
    pub items: Vec<Item>,
}

#[derive(Debug, Clone)]
pub enum Item {
    App(AppDeclaration),
    Scene(SceneDeclaration),
    Entity(EntityDeclaration),
    Component(ComponentDeclaration),
    System(SystemDeclaration),
    Function(FunctionDeclaration),
    Animation(AnimationDeclaration),
    Module(ModuleDeclaration),
    // NEW: Extended features
    Shader(ShaderDeclaration),
    BehaviorTree(BehaviorTreeDeclaration),
    Network(NetworkDeclaration),
    Macro(MacroDeclaration),
    Plugin(PluginDeclaration),
    Package(PackageDeclaration),
}

#[derive(Debug, Clone)]
pub struct AppDeclaration {
    pub name: String,
    pub version: Option<String>,
    pub targets: Vec<String>,
    pub fps: Option<f64>,
    pub body: Vec<Item>,
}

#[derive(Debug, Clone)]
pub struct SceneDeclaration {
    pub name: String,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone)]
pub struct EntityDeclaration {
    pub name: String,
    pub components: Vec<ComponentInstance>,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone)]
pub struct ComponentDeclaration {
    pub name: String,
    pub fields: Vec<Field>,
}

#[derive(Debug, Clone)]
pub struct SystemDeclaration {
    pub name: String,
    pub query: Vec<String>,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone)]
pub struct FunctionDeclaration {
    pub name: String,
    pub params: Vec<Parameter>,
    pub return_type: Option<Type>,
    pub body: Vec<Statement>,
    pub is_async: bool,  // NEW: Async function support
}

#[derive(Debug, Clone)]
pub struct AnimationDeclaration {
    pub name: String,
    pub keyframes: Vec<Keyframe>,
    pub duration: Option<Expression>,
    pub loop_mode: Option<LoopMode>,
}

#[derive(Debug, Clone)]
pub struct ModuleDeclaration {
    pub name: String,
    pub items: Vec<Item>,
}

#[derive(Debug, Clone)]
pub enum Statement {
    Let { name: String, type_: Option<Type>, value: Expression },
    Assign { target: Expression, value: Expression },
    If { condition: Expression, then: Vec<Statement>, else_: Option<Vec<Statement>> },
    Match { expr: Expression, arms: Vec<MatchArm> },
    For { var: String, iter: Expression, body: Vec<Statement> },
    While { condition: Expression, body: Vec<Statement> },
    Return(Option<Expression>),
    Break,
    Continue,
    Expression(Expression),
    Animate(AnimateStatement),
    Timeline { name: String, entries: Vec<(Expression, Vec<(Expression, Vec<(String, Expression)>)>)> },
    // NEW: Extended statements
    Await { expr: Box<Expression> },  // await expression
    Debugger(DebuggerStatement),  // debugger.break(), debugger.watch(), etc.  
    Network(NetworkStatement),  // network.sync(), network.send(), etc.
}

#[derive(Debug, Clone)]
pub struct AnimateStatement {
    pub target: Expression,
    pub keyframes: Vec<Keyframe>,
    pub duration: Option<Expression>,
    pub ease: Option<Expression>,
    pub spring: Option<SpringConfig>,
}

#[derive(Debug, Clone)]
pub struct Keyframe {
    pub time: Expression,
    pub value: Expression,
    pub ease_in: Option<Expression>,
    pub ease_out: Option<Expression>,
}

#[derive(Debug, Clone)]
pub struct SpringConfig {
    pub stiffness: Option<Expression>,
    pub damping: Option<Expression>,
    pub mass: Option<Expression>,
}

#[derive(Debug, Clone)]
pub enum Expression {
    Literal(Literal),
    Identifier(String),
    Binary { op: BinaryOp, left: Box<Expression>, right: Box<Expression> },
    Unary { op: UnaryOp, expr: Box<Expression> },
    Call { func: Box<Expression>, args: Vec<Expression> },
    Member { object: Box<Expression>, member: String },
    Index { object: Box<Expression>, index: Box<Expression> },
    Tuple(Vec<Expression>),
    Array(Vec<Expression>),
    Block(Vec<Statement>),
    If { condition: Box<Expression>, then: Box<Expression>, else_: Box<Expression> },
    Lambda { params: Vec<Parameter>, body: Box<Expression> },
    // NEW: Extended expressions
    Await(Box<Expression>),  // await future
    AsyncBlock(Vec<Statement>),  // async { ... }
    MacroCall { name: String, args: Vec<Expression> },  // macro_name!(args)
}

#[derive(Debug, Clone)]
pub enum Literal {
    Integer(i64),
    Float(f64),
    String(String),
    Char(char),
    Bool(bool),
    Color { r: u8, g: u8, b: u8, a: u8 },
    Vec2 { x: f64, y: f64 },
    Vec3 { x: f64, y: f64, z: f64 },
    Duration { value: f64, unit: String },
    Angle { value: f64, unit: String },
}

#[derive(Debug, Clone)]
pub enum Type {
    Int,
    Int64,
    Float,
    Double,
    Bool,
    String,
    Char,
    Vec2,
    Vec3,
    Vec4,
    Color,
    Angle,
    Rotation,
    Transform,
    Duration,
    Optional(Box<Type>),
    Result { ok: Box<Type>, err: Box<Type> },
    Tuple(Vec<Type>),
    Array(Box<Type>),
    Named(String),
}

#[derive(Debug, Clone)]
pub enum BinaryOp {
    Add, Sub, Mul, Div, Mod,
    Eq, Ne, Lt, Gt, Le, Ge,
    And, Or, Xor,
    ShiftLeft, ShiftRight,
}

#[derive(Debug, Clone)]
pub enum UnaryOp {
    Neg, Not, Deref, Ref, MutRef,
}

#[derive(Debug, Clone)]
pub struct Parameter {
    pub name: String,
    pub type_: Option<Type>,
}

#[derive(Debug, Clone)]
pub struct Field {
    pub name: String,
    pub type_: Type,
    pub default: Option<Expression>,
}

#[derive(Debug, Clone)]
pub struct ComponentInstance {
    pub name: String,
    pub args: Vec<Expression>,
}

#[derive(Debug, Clone)]
pub struct MatchArm {
    pub pattern: Pattern,
    pub guard: Option<Expression>,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone)]
pub enum Pattern {
    Literal(Literal),
    Identifier(String),
    Tuple(Vec<Pattern>),
    Struct { name: String, fields: Vec<(String, Pattern)> },
    Wildcard,
}

#[derive(Debug, Clone)]
pub enum LoopMode {
    None,
    Loop,
    PingPong,
    Reverse,
    Section { start: Expression, end: Expression },
}

pub struct Parser<'source> {
    lexer: Lexer<'source>,
    current: Option<(Token, usize, usize)>,
    peek: Option<(Token, usize, usize)>,
}

impl<'source> Parser<'source> {
    pub fn new(source: &'source str) -> Self {
        let mut lexer = Lexer::new(source);
        let current = lexer.next_token().ok().flatten();
        let peek = if current.is_some() {
            lexer.next_token().ok().flatten()
        } else {
            None
        };
        
        Self {
            lexer,
            current,
            peek,
        }
    }
    
    pub fn parse(&mut self) -> GrumpResult<Program> {
        let mut items = Vec::new();
        
        while self.current.is_some() {
            items.push(self.parse_item()?);
        }
        
        Ok(Program { items })
    }
    
    fn parse_item(&mut self) -> GrumpResult<Item> {
        match self.current.as_ref().map(|(t, _, _)| t) {
            Some(Token::App) => {
                self.advance();
                Ok(Item::App(self.parse_app()?))
            }
            Some(Token::Scene) => {
                self.advance();
                Ok(Item::Scene(self.parse_scene()?))
            }
            Some(Token::Entity) => {
                self.advance();
                Ok(Item::Entity(self.parse_entity()?))
            }
            Some(Token::Component) => {
                self.advance();
                Ok(Item::Component(self.parse_component()?))
            }
            Some(Token::System) => {
                self.advance();
                Ok(Item::System(self.parse_system()?))
            }
            Some(Token::Fn) => {
                self.advance();
                Ok(Item::Function(self.parse_function()?))
            }
            Some(Token::Animation) => {
                self.advance();
                Ok(Item::Animation(self.parse_animation()?))
            }
            Some(Token::Shader) => {
                self.advance();
                Ok(Item::Shader(self.parse_shader()?))
            }
            Some(Token::BehaviorTree) => {
                self.advance();
                Ok(Item::BehaviorTree(self.parse_behavior_tree()?))
            }
            Some(Token::Network) => {
                self.advance();
                Ok(Item::Network(self.parse_network()?))
            }
            Some(Token::Macro) => {
                self.advance();
                Ok(Item::Macro(self.parse_macro()?))
            }
            Some(Token::Plugin) => {
                self.advance();
                Ok(Item::Plugin(self.parse_plugin()?))
            }
            Some(Token::Package) => {
                self.advance();
                Ok(Item::Package(self.parse_package()?))
            }
            _ => {
                let (token, line, col) = self.current.take().unwrap();
                Err(GrumpError::Parser {
                    line,
                    column: col,
                    message: format!("Unexpected token: {:?}", token),
                })
            }
        }
    }
    
    fn parse_app(&mut self) -> GrumpResult<AppDeclaration> {
        // @app "GameName" @version "1.0.0" @target [ios, android] @fps 60
        let name = self.expect_string()?;
        
        let mut version = None;
        let mut targets = Vec::new();
        let mut fps = None;
        
        while self.current.is_some() {
            match self.current.as_ref().map(|(t, _, _)| t) {
                Some(Token::At) => {
                    self.advance();
                    let attr = self.expect_identifier()?;
                    match attr.as_str() {
                        "version" => {
                            version = Some(self.expect_string()?);
                        }
                        "target" => {
                            self.expect(Token::LeftBracket)?;
                            while !self.check(Token::RightBracket) {
                                targets.push(self.expect_string()?);
                                if !self.check(Token::RightBracket) {
                                    self.expect(Token::Comma)?;
                                }
                            }
                            self.expect(Token::RightBracket)?;
                        }
                        "fps" => {
                            if let Some((Token::Integer(n), _, _)) = self.current {
                                fps = Some(*n as f64);
                                self.advance();
                            } else if let Some((Token::FloatLiteral(f), _, _)) = self.current {
                                fps = Some(*f);
                                self.advance();
                            } else {
                                return Err(self.error("Expected number after @fps"));
                            }
                        }
                        _ => return Err(self.error(&format!("Unknown attribute: {}", attr))),
                    }
                }
                Some(Token::LeftBrace) => break,
                _ => return Err(self.error("Expected @attribute or {")),
            }
        }
        
        self.expect(Token::LeftBrace)?;
        let mut body = Vec::new();
        while !self.check(Token::RightBrace) {
            body.push(self.parse_item()?);
        }
        self.expect(Token::RightBrace)?;
        
        Ok(AppDeclaration {
            name,
            version,
            targets,
            fps,
            body,
        })
    }
    
    fn parse_scene(&mut self) -> GrumpResult<SceneDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut body = Vec::new();
        while !self.check(Token::RightBrace) {
            body.push(self.parse_statement()?);
        }
        self.expect(Token::RightBrace)?;
        
        Ok(SceneDeclaration { name, body })
    }
    
    fn parse_entity(&mut self) -> GrumpResult<EntityDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut components = Vec::new();
        let mut body = Vec::new();
        
        while !self.check(Token::RightBrace) {
            // Check for component assignments (e.g., sprite: "hero.png")
            if let Some((Token::Identifier(comp_name), _, _)) = &self.current {
                let comp_name = comp_name.clone();
                self.advance();
                
                if self.check(Token::Colon) {
                    // Component assignment
                    self.advance();
                    let args = self.parse_component_args()?;
                    components.push(ComponentInstance {
                        name: comp_name,
                        args,
                    });
                    if self.check(Token::Semicolon) {
                        self.advance();
                    }
                } else {
                    // Regular statement
                    self.current = Some((Token::Identifier(comp_name), 0, 0));
                    body.push(self.parse_statement()?);
                }
            } else {
                body.push(self.parse_statement()?);
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(EntityDeclaration {
            name,
            components,
            body,
        })
    }
    
    fn parse_component_args(&mut self) -> GrumpResult<Vec<Expression>> {
        let mut args = Vec::new();
        
        if self.check(Token::LeftParen) {
            self.advance();
            while !self.check(Token::RightParen) {
                args.push(self.parse_expression()?);
                if !self.check(Token::RightParen) {
                    self.expect(Token::Comma)?;
                }
            }
            self.expect(Token::RightParen)?;
        } else {
            args.push(self.parse_expression()?);
        }
        
        Ok(args)
    }
    
    fn parse_component(&mut self) -> GrumpResult<ComponentDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut fields = Vec::new();
        while !self.check(Token::RightBrace) {
            let field_name = self.expect_identifier()?;
            self.expect(Token::Colon)?;
            let type_ = self.parse_type()?;
            let default = if self.check(Token::Equals) {
                self.advance();
                Some(self.parse_expression()?)
            } else {
                None
            };
            self.expect(Token::Semicolon)?;
            
            fields.push(Field {
                name: field_name,
                type_,
                default,
            });
        }
        self.expect(Token::RightBrace)?;
        
        Ok(ComponentDeclaration { name, fields })
    }
    
    fn parse_system(&mut self) -> GrumpResult<SystemDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut query = Vec::new();
        let mut body = Vec::new();
        
        // Parse query: query: [Component1, Component2]
        if self.check(Token::Identifier) {
            let ident = self.expect_identifier()?;
            if ident == "query" {
                self.expect(Token::Colon)?;
                self.expect(Token::LeftBracket)?;
                while !self.check(Token::RightBracket) {
                    query.push(self.expect_identifier()?);
                    if !self.check(Token::RightBracket) {
                        self.expect(Token::Comma)?;
                    }
                }
                self.expect(Token::RightBracket)?;
            } else {
                // Not a query, treat as statement
                self.current = Some((Token::Identifier(ident), 0, 0));
            }
        }
        
        // Parse body statements
        while !self.check(Token::RightBrace) {
            body.push(self.parse_statement()?);
        }
        self.expect(Token::RightBrace)?;
        
        Ok(SystemDeclaration { name, query, body })
    }
    
    fn parse_function(&mut self) -> GrumpResult<FunctionDeclaration> {
        // Check for async keyword
        let is_async = if self.check(Token::Async) {
            self.advance();
            true
        } else {
            false
        };
        
        let name = self.expect_identifier()?;
        self.expect(Token::LeftParen)?;
        
        let mut params = Vec::new();
        while !self.check(Token::RightParen) {
            let param_name = self.expect_identifier()?;
            let type_ = if self.check(Token::Colon) {
                self.advance();
                Some(self.parse_type()?)
            } else {
                None
            };
            params.push(Parameter { name: param_name, type_ });
            
            if !self.check(Token::RightParen) {
                self.expect(Token::Comma)?;
            }
        }
        self.expect(Token::RightParen)?;
        
        let return_type = if self.check(Token::Arrow) {
            self.advance();
            Some(self.parse_type()?)
        } else {
            None
        };
        
        self.expect(Token::LeftBrace)?;
        let mut body = Vec::new();
        while !self.check(Token::RightBrace) {
            body.push(self.parse_statement()?);
        }
        self.expect(Token::RightBrace)?;
        
        Ok(FunctionDeclaration {
            name,
            params,
            return_type,
            body,
            is_async,
        })
    }
    
    fn parse_animation(&mut self) -> GrumpResult<AnimationDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut keyframes = Vec::new();
        let mut duration = None;
        let mut loop_mode = None;
        
        while !self.check(Token::RightBrace) {
            if self.check(Token::Keyframes) {
                self.advance();
                self.expect(Token::LeftBrace)?;
                while !self.check(Token::RightBrace) {
                    keyframes.push(self.parse_keyframe()?);
                }
                self.expect(Token::RightBrace)?;
            } else if self.check(Token::Duration) {
                self.advance();
                self.expect(Token::Colon)?;
                duration = Some(self.parse_expression()?);
            } else if self.check(Token::Loop) {
                self.advance();
                loop_mode = Some(self.parse_loop_mode()?);
            } else {
                return Err(self.error("Expected keyframes, duration, or loop in animation"));
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(AnimationDeclaration {
            name,
            keyframes,
            duration,
            loop_mode,
        })
    }
    
    fn parse_keyframe(&mut self) -> GrumpResult<Keyframe> {
        // Parse time (e.g., "0s", "0.5s", "1s")
        let time = self.parse_expression()?;
        self.expect(Token::Colon)?;
        let value = self.parse_expression()?;
        
        let mut ease_in = None;
        let mut ease_out = None;
        
        if self.check(Token::LeftBrace) {
            self.advance();
            while !self.check(Token::RightBrace) {
                if self.check(Token::Identifier) {
                    let key = self.expect_identifier()?;
                    self.expect(Token::Colon)?;
                    let val = self.parse_expression()?;
                    match key.as_str() {
                        "ease_in" => ease_in = Some(val),
                        "ease_out" => ease_out = Some(val),
                        _ => return Err(self.error(&format!("Unknown keyframe property: {}", key))),
                    }
                } else {
                    return Err(self.error("Expected identifier in keyframe properties"));
                }
                if !self.check(Token::RightBrace) {
                    // Optional comma
                    if self.check(Token::Comma) {
                        self.advance();
                    }
                }
            }
            self.expect(Token::RightBrace)?;
        }
        
        Ok(Keyframe {
            time,
            value,
            ease_in,
            ease_out,
        })
    }
    
    fn parse_loop_mode(&mut self) -> GrumpResult<LoopMode> {
        if self.check(Token::None) {
            self.advance();
            Ok(LoopMode::None)
        } else if self.check(Token::Loop) {
            self.advance();
            Ok(LoopMode::Loop)
        } else if self.check(Token::Identifier) {
            let mode = self.expect_identifier()?;
            match mode.as_str() {
                "ping_pong" => Ok(LoopMode::PingPong),
                "reverse" => Ok(LoopMode::Reverse),
                _ => Err(self.error(&format!("Unknown loop mode: {}", mode))),
            }
        } else {
            Err(self.error("Expected loop mode"))
        }
    }
    
    fn parse_statement(&mut self) -> GrumpResult<Statement> {
        match self.current.as_ref().map(|(t, _, _)| t) {
            Some(Token::Let) => {
                self.advance();
                let name = self.expect_identifier()?;
                let type_ = if self.check(Token::Colon) {
                    self.advance();
                    Some(self.parse_type()?)
                } else {
                    None
                };
                self.expect(Token::Equals)?;
                let value = self.parse_expression()?;
                self.expect(Token::Semicolon)?;
                Ok(Statement::Let { name, type_, value })
            }
            Some(Token::If) => {
                self.advance();
                self.expect(Token::LeftParen)?;
                let condition = self.parse_expression()?;
                self.expect(Token::RightParen)?;
                self.expect(Token::LeftBrace)?;
                let mut then = Vec::new();
                while !self.check(Token::RightBrace) {
                    then.push(self.parse_statement()?);
                }
                self.expect(Token::RightBrace)?;
                let else_ = if self.check(Token::Else) {
                    self.advance();
                    self.expect(Token::LeftBrace)?;
                    let mut else_body = Vec::new();
                    while !self.check(Token::RightBrace) {
                        else_body.push(self.parse_statement()?);
                    }
                    self.expect(Token::RightBrace)?;
                    Some(else_body)
                } else {
                    None
                };
                Ok(Statement::If { condition, then, else_ })
            }
            Some(Token::Return) => {
                self.advance();
                let expr = if !self.check(Token::Semicolon) {
                    Some(self.parse_expression()?)
                } else {
                    None
                };
                self.expect(Token::Semicolon)?;
                Ok(Statement::Return(expr))
            }
            Some(Token::Animate) => {
                self.advance();
                let target = self.parse_expression()?;
                self.expect(Token::LeftBrace)?;
                
                let mut keyframes = Vec::new();
                let mut duration = None;
                let mut ease = None;
                let mut spring = None;
                
                while !self.check(Token::RightBrace) {
                    if self.check(Token::Keyframes) {
                        self.advance();
                        self.expect(Token::LeftBrace)?;
                        while !self.check(Token::RightBrace) {
                            keyframes.push(self.parse_keyframe()?);
                        }
                        self.expect(Token::RightBrace)?;
                    } else if self.check(Token::Duration) {
                        self.advance();
                        self.expect(Token::Colon)?;
                        duration = Some(self.parse_expression()?);
                    } else if self.check(Token::Ease) {
                        self.advance();
                        self.expect(Token::Colon)?;
                        ease = Some(self.parse_expression()?);
                    } else if self.check(Token::Spring) {
                        self.advance();
                        self.expect(Token::LeftBrace)?;
                        spring = Some(self.parse_spring_config()?);
                        self.expect(Token::RightBrace)?;
                    } else {
                        return Err(self.error("Expected keyframes, duration, ease, or spring in animate"));
                    }
                }
                self.expect(Token::RightBrace)?;
                
                Ok(Statement::Animate(AnimateStatement {
                    target,
                    keyframes,
                    duration,
                    ease,
                    spring,
                }))
            }
            Some(Token::For) => {
                self.advance();
                self.expect(Token::LeftParen)?;
                let var = self.expect_identifier()?;
                self.expect(Token::In)?;
                let iter = self.parse_expression()?;
                self.expect(Token::RightParen)?;
                self.expect(Token::LeftBrace)?;
                let mut body = Vec::new();
                while !self.check(Token::RightBrace) {
                    body.push(self.parse_statement()?);
                }
                self.expect(Token::RightBrace)?;
                Ok(Statement::For { var, iter, body })
            }
            Some(Token::While) => {
                self.advance();
                self.expect(Token::LeftParen)?;
                let condition = self.parse_expression()?;
                self.expect(Token::RightParen)?;
                self.expect(Token::LeftBrace)?;
                let mut body = Vec::new();
                while !self.check(Token::RightBrace) {
                    body.push(self.parse_statement()?);
                }
                self.expect(Token::RightBrace)?;
                Ok(Statement::While { condition, body })
            }
            Some(Token::Break) => {
                self.advance();
                self.expect(Token::Semicolon)?;
                Ok(Statement::Break)
            }
            Some(Token::Continue) => {
                self.advance();
                self.expect(Token::Semicolon)?;
                Ok(Statement::Continue)
            }
            Some(Token::Timeline) => {
                self.advance();
                let name = self.expect_identifier()?;
                self.expect(Token::LeftBrace)?;
                let mut entries = Vec::new();
                while !self.check(Token::RightBrace) {
                    let time = self.parse_expression()?;
                    self.expect(Token::LeftBrace)?;
                    let mut properties = Vec::new();
                    while !self.check(Token::RightBrace) {
                        let target = self.parse_expression()?;
                        self.expect(Token::LeftBrace)?;
                        let mut keyframes = Vec::new();
                        while !self.check(Token::RightBrace) {
                            let prop = self.expect_identifier()?;
                            self.expect(Token::Colon)?;
                            let value = self.parse_expression()?;
                            keyframes.push((prop, value));
                        }
                        self.expect(Token::RightBrace)?;
                        properties.push((target, keyframes));
                    }
                    self.expect(Token::RightBrace)?;
                    entries.push((time, properties));
                }
                self.expect(Token::RightBrace)?;
                Ok(Statement::Timeline { name, entries })
            }
            Some(Token::Match) => {
                self.advance();
                let expr = self.parse_expression()?;
                self.expect(Token::LeftBrace)?;
                let mut arms = Vec::new();
                while !self.check(Token::RightBrace) {
                    let pattern = self.parse_pattern()?;
                    self.expect(Token::Arrow)?;
                    let guard = if self.check(Token::If) {
                        self.advance();
                        Some(self.parse_expression()?)
                    } else {
                        None
                    };
                    self.expect(Token::LeftBrace)?;
                    let mut body = Vec::new();
                    while !self.check(Token::RightBrace) {
                        body.push(self.parse_statement()?);
                    }
                    self.expect(Token::RightBrace)?;
                    arms.push(crate::parser::MatchArm { pattern, guard, body });
                }
                self.expect(Token::RightBrace)?;
                Ok(Statement::Match { expr, arms })
            }
            _ => {
                let expr = self.parse_expression()?;
                if self.check(Token::Semicolon) {
                    self.advance();
                }
                Ok(Statement::Expression(expr))
            }
        }
    }
    
    fn parse_spring_config(&mut self) -> GrumpResult<SpringConfig> {
        let mut stiffness = None;
        let mut damping = None;
        let mut mass = None;
        
        while !self.check(Token::RightBrace) {
            let key = self.expect_identifier()?;
            self.expect(Token::Colon)?;
            let value = self.parse_expression()?;
            match key.as_str() {
                "stiffness" => stiffness = Some(value),
                "damping" => damping = Some(value),
                "mass" => mass = Some(value),
                _ => return Err(self.error(&format!("Unknown spring property: {}", key))),
            }
            if !self.check(Token::RightBrace) {
                if self.check(Token::Comma) {
                    self.advance();
                }
            }
        }
        
        Ok(SpringConfig {
            stiffness,
            damping,
            mass,
        })
    }
    
    fn parse_expression(&mut self) -> GrumpResult<Expression> {
        self.parse_binary(0)
    }
    
    fn parse_binary(&mut self, min_prec: u8) -> GrumpResult<Expression> {
        let mut left = self.parse_unary()?;
        
        while let Some(op) = self.current.as_ref().and_then(|(t, _, _)| binary_op(t)) {
            let prec = precedence(op);
            if prec < min_prec {
                break;
            }
            self.advance();
            let right = self.parse_binary(prec + 1)?;
            left = Expression::Binary {
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }
        
        Ok(left)
    }
    
    fn parse_unary(&mut self) -> GrumpResult<Expression> {
        if let Some(op) = self.current.as_ref().and_then(|(t, _, _)| unary_op(t)) {
            self.advance();
            let expr = self.parse_unary()?;
            Ok(Expression::Unary {
                op,
                expr: Box::new(expr),
            })
        } else {
            self.parse_primary()
        }
    }
    
    fn parse_primary(&mut self) -> GrumpResult<Expression> {
        let mut expr = match self.current.as_ref().map(|(t, _, _)| t) {
            Some(Token::Integer(n)) => {
                self.advance();
                Expression::Literal(Literal::Integer(*n))
            }
            Some(Token::FloatLiteral(f)) => {
                self.advance();
                Expression::Literal(Literal::Float(*f))
            }
            Some(Token::StringLiteral(s)) => {
                self.advance();
                Expression::Literal(Literal::String(s.clone()))
            }
            Some(Token::True) => {
                self.advance();
                Expression::Literal(Literal::Bool(true))
            }
            Some(Token::False) => {
                self.advance();
                Expression::Literal(Literal::Bool(false))
            }
            Some(Token::Identifier(name)) => {
                self.advance();
                Expression::Identifier(name.clone())
            }
            Some(Token::LeftParen) => {
                self.advance();
                let expr = self.parse_expression()?;
                self.expect(Token::RightParen)?;
                expr
            }
            Some(Token::LeftBracket) => {
                self.advance();
                let mut elements = Vec::new();
                while !self.check(Token::RightBracket) {
                    elements.push(self.parse_expression()?);
                    if !self.check(Token::RightBracket) {
                        self.expect(Token::Comma)?;
                    }
                }
                self.expect(Token::RightBracket)?;
                Expression::Array(elements)
            }
            Some(Token::Await) => {
                self.advance();
                let expr = self.parse_expression()?;
                Expression::Await(Box::new(expr))
            }
            Some(Token::Async) => {
                self.advance();
                self.expect(Token::LeftBrace)?;
                let mut statements = Vec::new();
                while !self.check(Token::RightBrace) {
                    statements.push(self.parse_statement()?);
                }
                self.expect(Token::RightBrace)?;
                Expression::AsyncBlock(statements)
            }
            _ => {
                return Err(self.error("Expected expression"));
            }
        };
        
        // Parse postfix operators (member access, function calls, indexing)
        loop {
            match self.current.as_ref().map(|(t, _, _)| t) {
                Some(Token::Dot) => {
                    self.advance();
                    let member = self.expect_identifier()?;
                    expr = Expression::Member {
                        object: Box::new(expr),
                        member,
                    };
                }
                Some(Token::LeftParen) => {
                    self.advance();
                    let mut args = Vec::new();
                    while !self.check(Token::RightParen) {
                        args.push(self.parse_expression()?);
                        if !self.check(Token::RightParen) {
                            self.expect(Token::Comma)?;
                        }
                    }
                    self.expect(Token::RightParen)?;
                    expr = Expression::Call {
                        func: Box::new(expr),
                        args,
                    };
                }
                Some(Token::LeftBracket) => {
                    self.advance();
                    let index = self.parse_expression()?;
                    self.expect(Token::RightBracket)?;
                    expr = Expression::Index {
                        object: Box::new(expr),
                        index: Box::new(index),
                    };
                }
                _ => break,
            }
        }
        
        Ok(expr)
    }
    
    fn parse_type(&mut self) -> GrumpResult<Type> {
        match self.current.as_ref().map(|(t, _, _)| t) {
            Some(Token::Int) => {
                self.advance();
                Ok(Type::Int)
            }
            Some(Token::Float) => {
                self.advance();
                Ok(Type::Float)
            }
            Some(Token::Bool) => {
                self.advance();
                Ok(Type::Bool)
            }
            Some(Token::String) => {
                self.advance();
                Ok(Type::String)
            }
            Some(Token::Identifier(name)) => {
                self.advance();
                Ok(Type::Named(name.clone()))
            }
            _ => Err(self.error("Expected type")),
        }
    }
    
    // Helper methods
    fn advance(&mut self) {
        self.current = self.peek.take();
        self.peek = self.lexer.next_token().ok().flatten();
    }
    
    fn check(&self, token: Token) -> bool {
        self.current.as_ref().map(|(t, _, _)| std::mem::discriminant(t) == std::mem::discriminant(&token)).unwrap_or(false)
    }
    
    fn expect(&mut self, token: Token) -> GrumpResult<()> {
        if self.check(token) {
            self.advance();
            Ok(())
        } else {
            let (got, line, col) = self.current.take().unwrap();
            Err(GrumpError::Parser {
                line,
                column: col,
                message: format!("Expected {:?}, got {:?}", token, got),
            })
        }
    }
    
    fn expect_identifier(&mut self) -> GrumpResult<String> {
        match self.current.take() {
            Some((Token::Identifier(name), _, _)) => {
                self.advance();
                Ok(name)
            }
            Some((token, line, col)) => {
                Err(GrumpError::Parser {
                    line,
                    column: col,
                    message: format!("Expected identifier, got {:?}", token),
                })
            }
            None => Err(self.error("Expected identifier, got EOF")),
        }
    }
    
    fn expect_string(&mut self) -> GrumpResult<String> {
        match self.current.take() {
            Some((Token::StringLiteral(s), _, _)) => {
                self.advance();
                Ok(s)
            }
            Some((token, line, col)) => {
                Err(GrumpError::Parser {
                    line,
                    column: col,
                    message: format!("Expected string, got {:?}", token),
                })
            }
            None => Err(self.error("Expected string, got EOF")),
        }
    }
    
    fn error(&self, msg: &str) -> GrumpError {
        if let Some((_, line, col)) = &self.current {
            GrumpError::Parser {
                line: *line,
                column: *col,
                message: msg.to_string(),
            }
        } else {
            GrumpError::Parser {
                line: 0,
                column: 0,
                message: msg.to_string(),
            }
        }
    }
}

fn binary_op(token: &Token) -> Option<BinaryOp> {
    match token {
        Token::Plus => Some(BinaryOp::Add),
        Token::Minus => Some(BinaryOp::Sub),
        Token::Star => Some(BinaryOp::Mul),
        Token::Slash => Some(BinaryOp::Div),
        Token::Percent => Some(BinaryOp::Mod),
        Token::EqualsEquals => Some(BinaryOp::Eq),
        Token::NotEquals => Some(BinaryOp::Ne),
        Token::LessThan => Some(BinaryOp::Lt),
        Token::GreaterThan => Some(BinaryOp::Gt),
        Token::LessThanEquals => Some(BinaryOp::Le),
        Token::GreaterThanEquals => Some(BinaryOp::Ge),
        Token::AndAnd => Some(BinaryOp::And),
        Token::OrOr => Some(BinaryOp::Or),
        _ => None,
    }
}

fn unary_op(token: &Token) -> Option<UnaryOp> {
    match token {
        Token::Minus => Some(UnaryOp::Neg),
        Token::Not => Some(UnaryOp::Not),
        _ => None,
    }
}

fn precedence(op: &BinaryOp) -> u8 {
    match op {
        BinaryOp::Or => 1,
        BinaryOp::And => 2,
        BinaryOp::Eq | BinaryOp::Ne | BinaryOp::Lt | BinaryOp::Gt | BinaryOp::Le | BinaryOp::Ge => 3,
        BinaryOp::Add | BinaryOp::Sub => 4,
        BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => 5,
        _ => 6,
    }
}

