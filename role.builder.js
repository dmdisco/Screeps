require('constants');
var Role = require('role');

module.exports = class roleBuilder extends Role {
	constructor() {
		super();
		this.data = {
			name: 'Builder',
			role: 'builder',
		}
	}
	
	/** @param {Room} room **/
	parts(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK, CARRY, MOVE, MOVE];
		
		if (room_energy_capacity >= 500) {
			parts = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
		}
		if (room_energy_capacity >= 700) {
			parts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
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

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
			creep.memory.source = undefined;
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
				let target = targets[0];
				//let target = Game.getObjectById('761c4969181bac1');
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
				// goto sleep
				creep.moveTo(Game.flags['idle_' + creep.memory.home]);
			}
        } else {
			this.getEnergy(creep, true);
			/*let storage_container = Game.getObjectById('0aeeb86c8849ae6');
			if (storage_container.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
				var container = storage_container;
			} else {
				var container = Game.getObjectById('49f0726019729e6');
			}
			//var container = Game.getObjectById('03917011f50820a');
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#05b8ff'}});
            }
            //var sources = creep.room.find(FIND_SOURCES);
			//let source = sources[0];
			/*let source = Game.getObjectById('03917011f50820a');
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#05b8ff'}});
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
		
		// nothing to build so dont spawn
		var targets = room.find(FIND_CONSTRUCTION_SITES);
		if (targets.length == 0) {
			return false;
		}
		
		let room_energy_capacity = room.energyCapacityAvailable;
		
		// TODO change this to be calculated by the room
		var max_builders = 1;
		
		if (room_energy_capacity > 550) {
			var max_builders = 3;
		}
		
		// get all builders
		var builders = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (builders.length >= max_builders) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, home: room.name}}) == OK) {
			console.log('Spawning new ' + this.data.role + ': ' + newName + ' in: ' + room.name);
		}

	}
}