/* ===== Color Detection

elementDetected.color;
elementDetected.x
elementDetected.y
elementDetected.width
elementDetected.height

trackerTask.stop(); // Stops the tracking
trackerTask.run(); // Runs it again anytime

===== */


function ColorDetection() {

  /* === Set the Colors to Track === */
  setColors();

  /* Setup Tracker: abstract class to base of the other tracking */
  colorTracker = new tracking.ColorTracker();
  tracking.track('#video', colorTracker, { camera: true });

  /** === Color Tracker Instance === **/
  colorTracker.on('track', function(event) {

    /* Count the amount of time an object is detected if discret is selected */
    if(event.data.length >= 1){
      counter = counter + 1;
    }
    else{
      counter = 0;
    }

    /* Every Object Detected */
    event.data.forEach(function(elementDetected) {

      // Setup Custom Color
      if (elementDetected.color === 'custom') {
        elementDetected.color = tracker.customColor;
      }

      /* = Configuration Mode = */
      if(typeOfDrawing.configuration){
      }

      /* = Continues Draw = */
      if(typeOfDrawing.continuous){
        typeOfDrawing.discret = false;
        typeOfDrawing.detectionView = false;
        var x, y;
        x = map_range(elementDetected.x, 0, video.width, -window.innerWidth, window.innerWidth);
        y = map_range(elementDetected.y, 0, video.height, window.innerHeight, -window.innerHeight);
        onColorDetected(x,y);
      }

      /* = Discret Draw = */
      if(typeOfDrawing.discret && counter > timeToActivate.time && buttonGreen){
        typeOfDrawing.continuous = false;
        typeOfDrawing.detectionView = false;
        counter = 0;
        var x, y;
        // Add a new Bird
        x = map_range(elementDetected.x, 0, video.width, -130, 130);
        y = map_range(elementDetected.y, 0, video.height, 67, -67);
        console.log(x,y);
        addBird(x,y);
      }

      /* = Detection View = */
      if(typeOfDrawing.detectionView){
        typeOfDrawing.continuous = false;
        typeOfDrawing.discret = false;
      }
    });

  });
};
