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

var Vue = require('vue');
Vue.use(require('vue-resource'));

const apiURL = "https://openapi.daocloud.io/v1";

document.addEventListener('DOMContentLoaded', function () {
  var vm = new Vue({

    el: '#tray',

    data: {
      loading: true,
      build_flows: [],
      apps: null,
    },

    created: function () {
      var token = 'ojn4fqxw7jceo4o9ixvhkl1k62omhtzgof5i7wua';
      Vue.http.headers.common['Authorization'] = 'token ' + token;

      this.fetchData()
    },

    methods: {
      // 切换 Tab
      tabChange: function (flag) {
        if (flag == 'build-flows') {
          this.fetchData()
        } else if (flag == 'apps'){
          this.fetchData2()
        }
      },
      // 加载
      fetchData: function () {
        this.$set('loading', true);
        this.$http.get(apiURL + '/build-flows').then(function (response) {
          console.log(response.data.build_flows)
          // set data on vm
          this.$set('build_flows', response.data.build_flows);
          this.$set('loading', false);
        }, function (response) {
            // error callback
        });
      },
      // 应用列表
      fetchData2: function () {
        this.$set('loading', true);
        this.$http.get(apiURL + '/apps').then(function (response) {
          console.log(response.data.app)
          // set data on vm
          this.$set('apps', response.data.app);
          this.$set('loading', false);
        }, function (response) {
            // error callback
        });
      }
    }
  });
});
