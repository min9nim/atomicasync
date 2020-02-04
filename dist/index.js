"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./atomic-option"), exports);
function atomic(asyncFn) {
    const queue = [];
    return (...args) => {
        queue.push(new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (queue.length > 0) {
                try {
                    yield queue[queue.length - 1];
                }
                catch (e) {
                    // console.error(e)
                }
                finally {
                    queue.shift();
                }
            }
            try {
                const resolved = yield asyncFn(...args);
                resolve(resolved);
            }
            catch (e) {
                reject(e);
            }
        })));
        return queue[queue.length - 1];
    };
}
exports.default = atomic;
//# sourceMappingURL=index.js.map