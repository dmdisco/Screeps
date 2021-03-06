require('constants');
var Role = require('role');

module.exports = class roleFixer extends Role {
	constructor() {
		super();
		this.data = {
			name: 'Fixer',
			role: 'fixer',
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
		// move to correct room
		if (creep.room.name != creep.memory.home) {
			// lets move to the room
			creep.moveTo(new RoomPosition(25, 20, creep.memory.home), {visualizePathStyle: {stroke: '#ffffff'}});
			return;
		}
		
        if(creep.memory.fixing && creep.carry.energy == 0) {
            creep.memory.fixing = false;
        }
        if(!creep.memory.fixing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fixing = true;
        }

        if(creep.memory.fixing) {
			creep.memory.source = undefined;
            /*var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }*/
            if (creep.memory.fixing === true) {
                // lets find a target to repair
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
				
				if (targets.length) {
					//console.log(targets);
					targets.sort((a,b) => a.hits - b.hits);
					
					targets.forEach(function(structure) {
					   if (structure.structureType == STRUCTURE_WALL) {
						   // only fix to max wall hp
						   if (structure.hits < 400) {
								creep.memory.fixing = structure.id;
						   }
					   } else {
						   // fix it
						   creep.memory.fixing = structure.id;
					   }
					});
					
					// temp fix for only walls to fix
					if (creep.memory.fixing === true) {
						creep.moveTo(Game.flags['idle_' + creep.memory.home]);
					}
				} else {
					// goto sleep
					creep.moveTo(Game.flags['idle_' + creep.memory.home]);
				}
            } else {
                //
                var target = Game.getObjectById(creep.memory.fixing);
				if (target.hits < target.hitsMax) {
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ff1100'}});
					}
				} else {
					creep.memory.fixing = false;
				}
            }
        } else {
			this.getEnergy(creep, true);
			/*var container = Game.getObjectById('0aeeb86c8849ae6');
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            /*let source = Game.getObjectById('9fa9077331385d3');
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
            /*var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
        }
    }
	
	/** @param {Room} room **/
	spawn(room) {
		// TODO change this to closest room spawner
		let spawn = this.getSpawn(room);
		
		// if spawn is allready spawning then lets just skip for now
		if (spawn.spawning) {
			return false;
		}
		
		let room_energy_capacity = room.energyCapacityAvailable;
		
		// TODO change this to be calculated by the room
		var max_fixers = 1;
		
		if (room_energy_capacity > 500) {
			var max_fixers = 2;
		}
		
		// get all fixers
		var fixers = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		//if (room.name == 'W6N8') console.log(fixers.length >= max_fixers);
		
		if (fixers.length >= max_fixers) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, home: room.name}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName + ' in: ' + room.name);
		}
	}
}