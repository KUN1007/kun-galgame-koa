# Sometimes wo need to update mongodb model, so we need execute some db operation

```
      // 更新字段名
      const result = await ReplyModel.updateMany(
        {},
        { $rename: { cid: 'comment' } }
      )

      console.log(`${result.modifiedCount} document updated`)
```