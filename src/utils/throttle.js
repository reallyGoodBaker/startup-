export function throttle(func, time) {
    let timer

    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            func.apply(undefined, args)
        }, time);

    }
}