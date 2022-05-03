import {ViewImplementor} from '../implementor.js'

function getTimeHTML() {
    const date = new Date()
    return `${date.toLocaleTimeString().split(':').slice(0, 2).join(':')}<div>${date.toDateString()}</div>`
}

import {Service} from '../../utils/service.js'
import {BaiduSuggestion} from '../../utils/sug/sug-baidu.js'
import {throttle} from '../../utils/throttle.js'

Service.startService('suggest.baidu', BaiduSuggestion)

import {SearchSug} from './sug/content.sug.js'
import {selectLoop, getSe, search as _s} from './se.js'

export class Content extends ViewImplementor {
    constructor() {
        super('/src/web-components/content/content.html')
    }

    onViewImpl(shadow) {
        let looper;

        const
            time = shadow.querySelector('#time'),
            search = shadow.querySelector('#search'),
            sug = shadow.querySelector('#sug'),
            icon = shadow.querySelector('#search-engine-icon')

        function queryTime() {
            time.innerHTML = getTimeHTML()
            looper = setTimeout(queryTime, 500);
        }

        search.focus()
        queryTime()

        window.addEventListener('beforeunload', () => {
            clearInterval(looper)
        })

        search.addEventListener('input', throttle(() => {
            Service.postMessage('suggest.baidu', search.value)
        }, 100))
        window.addEventListener('keydown', ev => {
            if (ev.key === 'Enter' && shadow.activeElement === search) {
                _s(search.value)
            }
        })


        icon.setAttribute('title', getSe().name)
        icon.style.backgroundImage = `url(${getSe().ico})`
        icon.addEventListener('click', () => {
            selectLoop()
            const se = getSe()
            icon.setAttribute('title', se.name)
            icon.style.backgroundImage = `url(${se.ico})`
        })


        let shouldDisplay = false
        document.addEventListener('mousedown', ev => {
            if (ev.path.includes(search) || ev.path.includes(sug)) {
                shouldDisplay = true
            } else {
                shouldDisplay = false
            }

            sug.style.display = shouldDisplay? 'block': 'none'
        })

    }
}

export {
    SearchSug
}