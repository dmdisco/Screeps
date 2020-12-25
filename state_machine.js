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
				runSpawning(creep, STATE_MOVING);
				break;
			case STATE_MOVING:
				runMoving(creep);
				break;
			case STATE_HARVESTING:
				runHarvesting(creep, STATE_GRAB_RESOURCE);
				break;
			case STATE_DEPOSIT_RESOURCE:
				runDepositing(creep, STATE_MOVING);
				break;
			case STATE_GRAB_RESOURCE:
				runGrabResource(creep, STATE_MOVING);
				break;
		}
	},
}