/**

Interface
https://github.com/dataarts/dat.gui

*/

/* ==== Start the GUI ==== */
function initGUIControllers(tracker) {

  // GUI Controllers
  var gui = new dat.GUI();

  // Custom Color to start?
  var trackedColors = {
    custom: false
  };

  /* == Add Cyan, Magenta, Yellow (Predefined colors in tracking.js) == */
  Object.keys(tracking.ColorTracker.knownColors_).forEach(function(color) {
    trackedColors[color] = false;
  });

  /* == Add Custom Color to the Array of tracking color in tracking.js == */
  function updateColors() {
    var colors = [];

    for (var color in trackedColors) {
      if (trackedColors[color]) {
        colors.push(color);
      }
    }
    // Set the color to track
    tracker.setColors(colors);
  }

  /* == Folder for Colors == */
  var colorsFolder = gui.addFolder('Colors to Track');

  /* == Add every color to the Color Folder == */
  Object.keys(trackedColors).forEach(function(color) {
    if (color !== 'custom') {
      colorsFolder.add(trackedColors, color).onFinishChange(updateColors);
    }
  });

  /*** === Folder for Parameters === /***/
  var parametersFolder = gui.addFolder('Color Variables');

  /* Tracking.js Parameters to track */
  tracking.ColorTracker.prototype.minDimension = 3;
  tracking.ColorTracker.prototype.minGroupSize = 3;
  parametersFolder.add(tracker, 'minDimension', 1, 100);
  parametersFolder.add(tracker, 'minGroupSize', 1, 100);

  //*** === Folder for Video === /***/
  var videoFolder = gui.addFolder('Video');

  videoFolder.add(hideVideo, 'hide');
  videoFolder.add(hideVideo, 'show');

  //*** == Folder for Canvas == /***/
  var canvasFolder = gui.addFolder('Canvas');

  canvasFolder.add(typeOfDrawing, 'configuration');
  canvasFolder.add(typeOfDrawing, 'continuous');
  canvasFolder.add(typeOfDrawing, 'discret');
  canvasFolder.add(timeToActivate, 'time',0,100);
  canvasFolder.add(typeOfDrawing, 'detectionView');
  canvasFolder.add(clearCanvas, 'eraseAll');
  canvasFolder.add(newBird, 'add');
  canvasFolder.add(flyaway, 'move');
  canvasFolder.add(flyaway, 'fly');

  //*** = How should we start the folders, open or closed? = /***/
  colorsFolder.open();
  parametersFolder.close();
  videoFolder.open();
  canvasFolder.open();

  updateColors();
}
