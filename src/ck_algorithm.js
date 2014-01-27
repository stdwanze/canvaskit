CanvasKit = window.CanvasKit || {};
( function(CanvasKit) {"use strict";
		CanvasKit.Algorithm = {

			collides : function(AABB1, AABB2) {
				if (AABB1.x < AABB2.x + AABB2.width && AABB1.x + AABB1.width > AABB2.x && AABB1.y < AABB2.y + AABB2.height && AABB1.y + AABB1.height > AABB2.y) {
					return true;
				} else {
					return false;
				}
			}
		};

		return CanvasKit;
	}(window.CanvasKit || {}));

