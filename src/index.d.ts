declare module "atomicasync" {
  function atomicasync(arg: (...args: any[]) => Promise<any>): Promise<any>
  export = atomicasync
}
