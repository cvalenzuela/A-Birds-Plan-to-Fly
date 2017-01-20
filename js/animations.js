/*

Tacto version with Three.js

*/
var camera, scene, renderer, material;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var bird, birds;
var boid, boids;

/*== Initialize ==*/
function init(){

  camera = new THREE.PerspectiveCamera(50, SCREEN_WIDTH/SCREEN_HEIGHT,1,10000);
  camera.position.z = 150;

  scene = new THREE.Scene();

  birds = [];
	boids = [];

  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor( 0x000000 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  document.body.appendChild( renderer.domElement );

  scene.add(camera);

  // Axis Helper
  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );
}
/*== Initialize ==*/

/*== Animate ==*/
function animate(){
  render();
  requestAnimationFrame(animate);
}
/*== Animate ==*/


/*== Render ==*/
function render() {
	for ( var i = 0; i < birds.length; i++ ) {

    bird = birds[i];

    if(bird.move){
      bird.phase = ( bird.phase + (Math.max( 0, 0.3 ) + 0.1 )) % 62.83;
      bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
    }

    if(bird.fly){
      boid = boids[i];
      boid.run(boids);
      bird.rotation.y = Math.atan2(- boid.velocity.z, boid.velocity.x); // Rotation Y
      bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length()); // Rotation Z
      bird.position.copy(boid.position);
      bird.phase = ( bird.phase + (Math.max( 0, bird.rotation.z ) + 0.1 )) % 62.83;
      bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
      bird.move = false;
    }


    // color = bird.material.color;
		// color.r = color.g = color.b = (500 - bird.position.z) / 1000; // Color


	}
	renderer.render( scene, camera );
}
/*== Render ==*/

/*== Add Bird ==*/
function addBird(x,y){

  var boid = new Boid();
  boid.position.x = x;
  boid.position.y = y;
  boid.position.z = 0;
  boid.velocity.x = Math.random() * 2 - 1;
  boid.velocity.y = Math.random() * 2 - 1;
  boid.velocity.z = Math.random() * 2 - 1;
  boid.setAvoidWalls( true );
  boid.setWorldSize( 500, 500, 500 );
  boids.push(boid);

  var ImagePath = "imgs/received/birdtexture-small.jpg?" + new Date().getTime();

  var texture = new THREE.TextureLoader().load(ImagePath, function(texture){
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.05, 0.05);
    var geometry = new Bird();

    function assignUVs(geometry) {
      geometry.faceVertexUvs[0] = [];
      geometry.faces.forEach(function(face) {
          var components = ['x', 'y', 'z'].sort(function(a, b) {
              return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
          });
          var v1 = geometry.vertices[face.a];
          var v2 = geometry.vertices[face.b];
          var v3 = geometry.vertices[face.c];
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2(v1[components[0]], v1[components[1]]),
              new THREE.Vector2(v2[components[0]], v2[components[1]]),
              new THREE.Vector2(v3[components[0]], v3[components[1]])
          ]);
      });
      geometry.uvsNeedUpdate = true;
    }
    assignUVs(geometry);
    var material = new THREE.MeshBasicMaterial({map:texture, side: THREE.DoubleSide })
    var bird = new THREE.Mesh( geometry, material);

    //var bird = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, side: THREE.DoubleSide }));
    bird.phase = Math.floor( Math.random() * 62.83 );
    bird.position.x = x;
    bird.position.y = y;
    bird.position.z = Math.random();
    bird.velocity = new THREE.Vector3();
    bird.fly = false;
    bird.move = false;
    birds.push(bird);
    scene.add(bird);
  },
  // Function called when download progresses
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.log( 'An error happened' );
	});





}

var newBird = {
  add : function(){
    addBird(0,0);
    chirp(null,ac.currentTime+(Math.random()*0.2),2);
  }
}
/*== Add Bird ==*/

// test without serial
var flyaway = {
  move : function(){
    for(var b = 0; b < birds.length; b++){
      birds[b].move = true;
      chirp(null,ac.currentTime+(Math.random()*0.2),3);
    }

  },
  fly : function(){
    for(var b = 0; b < birds.length; b++){
      birds[b].fly = true;
      chirp(null,ac.currentTime+(Math.random()*0.2),1);
    }
    //chirp(null,ac.currentTime+(Math.random()*0.2),1);
  }
}
