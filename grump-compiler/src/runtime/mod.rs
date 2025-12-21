//! Runtime Library for G-Rump
//! 
//! Core runtime components (game loop, ECS, animation engine, etc.)

pub mod ecs;
pub mod animation;
pub mod game_loop;

/// Runtime configuration
pub struct RuntimeConfig {
    pub target_fps: f64,
    pub enable_profiling: bool,
    pub max_entities: usize,
    pub animation_pool_size: usize,
}

impl Default for RuntimeConfig {
    fn default() -> Self {
        Self {
            target_fps: 60.0,
            enable_profiling: false,
            max_entities: 10000,
            animation_pool_size: 100,
        }
    }
}

/// Main runtime instance
pub struct Runtime {
    pub game_loop: game_loop::GameLoop,
    pub world: ecs::World,
    pub animation_manager: animation::AnimationManager,
    pub config: RuntimeConfig,
}

impl Runtime {
    pub fn new(config: RuntimeConfig) -> Self {
        let game_loop_config = game_loop::GameLoopConfig {
            target_fps: config.target_fps,
            max_delta: 1.0 / 30.0,
        };
        
        Self {
            game_loop: game_loop::GameLoop::new(game_loop_config),
            world: ecs::World::new(),
            animation_manager: animation::AnimationManager::new(),
            config,
        }
    }
    
    pub fn update(&mut self, delta: f64) {
        self.game_loop.update(delta);
        self.world.update(delta);
        self.animation_manager.update(delta);
    }
    
    pub fn start(&mut self) {
        self.game_loop.start();
    }
    
    pub fn stop(&mut self) {
        self.game_loop.stop();
    }
}

