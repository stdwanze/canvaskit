/*
 * JavaScript file created by Rockstarapps Concatenation
*/

/*
 * START OF FILE - /canvaskit/ck_canvasengine.js
 */
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
		}());
		
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

/*
 * END OF FILE - /canvaskit/ck_canvasengine.js
 */

/*
 * START OF FILE - /canvaskit/ck_shapes.js
 */
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

/*
 * END OF FILE - /canvaskit/ck_shapes.js
 */

/*
 * START OF FILE - /canvaskit/ck_sound.js
 */
/**
 * @author Stefan Dienst
 */
CanvasKit = window.CanvasKit || {}; ( function(CanvasKit) {"use strict";

		CanvasKit.SOUND = {
		
		};
		CanvasKit.SoundPool = ( function() {

				function resourcepool(length, sound) {
					this.pool = [];
					this.size = length;
					this.sound = sound;
					this.currSound = 0;
				}


				resourcepool.prototype = {

					load : function() {

						var deferred = $.Deferred();

						for (var i = 0; i < this.size; i++) {
							var audio = new Audio(this.sound);
							audio.volume = .1;
							audio.load();
							this.pool[i] = audio;
						}
						this.checkAudio = window.setInterval( function() {
							this.checkReadyState(deferred);
						}.bind(this), 500);

						return deferred.promise();
					},
					playOne : function() {
						if (this.pool[this.currSound].currentTime == 0 || this.pool[this.currSound].ended) {
							this.pool[this.currSound].load();
							this.pool[this.currSound].play();
						}
						this.currSound = (this.currSound + 1) % this.size;
					},
					checkReadyState : function(deferred) {
						if (this.isReady()) {
							window.clearInterval(this.checkAudio);
							deferred.resolve();
						}
					},
					isReady : function() {
						var notReady = false;
						this.pool.forEach(function(audio) {
							if (audio.readyState !== 4) {
								notReady = true;
							}
						});
						return !notReady;
					}
				};

				return resourcepool;
			}());

		CanvasKit.SoundManager = ( function() {

				function soundmanager() {
					
					this.soundpools = {};
					
				
				}

				soundmanager.prototype = {
					load : function (){
						var deferred = $.Deferred();
						
						var waiter = Kit.Helper.callForAllMemberaOf(this.soundpools,"load");
						/*for(var pool in this.soundpools)
						{
							if(pool.load !== undefined)
							{
								waiter.push(pool.load());
							}
						}*/
					
						$.when.apply($, waiter).done(function(){
						   deferred.resolve();
						});
						
						return deferred.promise();
					},
					registerSoundPool : function (capa,friendlyName, url)
					{
						this.soundpools[friendlyName] = new Kit.SoundPool(capa,url);
					},
					play : function(sound) {

						this.soundpools[sound].playOne();
						

					},
					checkReadyState : function() {
						
						var notReady = false;
						
							for(var pool in this.soundpools)
						{
							if(pool.isReady !== undefined)
							{
								if(!pool.isReady())
								{
									notReady = true;
									break;
								}
							}
						}
						if (!notReady) {
							this.finishedLoading();
						}
					}
				};

				return soundmanager;
			}());

		return CanvasKit;
	}(window.CanvasKit || {}));

/*
 * END OF FILE - /canvaskit/ck_sound.js
 */

/*
 * JavaScript file created by Rockstarapps Concatenation
*/