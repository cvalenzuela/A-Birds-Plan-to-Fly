/* === Register new colors === */

function setColors(){

  /* = Red = */
  tracking.ColorTracker.registerColor('red', function(r, g, b) {
  if (r > 120 && g < 60 && b < 60) {
    return true;
  }
    return false;
  });

  /* = Green = */
  tracking.ColorTracker.registerColor('green', function(r, g, b) {
  if (r < 40 && g > 70 && b < 40) {
    return true;
  }
    return false;
  });
}
