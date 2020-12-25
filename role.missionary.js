require('constants');
var Role = require('role');

module.exports = class roleMissionary extends Role {
	constructor() {
		super();
		this.data = {
			name: 'Missionary',
			role: 'missionary',
		}
	}
	
	/** @param {Room} room **/
	parts(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK,CARRY,MOVE,MOVE];
		
		return parts;
	}

    /** @param {Creep} creep **/
    run(creep) {
		// first go to room
		if (creep.room.name != creep.memory.room_target) {
			// lets move to the room
			creep.moveTo(new RoomPosition(25, 20, creep.memory.room_target), {visualizePathStyle: {stroke: '#ffffff'}});
		} else {
			if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: PATH_COLOR_CLAIM}});
            } else {
				creep.say('claiming');
			}
			
			/*// change role as needed
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
				// we need a builder
				creep.memory.role = 'builder';
			}*/
		}
		return;
		// then build spawner
		// then upgrade if still alive
		
		//creep.memory.room_target = 'W6N8';
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
		
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
				let target = targets[0];
				//let target = Game.getObjectById('e9a16d4d9a545b0');
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
				// goto sleep
				creep.moveTo(Game.flags['idle']);
			}
        } else {
			let source = Game.getObjectById('0d080772ccae8f2');
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
        }
		/*if (creep.carry.energy < creep.carryCapacity) {
			let source = Game.getObjectById('0d080772ccae8f2');
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}*/
		
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.upgrading) {
			var container = Game.getObjectById('0aeeb86c8849ae6');
			
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            /*let source = Game.getObjectById('68050773313e4cb');
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
            /*var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
        } else {
			if (creep.room.name != creep.memory.room_target) {
				// lets move to the room
				creep.moveTo(new RoomPosition(25, 20, creep.memory.room_target), {visualizePathStyle: {stroke: '#ffffff'}});
			} else {
				if(creep.memory.upgrading) {
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						//creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
			}
            /*var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
				// goto sleep
				creep.moveTo(Game.flags['idle']);
			}*/
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
		var max_type_of_creep = 0;
		
		// get all creeps of type
		//var creeps_of_type = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		var creeps_of_type = _.filter(Game.creeps, (creep) => creep.memory.role == this.data.role);
		
		if (creeps_of_type.length >= max_type_of_creep) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, room_target: 'W6N8'}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName);
		}
	}
}