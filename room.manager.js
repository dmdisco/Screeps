require('constants');

// room manager should implement a system to handle spawning priority
/*
spawn priority list:
* 1 harvester
* if mining containers are up 1 miner
* 1 fixer
* 1 harvester
* if mining containers are up 1 miner
* 1 upgrader
* 1 builder if anything to build
* 1 fixer
* the rest of upgraders/builders and energy movers if storage is available
* utility (claim, reserve etc.) and defense/offense creeps
*/

module.exports = class RoomManager {
	constructor(room) {
		this.room_name = room;
		this.room = Game.rooms[this.room_name];
		
		if (Memory.room_levels[this.room_name] == undefined) {
			this.calculateRoomLevel();
		}
		
		this.room_level = Memory.room_levels[this.room_name];
	}
	
	run() {
		//console.log('Manager for: ' + this.room_name);
		//Game.rooms[this.room_name];
		//console.log(this.room_level);
		
		if ((Game.time % 10) == 0) {
			//console.log('Running room level update');
			// do we own the controller?
			this.calculateRoomLevel();
		}
		
		
	}
	
	calculateRoomLevel() {
		// if room level havnt been set then its 0
		
		if (Game.rooms[this.room_name].controller.my) {
			Memory.room_levels[this.room_name] = 1;
			this.room_level = 1;
			
			var targets = this.room.find(FIND_MY_SPAWNS);
			if (targets.length == 0) {
				console.log('no spawner in: ' + this.room_name);
				// we have a spawner so we can start working in this room
				this.room_level = 1;
				
				// TODO we need some sort of auto building here
				var targets = this.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length > 1) {
					// TODO here we should request a builder
				}
			} else {
				// we have a spawner so we can start working in this room
				this.room_level = 2;
			}
		} else {
			this.room_level = 0;
			Memory.room_levels[this.room_name] = 0;
		}
	}
}