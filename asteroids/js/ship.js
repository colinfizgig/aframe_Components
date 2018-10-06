var Ship = Polygon.extend({
	maxX: null,
	maxY: null,

	init: function(p, pf, s, x, y){
		this._super(p);

		this.exhaust = new Polygon(pf);
		this.exhaust.scale(s);

		this.drawExhaust = false;
		this.visible = true;

		this.x = x;
		this.y = y;

		this.scale(s);

		this.angle = 0;

		this.vel = {
			x: 0,
			y: 0
		};
	},

	collide: function(astr) {
		
		if(!this.visible) {

			return false;
		}
		for(var i=0, len = this.points.length -2; i < len; i+= 2) {
			var x = this.points[i] + this.x;
			var y = this.points[i+1] + this.y;

			if(astr.hasPoint(x,y)) {
				return true;
			}
		}
		return false;
	},

	shoot: function() {
		var b = new Bullet(this.points[4] + this.x, this.points[5] + this.y, this.angle);
		b.maxX = this.maxX;
		b.maxY = this.maxY;
		return b;
	},

	addVel: function() {//a*a + b*b = c*c
		if(this.vel.x*this.vel.x + this.vel.y*this.vel.y < 20*20){
			this.vel.x += 0.05*Math.cos(this.angle);
			this.vel.y += 0.05*Math.sin(this.angle);
			this.drawExhaust = true;
		}
		var thrustSound = document.getElementById("thrust");

		if(thrustSound.paused){
			thrustSound.play();
		}
	},

	rotate: function(theta) {
		this._super(theta);

		this.exhaust.rotate(theta);

		this.angle += theta;
	},

	update: function(){
		this.x += this.vel.x;
		this.y += this.vel.y;

		this.vel.x *= 0.995;
		this.vel.y *= 0.995;

		if(this.x >= this.maxX){
			this.x = 0;
		} else if (this.x <= 0){
			this.x = this.maxX;
		}
		if(this.y >= this.maxY){
			this.y = 0;
		} else if (this.y <= 0){
			this.y = this.maxY;
		}

		if(!this.drawExhaust) {
			var thrustSound = document.getElementById("thrust");

			thrustSound.pause();
			thrustSound.currentTime = 0.01;
		}

	},

	draw: function(ctx) {

		if(!this.visible) {
			var thrustSound = document.getElementById("thrust");

			thrustSound.pause();
			thrustSound.currentTime = 0;

			return;
		}

		ctx.drawPolygon(this, this.x, this.y);
		if(this.drawExhaust){
			ctx.drawPolygon(this.exhaust, this.x, this.y);
			this.drawExhaust = false;
		}
		
	},

});