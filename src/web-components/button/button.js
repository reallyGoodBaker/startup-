import {ViewImplementor} from '../implementor.js'

export class NormalButton extends ViewImplementor {
    constructor() {
        super('/src/web-components/button/button.html')
        this.$child = this.childNodes.item(0)
    }

    onViewImpl() {
        const btn = this.shadowRoot.querySelector('#btn')
        btn.appendChild(this.$child)

        if (this.attributes.getNamedItem('transparent')) {
            btn.classList.add('transparent')
        }
    }
}