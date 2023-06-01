<h1 align="center">juejin-download</h1>

<p align="center">掘金小册下载</p>

## 使用方法

### 安装依赖

```bash
npm install
```

### 获取 Cookie

- 安装 [Chrome](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) 或 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/) 的 cookie editor 扩展
- 打开 [掘金](https://juejin.cn)
- 打开扩展程序
- 点击右下角的 "Export" -> "Export as JSON" (保存到剪贴板)
- 把你剪贴板上的内容粘贴到 `cookies.json` 文件中

### 执行脚本

```bash
node main.js
```

## 声明

本项目只做个人学习研究之用，不得用于商业用途！
