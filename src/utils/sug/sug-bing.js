import {Service} from '../service.js'

export class BingSuggestion extends Service {
    onStart() {}
    onMessage(ev) {
        const data = ev.data
        fetch(encodeURI(`https://bird.ioliu.cn/v1?url=https://www.baidu.com/sugrec?json=1&prod=pc&wd=${data}`))
        .then(res => res.json())
        .then(val => {
            this.post(val)
        })
    }
}

