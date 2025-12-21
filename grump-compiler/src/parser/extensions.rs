//! Extended AST nodes for new G-Rump features
//! 
//! This module contains AST definitions for:
//! - Shaders
//! - Behavior Trees
//! - Networking
//! - Macros
//! - Plugins
//! - Debugger
//! - Package management

use crate::parser::{Expression, Statement, Type, Parameter};

// ============================================================================
// SHADER SYSTEM
// ============================================================================

#[derive(Debug, Clone)]
pub struct ShaderDeclaration {
    pub name: String,
    pub uniforms: Vec<Uniform>,
    pub vertex_code: Option<String>,  // Shader code as string for now
    pub fragment_code: Option<String>,
    pub compute_code: Option<String>,  // For compute shaders
}

#[derive(Debug, Clone)]
pub struct Uniform {
    pub name: String,
    pub type_: Type,
    pub default: Option<Expression>,
}

// ============================================================================
// BEHAVIOR TREES (AI)
// ============================================================================

#[derive(Debug, Clone)]
pub struct BehaviorTreeDeclaration {
    pub name: String,
    pub root: BehaviorNode,
}

#[derive(Debug, Clone)]
pub enum BehaviorNode {
    Selector { children: Vec<BehaviorNode> },
    Sequence { children: Vec<BehaviorNode> },
    Condition { expr: Expression },
    Action { name: String, params: Vec<Expression> },
    Decorator { decorator_type: DecoratorType, child: Box<BehaviorNode> },
    Inverter { child: Box<BehaviorNode> },
    Repeater { count: Option<Expression>, child: Box<BehaviorNode> },
    Wait { duration: Expression },
}

#[derive(Debug, Clone)]
pub enum DecoratorType {
    UntilSuccess,
    UntilFailure,
    Limit { max: Expression },
    Cooldown { duration: Expression },
}

// ============================================================================
// NETWORKING/MULTIPLAYER
// ============================================================================

#[derive(Debug, Clone)]
pub struct NetworkDeclaration {
    pub name: String,
    pub sync_fields: Vec<SyncField>,
    pub rpc_functions: Vec<RpcFunction>,
}

#[derive(Debug, Clone)]
pub struct SyncField {
    pub name: String,
    pub type_: Type,
    pub sync_mode: SyncMode,
}

#[derive(Debug, Clone)]
pub enum SyncMode {
    Reliable,  // Guaranteed delivery
    Unreliable,  // Best effort
    Interpolated,  // Smooth interpolation
    Snapshot,  // Periodic snapshots
}

#[derive(Debug, Clone)]
pub struct RpcFunction {
    pub name: String,
    pub params: Vec<Parameter>,
    pub return_type: Option<Type>,
    pub target: RpcTarget,
    pub reliability: SyncMode,
}

#[derive(Debug, Clone)]
pub enum RpcTarget {
    Server,  // Call server
    Client { client_id: Option<Expression> },  // Call specific client or all
    All,  // Broadcast to all
}

#[derive(Debug, Clone)]
pub enum NetworkStatement {
    Sync { field: String, value: Expression },
    Send { target: RpcTarget, function: String, args: Vec<Expression> },
    Receive { handler: String, body: Vec<Statement> },
    Connect { address: Expression },
    Disconnect,
}

// ============================================================================
// MACRO SYSTEM
// ============================================================================

#[derive(Debug, Clone)]
pub struct MacroDeclaration {
    pub name: String,
    pub params: Vec<MacroParam>,
    pub body: MacroBody,
}

#[derive(Debug, Clone)]
pub struct MacroParam {
    pub name: String,
    pub is_variadic: bool,  // For ...args
    pub is_block: bool,  // For block parameters
}

#[derive(Debug, Clone)]
pub enum MacroBody {
    Code(Vec<Statement>),  // Regular macro expansion
    Template(String),  // String template for code generation
}

// ============================================================================
// PLUGIN SYSTEM
// ============================================================================

#[derive(Debug, Clone)]
pub struct PluginDeclaration {
    pub name: String,
    pub version: Option<String>,
    pub path: Option<String>,  // Local path
    pub url: Option<String>,  // Remote URL
    pub dependencies: Vec<String>,
    pub exports: Vec<String>,  // What this plugin exports
}

// ============================================================================
// DEBUGGER INTEGRATION
// ============================================================================

#[derive(Debug, Clone)]
pub enum DebuggerStatement {
    Break,  // debugger.break()
    Watch { variable: String },  // debugger.watch(variable)
    Log { message: Expression },  // debugger.log(message)
    Assert { condition: Expression, message: Option<Expression> },  // debugger.assert(condition, message)
    Trace { function: String },  // debugger.trace(function)
}

// ============================================================================
// PACKAGE MANAGEMENT
// ============================================================================

#[derive(Debug, Clone)]
pub struct PackageDeclaration {
    pub name: String,
    pub version: String,
    pub dependencies: Vec<Dependency>,
    pub dev_dependencies: Vec<Dependency>,
}

#[derive(Debug, Clone)]
pub struct Dependency {
    pub name: String,
    pub version: Option<String>,  // Version constraint
    pub path: Option<String>,  // Local path
    pub git: Option<String>,  // Git URL
    pub features: Vec<String>,  // Optional features
}

// ============================================================================
// HOT RELOAD SUPPORT
// ============================================================================

#[derive(Debug, Clone)]
pub struct HotReloadMarker {
    pub module: String,
    pub line: usize,
}

// ============================================================================
// VISUAL SCRIPTING INTEGRATION
// ============================================================================

#[derive(Debug, Clone)]
pub struct VisualScript {
    pub nodes: Vec<VisualNode>,
    pub connections: Vec<VisualConnection>,
}

#[derive(Debug, Clone)]
pub struct VisualNode {
    pub id: String,
    pub node_type: VisualNodeType,
    pub position: (f64, f64),
    pub properties: Vec<(String, Expression)>,
}

#[derive(Debug, Clone)]
pub enum VisualNodeType {
    Event,  // OnStart, OnUpdate, etc.
    Action,  // Spawn, Move, etc.
    Condition,  // If, Compare, etc.
    Variable,  // Get/Set variable
    Custom(String),  // Custom node type
}

#[derive(Debug, Clone)]
pub struct VisualConnection {
    pub from_node: String,
    pub from_socket: String,
    pub to_node: String,
    pub to_socket: String,
}

