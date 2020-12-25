//require('constants');
var Role = require('role');

class roleHarvester extends Role {
	constructor() {
		super();
		this.data = {
			name: 'Harvester',
			role: 'harvester',
		}
		
		this.test();
	}
	
		/** @param {Room} room **/
	parts(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK,CARRY,MOVE,MOVE];
		
		/*if (room.energyAvailable > 300 && room_energy_capacity >= 500) {
			parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
		}*/
		
		return parts;
	}

    /** @param {Creep} creep **/
    run(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
			// find where to draw energy from
			let source_target = undefined;
			let use_storage = true;
			
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
        } else {
			// reset source so it recalculate next time
			creep.memory.source = undefined;
			
            // find the closest target
			let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
			
			// if there is no targets to fill then relax
			if (target == null) {
				creep.moveTo(Game.flags['idle']);
			}
			//creep.memory.target = target.id;
			
            if (target) {
				//creep.memory.target = target.id;
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
				// goto sleep
				creep.moveTo(Game.flags['idle']);
			}
        }
    }
	
	/** @param {Room} room **/
	spawn(room) {
		// TODO change this to closest room spawner
		var spawn = Game.spawns['Spawn1'];
		
		// if spawn is allready spawning then lets just skip for now
		if (spawn.spawning) {
			return false;
		}
		
		// TODO change this to be calculated by the room
		var max_harvesters = 2;
		
		// get all harvesters
		var harvesters = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (harvesters.length >= max_harvesters) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName);
		}
	}
}

module.exports = new roleHarvester;

// module.exports = {
	// data: {
		// name: 'Harvester',
		// role: 'harvester',
	// },
	
	// /** @param {Room} room **/
	// parts: function(room) {
		// let room_energy_capacity = room.energyCapacityAvailable;
		
		// let parts = [WORK,CARRY,MOVE,MOVE];
		
		// /*if (room.energyAvailable > 300 && room_energy_capacity >= 500) {
			// parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
		// }*/
		
		// return parts;
	// },

    // /** @param {Creep} creep **/
    // run: function(creep) {
        // if (creep.carry.energy < creep.carryCapacity) {
			// // find where to draw energy from
			// let source_target = undefined;
			// let use_storage = true;
			
			// if (creep.memory.source == undefined) {
				// // should we get from storage
				// if (use_storage && creep.room.storage && creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {
					// source_target = creep.room.storage;
				// } else {
					// // get closest container with energy in it
					// let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
						// filter: (structure) => {
							// return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 1000;
						// }
					// });
					
					// // are there any containers with more than 1k energy
					// if (container) {
						// source_target = container;
					// } else {
						// let source = creep.pos.findClosestByPath(FIND_SOURCES);
						// // TODO maybe check for sources cause they could have been blocked
						// source_target = source;
					// }
				// }
				
				// creep.memory.source = source_target.id;
			// } else {
				// source_target = Game.getObjectById(creep.memory.source);
			// }
			
			// // if the target is a source then harvest else withdraw
			// if (source_target instanceof Source) {
				// if(creep.harvest(source_target) == ERR_NOT_IN_RANGE) {
					// creep.moveTo(source_target, {visualizePathStyle: {stroke: '#ffaa00'}});
				// }
			// } else {
				// if (creep.withdraw(source_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					// creep.moveTo(source_target, {visualizePathStyle: {stroke: '#ffaa00'}});
				// }
			// }
        // } else {
			// // reset source so it recalculate next time
			// creep.memory.source = undefined;
			
            // // find the closest target
			// let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                // filter: (structure) => {
                    // return (structure.structureType == STRUCTURE_EXTENSION ||
                        // structure.structureType == STRUCTURE_SPAWN ||
                        // structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                // }
            // });
			
			// // if there is no targets to fill then relax
			// if (target == null) {
				// creep.moveTo(Game.flags['idle']);
			// }
			// //creep.memory.target = target.id;
			
            // if (target) {
				// //creep.memory.target = target.id;
                // if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                // }
            // } else {
				// // goto sleep
				// creep.moveTo(Game.flags['idle']);
			// }
        // }
    // },
	
	// /** @param {Room} room **/
	// spawn: function(room) {
		// // TODO change this to closest room spawner
		// var spawn = Game.spawns['Spawn1'];
		
		// // if spawn is allready spawning then lets just skip for now
		// if (spawn.spawning) {
			// return false;
		// }
		
		// // TODO change this to be calculated by the room
		// var max_harvesters = 2;
		
		// // get all harvesters
		// var harvesters = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		// if (harvesters.length >= max_harvesters) {
			// return false;
		// }
		
		// // spawn
		// let newName = this.data.name + '_' + Game.time;
		// if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}}) == OK) {
			// console.log('Spawning new ' + this.data.role + ': ' + newName);
		// }
	// },
// };