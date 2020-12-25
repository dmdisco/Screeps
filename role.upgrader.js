var roleUpgrader = {
	data: {
		name: 'Upgrader',
		role: 'upgrader',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK, CARRY, MOVE, MOVE];
		
		if (room_energy_capacity >= 450) {
			parts = [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
		}
		if (room_energy_capacity >= 700) {
			parts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
		}
		if (room_energy_capacity >= 1250) {
			parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
		}
		
		/*// max 3 work
		let works = Math.floor((room_energy_capacity / 3) / BODYPART_COST.work);
		works = works > 3 ? 3 : works;
		
		for (let n = 0; n < works; n++) {
			parts[parts.length] = WORK;
			parts[parts.length] = MOVE;
			room_energy_capacity = room_energy_capacity - (BODYPART_COST.work + BODYPART_COST.move);
		}
		
		while ((room_energy_capacity - (BODYPART_COST.carry + BODYPART_COST.move)) >= 0) {
			parts[parts.length] = CARRY;
			parts[parts.length] = MOVE;
			room_energy_capacity = room_energy_capacity - (BODYPART_COST.carry + BODYPART_COST.move);
		}*/
		
		return parts;
	},
	
	partsCost: function(room) {
		let part_cost = 0;
		
		var parts = this.parts(room);
		
		for (let n in parts) {
			part_cost += BODYPART_COST[parts[n]];
		}
		
		return part_cost;
	},

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            //creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            //creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //5bbcaca49099fc012e635ef1
            // 
			let storage_container = Game.getObjectById('0aeeb86c8849ae6');
			if (storage_container.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
				var container = storage_container;
			} else {
				var container = Game.getObjectById('49f0726019729e6');
			}
			//var container = Game.getObjectById('49f0726019729e6');
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#05b8ff'}});
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
		var max_upgraders = 5;
		
		// get all upgraders
		var upgraders = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (upgraders.length >= max_upgraders) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName);
		}
	},
};

module.exports = roleUpgrader;