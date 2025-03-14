# MediaPlayer

可定制，插件化，轻量灵活的视频播放器


[![npm version](https://img.shields.io/npm/v/@lin-media/player.svg)](https://www.npmjs.org/package/@lin-media/player) 
[![downloads](http://img.shields.io/npm/dm/@lin-media/player.svg)](https://npmcharts.com/compare/@lin-media/player?minimal=true) 
[![gzip size](http://img.badgesize.io/https://unpkg.com/@lin-media/player/dist/index.js?compression=gzip&label=gzip%20size:%20JS)](http://img.badgesize.io/https://unpkg.com/@lin-media/player/dist/index.js?compression=gzip&label=gzip%20size:%20JS) 
[![LICENSE](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/c10342/media-player/blob/main/LICENSE) 
[![Test](https://github.com/c10342/media-player/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/c10342/media-player/actions/workflows/test.yml) 
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5447a8ea758644ccbf7377e1a8288368)](https://www.codacy.com/gh/c10342/media-player/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=c10342/media-player&amp;utm_campaign=Badge_Grade)


## 在线文档

[http://player.linjiafu.top](http://player.linjiafu.top)

## 简介

`MediaPlayer` 是由多包架构组成的开源项目。其中`@lin-media/player`为核心包，集成了一些常用的功能，如清晰度切换，倍数播放，全屏等等；其他非常见功能通过插件的形式扩展使用，如截图，弹幕，自定义进度条提示点等等；其中，插件以第三方包的形式存在，独立于`@lin-media/player`核心包，使用的时候需要自行进行下载安装。

目前有六个插件包，分别为：

- 弹幕插件 `@lin-media/danmaku`
- 缩放插件 `@lin-media/zoom`
- 截图插件 `@lin-media/screenshot`
- 右键菜单插件 `@lin-media/contextmenu`
- 视频缩略图预览插件 `@lin-media/preview`
- 自定义进度条提示插件 `@lin-media/highlight`

为什么要使用插件的形式扩展？

1、考虑到一些功能使用频率不高，但我们在打包的时候也无法剔除这些功能，这样就会导致我们的打包体积变大。

2、开闭原则。当我们需要实现新的功能的是时候，可通过插件的形式去实现，而不是在`@lin-media/player`这个核心包中添加功能

3、防止包的体积无限制得增大。插件功能天然支持按需加载功能

## 特点

- 基于`typescript`开发的一款视频播放器
- 没有第三方依赖
- 支持插件功能，可定制一些其他的功能
- 按需加载
- 自定义主题
- 支持移动端和pc端

## 安装使用

安装

```
npm i @lin-media/player
```

初始化

```javascript
import MediaPlayer from "@lin-media/player";
const player = new MediaPlayer({
  // 容器
  el: ".container",
  // 视频列表
  videoList: [
    {
      label: "标清",
      url: "http://127.0.0.1/demo.mp4"
    },
    {
      label: "高清",
      url: "http://127.0.0.1/demo.mp4"
    }
  ]
});
```

经过上述步骤，一个具有常见功能的视频播放器就会出现在你的眼前！！！

## 使用插件

以弹幕插件为例：

安装
```
npm i @lin-media/danmaku
```

注册使用插件
```javascript
import MediaPlayer from "@lin-media/player";
import Danmaku from "@lin-media/danmaku";
// 全局注册插件。插件注册分全局注册和局部注册
MediaPlayer.use(Danmaku);

const player = new MediaPlayer({
  // ...
  Danmaku: {
    // 弹幕字体颜色，随机
    fontColors: ["blue", "red", "green", "#fff"],
    // 弹幕字体大小随机
    fontSizes: [16, 18, 20, 22, 24, 26, 28]
  }
});
```

发送弹幕
```javascript
player.danmaku.send('你好')
```

## 浏览器支持

- 现代浏览器
- [Electron](http://electron.atom.io/)

注意：默认不支持IE浏览器，如果你有需要，请自行使用 `polyfill` 进行兼容

## 问题 & 建议

如果你在使用 `MediaPlayer` 时遇到问题，或者有好的建议，欢迎给我提 [Issue](https://github.com/c10342/media-player/issues/new/choose)

## 贡献

如果想参与贡献，请查看 [CONTRIBUTING](https://github.com/c10342/media-player/blob/main/CONTRIBUTING.md) 。

## LICENSE

[MIT](LICENSE)


## 其他

更详细的功能请查看在线文档，[点击这里](http://player.linjiafu.top)