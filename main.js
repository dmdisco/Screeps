// TODO

// prioritized spawning que system
// room leveling system (0 for new room, 1 for starting etc,)
// state machine pattern
// get energy should be split up so
//   - if no containers or storage containers then go harvest
//   - elseif storage container but no container and you are a build grap from that
//   - if storage container exists then grap from that
//   - if containers exists but no storage container grap from the closest that has more than x energy in it

//require('constants');

//var stateMachine = require('state_machine');

//console.log(stateMachine.test());

let roles = [
	require('role.harvester'),
]

for (let role of roles) {
	
}

var Harvester = require('role.harvester');
var roleHarvester = new Harvester();
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var roleMiner = require('role.miner');
var roleRangedDefender = require('role.ranged_defender');
var roleClaimer = require('role.claimer');
var roleEnergyMover = require('role.energy_mover');
var roleMissionary = require('role.missionary');

const pad = (str, length, char = ' ') => str.padStart((str.length + length) / 2, char).padEnd(length, char);

// experimental
var roomMemory = require('roomMemory');

// spawnable screep roles
var spawnables = [
	roleHarvester,
	/*roleRangedDefender,*/
	roleFixer,
	roleMiner,
	roleUpgrader,
	roleBuilder,
	roleClaimer,
	roleEnergyMover,
	roleMissionary,
];

var room_names = ['W5N8', 'W6N8'];

// TODO fix so we can work in multiple rooms
var current_room = Game.rooms['W5N8'];

function catchErrors(callback) {
	try {
		callback();
	} catch(error) {
		console.log('<span style="color: #ff5454">Error: ' + error.stack + '</span>');
	}
}

room_status = function() {
	var str_pad = 35;
	var num_pad = 5;
	
	let stat = pad(' Game status ', str_pad + num_pad, '-') + '\n';
	stat += 'GCL level: '.padEnd(str_pad, ' ') + String(Game.gcl.level).padStart(num_pad, ' ') + '\n';
	stat += 'Progress to next level: '.padEnd(str_pad, ' ') + parseFloat((Game.gcl.progress / Game.gcl.progressTotal) * 100).toFixed(2) + '% [' + (Game.gcl.progress + '/' + Game.gcl.progressTotal) + ']' + '\n';
	let storage_container = Game.getObjectById('0aeeb86c8849ae6');
	stat += 'Energy reserves: '.padEnd(str_pad, ' ') + String(storage_container.store.getUsedCapacity(RESOURCE_ENERGY)).padStart(num_pad, ' ') + '\n';
	stat += '\n';
	stat += pad(' Creeps in room ', str_pad + num_pad, '-') + '\n';
	// show creeps number by role
	for (let n in spawnables) {
		let label = spawnables[n].data.role + 's: ';
		stat += label.padEnd(str_pad, ' ') + String(_.filter(current_room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == spawnables[n].data.role).length).padStart(num_pad, ' ') + '\n';
	}
	stat += ''.padEnd(str_pad + num_pad, '-') + '\n';
	
	//console.log('<span style="color: #faa">' + Game.gcl.level + '</span>');
	
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
	
	for (let room_name in Game.rooms) {
		let room = Game.rooms[room_name];
		/*if (room.manager()) {
			catchErrors(() => room.ai().run());
		}*/
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
		try {
			spawnables[n].spawn(current_room);
		} catch (err) {
			console.log(err);
		}
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
			try {
				roleHarvester.run(creep);
			} catch (err) {
				console.log(err);
			}
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
        if(creep.memory.role == 'energy_mover') {
            roleEnergyMover.run(creep);
        }
        if(creep.memory.role == 'missionary') {
            roleMissionary.run(creep);
        }
    }
	
	// display status every 10 minute
	if ((Game.time % 600) == 0) {
		console.log(room_status());
	}
}