// Phaser 3 Code Generator for G-Rump
// Generates playable HTML5 games from G-Rump code

export function generatePhaserGame(grumpCode, options = {}) {
  let { appName = 'G-Rump Game', fps = 60 } = options;
  
  // Simple parser for G-Rump entities and scenes
  const entities = [];
  const scenes = [];
  
  // Extract app name and FPS
  const appMatch = grumpCode.match(/@app\s+"([^"]+)"/);
  const fpsMatch = grumpCode.match(/@fps\s+(\d+)/);
  const extractedAppName = appMatch ? appMatch[1] : appName;
  const extractedFps = fpsMatch ? parseInt(fpsMatch[1]) : fps;
  
  // Extract entities (improved parsing with nested braces)
  const entityMatches = [];
  let depth = 0;
  let start = -1;
  let entityName = '';
  let inEntity = false;
  
  const lines = grumpCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\s*entity\s+(\w+)/)) {
      inEntity = true;
      entityName = line.match(/entity\s+(\w+)/)[1];
      start = i;
      depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    } else if (inEntity) {
      depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth === 0) {
        const body = lines.slice(start, i + 1).join('\n');
        entityMatches.push({ name: entityName, body });
        inEntity = false;
      }
    }
  }
  
  entities = entityMatches;
  
  // Extract scenes (improved parsing)
  const sceneMatches = [];
  depth = 0;
  start = -1;
  let sceneName = '';
  let inScene = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\s*scene\s+(\w+)/)) {
      inScene = true;
      sceneName = line.match(/scene\s+(\w+)/)[1];
      start = i;
      depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    } else if (inScene) {
      depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth === 0) {
        const body = lines.slice(start, i + 1).join('\n');
        sceneMatches.push({ name: sceneName, body });
        inScene = false;
      }
    }
  }
  
  scenes = sceneMatches;
  
  // Detect game type
  const isFlappyBird = grumpCode.includes('entity Bird') || grumpCode.includes('Flappy');
  const isPlatformer = grumpCode.includes('entity Player') && grumpCode.includes('jump') || grumpCode.includes('Platformer');
  const isShooter = grumpCode.includes('entity Enemy') && grumpCode.includes('Bullet') || grumpCode.includes('Shooter');
  const isMatch3 = grumpCode.includes('entity Tile') || grumpCode.includes('Match-3') || grumpCode.includes('match-3');
  const isRacing = grumpCode.includes('entity Car') || grumpCode.includes('Racing') || grumpCode.includes('racing');
  
  if (isFlappyBird) {
    return generateFlappyBirdGame();
  } else if (isPlatformer) {
    return generatePlatformerGame();
  } else if (isShooter) {
    return generateShooterGame();
  } else if (isMatch3) {
    return generateMatch3Game();
  } else if (isRacing) {
    return generateRacingGame();
  }
  
  // Default game template
  return generateDefaultGame(entities, scenes, extractedAppName || appName, extractedFps || fps);
}

function generateFlappyBirdGame() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Flappy Bird - G-Rump</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1200 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        let gameState = 'ready';
        let score = 0;
        let bird = null;
        let pipes = null;
        let ground = null;
        let scoreText = null;
        let readyText = null;
        let gameOverText = null;
        let pipeSpawnTimer = null;

        function preload() {
            // Create colored rectangles as sprites
            this.load.image('bird', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiM0YWRlODAiLz48L3N2Zz4=');
            this.load.image('pipe', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMzN2E0MDAiLz48L3N2Zz4=');
            this.load.image('ground', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5ucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iIzg4NmEzMyIvPjwvc3ZnPg==');
        }

        function create() {
            // Background
            this.add.rectangle(400, 300, 800, 600, 0x70c5ce);

            // Bird
            bird = this.physics.add.sprite(100, 300, 'bird');
            bird.setCollideWorldBounds(true);
            bird.body.setGravityY(1200);
            bird.setScale(0.5);

            // Ready state animation
            this.tweens.add({
                targets: bird,
                y: { from: 295, to: 305, yoyo: true, repeat: -1 },
                duration: 1000,
                ease: 'Sine.easeInOut'
            });

            // Pipes group
            pipes = this.physics.add.group();

            // Ground
            ground = this.add.tileSprite(0, 568, 800, 32, 'ground');
            ground.setOrigin(0, 0);
            this.tweens.add({
                targets: ground,
                x: { from: 0, to: -48 },
                duration: 200,
                repeat: -1,
                ease: 'Linear'
            });

            // Score text
            scoreText = this.add.text(400, 50, '0', {
                fontSize: '48px',
                fill: '#fff',
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 4
            });
            scoreText.setOrigin(0.5, 0.5);

            // Ready text
            readyText = this.add.text(400, 300, 'TAP TO START', {
                fontSize: '32px',
                fill: '#fff',
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 2
            });
            readyText.setOrigin(0.5, 0.5);
            this.tweens.add({
                targets: readyText,
                alpha: { from: 1, to: 0.5, yoyo: true, repeat: -1 },
                duration: 1000
            });

            // Input
            this.input.on('pointerdown', () => {
                if (gameState === 'ready') {
                    gameState = 'playing';
                    readyText.setVisible(false);
                    pipeSpawnTimer = this.time.addEvent({
                        delay: 1500,
                        callback: () => spawnPipe.call(this),
                        loop: true
                    });
                } else if (gameState === 'playing') {
                    bird.body.setVelocityY(-400);
                }
            });

            // Collisions
            this.physics.add.overlap(bird, pipes, () => hitPipe.call(this), null, this);
            this.physics.add.collider(bird, ground, () => hitGround.call(this), null, this);
        }

        function spawnPipe() {
            if (gameState !== 'playing') return;
            const gapY = Phaser.Math.Between(150, 450);
            const gapSize = 150;

            // Top pipe
            const topPipe = pipes.create(850, gapY - gapSize/2, 'pipe');
            topPipe.setOrigin(0.5, 1);
            topPipe.body.setImmovable(true);
            topPipe.setScale(1, 0.5);

            // Bottom pipe
            const bottomPipe = pipes.create(850, gapY + gapSize/2, 'pipe');
            bottomPipe.setOrigin(0.5, 0);
            bottomPipe.body.setImmovable(true);
            bottomPipe.setScale(1, 0.5);

            // Score zone
            const scoreZone = this.add.zone(850, gapY, 10, gapSize);
            this.physics.world.enable(scoreZone);
            scoreZone.body.setImmovable(true);
            this.physics.add.overlap(bird, scoreZone, () => {
                score++;
                scoreText.setText(score.toString());
                scoreZone.destroy();
            }, null, this);
        }

        function hitPipe() {
            if (gameState === 'playing') {
                gameState = 'dead';
                this.physics.pause();
                this.tweens.add({
                    targets: bird,
                    angle: 90,
                    duration: 500
                });
                showGameOver.call(this);
            }
        }

        function hitGround() {
            if (gameState === 'playing') {
                gameState = 'dead';
                this.physics.pause();
                showGameOver.call(this);
            }
        }

        function showGameOver() {
            gameOverText = this.add.text(400, 300, 'GAME OVER\\nScore: ' + score, {
                fontSize: '32px',
                fill: '#fff',
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#000',
                strokeThickness: 4
            });
            gameOverText.setOrigin(0.5, 0.5);
            this.tweens.add({
                targets: gameOverText,
                scaleX: { from: 2, to: 1 },
                scaleY: { from: 2, to: 1 },
                alpha: { from: 0, to: 1 },
                duration: 500,
                ease: 'Elastic.easeOut'
            });

            const retryButton = this.add.text(400, 400, 'RETRY', {
                fontSize: '24px',
                fill: '#4ade80',
                fontFamily: 'Arial',
                stroke: '#000',
                strokeThickness: 2
            });
            retryButton.setOrigin(0.5, 0.5);
            retryButton.setInteractive();
            retryButton.on('pointerdown', () => {
                this.scene.restart();
            });
        }

        function update() {
            if (gameState !== 'playing') return;

            // Move pipes
            pipes.children.entries.forEach(pipe => {
                pipe.x -= 200 * (1/60);
                if (pipe.x < -100) {
                    pipe.destroy();
                }
            });

            // Bird rotation based on velocity
            if (bird) {
                bird.angle = Phaser.Math.Clamp(bird.body.velocity.y * 0.1, -20, 30);
            }
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

function generatePlatformerGame() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Platformer - G-Rump</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 980 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        let player = null;
        let platforms = null;
        let coins = null;
        let cursors = null;
        let score = 0;
        let lives = 3;
        let scoreText = null;
        let livesText = null;

        function preload() {
            this.load.image('player', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjNGFlOGZmIi8+PC9zdmc+');
            this.load.image('platform', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiM4ODZhMzMiLz48L3N2Zz4=');
            this.load.image('coin', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNmYmJmMjQiLz48L3N2Zz4=');
        }

        function create() {
            // Background
            this.add.rectangle(400, 300, 800, 600, 0x87ceeb);

            // Platforms
            platforms = this.physics.add.staticGroup();
            
            // Ground platforms
            for (let i = 0; i < 10; i++) {
                platforms.create(i * 200, 550, 'platform');
            }
            
            // Floating platforms
            platforms.create(300, 400, 'platform').setScale(0.75, 0.4);
            platforms.create(600, 300, 'platform').setScale(0.75, 0.4);
            platforms.create(900, 200, 'platform').setScale(0.75, 0.4);

            // Player
            player = this.physics.add.sprite(100, 300, 'player');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            player.body.setGravityY(980);

            // Coins
            coins = this.physics.add.group();
            for (let i = 0; i < 5; i++) {
                const coin = coins.create(200 + i * 150, 400, 'coin');
                coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            }

            // Collisions
            this.physics.add.collider(player, platforms);
            this.physics.add.overlap(player, coins, collectCoin, null, this);

            // Input
            cursors = this.input.keyboard.createCursorKeys();

            // UI
            scoreText = this.add.text(20, 20, 'Score: 0', {
                fontSize: '24px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2
            });
            livesText = this.add.text(20, 50, 'Lives: 3', {
                fontSize: '20px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2
            });
        }

        function collectCoin(player, coin) {
            coin.disableBody(true, true);
            score += 10;
            scoreText.setText('Score: ' + score);
        }

        function update() {
            // Player movement
            if (cursors.left.isDown) {
                player.setVelocityX(-200);
                player.setFlipX(true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(200);
                player.setFlipX(false);
            } else {
                player.setVelocityX(0);
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-500);
            }

            // Check if player fell
            if (player.y > 600) {
                lives--;
                livesText.setText('Lives: ' + lives);
                if (lives <= 0) {
                    this.scene.restart();
                } else {
                    player.setPosition(100, 300);
                }
            }
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

function generateShooterGame() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Space Shooter - G-Rump</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        let player = null;
        let bullets = null;
        let enemies = null;
        let score = 0;
        let health = 100;
        let wave = 1;
        let scoreText = null;
        let healthBar = null;
        let lastShot = 0;

        function preload() {
            this.load.image('ship', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSIyMCw1IDM1LDM1IDUsMzUiIGZpbGw9IiM0YWRlODAiLz48L3N2Zz4=');
            this.load.image('enemy', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlZjQ0NDQiLz48L3N2Zz4=');
            this.load.image('bullet', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZmYwMCIvPjwvc3ZnPg==');
        }

        function create() {
            // Background
            this.add.rectangle(400, 300, 800, 600, 0x000000);

            // Player
            player = this.physics.add.sprite(400, 500, 'ship');
            player.setCollideWorldBounds(true);

            // Bullets
            bullets = this.physics.add.group();

            // Enemies
            enemies = this.physics.add.group();

            // Collisions
            this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
            this.physics.add.overlap(player, enemies, hitPlayer, null, this);

            // Input
            this.input.on('pointermove', (pointer) => {
                player.x = Phaser.Math.Clamp(pointer.x, 20, 780);
                player.y = Phaser.Math.Clamp(pointer.y, 20, 580);
            });

            // Auto-shoot
            this.time.addEvent({
                delay: 200,
                callback: shoot,
                callbackScope: this,
                loop: true
            });

            // Spawn enemies
            this.time.addEvent({
                delay: 1500,
                callback: spawnEnemy,
                callbackScope: this,
                loop: true
            });

            // UI
            scoreText = this.add.text(20, 20, 'Score: 0', {
                fontSize: '24px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2
            });
            healthBar = this.add.rectangle(20, 50, 200, 20, 0xff0000);
        }

        function shoot() {
            const bullet = bullets.create(player.x, player.y - 20, 'bullet');
            bullet.setVelocityY(-600);
        }

        function spawnEnemy() {
            const x = Phaser.Math.Between(50, 750);
            const enemy = enemies.create(x, -50, 'enemy');
            enemy.setVelocityY(100 + wave * 20);
        }

        function hitEnemy(bullet, enemy) {
            bullet.destroy();
            enemy.destroy();
            score += 10;
            scoreText.setText('Score: ' + score);
            
            if (score % 100 === 0) {
                wave++;
            }
        }

        function hitPlayer(player, enemy) {
            enemy.destroy();
            health -= 10;
            healthBar.width = Math.max(0, health * 2);
            
            if (health <= 0) {
                this.scene.restart();
            }
        }

        function update() {
            // Remove off-screen bullets
            bullets.children.entries.forEach(bullet => {
                if (bullet.y < -50) bullet.destroy();
            });

            // Remove off-screen enemies
            enemies.children.entries.forEach(enemy => {
                if (enemy.y > 650) enemy.destroy();
            });
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

function generateMatch3Game() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Match-3 Puzzle - G-Rump</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: {
                create: create,
                update: update
            }
        };

        const GRID_SIZE = 8;
        const TILE_SIZE = 60;
        const COLORS = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        let grid = [];
        let selectedTile = null;
        let score = 0;
        let moves = 30;
        let scoreText = null;
        let movesText = null;

        function create() {
            // Background
            this.add.rectangle(400, 300, 800, 600, 0xf0f0f0);

            // Create grid
            grid = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                grid[y] = [];
                for (let x = 0; x < GRID_SIZE; x++) {
                    const color = Phaser.Math.RND.pick(COLORS);
                    const tile = this.add.rectangle(
                        x * TILE_SIZE + 100,
                        y * TILE_SIZE + 100,
                        TILE_SIZE - 4,
                        TILE_SIZE - 4,
                        color
                    );
                    tile.setInteractive();
                    tile.setData('x', x);
                    tile.setData('y', y);
                    tile.setData('color', color);
                    tile.on('pointerdown', () => selectTile(tile));
                    grid[y][x] = tile;
                }
            }

            // UI
            scoreText = this.add.text(20, 20, 'Score: 0', {
                fontSize: '24px',
                fill: '#000'
            });
            movesText = this.add.text(20, 50, 'Moves: 30', {
                fontSize: '20px',
                fill: '#000'
            });
        }

        function selectTile(tile) {
            if (selectedTile === null) {
                selectedTile = tile;
                tile.setStrokeStyle(4, 0xffffff);
            } else {
                const x1 = selectedTile.getData('x');
                const y1 = selectedTile.getData('y');
                const x2 = tile.getData('x');
                const y2 = tile.getData('y');
                
                // Check if adjacent
                if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1) {
                    swapTiles(x1, y1, x2, y2);
                    checkMatches();
                    moves--;
                    movesText.setText('Moves: ' + moves);
                }
                
                selectedTile.setStrokeStyle();
                selectedTile = null;
            }
        }

        function swapTiles(x1, y1, x2, y2) {
            const tile1 = grid[y1][x1];
            const tile2 = grid[y2][x2];
            const color1 = tile1.getData('color');
            const color2 = tile2.getData('color');
            
            tile1.setFillStyle(color2);
            tile2.setFillStyle(color1);
            tile1.setData('color', color2);
            tile2.setData('color', color1);
        }

        function checkMatches() {
            // Simple match-3 logic
            let matched = false;
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE - 2; x++) {
                    const color = grid[y][x].getData('color');
                    if (grid[y][x + 1].getData('color') === color &&
                        grid[y][x + 2].getData('color') === color) {
                        grid[y][x].setVisible(false);
                        grid[y][x + 1].setVisible(false);
                        grid[y][x + 2].setVisible(false);
                        score += 30;
                        matched = true;
                    }
                }
            }
            
            if (matched) {
                scoreText.setText('Score: ' + score);
            }
        }

        function update() {
            // Game loop
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

function generateRacingGame() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Racing Game - G-Rump</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        let player = null;
        let obstacles = null;
        let cursors = null;
        let score = 0;
        let scoreText = null;
        let speed = 200;

        function preload() {
            this.load.image('car', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNGFlOGZmIi8+PC9zdmc+');
            this.load.image('obstacle', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+');
        }

        function create() {
            // Road background
            this.add.rectangle(400, 300, 800, 600, 0x333333);
            
            // Road lines
            for (let i = 0; i < 10; i++) {
                this.add.rectangle(400, i * 60, 20, 40, 0xffff00);
            }

            // Player car
            player = this.physics.add.sprite(400, 500, 'car');
            player.setCollideWorldBounds(true);

            // Obstacles
            obstacles = this.physics.add.group();

            // Collisions
            this.physics.add.overlap(player, obstacles, hitObstacle, null, this);

            // Input
            cursors = this.input.keyboard.createCursorKeys();

            // Spawn obstacles
            this.time.addEvent({
                delay: 2000,
                callback: spawnObstacle,
                callbackScope: this,
                loop: true
            });

            // UI
            scoreText = this.add.text(20, 20, 'Score: 0', {
                fontSize: '24px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2
            });
        }

        function spawnObstacle() {
            const x = Phaser.Math.Between(100, 700);
            const obstacle = obstacles.create(x, -50, 'obstacle');
            obstacle.setVelocityY(speed);
        }

        function hitObstacle() {
            this.scene.restart();
        }

        function update() {
            // Player movement
            if (cursors.left.isDown) {
                player.setVelocityX(-300);
            } else if (cursors.right.isDown) {
                player.setVelocityX(300);
            } else {
                player.setVelocityX(0);
            }

            // Update score
            obstacles.children.entries.forEach(obstacle => {
                if (obstacle.y > 650) {
                    score += 10;
                    scoreText.setText('Score: ' + score);
                    obstacle.destroy();
                    
                    // Increase speed
                    if (score % 100 === 0) {
                        speed += 20;
                    }
                }
            });
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

function generateDefaultGame(entities, scenes, appName, fps) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${appName}</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; }
        #game-container { border: 2px solid #333; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        function preload() {
            // Placeholder sprites
        }

        function create() {
            this.add.text(400, 300, 'G-Rump Game\\n(Generated)', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5, 0.5);
        }

        function update() {
            // Game loop
        }

        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;
}

