/**
 * Copyright (C) 2015 JianyingLi <lijy91@foxmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import env from './env';
const electron = require('electron');
const globalShortcut = electron.globalShortcut;
const path = require('path')
const menubar = require('menubar')

var mb = menubar({
  icon: path.join(__dirname, 'images/tray.png'),
  index: 'file://' + path.join(__dirname, 'app.html'),
  width: 350,
  height: 290,
  preloadWindow: true,
  hasShadow: false,
  transparent: true
});

mb.on('ready', function ready () {
  if (env.name !== 'production') {
    // Open the DevTools.
    mb.window.webContents.openDevTools();
  }
  // 退出
  mb.window.on('closed', function() {
    console.log('Unregister a shortcut');
    // Unregister a shortcut.
    globalShortcut.unregister('ctrl+p');

    // Unregister all shortcuts.
    globalShortcut.unregisterAll();

    // 退出程序
    mb.app.quit();
  });
  // Register a shortcut listener.
  var ret = globalShortcut.register('ctrl+p', function() {
    console.log('ctrl+p is pressed');
    mb.window.isVisible() ? mb.hideWindow() : mb.showWindow();
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('ctrl+p'));
});
