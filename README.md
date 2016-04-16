daocloud-plus
==============

[![Join the chat at https://gitter.im/lijy91/daocloud-plus](https://badges.gitter.im/lijy91/daocloud-plus.svg)](https://gitter.im/lijy91/daocloud-plus?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://api.travis-ci.org/lijy91/daocloud-plus.svg?branch=master)](https://travis-ci.org/lijy91/daocloud-plus)

DaoCloud+ 项目是一个 [DaoCloud](https://daocloud.io) 迷你控制台托盘程序，用于更方便的查看控制台里 **代码构建** 及 **应用管理** 的相应信息，并且通过 ***[云巴](https://yunba.io/)*** + ***[Webhook](http://docs.daocloud.io/api/#webhook)*** 实现了消息推送功能，推送服务实现的项目地址： [daocloud-plus-notifier](https://github.com/lijy91/daocloud-plus-notifier)，主要使用了 [Electron](https://electron.atom.io) 和 [Vue.js](https://vuejs.org) 两个框架，并且使用了优秀的 [electron-boilerplate](https://github.com/szwacz/electron-boilerplate) 脚手架项目用于构建项目。

## 下载(0.1.1-alpha)
- [OSX](https://github.com/lijy91/daocloud-plus/releases/download/0.1.1-alpha/daocloud-plus_0.1.1-osx.zip)
- ~~[Windows](http://jianying.li)~~
- ~~[Linux](http://jianying.li)~~

## 如何编译

1、克隆到本地
```
$ git clone https://github.com/lijy91/daocloud-plus.git
$ cd daocloud-plus
```

2、安装依赖库
```
$ npm install
```

3、运行
```
$ npm start
```

## 如何打包
运行下面的脚本即会打包相应平台的安装包

```
$ npm run release
```

## License

    Copyright (C) 2016 JianyingLi <lijy91@foxmail.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
