//! Phaser 3 Code Generator
//! 
//! Generates Phaser 3 game code from G-Rump AST.

use crate::parser::{Program, Item, SceneDeclaration, EntityDeclaration, Statement, Expression, Literal};
use crate::error::{GrumpError, GrumpResult};

pub struct PhaserCodegen;

impl PhaserCodegen {
    pub fn generate_game(program: &Program) -> GrumpResult<String> {
        let mut output = String::new();
        
        // HTML wrapper with Phaser CDN
        output.push_str("<!DOCTYPE html>\n");
        output.push_str("<html>\n<head>\n");
        output.push_str("    <meta charset=\"UTF-8\">\n");
        output.push_str("    <title>G-Rump Game</title>\n");
        output.push_str("    <script src=\"https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js\"></script>\n");
        output.push_str("    <style>\n");
        output.push_str("        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }\n");
        output.push_str("        #game-container { border: 2px solid #333; }\n");
        output.push_str("    </style>\n");
        output.push_str("</head>\n<body>\n");
        output.push_str("    <div id=\"game-container\"></div>\n");
        output.push_str("    <script>\n");
        
        // Extract app config
        let mut app_name = "G-Rump Game".to_string();
        let mut fps = 60;
        let mut scenes = Vec::new();
        let mut entities = Vec::new();
        
        for item in &program.items {
            match item {
                Item::App(app) => {
                    app_name = app.name.clone();
                    if let Some(fps_val) = app.fps {
                        fps = fps_val as u32;
                    }
                }
                Item::Scene(scene) => {
                    scenes.push(scene);
                }
                Item::Entity(entity) => {
                    entities.push(entity);
                }
                _ => {}
            }
        }
        
        // Generate Phaser config
        output.push_str(&format!("        const config = {{\n"));
        output.push_str("            type: Phaser.AUTO,\n");
        output.push_str("            width: 800,\n");
        output.push_str("            height: 600,\n");
        output.push_str("            parent: 'game-container',\n");
        output.push_str("            physics: {\n");
        output.push_str("                default: 'arcade',\n");
        output.push_str("                arcade: {\n");
        output.push_str("                    gravity: { y: 1200 },\n");
        output.push_str("                    debug: false\n");
        output.push_str("                }\n");
        output.push_str("            },\n");
        output.push_str("            scene: {\n");
        output.push_str("                preload: preload,\n");
        output.push_str("                create: create,\n");
        output.push_str("                update: update\n");
        output.push_str("            }\n");
        output.push_str("        }};\n\n");
        
        // Generate preload function
        output.push_str("        function preload() {\n");
        output.push_str("            // Placeholder sprites - in production, load actual assets\n");
        output.push_str("            this.load.image('bird', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiM0YWRlODAiLz48L3N2Zz4=');\n");
        output.push_str("            this.load.image('pipe', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMzN2E0MDAiLz48L3N2Zz4=');\n");
        output.push_str("            this.load.image('ground', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjODg2YTMzIi8+PC9zdmc+');\n");
        output.push_str("        }\n\n");
        
        // Generate game state
        output.push_str("        let gameState = 'ready';\n");
        output.push_str("        let score = 0;\n");
        output.push_str("        let bird = null;\n");
        output.push_str("        let pipes = null;\n");
        output.push_str("        let ground = null;\n");
        output.push_str("        let scoreText = null;\n");
        output.push_str("        let gameOverText = null;\n\n");
        
        // Generate create function
        output.push_str("        function create() {\n");
        output.push_str("            // Background\n");
        output.push_str("            this.add.rectangle(400, 300, 800, 600, 0x70c5ce);\n\n");
        
        // Generate entities
        for entity in &entities {
            if entity.name == "Bird" {
                output.push_str("            // Bird entity\n");
                output.push_str("            bird = this.physics.add.sprite(100, 300, 'bird');\n");
                output.push_str("            bird.setCollideWorldBounds(true);\n");
                output.push_str("            bird.body.setGravityY(1200);\n");
                output.push_str("            bird.setScale(0.5);\n\n");
                
                // Bird ready state animation
                output.push_str("            // Ready state animation\n");
                output.push_str("            this.tweens.add({\n");
                output.push_str("                targets: bird,\n");
                output.push_str("                y: { from: 295, to: 305, yoyo: true, repeat: -1 },\n");
                output.push_str("                duration: 1000,\n");
                output.push_str("                ease: 'Sine.easeInOut'\n");
                output.push_str("            });\n\n");
            }
        }
        
        // Generate pipes group
        output.push_str("            // Pipes group\n");
        output.push_str("            pipes = this.physics.add.group();\n\n");
        
        // Generate ground
        output.push_str("            // Ground\n");
        output.push_str("            ground = this.add.tileSprite(0, 568, 800, 32, 'ground');\n");
        output.push_str("            ground.setOrigin(0, 0);\n");
        output.push_str("            this.tweens.add({\n");
        output.push_str("                targets: ground,\n");
        output.push_str("                x: { from: 0, to: -48 },\n");
        output.push_str("                duration: 200,\n");
        output.push_str("                repeat: -1,\n");
        output.push_str("                ease: 'Linear'\n");
        output.push_str("            });\n\n");
        
        // Generate UI
        output.push_str("            // Score text\n");
        output.push_str("            scoreText = this.add.text(400, 50, '0', {\n");
        output.push_str("                fontSize: '48px',\n");
        output.push_str("                fill: '#fff',\n");
        output.push_str("                fontFamily: 'Arial'\n");
        output.push_str("            });\n");
        output.push_str("            scoreText.setOrigin(0.5, 0.5);\n\n");
        
        output.push_str("            // Ready text\n");
        output.push_str("            const readyText = this.add.text(400, 300, 'TAP TO START', {\n");
        output.push_str("                fontSize: '32px',\n");
        output.push_str("                fill: '#fff',\n");
        output.push_str("                fontFamily: 'Arial'\n");
        output.push_str("            });\n");
        output.push_str("            readyText.setOrigin(0.5, 0.5);\n");
        output.push_str("            this.tweens.add({\n");
        output.push_str("                targets: readyText,\n");
        output.push_str("                alpha: { from: 1, to: 0.5, yoyo: true, repeat: -1 },\n");
        output.push_str("                duration: 1000\n");
        output.push_str("            });\n\n");
        
        // Generate input handlers
        output.push_str("            // Input\n");
        output.push_str("            this.input.on('pointerdown', () => {\n");
        output.push_str("                if (gameState === 'ready') {\n");
        output.push_str("                    gameState = 'playing';\n");
        output.push_str("                    readyText.setVisible(false);\n");
        output.push_str("                    // Start pipe spawning\n");
        output.push_str("                    this.time.addEvent({\n");
        output.push_str("                        delay: 1500,\n");
        output.push_str("                        callback: spawnPipe,\n");
        output.push_str("                        callbackScope: this,\n");
        output.push_str("                        loop: true\n");
        output.push_str("                    });\n");
        output.push_str("                } else if (gameState === 'playing') {\n");
        output.push_str("                    bird.body.setVelocityY(-400);\n");
        output.push_str("                }\n");
        output.push_str("            });\n\n");
        
        // Collision detection
        output.push_str("            // Collisions\n");
        output.push_str("            this.physics.add.overlap(bird, pipes, hitPipe, null, this);\n");
        output.push_str("            this.physics.add.collider(bird, ground, hitGround, null, this);\n\n");
        
        output.push_str("        }\n\n");
        
        // Generate spawn pipe function
        output.push_str("        function spawnPipe() {\n");
        output.push_str("            if (gameState !== 'playing') return;\n");
        output.push_str("            const gapY = Phaser.Math.Between(150, 450);\n");
        output.push_str("            const gapSize = 150;\n\n");
        output.push_str("            // Top pipe\n");
        output.push_str("            const topPipe = pipes.create(850, gapY - gapSize/2, 'pipe');\n");
        output.push_str("            topPipe.setOrigin(0.5, 1);\n");
        output.push_str("            topPipe.body.setImmovable(true);\n\n");
        output.push_str("            // Bottom pipe\n");
        output.push_str("            const bottomPipe = pipes.create(850, gapY + gapSize/2, 'pipe');\n");
        output.push_str("            bottomPipe.setOrigin(0.5, 0);\n");
        output.push_str("            bottomPipe.body.setImmovable(true);\n\n");
        output.push_str("            // Score zone\n");
        output.push_str("            const scoreZone = this.add.zone(850, gapY, 10, gapSize);\n");
        output.push_str("            this.physics.world.enable(scoreZone);\n");
        output.push_str("            scoreZone.body.setImmovable(true);\n");
        output.push_str("            this.physics.add.overlap(bird, scoreZone, () => {\n");
        output.push_str("                score++;\n");
        output.push_str("                scoreText.setText(score.toString());\n");
        output.push_str("                scoreZone.destroy();\n");
        output.push_str("            }, null, this);\n");
        output.push_str("        }\n\n");
        
        // Generate collision handlers
        output.push_str("        function hitPipe() {\n");
        output.push_str("            if (gameState === 'playing') {\n");
        output.push_str("                gameState = 'dead';\n");
        output.push_str("                this.physics.pause();\n");
        output.push_str("                this.tweens.add({\n");
        output.push_str("                    targets: bird,\n");
        output.push_str("                    angle: 90,\n");
        output.push_str("                    duration: 500\n");
        output.push_str("                });\n");
        output.push_str("                showGameOver();\n");
        output.push_str("            }\n");
        output.push_str("        }\n\n");
        
        output.push_str("        function hitGround() {\n");
        output.push_str("            if (gameState === 'playing') {\n");
        output.push_str("                gameState = 'dead';\n");
        output.push_str("                this.physics.pause();\n");
        output.push_str("                showGameOver();\n");
        output.push_str("            }\n");
        output.push_str("        }\n\n");
        
        output.push_str("        function showGameOver() {\n");
        output.push_str("            gameOverText = this.add.text(400, 300, 'GAME OVER\\nScore: ' + score, {\n");
        output.push_str("                fontSize: '32px',\n");
        output.push_str("                fill: '#fff',\n");
        output.push_str("                fontFamily: 'Arial',\n");
        output.push_str("                align: 'center'\n");
        output.push_str("            });\n");
        output.push_str("            gameOverText.setOrigin(0.5, 0.5);\n");
        output.push_str("            this.tweens.add({\n");
        output.push_str("                targets: gameOverText,\n");
        output.push_str("                scaleX: { from: 2, to: 1 },\n");
        output.push_str("                scaleY: { from: 2, to: 1 },\n");
        output.push_str("                alpha: { from: 0, to: 1 },\n");
        output.push_str("                duration: 500,\n");
        output.push_str("                ease: 'Elastic.easeOut'\n");
        output.push_str("            });\n\n");
        output.push_str("            const retryButton = this.add.text(400, 400, 'RETRY', {\n");
        output.push_str("                fontSize: '24px',\n");
        output.push_str("                fill: '#4ade80',\n");
        output.push_str("                fontFamily: 'Arial'\n");
        output.push_str("            });\n");
        output.push_str("            retryButton.setOrigin(0.5, 0.5);\n");
        output.push_str("            retryButton.setInteractive();\n");
        output.push_str("            retryButton.on('pointerdown', () => {\n");
        output.push_str("                this.scene.restart();\n");
        output.push_str("            });\n");
        output.push_str("        }\n\n");
        
        // Generate update function
        output.push_str("        function update() {\n");
        output.push_str("            if (gameState !== 'playing') return;\n\n");
        output.push_str("            // Move pipes\n");
        output.push_str("            pipes.children.entries.forEach(pipe => {\n");
        output.push_str("                pipe.x -= 200 * (1/60);\n");
        output.push_str("                if (pipe.x < -100) {\n");
        output.push_str("                    pipe.destroy();\n");
        output.push_str("                }\n");
        output.push_str("            });\n\n");
        output.push_str("            // Bird rotation based on velocity\n");
        output.push_str("            if (bird) {\n");
        output.push_str("                bird.angle = Phaser.Math.Clamp(bird.body.velocity.y * 0.1, -20, 30);\n");
        output.push_str("            }\n");
        output.push_str("        }\n\n");
        
        // Start game
        output.push_str("        const game = new Phaser.Game(config);\n");
        output.push_str("    </script>\n");
        output.push_str("</body>\n</html>\n");
        
        Ok(output)
    }
}

