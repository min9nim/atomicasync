export * from './atomic-option';
export default function atomic(asyncFn: (...args: any[]) => Promise<any>, thisObj?: any): (...args: any[]) => any;
