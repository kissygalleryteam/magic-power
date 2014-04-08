# KPM持续集成系统 prd

* 版本：v1.0
* 作者：明河
* 开发者：弘树

## 【p1】使用gitlab发布接口

### 新增组件

调用gitlab接口，在kissy group下创建一个组件库，并推送master代码

### 发布组件

调用gitlab接口，找到kissy group下的该组件库，push发布。

* kissy组：[http://gitlab.alibaba-inc.com/groups/kissy](http://gitlab.alibaba-inc.com/groups/kissy)
* gitlab接口人：丽霞

提交的git日志为：

publish XX组件

问题：

* daily如何处理？
* gitlab的接口是否符合要求？

** 废弃方案，仅供参考：**

在kissy组下面新建一个gallery仓库，设置为允许覆盖发布，发布目录使用当前根目录，不使用build目录。

kpm触发发布接口时，将组件的build目录下的文件，复制到gallery仓库（gitlab）的组件目录中；

使用shell模块，触发代码提交，最后触发部署命令。


## 【p1】从a.tbcdn.cn切换成g.tbcdn.cn

由于发布接口从RMS切成gitlab，域名也要相对应地做调整。

需要保证在kissy1.5发布前切换完成。

通知承玉修改gallery包路径。


## 【p2】部署系统进化成持续集成系统

参考https://travis-ci.org/kissyteam/kissy](https://travis-ci.org/kissyteam/kissy)

系统界面重构，风格接近travis-ci。

设计师：剑平

显示更全面的组件信息，多利用github的强大api。这部分看剑平设计的后面的原型。


## 【p2】提供外部接口供工具使用

工具想要实现发布命令，需要kpm系统提供发布接口。

问题：

需要解决用户验证的问题

## 【p3】目录优化（去掉版本号目录）

去掉组件目录中的版本号层级，改用git分支处理版本。

kpm触发publish时，先读取用户配置的版本号，然后使用shell模块，git pull origin 版本号:master，拉取远程分支覆盖本地的master代码，然后

增加src目录。