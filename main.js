// TODO

// prioritized spawning que system
// room leveling system (0 for new room, 1 for starting etc,)



var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var roleMiner = require('role.miner');
var roleRangedDefender = require('role.ranged_defender');
var roleClaimer = require('role.claimer');

// experimental
var roomMemory = require('roomMemory');

// spawnable screep roles
var spawnables = [
	roleHarvester,
	roleRangedDefender,
	roleFixer,
	roleMiner,
	roleUpgrader,
	roleBuilder,
	roleClaimer,
];

var room_names = ['W5N8', 'W6N8'];

// TODO fix so we can work in multiple rooms
var current_room = Game.rooms['W5N8'];

room_status = function() {
	let stat= '===== Game status =====';
	stat += 'GCL progress:\n';
	stat += 'current level: ' + Game.gcl.level + '\n';
	stat += 'Progress to next level: ' + parseFloat((Game.gcl.progress / Game.gcl.progressTotal) * 100).toFixed(2) + '% [' + (Game.gcl.progress + '/' + Game.gcl.progressTotal) + ']' + '\n';
	stat += 'Creeps in room by role\n----------------------\n';
	// show creeps number by role
	for (let n in spawnables) {
		let label = spawnables[n].data.role + 's: ';
		stat += label.padEnd(20, ' ') + String(_.filter(current_room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == spawnables[n].data.role).length).padStart(2, ' ') + '\n';
	}
	stat += '=======================\n';
	
	return stat;
}

module.exports.loop = function () {
    // collect garbage globally
	for (var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
	
	for (var name in Memory.spawns) {
		if (!Game.spawns[name]) {
			delete Memory.spawns[name];
			console.log('Clearing non-existing spawn memory:', name);
		}
	}
	
	/*for(var spawnName in Game.spawns){
		console.log(Game.spawns[spawnName]);
	}*/
	
	// loop through each room we have on the list
	/*for (let n in room_names) {
		if (Game.rooms[room_names[n]]) {
			// room is active so lets run it
		} else {
			// room is listed but not acctive lets send a scouting party
		}
		//console.log(Game.rooms[room_names[n]]);
	}*/

	// spawn new creeps if any are missing
	for (let n in spawnables) {
		spawnables[n].spawn(current_room);
	}

    // display spawning message at spawn
	if (Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            ' ' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
   // run screeps
   for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'ranged_defender') {
            roleRangedDefender.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
	
	// display status every 10 minute
	if ((Game.time % 600) == 0) {
		console.log(room_status());
	}
}