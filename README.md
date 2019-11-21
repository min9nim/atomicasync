# atomicasync
`atomicasync` is a function that return function that received function excuted alone always


### Usage
```javascript
import atomic from 'atomicasync'

const atomicAsyncFn = atomic(asyncFn) // atomic 으로 래핑된 함수 asyncFn 은 어떤 상황에서도 순차적 실행이 보장된다
async () => {
  atomicAsyncFn()
  atomicAsyncFn()
  atomicAsyncFn()
}
```

