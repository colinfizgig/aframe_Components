var Canvas = Class.extend({

	init: function(width, height){
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;

		this.ctx = (function(ctx) {

			ctx.width = ctx.canvas.width;
			ctx.height = ctx.canvas.height;

			ctx.ACODE = "A".charCodeAt(0);
			ctx.ZCODE = "0".charCodeAt(0);
			ctx.SCODE = " ".charCodeAt(0);

			ctx.drawPolygon = function(p, x, y) {
				p = p.points;

				this.beginPath();
				this.moveTo(p[0] + x, p[1] + y);
				for (var i=2, len = p.length; i< len; i+=2){
					this.lineTo(p[i] + x, p[i + 1] + y);
				}
				this.stroke();
			};

			ctx.vectorText = function(text, s, x, y, offset) {
				text = text.toString().toUpperCase();
				var step = s*6;

				if (typeof offset === "number") {
					x += step*(offset - text.length);
				}

				if (typeof x !== "number") {
					x = Math.round((this.width - text.length*step)/2);
				}
				if (typeof y !== "number") {
					y = Math.round((this.height - step)/2);
				}

				x += 0.5;
				y += 0.5;

				for (var i=0, len = text.length; i < len; i++) {
					var ch = text.charCodeAt(i);
					if(ch === this.SCODE) {
						x += step;
						continue;
					}

					var p;
					if (ch - this.ACODE >= 0) {
						p = Points.LETTERS[ch - this.ACODE];
					} else {
						p = Points.NUMBERS[ch - this.ZCODE];
					}

					this.beginPath();
					this.moveTo(p[0]*s + x, p[1]*s + y);
					for (var j = 2, len2 = p.length; j < len2; j += 2) {
						this.lineTo(p[j]*s + x, p[j+1]*s + y);
					}
					this.stroke();
					x+= step;
				}
			};

			ctx.clearAll = function(){
				this.clearRect(0,0, this.width, this.height);
			}
			return ctx;
		})(this.canvas.getContext("2d"));
		this.canvas.id = "asteroids";
		
		// disable the commented code below to render to screen otherwise it renders off screen for accelerated rendering.
		document.body.appendChild(this.canvas);
		//this.canvas.style.visibility = 'hidden';
	},

	animate: function(loop){
		var rf = (function(){
			
				return window.requestAnimationFrame 	||
				window.webkitRequestAnimationFrame 	||
				window.mozRequestAnimationFrame 	||
				window.oRequestAnimationFrame 		||
				window.msRequestAnimationFrame		||
				function(cb, el){
					window.setTimeout(cb, 1000/60);
				}
			
		})();

		var l = function(){
			loop();
			//throttle the playback of the canvas so that it doesn't fly in vr
			setTimeout(function(){ 
				rf(l, self.canvas);
			}, 1000/60);
		}
		rf(l, this.canvas);
	}

});