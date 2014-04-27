# magic-power 设计

* 版本：v1.0
* 作者：明河
* 开发者：

## 背景

magic-power来源于kissy gallery网站项目，是聚合github同类内容的系统。

比如用于kissy gallery，可以聚合github用户的组件，予以展示，成为kissy生态圈的基础。

## 技术方案选型

* NodeJs框架：express
* 数据库：[Redis](http://www.redis.cn/)
* 使用stylus写css

## 目录结构

## 数据库表设计

author:作者表

|字段名|描述|
|---|:---|
|githubName|github的用户名|
|name|用户自己配置的用户名|
|email|邮箱|
|count|推送的库数目|

## 路由

## api

