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

const Vue = require('vue');
const AutoLaunch = require('auto-launch');
const productName = require('../../package.json').productName;

var appLauncher = new AutoLaunch({ name: productName });

document.addEventListener('DOMContentLoaded', function () {
  var vm = new Vue({

    el: '#preferences',

    data: {
      api_token: localStorage.getItem('api_token'),
      auto_launch: localStorage.getItem('auto_launch'),
      notifier_url: 'http://daocloud-plus.blankapp.org/' + localStorage.getItem('yunba_alias'),
    },

    watch: {
      api_token: 'apiTokenChanged',
      auto_launch: 'autoLaunchCahnge'
    },

    methods: {
      apiTokenChanged: function () {
        localStorage.setItem('api_token', this.api_token);
      },
      // 开机自启动
      autoLaunchCahnge: function () {
        if (this.auto_launch) {
          appLauncher.enable(function(err) {
            if (!err) {
              localStorage.setItem('auto_launch', true);
            }
          });
        } else {
          appLauncher.disable(function(err) {
            if (!err) {
              localStorage.setItem('auto_launch', false);
            }
          });
        }
      }
    }
  });
});
