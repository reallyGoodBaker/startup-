import {Theme} from './theme.js'
Theme.init()

import {getColor} from './utils/theme-color.js'
/**@type {HTMLImageElement}*/
const bgc = document.querySelector('#background-image')
bgc.crossOrigin = '*'

function setThemeColorByImageUrl(url) {

    bgc.src = url
    bgc.addEventListener('load', () => {
        new Theme()
        .useColor(...getColor(bgc))
        .apply()
    })
}
(async () => {
    const
        data = await (await fetch('https://bird.ioliu.cn/v1?url=https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=5')).json(),
        url = 'https://www.bing.com' + data.images[0].url

    setThemeColorByImageUrl(url)
})()


import {Scaffold} from './web-components/scaffold/scaffold.js'
import {Content, SearchSug} from './web-components/content/content.js'
import {Dock} from './web-components/dock/dock.js'
import {DockPopupContent} from './web-components/dock/popup/dock.popup.js'
import {TextInput} from './web-components/input/input.js'
import {NormalButton} from './web-components/button/button.js'
import {ContentShortcuts} from './web-components/content/shortcuts/shortcuts.js'
import {Toast} from './web-components/scaffold/toast/toast.js'


customElements.define('r-app', Scaffold)
customElements.define('r-content', Content)
customElements.define('r-dock', Dock)
customElements.define('r-popup-content', DockPopupContent)
customElements.define('r-input', TextInput)
customElements.define('r-btn', NormalButton)
customElements.define('r-sug', SearchSug)
customElements.define('r-shortcuts', ContentShortcuts)
customElements.define('r-toast', Toast)
