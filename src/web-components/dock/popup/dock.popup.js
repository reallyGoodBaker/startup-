import {ViewImplementor} from '../../implementor.js'


export class DockPopupContent extends ViewImplementor {
    constructor() {
        super('/src/web-components/dock/popup/dock.popup.html')
    }

    onViewImpl() {
        this.shadowRoot.querySelector('#name')
    }
}