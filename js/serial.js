/*

Serial Communications

*/

/* Serial Variables */
var serial; // instance of the serialport library
var xbeePortName = '/dev/cu.usbserial-A901QNT8'; // RECEIVER XBEE
var incoming = []; // Array to hold the data
var inData;
var options = {baudrate: 9600};
var buttonGreen = false;

// The XBEE packet as a JSON Object
var message = {
  address: -1,       // Senders Address
  packetLength: -1,   // Packet Length
  type: 0,            // Message API type
  rssi: 0,            // Signal Strength
  channels: 0,        // Which I/O channels are in use
  sampleCount: -1,    // Number of I/O samples
  samples: [],         // The array of samples
  average: -1,        // The average of the samples
  avgVoltage: -1      // The average in volts
};

// Serial Setup
function serialSetup(){
  serial = new p5.SerialPort();
  serial.on('list', printList); // callback for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', readData); // callback for when new data arrives
  serial.on('error', serialError);  // callback for errors
  serial.on('close', portClose);  // callback for the port closing
  serial.list(); // Call the serial.list function and use printlist as callback
  serial.open(xbeePortName, options); // Call the serial.open and use portOpen as callback with argument of portName
}

/* ===== Serial Handling ===== */
// Print Serial Ports
function printList(portList){
  for (var i = 0; i < portList.length; i++){
    console.log(i + " " + portList[i]);
  }
}

// Connect to Server
function serverConnected(){
  console.log('connected to server.');
}

// Port Open
function portOpen(){
  console.log('the serial port is now opened.');
}

// Read the Serial Port
function readData(){
  var inByte = serial.read();
  var value = Number(inByte);
  if (value === 0x7E ){               // 0x7E starts a new message
    parseData(incoming);              // Give it to the parData function
    incoming = [];                    // Clear the array for new data
  } else {
    incoming.push(value);             // Add it to the incoming array
  }
}

/* Parse the message packet byte-by-byte */
function parseData(thisPacket){
  var samplesStart = 10;      // First byte of the actual samples
  var samplesEnd;             // Last byte of the samples
  var sum = 0;                // Sum of all the samples, for averaging
  var sample = 0;             // The current sample
  message.samples = [];       // Clear the samples array

  if (thisPacket.length >= 10){ // if the packet is 20 bytes long read the address.
    message.packetLength = (thisPacket[0] * 256) + thisPacket[1]; // It's a two-byte value, so: packetLength = firstByte * 256 + secondByte:
    message.apiId = '0x' + (thisPacket[2]).toString(16); // message type is shown in hex in the docs, so convert to a hex string:
    message.address = (thisPacket[3] * 256) + thisPacket[4]; // same two-byte formula with address:
    message.rssi = -thisPacket[5]; // read the received signal strength:
    message.sampleCount = thisPacket[7]; // number of samples in packet
    message.channels = ((thisPacket[8] * 256) + thisPacket[9]).toString(2); // channels is also a two-byte value. It's best read in binary, so convert to a binary string:
    samplesStart = 10; // ADC reading starts at byte 10
    samplesEnd = samplesStart + (message.sampleCount * 2); // each sample is two bytes, so calculate the end position:
    sum = 0; // sum of all samples, for averaging
    for (var i = samplesStart; i < samplesEnd; i=i+2){   // read the ADC inputs.
       sample = (thisPacket[i]* 256) + thisPacket[i+1];     // Each is 10 bits, in two bytes, so use the two-byte formula: sample = firstByte * 256 + secondByte:
       message.samples.push(sample);                       // add the sample to the array of samples:
       sum = sum + sample;                                 // add the result to the sum for averaging later:
    }
    message.average = sum / message.sampleCount; // average all the samples and convert to a voltage:
    message.avgVoltage = message.average *3.3 / 1024;
  }

  // Button Pressed
  if(message.address == 2){
    if (message.samples[0] == 1023){
      buttonGreen = true;
      // for(var b = 0; b < birds.length; b++){
      //   birds[b].fly = true;
      //   chirp(null,ac.currentTime+(Math.random()*0.2),1);
      // }
    }
    else{
      buttonGreen = false;
    }
  }

  // Device Shacked
  if(message.address == 3){
    if (message.average > 600){
      for(var b = 0; b < birds.length; b++){
        birds[b].move = true;
        chirp(null,ac.currentTime+(Math.random()*0.2),3);
      }
    }
  }

  // Blow detected
  if(message.address == 4){
    if (message.average > 300){
      for(var b = 0; b < birds.length; b++){
        birds[b].fly = true;
        chirp(null,ac.currentTime+(Math.random()*0.2),1);
      }
    }
  }


}

function serialError(err){
  console.log('Something went wrong with the serial port' + err);
}

function portClose(){
  console.log('The serial port is closed')
}
/* ===== Serial Handling ===== */
