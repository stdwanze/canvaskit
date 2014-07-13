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

