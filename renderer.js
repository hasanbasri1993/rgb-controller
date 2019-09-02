// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline');
var port = '';

function listPort() {
  var e = document.getElementById('portSelect');

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
}

function connect(a) {
  port = new SerialPort(a, { baudRate: 115200 });
  const parser = port.pipe(new Readline({ delimiter: '\n' }));
  // Read the port data
  port.on("open", () => {
    M.toast({ html: 'serial port open: ' + a, classes: 'rounded' })
  });

  parser.on('data', data => {
    document.getElementById("log").innerHTML = data;
    console.log(data);
    if (!data.includes("getsegments")) {
      M.toast({ html: data, classes: 'rounded' })
    }

    if (data.includes("getsegments")) {
      setTimeout(function () { load() }, 2000);
    }

    if (data.includes("Starting Up")) {
      $('main').fadeIn(2000);
      json = '{"command":"getsegments"}';
      exec(JSON.stringify(json));
    }
  });
}

function exec(a) {
  port.write(a + '\n', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
}