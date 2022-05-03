import {ViewImplementor} from '../implementor.js'

export class Scaffold extends ViewImplementor {
    static surfaceLayer = null

    constructor() {
        super('/src/web-components/scaffold/scaffold.html')
    }

    onViewImpl(shadow) {
        const surfaceLayer = shadow.querySelector('#surface-layer')
        Scaffold.surfaceLayer = surfaceLayer
    }
}