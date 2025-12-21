// Game Templates - Comprehensive collection of game templates

export interface GameTemplate {
  id: string
  name: string
  description: string
  category: 'platformer' | 'shooter' | 'puzzle' | 'rpg' | 'arcade' | 'strategy' | 'racing'
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  code: string
  preview?: string
  tags: string[]
}

export const gameTemplates: GameTemplate[] = [
  {
    id: 'platformer-basic',
    name: '2D Platformer',
    description: 'Jump and run game with physics and collision detection',
    category: 'platformer',
    icon: '🏃',
    difficulty: 'intermediate',
    tags: ['physics', 'collision', 'jump', 'run'],
    code: `// 2D Platformer Template
// Jump and run game with physics

@app "Platformer"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    score: int = 0
    lives: int = 3
    gameState: enum(ready, playing, dead) = ready
}

world {
    gravity: (0, 980)
}

entity Player {
    sprite: "player.png"
    position: (100, screen.center.y)
    
    physics {
        body: rectangle(32, 48)
        gravity: true
        friction: 0.8
    }
    
    state machine {
        state idle {
            animate(loop) {
                scale.y: 1 -> 1.05 -> 1
            } duration: 0.5s
        }
        
        state running {
            animate(loop) {
                sprite.frame: 0 -> 3
            } duration: 0.3s
        }
        
        state jumping {
            animate {
                rotation: -10 -> 10
            } duration: 0.2s, ease: bounce
        }
    }
    
    update {
        let speed = 200
        
        if input.left {
            velocity.x = -speed
            flip.x = true
            if is_grounded() { state = running }
        } else if input.right {
            velocity.x = speed
            flip.x = false
            if is_grounded() { state = running }
        } else {
            velocity.x *= 0.9
            if is_grounded() { state = idle }
        }
        
        if input.jump && is_grounded() {
            velocity.y = -500
            state = jumping
            play sound(jump)
        }
        
        if position.y > screen.height + 100 {
            lives -= 1
            if lives <= 0 {
                gameState = dead
            } else {
                position = (100, screen.center.y)
            }
        }
    }
}

entity Platform {
    sprite: "platform.png"
    position: (0, 0)
    
    physics {
        body: static
    }
}

entity Coin {
    sprite: "coin.png"
    position: (0, 0)
    
    animate(loop) {
        rotation: 0 -> 360
        scale: 1 -> 1.2 -> 1
    } duration: 1s
    
    on collision(player) {
        score += 10
        play sound(collect)
        destroy(self)
    }
}

scene Main {
    background: #87ceeb
    
    // Ground platforms
    for i in 0..10 {
        Platform {
            position: (i * 200, screen.height - 50)
            size: (200, 50)
        }
    }
    
    // Floating platforms
    Platform { position: (300, 400), size: (150, 20) }
    Platform { position: (600, 300), size: (150, 20) }
    Platform { position: (900, 200), size: (150, 20) }
    
    // Coins
    for i in 0..5 {
        Coin {
            position: (200 + i * 150, screen.height - 150)
        }
    }
    
    Player()
    
    layer ui {
        Text("Score: {score}") {
            position: (20, 20)
            font: "Arial"
            size: 24
            color: #ffffff
            shadow: (2, 2, #000000)
        }
        
        Text("Lives: {lives}") {
            position: (20, 50)
            font: "Arial"
            size: 20
            color: #ffffff
            shadow: (2, 2, #000000)
        }
    }
}
`
  },
  {
    id: 'top-down-shooter',
    name: 'Top-Down Shooter',
    description: 'Asteroids-style space shooter with enemies and power-ups',
    category: 'shooter',
    icon: '🚀',
    difficulty: 'intermediate',
    tags: ['shooting', 'enemies', 'powerups', 'space'],
    code: `// Top-Down Shooter Template
// Space shooter game

@app "Space Shooter"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    score: int = 0
    health: int = 100
    wave: int = 1
}

entity Player {
    sprite: "ship.png"
    position: screen.center
    
    update {
        // Follow mouse/touch
        let target = input.position
        position = lerp(position, target, 0.1)
        
        // Keep on screen
        position.x = clamp(position.x, 0, screen.width)
        position.y = clamp(position.y, 0, screen.height)
        
        // Auto-shoot
        if time % 0.2 < delta {
            spawn(Bullet) {
                position = self.position
                velocity = (0, -600)
            }
        }
    }
    
    on collision(enemy) {
        health -= 10
        if health <= 0 {
            gameState = dead
        }
    }
}

entity Enemy {
    sprite: "enemy.png"
    position: (random(0, screen.width), -50)
    
    update {
        velocity.y = 100 + wave * 20
        if position.y > screen.height + 50 {
            destroy(self)
        }
    }
    
    on collision(bullet) {
        score += 10
        play sound(explode)
        destroy(self)
        destroy(bullet)
    }
}

entity Bullet {
    sprite: "bullet.png"
    position: (0, 0)
    velocity: (0, -600)
    
    update {
        if position.y < -50 {
            destroy(self)
        }
    }
}

scene Game {
    background: #000000
    
    Player()
    
    // Spawn enemies
    every 1.5s {
        spawn(Enemy)
    }
    
    layer ui {
        Text("Score: {score}") {
            position: (20, 20)
            color: #ffffff
        }
        
        ProgressBar {
            position: (20, 50)
            value: health
            max: 100
            color: #ff0000
        }
    }
}
`
  },
  {
    id: 'match-3-puzzle',
    name: 'Match-3 Puzzle',
    description: 'Tile matching game like Candy Crush',
    category: 'puzzle',
    icon: '💎',
    difficulty: 'advanced',
    tags: ['puzzle', 'matching', 'tiles', 'grid'],
    code: `// Match-3 Puzzle Template
// Tile matching game

@app "Match-3"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    score: int = 0
    moves: int = 30
    selectedTile: Vec2? = null
}

entity Tile {
    type: int = random(0, 5)
    gridPosition: Vec2
    position: Vec2
    
    sprite: get_tile_sprite(type)
    
    animate(on appear) {
        scale: 0 -> 1
        rotation: 180 -> 0
    } duration: 0.3s, ease: elastic
    
    on tap {
        if selectedTile == null {
            selectedTile = gridPosition
            animate {
                scale: 1.1
            } duration: 0.1s
        } else {
            if is_adjacent(selectedTile, gridPosition) {
                swap_tiles(selectedTile, gridPosition)
                check_matches()
            }
            selectedTile = null
        }
    }
}

fn check_matches() {
    let matches = find_matches()
    if matches.length > 0 {
        for match in matches {
            score += match.length * 10
            for tile in match {
                animate {
                    scale: 0
                    rotation: 360
                } duration: 0.3s
                destroy(tile)
            }
        }
        drop_tiles()
        fill_gaps()
    }
}

scene Puzzle {
    background: #f0f0f0
    
    // Create grid
    for x in 0..8 {
        for y in 0..8 {
            Tile {
                gridPosition: (x, y)
                position: (x * 60 + 100, y * 60 + 100)
            }
        }
    }
    
    layer ui {
        Text("Score: {score}") {
            position: (20, 20)
            size: 24
        }
        
        Text("Moves: {moves}") {
            position: (20, 50)
            size: 20
        }
    }
}
`
  },
  {
    id: 'flappy-clone',
    name: 'Flappy Bird Clone',
    description: 'Classic flappy bird game with pipes and scoring',
    category: 'arcade',
    icon: '🐦',
    difficulty: 'beginner',
    tags: ['arcade', 'tap', 'endless', 'simple'],
    code: `// Flappy Bird Clone
// Classic endless game

@app "Flappy"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    score: int = 0
    highScore: int = save.highScore
    gameState: enum(ready, playing, dead) = ready
}

world {
    gravity: (0, 1200)
}

entity Bird {
    sprite: "bird.png"
    position: (100, screen.center.y)
    
    physics {
        body: circle(12)
        gravity: true
    }
    
    state machine {
        state ready {
            animate(loop) {
                y: -5 -> 5 -> -5
            } duration: 1s, ease: sine
            
            on input.tap -> playing
        }
        
        state playing {
            animate(loop) {
                rotation: -20 -> 30
            } sync: velocity.y
            
            on input.tap {
                velocity.y = -400
                play sound(flap)
            }
            
            on collision(pipe) -> dead
            on collision(ground) -> dead
        }
        
        state dead {
            on enter {
                gameState = dead
                if score > highScore {
                    save.highScore = score
                }
            }
        }
    }
}

entity Pipe {
    gapY: float = random(150, screen.height - 150)
    gapSize: float = 150
    
    Sprite("pipe_top.png") {
        position: (screen.width, gapY - gapSize/2)
        anchor: bottom
    }
    
    Sprite("pipe_bottom.png") {
        position: (screen.width, gapY + gapSize/2)
        anchor: top
    }
    
    ScoreZone {
        position: (screen.width + 30, gapY)
        size: (10, gapSize)
        on collision(bird) once {
            score += 1
            play sound(point)
        }
    }
    
    update {
        x -= 200 * delta
        if x < -100 {
            destroy(self)
        }
    }
}

scene Game {
    background: #70c5ce
    
    Sprite("ground.png") as ground {
        position: (0, screen.bottom)
        tile: horizontal
        animate(loop, when: gameState != dead) {
            x: 0 -> -48
        } duration: 0.2s
    }
    
    Bird()
    
    when gameState == playing {
        every 1.5s {
            spawn(Pipe)
        }
    }
    
    layer ui {
        Text("{score}") {
            position: (screen.center.x, 50)
            font: "PressStart"
            size: 48
            shadow: (2, 2, #000000)
        }
        
        visible(when: gameState == ready) {
            Text("TAP TO START") {
                position: screen.center
                animate(loop) {
                    opacity: 1 -> 0.5 -> 1
                } duration: 1s
            }
        }
        
        visible(when: gameState == dead) {
            Column(center) {
                Text("GAME OVER") {
                    animate(on appear) {
                        scale: 2 -> 1
                    } duration: 0.5s, ease: elastic
                }
                Text("Score: {score}")
                Text("Best: {highScore}")
                Button("RETRY") {
                    on tap {
                        restart(scene)
                    }
                }
            }
        }
    }
}
`
  },
  {
    id: 'rpg-basic',
    name: 'RPG Adventure',
    description: 'Top-down RPG with quests, inventory, and combat',
    category: 'rpg',
    icon: '⚔️',
    difficulty: 'advanced',
    tags: ['rpg', 'quests', 'inventory', 'combat'],
    code: `// RPG Adventure Template
// Top-down RPG game

@app "RPG Adventure"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    playerLevel: int = 1
    playerExp: int = 0
    playerHealth: int = 100
    playerMaxHealth: int = 100
    gold: int = 0
    currentQuest: Quest? = null
}

entity Player {
    sprite: "hero.png"
    position: screen.center
    
    inventory: Inventory = Inventory()
    stats: Stats = Stats {
        strength: 10
        defense: 5
        speed: 100
    }
    
    update {
        let moveSpeed = stats.speed
        
        if input.up {
            position.y -= moveSpeed * delta
        }
        if input.down {
            position.y += moveSpeed * delta
        }
        if input.left {
            position.x -= moveSpeed * delta
            flip.x = true
        }
        if input.right {
            position.x += moveSpeed * delta
            flip.x = false
        }
        
        // Animate based on movement
        if input.any {
            animate(loop) {
                sprite.frame: 0 -> 3
            } duration: 0.3s
        } else {
            sprite.frame = 0
        }
    }
    
    fn attack(target: Enemy) {
        let damage = stats.strength - target.stats.defense
        target.take_damage(damage)
        play sound(sword)
    }
}

entity Enemy {
    sprite: "enemy.png"
    position: (0, 0)
    health: int = 50
    
    stats: Stats = Stats {
        strength: 5
        defense: 2
        speed: 80
    }
    
    behavior_tree ai {
        selector {
            sequence {
                condition: distance(player, self) < 50
                action: attack(player)
            }
            sequence {
                condition: distance(player, self) < 200
                action: move_towards(player)
            }
            action: patrol()
        }
    }
    
    fn take_damage(amount: int) {
        health -= amount
        if health <= 0 {
            drop_loot()
            destroy(self)
        }
    }
}

entity Item {
    sprite: "item.png"
    position: (0, 0)
    itemType: ItemType
    
    on collision(player) {
        player.inventory.add(itemType)
        play sound(pickup)
        destroy(self)
    }
}

scene World {
    background: #4a5d23
    
    // Create map
    TileMap("world_map.png") {
        tileSize: 32
    }
    
    Player()
    
    // Spawn enemies
    for i in 0..5 {
        Enemy {
            position: (random(100, screen.width - 100), random(100, screen.height - 100))
        }
    }
    
    layer ui {
        // Health bar
        ProgressBar {
            position: (20, 20)
            value: playerHealth
            max: playerMaxHealth
            color: #ff0000
        }
        
        // Inventory
        InventoryPanel {
            position: (screen.width - 200, 20)
        }
        
        // Quest log
        QuestLog {
            position: (20, screen.height - 150)
        }
    }
}
`
  },
  {
    id: 'racing-basic',
    name: 'Racing Game',
    description: 'Top-down racing game with obstacles and power-ups',
    category: 'racing',
    icon: '🏎️',
    difficulty: 'intermediate',
    tags: ['racing', 'speed', 'obstacles', 'powerups'],
    code: `// Racing Game Template
// Top-down racing

@app "Racer"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    speed: float = 0
    maxSpeed: float = 500
    distance: float = 0
    lap: int = 1
}

entity Car {
    sprite: "car.png"
    position: (screen.center.x, screen.height - 100)
    rotation: 0
    
    update {
        // Steering
        if input.left {
            rotation -= 2 * delta
        }
        if input.right {
            rotation += 2 * delta
        }
        
        // Acceleration
        if input.up {
            speed = min(speed + 200 * delta, maxSpeed)
        } else {
            speed = max(speed - 100 * delta, 0)
        }
        
        // Movement
        let direction = Vec2(cos(rotation), sin(rotation))
        position += direction * speed * delta
        
        // Keep on track
        if distance(position, track.center) > 150 {
            speed *= 0.5
        }
    }
    
    on collision(obstacle) {
        speed *= 0.3
        play sound(crash)
    }
    
    on collision(powerup) {
        apply_powerup(powerup.type)
        destroy(powerup)
    }
}

entity Obstacle {
    sprite: "obstacle.png"
    position: (0, 0)
}

entity PowerUp {
    sprite: "powerup.png"
    position: (0, 0)
    type: PowerUpType
    
    animate(loop) {
        rotation: 0 -> 360
        scale: 1 -> 1.2 -> 1
    } duration: 1s
}

scene Race {
    background: #2d5016
    
    // Track
    Sprite("track.png") {
        position: screen.center
        animate(loop) {
            y: 0 -> -screen.height
        } duration: 2s, ease: linear
    }
    
    Car()
    
    // Spawn obstacles
    every 2s {
        Obstacle {
            position: (random(-100, 100), -50)
        }
    }
    
    // Spawn power-ups
    every 3s {
        PowerUp {
            position: (random(-100, 100), -50)
            type: random([speed, shield, boost])
        }
    }
    
    layer ui {
        Text("Speed: {speed:.0f}") {
            position: (20, 20)
            color: #ffffff
        }
        
        Text("Distance: {distance:.0f}m") {
            position: (20, 50)
            color: #ffffff
        }
        
        Speedometer {
            position: (screen.width - 150, screen.height - 150)
            value: speed
            max: maxSpeed
        }
    }
}
`
  },
  {
    id: 'tower-defense',
    name: 'Tower Defense',
    description: 'Build towers to defend against waves of enemies',
    category: 'strategy',
    icon: '🏰',
    difficulty: 'advanced',
    tags: ['strategy', 'towers', 'waves', 'defense'],
    code: `// Tower Defense Template
// Build towers to defend

@app "Tower Defense"
@version "1.0.0"
@target [web, ios, android]
@fps 60

state {
    gold: int = 100
    lives: int = 20
    wave: int = 1
    enemiesRemaining: int = 0
}

entity Tower {
    sprite: "tower.png"
    position: (0, 0)
    range: float = 150
    damage: int = 10
    fireRate: float = 1.0
    lastShot: float = 0
    
    update {
        // Find nearest enemy
        let nearest = find_nearest_enemy(position, range)
        if nearest != null {
            // Rotate to face enemy
            rotation = angle_to(position, nearest.position)
            
            // Shoot
            if time - lastShot > fireRate {
                spawn(Projectile) {
                    position = self.position
                    target = nearest
                    damage = self.damage
                }
                lastShot = time
                play sound(shoot)
            }
        }
    }
}

entity Enemy {
    sprite: "enemy.png"
    position: (0, 0)
    health: int = 50
    speed: float = 50
    pathIndex: int = 0
    
    update {
        // Follow path
        let path = get_path()
        if pathIndex < path.length {
            let target = path[pathIndex]
            let direction = normalize(target - position)
            position += direction * speed * delta
            
            if distance(position, target) < 10 {
                pathIndex += 1
            }
        } else {
            // Reached end
            lives -= 1
            destroy(self)
        }
    }
    
    fn take_damage(amount: int) {
        health -= amount
        if health <= 0 {
            gold += 5
            destroy(self)
        }
    }
}

entity Projectile {
    sprite: "bullet.png"
    position: (0, 0)
    target: Enemy
    damage: int
    
    update {
        if target == null {
            destroy(self)
            return
        }
        
        let direction = normalize(target.position - position)
        position += direction * 300 * delta
        
        if distance(position, target.position) < 10 {
            target.take_damage(damage)
            destroy(self)
        }
    }
}

scene Defense {
    background: #1a1a1a
    
    // Draw path
    Path {
        points: [
            (0, screen.height / 2),
            (screen.width / 2, screen.height / 2),
            (screen.width / 2, screen.height / 4),
            (screen.width, screen.height / 4)
        ]
    }
    
    // Spawn enemies
    when enemiesRemaining > 0 {
        every 1s {
            spawn(Enemy) {
                position = path[0]
            }
            enemiesRemaining -= 1
        }
    }
    
    // Start new wave
    when enemiesRemaining == 0 {
        after 3s {
            wave += 1
            enemiesRemaining = wave * 10
        }
    }
    
    layer ui {
        Text("Gold: {gold}") {
            position: (20, 20)
            color: #ffd700
        }
        
        Text("Lives: {lives}") {
            position: (20, 50)
            color: #ff0000
        }
        
        Text("Wave: {wave}") {
            position: (20, 80)
            color: #ffffff
        }
        
        TowerShop {
            position: (screen.width - 200, 20)
        }
    }
}
`
  }
]

export function getTemplateById(id: string): GameTemplate | undefined {
  return gameTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): GameTemplate[] {
  if (category === 'all') return gameTemplates
  return gameTemplates.filter(t => t.category === category)
}

export function getTemplatesByDifficulty(difficulty: string): GameTemplate[] {
  return gameTemplates.filter(t => t.difficulty === difficulty)
}

