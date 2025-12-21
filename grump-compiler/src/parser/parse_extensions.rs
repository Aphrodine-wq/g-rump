//! Parsing functions for extended G-Rump features
//! 
//! Handles parsing of shaders, behavior trees, networking, macros, plugins, and packages

use crate::lexer::Token;
use crate::error::{GrumpError, GrumpResult};
use crate::parser::{Parser, Expression, Statement, Type, Parameter};
use crate::parser::extensions::*;

impl<'source> Parser<'source> {
    pub fn parse_shader(&mut self) -> GrumpResult<ShaderDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut uniforms = Vec::new();
        let mut vertex_code = None;
        let mut fragment_code = None;
        let mut compute_code = None;
        
        while !self.check(Token::RightBrace) {
            if self.check(Token::Uniforms) {
                self.advance();
                self.expect(Token::LeftBrace)?;
                while !self.check(Token::RightBrace) {
                    let uniform_name = self.expect_identifier()?;
                    self.expect(Token::Colon)?;
                    let uniform_type = self.parse_type()?;
                    let default = if self.check(Token::Equals) {
                        self.advance();
                        Some(self.parse_expression()?)
                    } else {
                        None
                    };
                    uniforms.push(Uniform {
                        name: uniform_name,
                        type_: uniform_type,
                        default,
                    });
                    if !self.check(Token::RightBrace) {
                        self.expect(Token::Comma)?;
                    }
                }
                self.expect(Token::RightBrace)?;
            } else if self.check(Token::Vertex) {
                self.advance();
                self.expect(Token::LeftBrace)?;
                vertex_code = Some(self.parse_shader_code()?);
                self.expect(Token::RightBrace)?;
            } else if self.check(Token::Fragment) {
                self.advance();
                self.expect(Token::LeftBrace)?;
                fragment_code = Some(self.parse_shader_code()?);
                self.expect(Token::RightBrace)?;
            } else if self.check(Token::Identifier) {
                let ident = self.expect_identifier()?;
                if ident == "compute" {
                    self.expect(Token::LeftBrace)?;
                    compute_code = Some(self.parse_shader_code()?);
                    self.expect(Token::RightBrace)?;
                } else {
                    return Err(self.error("Expected uniforms, vertex, fragment, or compute in shader"));
                }
            } else {
                return Err(self.error("Expected uniforms, vertex, fragment, or compute in shader"));
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(ShaderDeclaration {
            name,
            uniforms,
            vertex_code,
            fragment_code,
            compute_code,
        })
    }
    
    fn parse_shader_code(&mut self) -> GrumpResult<String> {
        // For now, just collect tokens until closing brace
        // TODO: Properly parse shader code
        let mut code = String::new();
        let mut depth = 1;
        while depth > 0 {
            match self.current.as_ref().map(|(t, _, _)| t) {
                Some(Token::LeftBrace) => {
                    depth += 1;
                    code.push_str("{ ");
                }
                Some(Token::RightBrace) => {
                    depth -= 1;
                    if depth > 0 {
                        code.push_str("} ");
                    }
                }
                Some(Token::Identifier(s)) => {
                    code.push_str(s);
                    code.push(' ');
                }
                Some(Token::Integer(n)) => {
                    code.push_str(&n.to_string());
                    code.push(' ');
                }
                Some(Token::FloatLiteral(f)) => {
                    code.push_str(&f.to_string());
                    code.push(' ');
                }
                _ => {}
            }
            self.advance();
        }
        Ok(code.trim().to_string())
    }
    
    pub fn parse_behavior_tree(&mut self) -> GrumpResult<BehaviorTreeDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        let root = self.parse_behavior_node()?;
        self.expect(Token::RightBrace)?;
        
        Ok(BehaviorTreeDeclaration { name, root })
    }
    
    fn parse_behavior_node(&mut self) -> GrumpResult<BehaviorNode> {
        if self.check(Token::Selector) {
            self.advance();
            self.expect(Token::LeftBrace)?;
            let mut children = Vec::new();
            while !self.check(Token::RightBrace) {
                children.push(self.parse_behavior_node()?);
            }
            self.expect(Token::RightBrace)?;
            Ok(BehaviorNode::Selector { children })
        } else if self.check(Token::Sequence) {
            self.advance();
            self.expect(Token::LeftBrace)?;
            let mut children = Vec::new();
            while !self.check(Token::RightBrace) {
                children.push(self.parse_behavior_node()?);
            }
            self.expect(Token::RightBrace)?;
            Ok(BehaviorNode::Sequence { children })
        } else if self.check(Token::Condition) {
            self.advance();
            self.expect(Token::Colon)?;
            let expr = self.parse_expression()?;
            Ok(BehaviorNode::Condition { expr })
        } else if self.check(Token::Action) {
            self.advance();
            let name = self.expect_identifier()?;
            let params = if self.check(Token::LeftParen) {
                self.advance();
                let mut params = Vec::new();
                while !self.check(Token::RightParen) {
                    params.push(self.parse_expression()?);
                    if !self.check(Token::RightParen) {
                        self.expect(Token::Comma)?;
                    }
                }
                self.expect(Token::RightParen)?;
                params
            } else {
                Vec::new()
            };
            Ok(BehaviorNode::Action { name, params })
        } else {
            Err(self.error("Expected behavior tree node"))
        }
    }
    
    pub fn parse_network(&mut self) -> GrumpResult<NetworkDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut sync_fields = Vec::new();
        let mut rpc_functions = Vec::new();
        
        while !self.check(Token::RightBrace) {
            if self.check(Token::Sync) {
                self.advance();
                let field_name = self.expect_identifier()?;
                self.expect(Token::Colon)?;
                let field_type = self.parse_type()?;
                sync_fields.push(SyncField {
                    name: field_name,
                    type_: field_type,
                    sync_mode: SyncMode::Reliable,  // Default
                });
            } else if self.check(Token::Rpc) {
                self.advance();
                let func_name = self.expect_identifier()?;
                self.expect(Token::LeftParen)?;
                let mut params = Vec::new();
                while !self.check(Token::RightParen) {
                    let param_name = self.expect_identifier()?;
                    self.expect(Token::Colon)?;
                    let param_type = self.parse_type()?;
                    params.push(Parameter {
                        name: param_name,
                        type_: Some(param_type),
                    });
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
                self.expect(Token::Colon)?;
                let target_str = self.expect_identifier()?;
                let target = match target_str.as_str() {
                    "server" => RpcTarget::Server,
                    "client" => RpcTarget::Client,
                    "all" => RpcTarget::All,
                    _ => return Err(self.error("RPC target must be server, client, or all")),
                };
                rpc_functions.push(RpcFunction {
                    name: func_name,
                    params,
                    return_type,
                    target,
                    reliability: SyncMode::Reliable,
                });
            } else {
                return Err(self.error("Expected sync or rpc in network declaration"));
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(NetworkDeclaration {
            name,
            sync_fields,
            rpc_functions,
        })
    }
    
    pub fn parse_macro(&mut self) -> GrumpResult<MacroDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftParen)?;
        let mut params = Vec::new();
        while !self.check(Token::RightParen) {
            let param_name = self.expect_identifier()?;
            let is_variadic = if self.check(Token::DotDotDot) {
                self.advance();
                true
            } else {
                false
            };
            let is_block = param_name == "block" || self.check(Token::LeftBrace);
            params.push(MacroParam {
                name: param_name,
                is_variadic,
                is_block,
            });
            if !self.check(Token::RightParen) {
                self.expect(Token::Comma)?;
            }
        }
        self.expect(Token::RightParen)?;
        self.expect(Token::LeftBrace)?;
        let mut body = Vec::new();
        while !self.check(Token::RightBrace) {
            body.push(self.parse_statement()?);
        }
        self.expect(Token::RightBrace)?;
        
        Ok(MacroDeclaration {
            name,
            params,
            body: MacroBody::Code(body),
        })
    }
    
    pub fn parse_plugin(&mut self) -> GrumpResult<PluginDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut version = None;
        let mut path = None;
        let mut dependencies = Vec::new();
        let mut exports = Vec::new();
        
        while !self.check(Token::RightBrace) {
            let key = self.expect_identifier()?;
            self.expect(Token::Colon)?;
            match key.as_str() {
                "version" => {
                    version = Some(self.expect_string()?);
                }
                "path" => {
                    path = Some(self.expect_string()?);
                }
                "dependencies" => {
                    self.expect(Token::LeftBracket)?;
                    while !self.check(Token::RightBracket) {
                        dependencies.push(self.expect_string()?);
                        if !self.check(Token::RightBracket) {
                            self.expect(Token::Comma)?;
                        }
                    }
                    self.expect(Token::RightBracket)?;
                }
                "exports" => {
                    self.expect(Token::LeftBracket)?;
                    while !self.check(Token::RightBracket) {
                        exports.push(self.expect_string()?);
                        if !self.check(Token::RightBracket) {
                            self.expect(Token::Comma)?;
                        }
                    }
                    self.expect(Token::RightBracket)?;
                }
                _ => return Err(self.error(&format!("Unknown plugin property: {}", key))),
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(PluginDeclaration {
            name,
            version,
            path,
            url: None,
            dependencies,
            exports,
        })
    }
    
    pub fn parse_package(&mut self) -> GrumpResult<PackageDeclaration> {
        let name = self.expect_identifier()?;
        self.expect(Token::LeftBrace)?;
        
        let mut version = None;
        let mut dependencies = Vec::new();
        
        while !self.check(Token::RightBrace) {
            let key = self.expect_identifier()?;
            self.expect(Token::Colon)?;
            match key.as_str() {
                "version" => {
                    version = Some(self.expect_string()?);
                }
                "dependencies" => {
                    self.expect(Token::LeftBrace)?;
                    while !self.check(Token::RightBrace) {
                        let dep_name = self.expect_string()?;
                        self.expect(Token::Colon)?;
                        self.expect(Token::LeftBrace)?;
                        let mut version_req = None;
                        let mut git_url = None;
                        while !self.check(Token::RightBrace) {
                            let dep_key = self.expect_identifier()?;
                            self.expect(Token::Colon)?;
                            match dep_key.as_str() {
                                "version" => {
                                    version_req = Some(self.expect_string()?);
                                }
                                "git" => {
                                    git_url = Some(self.expect_string()?);
                                }
                                _ => return Err(self.error(&format!("Unknown dependency property: {}", dep_key))),
                            }
                        }
                        self.expect(Token::RightBrace)?;
                        dependencies.push(Dependency {
                            name: dep_name,
                            version: version_req,
                            git: git_url,
                        });
                        if !self.check(Token::RightBrace) {
                            self.expect(Token::Comma)?;
                        }
                    }
                    self.expect(Token::RightBrace)?;
                }
                _ => return Err(self.error(&format!("Unknown package property: {}", key))),
            }
        }
        self.expect(Token::RightBrace)?;
        
        Ok(PackageDeclaration {
            name,
            version: version.unwrap_or_else(|| "1.0.0".to_string()),
            dependencies,
        })
    }
}

