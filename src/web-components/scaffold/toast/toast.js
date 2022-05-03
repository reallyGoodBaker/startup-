import {ViewImplementor} from '../../implementor.js'

export class Toast extends ViewImplementor {
    constructor() {
        super('/src/web-components/scaffold/toast/toast.html')
        Toast.toastEle = this
    }

    onViewImpl() {
        this.container = this.shadowRoot.querySelector('#container')
        this.content = this.shadowRoot.querySelector('#content')
        this.leading = this.shadowRoot.querySelector('.leading')
        this.action = this.shadowRoot.querySelector('#action')
        this.close = this.shadowRoot.querySelector('#close')

        this.close.onclick = () => {
            this.destroy()
        }
    }

    setText(text='') {
        this.content.innerText = text

        return this
    }

    setIcon(url) {
        if (!url) {
            this.leading.style.display = 'none'
            return this
        }

        this.leading.style.display = 'block'
        this.leading.style.backgroundImage = `url(${url})`

        return this
    }

    destroy() {
        clearTimeout(this.timer)
        this.container.classList.remove('show')
    }

    show(msg, handler, icon) {
        this.setText(msg)

        if (typeof handler === 'function') {
            const wrappedAction = () => {
                requestAnimationFrame(() => {
                    handler.call(this.container)
                })
                this.destroy()
                this.close.removeEventListener('click', wrappedClose)
                this.action.removeEventListener('click', wrappedAction)
            }
            const wrappedClose = () => {
                this.destroy()
                this.close.removeEventListener('click', wrappedClose)
                this.action.removeEventListener('click', wrappedAction)
            }
            this.action.style.display = 'block'
            this.action.addEventListener('click', wrappedAction)
            this.close.addEventListener('click', wrappedClose)
        } else {
            this.action.style.display = 'none'
        }

        this.setIcon(icon)
        this.container.classList.add('show')
        
        if (!handler) {
            this.timer = setTimeout(() => {
                this.destroy()
            }, 5000);
        }
    }

    static toastEle = null
    static makeToast(msg, handler, icon) {
        this.toastEle.show(msg, handler, icon)
    }
}
