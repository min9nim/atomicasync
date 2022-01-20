export * from './atomic-option'

type AsyncFunction<P extends any[], R extends Promise<any>> = (...args: P) => R

export default function atomic<P extends any[],R extends Promise<any>>(
  asyncFn: AsyncFunction<P,R>, 
  thisObj?: any
): typeof asyncFn {
  const queue: any[] = []
  return (...args) => {
    queue.push(
      new Promise(async (resolve, reject) => {
        if (queue.length > 0) {
          try {
            await queue[queue.length - 1]
          } catch (e) {
            // console.error(e)
          } finally {
            queue.shift()
          }
        }
        try {
          const resolved = await asyncFn.call(thisObj, ...args)
          resolve(resolved)
        } catch (e) {
          reject(e)
        }
      })
    )
    return queue[queue.length - 1]
  }
}
