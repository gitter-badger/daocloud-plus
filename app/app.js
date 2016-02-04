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
const app = electron.app;
const shell = electron.shell;
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const Vue = require('vue');
Vue.use(require('vue-resource'));

const apiURL = "https://openapi.daocloud.io/v1";
var winPref = null;

document.addEventListener('DOMContentLoaded', function () {
  var vm = new Vue({

    el: '#tray',

    data: {
      loading: true,
      build_flows: [],
      apps: null,
    },

    created: function () {
      // 初次启动获取代码构建数据
      this.fetchBuildFlows()
    },

    methods: {
      // 获取 API Token
      getApiToken: function () {
        return localStorage.getItem('api_token');
      },
      // 首选项
      preferences: function () {
        // 个人信息
        // --------
        // 首选项
        // 意见反馈
        // --------
        // 退出
        var template = [
          // {
          //   label: '个人信息',
          //   enabled: false,
          //   click: function() {
          //     console.log('点击了个人信息')
          //   }
          // },
          // {
          //   type: 'separator'
          // },
          {
            label: '首选项',
            click: function() {
              if (winPref !== null) {
                winPref.show();
                return;
              }
              var win = new BrowserWindow({
                width: 520,
                height: 320,
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
      // 获取代码构建数据
      fetchBuildFlows: function () {
        // 设置 API Token
        Vue.http.headers.common['Authorization'] = 'token ' + this.getApiToken();
        // 设置为加载中
        this.$set('loading', true);
        this.$http.get(apiURL + '/build-flows').then(function (response) {
          // set data on vm
          this.$set('build_flows', response.data.build_flows);
          this.$set('loading', false);
        }, function (response) {
            // error callback
            console.log(response);
        });
      },
      // 获取应用管理数据
      fetchApps: function () {
        // 设置 API Token 保证每次都是最新的 Token
        Vue.http.headers.common['Authorization'] = 'token ' + this.getApiToken();
        // 设置为加载中
        this.$set('loading', true);
        this.$http.get(apiURL + '/apps').then(function (response) {
          // set data on vm
          this.$set('apps', response.data.app);
          this.$set('loading', false);
        }, function (response) {
            // error callback
            console.log(response);
        });
      }
    }
  });
});
