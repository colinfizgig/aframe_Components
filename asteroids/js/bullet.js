var Bullet = Class.extend({

	maxX: null,
	maxY: null,

	init: function(x, y, angle){
		this.x = x;
		this.y = y;

		this.shallRemove = false;

		this.vel = {
			x: 7*Math.cos(angle),
			y: 7*Math.sin(angle)
		}
	},

	update: function() {
		this.prevX = this.x;
		this.prevY = this.y;

		if(0 > this.x || this.x > this.maxX ||
			0 > this.y || this.y > this.maxY
		){
			this.shallRemove = true;
		}

		this.x += this.vel.x;
		this.y += this.vel.y;
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.prevX, this.prevY);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
});