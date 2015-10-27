//////////////////////////////////////////////////////////////////////////////////
// A demonstration of Canvas Caching.
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it
//////////////////////////////////////////////////////////////////////////////////
(function ($) {

   var CanvasCache = function ($parent) {
      this.newCanvas = function (w, h) {
        var canvas = $parent.append('<canvas width="' + w + '" height="' + h + '"></canvas>').find(':last')[0];
		 return {
            canvas: canvas,
            ctx: canvas.getContext('2d')
         };
      };

   };

   var cacheCanvasDemo = function () {

      // Define vanishing point.
      var originX = 1170 / 2,
         originY = 700 / 2,
         rotation = 0,
         destSpeed = 0,
         speed = 0,
         stopped = false;
      var destOriginX = originX;
      var destOriginY = originY;
      var destRotation = 0,
         oldTime, timeFac;
      var $canvas, ctx, i, clouds = [];
      // Draw a few items in hidden canvas elements. 
      var cCache = new CanvasCache($('#caches'));
      var cachedItems = [];

      var svgFiles = ['/images/svgs/building1.svg', '/images/svgs/building2.svg', '/images/svgs/building3.svg', '/images/svgs/building4.svg', '/images/svgs/cloud.svg'];

      for (i = 0; i < svgFiles.length; i++) {
            cachedItems[i] = cCache.newCanvas(1170, 700);
            canvg(cachedItems[i].canvas, svgFiles[i]);
         }


      // Create a bunch of items to move, each one referring to one of the cached canvases.		
      var items = [];
      var randFunc = Math.random;
      for (i = 0; i < 60; i++) {
            var cachedItemNum = Math.round(randFunc() * 3);
            var h = cachedItems[cachedItemNum].canvas.height;
            items.push({
               x: (randFunc() * 5000) - 2500,
               y: -h + 300,
               z: (randFunc() * 24),
               cachedItemNum: cachedItemNum
            });
         }

      // Create some cloud coordinates.
      for (i = 0; i < 6; i++) {
            clouds.push({
               x: (i - 3) * 200,
               y: (randFunc() * -128) - 80
            });
         }

      // The canvas element we are drawing into.
      $canvas = $('#canvas2');
      ctx = $canvas[0].getContext('2d');

      // Little function to sort items into z-order.
      var zSort = function (item1, item2) {
            return item2.z - item1.z;
         };

      oldTime = new Date().getTime();

      // The 'game loop'.
      var loop = function () {

            var w, h, scale, len, itemCanvas, i, item, newTime;

            // Work out a time factor so slower machines can pretend they are running at 30ms;
            newTime = new Date().getTime();
            timeFac = ((newTime - oldTime) / (1000 / 30)) * speed;
            // Prevent step from being too large;
            if (timeFac > 0.9) {
               timeFac = 0.9;
            }
            oldTime = newTime;

            // Update the origin, rotation and speed.
            originX += (destOriginX - originX) * 0.1;
            originY += (destOriginY - originY) * 0.1;
            rotation += (destRotation - rotation) * 0.1;
            speed += (destSpeed - speed) * 0.1;

            // Sort items in to z-order.
            items.sort(zSort);

            ctx.save();
            // Translate origin to middle.
            ctx.translate(originX, originY);
            // Rotate around middle.
            ctx.rotate(rotation);

            // Draw sky and ground.				
            // ctx.fillStyle = '#87ceeb'; //ctx.createPattern(img,'repeat');  
            ctx.fillStyle = '#87ceeb'; //ctx.createPattern(img,'repeat');  
            ctx.fillRect(-5000, -5000, 6700, 5000);
            ctx.fillStyle = '#dadfe2'; //ctx.createPattern(img2,'repeat');  
            ctx.fillRect(-5000, 0, 6700, 5000);

            // Draw clouds.
            for (i = 0; i < clouds.length; i++) {
               ctx.drawImage(cachedItems[4].canvas, clouds[i].x, clouds[i].y);
            }
            
			len = items.length;
            // Draw all items.
            for (i = 0; i < len; i++) {
               item = items[i];
               itemCanvas = cachedItems[item.cachedItemNum].canvas;
               scale = 1 / item.z;
               w = itemCanvas.width * scale;
               h = itemCanvas.height * scale;
               ctx.drawImage(itemCanvas, (item.x * scale) - (w * 0.5), item.y * scale, w, h);
               item.z -= timeFac; // Move forward.
               if (item.z <= 0) {
                  item.z = 16; // Off the front? Send back to rear.
               }
            }
            ctx.restore();
		
			// If we still have discernible movement, continue looping.
            if (destSpeed > 0 || speed > 0.001) {
               setTimeout(loop, 30);
               stopped = false;
            }
			// Otherwise, don't loop again to free up cpu.
			else {				
               stopped = true;
            }
         };
      loop(); // 1st call to draw 1st frame.
      // Start movement when mouseover.
      $canvas.bind('mouseover', null, function (event) {
            destSpeed = 0.1;
            if (stopped === true) {
               oldTime = new Date().getTime();
               loop();
            }
         });
      // Move and tilt when mouse moves over canvas.
      $canvas.bind('mousemove', null, function (event) {
            destOriginX = event.pageX - $canvas.offset().left;
            destOriginY = event.pageY - $canvas.offset().top;
            destRotation = (destOriginX - $canvas.width() / 2) * 0.001;
         });
      // Move everything back to middle if mouse out.
      $canvas.bind('mouseout', null, function (event) {
            destOriginX = 1170 / 2;
            destOriginY = 600 / 2;
            destRotation = 0;
            destSpeed = 0;
         });

   };

   $(document).ready(function () {	
      cacheCanvasDemo();
   });


})(jQuery);