var roleClaimer = {
	data: {
		name: 'Claimer',
		role: 'claimer',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [MOVE,CLAIM,CLAIM];
		
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
		if (creep.room.name != creep.memory.room_target) {
			// lets move to the room
			creep.moveTo(new RoomPosition(25, 20, creep.memory.room_target), {visualizePathStyle: {stroke: '#ffffff'}});
		} else {
			// can i claim a room
			if (Game.gcl.level > Game.rooms.length) {
				// and when we are in the room lets move to the controller
				if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			} else {
				// and when we are in the room lets move to the controller
				if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
				}
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
		var max_type_of_creep = 0;
		
		// get all creeps of this type (globally)
		var creeps_of_type = _.filter(Game.creeps, (creep) => creep.memory.role == this.data.role);
		
		if (creeps_of_type.length >= max_type_of_creep) {
			return false;
		}
		
		// spawn
		if (this.partsCost(room) <= room.energyAvailable) {
			let newName = this.data.name + '_' + Game.time;
			console.log('Spawning new ' + this.data.role + ': ' + newName);
			spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, room_target: 'W6N8'}});
		}
	},
};

module.exports = roleClaimer;