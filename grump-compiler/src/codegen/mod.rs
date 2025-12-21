//! Code Generator for G-Rump
//! 
//! Generates target code (Swift, Kotlin, Dart, JavaScript) from G-Rump AST.

use crate::parser::Program;
use crate::error::{GrumpError, GrumpResult};

mod phaser;
use phaser::PhaserCodegen;

pub enum Target {
    Ios,      // Swift + Metal
    Android,  // Kotlin + OpenGL
    Web,      // JavaScript + WebGL
    Flutter,  // Dart + Skia
}

pub struct CodeGenerator {
    target: Target,
}

impl CodeGenerator {
    pub fn new(target: Target) -> Self {
        Self { target }
    }
    
    pub fn generate(&mut self, program: &Program) -> GrumpResult<String> {
        match self.target {
            Target::Ios => self.generate_swift(program),
            Target::Android => self.generate_kotlin(program),
            Target::Web => PhaserCodegen::generate_game(program), // Use Phaser for web
            Target::Flutter => self.generate_dart(program),
        }
    }
    
    fn generate_swift(&mut self, program: &Program) -> GrumpResult<String> {
        let mut output = String::new();
        output.push_str("// Generated Swift + Metal code from G-Rump\n");
        output.push_str("import SwiftUI\n");
        output.push_str("import Metal\n");
        output.push_str("import MetalKit\n\n");
        
        // Generate code for each item
        for item in &program.items {
            match item {
                crate::parser::Item::App(app) => {
                    output.push_str(&format!("// App: {}\n", app.name));
                    if let Some(version) = &app.version {
                        output.push_str(&format!("// Version: {}\n", version));
                    }
                    if let Some(fps) = app.fps {
                        output.push_str(&format!("// Target FPS: {}\n", fps));
                    }
                    output.push_str("\n");
                }
                crate::parser::Item::Scene(scene) => {
                    output.push_str(&format!("// Scene: {}\n", scene.name));
                    output.push_str("// TODO: Generate scene code\n\n");
                }
                crate::parser::Item::Animation(anim) => {
                    output.push_str(&self.generate_swift_animation(anim)?);
                }
                crate::parser::Item::Shader(shader) => {
                    output.push_str(&self.generate_swift_shader(shader)?);
                }
                crate::parser::Item::BehaviorTree(bt) => {
                    output.push_str(&self.generate_swift_behavior_tree(bt)?);
                }
                crate::parser::Item::Function(func) => {
                    output.push_str(&self.generate_swift_function(func)?);
                }
                crate::parser::Item::Component(comp) => {
                    output.push_str(&self.generate_swift_component(comp)?);
                }
                crate::parser::Item::Entity(entity) => {
                    output.push_str(&self.generate_swift_entity(entity)?);
                }
                crate::parser::Item::System(system) => {
                    output.push_str(&self.generate_swift_system(system)?);
                }
                crate::parser::Item::App(app) => {
                    output.push_str(&self.generate_swift_app(app)?);
                }
                crate::parser::Item::Scene(scene) => {
                    output.push_str(&self.generate_swift_scene(scene)?);
                }
                crate::parser::Item::BehaviorTree(bt) => {
                    output.push_str(&self.generate_swift_behavior_tree(bt)?);
                }
                _ => {
                    // Other items
                }
            }
        }
        
        Ok(output)
    }
    
    fn generate_swift_animation(&self, anim: &crate::parser::AnimationDeclaration) -> GrumpResult<String> {
        let mut code = format!("// Animation: {}\n", anim.name);
        code.push_str("struct ");
        code.push_str(&anim.name);
        code.push_str("Animation {\n");
        code.push_str("    let keyframes: [Keyframe]\n");
        if let Some(duration) = &anim.duration {
            code.push_str("    let duration: Double = ");
            code.push_str(&self.generate_swift_expression(duration)?);
            code.push_str("\n");
        }
        code.push_str("    let loopMode: LoopMode = ");
        if let Some(loop_mode) = &anim.loop_mode {
            match loop_mode {
                crate::parser::LoopMode::None => code.push_str(".none"),
                crate::parser::LoopMode::Loop => code.push_str(".loop"),
                crate::parser::LoopMode::PingPong => code.push_str(".pingPong"),
                crate::parser::LoopMode::Reverse => code.push_str(".reverse"),
                _ => code.push_str(".none"),
            }
        } else {
            code.push_str(".none");
        }
        code.push_str("\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_swift_shader(&self, shader: &crate::parser::extensions::ShaderDeclaration) -> GrumpResult<String> {
        let mut code = format!("// Shader: {}\n", shader.name);
        code.push_str("class ");
        code.push_str(&shader.name);
        code.push_str("Shader {\n");
        code.push_str("    let device: MTLDevice\n");
        code.push_str("    var pipelineState: MTLRenderPipelineState?\n");
        code.push_str("    \n");
        code.push_str("    init(device: MTLDevice) {\n");
        code.push_str("        self.device = device\n");
        code.push_str("        // TODO: Setup shader pipeline\n");
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_swift_behavior_tree(&self, bt: &crate::parser::extensions::BehaviorTreeDeclaration) -> GrumpResult<String> {
        let mut code = format!("// Behavior Tree: {}\n", bt.name);
        code.push_str("// TODO: Generate Swift behavior tree code\n");
        Ok(code)
    }
    
    fn generate_swift_function(&self, func: &crate::parser::FunctionDeclaration) -> GrumpResult<String> {
        let mut code = String::new();
        
        if func.is_async {
            code.push_str("func ");
            code.push_str(&func.name);
            code.push_str("(");
            // Generate parameters
            for (i, param) in func.params.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&param.name);
                if let Some(type_) = &param.type_ {
                    code.push_str(": ");
                    code.push_str(&self.swift_type(type_));
                }
            }
            code.push_str(") async throws");
        } else {
            code.push_str("func ");
            code.push_str(&func.name);
            code.push_str("(");
            for (i, param) in func.params.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&param.name);
                if let Some(type_) = &param.type_ {
                    code.push_str(": ");
                    code.push_str(&self.swift_type(type_));
                }
            }
            code.push_str(")");
        }
        
        if let Some(return_type) = &func.return_type {
            code.push_str(" -> ");
            code.push_str(&self.swift_type(return_type));
        }
        
        code.push_str(" {\n");
        for stmt in &func.body {
            code.push_str("    ");
            code.push_str(&self.generate_swift_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        
        Ok(code)
    }
    
    fn generate_swift_statement(&self, stmt: &crate::parser::Statement) -> GrumpResult<String> {
        match stmt {
            crate::parser::Statement::Let { name, type_, value } => {
                let mut code = String::new();
                code.push_str("let ");
                code.push_str(name);
                if let Some(type_) = type_ {
                    code.push_str(": ");
                    code.push_str(&self.swift_type(type_));
                }
                code.push_str(" = ");
                code.push_str(&self.generate_swift_expression(value)?);
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Assign { target, value } => {
                Ok(format!("{} = {};", 
                    self.generate_swift_expression(target)?,
                    self.generate_swift_expression(value)?
                ))
            }
            crate::parser::Statement::Return(expr) => {
                let mut code = String::new();
                code.push_str("return");
                if let Some(expr) = expr {
                    code.push_str(" ");
                    code.push_str(&self.generate_swift_expression(expr)?);
                }
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Expression(expr) => {
                Ok(format!("{};", self.generate_swift_expression(expr)?))
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("if ");
                code.push_str(&self.generate_swift_expression(condition)?);
                code.push_str(" {\n");
                for stmt in then {
                    code.push_str("        ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                if let Some(else_body) = else_ {
                    code.push_str(" else {\n");
                    for stmt in else_body {
                        code.push_str("        ");
                        code.push_str(&self.generate_swift_statement(stmt)?);
                        code.push_str("\n");
                    }
                    code.push_str("    }");
                }
                Ok(code)
            }
            crate::parser::Statement::Await { expr } => {
                Ok(format!("let _ = try await {};", self.generate_swift_expression(expr)?))
            }
            crate::parser::Statement::For { var, iter, body } => {
                let mut code = String::new();
                code.push_str("for ");
                code.push_str(var);
                code.push_str(" in ");
                code.push_str(&self.generate_swift_expression(iter)?);
                code.push_str(" {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::While { condition, body } => {
                let mut code = String::new();
                code.push_str("while ");
                code.push_str(&self.generate_swift_expression(condition)?);
                code.push_str(" {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::Break => {
                Ok("break;".to_string())
            }
            crate::parser::Statement::Continue => {
                Ok("continue;".to_string())
            }
            crate::parser::Statement::Animate(animate) => {
                let mut code = String::new();
                code.push_str("animate(");
                code.push_str(&self.generate_swift_expression(&animate.target)?);
                code.push_str(") {\n");
                if !animate.keyframes.is_empty() {
                    code.push_str("        keyframes: [\n");
                    for kf in &animate.keyframes {
                        code.push_str("            Keyframe(time: ");
                        code.push_str(&self.generate_swift_expression(&kf.time)?);
                        code.push_str(", value: ");
                        code.push_str(&self.generate_swift_expression(&kf.value)?);
                        code.push_str("),\n");
                    }
                    code.push_str("        ]\n");
                }
                if let Some(duration) = &animate.duration {
                    code.push_str("        duration: ");
                    code.push_str(&self.generate_swift_expression(duration)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::Match { expr, arms } => {
                let mut code = String::new();
                code.push_str("switch ");
                code.push_str(&self.generate_swift_expression(expr)?);
                code.push_str(" {\n");
                for arm in arms {
                    code.push_str("    case ");
                    code.push_str(&self.generate_swift_pattern(&arm.pattern)?);
                    if let Some(guard) = &arm.guard {
                        code.push_str(" where ");
                        code.push_str(&self.generate_swift_expression(guard)?);
                    }
                    code.push_str(":\n");
                    for stmt in &arm.body {
                        code.push_str("        ");
                        code.push_str(&self.generate_swift_statement(stmt)?);
                        code.push_str("\n");
                    }
                }
                code.push_str("}");
                Ok(code)
            }
            crate::parser::Statement::Timeline { name, entries } => {
                let mut code = format!("let {} = TimelineAnimation {{\n", name);
                code.push_str("    entries: [\n");
                for (time, properties) in entries {
                    code.push_str("        TimelineEntry(time: ");
                    code.push_str(&self.generate_swift_expression(&time)?);
                    code.push_str(", properties: [\n");
                    for (target, keyframes) in properties {
                        code.push_str("            Property(target: ");
                        code.push_str(&self.generate_swift_expression(&target)?);
                        code.push_str(", keyframes: [\n");
                        for (prop, value) in keyframes {
                            code.push_str("                (\"");
                            code.push_str(&prop);
                            code.push_str("\", ");
                            code.push_str(&self.generate_swift_expression(&value)?);
                            code.push_str("),\n");
                        }
                        code.push_str("            ]),\n");
                    }
                    code.push_str("        ]),\n");
                }
                code.push_str("    ]\n");
                code.push_str("}\n");
                Ok(code)
            }
            crate::parser::Statement::System { name, query, body } => {
                let mut code = format!("func {}() {{\n", name);
                if !query.is_empty() {
                    code.push_str("    let entities = world.query([");
                    for (i, comp) in query.iter().enumerate() {
                        if i > 0 { code.push_str(", "); }
                        code.push_str(comp);
                    }
                    code.push_str("])\n");
                }
                for stmt in body {
                    code.push_str("    ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("}\n\n");
                Ok(code)
            }
            _ => {
                Ok(format!("// TODO: Generate {}", format!("{:?}", stmt)))
            }
        }
    }
    
    fn generate_swift_pattern(&self, pattern: &crate::parser::Pattern) -> GrumpResult<String> {
        match pattern {
            crate::parser::Pattern::Literal(lit) => {
                Ok(self.swift_literal(lit))
            }
            crate::parser::Pattern::Identifier(name) => {
                Ok(name.clone())
            }
            crate::parser::Pattern::Wildcard => {
                Ok("_".to_string())
            }
            crate::parser::Pattern::Tuple(patterns) => {
                let mut code = String::new();
                code.push_str("(");
                for (i, p) in patterns.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_swift_pattern(p)?);
                }
                code.push_str(")");
                Ok(code)
            }
            _ => {
                Ok(format!("/* pattern: {:?} */", pattern))
            }
        }
    }
    
    fn generate_swift_expression(&self, expr: &crate::parser::Expression) -> GrumpResult<String> {
        match expr {
            crate::parser::Expression::Literal(lit) => {
                Ok(self.swift_literal(lit))
            }
            crate::parser::Expression::Identifier(name) => {
                Ok(name.clone())
            }
            crate::parser::Expression::Unary { op, expr } => {
                let expr_str = self.generate_swift_expression(expr)?;
                let op_str = match op {
                    crate::parser::UnaryOp::Neg => "-",
                    crate::parser::UnaryOp::Not => "!",
                    crate::parser::UnaryOp::Deref => "*",
                    crate::parser::UnaryOp::Ref => "&",
                    crate::parser::UnaryOp::MutRef => "&mut ",
                };
                Ok(format!("{}{}", op_str, expr_str))
            }
            crate::parser::Expression::Binary { op, left, right } => {
                let left_str = self.generate_swift_expression(left)?;
                let right_str = self.generate_swift_expression(right)?;
                let op_str = match op {
                    crate::parser::BinaryOp::Add => "+",
                    crate::parser::BinaryOp::Sub => "-",
                    crate::parser::BinaryOp::Mul => "*",
                    crate::parser::BinaryOp::Div => "/",
                    crate::parser::BinaryOp::Mod => "%",
                    crate::parser::BinaryOp::Eq => "==",
                    crate::parser::BinaryOp::Ne => "!=",
                    crate::parser::BinaryOp::Lt => "<",
                    crate::parser::BinaryOp::Gt => ">",
                    crate::parser::BinaryOp::Le => "<=",
                    crate::parser::BinaryOp::Ge => ">=",
                    crate::parser::BinaryOp::And => "&&",
                    crate::parser::BinaryOp::Or => "||",
                    crate::parser::BinaryOp::Xor => "^",
                    crate::parser::BinaryOp::ShiftLeft => "<<",
                    crate::parser::BinaryOp::ShiftRight => ">>",
                };
                Ok(format!("({} {} {})", left_str, op_str, right_str))
            }
            crate::parser::Expression::Call { func, args } => {
                let func_str = self.generate_swift_expression(func)?;
                let mut args_str = String::new();
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { args_str.push_str(", "); }
                    args_str.push_str(&self.generate_swift_expression(arg)?);
                }
                Ok(format!("{}({})", func_str, args_str))
            }
            crate::parser::Expression::Await(expr) => {
                Ok(format!("try await {}", self.generate_swift_expression(expr)?))
            }
            crate::parser::Expression::Array(elements) => {
                let mut code = String::new();
                code.push_str("[");
                for (i, elem) in elements.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_swift_expression(elem)?);
                }
                code.push_str("]");
                Ok(code)
            }
            crate::parser::Expression::Tuple(elements) => {
                let mut code = String::new();
                code.push_str("(");
                for (i, elem) in elements.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_swift_expression(elem)?);
                }
                code.push_str(")");
                Ok(code)
            }
            crate::parser::Expression::Index { object, index } => {
                Ok(format!("{}[{}]", 
                    self.generate_swift_expression(object)?,
                    self.generate_swift_expression(index)?
                ))
            }
            crate::parser::Expression::Lambda { params, body } => {
                let mut code = String::new();
                code.push_str("{ ");
                for (i, param) in params.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&param.name);
                    if let Some(type_) = &param.type_ {
                        code.push_str(": ");
                        code.push_str(&self.swift_type(type_));
                    }
                }
                code.push_str(" in ");
                code.push_str(&self.generate_swift_expression(body)?);
                code.push_str(" }");
                Ok(code)
            }
            crate::parser::Expression::Block(statements) => {
                let mut code = String::new();
                code.push_str("{\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("(");
                code.push_str(&self.generate_swift_expression(condition)?);
                code.push_str(") ? ");
                code.push_str(&self.generate_swift_expression(then)?);
                code.push_str(" : ");
                code.push_str(&self.generate_swift_expression(else_)?);
                Ok(code)
            }
            crate::parser::Expression::AsyncBlock(statements) => {
                let mut code = String::new();
                code.push_str("async {\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_swift_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::MacroCall { name, args } => {
                let mut code = format!("{}!", name);
                code.push_str("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_swift_expression(arg)?);
                }
                code.push_str(")");
                Ok(code)
            }
            _ => {
                Ok(format!("/* TODO: {}", format!("{:?}", expr)))
            }
        }
    }
    
    fn swift_literal(&self, lit: &crate::parser::Literal) -> String {
        match lit {
            crate::parser::Literal::Integer(n) => n.to_string(),
            crate::parser::Literal::Float(f) => f.to_string(),
            crate::parser::Literal::String(s) => format!("\"{}\"", s),
            crate::parser::Literal::Bool(b) => b.to_string(),
            crate::parser::Literal::Char(c) => format!("'{}'", c),
            crate::parser::Literal::Vec2 { x, y } => format!("SIMD2<Float>({}, {})", x, y),
            crate::parser::Literal::Vec3 { x, y, z } => format!("SIMD3<Float>({}, {}, {})", x, y, z),
            crate::parser::Literal::Color { r, g, b, a } => format!("Color(red: {}, green: {}, blue: {}, opacity: {})", r, g, b, a),
            _ => format!("/* {:?} */", lit),
        }
    }
    
    fn swift_type(&self, type_: &crate::parser::Type) -> String {
        match type_ {
            crate::parser::Type::Int => "Int".to_string(),
            crate::parser::Type::Float => "Float".to_string(),
            crate::parser::Type::Bool => "Bool".to_string(),
            crate::parser::Type::String => "String".to_string(),
            crate::parser::Type::Vec2 => "SIMD2<Float>".to_string(),
            crate::parser::Type::Vec3 => "SIMD3<Float>".to_string(),
            crate::parser::Type::Color => "Color".to_string(),
            crate::parser::Type::Optional(inner) => format!("{}?", self.swift_type(inner)),
            _ => format!("/* {:?} */", type_),
        }
    }
    
    fn generate_kotlin(&mut self, program: &Program) -> GrumpResult<String> {
        let mut output = String::new();
        output.push_str("// Generated Kotlin + OpenGL code from G-Rump\n");
        output.push_str("package com.grump.generated\n\n");
        output.push_str("import android.opengl.GLES20\n");
        output.push_str("import android.opengl.GLSurfaceView\n\n");
        
        // Generate code for each item
        for item in &program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    output.push_str(&self.generate_kotlin_function(func)?);
                }
                crate::parser::Item::Component(comp) => {
                    output.push_str(&self.generate_kotlin_component(comp)?);
                }
                crate::parser::Item::Entity(entity) => {
                    output.push_str(&self.generate_kotlin_entity(entity)?);
                }
                crate::parser::Item::System(system) => {
                    output.push_str(&self.generate_kotlin_system(system)?);
                }
                crate::parser::Item::App(app) => {
                    output.push_str(&self.generate_kotlin_app(app)?);
                }
                crate::parser::Item::Scene(scene) => {
                    output.push_str(&self.generate_kotlin_scene(scene)?);
                }
                crate::parser::Item::BehaviorTree(bt) => {
                    output.push_str(&self.generate_kotlin_behavior_tree(bt)?);
                }
                crate::parser::Item::Shader(shader) => {
                    output.push_str(&self.generate_kotlin_shader(shader)?);
                }
                _ => {
                    // Other items
                }
            }
        }
        
        Ok(output)
    }
    
    fn generate_kotlin_function(&self, func: &crate::parser::FunctionDeclaration) -> GrumpResult<String> {
        let mut code = String::new();
        
        if func.is_async {
            code.push_str("suspend fun ");
        } else {
            code.push_str("fun ");
        }
        code.push_str(&func.name);
        code.push_str("(");
        for (i, param) in func.params.iter().enumerate() {
            if i > 0 { code.push_str(", "); }
            code.push_str(&param.name);
            if let Some(type_) = &param.type_ {
                code.push_str(": ");
                code.push_str(&self.kotlin_type(type_));
            }
        }
        code.push_str(")");
        
        if let Some(return_type) = &func.return_type {
            code.push_str(": ");
            code.push_str(&self.kotlin_type(return_type));
        }
        
        code.push_str(" {\n");
        for stmt in &func.body {
            code.push_str("    ");
            code.push_str(&self.generate_kotlin_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        
        Ok(code)
    }
    
    fn generate_kotlin_statement(&self, stmt: &crate::parser::Statement) -> GrumpResult<String> {
        match stmt {
            crate::parser::Statement::Let { name, type_, value } => {
                let mut code = String::new();
                code.push_str("val ");
                code.push_str(name);
                if let Some(type_) = type_ {
                    code.push_str(": ");
                    code.push_str(&self.kotlin_type(type_));
                }
                code.push_str(" = ");
                code.push_str(&self.generate_kotlin_expression(value)?);
                Ok(code)
            }
            crate::parser::Statement::Assign { target, value } => {
                Ok(format!("{} = {}", 
                    self.generate_kotlin_expression(target)?,
                    self.generate_kotlin_expression(value)?
                ))
            }
            crate::parser::Statement::Return(expr) => {
                let mut code = String::new();
                code.push_str("return");
                if let Some(expr) = expr {
                    code.push_str(" ");
                    code.push_str(&self.generate_kotlin_expression(expr)?);
                }
                Ok(code)
            }
            crate::parser::Statement::Expression(expr) => {
                Ok(self.generate_kotlin_expression(expr)?)
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("if (");
                code.push_str(&self.generate_kotlin_expression(condition)?);
                code.push_str(") {\n");
                for stmt in then {
                    code.push_str("        ");
                    code.push_str(&self.generate_kotlin_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                if let Some(else_body) = else_ {
                    code.push_str(" else {\n");
                    for stmt in else_body {
                        code.push_str("        ");
                        code.push_str(&self.generate_kotlin_statement(stmt)?);
                        code.push_str("\n");
                    }
                    code.push_str("    }");
                }
                Ok(code)
            }
            crate::parser::Statement::Await { expr } => {
                Ok(format!("{}()", self.generate_kotlin_expression(expr)?))
            }
            crate::parser::Statement::For { var, iter, body } => {
                let mut code = String::new();
                code.push_str("for (");
                code.push_str(var);
                code.push_str(" in ");
                code.push_str(&self.generate_kotlin_expression(iter)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_kotlin_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::While { condition, body } => {
                let mut code = String::new();
                code.push_str("while (");
                code.push_str(&self.generate_kotlin_expression(condition)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_kotlin_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::Break => {
                Ok("break".to_string())
            }
            crate::parser::Statement::Continue => {
                Ok("continue".to_string())
            }
            crate::parser::Statement::Animate(animate) => {
                let mut code = String::new();
                code.push_str("animate(");
                code.push_str(&self.generate_kotlin_expression(&animate.target)?);
                code.push_str(") {\n");
                if !animate.keyframes.is_empty() {
                    code.push_str("        keyframes = listOf(\n");
                    for kf in &animate.keyframes {
                        code.push_str("            Keyframe(");
                        code.push_str(&self.generate_kotlin_expression(&kf.time)?);
                        code.push_str(", ");
                        code.push_str(&self.generate_kotlin_expression(&kf.value)?);
                        code.push_str("),\n");
                    }
                    code.push_str("        )\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            _ => {
                Ok(format!("// TODO: {}", format!("{:?}", stmt)))
            }
        }
    }
    
    fn generate_kotlin_expression(&self, expr: &crate::parser::Expression) -> GrumpResult<String> {
        match expr {
            crate::parser::Expression::Literal(lit) => {
                Ok(self.kotlin_literal(lit))
            }
            crate::parser::Expression::Identifier(name) => {
                Ok(name.clone())
            }
            crate::parser::Expression::Unary { op, expr } => {
                let expr_str = self.generate_kotlin_expression(expr)?;
                let op_str = match op {
                    crate::parser::UnaryOp::Neg => "-",
                    crate::parser::UnaryOp::Not => "!",
                    crate::parser::UnaryOp::Deref => "*",
                    crate::parser::UnaryOp::Ref => "&",
                    crate::parser::UnaryOp::MutRef => "&mut ",
                };
                Ok(format!("{}{}", op_str, expr_str))
            }
            crate::parser::Expression::Binary { op, left, right } => {
                let left_str = self.generate_kotlin_expression(left)?;
                let right_str = self.generate_kotlin_expression(right)?;
                let op_str = match op {
                    crate::parser::BinaryOp::Add => "+",
                    crate::parser::BinaryOp::Sub => "-",
                    crate::parser::BinaryOp::Mul => "*",
                    crate::parser::BinaryOp::Div => "/",
                    crate::parser::BinaryOp::Mod => "%",
                    crate::parser::BinaryOp::Eq => "==",
                    crate::parser::BinaryOp::Ne => "!=",
                    crate::parser::BinaryOp::Lt => "<",
                    crate::parser::BinaryOp::Gt => ">",
                    crate::parser::BinaryOp::Le => "<=",
                    crate::parser::BinaryOp::Ge => ">=",
                    crate::parser::BinaryOp::And => "&&",
                    crate::parser::BinaryOp::Or => "||",
                    _ => "/* unknown op */",
                };
                Ok(format!("({} {} {})", left_str, op_str, right_str))
            }
            crate::parser::Expression::Call { func, args } => {
                let func_str = self.generate_kotlin_expression(func)?;
                let mut args_str = String::new();
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { args_str.push_str(", "); }
                    args_str.push_str(&self.generate_kotlin_expression(arg)?);
                }
                Ok(format!("{}({})", func_str, args_str))
            }
            crate::parser::Expression::Array(elements) => {
                let mut code = String::new();
                code.push_str("listOf(");
                for (i, elem) in elements.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_kotlin_expression(elem)?);
                }
                code.push_str(")");
                Ok(code)
            }
            crate::parser::Expression::Index { object, index } => {
                Ok(format!("{}[{}]", 
                    self.generate_kotlin_expression(object)?,
                    self.generate_kotlin_expression(index)?
                ))
            }
            crate::parser::Expression::Lambda { params, body } => {
                let mut code = String::new();
                code.push_str("{ ");
                for (i, param) in params.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&param.name);
                    if let Some(type_) = &param.type_ {
                        code.push_str(": ");
                        code.push_str(&self.kotlin_type(type_));
                    }
                }
                code.push_str(" -> ");
                code.push_str(&self.generate_kotlin_expression(body)?);
                code.push_str(" }");
                Ok(code)
            }
            crate::parser::Expression::Block(statements) => {
                let mut code = String::new();
                code.push_str("{\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_kotlin_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("if (");
                code.push_str(&self.generate_kotlin_expression(condition)?);
                code.push_str(") ");
                code.push_str(&self.generate_kotlin_expression(then)?);
                code.push_str(" else ");
                code.push_str(&self.generate_kotlin_expression(else_)?);
                Ok(code)
            }
            crate::parser::Expression::AsyncBlock(statements) => {
                let mut code = String::new();
                code.push_str("async {\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_kotlin_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::MacroCall { name, args } => {
                let mut code = format!("{}!", name);
                code.push_str("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_kotlin_expression(arg)?);
                }
                code.push_str(")");
                Ok(code)
            }
            _ => {
                Ok(format!("/* TODO: {}", format!("{:?}", expr)))
            }
        }
    }
    
    fn kotlin_literal(&self, lit: &crate::parser::Literal) -> String {
        match lit {
            crate::parser::Literal::Integer(n) => n.to_string(),
            crate::parser::Literal::Float(f) => f.to_string(),
            crate::parser::Literal::String(s) => format!("\"{}\"", s),
            crate::parser::Literal::Bool(b) => b.to_string(),
            crate::parser::Literal::Char(c) => format!("'{}'", c),
            crate::parser::Literal::Vec2 { x, y } => format!("Vector2({}f, {}f)", x, y),
            crate::parser::Literal::Vec3 { x, y, z } => format!("Vector3({}f, {}f, {}f)", x, y, z),
            _ => format!("/* {:?} */", lit),
        }
    }
    
    fn generate_kotlin_shader(&self, shader: &crate::parser::extensions::ShaderDeclaration) -> GrumpResult<String> {
        let mut code = format!("// Shader: {}\n", shader.name);
        code.push_str("// TODO: Generate GLSL shader code\n");
        Ok(code)
    }
    
    fn kotlin_type(&self, type_: &crate::parser::Type) -> String {
        match type_ {
            crate::parser::Type::Int => "Int".to_string(),
            crate::parser::Type::Float => "Float".to_string(),
            crate::parser::Type::Bool => "Boolean".to_string(),
            crate::parser::Type::String => "String".to_string(),
            crate::parser::Type::Vec2 => "Vector2".to_string(),
            crate::parser::Type::Vec3 => "Vector3".to_string(),
            crate::parser::Type::Optional(inner) => format!("{}?", self.kotlin_type(inner)),
            _ => format!("/* {:?} */", type_),
        }
    }
    
    fn generate_kotlin_component(&self, comp: &crate::parser::ComponentDeclaration) -> GrumpResult<String> {
        let mut code = format!("data class {} (\n", comp.name);
        for (i, field) in comp.fields.iter().enumerate() {
            if i > 0 { code.push_str(",\n"); }
            code.push_str("    val ");
            code.push_str(&field.name);
            code.push_str(": ");
            code.push_str(&self.kotlin_type(&field.type_));
            if let Some(default) = &field.default {
                code.push_str(" = ");
                code.push_str(&self.generate_kotlin_expression(default)?);
            }
        }
        code.push_str("\n)\n\n");
        Ok(code)
    }
    
    fn generate_kotlin_entity(&self, entity: &crate::parser::EntityDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", entity.name);
        for comp in &entity.components {
            code.push_str("    var ");
            code.push_str(&comp.name);
            code.push_str(": Component\n");
        }
        code.push_str("    \n");
        code.push_str("    constructor() {\n");
        for comp in &entity.components {
            code.push_str("        this.");
            code.push_str(&comp.name);
            code.push_str(" = ");
            code.push_str(&comp.name);
            code.push_str("(");
            for (i, arg) in comp.args.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&self.generate_kotlin_expression(arg)?);
            }
            code.push_str(")\n");
        }
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_kotlin_app(&self, app: &crate::parser::AppDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", app.name);
        code.push_str("    fun start() {\n");
        code.push_str("        // App initialization\n");
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_kotlin_scene(&self, scene: &crate::parser::SceneDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", scene.name);
        for stmt in &scene.body {
            code.push_str("    ");
            code.push_str(&self.generate_kotlin_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_kotlin_behavior_tree(&self, bt: &crate::parser::extensions::BehaviorTreeDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", bt.name);
        code.push_str("    fun execute(): Boolean {\n");
        code.push_str("        // Behavior tree logic\n");
        code.push_str("        return true\n");
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript(&mut self, program: &Program) -> GrumpResult<String> {
        let mut output = String::new();
        output.push_str("// Generated JavaScript + WebGL code from G-Rump\n");
        
        // Generate code for each item
        for item in &program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    output.push_str(&self.generate_javascript_function(func)?);
                }
                crate::parser::Item::Component(comp) => {
                    output.push_str(&self.generate_javascript_component(comp)?);
                }
                crate::parser::Item::Entity(entity) => {
                    output.push_str(&self.generate_javascript_entity(entity)?);
                }
                crate::parser::Item::System(system) => {
                    output.push_str(&self.generate_javascript_system(system)?);
                }
                crate::parser::Item::App(app) => {
                    output.push_str(&self.generate_javascript_app(app)?);
                }
                crate::parser::Item::Scene(scene) => {
                    output.push_str(&self.generate_javascript_scene(scene)?);
                }
                crate::parser::Item::BehaviorTree(bt) => {
                    output.push_str(&self.generate_javascript_behavior_tree(bt)?);
                }
                crate::parser::Item::Shader(shader) => {
                    output.push_str(&self.generate_javascript_shader(shader)?);
                }
                _ => {
                    // Other items
                }
            }
        }
        
        Ok(output)
    }
    
    fn generate_javascript_function(&self, func: &crate::parser::FunctionDeclaration) -> GrumpResult<String> {
        let mut code = String::new();
        
        if func.is_async {
            code.push_str("async function ");
        } else {
            code.push_str("function ");
        }
        code.push_str(&func.name);
        code.push_str("(");
        for (i, param) in func.params.iter().enumerate() {
            if i > 0 { code.push_str(", "); }
            code.push_str(&param.name);
        }
        code.push_str(") {\n");
        for stmt in &func.body {
            code.push_str("    ");
            code.push_str(&self.generate_javascript_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_statement(&self, stmt: &crate::parser::Statement) -> GrumpResult<String> {
        match stmt {
            crate::parser::Statement::Let { name, type_, value } => {
                let mut code = String::new();
                code.push_str("let ");
                code.push_str(name);
                code.push_str(" = ");
                code.push_str(&self.generate_javascript_expression(value)?);
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Assign { target, value } => {
                Ok(format!("{} = {};", 
                    self.generate_javascript_expression(target)?,
                    self.generate_javascript_expression(value)?
                ))
            }
            crate::parser::Statement::Return(expr) => {
                let mut code = String::new();
                code.push_str("return");
                if let Some(expr) = expr {
                    code.push_str(" ");
                    code.push_str(&self.generate_javascript_expression(expr)?);
                }
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Expression(expr) => {
                Ok(format!("{};", self.generate_javascript_expression(expr)?))
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("if (");
                code.push_str(&self.generate_javascript_expression(condition)?);
                code.push_str(") {\n");
                for stmt in then {
                    code.push_str("        ");
                    code.push_str(&self.generate_javascript_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                if let Some(else_body) = else_ {
                    code.push_str(" else {\n");
                    for stmt in else_body {
                        code.push_str("        ");
                        code.push_str(&self.generate_javascript_statement(stmt)?);
                        code.push_str("\n");
                    }
                    code.push_str("    }");
                }
                Ok(code)
            }
            crate::parser::Statement::Await { expr } => {
                Ok(format!("await {};", self.generate_javascript_expression(expr)?))
            }
            crate::parser::Statement::For { var, iter, body } => {
                let mut code = String::new();
                code.push_str("for (let ");
                code.push_str(var);
                code.push_str(" of ");
                code.push_str(&self.generate_javascript_expression(iter)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_javascript_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::While { condition, body } => {
                let mut code = String::new();
                code.push_str("while (");
                code.push_str(&self.generate_javascript_expression(condition)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_javascript_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::Break => {
                Ok("break;".to_string())
            }
            crate::parser::Statement::Continue => {
                Ok("continue;".to_string())
            }
            crate::parser::Statement::Animate(animate) => {
                let mut code = String::new();
                code.push_str("animate(");
                code.push_str(&self.generate_javascript_expression(&animate.target)?);
                code.push_str(", {\n");
                if !animate.keyframes.is_empty() {
                    code.push_str("    keyframes: [\n");
                    for kf in &animate.keyframes {
                        code.push_str("        { time: ");
                        code.push_str(&self.generate_javascript_expression(&kf.time)?);
                        code.push_str(", value: ");
                        code.push_str(&self.generate_javascript_expression(&kf.value)?);
                        code.push_str(" },\n");
                    }
                    code.push_str("    ]\n");
                }
                code.push_str("});");
                Ok(code)
            }
            _ => {
                Ok(format!("// TODO: {}", format!("{:?}", stmt)))
            }
        }
    }
    
    fn generate_javascript_expression(&self, expr: &crate::parser::Expression) -> GrumpResult<String> {
        match expr {
            crate::parser::Expression::Literal(lit) => {
                Ok(self.javascript_literal(lit))
            }
            crate::parser::Expression::Identifier(name) => {
                Ok(name.clone())
            }
            crate::parser::Expression::Unary { op, expr } => {
                let expr_str = self.generate_javascript_expression(expr)?;
                let op_str = match op {
                    crate::parser::UnaryOp::Neg => "-",
                    crate::parser::UnaryOp::Not => "!",
                    crate::parser::UnaryOp::Deref => "*",
                    crate::parser::UnaryOp::Ref => "&",
                    crate::parser::UnaryOp::MutRef => "&mut ",
                };
                Ok(format!("{}{}", op_str, expr_str))
            }
            crate::parser::Expression::Binary { op, left, right } => {
                let left_str = self.generate_javascript_expression(left)?;
                let right_str = self.generate_javascript_expression(right)?;
                let op_str = match op {
                    crate::parser::BinaryOp::Add => "+",
                    crate::parser::BinaryOp::Sub => "-",
                    crate::parser::BinaryOp::Mul => "*",
                    crate::parser::BinaryOp::Div => "/",
                    crate::parser::BinaryOp::Mod => "%",
                    crate::parser::BinaryOp::Eq => "===",
                    crate::parser::BinaryOp::Ne => "!==",
                    crate::parser::BinaryOp::Lt => "<",
                    crate::parser::BinaryOp::Gt => ">",
                    crate::parser::BinaryOp::Le => "<=",
                    crate::parser::BinaryOp::Ge => ">=",
                    crate::parser::BinaryOp::And => "&&",
                    crate::parser::BinaryOp::Or => "||",
                    crate::parser::BinaryOp::Xor => "^",
                    crate::parser::BinaryOp::ShiftLeft => "<<",
                    crate::parser::BinaryOp::ShiftRight => ">>",
                };
                Ok(format!("({} {} {})", left_str, op_str, right_str))
            }
            crate::parser::Expression::Call { func, args } => {
                let func_str = self.generate_javascript_expression(func)?;
                let mut args_str = String::new();
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { args_str.push_str(", "); }
                    args_str.push_str(&self.generate_javascript_expression(arg)?);
                }
                Ok(format!("{}({})", func_str, args_str))
            }
            crate::parser::Expression::Await(expr) => {
                Ok(format!("await {}", self.generate_javascript_expression(expr)?))
            }
            crate::parser::Expression::Array(elements) => {
                let mut code = String::new();
                code.push_str("[");
                for (i, elem) in elements.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_javascript_expression(elem)?);
                }
                code.push_str("]");
                Ok(code)
            }
            crate::parser::Expression::Index { object, index } => {
                Ok(format!("{}[{}]", 
                    self.generate_javascript_expression(object)?,
                    self.generate_javascript_expression(index)?
                ))
            }
            crate::parser::Expression::Lambda { params, body } => {
                let mut code = String::new();
                code.push_str("(");
                for (i, param) in params.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&param.name);
                }
                code.push_str(") => ");
                code.push_str(&self.generate_javascript_expression(body)?);
                Ok(code)
            }
            crate::parser::Expression::Block(statements) => {
                let mut code = String::new();
                code.push_str("{\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_javascript_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("(");
                code.push_str(&self.generate_javascript_expression(condition)?);
                code.push_str(") ? ");
                code.push_str(&self.generate_javascript_expression(then)?);
                code.push_str(" : ");
                code.push_str(&self.generate_javascript_expression(else_)?);
                Ok(code)
            }
            crate::parser::Expression::AsyncBlock(statements) => {
                let mut code = String::new();
                code.push_str("(async () => {\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_javascript_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    })()");
                Ok(code)
            }
            crate::parser::Expression::MacroCall { name, args } => {
                let mut code = format!("{}!", name);
                code.push_str("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_javascript_expression(arg)?);
                }
                code.push_str(")");
                Ok(code)
            }
            _ => {
                Ok(format!("/* TODO: {}", format!("{:?}", expr)))
            }
        }
    }
    
    fn javascript_literal(&self, lit: &crate::parser::Literal) -> String {
        match lit {
            crate::parser::Literal::Integer(n) => n.to_string(),
            crate::parser::Literal::Float(f) => f.to_string(),
            crate::parser::Literal::String(s) => format!("\"{}\"", s),
            crate::parser::Literal::Bool(b) => b.to_string(),
            crate::parser::Literal::Char(c) => format!("'{}'", c),
            crate::parser::Literal::Vec2 { x, y } => format!("new Vec2({}, {})", x, y),
            crate::parser::Literal::Vec3 { x, y, z } => format!("new Vec3({}, {}, {})", x, y, z),
            _ => format!("/* {:?} */", lit),
        }
    }
    
    fn generate_javascript_shader(&self, shader: &crate::parser::extensions::ShaderDeclaration) -> GrumpResult<String> {
        let mut code = format!("// Shader: {}\n", shader.name);
        code.push_str("// TODO: Generate WebGL shader code\n");
        Ok(code)
    }
    
    fn generate_javascript_component(&self, comp: &crate::parser::ComponentDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", comp.name);
        code.push_str("    constructor(");
        for (i, field) in comp.fields.iter().enumerate() {
            if i > 0 { code.push_str(", "); }
            code.push_str(&field.name);
            if let Some(default) = &field.default {
                code.push_str(" = ");
                code.push_str(&self.generate_javascript_expression(default)?);
            }
        }
        code.push_str(") {\n");
        for field in &comp.fields {
            code.push_str("        this.");
            code.push_str(&field.name);
            code.push_str(" = ");
            code.push_str(&field.name);
            code.push_str(";\n");
        }
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_entity(&self, entity: &crate::parser::EntityDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", entity.name);
        code.push_str("    constructor() {\n");
        for comp in &entity.components {
            code.push_str("        this.");
            code.push_str(&comp.name);
            code.push_str(" = new ");
            code.push_str(&comp.name);
            code.push_str("(");
            for (i, arg) in comp.args.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&self.generate_javascript_expression(arg)?);
            }
            code.push_str(");\n");
        }
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_system(&self, system: &crate::parser::SystemDeclaration) -> GrumpResult<String> {
        let mut code = format!("function {}() {{\n", system.name);
        if !system.query.is_empty() {
            code.push_str("    const entities = world.query([");
            for (i, comp) in system.query.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&format!("\"{}\"", comp));
            }
            code.push_str("]);\n");
            code.push_str("    for (const entity of entities) {\n");
            for stmt in &system.body {
                code.push_str("        ");
                code.push_str(&self.generate_javascript_statement(stmt)?);
                code.push_str("\n");
            }
            code.push_str("    }\n");
        } else {
            for stmt in &system.body {
                code.push_str("    ");
                code.push_str(&self.generate_javascript_statement(stmt)?);
                code.push_str("\n");
            }
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_app(&self, app: &crate::parser::AppDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", app.name);
        code.push_str("    start() {\n");
        code.push_str("        // App initialization\n");
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_scene(&self, scene: &crate::parser::SceneDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", scene.name);
        for stmt in &scene.body {
            code.push_str("    ");
            code.push_str(&self.generate_javascript_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_javascript_behavior_tree(&self, bt: &crate::parser::extensions::BehaviorTreeDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", bt.name);
        code.push_str("    execute() {\n");
        code.push_str("        // Behavior tree logic\n");
        code.push_str("        return true;\n");
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_dart(&mut self, program: &Program) -> GrumpResult<String> {
        let mut output = String::new();
        output.push_str("// Generated Dart + Skia code from G-Rump\n");
        output.push_str("import 'package:flutter/material.dart';\n");
        output.push_str("import 'package:skia/skia.dart' as skia;\n\n");
        
        // Generate code for each item
        for item in &program.items {
            match item {
                crate::parser::Item::Function(func) => {
                    output.push_str(&self.generate_dart_function(func)?);
                }
                crate::parser::Item::Component(comp) => {
                    output.push_str(&self.generate_dart_component(comp)?);
                }
                crate::parser::Item::Entity(entity) => {
                    output.push_str(&self.generate_dart_entity(entity)?);
                }
                crate::parser::Item::System(system) => {
                    output.push_str(&self.generate_dart_system(system)?);
                }
                crate::parser::Item::App(app) => {
                    output.push_str(&self.generate_dart_app(app)?);
                }
                crate::parser::Item::Scene(scene) => {
                    output.push_str(&self.generate_dart_scene(scene)?);
                }
                crate::parser::Item::BehaviorTree(bt) => {
                    output.push_str(&self.generate_dart_behavior_tree(bt)?);
                }
                _ => {
                    // Other items
                }
            }
        }
        
        Ok(output)
    }
    
    fn generate_dart_function(&self, func: &crate::parser::FunctionDeclaration) -> GrumpResult<String> {
        let mut code = String::new();
        
        if func.is_async {
            code.push_str("Future<void> ");
        } else {
            code.push_str("void ");
        }
        code.push_str(&func.name);
        code.push_str("(");
        for (i, param) in func.params.iter().enumerate() {
            if i > 0 { code.push_str(", "); }
            code.push_str(&param.name);
            if let Some(type_) = &param.type_ {
                code.push_str(" ");
                code.push_str(&self.dart_type(type_));
            }
        }
        code.push_str(") ");
        
        if func.is_async {
            code.push_str("async ");
        }
        
        code.push_str("{\n");
        for stmt in &func.body {
            code.push_str("    ");
            code.push_str(&self.generate_dart_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        
        Ok(code)
    }
    
    fn generate_dart_statement(&self, stmt: &crate::parser::Statement) -> GrumpResult<String> {
        match stmt {
            crate::parser::Statement::Let { name, type_, value } => {
                let mut code = String::new();
                if let Some(type_) = type_ {
                    code.push_str(&format!("{} ", self.dart_type(type_)));
                } else {
                    code.push_str("var ");
                }
                code.push_str(name);
                code.push_str(" = ");
                code.push_str(&self.generate_dart_expression(value)?);
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Return(expr) => {
                let mut code = String::new();
                code.push_str("return");
                if let Some(expr) = expr {
                    code.push_str(" ");
                    code.push_str(&self.generate_dart_expression(expr)?);
                }
                code.push_str(";");
                Ok(code)
            }
            crate::parser::Statement::Expression(expr) => {
                Ok(format!("{};", self.generate_dart_expression(expr)?))
            }
            crate::parser::Statement::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("if (");
                code.push_str(&self.generate_dart_expression(condition)?);
                code.push_str(") {\n");
                for stmt in then {
                    code.push_str("        ");
                    code.push_str(&self.generate_dart_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                if let Some(else_body) = else_ {
                    code.push_str(" else {\n");
                    for stmt in else_body {
                        code.push_str("        ");
                        code.push_str(&self.generate_dart_statement(stmt)?);
                        code.push_str("\n");
                    }
                    code.push_str("    }");
                }
                Ok(code)
            }
            crate::parser::Statement::Await { expr } => {
                Ok(format!("await {};", self.generate_dart_expression(expr)?))
            }
            crate::parser::Statement::For { var, iter, body } => {
                let mut code = String::new();
                code.push_str("for (var ");
                code.push_str(var);
                code.push_str(" in ");
                code.push_str(&self.generate_dart_expression(iter)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_dart_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::While { condition, body } => {
                let mut code = String::new();
                code.push_str("while (");
                code.push_str(&self.generate_dart_expression(condition)?);
                code.push_str(") {\n");
                for stmt in body {
                    code.push_str("        ");
                    code.push_str(&self.generate_dart_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Statement::Break => {
                Ok("break;".to_string())
            }
            crate::parser::Statement::Continue => {
                Ok("continue;".to_string())
            }
            crate::parser::Statement::Animate(animate) => {
                let mut code = String::new();
                code.push_str("animate(");
                code.push_str(&self.generate_dart_expression(&animate.target)?);
                code.push_str(", [\n");
                for kf in &animate.keyframes {
                    code.push_str("        Keyframe(");
                    code.push_str(&self.generate_dart_expression(&kf.time)?);
                    code.push_str(", ");
                    code.push_str(&self.generate_dart_expression(&kf.value)?);
                    code.push_str("),\n");
                }
                code.push_str("    ]);");
                Ok(code)
            }
            _ => {
                Ok(format!("// TODO: {}", format!("{:?}", stmt)))
            }
        }
    }
    
    fn generate_dart_expression(&self, expr: &crate::parser::Expression) -> GrumpResult<String> {
        match expr {
            crate::parser::Expression::Literal(lit) => {
                Ok(self.dart_literal(lit))
            }
            crate::parser::Expression::Identifier(name) => {
                Ok(name.clone())
            }
            crate::parser::Expression::Unary { op, expr } => {
                let expr_str = self.generate_dart_expression(expr)?;
                let op_str = match op {
                    crate::parser::UnaryOp::Neg => "-",
                    crate::parser::UnaryOp::Not => "!",
                    crate::parser::UnaryOp::Deref => "*",
                    crate::parser::UnaryOp::Ref => "&",
                    crate::parser::UnaryOp::MutRef => "&mut ",
                };
                Ok(format!("{}{}", op_str, expr_str))
            }
            crate::parser::Expression::Binary { op, left, right } => {
                let left_str = self.generate_dart_expression(left)?;
                let right_str = self.generate_dart_expression(right)?;
                let op_str = match op {
                    crate::parser::BinaryOp::Add => "+",
                    crate::parser::BinaryOp::Sub => "-",
                    crate::parser::BinaryOp::Mul => "*",
                    crate::parser::BinaryOp::Div => "/",
                    crate::parser::BinaryOp::Mod => "%",
                    crate::parser::BinaryOp::Eq => "==",
                    crate::parser::BinaryOp::Ne => "!=",
                    crate::parser::BinaryOp::Lt => "<",
                    crate::parser::BinaryOp::Gt => ">",
                    crate::parser::BinaryOp::Le => "<=",
                    crate::parser::BinaryOp::Ge => ">=",
                    crate::parser::BinaryOp::And => "&&",
                    crate::parser::BinaryOp::Or => "||",
                    crate::parser::BinaryOp::Xor => "^",
                    crate::parser::BinaryOp::ShiftLeft => "<<",
                    crate::parser::BinaryOp::ShiftRight => ">>",
                };
                Ok(format!("({} {} {})", left_str, op_str, right_str))
            }
            crate::parser::Expression::Call { func, args } => {
                let func_str = self.generate_dart_expression(func)?;
                let mut args_str = String::new();
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { args_str.push_str(", "); }
                    args_str.push_str(&self.generate_dart_expression(arg)?);
                }
                Ok(format!("{}({})", func_str, args_str))
            }
            crate::parser::Expression::Array(elements) => {
                let mut code = String::new();
                code.push_str("[");
                for (i, elem) in elements.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_dart_expression(elem)?);
                }
                code.push_str("]");
                Ok(code)
            }
            crate::parser::Expression::Index { object, index } => {
                Ok(format!("{}[{}]", 
                    self.generate_dart_expression(object)?,
                    self.generate_dart_expression(index)?
                ))
            }
            crate::parser::Expression::Lambda { params, body } => {
                let mut code = String::new();
                code.push_str("(");
                for (i, param) in params.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&param.name);
                    if let Some(type_) = &param.type_ {
                        code.push_str(": ");
                        code.push_str(&self.dart_type(type_));
                    }
                }
                code.push_str(") => ");
                code.push_str(&self.generate_dart_expression(body)?);
                Ok(code)
            }
            crate::parser::Expression::Block(statements) => {
                let mut code = String::new();
                code.push_str("{\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_dart_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    }");
                Ok(code)
            }
            crate::parser::Expression::If { condition, then, else_ } => {
                let mut code = String::new();
                code.push_str("(");
                code.push_str(&self.generate_dart_expression(condition)?);
                code.push_str(") ? ");
                code.push_str(&self.generate_dart_expression(then)?);
                code.push_str(" : ");
                code.push_str(&self.generate_dart_expression(else_)?);
                Ok(code)
            }
            crate::parser::Expression::AsyncBlock(statements) => {
                let mut code = String::new();
                code.push_str("(() async {\n");
                for stmt in statements {
                    code.push_str("        ");
                    code.push_str(&self.generate_dart_statement(stmt)?);
                    code.push_str("\n");
                }
                code.push_str("    })()");
                Ok(code)
            }
            crate::parser::Expression::MacroCall { name, args } => {
                let mut code = format!("{}!", name);
                code.push_str("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 { code.push_str(", "); }
                    code.push_str(&self.generate_dart_expression(arg)?);
                }
                code.push_str(")");
                Ok(code)
            }
            _ => {
                Ok(format!("/* TODO: {}", format!("{:?}", expr)))
            }
        }
    }
    
    fn dart_literal(&self, lit: &crate::parser::Literal) -> String {
        match lit {
            crate::parser::Literal::Integer(n) => n.to_string(),
            crate::parser::Literal::Float(f) => f.to_string(),
            crate::parser::Literal::String(s) => format!("\"{}\"", s),
            crate::parser::Literal::Bool(b) => b.to_string(),
            crate::parser::Literal::Char(c) => format!("'{}'", c),
            crate::parser::Literal::Vec2 { x, y } => format!("Offset({}, {})", x, y),
            crate::parser::Literal::Vec3 { x, y, z } => format!("Vector3({}, {}, {})", x, y, z),
            _ => format!("/* {:?} */", lit),
        }
    }
    
    fn dart_type(&self, type_: &crate::parser::Type) -> String {
        match type_ {
            crate::parser::Type::Int => "int".to_string(),
            crate::parser::Type::Float => "double".to_string(),
            crate::parser::Type::Bool => "bool".to_string(),
            crate::parser::Type::String => "String".to_string(),
            crate::parser::Type::Vec2 => "Offset".to_string(),
            crate::parser::Type::Vec3 => "Vector3".to_string(),
            crate::parser::Type::Optional(inner) => format!("{}?", self.dart_type(inner)),
            _ => format!("/* {:?} */", type_),
        }
    }
    
    fn generate_swift_component(&self, comp: &crate::parser::ComponentDeclaration) -> GrumpResult<String> {
        let mut code = format!("struct {} {{\n", comp.name);
        for field in &comp.fields {
            code.push_str("    var ");
            code.push_str(&field.name);
            code.push_str(": ");
            code.push_str(&self.swift_type(&field.type_));
            if let Some(default) = &field.default {
                code.push_str(" = ");
                code.push_str(&self.generate_swift_expression(default)?);
            }
            code.push_str("\n");
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_swift_entity(&self, entity: &crate::parser::EntityDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", entity.name);
        for comp in &entity.components {
            code.push_str("    var ");
            code.push_str(&comp.name);
            code.push_str(": Component\n");
        }
        code.push_str("    \n");
        code.push_str("    init() {\n");
        for comp in &entity.components {
            code.push_str("        self.");
            code.push_str(&comp.name);
            code.push_str(" = ");
            code.push_str(&comp.name);
            code.push_str("(");
            for (i, arg) in comp.args.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&self.generate_swift_expression(arg)?);
            }
            code.push_str(")\n");
        }
        code.push_str("    }\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_dart_component(&self, comp: &crate::parser::ComponentDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", comp.name);
        for field in &comp.fields {
            code.push_str("    ");
            code.push_str(&self.dart_type(&field.type_));
            code.push_str(" ");
            code.push_str(&field.name);
            if let Some(default) = &field.default {
                code.push_str(" = ");
                code.push_str(&self.generate_dart_expression(default)?);
            }
            code.push_str(";\n");
        }
        code.push_str("    \n");
        code.push_str("    {}(", comp.name);
        for (i, field) in comp.fields.iter().enumerate() {
            if i > 0 { code.push_str(", "); }
            code.push_str(&self.dart_type(&field.type_));
            code.push_str(" this.");
            code.push_str(&field.name);
        }
        code.push_str(");\n");
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_dart_entity(&self, entity: &crate::parser::EntityDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", entity.name);
        for comp in &entity.components {
            code.push_str("    ");
            code.push_str(&comp.name);
            code.push_str(" ");
            code.push_str(&comp.name);
            code.push_str(";\n");
        }
        code.push_str("    \n");
        code.push_str("    {}() {{\n", entity.name);
        for comp in &entity.components {
            code.push_str("        this.");
            code.push_str(&comp.name);
            code.push_str(" = ");
            code.push_str(&comp.name);
            code.push_str("(");
            for (i, arg) in comp.args.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&self.generate_dart_expression(arg)?);
            }
            code.push_str(");\n");
        }
        code.push_str("    }}\n");
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_dart_system(&self, system: &crate::parser::SystemDeclaration) -> GrumpResult<String> {
        let mut code = format!("void {}() {{\n", system.name);
        if !system.query.is_empty() {
            code.push_str("    final entities = world.query([");
            for (i, comp) in system.query.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(&format!("\"{}\"", comp));
            }
            code.push_str("]);\n");
            code.push_str("    for (final entity in entities) {{\n");
            for stmt in &system.body {
                code.push_str("        ");
                code.push_str(&self.generate_dart_statement(stmt)?);
                code.push_str("\n");
            }
            code.push_str("    }}\n");
        } else {
            for stmt in &system.body {
                code.push_str("    ");
                code.push_str(&self.generate_dart_statement(stmt)?);
                code.push_str("\n");
            }
        }
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_swift_app(&self, app: &crate::parser::AppDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", app.name);
        for item in &app.body {
            if let crate::parser::Item::Scene(scene) = item {
                code.push_str("    var {}: {}\n", scene.name, scene.name);
            }
        }
        code.push_str("    \n");
        code.push_str("    func start() {{\n");
        code.push_str("        // App initialization\n");
        code.push_str("    }}\n");
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_swift_scene(&self, scene: &crate::parser::SceneDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", scene.name);
        for stmt in &scene.body {
            code.push_str("    ");
            code.push_str(&self.generate_swift_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_swift_behavior_tree(&self, bt: &crate::parser::extensions::BehaviorTreeDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", bt.name);
        code.push_str("    func execute() -> Bool {{\n");
        code.push_str("        // Behavior tree logic\n");
        code.push_str("        return true\n");
        code.push_str("    }}\n");
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_kotlin_system(&self, system: &crate::parser::SystemDeclaration) -> GrumpResult<String> {
        let mut code = format!("fun {}() {{\n", system.name);
        if !system.query.is_empty() {
            code.push_str("    val entities = world.query(listOf(");
            for (i, comp) in system.query.iter().enumerate() {
                if i > 0 { code.push_str(", "); }
                code.push_str(comp);
            }
            code.push_str("))\n");
            code.push_str("    for (entity in entities) {\n");
            for stmt in &system.body {
                code.push_str("        ");
                code.push_str(&self.generate_kotlin_statement(stmt)?);
                code.push_str("\n");
            }
            code.push_str("    }\n");
        } else {
            for stmt in &system.body {
                code.push_str("    ");
                code.push_str(&self.generate_kotlin_statement(stmt)?);
                code.push_str("\n");
            }
        }
        code.push_str("}\n\n");
        Ok(code)
    }
    
    fn generate_dart_app(&self, app: &crate::parser::AppDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", app.name);
        code.push_str("    void start() {{\n");
        code.push_str("        // App initialization\n");
        code.push_str("    }}\n");
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_dart_scene(&self, scene: &crate::parser::SceneDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", scene.name);
        for stmt in &scene.body {
            code.push_str("    ");
            code.push_str(&self.generate_dart_statement(stmt)?);
            code.push_str("\n");
        }
        code.push_str("}}\n\n");
        Ok(code)
    }
    
    fn generate_dart_behavior_tree(&self, bt: &crate::parser::extensions::BehaviorTreeDeclaration) -> GrumpResult<String> {
        let mut code = format!("class {} {{\n", bt.name);
        code.push_str("    bool execute() {{\n");
        code.push_str("        // Behavior tree logic\n");
        code.push_str("        return true;\n");
        code.push_str("    }}\n");
        code.push_str("}}\n\n");
        Ok(code)
    }
}

