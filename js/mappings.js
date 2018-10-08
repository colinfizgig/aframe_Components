var mappings = {
		mappings: {
			default: {
			common: {
				trackpaddown: 'teleportstart',
				trackpadup: 'teleportend'
			},
			'oculus-touch-controls': {
				ybuttondown: 'teleportstart',
				ybuttonup: 'teleportend',
				bbuttondown: 'teleportstart',
				bbuttonup: 'teleportend'
				
			},
			keyboard: {
			't_down': 'teleportstart',
			't_up': 'teleportend'
			}
		}
	}
	};

AFRAME.registerInputMappings(mappings);