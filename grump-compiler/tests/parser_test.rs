//! Tests for the G-Rump parser

use grump_compiler::parser::Parser;
use grump_compiler::error::GrumpResult;

#[test]
fn test_parse_simple_app() {
    let source = r#"
        @app "Test Game"
        @fps 60
        {
            scene Main {
                Text("Hello") {
                    position: (100, 100)
                }
            }
        }
    "#;
    
    let mut parser = Parser::new(source);
    let result = parser.parse();
    
    assert!(result.is_ok(), "Failed to parse: {:?}", result.err());
}

#[test]
fn test_parse_animation() {
    let source = r#"
        animate sprite.position {
            keyframes {
                0s: (0, 0) { ease_out: smooth }
                1s: (100, 100) { ease_in: bounce }
            }
            duration: 1s
        }
    "#;
    
    // This test will need to be updated once we have statement parsing in scenes
    // For now, it's a placeholder
}

#[test]
fn test_parse_entity() {
    let source = r#"
        entity Player {
            sprite: "hero.png"
            position: (100, 200)
            
            fn update() {
                position.x += 1
            }
        }
    "#;
    
    let mut parser = Parser::new(source);
    let result = parser.parse();
    
    // Should parse successfully
    assert!(result.is_ok());
}

