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
* Q写异步代码
* github api
* xtemplate作为模板

## 目录结构

config:系统配置
routes:路由
module:数据库操作
views:模板,需要支持多主题
static:静态文件


## 数据库表设计

### author:作者表

|字段名|描述|
|---|:---|
|githubName|github的用户名|
|name|用户自己配置的用户名|
|email|邮箱|
|count|推送的库数目|

### tag:标签表

|字段名|描述|
|---|:---|
|name|标签名称|

### repos:用户的版本库

|字段名|描述|
|---|:---|
|name|库名称|
|author|作者id|
|tag|tag id|
|desc|描述|
|cover|封面|
|version|版本|
|updated_at|更新时间|
|created_at|创建时间|
|watchers|关注的人|
|forks|fork的人|

## 路由

### index:

## api

