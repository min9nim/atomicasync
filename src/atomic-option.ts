export function useAddAtomicOption() {
  let seq = 0
  let asyncResult = {}
  let atomicQueue: Array<Promise<any>> = []
  return (fn: (...args: any[]) => Promise<any>, thisObj?: any) => {
    const originFn = fn
    return (args?: any) => {
      // console.log('start', {prop, op: args.query.definitions[0].name.value, atomic: args.atomic})
      if (args && args.atomic) {
        const asisAsyncResult = {...asyncResult}
        asyncResult = {}
        atomicQueue.push(
          new Promise(async (resolve, reject) => {
            const length = atomicQueue.length
            if (length > 0) {
              await atomicQueue[length - 1]
            }
            await Promise.allSettled(Object.values(asisAsyncResult))
            try {
              const resolved = await originFn.call(thisObj, args)
              resolve(resolved)
            } catch (e) {
              reject(e)
            } finally {
              atomicQueue.shift()
            }
          })
        )
        return atomicQueue[atomicQueue.length - 1]
      }
      const sequence = seq++
      asyncResult[sequence] = new Promise(async (resolve, reject) => {
        await atomicQueue.slice(-1)[0]
        try {
          const resolved = await originFn.call(thisObj, args)
          delete asyncResult[sequence]
          resolve(resolved)
        } catch (e) {
          reject(e)
        }
      })
      return asyncResult[sequence]
    }
  }
}
