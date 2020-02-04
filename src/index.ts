export * from './atomic-option'

export default function atomic(asyncFn: (...args: any[]) => Promise<any>, thisObj?: any) {
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
