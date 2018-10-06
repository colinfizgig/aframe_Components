var States = {
	NO_CHANGE: 0,
	MENU: 1,
	GAME: 2,
	END: 3
}

var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	//xS = w.innerWidth || e.clientWidth || g.clientWidth,
	//yS = w.innerHeight|| e.clientHeight|| g.clientHeight;
	xS = 512;
	yS = 512;

var Game = Class.extend({
	init: function(){
		this.canvas = new Canvas(xS, yS);

		this.soundEffect1 = new SoundEffect(Audios.EXPLODE1, "explosion1", false, 0);
		this.soundEffect2 = new SoundEffect(Audios.EXPLODE2, "explosion2", false, 0);
		this.soundEffect3 = new SoundEffect(Audios.EXPLODE1, "explosion3", false, 0);
		this.soundEffect4 = new SoundEffect(Audios.FIRE, "fire", false, 0);
		this.soundEffect5 = new SoundEffect(Audios.LIVES, "lives", false, 0);
		this.soundEffect6 = new SoundEffect(Audios.THRUST, "thrust", true, 0.001);
		this.soundEffect7 = new SoundEffect(Audios.THUMPHI, "thumpHi", false, 0);
		this.soundEffect7 = new SoundEffect(Audios.THUMPLOW, "thumpLow", false, 0);

		this.input = new InputHandeler({
			left: 		74,
			up: 		73,
			right: 		76,
			down: 		77,
			spacebar: 	32,
			enter:   	13
		});

		this.canvas.ctx.strokeStyle = "#fff";
		this.currentState = null;
		this.stateVars = {
			score: 0
		}

		this.nextState = States.MENU;
	},

	run: function(){
		var self = this;

		this.canvas.animate(function(){
			if(self.nextState !== States.N0_CHANGE) {
				switch(self.nextState){
					case States.MENU:
						self.currentState = new MenuState(self);
						break;
					case States.GAME:
						self.currentState = new GameState(self);
						break;
					case States.END:
						self.currentState = new EndState(self);
						break;

				}
				self.nextState = States.N0_CHANGE;
			}
			self.currentState.handleInputs(self.input);
			self.currentState.update();
			self.currentState.render(self.canvas.ctx);
		});
	}	

});