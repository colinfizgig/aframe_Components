
var AsteroidSize = 2;
var DebrisSize = 1;


var GameState = State.extend({
	
	init: function(game){
		this._super(game);
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.ship = new Ship(Points.SHIP, Points.EXHAUST, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		this.lives = 3;
		this.lifeUp = 4000;
		this.lifeTicker = 0;

		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1.5);
		this.lifepolygon.rotate(-Math.PI/2);

		this.gameOver = false;

		this.score = 0;

		this.lvl = 1;

		this.generateLvl();

		this.musicBeat = 70;
		this.thumpPause = this.musicBeat;
		this.timer = 0;
	},

	generateLvl: function() {

		this.thumpPause = this.musicBeat - this.lvl;

		var num = Math.round(15*Math.atan(this.lvl/50)) + Math.min(10, Math.max(3, (Math.round(this.lvl/20))));

		this.ship.x = this.canvasWidth/2;
		this.ship.y = this. canvasHeight/2;

		this.bullets = [];

		this.Radius = Math.random()*5+18;
		this.Noise = Math.random()*8+8;
		this.pointCnt = Math.round(Math.random()*4+7);

		this.asteroids = [];

		this.debris = [];

		for (var i = 0; i < num; i++){
			var x = 0, y = 0;
			if (Math.random() > 0.5) {
				x= Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}
			Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
			var astr = new Asteroid(Points.ASTEROIDS[i], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;

			this.asteroids.push(astr);
		}

	},

	handleInputs: function(input){
		var fireSound = document.getElementById("fire");

		if(!this.ship.visible) {
			if(input.isPressed("spacebar")) {
				if (this.gameOver){
					this.game.nextState = States.END;
					this.game.stateVars.score = this.score;
					return;
				}
				this.ship.visible = true;
			}

			return;
		}

		if(input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if(input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		if(input.isDown("up")) {
			this.ship.addVel();
		}


		if(input.isPressed("spacebar")) {
			
			this.bullets.push(this.ship.shoot());

			fireSound.pause();
			fireSound.currentTime = 0;
			fireSound.play();
		}
	},

	update: function() {

		var thumpHi = document.getElementById("thumpHi");
		var thumpLow = document.getElementById("thumpLow");

		this.timer ++;

		if(this.timer < (thumpLow.duration + this.thumpPause)) {
			if(thumpLow.currentTime + this.thumpPause < thumpLow.duration + this.thumpPause) {
				thumpLow.play();
			}
		} else if ((this.timer > thumpLow.duration + this.thumpPause) && (this.timer < thumpLow.duration + this.thumpPause + thumpHi.duration + this.thumpPause )){
			if(thumpHi.currentTime + this.thumpPause < thumpHi.duration + this.thumpPause) {
				thumpHi.play();
			}
		} else {
			thumpLow.pause();
			thumpLow.currentTime = 0;
			thumpHi.pause();
			thumpHi.currentTime = 0;
			this.timer = 0;

			if(this.thumpPause > 9) {
				this.thumpPause += this.thumpPause *-0.02;
			} else {

				this.thumpPause = this.musicBeat - this.lvl;
			}
		}
		

		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];

			a.update();

			if (this.ship.collide(a)) {

				var hitSound1 = document.getElementById("explosion1");
				var hitSound2 = document.getElementById("explosion2");
				var hitSound3 = document.getElementById("explosion3");


				switch (a.size) {
						case AsteroidSize:
							hitSound1.pause();
							hitSound1.currentTime = 0;
							hitSound1.play();
							break;
						case AsteroidSize/2:
							hitSound2.pause();
							hitSound2.currentTime = 0;
							hitSound2.play();
							break;
						case AsteroidSize/4:
							hitSound3.pause();
							hitSound3.currentTime = 0;
							hitSound3.play();
							break;
					}

				var debCount = Math.random()*8 + 10;
				for (var l = 0; l < debCount; l++){
					var x = this.ship.x;
					var y = this.ship.y;

					var dAngle = Math.random()*360;
					
					var debr = new Debris(x, y, dAngle);
					debr.maxX = this.canvasWidth;
					debr.maxY = this.canvasHeight;

					this.debris.push(debr);
				}

				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;

				this.ship.vel = {
					x: 0,
					y: 0
				}
				this.lives--;
				if(this.lives <= 0) {
					this.gameOver = true;
				}
				this.ship.visible = false;

				if (a.size > AsteroidSize/4) {
					for (var m = 0; m < 2; m++) {
						Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
						var astr = new Asteroid(Points.ASTEROIDS[i], a.size/2, a.x, a.y);
						astr.maxX = this.canvasWidth;
						astr.maxY = this.canvasHeight;

						this.asteroids.push(astr);
						len++;
					}
				}
				this.asteroids.splice(i,1);
				len--;
				i--;

			}

			for(var j = 0, len2 = this.bullets.length; j < len2; j++){
				var b = this.bullets[j];
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

					var hitSound1 = document.getElementById("explosion1");
					var hitSound2 = document.getElementById("explosion2");
					var hitSound3 = document.getElementById("explosion3");

					switch (a.size) {
						case AsteroidSize:
							hitSound1.pause();
							hitSound1.currentTime = 0;
							hitSound1.play();
							this.score += 20;
							this.lifeTicker += 20;
							break;
						case AsteroidSize/2:
							hitSound2.pause();
							hitSound2.currentTime = 0;
							hitSound2.play();
							this.score += 50;
							this.lifeTicker += 50;
							break;
						case AsteroidSize/4:
							hitSound3.pause();
							hitSound3.currentTime = 0;
							hitSound3.play();
							this.score += 100;
							this.lifeTicker += 100;
							break;
					}

					if (a.size > AsteroidSize/4) {
						for (var k = 0; k < 2; k++) {
							Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
							var astr = new Asteroid(Points.ASTEROIDS[i], a.size/2, a.x, a.y);
							astr.maxX = this.canvasWidth;
							astr.maxY = this.canvasHeight;

							this.asteroids.push(astr);
							len++;
						}
					}
					this.asteroids.splice(i,1);
					len--;
					i--;
				}
			}
		}
		for (var i = 0, len = this.bullets.length; i < len; i++){
			var b = this.bullets[i];
			b.update();

			if (b.shallRemove){
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}

		for (var i = 0, len = this.debris.length; i < len; i++){
			var d = this.debris[i];
			d.update();

			if (d.shallRemove){
				this.debris.splice(i, 1);
				len--;
				i--;
			}
		}

		this.ship.update();

		if(this.asteroids.length === 0){
			this.lvl++;
			this.generateLvl();
		}

		if(this.lifeTicker >= this.lifeUp) {
			var lifeSound = document.getElementById("lives");
			lifeSound.pause();
			lifeSound.currentTime = 0;
			lifeSound.play();
			this.lives ++;
			this.lifeTicker = 0;
		}

	},

	render: function(ctx) {
		ctx.clearAll();

		ctx.vectorText(this.score, 2, 50, 25);

		for (var i = 0; i < this.lives; i++) {
			ctx.drawPolygon(this.lifepolygon, 60+15*i, 60);
		}

		for (var i = 0, len = this.asteroids.length; i < len; i++){
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++){
			this.bullets[i].draw(ctx);
		}

		for (var i = 0, len = this.debris.length; i < len; i++){
			this.debris[i].draw(ctx);
		}

		if(this.gameOver) {
			ctx.vectorText("GAME OVER", 4, null, null);
		}
		this.ship.draw(ctx);
	}

});