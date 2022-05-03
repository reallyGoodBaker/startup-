
const RAW_LISTENER = Symbol();

function OnceWrapper(type, rawFunc, emitter) {
    function onceListener(...args) {
        rawFunc.apply(emitter.thisArg, args);
        emitter.off(type, onceListener);
    }

    onceListener[RAW_LISTENER] = rawFunc;

    return onceListener;
}


export class EventEmitter {

    static captureRejections = true;
    static defaultMaxListeners = -1;
    static thisArg = undefined;


    /** @private*/ events = {};
    /** @private*/ maxListeners = EventEmitter.defaultMaxListeners;


    setMaxListeners(size) {
        this.maxListeners = size;
        return this;
    }


    getMaxListeners() {
        return this.maxListeners;
    }


    addListener(type, handler) {

        if (!handler || typeof handler !== 'function') {
            throw TypeError(`arg1 is not type of  "function", received: ${typeof handler}`);
        }

        if (this.events[type]) {
            const arr = this.events[type], len = this.maxListeners;
            if (~len && arr.length === this.maxListeners) {
                throw RangeError(`Out of range. max: ${len}`);
            }
            arr.push(handler);
        } else {
            this.events[type] = [handler];
        }
        return this;
    }


    removeListener(type, handler) {
        if (typeof handler !== 'function') return this.removeAllListeners(type);
        let arr = this.events[type];
        if (arr) {
            arr = [...arr];
            const len = arr.length;
            let result = [];

            for (let i = 0; i < len; i++) {
                if (arr[i] === handler || arr[i].toString() === handler.toString()) {
                    continue;
                }
                result.push(arr[i]);
            }

            this.events[type] = result;

            return this;
        }
    }


    removeAllListeners(type) {
        delete this.events[type];
        this.events[type] = null;
        return this;
    }


    emit(type, ...args) {
        let arr = this.events[type], emitSucces = false;
        if (arr) {
            arr = [...arr];
            const len = arr.length;

            try {
                for (let i = 0; i < len; i++)
                    arr[i].apply(this.thisArg, args);

                emitSucces = true;
            } catch (e) {

                if (this.captureRejections) {
                    this.emit('error', e);
                }

            }

            return emitSucces;
        }

        return false;
    }


    once(type, handler) {
        this.addListener(type, OnceWrapper(type, handler, this));
        return this;
    }


    listeners(type) {
        return [...this.events[type]];
    }


    rawListeners(type) {
        let ls = this.events[type];
        if (ls) return ls.reduce((pre, cur) => {
            return [...pre, cur[RAW_LISTENER] || cur];
        }, []);

        return [];
    }

    listenerCount(type) {
        return this.events[type] ? this.events[type].length : 0;
    }


    prependListener(type, handler) {

        if (!handler || typeof handler !== 'function') {
            throw TypeError(`arg1 is not type of  "function", received: ${typeof handler}`);
        }

        if (this.events[type]) {
            const arr = this.events[type], len = this.maxListeners;
            if (~len && arr.length === this.maxListeners) {
                throw RangeError(`Out of range. max: ${len}`);
            }
            arr.unshift(handler);
        } else {
            this.events[type] = [handler];
        }
        return this;
    }


    prependOnceListener(type, handler) {
        this.prependListener(type, OnceWrapper(type, handler, this));
        return this;
    }

    thisArg = EventEmitter.thisArg;
    /** @private*/ captureRejections = true;

    on = this.addListener
    off = this.removeListener
    offAll = this.removeAllListeners

    constructor(opt) {

        if (opt) {
            this.thisArg = opt.thisArg || EventEmitter.thisArg;
            this.captureRejections = opt.captureRejections || EventEmitter.captureRejections;
        }

    }

}

export function on(emitter, type, handler) {
    return emitter.on(type, handler);
}
export function off(emitter, type, handler) {
    return emitter.off(type, handler)
}
export function once(emitter, type, handler) {
    return emitter.once(type, handler);
}
export function listeners(emitter, type) {
    return emitter.listeners(type);
}
export function rawListeners(emitter, type) {
    return emitter.rawListeners(type);
}
/**@class */
function IEvents(opt) { return new EventEmitter() }

IEvents.prototype = EventEmitter.prototype;

IEvents.EventEmitter = EventEmitter;
IEvents.on = on;
IEvents.off = off;
IEvents.once = once;
IEvents.listeners = listeners;
IEvents.rawListeners = rawListeners;

export default IEvents;