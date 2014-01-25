CanvasKit = window.CanvasKit || {}; ( function(CanvasKit) {"use strict";

		CanvasKit.EngineStates = {

			STOP : 0,
			IDLE : 1,
			RUN : 2
		};
		CanvasKit.EngineBase = (function() {

			function enginebase(canvas) {
				this.canvas = canvas;
				this.ctxt = canvas.getContext("2d");
				this.state = CanvasKit.EngineStates.STOP;

				// func handler
				this.keyHandler = function (){};
				this.processBegin = function (){};
				this.processEnd = function (){};
				
				this.shapes = []; //CanvasKit.EngineElement

				this.osd = new CanvasKit.OSDManager(this.canvas, this.ctxt);
				this.init();
			}


			enginebase.prototype = {
				init : function() {
					window.requestAnimFrame = (function(callback) {
						return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
						function(callback) {
							window.setTimeout(callback, 1000 / 30);
						};
					})();

					document.addEventListener("keydown", function(e) {
							this.keyHandler(e);
						
					}.bind(this));

				},
				add : function (shape)
				{
					this.shapes.push(shape);
				},
				clear : function ()
				{
					this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
				},
				processFrame : function(frame) {

					this.processBegin(this.state);
					
					if (this.state > CanvasKit.EngineStates.IDLE) {
						//update
						this.shapes.forEach( function(shape) {
							shape.tick(this.canvas, this.ctxt);
						}.bind(this));
						
					}

					if (this.state > CanvasKit.EngineStates.STOP) {
						
						//clear
						this.clear(); 
						// Draw
						this.shapes.forEach( function(shape) {
							shape.render(this.canvas, this.ctxt);
						}.bind(this));

						// temporary objects
						var nextEventObjs = [];
						this.eventObjects.forEach( function(shape) {
							shape.render(this.canvas, this.ctxt);
							if(!shape.isOut())
							{
								nextEventObjs.push(shape);	
							};
							
						}.bind(this));
						this.eventObjects = nextEventObjs;
						
						this.osd.render();
						
					
					}
					this.processEnd(this.state);
					
					var self = this;
					// register next
					if (this.state > CanvasKit.EngineStates.STOP) {
						requestAnimFrame(function() {
							self.processFrame(frame + 1);
						});
					}
				}
			};

			return enginebase;
		});
		CanvasKit.EngineElement =  (function() {

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
					return true;
				}
			};
			return element;
		});
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
		});
		CanvasKit.OSDManager = ( function() {

				function osd(canvas, ctxt) {
					this.canvas = canvas;
					this.ctxt = ctxt;
					this.objs = [];
					this.addClickHandler();
				}


				osd.prototype = {
					render : function() {
						this.objs.forEach( function(element) {
							element.render(this.canvas, this.ctxt);
						}.bind(this));
					},
					add : function(osdObj) {
						this.objs.push(osdObj);
					},
					getXY : function(event) {
						return new Kit.Point(event.layerX, event.layerY);
					},
					handleClick : function(e) {
						var hitXY = this.getXY(e);
						console.log('click: x:' + hitXY.x + '/y:' + hitXY.y);

						this.objs.forEach(function(element) {
							element.isHit(hitXY.x, hitXY.y) ? element.activate() : null;
						});
					},
					addClickHandler : function() {
						this.canvas.addEventListener("click", this.handleClick.bind(this), false);
						this.canvas.addEventListener("touchstart", this.handleClick.bind(this), false);
					},
					restore : function() {
						this.canvas.removeEventListener('click', this.handleClick, false);
					}
				};
				return osd;
			}());

	}(window.CanvasKit || {}));
