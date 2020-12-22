var roleBuilder = {
	data: {
		name: 'Builder',
		role: 'builder',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		let parts = [WORK,CARRY,MOVE,MOVE];
		
		return parts;
	},

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            //creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            //creep.say('🚧 build');
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
			var container = Game.getObjectById('03917011f50820a');
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
		var max_builders = 2;
		
		// get all builders
		var builders = _.filter(room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == this.data.role);
		
		if (builders.length >= max_builders) {
			return false;
		}
		
		// spawn
		let newName = this.data.name + '_' + Game.time;
		console.log('Spawning new ' + this.data.role + ': ' + newName);
		spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role}});
	},
};

module.exports = roleBuilder;