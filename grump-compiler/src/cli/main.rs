//! G-Rump CLI Tool
//! 
//! Command-line interface for the G-Rump compiler.

use clap::{Parser, Subcommand};
use std::path::PathBuf;
use grump_compiler::error::GrumpResult;
use rand::Rng;

#[derive(Parser)]
#[command(name = "grump")]
#[command(about = "G-Rump: The Animation-First Game Programming Language", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new G-Rump project
    Init {
        /// Project name
        name: String,
    },
    
    /// Build a G-Rump project
    Build {
        /// Source file or directory
        input: PathBuf,
        
        /// Target platform (ios, android, web, all)
        #[arg(short, long, default_value = "ios")]
        target: String,
        
        /// Output directory
        #[arg(short, long)]
        output: Option<PathBuf>,
        
        /// Optimization level (debug, release, size)
        #[arg(short, long, default_value = "debug")]
        optimization: String,
    },
    
    /// Run a G-Rump project in development mode
    Run {
        /// Source file or directory
        input: PathBuf,
        
        /// Target platform
        #[arg(short, long, default_value = "ios")]
        target: String,
    },
    
    /// Check code without building
    Check {
        /// Source file or directory
        input: PathBuf,
    },
    
    /// Format G-Rump code
    Format {
        /// Source file or directory
        input: PathBuf,
    },
    
    /// Lint G-Rump code (with G-Rump's brutal honesty)
    Lint {
        /// Source file or directory
        input: PathBuf,
    },
    
    /// Get roasted by G-Rump
    Roast {
        /// Optional: specific file to roast
        file: Option<PathBuf>,
    },
    
    /// Get grumpy dev advice
    Wisdom,
    
    /// Check G-Rump's mood today
    Mood,
}

fn main() -> GrumpResult<()> {
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Init { name } => {
            init_project(&name)?;
        }
        Commands::Build { input, target, output, optimization } => {
            build_project(&input, &target, output.as_ref(), &optimization)?;
        }
        Commands::Run { input, target } => {
            run_project(&input, &target)?;
        }
        Commands::Check { input } => {
            check_project(&input)?;
        }
        Commands::Format { input } => {
            format_project(&input)?;
        }
        Commands::Lint { input } => {
            lint_project(&input)?;
        }
        Commands::Roast { file } => {
            roast_code(file.as_ref())?;
        }
        Commands::Wisdom => {
            print_wisdom();
        }
        Commands::Mood => {
            print_mood();
        }
    }
    
    Ok(())
}

fn init_project(name: &str) -> GrumpResult<()> {
    println!("🐸 G-Rump: Initializing project '{}'...", name);
    println!("   [G-Rump says: \"Let's see if you can make something that doesn't suck.\"]");
    
    // Create project structure
    std::fs::create_dir_all(format!("{}/src", name))?;
    std::fs::create_dir_all(format!("{}/assets", name))?;
    std::fs::create_dir_all(format!("{}/build", name))?;
    
    // Create manifest
    let manifest = format!(r#"{{
    "name": "{}",
    "version": "0.1.0",
    "targets": ["ios", "android", "web", "flutter"],
    "fps": 60
}}"#, name);
    std::fs::write(format!("{}/grump.manifest", name), manifest)?;
    
    // Create main.grump
    let main_code = r#"app MyApp {
    scene MainScene {
        entity Player {
            component Position { x: 0.0, y: 0.0 }
            component Velocity { x: 0.0, y: 0.0 }
        }
        
        system update {
            query [Position, Velocity]
            // Your game logic here
        }
    }
}
"#;
    std::fs::write(format!("{}/src/main.grump", name), main_code)?;
    
    // Create .gitignore
    let gitignore = "build/\ntarget/\n*.swift\n*.kt\n*.js\n*.dart\n";
    std::fs::write(format!("{}/.gitignore", name), gitignore)?;
    
    println!("✓ Project initialized!");
    Ok(())
}

fn build_project(input: &PathBuf, target: &str, output: Option<&PathBuf>, optimization: &str) -> GrumpResult<()> {
    println!("🐸 G-Rump: Building for {}...", target);
    
    // Read source file
    let source = std::fs::read_to_string(input)?;
    
    // Parse
    let mut parser = grump_compiler::parser::Parser::new(&source);
    let mut program = parser.parse()?;
    
    // Type check
    let mut analyzer = grump_compiler::analyzer::Analyzer::new();
    analyzer.analyze(&program)?;
    
    // Optimize
    let opt_level = match optimization {
        "debug" => grump_compiler::optimizer::OptimizationLevel::Debug,
        "release" => grump_compiler::optimizer::OptimizationLevel::Release,
        "size" => grump_compiler::optimizer::OptimizationLevel::Size,
        _ => grump_compiler::optimizer::OptimizationLevel::Debug,
    };
    let mut optimizer = grump_compiler::optimizer::Optimizer::new(opt_level);
    optimizer.optimize(&mut program)?;
    
    // Generate code
    let codegen_target = match target {
        "ios" => grump_compiler::codegen::Target::Ios,
        "android" => grump_compiler::codegen::Target::Android,
        "web" => grump_compiler::codegen::Target::Web,
        "flutter" => grump_compiler::codegen::Target::Flutter,
        _ => grump_compiler::codegen::Target::Ios,
    };
    let mut codegen = grump_compiler::codegen::CodeGenerator::new(codegen_target);
    let generated_code = codegen.generate(&program)?;
    
    // Write output
    let output_path = output.map(|p| p.clone()).unwrap_or_else(|| {
        PathBuf::from("build").join(target)
    });
    std::fs::create_dir_all(&output_path)?;
    
    // Write appropriate file extension based on target
    let filename = match target {
        "ios" => "main.swift",
        "android" => "main.kt",
        "web" => "main.js",
        "flutter" => "main.dart",
        _ => "main.swift",
    };
    std::fs::write(output_path.join(filename), generated_code)?;
    
    println!("✓ Build complete! Output: {}", output_path.display());
    Ok(())
}

fn run_project(input: &PathBuf, target: &str) -> GrumpResult<()> {
    println!("🐸 G-Rump: Running on {}...", target);
    
    // TODO: Implement dev server / simulator
    
    Ok(())
}

fn check_project(input: &PathBuf) -> GrumpResult<()> {
    println!("🐸 G-Rump: Checking code...");
    
    // Read source file
    let source = std::fs::read_to_string(input)?;
    
    // Parse
    let mut parser = grump_compiler::parser::Parser::new(&source);
    let program = parser.parse()?;
    
    // Type check
    let mut analyzer = grump_compiler::analyzer::Analyzer::new();
    analyzer.analyze(&program)?;
    
    println!("✓ No errors found!");
    Ok(())
}

fn format_project(input: &PathBuf) -> GrumpResult<()> {
    println!("🐸 G-Rump: Formatting code...");
    
    // Read source file
    let source = std::fs::read_to_string(input)?;
    
    // Parse
    let mut parser = grump_compiler::parser::Parser::new(&source);
    let program = parser.parse()?;
    
    // Format (basic - just re-parse and output)
    // In a real implementation, this would format the AST
    let formatted = format!("{:#?}", program);
    
    // Write back
    std::fs::write(input, formatted)?;
    
    println!("✓ Formatted!");
    Ok(())
}

fn lint_project(input: &PathBuf) -> GrumpResult<()> {
    println!("🐸 G-Rump: Linting (prepare for brutal honesty)...");
    
    // Read source file
    let source = std::fs::read_to_string(input)?;
    
    // Parse
    let mut parser = grump_compiler::parser::Parser::new(&source);
    let program = parser.parse()?;
    
    // Analyze (type checking)
    let mut analyzer = grump_compiler::analyzer::Analyzer::new();
    analyzer.analyze(&program)?;
    
    // Report errors with G-Rump personality
    if !analyzer.errors.is_empty() {
        println!("\n💀 G-Rump found {} error(s):", analyzer.errors.len());
        for error in &analyzer.errors {
            println!("   {}", error.format_with_personality());
        }
        return Err(analyzer.errors.remove(0));
    }
    
    println!("✓ No errors! (G-Rump is surprised but won't admit it)");
    Ok(())
}

fn roast_code(file: Option<&PathBuf>) -> GrumpResult<()> {
    let roasts = vec![
        "Your code looks like you wrote it with your eyes closed. And your hands tied. And your brain off.",
        "I've seen better code in a fortune cookie. At least fortune cookies are concise.",
        "This is why we can't have nice things. You're the reason.",
        "Your variable names are longer than my patience. And I have NONE.",
        "If spaghetti code was a language, you'd be fluent. Unfortunately, this is G-Rump.",
        "I've compiled code written by cats. It was better than this.",
        "Your code has more bugs than a rainforest. And less structure.",
        "This is the programming equivalent of a participation trophy. Everyone loses.",
    ];
    
    let mut rng = rand::thread_rng();
    let roast = &roasts[rng.gen_range(0..roasts.len())];
    println!("🐸 G-Rump says: \"{}\"", roast);
    
    Ok(())
}

fn print_wisdom() {
    let wisdom = vec![
        "Animation isn't optional. It's the point. If you're not animating, you're not trying.",
        "60fps or bust. Your players deserve better than a slideshow.",
        "If your code doesn't read like a storyboard, rewrite it until it does.",
        "Premature optimization is the root of all evil. But so is no optimization. Good luck.",
        "Test on real devices. Simulators lie. They're pathological liars.",
        "Your first implementation will be wrong. Your second will be less wrong. Your third might be acceptable.",
        "Comments are for explaining WHY, not WHAT. If WHAT isn't obvious, your code is bad.",
        "Ship it. Then fix it. Then ship it again. Repeat until it's good or you're dead.",
    ];
    
    let mut rng = rand::thread_rng();
    let w = &wisdom[rng.gen_range(0..wisdom.len())];
    println!("🐸 G-Rump says: \"{}\"", w);
}

fn print_mood() {
    let moods = vec![
        ("grumpy", "Your code is making me grumpier. This is not a good sign."),
        ("slightly less grumpy", "I've seen worse. Not much worse, but worse."),
        ("disappointed", "I expected better. I always do. I'm always wrong."),
        ("surprised", "Huh. This is... actually not terrible. What did you do differently?"),
        ("suspicious", "This code is too clean. What are you hiding?"),
    ];
    
    let mut rng = rand::thread_rng();
    let (mood, comment) = &moods[rng.gen_range(0..moods.len())];
    println!("🐸 G-Rump's mood: {}", mood);
    println!("   \"{}\"", comment);
}

