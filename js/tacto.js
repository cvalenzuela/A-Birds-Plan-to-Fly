/*
=================

Tacto, a physical interface for digital projections

Cristóbal valenzuela
Final Project ICM and PComp
Fall 2016

=================
*/

var colorTracker;

var counter = 0;
var timeToActivate = {time: 3};

var buttonOne = false;
var moveFigure = false;

var typeOfDrawing = {
  configuration: false,
  continuous: false,
  discret: true,
  detectionView: false
}

var hideVideo = {
  hide : function(){
    document.getElementById("video").style.display = "none";
  },
  show : function(){
    document.getElementById("video").style.display = "block";
  }
}

var clearCanvas = {
  eraseAll : function(){
    scene.children.forEach(function(object){
    scene.remove(object);
    });
  }
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// Color Detection
ColorDetection();
// Serial Setup
serialSetup();

init();
animate();

window.onload = function() {
  initGUIControllers(colorTracker);
  // Maptasticjs
  Maptastic(renderer.domElement,"video");
};

window.setTimeout(function(){hideVideo.hide();},1000);
