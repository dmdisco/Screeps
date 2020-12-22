var roleMiner = {
	data: {
		name: 'Miner',
		role: 'miner',
	},
	
	/** @param {Room} room **/
	parts: function(room) {
		let room_energy_capacity = room.energyCapacityAvailable;
		
		// we need a move and the rest can be work
		let parts = [MOVE];
		room_energy_capacity = room_energy_capacity - BODYPART_COST.move;
		
		let max_work_parts = 5;
		
		// as long as we can pay the bill and we arnt reaching our limits lets add a work part
		while ((room_energy_capacity - BODYPART_COST.work) >= 0 && max_work_parts-- > 0) {
			parts[parts.length] = WORK;
			room_energy_capacity = room_energy_capacity - BODYPART_COST.work;
		}
		
		return parts;
	},

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.containerId) {
            // we need a new containerId
            let containers = creep.room.find(FIND_STRUCTURES, {
               filter: (structure) => {
                   return structure.structureType == STRUCTURE_CONTAINER;
               }
            });
            
            var usedContainers = [];
            
            // lets find other miners (shouldnt be more than sources in the room)
            for(let name in Game.creeps) {
                let minerCreep = Game.creeps[name];
                if(minerCreep.memory.role == 'miner') {
                    if (minerCreep.memory.containerId) {
                        usedContainers[usedContainers.length] = minerCreep.memory.containerId;
                    }
                }
            }
            
            for (let containerIdx in containers) {
                if (usedContainers.indexOf(containers[containerIdx].id) < 0) {
                    creep.memory.containerId = containers[containerIdx].id;
                    break;
                }
            }
        }
        
        // we dont have a sourceId yet so lets move to the container
        if (!creep.memory.sourceId) {
            var container = Game.getObjectById(creep.memory.containerId);
            if (creep.pos.getRangeTo(container) == 0) {
                // we are at the container, lets find the nearest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.sourceId = source.id;
                creep.say('Mining', true);
            } else {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ff0000'}});
                creep.say('Move away', true);
            }
        }
        
        if (creep.memory.sourceId) {
            // harvest
            var source = Game.getObjectById(creep.memory.sourceId);
            creep.harvest(source);
            // say status of container
            if (Game.time % 60 == 0) {
                var container = Game.getObjectById(creep.memory.containerId);
                creep.say('In: ' + container.store.energy);
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
		
		// lets find all containers so we can know how many miners we need
		let containers = room.find(FIND_STRUCTURES, {
		   filter: (structure) => {
			   return structure.structureType == STRUCTURE_CONTAINER;
		   }
		});
		
		// no containers so no need for miners
		if (containers.length == 0) {
			return false;
		}
		
		// get all miners
		var miners = _.filter(Game.creeps, (creep) => creep.memory.role == this.data.role);
		
		// array of used containers
		var usedContainers = [];
		
		// no need to spawn miners if we have the correct amount
		if (containers.length > miners.length) {
			let assigned_container = undefined;
			
			// check all miners and see which container they use
			for (let n in miners) {
				if (miners[n].memory.containerId) {
					usedContainers[usedContainers.length] = miners[n].memory.containerId;
				}
			}
			
            // lets find the first free container
			for (let containerIdx in containers) {
                if (usedContainers.indexOf(containers[containerIdx].id) < 0) {
                    assigned_container = containers[containerIdx].id;
                    break;
                }
            }
			
			// spawn
			let newName = this.data.name + '_' + Game.time;
			if (spawn.spawnCreep(this.parts(room), newName, {memory: {role: this.data.role, containerId: assigned_container}}) == OK) {
				console.log('Spawning new ' + this.data.role + ': ' + newName);
			}
		}
	},
};

module.exports = roleMiner;