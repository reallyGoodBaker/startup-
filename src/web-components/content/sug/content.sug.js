import {ViewImplementor} from '../../implementor.js'
import {Service} from '../../../utils/service.js'
import {search} from '../se.js'

export class SearchSug extends ViewImplementor {
    constructor() {
        super('/src/web-components/content/sug/content.sug.html')
    }

    onViewImpl() {
        const container = this.shadowRoot.querySelector('#container')

        container.addEventListener('click', ev => {
            let i
            if (i = ev.target.getAttribute('index')) {
                search(ev.target.innerText)
            }
        })

        Service.register('suggest.bing', sug => {
            sug = sug.data

            //无搜索建议, 清除所有项
            if (!sug) return container.innerHTML = ''

            //有搜索建议
            let inner = ''
            sug.forEach((item, i) => {
                inner += `<div index="${i}">${item.Txt}</div>`
            })
            container.innerHTML = inner

        })
    }
}