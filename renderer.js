const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = '';

SerialPort.list((err, ports) => {
  var elm = document.getElementById('portSelect'),
    df = document.createDocumentFragment();
  ports.forEach(function (port) {
    var option = document.createElement('option');
    option.value = port.comName;
    option.appendChild(document.createTextNode(port.comName));
    df.appendChild(option);
  });
  elm.appendChild(df);
})


function connect(a) {
  port = new SerialPort(a, { baudRate: 115200 });
  const parser = port.pipe(new Readline({ delimiter: '\n' }));

  // Read the port data
  port.on("open", () => {
    console.log('serial port open');
    M.toast({ html: 'serial port open: ' + a, classes: 'rounded' })



  });
  parser.on('data', data => {
    console.log('got word from arduino:', data);
    document.getElementById("log").innerHTML = data;
    M.toast({ html: data, classes: 'rounded' })

    //https://www.w3schools.com/jsref/jsref_includes.asp
    if (data.includes("Starting Up")) {
      $('main').fadeIn(2000);
      load();
    }
  });
}

/* function exec(a) {
  port.write('m ' + a + '\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
} */

//function set(a) {
function exec(a) {
  port.write(a + '\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
}