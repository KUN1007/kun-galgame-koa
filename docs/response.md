# 后端的返回数据要求



## 返回数据格式

```typescript
interface KUNGalgameResponseData<*T*> {

 code*:* *number*

 message*:* *string*

 data*:* *T*

}
```



## 错误响应格式

```typescript
 ctx.body = code

 ctx.status = 500
```

