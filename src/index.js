module.exports = function atomic(asyncFn) {
  const queue = []
  return (...args) => {
    queue.push(
      new Promise(async (resolve, reject) => {
        if(queue.length > 0){
          await queue[queue.length - 1]
          queue.shift()
        }
        try{
          const resolved = await asyncFn(...args)
          resolve(resolved)
        }catch(e){
          reject(e)
        }
      }),
    )
    return queue[queue.length - 1]
  }
}