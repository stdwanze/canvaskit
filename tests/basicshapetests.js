var assert = chai.assert;
describe('BasicShape Tests', function() {
	describe('Point', function() {
		it('should be inited', function() {

			var point = new CanvasKit.Point(10, 100);

			assert.equal(10, point.x);
			assert.equal(100, point.y);
		});
		it('should find center ', function() {

			var topleft = new CanvasKit.Point(10, 10);
			var bottomright = new CanvasKit.Point(20, 20);
			var center = CanvasKit.Algorithm.calcCenter(topleft,bottomright);

			assert.equal(15, center.x);
			assert.equal(15, center.y);
			
			center = CanvasKit.Algorithm.alignText(topleft,bottomright,8);
			assert.equal(11, center.x);
			assert.equal(15, center.y);
		});
	});
	describe('Rectangle Element', function() {
		it("should create a rectangle",function (){
			var point = new CanvasKit.Point(10, 100);
			var size = new CanvasKit.Point(20, 25);
	
			var element = new CanvasKit.Rectangle(point, size);
			assert.equal(false, element.isOut());
			assert.equal(10, element.location.x);
			assert.equal(100, element.location.y);
			assert.equal(20, element.size.x);
			assert.equal(25, element.size.y);
			assert.equal(true, element.contentstyle.fill);
			assert.equal(true, element.contentstyle.border);
			assert.equal("black", element.contentstyle.fillcolor);
			assert.equal("black", element.contentstyle.bordercolor);
			assert.equal("1", element.contentstyle.bordersize);
			assert.equal("", element.contentstyle.text);
			assert.equal(30, element.bottomRight().x);
			assert.equal(125, element.bottomRight().y);
			assert.equal(0, element.contentstyle.textangle);
		});

	});
	describe('EngineElement', function() {
		it('should be inited', function() {

			var point = new CanvasKit.Point(10, 100);
			var size = new CanvasKit.Point(20, 25);

			var element = new CanvasKit.EngineElement(point, size);

			assert.equal(false, element.isOut());
			assert.equal(10, element.location.x);
			assert.equal(100, element.location.y);
			assert.equal(20, element.size.x);
			assert.equal(25, element.size.y);

		});

	});

	describe('EngineElement', function() {

		var point = new CanvasKit.Point(10, 100);
		var size = new CanvasKit.Point(20, 25);

		var element = new CanvasKit.EngineElement(point, size);
		it('should be inited', function() {

			assert.equal(false, element.isOut());
			assert.equal(10, element.location.x);
			assert.equal(100, element.location.y);
			assert.equal(20, element.size.x);
			assert.equal(25, element.size.y);

		});

	});

	describe('OSD Element', function() {

		var point = new CanvasKit.Point(10, 100);
		var size = new CanvasKit.Point(20, 25);

		var element = new CanvasKit.OSDElement(point, size);
		it('should be hit', function() {

			var click = new CanvasKit.Point(11, 101);
			assert.isTrue(element.isHit(click));

		});
		it('should not be hit', function() {

			var click = new CanvasKit.Point(1, 3);
			assert.isFalse(element.isHit(click));
		});
	});

	describe('Sprite Element', function() {

		var point = new CanvasKit.Point(10, 100);
		var image = new Image("./rsc/grassTop.png");

		var sprite = new CanvasKit.Sprite(image, point);

		it('should be inited as EngineElement', function() {

			assert.equal(false, sprite.isOut());
			assert.equal(10, sprite.location.x);
			assert.equal(100, sprite.location.y);

		});

		it('should be size of image', function() {

			//image.width, image.height
			assert.equal(sprite.size.x, image.width);
			assert.equal(sprite.size.y, image.height);

		});

	});

	describe('Basic Engine Tests', function() {

		var keyDownCalled = false;
		var processBeginCalled = 0;
		var processEndCalled = 0;

		var canvasMock = {
			getContext : function() {
				return {
					clearRect : function() {
					}
				};
			},
			addEventListener : function() {

			},
			removeEventListener : function() {

			}
		};

		var engine = new CanvasKit.EngineBase(canvasMock);
		engine.keyHandler = function() {
			keyDownCalled = true;
		};
		engine.processBegin = function() {
			processBeginCalled += 1;
		};
		engine.processEnd = function() {
			processEndCalled = true;
			engine.setState(CanvasKit.EngineStates.STOP);
		};

		it('should be inited as engine', function() {

			assert.equal(engine.state, CanvasKit.EngineStates.STOP);

		});

		it('should run once', function() {

			engine.setState(CanvasKit.EngineStates.IDLE);

			assert.equal(processBeginCalled, 1);
			assert.equal(processEndCalled, 1);

		});

	});

});
