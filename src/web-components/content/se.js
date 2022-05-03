import {getStore, saveChanges} from '../../utils/store.js'

let se = getStore('search-engine'), selist, curIndex

function initSearchEngine() {
    selist = se.get('list')
    curIndex = se.get('current')
}
initSearchEngine()

if (!selist) {
    se.set('list', [
        {
            name: 'Bing',
            url: 'https://www.bing.com/search?q=%s',
            ico: 'https://www.bing.com/favicon.ico'
        },
        {
            name: '百度',
            url: 'https://baidu.com/s?wd=%s',
            ico: 'https://baidu.com/favicon.ico'
        },
    ])
    se.set('current', 0)

    saveChanges()
    initSearchEngine()
}

export function getSe(index=curIndex) {
    if(selist) return selist[index]
}

export function getSearchURL(keywd) {
    return encodeURI(selist[curIndex].url.replace('%s', keywd))
}

export function select(index) {
    if (typeof index !== 'number') return curIndex
    se.set('current', curIndex = index)
    saveChanges()
}

export function selectLoop() {
    const
        len = selist.length,
        next = curIndex + 1 >= len
            ? 0
            : curIndex + 1

    select(next)
}

export function rm(index) {
    selist = selist.slice(0, index).concat(selist.slice(index+1))
    se.set('list', selist)
    saveChanges()
}

export function add(name, url, ico) {
    selist.push({name, url, ico})
    se.set('list', selist)
    saveChanges()
}

export function search(keywd) {
    if(!keywd) return
    window.open(getSearchURL(keywd), '_self')
}