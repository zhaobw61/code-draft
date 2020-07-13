const PENDING = 'PENDING';
const REJECTED = 'REJECTED';
const FULFILLED = 'FULFILLED';
class Promise {
    constructor(executor) {
        this.value = undefined;
        this.reason = undefined;
        this.status = PENDING;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let reslove = value => {
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
            executor(reslove, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        if(this.status == FULFILLED) {
            onFulfilled(this.value);
        }
        if(this.status == REJECTED) {
            onRejected(this.reason);
        }
        if(this.status == PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(()=> {
                onRejected(this.value);
            });
        }
    }
}