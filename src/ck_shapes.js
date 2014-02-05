CanvasKit = window.CanvasKit || {}; ( function(CanvasKit) {"use strict";
		CanvasKit.Point = ( function() {

				function point(x, y) {
					this.x = x;
					this.y = y;
					
					this.translate = function (offset)
					{
						this.x += offset.x;
						this.y += offset.y;
						
						return this;
					};
					 
					this.reverse = function ()
					{
						this.x = -1* this.x;
						this.y = -1* this.y;
						
						return this;
					}; 
					
					this.clone = function ()
					{
						return new CanvasKit.Point(this.x,this.y);
					};
				};
				return point;
			}());
		
		CanvasKit.AABB = ( function() {

				function aabb(location, size) {
					this.x = location.x;
					this.y = location.y;
					
					this.width = size.x;
					this.height = size.y;
					
				};
				return aabb;
			}());

		CanvasKit.EngineElement = ( function() {

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
					tick : function() {

					},
					getAABB : function ()
					{
						return new CanvasKit.AABB(this.location, this.size);
					}
					
				};
				return element;
			}());
			CanvasKit.Circle = (function (){
			
			function circle (centerPoint, radius)
			{
				CanvasKit.EngineElement.call(this,centerPoint,radius);
			}
			circle.prototype = new CanvasKit.EngineElement();
			circle.prototype.constructor = circle;
			
			circle.prototype.render = function (canvas, ctxt)
			{
				ctxt.beginPath();
				ctxt.arc(this.location.x, this.location.y, this.size, 0, 2 * Math.PI, false);
			    ctxt.stroke();
    			ctxt.closePath();
			};
			circle.prototype.getAABB = function ()
			{
				var topleft = new CanvasKit.Point(this.location.x-this.size/2,this.location.y-this.size/2 );
				var size = new CanvasKit.Point(this.size,this.size);
				
				return new CanvasKit.AABB(topleft, size);
			};
			
			
			return circle;
		}());
		CanvasKit.OSDElement = ( function() {

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
						
						var aabb1 = new CanvasKit.AABB(this.location,this.size);
						var aabb2 = new CanvasKit.AABB(point,new CanvasKit.Point(0,0));
						return CanvasKit.Algorithm.collides(aabb1,aabb2);
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
				sprite.prototype.tick = function(x, y) {
					this.frame++;
					this.location = new Kit.Point(x, y);
					if (this.imageArray.length > 0) {
						if (this.frame % this.anispeed === 0)
							this.anistep = (this.anistep + 1) % this.imageArray.length;
						this.image = this.imageArray[this.anistep];
					}
				};
				return sprite;
			}());

	}(window.CanvasKit || {}));
