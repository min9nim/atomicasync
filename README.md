# atomicasync
`atomicasync` is a function that ensure that certain asynchronous functions are executed, independently, without being overlap


### Usage
```javascript
import atomic from 'atomicasync'

const atomicAsyncFn = atomic(asyncFn)
async () => {
  /*
  * atomicAsyncFn will be executed sequentially like using await
  */
  atomicAsyncFn()
  atomicAsyncFn()
  atomicAsyncFn()
}
```

