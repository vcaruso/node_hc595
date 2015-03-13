


var hc595 	= require('../index');

//console.log("Length = %d",process.argv.length);

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
describe('#write without debug',function(){
	it('Write to shiftout',function(){
		hc595.write(LATCH_PIN,CLOCK_PIN,DATA_PIN,DATA,DEBUG);
		console.log("write %d to shiftout",DATA);
	});
	
})

describe('#write with debug',function(){
	it('Write to shiftout',function(){
		DEBUG=1;
		hc595.write(LATCH_PIN,CLOCK_PIN,DATA_PIN,DATA,DEBUG);
		console.log("write %d to shiftout",DATA);
	});
	
})