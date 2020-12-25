require('constants');

module.exports = class RoomExpansion {
	constructor(room) {
		/*this.room_name = room;
		
		if (Memory.room_levels[this.room_name] == undefined) {
			this.calculateRoomLevel();
		}
		
		this.room_level = Memory.room_levels[this.room_name];*/
	}
	
	run() {
		//console.log('Manager for: ' + this.room_name);
		//Game.rooms[this.room_name];
		//console.log(this.room_level);
		
		/*if ((Game.time % 10) == 0) {
			console.log('Running room level update');
			// do we own the controller?
			this.calculateRoomLevel();
		}*/
		
		
	}
	
	calculateRoomLevel() {
		// if room level havnt been set then its 0
		
		/*if (Game.rooms[this.room_name].controller.my) {
			console.log('We own: ' + this.room_name);
			Memory.room_levels[this.room_name] = 1;
			this.room_level = 1;
		} else {
			this.room_level = 0;
			Memory.room_levels[this.room_name] = 0;
			console.log('We do not own: ' + this.room_name);
		}*/
	}
}