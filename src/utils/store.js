/**
 * 
 * @param {string} label 
 * @returns {Namespace}
 */
export function getStore(label) {
    if(!Namespace.__cache.has(label)) return new Namespace(label)

    return Namespace.__cache.get(label)
}

class Namespace {
    static __cache = new Map()
    static from(k, json) {
        let ns = new Namespace(k)
        ns.data = JSON.parse(json)
        return ns
    }

    label = 'default'
    /**@private */
    data = {};

    constructor(label='default') {
        this.label = label
        Namespace.__cache.set(label, this)
    }

    /**@private */
    toJson() {
        return JSON.stringify(this.data)
    }

    set(k, v) {
        this.data[k] = v
    }

    get(k) {
        return this.data[k]
    }

    rm(k) {
        delete this.data[k]
    }
}


function saveCacheToStorage() {
    let keys = []
    Namespace.__cache.forEach((v, k) => {
        keys.push(k)
        localStorage.setItem(k, v.toJson())
    })
    localStorage.setItem('$keys', JSON.stringify(keys))
}

function createNsFromStorage() {
    const keys = JSON.parse(
        localStorage.getItem('$keys')
    )

    keys.forEach(k => {
        Namespace.from(
            k,
            localStorage.getItem(k)
        )
    })
}


window.addEventListener('beforeunload', saveCacheToStorage)
createNsFromStorage()

export const saveChanges = saveCacheToStorage