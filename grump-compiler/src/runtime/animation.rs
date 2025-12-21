//! Animation Engine runtime
//! 
//! Core animation engine implementation for G-Rump runtime

/// Animation state
#[derive(Debug, Clone)]
pub enum AnimationState {
    Stopped,
    Playing,
    Paused,
    Finished,
}

/// Animation instance
pub struct Animation {
    name: String,
    duration: f64,
    current_time: f64,
    state: AnimationState,
    loop_mode: LoopMode,
}

#[derive(Debug, Clone)]
pub enum LoopMode {
    None,
    Loop,
    PingPong,
    Reverse,
}

impl Animation {
    pub fn new(name: String, duration: f64, loop_mode: LoopMode) -> Self {
        Self {
            name,
            duration,
            current_time: 0.0,
            state: AnimationState::Stopped,
            loop_mode,
        }
    }
    
    pub fn play(&mut self) {
        self.state = AnimationState::Playing;
    }
    
    pub fn pause(&mut self) {
        if matches!(self.state, AnimationState::Playing) {
            self.state = AnimationState::Paused;
        }
    }
    
    pub fn stop(&mut self) {
        self.state = AnimationState::Stopped;
        self.current_time = 0.0;
    }
    
    pub fn update(&mut self, delta: f64) {
        if !matches!(self.state, AnimationState::Playing) {
            return;
        }
        
        self.current_time += delta;
        
        match self.loop_mode {
            LoopMode::None => {
                if self.current_time >= self.duration {
                    self.current_time = self.duration;
                    self.state = AnimationState::Finished;
                }
            }
            LoopMode::Loop => {
                if self.current_time >= self.duration {
                    self.current_time = self.current_time % self.duration;
                }
            }
            LoopMode::PingPong => {
                let total = self.duration * 2.0;
                if self.current_time >= total {
                    self.current_time = self.current_time % total;
                }
            }
            LoopMode::Reverse => {
                if self.current_time >= self.duration {
                    self.current_time = self.duration - (self.current_time - self.duration);
                }
            }
        }
    }
    
    pub fn progress(&self) -> f64 {
        if self.duration > 0.0 {
            (self.current_time / self.duration).min(1.0)
        } else {
            0.0
        }
    }
}

/// Animation manager
pub struct AnimationManager {
    animations: Vec<Animation>,
    active_count: usize,
}

impl AnimationManager {
    pub fn new() -> Self {
        Self {
            animations: Vec::new(),
            active_count: 0,
        }
    }
    
    pub fn add_animation(&mut self, animation: Animation) {
        self.animations.push(animation);
    }
    
    pub fn update(&mut self, delta: f64) {
        self.active_count = 0;
        for animation in &mut self.animations {
            animation.update(delta);
            if matches!(animation.state, AnimationState::Playing) {
                self.active_count += 1;
            }
        }
    }
    
    pub fn get_animation(&self, name: &str) -> Option<&Animation> {
        self.animations.iter().find(|a| a.name == name)
    }
    
    pub fn get_animation_mut(&mut self, name: &str) -> Option<&mut Animation> {
        self.animations.iter_mut().find(|a| a.name == name)
    }
    
    pub fn play_animation(&mut self, name: &str) -> bool {
        if let Some(anim) = self.get_animation_mut(name) {
            anim.play();
            true
        } else {
            false
        }
    }
    
    pub fn stop_animation(&mut self, name: &str) -> bool {
        if let Some(anim) = self.get_animation_mut(name) {
            anim.stop();
            true
        } else {
            false
        }
    }
    
    pub fn active_count(&self) -> usize {
        self.active_count
    }
    
    pub fn clear_finished(&mut self) {
        self.animations.retain(|anim| {
            !matches!(anim.state, AnimationState::Finished)
        });
    }
}
