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
const version = require('./package.json').version;
const electron = require('electron');
const app = electron.app;
const shell = electron.shell;
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const Vue = require('vue');
const VueResource = require('vue-resource');
const moment = require('moment');
const uuid = require('uuid');
const replaceall = require("replaceall");
const yunba = new Yunba({'appkey': '<Your Appkey>'});

Vue.use(VueResource);

Vue.http.options.root = 'https://openapi.daocloud.io/v1'

var winPref = null;

document.addEventListener('DOMContentLoaded', function () {
  // 从 localStorage 获取别名，如果不存在则创建
  var yunba_alias = localStorage.getItem('yunba_alias');
  if (!yunba_alias) {
    yunba_alias = uuid.v4();
    yunba_alias = replaceall("-", "", yunba_alias);
    localStorage.setItem('yunba_alias', yunba_alias);
  }
  // 初始化云巴SDK
  yunba.init(function (success) {
    if (success) {
      // 连接服务器
      yunba.connect(function (success, msg) {
        if (success) {
          // 设置别名，成功后服务端的消息将会在set_message_cb方法接收
          yunba.set_alias({'alias': yunba_alias}, function (data) {
            if (data.success) {
              console.log('别名：' + yunba_alias + " 设置成功");
            } else {
              console.log(data.msg);
            }
          });
        }
      });
    }
  });

  // 云巴消息监听
  yunba.set_message_cb(function (data) {
      console.log(data);
      // 创建一个通知
      var notification = new Notification('DaoCloud Plus', {
          body: data.msg
      });

  });
  var vm = new Vue({
    el: '#app',
    data: {
      need_update: false,
      loading: true,
      build_flows: [],
      apps: null,
      has_error: false,
    },
    created: function () {
      // 初次启动获取代码构建数据
      this.fetchBuildFlows();
      // 检查更新
      this.checkNewVersion();
    },
    methods: {
      // 获取 API Token
      getApiToken: function () {
        return localStorage.getItem('api_token');
      },
      // 首选项
      preferences: function () {
        // 首选项
        // 意见反馈
        // --------
        // 退出
        var template = [
          {
            label: '首选项',
            click: function() {
              if (winPref !== null) {
                winPref.show();
                return;
              }
              var win = new BrowserWindow({
                width: 520,
                height: 360,
                show: false,
                resizable: false,
                alwaysOnTop: true,
              });
              win.on('closed', function() {
                win = null;
                winPref = null;
              });

              win.loadURL('file://' + __dirname + '/components/preferences/preferences.html');
              win.show();

              winPref = win;
              // win.webContents.openDevTools();
            }
          },
          {
            label: '意见反馈',
            click: function() { shell.openExternal('https://github.com/lijy91/daocloud-plus/issues') }
          },
          {
            type: 'separator'
          },
          {
            label: '退出',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          }
        ];

        var menu = Menu.buildFromTemplate(template);
        menu.popup(remote.getCurrentWindow());
      },
      // 切换 Tab
      tabChange: function (flag) {
        if (flag == 'build-flows') {
          this.fetchBuildFlows()
        } else if (flag == 'apps'){
          this.fetchApps()
        }
      },
      // 检查新版本
      checkNewVersion: function () {
        this.$http.get('https://raw.githubusercontent.com/lijy91/daocloud-plus/master/app/package.json').then(function (response) {
          var data = response.data;
          if (data.version > version) {
            this.$set('need_update', true);
          }
        }, function (response) {
            // error callback
            console.log(response);
        });
      },
      // 获取代码构建数据
      fetchBuildFlows: function () {
        // 设置为加载中
        this.$set('loading', true);
        this.$http.get('build-flows', null, {
          headers: { 'Authorization': 'token ' + this.getApiToken() }
        }).then(function (response) {
          console.log(response);
          // set data on vm
          this.$set('build_flows', response.data.build_flows);
          this.$set('loading', false);
        }, function (response) {
          this.$set('loading', false);
          this.$set('has_error', response.status != 200);
        });
      },
      // 获取应用管理数据
      fetchApps: function () {
        // 设置为加载中
        this.$set('loading', true);
        this.$http.get('apps', null, {
          headers: { 'Authorization': 'token ' + this.getApiToken() }
        }).then(function (response) {
          console.log(response);
          // set data on vm
          this.$set('apps', response.data.app);
          this.$set('loading', false);
        }, function (response) {
          this.$set('loading', false);
          this.$set('has_error', response.status != 200);
        });
      }
    },
    filters: {
      moment: function (date) {
        moment.locale('zh-cn');
        return moment(date, 'YYYY-MM-DDThh:mm:ssTZD').fromNow();
      }
    }
  });
});
