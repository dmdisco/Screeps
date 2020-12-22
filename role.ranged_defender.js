var roleRangedDefender = {
	data: {
		name: 'RangedDefender',
		role: 'ranged_defender',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [];
		
		while ((room_energy_capacity - (BODYPART_COST.ranged_attack + BODYPART_COST.move)) >= 0) {
			parts[parts.length] = RANGED_ATTACK;
			parts[parts.length] = MOVE;
			room_energy_capacity = room_energy_capacity - (BODYPART_COST.ranged_attack + BODYPART_COST.move);
		}
		
		return parts;
	},

    /** @param {Creep} creep **/
    run: function(creep) {
		let target = this.getTarget(creep);
		target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		
		if (target !== null) {
			// attack
			creep.rangedAttack(target);
			this.kite(target, creep);
			creep.rangedAttack(target);
		} else {
			// goto idle
			creep.moveTo(Game.flags['Defender_staging']);
			return;
		}
    },
	
	/** @param {Creep} creep **/
	getTarget: function(creep) {
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

		// or else lets just return closest hostile
		return creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
	},
	
	/**
	 * All credit goes to Djinni
	 * @url https://bitbucket.org/Djinni/screeps/
	 */
	kite: function(target, creep) {
		if (target.pos.inRangeTo(creep.pos, 2)) {
			creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
			return true;
		} else if (target.pos.inRangeTo(creep.pos, 3)) {
			return true;
		} else {
			creep.moveTo(target);
			return true;
		}

		return false;
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
		var max_defenders = 1;
		
		// get all defenders
		var defenders = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (defenders.length >= max_defenders) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		console.log('Spawning new ' + this.data.role + ': ' + newName);
		spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}});
	},
};

module.exports = roleRangedDefender;