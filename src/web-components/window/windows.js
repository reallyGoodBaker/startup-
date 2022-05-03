import {ViewImplementor} from '../implementor.js'

class NonrepeatArray {
    set = new Set()
    arr = []

    add(ele) {
        this.arr.push(ele)
        this.set.add(ele)
    }

    delete(ele) {
        const returnVal = this.set.delete(ele)
        this._rebuildArr()
        return returnVal
    }

    has(ele) {
        return this.set.has(ele)
    }

    get(index=0) {
        return this.arr[index]
    }

    _rebuildArr() {
        return this.arr = this.arr.reduce((pre, cur) => {
            if (this.set.has(cur)) {
                pre.push(cur)
            }
            return pre
        }, [])
    }

    get size() {
        return this.set.size
    }
}

export class DisplayWindow extends ViewImplementor {
    static openedWindows = new NonrepeatArray()
    static focusingWindow = null

    title = ''

    constructor(title='') {
        super('/src/web-components/window/window.html')
        this.title = title
        const frag = document.createDocumentFragment()

        Array.from(this.children).forEach(child => {
            frag.appendChild(child)
        })
        this.$children = frag
    }

    onViewImpl() { 
        const
            outer = this.shadowRoot.querySelector('.outer'),
            container = this.shadowRoot.querySelector('#container'),
            titleBar = this.shadowRoot.querySelector('.title-bar'),
            title = this.shadowRoot.querySelector('#title'),
            btn = this.shadowRoot.querySelector('#btn')
        
        DisplayWindow.openedWindows.add(outer)
        setFocus(outer)

        let isDragging = false,
            doChanges = false,
            startX = 0,
            startY = 0,
            dx = 0, dy = 0,
            offsetX, offsetY

        const onMouseDown = ev => {
            if(ev.button) return;
            if(ev.target === btn) return;
            isDragging = true
            startX = ev.pageX
            startY = ev.pageY
            offsetX = ev.offsetX
            offsetY = ev.offsetY
        }
        titleBar.addEventListener('mousedown', onMouseDown)

        const onMouseUp = () => {
            isDragging = false
            if (doChanges) {
                outer.style.transform = ''
                outer.style.left = `${startX + dx - offsetX}px`
                outer.style.top = `${startY + dy - offsetY}px`

                doChanges = dx = dy = 0
            }
        }
        window.addEventListener('mouseup', onMouseUp)

        const onMouseMove = ev => {
            if (isDragging) {
                dx = ev.pageX - startX
                dy = ev.pageY - startY

                outer.style.transform = 
                    `translate(${dx}px, ${dy}px)`
                
                doChanges = true
            }
        }
        window.addEventListener('mousemove', onMouseMove)

        const self = this
        btn.addEventListener('click', function _onClick() {
            outer.style.pointerEvents = 'none'
            outer.animate([
                {transform: 'scale(1)', opacity: 1},
                {transform: 'scale(0.9)', opacity: 0}
            ], 100).onfinish = () => {
                const wins = DisplayWindow.openedWindows
                wins.delete(outer)
                btn.removeEventListener('click', _onClick)
                titleBar.removeEventListener('mousedown', onMouseDown)
                window.removeEventListener('mouseup', onMouseUp)
                window.removeEventListener('mousemove', onMouseMove)
                self.remove()
                setFocus(wins.get(wins.size - 1))
            }
        })

        title.innerText = this.title
        container.appendChild(this.$children)

        requestAnimationFrame(() => {
            const rect = outer.getBoundingClientRect()
            outer.style.top = `${visualViewport.height/2 - rect.height/2}px`
            outer.style.left = `${visualViewport.width/2 - rect.width/2}px`
        })

        this.container = container

    }

    addChild(ele) {
        if(!this.container) return this.$children.appendChild(ele);

        this.container.appendChild(ele)
    }

}

window.addEventListener('mousedown', ev => {
    setFocus(getFirstWin(ev.path))
})

function clearFocus() {
    if(DisplayWindow.focusingWindow) {
        DisplayWindow.focusingWindow.classList.remove('focus')
        DisplayWindow.focusingWindow = null
        return
    }
}

function setFocus(win) {

    if(DisplayWindow.focusingWindow === win) {
        return
    }

    if (!win) {
        return clearFocus()
    }

    if (DisplayWindow.focusingWindow) {
        clearFocus()
    }

    DisplayWindow.focusingWindow = win
    win.classList.add('focus')
}

function getFirstWin(path) {
    for (const win of Array.from(path)) {
        if (DisplayWindow.openedWindows.has(win)) {
            return win
        }
    }
    return null
}

customElements.define('window-container', DisplayWindow)