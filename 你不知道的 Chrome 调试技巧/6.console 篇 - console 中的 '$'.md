# console 篇 - console 中的 '$'

## 前言

`$` 作为 `jQuery` 的选择器，承载了一代前端的太多记忆，但是你可能没有想到的是，在我们使用 `Dev Tools` 进行调试的时候，`$` 也有大放异彩的一天呢？

## 1. `$0`

在 `Chrome` 的 `Elements` 面板中， `$0` 是对我们当前选中的 `html` 节点的引用。

理所当然，`$1` 是对上一次我们选择的节点的引用，`$2` 是对在那之前选择的节点的引用，等等。一直到 `$4`

你可以尝试一些相关操作(例如: `$1.appendChild($0)`)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785c75b56d3a80~tplv-t2oaga2asx-image.image)

## 1. `$` 和 `?`

如果你没有在 `App` 中定义过 `$` 变量 (例如 `jQuery` )的话，它在 `console` 中就是对这一大串函数 `document.querySelector` 的别名。

如果是 `?` 就更加厉害了，还能节省更多的时间，因为它不仅执行 `document.QuerySelectorAll` 并且它返回的是：一个节点的 **数组** ，而不是一个 `Node list`

本质上来说 `Array.from(document.querySelectorAll('div')) === ?('div')` ，但是`document.querySelectorAll('div')` 和 `?('div')` 哪一种方式更加优雅呢？

## 2. `$_`

调试的过程中，你经常会通过打印查看一些变量的值，但如果你想看一下上次执行的结果呢？再输一遍表达式吗？ 

这时候 `$_` 就派上了用场，`$_` 是对上次执行的结果的 **引用** ：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785d333e7c1d7f~tplv-t2oaga2asx-image.image)

## 3. `$i`

现在的前端开发过程，离不开各种 `npm` 插件，但你可能没有想过，有一天我们竟然可以在 `Dev Tools` 里面来使用 `npm` 插件！

有时你只是想玩玩新出的 `npm` 包，现在不用再大费周章去建一个项目测试了，只需要在 [Chrome插件:Console Importer](https://chrome.google.com/webstore/detail/console-importer/hgajpakhafplebkdljleajgbpdmplhie/related) 的帮助之下，快速的在 `console` 中引入和测试一些 `npm` 库。

运行 `$i('lodash')` 或者 `$i('moment') ` 几秒钟后，你就可以获取到 `lodash / momentjs` 了:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785da0dea963fb~tplv-t2oaga2asx-image.image)