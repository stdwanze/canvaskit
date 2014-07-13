/*
 * JavaScript file created by Rockstarapps Concatenation
*/

/*
 * START OF FILE - /canvaskit/src/ck_algorithm.js
 */
CanvasKit = window.CanvasKit || {};
( function(CanvasKit) {"use strict";
		
		CanvasKit.Matrix = (function ()
		{
			function matrix (rows)
			{
				this.width = rows.length;
				this.rows = rows;
				
				this.mult = function (vector)
				{
					var x = this.rows[0][0]*vector.x + this.rows[0][1]*vector.y;
					var y = this.rows[1][0]*vector.x + this.rows[1][1]*vector.y;
					return new CanvasKit.Point(x,y);
				};
			}
			return matrix;	
		}());
		CanvasKit.Algorithm = {

			collides : function(AABB1, AABB2) {
				if (AABB1.x < AABB2.x + AABB2.width && AABB1.x + AABB1.width > AABB2.x && AABB1.y < AABB2.y + AABB2.height && AABB1.y + AABB1.height > AABB2.y) {
					return true;
				} else {
					return false;
				}
			},
			collideElements : function(engineelement1, engineelement2)
			{
				var aabb1 = engineelement1.getAABB();
				var aabb2 = engineelement2.getAABB();
				return CanvasKit.Algorithm.collides(aabb1,aabb2);
			},
			arcToRad : function (arc)
			{
				return  arc*Math.PI/180;
			},
			getRotationMatrixFor: function (arc)
			{
				var cos = Math.cos(CanvasKit.Algorithm.arcToRad(arc));
				var sin = Math.sin(CanvasKit.Algorithm.arcToRad(arc));
				
				return new CanvasKit.Matrix([[cos,-1*sin],[sin,cos]]);
				
			},
			
			calcCenter: function (topleft,bottomright)
			{
				var x = topleft.x  + (bottomright.x	- topleft.x )/2;
				var y = topleft.y  + (bottomright.y	- topleft.y )/2;
				return new CanvasKit.Point(x,y);
			},
			
			alignText: function (topleft,bottomright, textwidth,textheight)
			{
				var center = CanvasKit.Algorithm.calcCenter(topleft,bottomright);
				var xspace = center.x - topleft.x;
				var yspace = center.y - topleft.y;
				var pivotwidth = textwidth/2;
				var pivotheight = textheight/2;
				
				return new CanvasKit.Point (center.x - pivotwidth, center.y+pivotheight);				
			
			}
			
		};

		
		
		return CanvasKit;
	}(window.CanvasKit || {}));


/*
 * END OF FILE - /canvaskit/src/ck_algorithm.js
 */

/*
 * START OF FILE - /canvaskit/src/ck_canvasengine.js
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
				this.keyHandler = function (event){};
				this.processBegin = function (state){};
				this.processEnd = function (state){};
				
				this.shapes = []; //CanvasKit.EngineElement
				this.eventObjects = [];
				
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
				setState : function (state)
				{
					var currState = this.state; 
					this.state = state;
					
					// start manualy only if last known state was idle (no callback registered)
					if(currState < CanvasKit.EngineStates.IDLE) this.processFrame(0);
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
						return new CanvasKit.Point(event.layerX, event.layerY);
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
 * END OF FILE - /canvaskit/src/ck_canvasengine.js
 */

/*
 * START OF FILE - /canvaskit/src/ck_shapes.js
 */
CanvasKit = window.CanvasKit || {}; ( function(CanvasKit) {"use strict";
		CanvasKit.Point = ( function() {

				function point(x, y) {
					this.x = x;
					this.y = y;

					this.translate = function(offset) {
						this.x += offset.x;
						this.y += offset.y;

						return this;
					};

					this.reverse = function() {
						this.x = -1 * this.x;
						this.y = -1 * this.y;

						return this;
					};

					this.clone = function() {
						return new CanvasKit.Point(this.x, this.y);
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
		CanvasKit.ContentStyle = ( function() {

				function style() {
					this.border = true;
					this.fill = true;
					this.bordercolor = "black";
					this.fillcolor = "black";
					this.text = "";
					this.textsize = 14;
					this.textangle = 0;
					this.bordersize = 1;
				}

				return style;
			}());
		CanvasKit.EngineElement = ( function() {

				function element(location, size, contentstyle)// CanvasKit.Points
				{
					this.location = location;
					this.size = size;
					this.contentstyle = contentstyle;

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
					getAABB : function() {
						return new CanvasKit.AABB(this.location, this.size);
					},
					bottomRight : function() {
						return new CanvasKit.Point(this.location.x + this.size.x, this.location.y + this.size.y)
					}
				};
				return element;
			}());
		CanvasKit.Circle = ( function() {

				function circle(centerPoint, radius) {
					CanvasKit.EngineElement.call(this, centerPoint, radius);
				}


				circle.prototype = new CanvasKit.EngineElement();
				circle.prototype.constructor = circle;

				circle.prototype.render = function(canvas, ctxt) {
					ctxt.beginPath();
					ctxt.arc(this.location.x, this.location.y, this.size, 0, 2 * Math.PI, false);
					ctxt.stroke();
					ctxt.closePath();
				};
				circle.prototype.getAABB = function() {
					var topleft = new CanvasKit.Point(this.location.x - this.size / 2, this.location.y - this.size / 2);
					var size = new CanvasKit.Point(this.size, this.size);

					return new CanvasKit.AABB(topleft, size);
				};

				return circle;
			}());

		CanvasKit.Rectangle = ( function() {

				function rectangle(topleft, size, contentstyle) {

					if (contentstyle == undefined) {
						contentstyle = new CanvasKit.ContentStyle();

					}

					CanvasKit.EngineElement.call(this, topleft, size, contentstyle);
				}


				rectangle.prototype = new CanvasKit.EngineElement();
				rectangle.prototype.constructor = rectangle;

				rectangle.prototype.calcFontSize = function(text, ctxt, width) {
					var pt = 50;
					ctxt.font = pt + "pt Arial";
					
					while (pt > 1 &&  ctxt.measureText(text).width > width) {
						pt -= 2;
						ctxt.font = pt + "pt Arial";
						
					}

					return pt;
				};
				rectangle.prototype.render = function(canvas, ctxt) {

					ctxt.beginPath();
					ctxt.rect(this.location.x, this.location.y, this.size.x, this.size.y);
					ctxt.lineWidth = 2;
					ctxt.strokeStyle = this.contentstyle.bordercolor;
					ctxt.stroke();
					ctxt.closePath();
					ctxt.fillStyle = this.contentstyle.fillcolor;
					if (this.contentstyle.fill)
						ctxt.fillRect(this.location.x, this.location.y, this.size.x, this.size.y);

					if (this.contentstyle.text.length > 0) {

						var fontpt = this.contentstyle.textsize < 0 ? this.calcFontSize(this.contentstyle.text, ctxt, this.size.y) : this.contentstyle.textsize;

						ctxt.font = fontpt + "pt Arial";
						var textwidth = ctxt.measureText(this.contentstyle.text).width;

						//'italic 40pt Calibri';

						if (this.contentstyle.textangle != 0) {
							var textlocation = CanvasKit.Algorithm.alignText(this.location, this.bottomRight(), textwidth, fontpt);
							var center = CanvasKit.Algorithm.calcCenter(this.location, this.bottomRight());
							var normalizedtextlocation = new CanvasKit.Point(textlocation.x - center.x, textlocation.y - center.y);

							ctxt.save();
							ctxt.translate(center.x, center.y);

							var currArcInRad = this.contentstyle.textangle * Math.PI / 180;

							ctxt.rotate(-currArcInRad);
							ctxt.fillText(this.contentstyle.text, normalizedtextlocation.x, normalizedtextlocation.y);
							ctxt.restore();
						} else {

							var textlocation = CanvasKit.Algorithm.alignText(this.location, this.bottomRight(), textwidth, this.contentstyle.textsize);
							ctxt.fillText(this.contentstyle.text, textlocation.x, textlocation.y);
						}

					}

				};
				rectangle.prototype.getAABB = function() {
					return new CanvasKit.AABB(this.location, this.size);
				};

				return rectangle;
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

						var aabb1 = new CanvasKit.AABB(this.location, this.size);
						var aabb2 = new CanvasKit.AABB(point, new CanvasKit.Point(0, 0));
						return CanvasKit.Algorithm.collides(aabb1, aabb2);
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

/*
 * END OF FILE - /canvaskit/src/ck_shapes.js
 */

/*
 * START OF FILE - /canvaskit/src/ck_sound.js
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
 * END OF FILE - /canvaskit/src/ck_sound.js
 */

/*
 * JavaScript file created by Rockstarapps Concatenation
*/
