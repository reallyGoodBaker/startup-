import {ViewImplementor} from '../implementor.js'

export class TextInput extends ViewImplementor {
    constructor() {
        super('/src/web-components/input/input.html')
    }

    onViewImpl() {
        const input = this.shadowRoot.querySelector('#input')

        input.addEventListener('input', ev => {
            this.oninput.call(input, ev)
        })

        input.addEventListener('change', ev => {
            this.onchange.call(input, ev)
        })
    }

    oninput() {}
    onchange() {}
}