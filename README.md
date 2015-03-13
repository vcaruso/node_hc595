Node_HC595
==================

A small library to drive 74hc595 with Raspberry thru bitbanging

## Installation
	npm install node_hc595 --save
## Usage
	var hc595 	= require('hc_595');
	var LATCH_PIN	 = 12;
	var CLOCK_PIN	 = 13;
	var DATA_PIN	 = 15; 
	var DATA		 = 170;
	var DEBUG		 = 0;

	/* Check if argument supplied, if any write value to shift_out else write decimal 170    1 0 1 0 1 0 1 0 */
	if(process.argv.length==3)
	{
		DATA=process.argv[2];
	
	}

	hc595.write(LATCH_PIN,CLOCK_PIN,DATA_PIN,DATA,DEBUG);

## Tests
		npm test

## Release History

* 0.1.0 Initial release