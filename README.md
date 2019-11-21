# atomicasync
`atomicasync` is a function that ensure that certain asynchronous functions are executed, independently, without being overlap

<br>

## Install
```
npm i atomicasync
```

<br>

## Usage
```javascript
const atomic = require('atomicasync')

function asyncFn(){
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('asyncFn called', new Date())
      resolve('done')
    }, 1000)
  })
}

const atomicAsyncFn = atomic(asyncFn)
/*
* atomicAsyncFn will be executed sequentially like using await
*/
atomicAsyncFn()   // 1s later call
atomicAsyncFn()   // 2s later call
atomicAsyncFn()   // 3s later call
```

