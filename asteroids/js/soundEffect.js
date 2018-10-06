var SoundEffect = Class.extend({

	init: function(mySound, name, looping, offset){

		this.audio = document.createElement("audio");
		this.audio.id = name;

		var source = document.createElement('source');
	    source.src = mySound;

	    this.audio.appendChild(source);

		//this.audio.controls = " ";

		document.body.appendChild(this.audio);

		if(looping) {
			this.audio.addEventListener('ended', function() {
				console.log("looped");
		    	this.currentTime = offset;
		    	this.play();
			}, false);
		}
	},

});