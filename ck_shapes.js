CanvasKit = window.CanvasKit || {};
( function(CanvasKit) {"use strict";
		CanvasKit.Point = ( function() {

				function point(x, y) {
					this.x = x;
					this.y = y;
				};
				return point;
			}());

		CanvasKit.EngineElement = (function() {

			function element(location, size)// CanvasKit.Points
			{
				this.location = location;
				this.size = size;
			}


			element.prototype = {
				render : function(canvas, ctxt) {
					return;
				},

				isOut : function() {
					return false;
				},
				tick: function ()
				{
					
				}
			};
			return element;
		}());
		CanvasKit.OSDElement = (function() {

			function element(location, size)// CanvasKit.Points
			{
				this.location = location;
				this.size = size;
			}


			element.prototype = {
				render : function(canvas, ctxt) {
					return;
				},
				isHit : function(point) {

				},
				activate : function() {
					return;
				}
			};
			return element;
		}());
		CanvasKit.Sprite = ( function() {

				function sprite(image, location) {
					this.image = image;
					var size = new CanvasKit.Point(image.width, image.height);
					CanvasKit.EngineElement.call(this, location, size);
				}


				sprite.prototype = new CanvasKit.EngineElement();
				sprite.prototype.constructor = sprite;

				sprite.prototype.getImage = function() {
					return this.image;
				};
				sprite.prototype.render = function(canvas, ctxt) {
					ctxt.drawImage(this.getImage(), this.location.x, this.location.y);
				};
				sprite.prototype.init = function() {
					this.anistep = 0;
					this.imageArray = [];
					if (image.length !== undefined) {
						this.imageArray = image;
						this.image = image[this.anistep];
					} else {
						this.image = image;
					}
				
					this.anispeed = 5;
					this.frame = 0;
				};
				sprite.prototype.tick = function (x,y)
				{
					 this.frame++;
					 this.location =  new Kit.Point(x, y);
					 if(this.imageArray.length > 0) {
					 if(this.frame % this.anispeed === 0) this.anistep = (this.anistep +1) % this.imageArray.length;
					 this.image = this.imageArray[this.anistep];
				}
		
				return sprite;
			}());

	}(window.CanvasKit || {}));
