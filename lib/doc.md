## 基本介绍
db模块主要是基于Q封装了redis操作

* core redis的基础操作
* info,user,repos,tag 分别对等几个“表”（redis数据库里没有表的概念）的操作进行了分装
* index db模块的入口文件，也可以单个引用

## 使用介绍

```
var DB = require('../lib/db');

DB.repos.add({
	name:'imagefilter',
	user:'zihan',
	tag:'img'
})
.then(function(d){
	console.log(d);
})
.fail(function(e){
	console.log(e);
})

```

## 主要api，都是promise的

* info （redis 类型 String）
  - get 获取信息
  - set 设置信息

* user （redis 类型 List）
  - size user数量
  - getAll 获取全部user
  - getByEmail 根据email获取用户，email是唯一标识
  - add 增加用户
  - isAdmin 是否为管理员


* repos （redis 类型 List）
  - size repos数量
  - getAll 获取全部repos
  - getByName 根据name获取repos，name是唯一标识
  - add 增加repos
  - queryByKeyword 根据关键字查询组件（搜索的地方用）

* tag （redis 类型 List）
  - size tag数量
  - getAll 获取全部tag
  - add 增加tag
  - getReposByTag 查询到某个tag下面的全部repos


