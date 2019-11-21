declare module "atomicasync" {
  export function atomicasync(arg: (...args: any[]) => Promise<any>): Promise<any>
}
