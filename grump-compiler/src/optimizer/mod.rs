//! Optimizer for G-Rump
//! 
//! Performs dead code elimination, constant folding, and animation optimization.

use crate::parser::Program;
use crate::error::{GrumpError, GrumpResult};

pub struct Optimizer {
    level: OptimizationLevel,
}

#[derive(Debug, Clone, Copy)]
pub enum OptimizationLevel {
    None,
    Debug,
    Release,
    Size,
}

impl Optimizer {
    pub fn new(level: OptimizationLevel) -> Self {
        Self { level }
    }
    
    pub fn optimize(&mut self, program: &mut Program) -> GrumpResult<()> {
        match self.level {
            OptimizationLevel::None => Ok(()),
            OptimizationLevel::Debug => {
                // Minimal optimizations for faster compile times
                self.constant_folding(program)?;
                Ok(())
            }
            OptimizationLevel::Release => {
                // Full optimizations
                self.constant_folding(program)?;
                self.dead_code_elimination(program)?;
                self.animation_optimization(program)?;
                Ok(())
            }
            OptimizationLevel::Size => {
                // Optimize for binary size
                self.constant_folding(program)?;
                self.dead_code_elimination(program)?;
                self.animation_optimization(program)?;
                // Additional size optimizations
                Ok(())
            }
        }
    }
    
    fn constant_folding(&mut self, program: &mut Program) -> GrumpResult<()> {
        // Fold constants in expressions throughout the program
        for item in &mut program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    for stmt in &mut func.body {
                        self.fold_statement(stmt)?;
                    }
                }
                crate::parser::Item::Scene(scene) => {
                    for stmt in &mut scene.body {
                        self.fold_statement(stmt)?;
                    }
                }
                crate::parser::Item::Entity(entity) => {
                    for stmt in &mut entity.body {
                        self.fold_statement(stmt)?;
                    }
                }
                _ => {}
            }
        }
        Ok(())
    }
    
    fn fold_statement(&mut self, stmt: &mut crate::parser::Statement) -> GrumpResult<()> {
        match stmt {
            crate::parser::Statement::Let { value, .. } => {
                *value = self.fold_expression(value)?;
            }
            crate::parser::Statement::Return(Some(expr)) => {
                *expr = self.fold_expression(expr)?;
            }
            crate::parser::Statement::Expression(expr) => {
                *expr = self.fold_expression(expr)?;
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                *condition = self.fold_expression(condition)?;
                for stmt in then {
                    self.fold_statement(stmt)?;
                }
                if let Some(else_body) = else_ {
                    for stmt in else_body {
                        self.fold_statement(stmt)?;
                    }
                }
            }
            _ => {}
        }
        Ok(())
    }
    
    fn fold_expression(&mut self, expr: &mut crate::parser::Expression) -> GrumpResult<crate::parser::Expression> {
        match expr {
            crate::parser::Expression::Binary { op, left, right } => {
                // Recursively fold children first
                let folded_left = self.fold_expression(left)?;
                let folded_right = self.fold_expression(right)?;
                
                // Try to fold if both are literals
                if let (crate::parser::Expression::Literal(left_lit), crate::parser::Expression::Literal(right_lit)) = (&folded_left, &folded_right) {
                    if let Some(result) = self.evaluate_binary(op, left_lit, right_lit) {
                        return Ok(crate::parser::Expression::Literal(result));
                    }
                }
                
                Ok(crate::parser::Expression::Binary {
                    op: *op,
                    left: Box::new(folded_left),
                    right: Box::new(folded_right),
                })
            }
            crate::parser::Expression::Unary { op, expr: inner } => {
                let folded = self.fold_expression(inner)?;
                if let crate::parser::Expression::Literal(lit) = &folded {
                    if let Some(result) = self.evaluate_unary(op, lit) {
                        return Ok(crate::parser::Expression::Literal(result));
                    }
                }
                Ok(crate::parser::Expression::Unary {
                    op: *op,
                    expr: Box::new(folded),
                })
            }
            _ => Ok(expr.clone()),
        }
    }
    
    fn evaluate_binary(&self, op: &crate::parser::BinaryOp, left: &crate::parser::Literal, right: &crate::parser::Literal) -> Option<crate::parser::Literal> {
        match (op, left, right) {
            (crate::parser::BinaryOp::Add, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Integer(a + b))
            }
            (crate::parser::BinaryOp::Sub, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Integer(a - b))
            }
            (crate::parser::BinaryOp::Mul, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Integer(a * b))
            }
            (crate::parser::BinaryOp::Div, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                if *b != 0 {
                    Some(crate::parser::Literal::Integer(a / b))
                } else {
                    None
                }
            }
            (crate::parser::BinaryOp::Add, crate::parser::Literal::Float(a), crate::parser::Literal::Float(b)) => {
                Some(crate::parser::Literal::Float(a + b))
            }
            (crate::parser::BinaryOp::Sub, crate::parser::Literal::Float(a), crate::parser::Literal::Float(b)) => {
                Some(crate::parser::Literal::Float(a - b))
            }
            (crate::parser::BinaryOp::Mul, crate::parser::Literal::Float(a), crate::parser::Literal::Float(b)) => {
                Some(crate::parser::Literal::Float(a * b))
            }
            (crate::parser::BinaryOp::Div, crate::parser::Literal::Float(a), crate::parser::Literal::Float(b)) => {
                if *b != 0.0 {
                    Some(crate::parser::Literal::Float(a / b))
                } else {
                    None
                }
            }
            (crate::parser::BinaryOp::Eq, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Bool(a == b))
            }
            (crate::parser::BinaryOp::Ne, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Bool(a != b))
            }
            (crate::parser::BinaryOp::Lt, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Bool(a < b))
            }
            (crate::parser::BinaryOp::Gt, crate::parser::Literal::Integer(a), crate::parser::Literal::Integer(b)) => {
                Some(crate::parser::Literal::Bool(a > b))
            }
            (crate::parser::BinaryOp::And, crate::parser::Literal::Bool(a), crate::parser::Literal::Bool(b)) => {
                Some(crate::parser::Literal::Bool(*a && *b))
            }
            (crate::parser::BinaryOp::Or, crate::parser::Literal::Bool(a), crate::parser::Literal::Bool(b)) => {
                Some(crate::parser::Literal::Bool(*a || *b))
            }
            _ => None,
        }
    }
    
    fn evaluate_unary(&self, op: &crate::parser::UnaryOp, lit: &crate::parser::Literal) -> Option<crate::parser::Literal> {
        match (op, lit) {
            (crate::parser::UnaryOp::Neg, crate::parser::Literal::Integer(n)) => {
                Some(crate::parser::Literal::Integer(-n))
            }
            (crate::parser::UnaryOp::Neg, crate::parser::Literal::Float(f)) => {
                Some(crate::parser::Literal::Float(-f))
            }
            (crate::parser::UnaryOp::Not, crate::parser::Literal::Bool(b)) => {
                Some(crate::parser::Literal::Bool(!b))
            }
            _ => None,
        }
    }
    
    fn dead_code_elimination(&mut self, program: &mut Program) -> GrumpResult<()> {
        // Track which functions are called
        let mut called_functions = std::collections::HashSet::new();
        let mut used_variables = std::collections::HashSet::new();
        
        // First pass: find all function calls and variable uses
        self.collect_usage(program, &mut called_functions, &mut used_variables);
        
        // Second pass: remove unused functions and variables
        program.items.retain(|item| {
            match item {
                crate::parser::Item::Function(func) => {
                    // Keep if it's called or if it's main/entry point
                    called_functions.contains(&func.name) || 
                    func.name == "main" || 
                    func.name == "update" ||
                    func.name == "init"
                }
                _ => true,  // Keep other items for now
            }
        });
        
        // Remove unused variables from function bodies
        for item in &mut program.items {
            if let crate::parser::Item::Function(func) = item {
                self.remove_unused_variables(func, &used_variables);
            }
        }
        
        Ok(())
    }
    
    fn collect_usage(&self, program: &Program, functions: &mut std::collections::HashSet<String>, variables: &mut std::collections::HashSet<String>) {
        for item in &program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    self.collect_function_usage(func, functions, variables);
                }
                crate::parser::Item::Scene(scene) => {
                    for stmt in &scene.body {
                        self.collect_statement_usage(stmt, functions, variables);
                    }
                }
                crate::parser::Item::Entity(entity) => {
                    for stmt in &entity.body {
                        self.collect_statement_usage(stmt, functions, variables);
                    }
                }
                _ => {}
            }
        }
    }
    
    fn collect_function_usage(&self, func: &crate::parser::FunctionDeclaration, functions: &mut std::collections::HashSet<String>, variables: &mut std::collections::HashSet<String>) {
        for stmt in &func.body {
            self.collect_statement_usage(stmt, functions, variables);
        }
    }
    
    fn collect_statement_usage(&self, stmt: &crate::parser::Statement, functions: &mut std::collections::HashSet<String>, variables: &mut std::collections::HashSet<String>) {
        match stmt {
            crate::parser::Statement::Let { name, value, .. } => {
                self.collect_expression_usage(value, functions, variables);
                variables.insert(name.clone());
            }
            crate::parser::Statement::Expression(expr) => {
                self.collect_expression_usage(expr, functions, variables);
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                self.collect_expression_usage(condition, functions, variables);
                for stmt in then {
                    self.collect_statement_usage(stmt, functions, variables);
                }
                if let Some(else_body) = else_ {
                    for stmt in else_body {
                        self.collect_statement_usage(stmt, functions, variables);
                    }
                }
            }
            crate::parser::Statement::Return(Some(expr)) => {
                self.collect_expression_usage(expr, functions, variables);
            }
            crate::parser::Statement::For { iter, body, .. } => {
                self.collect_expression_usage(iter, functions, variables);
                for stmt in body {
                    self.collect_statement_usage(stmt, functions, variables);
                }
            }
            crate::parser::Statement::While { condition, body } => {
                self.collect_expression_usage(condition, functions, variables);
                for stmt in body {
                    self.collect_statement_usage(stmt, functions, variables);
                }
            }
            _ => {}
        }
    }
    
    fn collect_expression_usage(&self, expr: &crate::parser::Expression, functions: &mut std::collections::HashSet<String>, variables: &mut std::collections::HashSet<String>) {
        match expr {
            crate::parser::Expression::Identifier(name) => {
                variables.insert(name.clone());
            }
            crate::parser::Expression::Call { func, args } => {
                if let crate::parser::Expression::Identifier(func_name) = func.as_ref() {
                    functions.insert(func_name.clone());
                }
                for arg in args {
                    self.collect_expression_usage(arg, functions, variables);
                }
            }
            crate::parser::Expression::Binary { left, right, .. } => {
                self.collect_expression_usage(left, functions, variables);
                self.collect_expression_usage(right, functions, variables);
            }
            crate::parser::Expression::Unary { expr: inner, .. } => {
                self.collect_expression_usage(inner, functions, variables);
            }
            crate::parser::Expression::Member { object, .. } => {
                self.collect_expression_usage(object, functions, variables);
            }
            _ => {}
        }
    }
    
    fn remove_unused_variables(&self, func: &mut crate::parser::FunctionDeclaration, used: &std::collections::HashSet<String>) {
        // Remove unused let statements
        func.body.retain(|stmt| {
            match stmt {
                crate::parser::Statement::Let { name, .. } => {
                    used.contains(name)
                }
                _ => true,
            }
        });
    }
    
    fn animation_optimization(&mut self, program: &mut Program) -> GrumpResult<()> {
        // Optimize animate statements
        for item in &mut program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    self.optimize_function_animations(func);
                }
                crate::parser::Item::Scene(scene) => {
                    for stmt in &mut scene.body {
                        self.optimize_statement_animations(stmt);
                    }
                }
                crate::parser::Item::Entity(entity) => {
                    for stmt in &mut entity.body {
                        self.optimize_statement_animations(stmt);
                    }
                }
                _ => {}
            }
        }
        Ok(())
    }
    
    fn optimize_function_animations(&self, func: &mut crate::parser::FunctionDeclaration) {
        for stmt in &mut func.body {
            self.optimize_statement_animations(stmt);
        }
    }
    
    fn optimize_statement_animations(&self, stmt: &mut crate::parser::Statement) {
        match stmt {
            crate::parser::Statement::Animate(animate) => {
                // Sort keyframes by time (simplified - would need expression evaluation in real implementation)
                animate.keyframes.sort_by(|a, b| {
                    format!("{:?}", a.time).cmp(&format!("{:?}", b.time))
                });
                
                // Remove duplicate keyframes (same time)
                animate.keyframes.dedup_by(|a, b| {
                    format!("{:?}", a.time) == format!("{:?}", b.time)
                });
            }
            crate::parser::Statement::If { then, else_, .. } => {
                for s in then {
                    self.optimize_statement_animations(s);
                }
                if let Some(else_body) = else_ {
                    for s in else_body {
                        self.optimize_statement_animations(s);
                    }
                }
            }
            crate::parser::Statement::For { body, .. } | 
            crate::parser::Statement::While { body, .. } => {
                for s in body {
                    self.optimize_statement_animations(s);
                }
            }
            _ => {}
        }
    }
}

