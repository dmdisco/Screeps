/* creep states constants */
require('role');
module.exports = {
	test: function() {
		return 'state machine';
	},

	run: function(creep) {
		if(!creep.memory.state) {
			creep.memory.state = STATE_SPAWNING;
		}
		
		switch(creep.memory.state) {
			case STATE_SPAWNING:
				runSpawning(creep);
				break;
			case STATE_MOVING:
				runMoving(creep);
				break;
			case STATE_HARVESTING:
				runHarvesting(creep);
				break;
			case STATE_DEPOSIT_RESOURCE:
				runDepositing(creep);
				break;
			case STATE_GRAB_RESOURCE:
				runGrabResource(creep);
				break;
		}
	},
}