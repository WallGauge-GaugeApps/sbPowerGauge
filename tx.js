/*
    tx.js command line module for sening RGauge encoded IR commands. 
*/
var cp =          require('child_process');

if(process.argv.length == 6){
    var rG_Address = process.argv[2];
    var rG_Command = process.argv[3];
    var rG_Data    = process.argv[4]; 
    var rG_Freq    = process.argv[5];
    console.log('Address: ' + rG_Address);
    console.log('Command: ' + rG_Command);
    console.log('   Data: ' + rG_Data);

    var encodedValue = rGaugeEncode(rG_Address, rG_Command, rG_Data);

    console.log('Sending RG-Encoded IR command ' + encodedValue + ', over a '+ rG_Freq +' carrier frequency.');

    cp.execSync('./C/irTx '+ encodedValue +' 18 '+ rG_Freq);

} else if (process.argv.length == 7){
  var rG_Address = process.argv[2];
  var rG_Command = process.argv[3];
  var rG_Data    = process.argv[4]; 
  var rG_Freq    = process.argv[5];
  var rG_Loop    = process.argv[6];
  if (rG_Loop != 'L'){
    console.log('->' + rG_Loop + '<- Looking for letter L');
    printSyntax();
    return;
  }
  console.log('Address: ' + rG_Address);
  console.log('Command: ' + rG_Command);
  console.log('   Data: ' + rG_Data);

  var encodedValue = rGaugeEncode(rG_Address, rG_Command, rG_Data);
  console.log('Command running in endless loop every 15 seconds type ctl C to stop.');
  console.log('Sending RG-Encoded IR command ' + encodedValue + ', over a '+ rG_Freq +' carrier frequency.');
  cp.execSync('./C/irTx '+ encodedValue +' 18 '+ rG_Freq);
  
  setInterval(function(){
    console.log('Sending RG-Encoded IR command ' + encodedValue + ', over a '+ rG_Freq +' carrier frequency.');
    cp.execSync('./C/irTx '+ encodedValue +' 18 '+ rG_Freq);
  },15000);

} else {
   printSyntax();
   return;
}

function printSyntax(){
  console.log('tx.js requires command line parameters');
  console.log('try -->sudo node tx.js 170 8 500 33000<--');
  console.log('     170 = address of device to send command (170 = broadcast address).');
  console.log('       8 = command number (8 is the set raw stepper value command).');
  console.log('     500 = data value (in this case it is the raw stepper value).');
  console.log('   33000 = carrier frequency to use for modulation of the infrared LED');
  console.log('       L = is an optional parm and will loop command every 30 seconds')
  console.log('\nCommand Numbers:');
  console.log(' 0	Check Battery Voltage');
  console.log(' 1	Reset');    
  console.log(' 2	Zero Needle');
  console.log(' 3	Set Gauge Address. Must do a Gauge Identify command first');   
  console.log(' 4	Set Wake time (default = 10 seconds)');
  console.log(' 5	Set Sleep time (default = 1200 seconds(20min))');
  console.log(' 6	Start cycle sleep in (seconds from now, 0 = cancel)');
  console.log(' 8	Set Raw Stepper Value');
  console.log('15	Identify gauge and set start cycle sleep (seconds from now, 0 = cancel)'); 
}

function rGaugeEncode(address = 1, cmdNum = 0, value = 0){
    if(value < 0 || value > 4095){
      console.log('rGaugeEncode called with invalid value = ' + value);
      return 0;
    }
    if(cmdNum < 0 || cmdNum > 15){
      console.log('rGaugeEncode called with invalid cmdNum = ' + cmdNum);
      return 0;
    }
    if(address < 0 || address > 255){
      console.log('rGaugeEncode called with invalid address = ' + address);
      return 0;
    }
  
    //console.log('cmdNum = '+ cmdNum + ', value = ' + value + ', address = ' + address);
    var x = 0;
    // bits 1 - 4 hold the command, range = 0 to 16
    var y = cmdNum;
    for (var i=0; i < 4; i++){
      x = x << 1;    
      x = x + (y & 1);
      y = y >> 1;
    }
    // bits 5 - 15 hold the data value, range = 0 to 4095
    var y = value;
    for (var i=0; i < 12; i++){
      x = x << 1;    
      x = x + (y & 1);
      y = y >> 1;
    }
    // bits 17 - 24 = address of device, range = 0 to 255
    var y = address;
    for (var i=0; i < 8; i++){
      x = x << 1;    
      x = x + (y & 1);
      y = y >> 1;
    }
    // bits 25 - 32 = not of device address
    var y = address;
    for (var i=0; i < 8; i++){
      x = x << 1;    
      x = x + (~y & 1);
      y = y >> 1;
    }
    var adnMask = x;
    //console.log('value in binary = '+ dec2bin(adnMask));
    //console.log('value to Send   = ' + x);
    return x;
  }
  
  function dec2bin(dec){
    return (dec >>> 0).toString(2);
  }
  
  function bin2dec(bin){
    return parseInt(bin, 2).toString(10);
  }