const PENDING = 'PENDING';
const REJECTED = 'REJECTED';
const FULFILLED = 'FULFILLED';
const resolvePromise = (promise2, x, resolve, reject) => {
    // 处理返回值x的类型 来决定调用resolve还是reject
    if(promise2 === x) {
        return reject(new TypeError(`chaining cycle detected for promise #<Promise>`));
    }
    // 判断x是不是普通值
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 可能是promise 通过判断有没有then方法
        try{
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x, y=>{
                    resolvePromise(promise2, y, resolve, reject)
                },r=>{
                    reject(x);
                });
            }else{
                resolve(x);
            }
        }catch(e){
            reject(e); // 取then报错了
        }
    }else{
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.value = undefined;
        this.reason = undefined;
        this.status = PENDING;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = value => {
            if(this.status === PENDING){
                this.value = value;
                this.status = FULFILLED;
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        };
        let reject = reason => {
            if(this.status === PENDING){
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        };
        // 这里可能发生异常
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        let promise2 = new Promise((resolve, reject)=> {
            if(this.status == FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(e) {
                        reject(e);
                    }
                });
            }
            if(this.status == REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(e) {
                        reject(e);
                    }
                });
            }
            if(this.status == PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(()=> {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });

        return promise2;
    }
}