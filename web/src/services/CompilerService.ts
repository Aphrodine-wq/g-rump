
// Grump Compiler Service
// Transpiles GrumpDSL to executable JavaScript for the web runtime

interface CompilationResult {
  success: boolean;
  output: string; // HTML string with embedded game
  error?: string;
}

export class CompilerService {
  private static readonly RUNTIME_CORE = `
    class GameEngine {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.entities = [];
        this.systems = [];
        this.lastTime = 0;
        this.input = {
          left: false, right: false, up: false, down: false, jump: false,
          keys: {}
        };
        
        this.setupInput();
      }

      setupInput() {
        window.addEventListener('keydown', (e) => {
          this.input.keys[e.code] = true;
          this.mapInput(e.code, true);
        });
        window.addEventListener('keyup', (e) => {
          this.input.keys[e.code] = false;
          this.mapInput(e.code, false);
        });
      }

      mapInput(code, state) {
        if (code === 'ArrowLeft' || code === 'KeyA') this.input.left = state;
        if (code === 'ArrowRight' || code === 'KeyD') this.input.right = state;
        if (code === 'ArrowUp' || code === 'KeyW') this.input.up = state;
        if (code === 'ArrowDown' || code === 'KeyS') this.input.down = state;
        if (code === 'Space') this.input.jump = state;
      }

      addEntity(entity) {
        this.entities.push(entity);
      }

      addSystem(system) {
        this.systems.push(system);
      }

      start() {
        requestAnimationFrame((t) => this.loop(t));
      }

      loop(time) {
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Clear screen
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Run Systems
        this.systems.forEach(sys => sys(this.entities, deltaTime, this.input, this.ctx));

        // Render Entities (Default Renderer)
        this.entities.forEach(entity => {
          if (entity.sprite) {
             // Placeholder for sprite rendering
             this.ctx.fillStyle = entity.color || '#fff';
             this.ctx.beginPath();
             if (entity.shape === 'circle') {
                this.ctx.arc(entity.position.x, entity.position.y, entity.radius || 10, 0, Math.PI * 2);
             } else {
                this.ctx.fillRect(entity.position.x, entity.position.y, entity.width || 32, entity.height || 32);
             }
             this.ctx.fill();
          }
        });

        requestAnimationFrame((t) => this.loop(t));
      }
    }

    // Physics System Implementation
    const physicsSystem = (entities, dt, input) => {
       entities.forEach(entity => {
          if (entity.physics) {
             // Apply Gravity
             if (entity.physics.gravity) {
                entity.velocity.y += 980 * dt;
             }

             // Apply Velocity
             entity.position.x += entity.velocity.x * dt;
             entity.position.y += entity.velocity.y * dt;

             // Floor Collision (Simple)
             if (entity.position.y > 500) {
                entity.position.y = 500;
                entity.velocity.y = 0;
             }
          }
       });
    };
  `;

  public static compile(sourceCode: string, _platform: string = 'web'): CompilationResult {
    try {
      // 1. Parse Metadata
      const titleMatch = sourceCode.match(/@app\s+"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Untitled Game';

      // 2. Parse State
      // const _stateBlock = this.extractBlock(sourceCode, 'state');
      
      // 3. Parse Entities
      const entities = this.parseEntities(sourceCode);

      // 4. Parse Systems
      const systems = this.parseSystems(sourceCode);

      // 5. Generate JavaScript
      const generatedJs = this.generateJs(entities, systems);

      // 6. Construct HTML
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { margin: 0; background: #111; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; font-family: sans-serif; }
            canvas { background: #1a1a1a; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
          </style>
        </head>
        <body>
          <canvas id="gameCanvas" width="800" height="600"></canvas>
          <script>
            ${this.RUNTIME_CORE}

            // Generated Game Code
            const game = new GameEngine('gameCanvas');

            ${generatedJs}

            game.addSystem(physicsSystem);
            game.start();
          </script>
        </body>
        </html>
      `;

      return { success: true, output: html };

    } catch (error: any) {
      return { success: false, output: '', error: error.message };
    }
  }

/*
  private static _extractBlock(source: string, blockName: string): string {
    const regex = new RegExp(`${blockName}\\s*\\{([^}]+)\\}`, 's');
    const match = source.match(regex);
    return match ? match[1] : '';
  }
*/

  private static parseEntities(source: string): any[] {
    const entities: any[] = [];
    const regex = /entity\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = regex.exec(source)) !== null) {
      const name = match[1];
      const body = match[2];
      
      // Parse Properties
      const spriteMatch = body.match(/sprite:\s*"([^"]+)"/);
      const posMatch = body.match(/position:\s*\(([^,]+),\s*([^)]+)\)/);
      const physicsMatch = body.match(/physics\s*\{([^}]+)\}/);
      const updateBlock = this.extractUpdateBlock(body);

      entities.push({
        name,
        sprite: spriteMatch ? spriteMatch[1] : null,
        position: posMatch ? { x: posMatch[1], y: posMatch[2] } : { x: 0, y: 0 },
        physics: physicsMatch ? physicsMatch[1] : null,
        updateLogic: updateBlock
      });
    }
    return entities;
  }

  private static extractUpdateBlock(entityBody: string): string {
    const match = entityBody.match(/update\s*\{([^}]+)\}/);
    return match ? match[1] : '';
  }

  private static parseSystems(_source: string): string[] {
    const systems: string[] = [];
    // Basic system parser implementation
    return systems;
  }

  private static generateJs(entities: any[], _systems: any[]): string {
    let js = '';

    // Generate Entities
    entities.forEach(entity => {
      // Transpile DSL logic to JS
      let logic = entity.updateLogic
        .replace(/input\.left/g, 'input.left')
        .replace(/input\.right/g, 'input.right')
        .replace(/input\.jump/g, 'input.jump')
        .replace(/is_grounded\(\)/g, 'entity.position.y >= 500') // Simple ground check transpilation
        .replace(/velocity\.x/g, 'entity.velocity.x')
        .replace(/velocity\.y/g, 'entity.velocity.y');

      js += `
        // Entity: ${entity.name}
        const ${entity.name.toLowerCase()} = {
          name: "${entity.name}",
          position: { x: ${this.cleanValue(entity.position.x)}, y: ${this.cleanValue(entity.position.y)} },
          velocity: { x: 0, y: 0 },
          sprite: "${entity.sprite || ''}",
          shape: "${entity.physics && entity.physics.includes('circle') ? 'circle' : 'rect'}",
          physics: {
            gravity: ${entity.physics && entity.physics.includes('gravity: true')},
            body: "${entity.physics ? 'dynamic' : 'static'}"
          }
        };
        game.addEntity(${entity.name.toLowerCase()});

        // Entity Update System
        game.addSystem((entities, dt, input, ctx) => {
           const entity = ${entity.name.toLowerCase()};
           ${logic}
        });
      `;
    });

    return js;
  }

  private static cleanValue(val: string): string {
    if (val.includes('screen.center.x')) return '400';
    if (val.includes('screen.center.y')) return '300';
    return val;
  }
}
