import {EventEmitter} from './events.js'

const globalServiceEventEmitter = new EventEmitter()
const globalWorkerMap = new Map()

export class Service {

    static startService(serviceName, serviceConstructor) {
        const iifeString = createIIFEServiceString(serviceConstructor)
        const url = URL.createObjectURL(new Blob([iifeString]))
        const worker = new Worker(url)
        worker.onmessage = ev => globalServiceEventEmitter.emit(serviceName, ev)
        globalWorkerMap.set(serviceName, worker)
    }

    static stopService(serviceName) {
        globalWorkerMap.has(serviceName)
            && globalWorkerMap.get(serviceName).terminate()
    }

    static lookup() {
        return Array.from(globalWorkerMap.keys())
    }

    static postMessage(serviceName, msg) {
        globalWorkerMap.has(serviceName)
            && globalWorkerMap.get(serviceName).postMessage(msg)
    }

    static register(serviceName, handler) {
        globalServiceEventEmitter.on(serviceName, handler)
        return Service
    }

    static unregister(serviceName, handler) {
        globalServiceEventEmitter.off(serviceName, handler)
        return Service
    }

    /**@override */
    onStart() {}
    /**@override */
    onMessage(ev) {}

    post(message, options) {
        self.postMessage(message, options)
    }


}

function createIIFEServiceString(serviceConstructor) {

    const serviceWorkerString = 
`//This is a Worker sandbox
class Service {
    post(msg, transferList) {
        self.postMessage(msg, transferList)
    }
}
const ServiceConstructor = ${serviceConstructor.toString()}
const service = new ServiceConstructor()
service.onStart()
self.onmessage = service.onMessage.bind(service)`
    
    return serviceWorkerString
    
}
