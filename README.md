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
import atomic from "atomicasync"

function asyncFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("asyncFn called", new Date())
      resolve("done")
    }, 1000)
  })
}

const atomicAsyncFn = atomic(asyncFn) //  2nd parameter(thisObj) is required when asyncFn use `this`
/*
 * atomicAsyncFn will be executed sequentially like using await
 */
atomicAsyncFn() // 1s later call
atomicAsyncFn() // 2s later call
atomicAsyncFn() // 3s later call
```

<br>

## Optional atomic

Usable only [RORO pattern](https://www.freecodecamp.org/news/elegant-patterns-in-modern-javascript-roro-be01e7669cbd/)

```javascript
import { useAddAtomicOption } from "atomicasync"

const obj = {
  async1(args?: any) {
    console.log(args.msg, "start")
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(args.msg, "end")
        resolve("done")
      }, 100)
    })
  },
  async2(args?: any) {
    console.log(args.msg, "start")
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(args.msg, "end")
        resolve("done")
      }, 200)
    })
  },
}

const addAtomic = useAddAtomicOption()

obj.async1 = addAtomic(obj.async1)
obj.async2 = addAtomic(obj.async2, obj) //  2nd parameter(thisObj) is optional here, but required when function of 1st parameter use `this` reference

obj.async1({ msg: "A" }) // overlaped
obj.async2({ msg: "B" }) // overlaped
obj.async1({ atomic: true, msg: "C" }) // atomic call(not overlaped)
obj.async2({ msg: "D" }) // overlaped
obj.async2({ msg: "E" }) // overlaped
obj.async2({ atomic: true, msg: "F" }) // atomic call(not overlaped)
obj.async1({ msg: "G" }) // overlaped
obj.async2({ msg: "H" }) // overlaped

/* 
A start
B start
A end
B end
C start
C end
D start
E start
D end
E end
F start
F end
G start
H start
G end
H end
*/
```
