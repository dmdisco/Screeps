require('constants');
var Role = require('role');

module.exports = class roleEnergyMover extends Role {
	constructor() {
		super();
		this.data = {
			name: 'EnergyMover',
			role: 'energy_mover',
		}
	}
	
	/** @param {Room} room **/
	parts(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
		
		if (room_energy_capacity >= 500) {
			parts = [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
		}
		
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
		
	    if(creep.carry.energy < creep.carryCapacity) {
	        // if no containerId is set then select a new
	        if (!creep.memory.containerId) {
            	var target = creep.room.find(FIND_DROPPED_RESOURCES);
            	if(target.length) {
            	    if (creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
            	        creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
            	    } else {
            	        creep.say('pickup');
            	    }
                } else {
                    // get all containers in the room
    	            var containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 500);
                        }
                    });
                    
                    if (!containers.length) {
                        creep.say('Paused');
                        creep.moveTo(Game.flags['idle_' + creep.memory.home], {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
    
                    var selectedContainer = creep.pos.findClosestByPath(containers);
                    if (containers.length > 1) {
                        var allContainers = [];
                        
                        // lets the container with most energy
                        for (let containerIdx in containers) {
                            allContainers.push( { energyPercent: ( ( containers[containerIdx].store.energy / containers[containerIdx].storeCapacity ) * 100 ), id: containers[containerIdx].id } );
                        }
                        
                        var selectedContainer = _.max( allContainers, function( container ){ return container.energyPercent; });
                    }
                    
                    if (selectedContainer == undefined) {
						creep.memory.containerId = undefined;
					} else {
						creep.memory.containerId = selectedContainer.id;
					}
                }
	        }
	        var container = Game.getObjectById(creep.memory.containerId);
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.memory.containerId = false;
            // drop off energy in storage container
            var storageContainer = Game.getObjectById('0aeeb86c8849ae6');
            if(creep.transfer(storageContainer, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storageContainer, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
	
	/** @param {Room} room **/
	spawn(room) {
		// TODO change this to closest room spawner
		let spawn = this.getSpawn(room);
		
		if (!room.storage) {
			return false;
		}
		
		// if spawn is allready spawning then lets just skip for now
		if (spawn.spawning) {
			return false;
		}
		
		// TODO change this to be calculated by the room
		var max_type_of_creep = 2;
		
		// get all creeps of this type
		var creeps_of_type = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (creeps_of_type.length >= max_type_of_creep) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, home: room.name}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName + ' in: ' + room.name);
		}
	}
}