import createLogger from 'if-logger'
import {expect} from 'chai'
import {useAddAtomicOption} from '../src'
import {timer} from './helper'

describe('atomic-option', () => {
  const logger = createLogger().if(false)
  let log: string[] = []
  const obj = {
    async1() {
      log.push('async1 start')
      logger.verbose('async1 start')
      return new Promise(resolve => {
        setTimeout(() => {
          log.push('async1 end')
          logger.verbose('async1 end')
          resolve(undefined)
        }, 10)
      })
    },
    async2(args?: any) {
      log.push('async2 start')
      logger.verbose('async2 start')
      return new Promise(resolve => {
        setTimeout(() => {
          log.push('async2 end')
          logger.verbose('async2 end')
          resolve(args)
        }, 20)
      })
    },
    async3(args?: any) {
      log.push('async3 start')
      logger.verbose('async3 start')
      return new Promise(resolve => {
        setTimeout(() => {
          log.push('async3 end')
          logger.verbose('async3 end')
          resolve(args)
        }, 30)
      })
    },
    asyncError(args?: any) {
      log.push('asyncError start')
      logger.verbose('asyncError start')
      return new Promise((resolve, reject) => {
        log.push('asyncError end')
        logger.verbose('asyncError end')
        reject(Error('asyncError error'))
        // setTimeout(() => {
        //   log.push('asyncError end')
        //   logger.verbose('asyncError end')
        //   reject(Error('asyncError error'))
        // }, 40)
      })
    },
  }
  before(async () => {
    // await Promise.all([obj.async1(), obj.async2(), obj.async3()])
    // // console.log(log.join('\n'))
    // expect(log.join(', ')).to.be.equal(
    //   'async1 start, async2 start, async3 start, async1 end, async2 end, async3 end',
    // )
  })
  it('should be excuted alone when atomic option is true', async () => {
    log = []
    const addAtomicOption = useAddAtomicOption()
    obj.async1 = addAtomicOption(obj.async1)
    obj.async2 = addAtomicOption(obj.async2)
    obj.async3 = addAtomicOption(obj.async3)
    const resolvedList = await Promise.all([
      obj.async1(),
      obj.async1(),
      obj.async2({atomic: true}),
      obj.async3(),
      obj.async2({atomic: true}),
      obj.async1(),
      obj.async1(),
      obj.async3(),
    ])
    // console.log(log.join('\n'))
    expect(log.join('\n')).to.be.equal(`async1 start
async1 start
async1 end
async1 end
async2 start
async2 end
async3 start
async3 end
async2 start
async2 end
async1 start
async1 start
async3 start
async1 end
async1 end
async3 end`)
    expect(resolvedList[2]).to.be.deep.equal({atomic: true})
    expect(resolvedList[4]).to.be.deep.equal({atomic: true})
  })
  it('should be ordered async call', async function() {
    log = []
    const addAtomicOption = useAddAtomicOption()
    obj.async1 = addAtomicOption(obj.async1)
    obj.async2 = addAtomicOption(obj.async2)
    obj.async3 = addAtomicOption(obj.async3)
    obj.asyncError = addAtomicOption(obj.asyncError)

    const resolvedList = await Promise.all([
      obj.async1(),
      obj.async2({atomic: true}),
      obj.async3(),
      obj.async2({atomic: true}),
    ])

    // console.log(log.join('\n'))
    expect(log.join('\n')).to.be.equal(
      // tslint:disable-next-line:max-line-length
      `async1 start
async1 end
async2 start
async2 end
async3 start
async3 end
async2 start
async2 end`
    )
    expect(resolvedList[1]).to.be.deep.equal({atomic: true})
    expect(resolvedList[3]).to.be.deep.equal({atomic: true})
  })
  it('should be recovered against rejected promise', async function() {
    this.timeout(100000)
    log = []
    const addAtomicOption = useAddAtomicOption()
    obj.async1 = addAtomicOption(obj.async1)
    obj.async2 = addAtomicOption(obj.async2)
    obj.async3 = addAtomicOption(obj.async3)
    obj.asyncError = addAtomicOption(obj.asyncError)

    obj.asyncError()
    obj.async3({atomic: true})

    await timer(100)
    // console.log(log.join('\n'))
    expect(log.join('\n')).to.be.equal(
      `asyncError start
asyncError end
async3 start
async3 end`
    )
  })

  it('should be binded this object', async () => {
    const obj = {
      str: 'hello',
      fn() {
        return Promise.resolve(this.str)
      },
    }
    const result1 = await obj.fn()
    expect(result1).to.be.equal('hello')
    const addAtomicOption = useAddAtomicOption()
    obj.fn = addAtomicOption(obj.fn, obj)
    const result2 = await obj.fn()
    expect(result2).to.be.equal('hello')
  })
})
