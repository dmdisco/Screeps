require('constants');
var Role = require('role');

module.exports = class roleAttacker extends Role {
	constructor() {
		super();
		this.data = {
			name: 'Attacker',
			role: 'attacker',
		}
	}
	
	/** @param {Room} room **/
	parts(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE];
		
		return parts;
	}

    /** @param {Creep} creep **/
    run(creep) {
		if (creep.room.name != creep.memory.room_target) {
			// lets move to the room
			creep.moveTo(new RoomPosition(25, 20, creep.memory.room_target), {visualizePathStyle: {stroke: '#ffffff'}});
		} else {
			let target = this.getTarget(creep);
			
			if (target !== null) {
				// attack
				if(creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			} else {
				// goto idle
				//console.log(invaderCore);
				return;
			}
		}

    }
	
	/** @param {Creep} creep **/
	getTarget(creep) {
		/* based on Garethp */
        let closeArchers = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
			filter: function(enemy) {
				return enemy.getActiveBodyparts(RANGED_ATTACK) > 0 && creep.pos.inRangeTo(enemy, 3);
			}
		});
		
		if (closeArchers != null) {
			return closeArchers;
		}
		
		let closeMobileMelee = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
			filter: function(enemy) {
				return enemy.getActiveBodyparts(ATTACK) > 0 && enemy.getActiveBodyparts(MOVE) > 0 && creep.pos.inRangeTo(enemy, 3);
			}
		});

		if (closeMobileMelee != null) {
			return closeMobileMelee;
		}

		let closeHealer = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
			filter: function(enemy) {
				return enemy.getActiveBodyparts(HEAL) > 0 && enemy.getActiveBodyparts(MOVE) > 0 && creep.pos.inRangeTo(enemy, 3);
			}
		});

		if (closeHealer != null) {
			return closeHealer;
		}

		let invaderCore = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
		if(invaderCore != null) {
			return invaderCore;
		}
		
		// or else lets just return closest hostile
		return creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
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
		var max_of_role = 4;
		
		// get all creeps of type
		var creeps_of_type = _.filter(Game.creeps, (creep) => creep.memory.role == this.data.role);
		
		if (creeps_of_type.length >= max_of_role) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, room_target: 'W6N8'}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName);
		}
	}
}