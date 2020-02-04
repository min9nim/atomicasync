"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const q_1 = tslib_1.__importDefault(require("q"));
function useAddAtomicOption() {
    let seq = 0;
    let asyncResult = {};
    let atomicQueue = [];
    return (fn, thisObj) => {
        const originFn = fn;
        return (args) => {
            // console.log('start', {prop, op: args.query.definitions[0].name.value, atomic: args.atomic})
            if (args && args.atomic) {
                const asisAsyncResult = Object.assign({}, asyncResult);
                asyncResult = {};
                atomicQueue.push(new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const length = atomicQueue.length;
                    if (length > 0) {
                        yield atomicQueue[length - 1];
                    }
                    yield q_1.default.allSettled(Object.values(asisAsyncResult));
                    try {
                        const resolved = yield originFn.call(thisObj, args);
                        resolve(resolved);
                    }
                    catch (e) {
                        reject(e);
                    }
                    finally {
                        atomicQueue.shift();
                    }
                })));
                return atomicQueue[atomicQueue.length - 1];
            }
            const sequence = seq++;
            asyncResult[sequence] = new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield atomicQueue.slice(-1)[0];
                try {
                    const resolved = yield originFn.call(thisObj, args);
                    delete asyncResult[sequence];
                    resolve(resolved);
                }
                catch (e) {
                    reject(e);
                }
            }));
            return asyncResult[sequence];
        };
    };
}
exports.useAddAtomicOption = useAddAtomicOption;
//# sourceMappingURL=atomic-option.js.map