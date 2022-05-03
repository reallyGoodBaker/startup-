import {ViewImplementor} from '../../implementor.js'
import {Toast} from '../../scaffold/toast/toast.js'


export class DockPopupContent extends ViewImplementor {
    constructor() {
        super('/src/web-components/dock/popup/dock.popup.html')
    }

    onViewImpl() {
        this.shadowRoot.querySelector('#name')

        this.shadowRoot.querySelector('#btn').onclick = () => {
            Toast.makeToast('功能暂未完成')
        }
    }
}