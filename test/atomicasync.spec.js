const {expect} = require('chai')
const atomicasync = require('../src/index')

describe('atomicasync', () => {
  it('should be excuted subsequentially with continuous call', async () => {
    const delay = ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }
    let count = 0
    const asyncFn = async () => {
      await delay(100)
      count++
    }
    asyncFn()
    asyncFn()
    await delay(150)
    expect(count).to.be.equal(2)
  
    count = 0
    const atomicAsyncFn = atomicasync(asyncFn)
    atomicAsyncFn()
    atomicAsyncFn()
    await delay(150)
    expect(count).to.be.equal(1)
    await delay(100)
    expect(count).to.be.equal(2)
  })
  it('should return same promise of origin async function', async () => {
    const asyncFn = () => Promise.resolve(2)
    const atomicAsyncFn = atomicasync(asyncFn)
    const asyncFnResult = await asyncFn()
    const atomicAsyncFnResult = await atomicAsyncFn()
    expect(atomicAsyncFnResult).to.be.equal(asyncFnResult)
  })
  // it('should handle exception', async () => {
  //   const asyncFn = () => Promise.resolve(2)
  //   const atomicAsyncFn = atomicasync(asyncFn)
  //   const asyncFnResult = await asyncFn()
  //   const atomicAsyncFnResult = await atomicAsyncFn()
  //   expect(atomicAsyncFnResult).to.be.equal(asyncFnResult)
  // })  
})
