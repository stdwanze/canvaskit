CanvasKit = window.CanvasKit || {};
( function(CanvasKit) {"use strict";
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
				var aabb1 = enginelement1.getAABB();
				var aabb2 = enginelement2.getAABB();
				return collides(aabb1,aabb2);
			}
		};

		return CanvasKit;
	}(window.CanvasKit || {}));

