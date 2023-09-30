# 关于 mongodb 和 mongoose 的一些说明



## 概览

`KUNGalgame` 后端整体是采用 `koa + mongodb` 技术栈的，`mongodb` 是一个 `NoSQL` 数据库，与传统的 `MySQL` 和 `PostgreSQL` 可能有一些区别。

* 由于我们是 `Nodejs` 的后端，所以我们采用 `mongoose` 来作为 `mongodb` 的驱动，或许您可能了解 `ORM` ，`mongoose` 就好比 `Hibernate`, `MyBatis` 之类的东东
* 在 `mongodb` 中，`Collection` 和 `Document` 可以类比于关系型数据库中的 `Table` 和 `Row`
* 关于 `Schema`，在 `mongodb` 中 `Schema` 是数据库中 `Collection` 的结构描述，在 `mongoose` 中，它是一层 `ORM`，`mongoose` 的 `schema` 不仅用于描述数据模型的结构，还可以定义数据模型的方法、虚拟字段等。
* 关于 `Model`，在 `mongodb` 中 `Model` 是 `Collection` 的抽象，它允许应用程序执行数据库操作。由于 `mongoose` 的缘故，使用 `mongoose.model` 可以很方便的使用 `Model` 与数据库进行交互，它通过定义 `Schema`和使用模型的方式，将应用程序中的数据映射到数据库文档。
* 关于数据库范式，由于这是 `NoSQL`，~~所以关系范式没有啦~~。因此您可以看到我们的用户表等完全不遵循关系数据库范式。



## Transaction

` Transaction` 是一个很重要的特性，在 `mongodb` 中同样存在 `Transaction`，`KUNGalgame` 采用 `mongoose`，会以如下方式使用 `Transaction`

```typescript
  // *Start Transaction*

  const session = *await* mongoose.*startSession*()

  session.*startTransaction*()



  *try* {

   ...some operation

  } *catch* (error) {

   // *If catch error, abort transaction*

   *await* session.*abortTransaction*()

   session.*endSession*()

   *throw* error

  }
```



## Trigger

在 `mongodb` 中，没有 `trigger`，但是 `KUNGalgame` 借助 `mongoose` 的 `pre-save` 实现了类似的效果

```typescript
// *pre-save hook，increase nid before save document*

NonMoeSchema.*pre*('save', *increasingSequence*('nid'))
```



## Join

`mongodb` 中没有 `join`，但是我们可以用类似的方法实现，例如 `Embedded`, `References`, `Aggregation`，由于 `KUNGalgame` 未采用 `_id` 作为集合的唯一查询标识 (`_id` 是有的，只是没有用而已)，因为**我们觉得在浏览器地址栏输入 `topic/1` 或者 `kungalgamer/1`，就能进入用户或者话题的主页是一件非常酷的事情**，所以我们将每一个 `Schema` 都添加了一个字段 `XXXid`，用来标识唯一性。因此我们无法使用 `ref` 来进行类似于 `join` 的操作，所以我们使用了 `Virtuals` 来实现类似的操作。

```typescript
// *Create virtual 'users'*

TopicSchema.*virtual*('user', {

 ref: 'user',

 localField: 'uid',

 foreignField: 'uid',

})
```

使用的时候只需要

```typescript
  const topics = *await* TopicModel.*find*(query)

   .*sort*(sortOptions)

   .*skip*(skip)

   .*limit*(limit)

   .*populate*('user', 'uid avatar name')

   .*lean*()
```

