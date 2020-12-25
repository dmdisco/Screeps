require('constants');

class Role {
	hasEnergy(creep) {
		// for now just return true if full
		return (creep.carry.energy < creep.carryCapacity);
	}
	
	setSourceId(creep, sourceId) {
		creep.memory.source = sourceId;
	}
	
	getSourceId(creep) {
		if (creep.memory.source == undefined) {
			let use_storage = true;
			switch (creep.memory.role) {
				case 'energy_mover':
					use_storage = false;
					break;
				default:
			}
		} else {
			return creep.memory.source;
		}
	}
	
	getEnergy(creep, use_storage) {
		// find where to draw energy from
		let source_target = undefined;
		
		if (creep.memory.source == undefined) {
			// should we get from storage
			if (use_storage && creep.room.storage && creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {
				source_target = creep.room.storage;
			} else {
				// get closest container with energy in it
				let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 1000;
					}
				});
				
				// are there any containers with more than 1k energy
				if (container) {
					source_target = container;
				} else {
					let source = creep.pos.findClosestByPath(FIND_SOURCES);
					// TODO maybe check for sources cause they could have been blocked
					source_target = source;
				}
			}
			
			creep.memory.source = source_target.id;
		} else {
			source_target = Game.getObjectById(creep.memory.source);
		}
		
		// if the target is a source then harvest else withdraw
		if (source_target instanceof Source) {
			if(creep.harvest(source_target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source_target, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		} else {
			if (creep.withdraw(source_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source_target, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}
}

module.exports = Role;