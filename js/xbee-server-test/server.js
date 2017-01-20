// /*
// Serial Server for reading XBEE data
// From Making Things Talk CH7 v.3
// */

var SerialPort = require('serialport');

var xbeePortName = '/dev/cu.usbserial-A901QNT8'; // RECEIVER XBEE
var incoming = []; // Array to hold the data

/* The XBEE packet as a JSON Object */
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
var dataXbeeTwo, dataXbeeThree;

/* Start the xbeePort */
var xbeePort = new SerialPort(xbeePortName);

/* Function to Open the Serial Port */
function portOpen(xbee){
  console.log('port' + xbeePort.path + 'open');
  console.log('baud rate: ' + xbeePort.options.baudRate);
}

/* Function when there's an Error in the Serial Port */
function portError(error){
  console.log('there was an error with the serial port: ' + error);
  xbeePort.close();
}

/* Function to Read the Serial Port */
function readData(data){
  for (c = 0; c < data.length; c++){  // Loop over all the bytes
    var value = Number(data[c]);      // get the byte value
    if (value === 0x7E ){             // 0x7E starts a new message
      parseData(incoming);
      //console.log(incoming);          // print the previous array
      incoming = [];                    // Clear the array for new data
    } else {
      incoming.push(value);            // Add it to the incoming array
    }
  }
}

/* Parse the message packet byte-by-byte */
function parseData(thisPacket){
  var samplesStart = 10;      // First byte of the actual samples
  var samplesEnd;             // Last byte of the samples
  var sum = 0;                // Sum of all the samples, for averaging
  var sample = 0;             // The current sample
  message.samples = [];       // Clear the samples array

  if (thisPacket.length >= 10) { // if the packet is 20 bytes long read the address.
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

    // if (message.address == 2){
    //   dataXbeeTwo = message.samples;
    // }
    // else if (message.address == 3){
    //   dataXbeeThree = message.samples;
    // }
  }
  console.log(message);
  //  console.log("XBEE TWO: " + dataXbeeTwo);
  //  console.log(" XBEE THREE: " + dataXbeeThree);
    // if(message.address == 3 && message.average < 1023){
    //   console.log("XBEE THREE");
    // }
    // if(message.address == 2 && message[0] == 0){
    //   console.log("XBEE TWO");
    // }
    // if(message.address == 2 && message.samples[0] == 0){
    //   console.log("XBEE ONE"); // print it all out
    // }
    // else if(message.address == 3 && message.samples[0] == 0){
    //   console.log("XBEE TWO");
    // }

  }

/* Called when the Serial Port Opens */
xbeePort.on('open', portOpen);

/* Called when there's new incoming serial data */
xbeePort.on('data', readData);

/* Called when there's an error with the serial port */
xbeePort.on('error', portError);


/*
serialServer.js
context: node.js
*original code
*/

// var express = require('express');  // include the express library
// var server = express();            // create a server using express
// server.use('/',express.static('public'));
//
// // serial port initialization:
// var SerialPort = require('serialport');    // include the serialport library
// var portName = '/dev/cu.usbserial-A901QNT8';// your port name
// var incoming = [];                          // an array to hold the serial data
// var message = {         // the XBee packet as a JSON object:
//   packetLength: -1,     // packet length
//   apiId: 0,              // message API identifier
//   address: -1,          // sender's address
//   rssi: 0,              // signal strength
//   sampleCount:-1,       // number of I/O samples
//   channels: 0,          // which I/O channels are in use
//   samples: [],          // the array of samples
//   average:-1,           // the average of the samples
//   avgVoltage: -1        // the average in volts
// };
//
// // open the serial port:
// var myPort = new SerialPort(portName);
//
// function portOpen(portName) {
//   console.log('port ' + myPort.path + ' open');
//   console.log('baud rate: ' + myPort.options.baudRate);
// }
//
// function portError(error) {
//   console.log('there was an error with the serial port: ' + error);
//   myPort.close();
// }
//
// function readData(data) {
//     for (c=0; c < data.length; c++) {   // loop over all the bytes
//       var value = Number(data[c]);      // get the byte value
//       if (value === 0x7E) {             // 0x7E starts a new message
//         parseData(incoming);
//         incoming = [];                    // clear existing message
//       } else {                          // if the byte's not 0x7E,
//       incoming.push(value);               // add it to the incoming array
//     }
//   }
// }
//
// function parseData(thisPacket) {
//   var samplesStart = 10;    // first byte of the actual samples
//   var samplesEnd;           // last byte of the samples
//   var sum = 0;              // sum of all the samples, for averaging
//   var sample = 0;           // the current sample
//   message.samples = [];      // clear the samples array
//
//   if (thisPacket.length >= 10) {   // if the packet is 20 bytes long
//     // read the address. It's a two-byte value, so
//     // packetLength = firstByte * 256 + secondByte:
//     message.packetLength = (thisPacket[0] * 256) + thisPacket[1];
//     // message type is shown in hex in the docs, so convert to a hex string:
//     message.apiId = '0x' + (thisPacket[2]).toString(16);
//     // same two-byte formula with address:
//     message.address = (thisPacket[3] * 256) + thisPacket[4];
//     // read the received signal strength:
//     message.rssi = -thisPacket[5];
//     message.sampleCount = thisPacket[7]; // number of samples in packet
//     // channels is also a two-byte value.
//     // It's best read in binary, so convert to a binary string:
//     message.channels = ((thisPacket[8] * 256) + thisPacket[9]).toString(2);
//     samplesStart = 10;         // ADC reading starts at byte 10
//     // each sample is two bytes, so calculate the end position:
//     samplesEnd = samplesStart + (message.sampleCount * 2);
//     sum = 0;                   // sum of all samples, for averaging
//
//     // read the ADC inputs. Each is 10 bits, in two bytes, so
//     // use the two-byte formula: sample = firstByte * 256 + secondByte:
//     for (var i = samplesStart; i < samplesEnd;  i=i+2) {
//       sample = (thisPacket[i]* 256) + thisPacket[i+1];
//       // add the sample to the array of samples:
//       message.samples.push(sample);
//       // add the result to the sum for averaging later:
//       sum = sum + sample;
//     }
//     // average all the samples and convert to a voltage:
//     message.average = sum / message.sampleCount;
//     message.avgVoltage = message.average *3.3 / 1024;
//   }
//   console.log(message.samples[0]);    // print it all out
// }
//
// // define the callback function that's called when
// // a client makes a request:
// function respondToClient(request, response) {
//   // write back to the client:
//   response.end(JSON.stringify(message));
// }
//
// // called when the serial port opens:
// myPort.on('open', portOpen);
// // called when there's new incoming serial data:
// myPort.on('data', readData);
// // called when there's an error with the serial port:
// myPort.on('error', portError);
//
//
// server.listen(8080);              // start the server
// server.get('/json', respondToClient); // respond to GET requests
