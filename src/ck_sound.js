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
