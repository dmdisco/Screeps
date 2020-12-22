var roleHarvester = {
	data: {
		name: 'Harvester',
		role: 'harvester',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK,CARRY,MOVE,MOVE];
		
		if (room.energyAvailable > 300 && room_energy_capacity >= 500) {
			parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
		}
		
		return parts;
	},

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
			var container = Game.getObjectById('03917011f50820a');
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            /*let source = Game.getObjectById('68050773313e4cb');
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
            /*var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
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
			}
        }
    },
	
	/** @param {Room} room **/
	spawn: function(room) {
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
		console.log('Spawning new ' + this.data.role + ': ' + newName);
		spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}});
	},
};

module.exports = roleHarvester;