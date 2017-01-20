/*
Bird Sounds
Based on: https://github.com/notthetup/birds
*/

var ac;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (window.AudioContext) ac = new AudioContext();

var count = 0;

var birdSound = [new bird(ac), new bird(ac), new bird(ac), new bird(ac)];

var presets = generatePresets();

var tp0Max = 4;

var tp0Value1 = 1.5;
var tp0Value2 = 3.8;

function chirp(caller, time, type){
	if(type == 1){
		var params = presets['lesser-spotted-grinchwarbler'];
	}
	else if(type == 2){
		var params = presets['speckled-throated-spew'];
	}
	else if(type == 3){
		var params = presets['common-muckoink'];
	}
	var b = birdSound[count];
	//console.log(JSON.stringify(params, null, '\t' ));
	if(!caller){
		tp0Value1 = Math.random()*tp0Max;
		tp0Value2 = Math.random()*tp0Max;
	}

	b.position = {x:tp0Value1-tp0Max/2, y: 0, z: (40-tp0Value2*10)};
	b.velocity = {x:(Math.random()-0.5)*10, y: 0, z: 0};
	b.applyParams(params);
	b.chirp(time);
	count = (count+1) % birdSound.length;
}
