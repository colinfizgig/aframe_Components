var MenuState = State.extend({
	init: function(game){
		this.game = game;

		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.Radius = Math.random()*5+18;
		this.Noise = Math.random()*8+8;
		this.pointCnt = Math.round(Math.random()*4+7);

		var num = Math.random()*5 + 5;
		this.asteroids = [];

		for (var i = 0; i < num; i++){
			var x= Math.random() * this.canvasWidth;
			var y = Math.random() * this.canvasHeight;

			var s = [.5, 1, 2][Math.round(Math.random() * 2)];

			Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
			var astr = new Asteroid(Points.ASTEROIDS[i], AsteroidSize/s, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;

			this.asteroids.push(astr);
		}
	},

	handleInputs: function(input){
		if (input.isPressed("spacebar")) {
			this.game.nextState = States.GAME;
			console.log("test");
		}
	},
	update: function(){
		for (var i=0, len = this.asteroids.length; i< len; i++) {
					this.asteroids[i].update();
				}
	},
	render: function(ctx){
		ctx.clearAll();

		for (var i=0, len = this.asteroids.length; i< len; i++) {
			this.asteroids[i].draw(ctx);
		}

		ctx.vectorText("ASTEROIDS", 6, null, 240);
		ctx.vectorText("PUSH SPACE TO PLAY", 2, null, 320);
	}
});