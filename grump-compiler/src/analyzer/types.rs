//! Type System for G-Rump
//! 
//! Defines the type system with animation primitives as first-class types.

use crate::parser::Type as AstType;
use std::collections::HashMap;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Type {
    // Primitives
    Int,
    Int64,
    Float,
    Double,
    Bool,
    String,
    Char,
    Byte,
    
    // Animation Primitives
    Vec2,
    Vec3,
    Vec4,
    Point,
    Size,
    Rect,
    Bounds,
    Transform,
    Color,
    Color8,
    Hsv,
    Hsl,
    Duration,
    Timestamp,
    Framestamp,
    Angle,
    Rotation,
    Quat,
    Euler,
    
    // Collections
    List(Box<Type>),
    Array(Box<Type>, usize),  // Array<T, N>
    Set(Box<Type>),
    Map(Box<Type>, Box<Type>),  // Map<K, V>
    Tuple(Vec<Type>),
    
    // Optional & Result
    Optional(Box<Type>),
    Result { ok: Box<Type>, err: Box<Type> },
    
    // Named types (user-defined)
    Named(String),
    
    // Type modifiers
    Animatable(Box<Type>),
    Reactive(Box<Type>),
    Clamped { min: String, max: String, inner: Box<Type> },  // Simplified for now
    Wrapped { min: String, max: String, inner: Box<Type> },  // Simplified for now
    
    // Special
    Never,  // Bottom type
    Unknown,  // For type inference
    
    // NEW: Extended types
    Async(Box<Type>),  // async T (Future/Promise)
    Shader(ShaderType),  // Shader type
    BehaviorTree,  // Behavior tree type
    Network,  // Network connection type
    Macro,  // Macro type
    Plugin,  // Plugin type
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ShaderType {
    pub uniforms: Vec<(String, Type)>,  // Uniform name and type
    pub has_vertex: bool,
    pub has_fragment: bool,
    pub has_compute: bool,
}

// Expression type is imported from parser module

impl Type {
    /// Check if two types are compatible (can be assigned/compared)
    pub fn is_compatible_with(&self, other: &Type) -> bool {
        match (self, other) {
            // Same types
            (Type::Int, Type::Int) => true,
            (Type::Float, Type::Float) => true,
            (Type::Bool, Type::Bool) => true,
            (Type::String, Type::String) => true,
            
            // Numeric conversions
            (Type::Int, Type::Float) => true,
            (Type::Float, Type::Int) => true,
            (Type::Int, Type::Int64) => true,
            (Type::Int64, Type::Int) => true,
            
            // Animation primitives
            (Type::Vec2, Type::Point) => true,
            (Type::Point, Type::Vec2) => true,
            (Type::Angle, Type::Rotation) => true,
            (Type::Rotation, Type::Angle) => true,
            
            // Optional unwrapping
            (Type::Optional(ref inner), other) => inner.is_compatible_with(other),
            (inner, Type::Optional(ref other)) => inner.is_compatible_with(other),
            
            // Named types (will need to resolve to actual type)
            (Type::Named(_), Type::Named(_)) => {
                // TODO: Resolve named types and check compatibility
                false
            }
            
            _ => false,
        }
    }
    
    /// Check if type is animatable
    pub fn is_animatable(&self) -> bool {
        match self {
            Type::Int | Type::Int64 | Type::Float | Type::Double => true,
            Type::Vec2 | Type::Vec3 | Type::Vec4 => true,
            Type::Color | Type::Color8 | Type::Hsv | Type::Hsl => true,
            Type::Angle | Type::Rotation => true,
            Type::Transform => true,
            Type::Animatable(_) => true,
            _ => false,
        }
    }
    
    /// Get the default value for a type
    pub fn default_value(&self) -> String {
        match self {
            Type::Int | Type::Int64 => "0".to_string(),
            Type::Float | Type::Double => "0.0".to_string(),
            Type::Bool => "false".to_string(),
            Type::String => "\"\"".to_string(),
            Type::Char => "'\\0'".to_string(),
            Type::Vec2 => "vec2(0, 0)".to_string(),
            Type::Vec3 => "vec3(0, 0, 0)".to_string(),
            Type::Color => "color(0, 0, 0, 1)".to_string(),
            Type::Angle => "0deg".to_string(),
            Type::Optional(_) => "none".to_string(),
            _ => format!("/* default for {:?} */", self),
        }
    }
}

/// Type context for type checking
pub struct TypeContext {
    variables: HashMap<String, Type>,
    functions: HashMap<String, FunctionSignature>,
    types: HashMap<String, Type>,  // User-defined types
}

#[derive(Debug, Clone)]
pub struct FunctionSignature {
    pub params: Vec<(String, Type)>,
    pub return_type: Type,
}

impl TypeContext {
    pub fn new() -> Self {
        Self {
            variables: HashMap::new(),
            functions: HashMap::new(),
            types: HashMap::new(),
        }
    }
    
    pub fn add_variable(&mut self, name: String, type_: Type) {
        self.variables.insert(name, type_);
    }
    
    pub fn get_variable(&self, name: &str) -> Option<&Type> {
        self.variables.get(name)
    }
    
    pub fn add_function(&mut self, name: String, sig: FunctionSignature) {
        self.functions.insert(name, sig);
    }
    
    pub fn get_function(&self, name: &str) -> Option<&FunctionSignature> {
        self.functions.get(name)
    }
}

/// Convert AST type to internal type
pub fn ast_type_to_type(ast_type: &AstType) -> Type {
    match ast_type {
        AstType::Int => Type::Int,
        AstType::Int64 => Type::Int64,
        AstType::Float => Type::Float,
        AstType::Double => Type::Double,
        AstType::Bool => Type::Bool,
        AstType::String => Type::String,
        AstType::Char => Type::Char,
        AstType::Vec2 => Type::Vec2,
        AstType::Vec3 => Type::Vec3,
        AstType::Vec4 => Type::Vec4,
        AstType::Color => Type::Color,
        AstType::Angle => Type::Angle,
        AstType::Rotation => Type::Rotation,
        AstType::Transform => Type::Transform,
        AstType::Duration => Type::Duration,
        AstType::Optional(inner) => Type::Optional(Box::new(ast_type_to_type(inner))),
        AstType::Result { ok, err } => Type::Result {
            ok: Box::new(ast_type_to_type(ok)),
            err: Box::new(ast_type_to_type(err)),
        },
        AstType::Tuple(types) => Type::Tuple(types.iter().map(ast_type_to_type).collect()),
        AstType::Array(inner) => Type::Array(Box::new(ast_type_to_type(inner)), 0),  // Size unknown
        AstType::Named(name) => Type::Named(name.clone()),
    }
}

