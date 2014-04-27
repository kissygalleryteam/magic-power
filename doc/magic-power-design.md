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

### info: 系统信息表

|字段名|描述|
|---|:---|
|tag-count|tag数目|
|user-count|作者数目|
|repos-count|库数目|


### user:作者表

|字段名|描述|
|---|:---|
|githubName|github的用户名|
|name|用户自己配置的用户名|
|email|邮箱|
|count|推送的库数目|
|admin|是否是管理员|

### tag:标签表

|字段名|描述|
|---|:---|
|name|标签名称|

### repos:用户的版本库

|字段名|描述|
|---|:---|
|name|库名称|
|user|作者id|
|tag|tag id|
|desc|描述|
|cover|封面|
|version|版本|
|versions|历史版本列表|
|updated_at|更新时间|
|created_at|创建时间|
|watchers|关注的人|
|forks|fork的人|

## api

成功返回数据格式类似：

    {"success":1,data:[]}

失败返回数据格式类似：

    {"success":0,data:[],error:"404"}

接口存在callback参数时，返回jsonp数据

路由为：api/:name

### repos：获取库集合数据

参数：

* tag:返回指定tag下的库数据
* author:返回指定作者的库数据
* sort:排序字段，默认按照created_at排序
* len:返回数据数，默认为全部读取
* start：起始读取数据索引，默认为0
* callback：jsonp回掉函数

### author：获取作者集合数据

### tag：获取tag集合数据

### search：搜索库接口

可以使用tag、库名、描述、作者信息搜索

参数：

* s:搜索字符

### add/:name: 添加库到系统

需要校验是否是管理员

### sync/:name：同步用户库到服务器

默认24小时同步一次数据，全部同步

同步时需要抓取库的github信息

* name:只同步指定库数据
