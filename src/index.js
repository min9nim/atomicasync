module.exports = function atomic(asyncFn) {
  const queue = []
  return (...args) => {
    queue.push(
      new Promise(async (resolve) => {
        if(queue.length > 0){
          await queue[queue.length - 1]
          queue.shift()
        }
        const resolved = await asyncFn(...args)
        resolve(resolved)
      }),
    )
    return queue[queue.length - 1]
  }
}