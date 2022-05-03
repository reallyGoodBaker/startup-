import {ViewImplementor} from '../implementor.js'
import {Toast} from '../scaffold/toast/toast.js'
import {DockPopupContent} from './popup/dock.popup.js'
import {Scaffold} from '../scaffold/scaffold.js'
import {DisplayWindow} from '../window/windows.js'


export class Dock extends ViewImplementor {
    constructor() {
        super('/src/web-components/dock/dock.html')
    }

    onViewImpl(shadow) {
        const
            outer = shadow.querySelector('.outer'),
            contianer = shadow.querySelector('#container')

        outer.addEventListener('mouseover', () => {
            contianer.classList.add('display')
        })

        outer.addEventListener('mouseleave', () => {
            contianer.classList.remove('display')
        })

        shadow.querySelector('#settings').addEventListener('click', () => {
            Toast.makeToast('功能暂未完成')
        })
        shadow.querySelector('#add-new-component').addEventListener('click', () => {
            const
                popupContent = new DockPopupContent(),
                displayWindow = new DisplayWindow('添加新项目')
            
            displayWindow.addChild(popupContent)
            Scaffold.surfaceLayer.appendChild(displayWindow)
        })
    }
}