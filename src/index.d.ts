declare module "atomicasync" {
  function atomicasync(arg: (...args: any[]) => Promise<any>): (...args: any[]) => Promise<any>
  export = atomicasync
}
