import {Service} from '../service.js'

export class BaiduSuggestion extends Service {
    onStart() {}
    onMessage(ev) {
        const data = ev.data
        fetch(encodeURI(`https://bird.ioliu.cn/v1?url=http://suggestion.baidu.com/su?action=opensearch&wd=${data}`))
        .then(res => res.arrayBuffer())
        .then(val => {
            val = JSON.parse(new TextDecoder('gbk').decode(val))
            this.post(val[1])
        })
    }
}

