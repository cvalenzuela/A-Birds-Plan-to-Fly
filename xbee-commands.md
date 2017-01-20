<!--
XBEE Commands
 -->

# RECEIVER
+++
ATRE
ATMY 01  <!-- Local Address -->
ATDL 02 <!-- Set to send only to the sensor radio (address 02). Doesn't matter b/c this radio won't be sending -->
ATID 3002 <!-- PAN ID -->
ATIU 1 <!-- Sets the radio to send any I/O data packets out the serial port. -->
ATWR


# SENDER XBEE 802 15.4 / 10ec
+++
ATRE
ATMY 03 <!-- Local Address -->
ATDH 0
ATDL FFFF <!-- Sets the destination address to broadcast to the whole PAN. -->
ATID 3002 <!-- PAN ID -->
ATD0 2 <!-- Sets I/O pin configuration for pin 0 (D0) to act as an analog input. -->
ATIR 64 <!--Sets the analog input sample rate to 100 milliseconds (0x64 hex). Shorten this if you want more frequent sampling. -->
ATPR 0
ATIT 2 <!-- Sets the radio to gather five samples before sending, so it will send every 500 milliseconds (5 samples x 100 milliseconds sample rate = 500 milliseconds. -->
ATWR


# COMMANDS
+++ <!-- Enter Command Mode -->
ATRE <!-- Reset to Factory -->
ATMY <NUMBER>  <!-- Local Address -->
ATDH 0  <!-- Destination address high: Disable -->
ATDL <NUMBER>  <!-- Destination address low: Other XBEE ATMY -->
ATD0 <NUMBER> <!-- Pin 0 I/O configuration -->
ATIR <NUMBER> <!-- Sample rate. IE: 14 (20 ms, 14 in hexadecimal = 20 in decimal) -->
ATPR	0 <!-- Pull-up resistors	 (disable internal pull-up resistors on all pins) -->
ATWR <!-- Write to memory (save the settings to flash memory) -->
ATCN <!-- Drop out of Command mode -->
ATIT <Number of Samples> <!-- Set the number of samples taken from D I/O pins before the XBEE transmits them. Samples are stored in a buffer,they are 2 bytes in size and the buffer can store up to 90 bytes -->
ATIA <ADDRESS> <!-- Enables pin output modes to be updated from another XBEE <ADDRESS> that will be sending the output mode changing commands. -->
ATIU 1 <!-- Sets the radio to send any I/O data packets out the serial port. -->

# PINS
ATD0…ATD7 <!-- Sets the configuration of I/O pins 0 through 7. -->
ATP0…ATP1 <!-- Sets the configuration of I/O pins 10 and 11 -->
  # 0 : Disables I/O on that pin
  # 1: Built in function, if available on pin
  # 2: Analog input, only pins D0 – D3
  # 3: Digital Input
  # 4: Digital Output, LOW (0 volts)
  # 5: Digital Output, HIGH (3.3 volts)


# XBEE PROTOCOL
7E 00 0C 83 56 78 2E 00 02 00 18 00 18 00 18 36

7E 00 12 83 00 02 3C 00 05 00 01 00 00 00 00 00

7E	Start Delimiter
00 0C	Length Bytes
83	API Identifier Byte for 16bit DIO data (82 is for 64bit DIO data)
56 78	Source Address Bytes
2E	RSSI Value Bytes
00	Option Byte
02	Sample Quantity Byte
00 18	00000000 00011000 Channel Indicator *
00 18	Sample Data DIO 3 & 4 (Where 1 represents high and 0 represents low)
36	Check sum
