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
        Self {
            context: TypeContext::new(),
            errors: Vec::new(),
        }
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
                // TODO: Register component type
            }
            Item::Entity(entity) => {
                // TODO: Register entity type
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
            Expression::Binary { op: _, left, right } => {
                let left_type = self.check_expression(left, ctx)?;
                let right_type = self.check_expression(right, ctx)?;
                
                // TODO: Check operator compatibility
                // For now, assume same type
                if left_type == right_type {
                    Ok(left_type)
                } else {
                    Ok(Type::Unknown)
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
            Expression::Member { object, member: _ } => {
                // TODO: Check member access
                self.check_expression(object, ctx)
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
            _ => {
                // TODO: Check other expression types
                Ok(Type::Unknown)
            }
        }
    }
}

