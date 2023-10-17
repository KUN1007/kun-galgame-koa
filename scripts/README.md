# Sometimes wo need to update mongodb model, so we need execute some db operation

```
      const result = await ReplyModel.updateMany(
        {},
        { $rename: { cid: 'comment' } }
      )

      console.log(`${result.modifiedCount} document updated`)

      const result = await TopicModel.updateMany({}, [
      {
        $set: {
          replies: '$rid', // create replies field and copy rid value
        },
      },
      {
        $unset: 'rid', // delete old field rid
      },
    ])
```