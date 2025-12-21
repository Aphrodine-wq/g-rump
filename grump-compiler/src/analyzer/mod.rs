//! Type Analyzer for G-Rump
//! 
//! Performs type checking, ownership analysis, and animation validation.

use crate::parser::{Program, Expression, Statement, Item};
use crate::error::{GrumpError, GrumpResult};
use crate::analyzer::types::{Type, TypeContext, ast_type_to_type};

pub mod types;

pub struct Analyzer {
    context: TypeContext,
    errors: Vec<GrumpError>,
}

impl Analyzer {
    pub fn new() -> Self {
        let mut analyzer = Self {
            context: TypeContext::new(),
            errors: Vec::new(),
        };
        
        // Add built-in functions
        analyzer.add_builtin_functions();
        
        analyzer
    }
    
    fn add_builtin_functions(&mut self) {
        // Math functions
        self.context.add_function("sin".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        self.context.add_function("cos".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        self.context.add_function("sqrt".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        self.context.add_function("abs".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        
        // Vector functions
        self.context.add_function("length".to_string(), FunctionSignature {
            params: vec![("v".to_string(), Type::Vec2)],
            return_type: Type::Float,
        });
        self.context.add_function("normalize".to_string(), FunctionSignature {
            params: vec![("v".to_string(), Type::Vec2)],
            return_type: Type::Vec2,
        });
        self.context.add_function("dot".to_string(), FunctionSignature {
            params: vec![("a".to_string(), Type::Vec2), ("b".to_string(), Type::Vec2)],
            return_type: Type::Float,
        });
        
        // Animation functions
        self.context.add_function("lerp".to_string(), FunctionSignature {
            params: vec![("a".to_string(), Type::Float), ("b".to_string(), Type::Float), ("t".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        self.context.add_function("ease_in_out".to_string(), FunctionSignature {
            params: vec![("t".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        
        // Utility functions
        self.context.add_function("print".to_string(), FunctionSignature {
            params: vec![("message".to_string(), Type::String)],
            return_type: Type::Never,
        });
        self.context.add_function("random".to_string(), FunctionSignature {
            params: vec![("min".to_string(), Type::Float), ("max".to_string(), Type::Float)],
            return_type: Type::Float,
        });
        
        // String functions
        self.context.add_function("concat".to_string(), FunctionSignature {
            params: vec![("a".to_string(), Type::String), ("b".to_string(), Type::String)],
            return_type: Type::String,
        });
        self.context.add_function("substring".to_string(), FunctionSignature {
            params: vec![("s".to_string(), Type::String), ("start".to_string(), Type::Int), ("end".to_string(), Type::Int)],
            return_type: Type::String,
        });
        self.context.add_function("str_length".to_string(), FunctionSignature {
            params: vec![("s".to_string(), Type::String)],
            return_type: Type::Int,
        });
        
        // Color functions
        self.context.add_function("rgb".to_string(), FunctionSignature {
            params: vec![("r".to_string(), Type::Int), ("g".to_string(), Type::Int), ("b".to_string(), Type::Int)],
            return_type: Type::Color,
        });
        self.context.add_function("rgba".to_string(), FunctionSignature {
            params: vec![("r".to_string(), Type::Int), ("g".to_string(), Type::Int), ("b".to_string(), Type::Int), ("a".to_string(), Type::Int)],
            return_type: Type::Color,
        });
        self.context.add_function("hsl".to_string(), FunctionSignature {
            params: vec![("h".to_string(), Type::Float), ("s".to_string(), Type::Float), ("l".to_string(), Type::Float)],
            return_type: Type::Color,
        });
        
        // Transform functions
        self.context.add_function("translate".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float), ("y".to_string(), Type::Float)],
            return_type: Type::Transform,
        });
        self.context.add_function("rotate".to_string(), FunctionSignature {
            params: vec![("angle".to_string(), Type::Angle)],
            return_type: Type::Transform,
        });
        self.context.add_function("scale".to_string(), FunctionSignature {
            params: vec![("x".to_string(), Type::Float), ("y".to_string(), Type::Float)],
            return_type: Type::Transform,
        });
        
        // Time functions
        self.context.add_function("now".to_string(), FunctionSignature {
            params: vec![],
            return_type: Type::Float,
        });
        self.context.add_function("delta_time".to_string(), FunctionSignature {
            params: vec![],
            return_type: Type::Float,
        });
    }
    
    pub fn analyze(&mut self, program: &Program) -> GrumpResult<()> {
        // First pass: collect all type definitions
        for item in &program.items {
            self.collect_types(item)?;
        }
        
        // Second pass: type check everything
        for item in &program.items {
            self.check_item(item)?;
        }
        
        if !self.errors.is_empty() {
            return Err(self.errors.remove(0));
        }
        
        Ok(())
    }
    
    fn collect_types(&mut self, item: &Item) -> GrumpResult<()> {
        match item {
            Item::Component(comp) => {
                // Register component type
                let mut fields = Vec::new();
                for field in &comp.fields {
                    let field_type = ast_type_to_type(&field.type_);
                    fields.push((field.name.clone(), field_type));
                }
                let component_type = Type::Named(format!("Component_{}", comp.name));
                self.context.types.insert(comp.name.clone(), component_type);
            }
            Item::Entity(entity) => {
                // Register entity type
                let entity_type = Type::Named(format!("Entity_{}", entity.name));
                self.context.types.insert(entity.name.clone(), entity_type);
            }
            Item::Function(func) => {
                // Register function signature
                let mut params = Vec::new();
                for param in &func.params {
                    if let Some(type_) = &param.type_ {
                        let param_type = ast_type_to_type(type_);
                        params.push((param.name.clone(), param_type));
                    } else {
                        params.push((param.name.clone(), Type::Unknown));
                    }
                }
                let return_type = if let Some(rt) = &func.return_type {
                    ast_type_to_type(rt)
                } else {
                    Type::Never
                };
                let sig = FunctionSignature {
                    params,
                    return_type,
                };
                self.context.add_function(func.name.clone(), sig);
            }
            _ => {}
        }
        Ok(())
    }
    
    fn check_item(&mut self, item: &Item) -> GrumpResult<()> {
        match item {
            Item::App(app) => {
                for item in &app.body {
                    self.check_item(item)?;
                }
            }
            Item::Scene(scene) => {
                for stmt in &scene.body {
                    self.check_statement(stmt)?;
                }
            }
            Item::Function(func) => {
                // Create new scope for function
                let mut func_ctx = TypeContext::new();
                
                // Add parameters to context
                for param in &func.params {
                    if let Some(type_) = &param.type_ {
                        let t = ast_type_to_type(type_);
                        func_ctx.add_variable(param.name.clone(), t);
                    }
                }
                
                // If async function, return type should be wrapped in Async
                if func.is_async {
                    if let Some(return_type) = &func.return_type {
                        let rt = ast_type_to_type(return_type);
                        // TODO: Wrap return type in Async if not already
                    }
                }
                
                // Type check function body
                for stmt in &func.body {
                    self.check_statement_with_context(stmt, &mut func_ctx)?;
                }
            }
            Item::Entity(entity) => {
                for stmt in &entity.body {
                    self.check_statement(stmt)?;
                }
            }
            Item::Shader(_) => {
                // Shader type checking is done separately
                // TODO: Validate shader uniforms, check shader code syntax
            }
            Item::BehaviorTree(_) => {
                // Behavior tree validation
                // TODO: Check that all referenced actions exist
            }
            Item::Network(_) => {
                // Network validation
                // TODO: Check sync field types, RPC signatures
            }
            Item::Macro(_) => {
                // Macro validation
                // TODO: Check macro parameter types
            }
            Item::Plugin(_) => {
                // Plugin validation
                // TODO: Check plugin dependencies exist
            }
            Item::Package(_) => {
                // Package validation
                // TODO: Check version constraints, resolve dependencies
            }
            _ => {}
        }
        Ok(())
    }
    
    fn check_statement(&mut self, stmt: &Statement) -> GrumpResult<()> {
        self.check_statement_with_context(stmt, &mut self.context)
    }
    
    fn check_statement_with_context(&mut self, stmt: &Statement, ctx: &mut TypeContext) -> GrumpResult<()> {
        match stmt {
            Statement::Let { name, type_, value } => {
                let value_type = self.check_expression(value, ctx)?;
                
                if let Some(declared_type) = type_ {
                    let declared = ast_type_to_type(declared_type);
                    if !value_type.is_compatible_with(&declared) {
                        self.errors.push(GrumpError::Type {
                            message: format!(
                                "Type mismatch: variable '{}' declared as {:?} but assigned {:?}",
                                name, declared, value_type
                            ),
                        });
                    }
                    ctx.add_variable(name.clone(), declared);
                } else {
                    // Type inference
                    ctx.add_variable(name.clone(), value_type);
                }
            }
            Statement::Assign { target, value } => {
                let target_type = self.check_expression(target, ctx)?;
                let value_type = self.check_expression(value, ctx)?;
                
                if !value_type.is_compatible_with(&target_type) {
                    self.errors.push(GrumpError::Type {
                        message: format!(
                            "Cannot assign {:?} to {:?}",
                            value_type, target_type
                        ),
                    });
                }
            }
            Statement::If { condition, then, else_ } => {
                let cond_type = self.check_expression(condition, ctx)?;
                if cond_type != Type::Bool {
                    self.errors.push(GrumpError::Type {
                        message: format!("If condition must be bool, got {:?}", cond_type),
                    });
                }
                
                for stmt in then {
                    self.check_statement_with_context(stmt, ctx)?;
                }
                
                if let Some(else_body) = else_ {
                    for stmt in else_body {
                        self.check_statement_with_context(stmt, ctx)?;
                    }
                }
            }
            Statement::Return(expr) => {
                if let Some(expr) = expr {
                    self.check_expression(expr, ctx)?;
                }
            }
            Statement::Expression(expr) => {
                self.check_expression(expr, ctx)?;
            }
            Statement::Animate(animate) => {
                let target_type = self.check_expression(&animate.target, ctx)?;
                
                // Check that target is animatable
                if !target_type.is_animatable() {
                    self.errors.push(GrumpError::Animation {
                        message: format!("Cannot animate type {:?} - type is not animatable", target_type),
                    });
                }
                
                // Check keyframes
                for keyframe in &animate.keyframes {
                    self.check_expression(&keyframe.time, ctx)?;
                    self.check_expression(&keyframe.value, ctx)?;
                }
            }
            Statement::Await { expr } => {
                // Check that expression is async
                let expr_type = self.check_expression(expr, ctx)?;
                match expr_type {
                    Type::Async(inner) => {
                        // Await unwraps the async type
                        // The result type would be *inner, but for now we'll use Unknown
                        // TODO: Properly handle async type unwrapping
                    }
                    _ => {
                        self.errors.push(GrumpError::Type {
                            message: format!("Cannot await non-async expression of type {:?}", expr_type),
                        });
                    }
                }
            }
            Statement::Debugger(_) => {
                // Debugger statements are always valid (no-op in release)
            }
            Statement::Network(_) => {
                // Network statements are checked separately
                // TODO: Add network-specific type checking
            }
            _ => {
                // TODO: Check other statement types
            }
        }
        Ok(())
    }
    
    fn check_expression(&mut self, expr: &Expression, ctx: &TypeContext) -> GrumpResult<Type> {
        match expr {
            Expression::Literal(lit) => {
                match lit {
                    crate::parser::Literal::Integer(_) => Ok(Type::Int),
                    crate::parser::Literal::Float(_) => Ok(Type::Float),
                    crate::parser::Literal::String(_) => Ok(Type::String),
                    crate::parser::Literal::Char(_) => Ok(Type::Char),
                    crate::parser::Literal::Bool(b) => Ok(Type::Bool),
                    crate::parser::Literal::Vec2 { .. } => Ok(Type::Vec2),
                    crate::parser::Literal::Vec3 { .. } => Ok(Type::Vec3),
                    crate::parser::Literal::Color { .. } => Ok(Type::Color),
                    crate::parser::Literal::Duration { .. } => Ok(Type::Duration),
                    crate::parser::Literal::Angle { .. } => Ok(Type::Angle),
                }
            }
            Expression::Identifier(name) => {
                if let Some(type_) = ctx.get_variable(name) {
                    Ok(type_.clone())
                } else {
                    self.errors.push(GrumpError::Type {
                        message: format!("Undefined variable: {}", name),
                    });
                    Ok(Type::Unknown)
                }
            }
            Expression::Binary { op, left, right } => {
                let left_type = self.check_expression(left, ctx)?;
                let right_type = self.check_expression(right, ctx)?;
                
                // Check operator compatibility
                match op {
                    crate::parser::BinaryOp::Add | crate::parser::BinaryOp::Sub | 
                    crate::parser::BinaryOp::Mul | crate::parser::BinaryOp::Div | 
                    crate::parser::BinaryOp::Mod => {
                        // Arithmetic operators require numeric types
                        match (&left_type, &right_type) {
                            (Type::Int, Type::Int) => Ok(Type::Int),
                            (Type::Float, Type::Float) => Ok(Type::Float),
                            (Type::Int, Type::Float) | (Type::Float, Type::Int) => Ok(Type::Float),
                            (Type::Vec2, Type::Vec2) => Ok(Type::Vec2),
                            (Type::Vec3, Type::Vec3) => Ok(Type::Vec3),
                            _ => {
                                self.errors.push(GrumpError::Type {
                                    message: format!("Cannot apply {:?} to {:?} and {:?}", op, left_type, right_type),
                                });
                                Ok(Type::Unknown)
                            }
                        }
                    }
                    crate::parser::BinaryOp::Eq | crate::parser::BinaryOp::Ne |
                    crate::parser::BinaryOp::Lt | crate::parser::BinaryOp::Gt |
                    crate::parser::BinaryOp::Le | crate::parser::BinaryOp::Ge => {
                        // Comparison operators return bool
                        if left_type.is_compatible_with(&right_type) {
                            Ok(Type::Bool)
                        } else {
                            self.errors.push(GrumpError::Type {
                                message: format!("Cannot compare {:?} and {:?}", left_type, right_type),
                            });
                            Ok(Type::Bool)  // Still return bool for error recovery
                        }
                    }
                    crate::parser::BinaryOp::And | crate::parser::BinaryOp::Or => {
                        // Logical operators require bool
                        match (&left_type, &right_type) {
                            (Type::Bool, Type::Bool) => Ok(Type::Bool),
                            _ => {
                                self.errors.push(GrumpError::Type {
                                    message: format!("Logical operators require bool, got {:?} and {:?}", left_type, right_type),
                                });
                                Ok(Type::Bool)
                            }
                        }
                    }
                    _ => {
                        // Unknown operator
                        Ok(Type::Unknown)
                    }
                }
            }
            Expression::Call { func, args } => {
                // TODO: Check function call
                if let Expression::Identifier(name) = func.as_ref() {
                    if let Some(sig) = ctx.get_function(name) {
                        // Check argument types match
                        for (i, arg) in args.iter().enumerate() {
                            if i < sig.params.len() {
                                let arg_type = self.check_expression(arg, ctx)?;
                                let param_type = &sig.params[i].1;
                                if !arg_type.is_compatible_with(param_type) {
                                    self.errors.push(GrumpError::Type {
                                        message: format!(
                                            "Argument {} to '{}' has wrong type: expected {:?}, got {:?}",
                                            i, name, param_type, arg_type
                                        ),
                                    });
                                }
                            }
                        }
                        Ok(sig.return_type.clone())
                    } else {
                        self.errors.push(GrumpError::Type {
                            message: format!("Undefined function: {}", name),
                        });
                        Ok(Type::Unknown)
                    }
                } else {
                    Ok(Type::Unknown)
                }
            }
            Expression::Member { object, member } => {
                let object_type = self.check_expression(object, ctx)?;
                // Check if member exists on the type
                match object_type {
                    Type::Vec2 | Type::Vec3 | Type::Vec4 => {
                        // Vector types have x, y, z, w members
                        match member.as_str() {
                            "x" | "y" | "z" | "w" => Ok(Type::Float),
                            _ => {
                                self.errors.push(GrumpError::Type {
                                    message: format!("Type {:?} has no member '{}'", object_type, member),
                                });
                                Ok(Type::Unknown)
                            }
                        }
                    }
                    Type::Named(name) => {
                        // Check if it's a component or entity type
                        // TODO: Look up actual type definition
                        Ok(Type::Unknown)
                    }
                    _ => {
                        self.errors.push(GrumpError::Type {
                            message: format!("Cannot access member '{}' on type {:?}", member, object_type),
                        });
                        Ok(Type::Unknown)
                    }
                }
            }
            Expression::Await(expr) => {
                // Check that expression is async
                let expr_type = self.check_expression(expr, ctx)?;
                match expr_type {
                    Type::Async(inner) => Ok(*inner),  // Await unwraps async
                    _ => {
                        self.errors.push(GrumpError::Type {
                            message: format!("Cannot await non-async expression of type {:?}", expr_type),
                        });
                        Ok(Type::Unknown)
                    }
                }
            }
            Expression::AsyncBlock(_) => {
                // Async block returns an async type
                // TODO: Infer the actual return type from the block
                Ok(Type::Async(Box::new(Type::Unknown)))
            }
            Expression::MacroCall { name: _, args: _ } => {
                // Macro calls are expanded before type checking
                // This should not be reached in normal flow
                Ok(Type::Unknown)
            }
            Expression::Array(elements) => {
                if elements.is_empty() {
                    Ok(Type::List(Box::new(Type::Unknown)))
                } else {
                    let first_type = self.check_expression(&elements[0], ctx)?;
                    // Check all elements have compatible types
                    for elem in elements.iter().skip(1) {
                        let elem_type = self.check_expression(elem, ctx)?;
                        if !elem_type.is_compatible_with(&first_type) {
                            self.errors.push(GrumpError::Type {
                                message: format!("Array elements must have compatible types, got {:?} and {:?}", first_type, elem_type),
                            });
                        }
                    }
                    Ok(Type::List(Box::new(first_type)))
                }
            }
            Expression::Tuple(elements) => {
                let mut types = Vec::new();
                for elem in elements {
                    types.push(self.check_expression(elem, ctx)?);
                }
                Ok(Type::Tuple(types))
            }
            Expression::Index { object, index } => {
                let array_type = self.check_expression(object, ctx)?;
                let index_type = self.check_expression(index, ctx)?;
                
                if index_type != Type::Int {
                    self.errors.push(GrumpError::Type {
                        message: format!("Array index must be int, got {:?}", index_type),
                    });
                }
                
                match array_type {
                    Type::List(inner) => Ok(*inner),
                    Type::Array(inner, _) => Ok(*inner),
                    Type::String => Ok(Type::Char),
                    _ => {
                        self.errors.push(GrumpError::Type {
                            message: format!("Cannot index type {:?}", array_type),
                        });
                        Ok(Type::Unknown)
                    }
                }
            }
            _ => {
                // TODO: Check other expression types
                Ok(Type::Unknown)
            }
        }
    }
}

