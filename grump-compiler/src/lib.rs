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

use wasm_bindgen::prelude::*;

#[cfg(feature = "console_error_panic_hook")]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct CompilationResult {
    pub success: bool,
    pub output: Option<String>,
    pub error: Option<String>,
}

#[wasm_bindgen]
pub fn compile_code_wasm(source_code: &str, target: &str) -> JsValue {
    #[cfg(feature = "console_error_panic_hook")]
    set_panic_hook();

    let result = compile_internal(source_code, target);
    
    // Serialize to JsValue
    serde_wasm_bindgen::to_value(&result).unwrap()
}

// Internal helper that returns a serializable struct instead of JsValue
#[derive(serde::Serialize)]
struct SerializableCompilationResult {
    success: bool,
    output: Option<String>,
    error: Option<String>,
    target: String,
}

fn compile_internal(source: &str, target_platform: &str) -> SerializableCompilationResult {
    // 1. Parse
    let mut parser = parser::Parser::new(source);
    let mut program = match parser.parse() {
        Ok(p) => p,
        Err(e) => return SerializableCompilationResult {
            success: false,
            output: None,
            error: Some(format!("Parse Error: {}", e)),
            target: target_platform.to_string(),
        }
    };

    // 2. Analyze
    let mut analyzer = analyzer::Analyzer::new();
    if let Err(e) = analyzer.analyze(&program) {
        return SerializableCompilationResult {
            success: false,
            output: None,
            error: Some(format!("Analysis Error: {}", e)),
            target: target_platform.to_string(),
        };
    }

    // 3. Optimize (Standard Debug level for web playground)
    let mut optimizer = optimizer::Optimizer::new(optimizer::OptimizationLevel::Debug);
    if let Err(e) = optimizer.optimize(&mut program) {
        return SerializableCompilationResult {
            success: false,
            output: None,
            error: Some(format!("Optimization Error: {}", e)),
            target: target_platform.to_string(),
        };
    }

    // 4. Generate Code
    let target_enum = match target_platform {
        "web" => codegen::Target::Web,
        "ios" => codegen::Target::Ios,
        "android" => codegen::Target::Android,
        "flutter" => codegen::Target::Flutter,
        _ => codegen::Target::Web, // Default to Web
    };

    let mut codegen = codegen::CodeGenerator::new(target_enum);
    match codegen.generate(&program) {
        Ok(code) => SerializableCompilationResult {
            success: true,
            output: Some(code),
            error: None,
            target: target_platform.to_string(),
        },
        Err(e) => SerializableCompilationResult {
            success: false,
            output: None,
            error: Some(format!("Codegen Error: {}", e)),
            target: target_platform.to_string(),
        }
    }
}
