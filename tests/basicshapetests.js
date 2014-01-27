var assert = chai.assert;
describe('BasicShape Tests', function() {
	describe('Point', function() {
		it('should be inited', function() {

			var point = new CanvasKit.Point(10, 100);

			assert.equal(10, point.x);
			assert.equal(100, point.y);
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
	
	describe('OSD Element', function (){
		
		
		var point = new CanvasKit.Point(10, 100);
		var size = new CanvasKit.Point(20, 25);

		var element = new CanvasKit.OSDElement(point, size);
		it('should be hit', function() {

			var click = new CanvasKit.Point(11,99);
			assert.isTrue(element.isHit(click));
		

		});
			it('should not be hit', function() {

			var click = new CanvasKit.Point(1,3);
			assert.isFalse(element.isHit(click));
		});
	});
	
	describe('Sprite Element', function (){
		
		
		var point = new CanvasKit.Point(10, 100);
		var image = new Image("./rsc/grassTop.png");

		var sprite = new CanvasKit.Sprite(image,point);
		
		it('should be inited as EngineElement', function() {

			assert.equal(false, sprite.isOut());
			assert.equal(10, sprite.location.x);
			assert.equal(100, sprite.location.y);
			

		});
	
	
		it('should be size of image', function() {

			//image.width, image.height
			assert.equal(sprite.size.x,image.width);
			assert.equal(sprite.size.y,image.height);
			
		

		});
	
	});

});
