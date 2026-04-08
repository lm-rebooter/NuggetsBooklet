# React Native 端打包与发布

如何愉快地打包发布，可能你还在头疼安卓的签名、难缠的 Gradle 和各种配置，还在郁闷 iOS 打包发布时在 Xcode 来回折腾，为什么不能脱离这些原生开发才需要的步骤呢？React Native 本身就是为了统一安卓和 iOS，如今到打包这一步却要区别对待，颇为不妥，Expo 就是个很好的解决方案，它提供壳子，我们只需要关心我们自己的代码，然后放进壳里即可。

在打包发布步骤之前，我们先对开发者的源代码进行预处理打包，转成 React Native 代码：

``` bash
taro build --type rn
```

## 打包

在 dist 中得到热腾腾的 React Native 代码，就可以开始进行打包了，打包教程可以查阅 Expo 文档：[Building Standalone Apps](https://docs.expo.io/versions/latest/distribution/building-standalone-apps)。

## 发布

### 发布到 Expo

Expo 的发布教程可以查阅文档：[Publishing](https://docs.expo.io/versions/latest/guides/publishing.html)（发布到 Expo 不需要先经过打包），通过 Expo 客户端打开发布后的应用 CDN 链接来访问。

![通过 Expo 打开一个 APP](https://user-gold-cdn.xitu.io/2018/10/8/166517342e01e7cb?w=1104&h=660&f=png&s=112398)

发布后的应用有个专属的地址，比如应用 [Expo APIs](https://expo.io/@community/native-component-list)，通过 Expo 客户端扫描页面中的二维码进行访问（二维码是个持久化地址 persistent URL）。

### 正式发布

如果你需要正式发布你的独立版应用，可以把打包所得的 IPA 和 APK 发布到 Apple Store 和应用市场，详细参阅 [Distributing Your App](https://docs.expo.io/versions/latest/distribution/index.html)，后续的更新可以通过发布到 Expo 更新 CDN 的资源来实现。

## 参考资料

- [为什么选择 Expo？](https://nervjs.github.io/taro/docs/react-native.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%80%89%E6%8B%A9-expo)
- [Expo Docs: Building Standalone Apps](https://docs.expo.io/versions/latest/distribution/building-standalone-apps)
- [Expo Docs: Publishing](https://docs.expo.io/versions/latest/guides/publishing.html)
- [Expo Docs: Distributing Your App](https://docs.expo.io/versions/latest/distribution/index.html)
- [Expo Docs: How Expo Works](https://docs.expo.io/versions/latest/guides/how-expo-works.html#publishingdeploying-an-expo-app-in-production)

