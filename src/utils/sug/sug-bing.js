import {Service} from '../service.js'

export class BingSuggestion extends Service {
    onStart() {}
    onMessage(ev) {
        const data = ev.data
        fetch(encodeURI(`https://bird.ioliu.cn/v1?url=https://api.bing.com/qsonhs.aspx?type=cb&q=${data}`))
        .then(res => res.json())
        .then(val => {
            const res = val.AS.Results
            if (!res) {
                return this.post([])
            }
            this.post([
                ...(res[0]?.Suggests || []),
                ...(res[1]?.Suggests || [])
            ])
        })
    }
}

