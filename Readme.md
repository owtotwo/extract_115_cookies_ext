# 提取115.com的Cookies · Chrome扩展应用（适用于115浏览器）

`author: owtotwo`

*配合[Offline-115](https://github.com/owtotwo/Offline-115)使用*

## Install
1. `$ git clone https://github.com/owtotwo/extract_115_cookies_ext.git`
2. 打开chrome浏览器/115浏览器，打开插件页面，开启开发者模式，点击“加载已解压的扩展程序”，选择
`extract_115_cookies_ext`文件夹，即可使用。

## Usage
在115.com网站登录后，将自动检查登录状态，成功后自动弹出cookie下载框。

另外在115.com网站页面右键也可以点击`Save 115 Cookies`按钮进行检查登录并下载cookie文件。


## About cookie file
cookie文件`115.cookies`是以分号分隔的115网站Cookie的key-value对。

内容样例如下：
```
// Save by chromium-like browser extension
CID=dd11054f7759d8c4db;SEID=4cdba76837adddc2;
```


## License
[LGPLv3](./License)
