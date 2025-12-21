//! Entity Component System runtime
//! 
//! Core ECS implementation for G-Rump runtime

use std::collections::HashMap;
use std::any::{Any, TypeId};

/// Entity ID
pub type EntityId = u64;

/// Component storage
pub struct ComponentStorage {
    components: HashMap<TypeId, Vec<Option<Box<dyn Any>>>>,
    entity_to_index: HashMap<EntityId, usize>,
    next_entity_id: EntityId,
}

impl ComponentStorage {
    pub fn new() -> Self {
        Self {
            components: HashMap::new(),
            entity_to_index: HashMap::new(),
            next_entity_id: 0,
        }
    }
    
    pub fn create_entity(&mut self) -> EntityId {
        let id = self.next_entity_id;
        self.next_entity_id += 1;
        self.entity_to_index.insert(id, 0);
        id
    }
    
    pub fn add_component<T: 'static>(&mut self, entity: EntityId, component: T) {
        let type_id = TypeId::of::<T>();
        let index = *self.entity_to_index.get(&entity).unwrap_or(&0);
        
        if let Some(components) = self.components.get_mut(&type_id) {
            if index < components.len() {
                components[index] = Some(Box::new(component));
            } else {
                components.push(Some(Box::new(component)));
            }
        } else {
            let mut components = Vec::new();
            components.push(Some(Box::new(component)));
            self.components.insert(type_id, components);
        }
    }
    
    pub fn get_component<T: 'static>(&self, entity: EntityId) -> Option<&T> {
        let type_id = TypeId::of::<T>();
        let index = *self.entity_to_index.get(&entity)?;
        
        self.components.get(&type_id)?
            .get(index)?
            .as_ref()?
            .downcast_ref::<T>()
    }
}

/// Query for selecting entities with specific components
pub struct Query {
    component_types: Vec<TypeId>,
}

impl Query {
    pub fn new() -> Self {
        Self {
            component_types: Vec::new(),
        }
    }
    
    pub fn with<T: 'static>(mut self) -> Self {
        self.component_types.push(TypeId::of::<T>());
        self
    }
    
    pub fn execute(&self, storage: &ComponentStorage) -> Vec<EntityId> {
        // Find entities that have all required components
        // For now, simplified implementation
        Vec::new()  // TODO: Implement actual query execution
    }
}

/// System trait for ECS systems
pub trait System {
    fn update(&mut self, storage: &mut ComponentStorage, delta: f64);
    
    fn query(&self) -> Option<Query> {
        None  // Override to specify component requirements
    }
}

/// World - main ECS container
pub struct World {
    storage: ComponentStorage,
    systems: Vec<Box<dyn System>>,
}

impl World {
    pub fn new() -> Self {
        Self {
            storage: ComponentStorage::new(),
            systems: Vec::new(),
        }
    }
    
    pub fn create_entity(&mut self) -> EntityId {
        self.storage.create_entity()
    }
    
    pub fn add_component<T: 'static>(&mut self, entity: EntityId, component: T) {
        self.storage.add_component(entity, component);
    }
    
    pub fn get_component<T: 'static>(&self, entity: EntityId) -> Option<&T> {
        self.storage.get_component(entity)
    }
    
    pub fn add_system(&mut self, system: Box<dyn System>) {
        self.systems.push(system);
    }
    
    pub fn update(&mut self, delta: f64) {
        for system in &mut self.systems {
            // Execute query if system specifies one
            if let Some(query) = system.query() {
                let entities = query.execute(&self.storage);
                // System can use these entities
            }
            system.update(&mut self.storage, delta);
        }
    }
    
    pub fn query(&self) -> Query {
        Query::new()
    }
    
    pub fn remove_entity(&mut self, entity: EntityId) {
        // TODO: Remove entity and all its components
    }
    
    pub fn has_component<T: 'static>(&self, entity: EntityId) -> bool {
        self.storage.get_component::<T>(entity).is_some()
    }
}
