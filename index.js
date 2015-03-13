
//Library is based on grpi-pio Module and async module
var gpio	=	require('rpi-gpio');
var async 	=   require('async');
var util 	=   require('util');

/*  Latch Pin */
var LATCH;

/* Clock Pin */
var CLOCK;

/* Data Pin */
var DATA;

/* Debug */
var DEBUG = 0;

gpio.on('change', function(channel, value) {
    
	//console.log('Channel ' + channel + ' value is now ' + value);
});


/**
*  Shift out data on data Pin
*  @param	{uint} data, value to write to
*  @param			{uint} msb,  1=most significant bit first, 0 = least significant bit first
*  @return  none
**/
function shift_out(data,msb){
	
	if(DEBUG)
		console.log("Write %d",data);	
	
	gpio.write(LATCH,"0");
	
	
	var writer=[];
	writer[0] = function(callback){
		delayedWrite(LATCH, true, callback);
	};
	writer[1] = function(callback){
		delayedWrite(CLOCK, true, callback);
	};
	writer[2] = function(callback){
		delayedWrite(LATCH, false, callback);
	};
	

	if(!msb)
	{
			for(x=0;x<8;x++)
			{
				
				if(bv(data,x)===1)
				{
					writer[x*3+3]=function(callback){
						delayedWrite(DATA, true, callback);
					};
				}
				else
				{
					writer[x*3+3]=function(callback){
						delayedWrite(DATA, false, callback);
					};
				}
				
				
				writer[x*3+4] = function(callback){
					delayedWrite(CLOCK, false, callback);
				};
				writer[x*3+5] = function(callback){
					delayedWrite(CLOCK, true, callback);
				};
			}
			
		
		
			
	}
	else{
		
		for(x=0;x<8;x++)
		{
				
				if(bv(data,7-x)===1)
				{
					writer[x*3+3]=function(callback){
						delayedWrite(DATA, true, callback);
					};
				}
				else
				{
					writer[x*3+3]=function(callback){
						delayedWrite(DATA, false, callback);
					};
				}
				
				
				writer[x*3+4] = function(callback){
					delayedWrite(CLOCK, false, callback);
				};
				writer[x*3+5] = function(callback){
					delayedWrite(CLOCK, true, callback);
				};
		}
		
	}
	
	
	writer[writer.length] = function(callback){
			delayedWrite(LATCH, true, callback);
		};
	
	writer[writer.length] = function(callback){
			delayedWrite(CLOCK, false, callback);
		};
		
		
		
	async.series(writer, function(err, results) {
		console.log('Writes complete, pause then unexport pins');
		setTimeout(function() {
			gpio.destroy(function() {
				console.log('Closed pins, now exit');
				return process.exit(0);
			});
		}, 100);
	});
	
}




/**
*	Delayed Write Pin Data
*	@param		{uint}  pin to write
*	@param		{uint}  data to write, 1 or 0
*	@param      {function} callaback
**/
function delayedWrite(pin, value, callback) {
    setTimeout(function() {
		//if(pin==DATA)
		var PORT ="";
		if(pin==DATA) PORT="DATA";
		if(pin==LATCH) PORT="LATCH";
		if(pin==CLOCK) PORT="CLOCK";
		
		if(DEBUG==1)
			console.log("delayed %s\tvalue on pin %s",value ? "ON" : "OFF",PORT);
			
        gpio.write(pin, value, callback);
    }, 10);
}
 

/**
*  Get Bit Value
*  @param  {uint} byte, the byte to analyze
*		   {uint} bit,	the bit position into byte
*  @return {uint} 1,0 
**/
function bv(byte,bit){
	
	//console.log("%d^%d = %d",2,bit,Math.pow(2,bit));
	var retVal= (byte & Math.pow(2,bit)) >>bit;
	retVal = Number(retVal);
	//console.log("%s %s %s",byte,bit,retVal);
	return retVal;
}

/**
*	Call shiftout function
*   @param  {uint} data to write into 
*	@msb    {uint} 1 = most significant bit first, 0 = least significant bit first
**/
function writeData(data,msb){
		
		shift_out(data,msb);
		
		
}

module.exports = {
	
	/**
	* Set Pin For Shiftout
	**/
	write: function(latch,clock,data,value,debug){
		
		LATCH=latch;
		CLOCK=clock;
		DATA=data;
		DEBUG=0;
		
		async.parallel([
			function(callback) {
				gpio.setup(LATCH, gpio.DIR_OUT, callback)
			},
			function(callback) {
				gpio.setup(CLOCK, gpio.DIR_OUT, callback)
			},
			function(callback) {
				gpio.setup(DATA, gpio.DIR_OUT, callback)
			},
			], function(err, results) {
				console.log('Pins set up');
				writeData(value,true);
			
			});
			
			
		
		
	}	
	
	
}
