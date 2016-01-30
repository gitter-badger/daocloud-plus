// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
var path = require('path')
var app = require('app')
var menubar = require('menubar')

var mb = menubar({
  index: 'file://' + path.join(app.getAppPath(), 'app.html'),
  preloadWindow: true,
  hasShadow: false,
  transparent: true
});

mb.on('ready', function ready () {
});
