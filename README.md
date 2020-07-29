# Vue 就要音乐 WEBAPP


> 基于 Vue(2.6) + vuex + vue-router + vue-axios + better-scroll + Stylus + ES6 等技术开发一款移动端音乐WebApp，UI参考了手机网页版的网易云音乐、flex布局适配常见移动端。


### 项目演示地址(或下方二维码)：[就要音乐](http://music.cxp853.top "就要音乐")
![二维码](http://tu.cxp853.top/images/2020/07/29/QRcode_SP--3.md.jpg)

## 我为什么要做？

#### 通过学习开发一个Vue的全家桶项目，让自己更熟练的使用 Vue 全家桶、模块化开发、ES6 等知识，提高自己的技术能力。

## 我使用了什么技术？

#### 前端相关

- [Vue](https://cn.vuejs.org/ "Vue")：用于构建用户界面的 MVVM 框架
- [vue-router](https://router.vuejs.org/zh/ "vue-router")：为单页面应用提供的路由系统，使用了 Lazy Loading Routes 技术来实现异步加载优化性能
- [vuex](https://vuex.vuejs.org/zh/ "vuex")：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- [vue-lazyload](https://www.npmjs.com/package/vue-lazyload "vue-lazyload")：图片懒加载技术，节省用户流量，优化页面加载速度
- [better-scroll](http://ustbhuangyi.github.io/better-scroll/doc/zh-hans/#better-scroll%20%E6%98%AF%E4%BB%80%E4%B9%88 "better-scroll")：移动端各种滚动场景需求的插件，使移动端滑动体验更加流畅
- [Stylus](https://stylus.bootcss.com/ "Stylus")：富于表现力、动态的、健壮的 Css 预编译处理器
- [ES6](https://www.runoob.com/w3cnote/es6-tutorial.html "ES6")：ECMAScript 新一代语法，模块化、解构赋值。

#### 后端相关

- [Node.js](https://nodejs.org/en/ "Node.js")：利用 Express 搭建的本地测试服务器
- [vue-axios](https://cn.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html "vue-axios")：用于前端与后端 API 音乐数据的交互
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi "NeteaseCloudMusicApi")：网易云音乐 NodeJS 版 API，提供音乐数据

#### 工具

- [vue-cli](https://cli.vuejs.org/ "vue-cli")：Vue 脚手架工具，快速初始化项目，便于项目的集中管理
- [fontawesome](https://fontawesome.com/ "fontawesome")：一套绝佳的图标字体库和CSS框架
- [fastclick](https://github.com/ftlabs/fastclick "fastclick") ：消除 click 移动游览器 300ms 的延迟



## 我做了什么功能

**播放器、推荐页面、排行榜页面、歌手页面、歌单详情、歌手详情、搜索页面、播放列表、历史记录、收藏记录等。**

#### 推荐页面、排行榜页面、歌手页面简介：

推荐页分成三个部分，分别是轮播图、推荐歌单、推荐歌曲，数据都是使用 axios 请求 API 获取得到的，图片使用 vue-lazyload 实现懒加载。

轮播图：使用 better-scroll 实现，具体可以Slide组件的代码。或查看better-scroll的官方文档，点击跳转方面实现点击歌曲进行播放和点击歌单的跳转到歌单页面。

推荐歌单，推荐歌曲：使用 vuex 管理数据，方便组件之间的公用数据（歌曲的ID，歌曲的名字，歌曲的图片等这些数据）交互（播放歌曲，跳转到歌单页面）。

排行榜页面：同样使用axios请求API获得数据，将公用数据放到vuex内进行统一管理。

歌手页面：和排行榜页面一样，同样使用axios请求API获得数据，将公用数据放到vuex内进行统一管理。区别是歌手页面要实现歌手列表的左列表右字母滑动联动。

#### 歌手详情页页，歌单详情页

歌手详情页、歌单详情页：通过歌单或歌手的 ID 来获取歌单中的歌曲数据，在体验上进行了一些交互效果，例如上滑显示状态栏然后将状态栏标题变为歌单名等，两者基本上相同，在UI界面方面根据不同的内容作出不同的优化

#### 播放器、播放列表

实现功能：顺序播放、单曲循环、随机播放、收藏。

播放、暂停：使用 HTML5 的 audio 实现。

歌曲数据、播放状态、播放历史、收藏歌曲：使用了 vuex 来进行管理，因为数据太多，组件直接传递的话比较麻烦的，所以使用 vuex 进行数据传递

图标：fontawesome图标库，中间的唱片旋转动画使用了CSS3 transform属性。

歌词：使用 第三方库 lyric-parser 进行处理。实现显示歌词、拖动进度条歌词同步滚动、歌词跟随歌曲进度高亮。

数据存储：通过 localstorage 存储收藏歌曲数据和播放历史数据。

播放列表：显示和管理当前播放歌曲，可以用来删除播放列表中的歌曲、以及选择播放歌曲。

#### 搜索、历史记录、收藏记录

实现功能：搜索歌手、歌单、歌曲、热门搜索、数据节流、上拉刷新、保存搜索记录。

功能实现：通过关键字请求 API 获取搜索数据，显示歌手、歌单、歌曲。

浏览刷新：实现了浏览到底部刷新，因为搜索可以设置请求数据的条数，所以可以用来浏览到底部刷新的功能。

数据节流：通过节流函数实现数据节流，通过 localstorage 存储搜索数据。

历史记录、收藏记录：将在本地存储的播放历史和收藏历史数据显示出来，



## 预览效果

- **推荐页，排行榜页，歌手页**

<span>
<img src="http://tu.cxp853.top/images/2020/07/29/9c30ffa615a07b6f5f266b5760ed08b.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/b3fd5a2865bbb526c2c6fd81f7445be.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/845063c20a65fc69d351e81bd1d0f6d.md.png" width=30% height=30%>

</span>

- **歌单详情，收藏列表，历史记录**

<span>
<img src="http://tu.cxp853.top/images/2020/07/29/64b9b1c5e3c8af22cddc998f0ee1396.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/32c65965fb6953ce7a06dd7049d4b99.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/f3da63fd106cbc1e6a3f6177994f066.md.png" width=30% height=30%>

</span>

- **播放列表，播放器，搜索页面**

<span>
<img src="http://tu.cxp853.top/images/2020/07/29/59235cde30387e6b29398cc12159722.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/8fb93254899805acbac87c947b949cd.md.png" width=30% height=30%>

<img src="http://tu.cxp853.top/images/2020/07/29/3d29c9adc8bc78c06ffe81a39a1d5ee.md.png" width=30% height=30%>

</span>


## 未来要做什么
1. **增加会员登录，注册功能**
2. **增加歌曲评论功能**
3. **增加 MV、电台功能**

## 致谢
Binaryify：[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi "NeteaseCloudMusicApi")

ustbhuangyi： [Vue 实战教程](https://coding.imooc.com/class/107.html "Vue 实战教程")

