// var Chimera = require('../dist/chimera');
// var express = require('express');
// var Spooky = require('spooky');
// var app = express();
var readfile = require('read-file');
var server = require('webserver').create();

// var server = ws.create('127.0.0.1:8889', function (req, resp) {
// casper.test.begin('sanity')
// casper.test.begin('a twitter bootstrap dropdown can be opened', 2, function (test) {
//   casper.start('http://getbootstrap.com/2.3.2/javascript.html#dropdowns', function () {
//     test.assertExists('#navbar-example');
//     this.click('#dropdowns .nav-pills .dropdown:last-of-type a.dropdown-toggle');
//     this.waitUntilVisible('#dropdowns .nav-pills .open', function () {
//       test.pass('Dropdown is open');
//     });
//   }).run(function () {
//     test.done();
//   });
// });
// });

var service = server.listen(8889, function (req, resp) {
  console.log('- request');
  // readfile('test/page.html', function (err, buffer) {
  var buffer = 'butt';
    console.log('- sending');
    console.log(buffer);
    resp.statusCode = 200;
    resp.send(buffer.toString());
    resp.close();
  // });
});

// app.get('/', function (req, resp) {
//   readfile('test/page.html', function (err, buffer) {
//     resp.send(buffer.toString());
//   });
// });
//
// var ws = app.listen(8889, function () {
//   console.log('- express server running on port 8889');
// });
//
// function start(testsFn) {
//   var spooky = new Spooky({
//     child: {
//       transport: 'http'
//     },
//     casper: {
//       logLevel: 'debug',
//       verbose: true
//     }
//   }, function (err) {
//     if (err) {
//       e = new Error('Failed to initialize SpookyJS');
//       e.details = err;
//       app.close();
//       throw e;
//     }
//     spooky.start(
//       'http://127.0.0.1:8889/');
//     testsFn(spooky);
//     spooky.then(function () {
//       this.emit('done');
//     });
//     spooky.run();
//
//   });
//
//   spooky.on('error', function (e, stack) {
//     console.error(e);
//
//     if (stack) {
//       console.log(stack);
//     }
//   });
//
//   spooky.on('hello', function (greeting) {
//     console.log(greeting);
//   });
//
//   spooky.on('done', function () {
//     console.log('- server closing');
//     ws.close();
//   });
//
//   spooky.on('log', function (log) {
//     if (log.space === 'remote') {
//       console.log(log.message.replace(/ \- .*/, ''));
//     }
//   });
// }
//
// /*
//  === Tests ===
//  */
// start(
//   function (spooky) {
//     spooky.then(function () {
//       this.emit('hello', 'Hello, from ' + this.evaluate(function () {
//           return document.title;
//         }));
//     });
//     spooky.then(function () {
//       console.log(this.test);
//     })
//   }
// );
//
