const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

function getColorInfo(imgData, w, x, y) {
    let o =  4 * (w*(y-1) + x)
    imgData = imgData.data
    let data = imgData.slice(o, o+4)
    return data
}

/**
 * @param {HTMLImageElement} img 
 */
export function getColor(img) {
    const w = canvas.width = img.naturalWidth
    const h = canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)
    // console.log(canvas.toDataURL('image/png'));
    return generateColorFromImageData(ctx.getImageData(0, 0, w, h), w, h)
}

function generateColorFromImageData(imageData, w, h) {
    const w12 = w/2, h12 = h/2, w14 = w/4, w34 = w12 + w14, h14 = h/4, h34 = h12 + h14;
    let lt = getColorInfo(imageData, w, w14, h14),
    rt = getColorInfo(imageData, w, w34, h14),
    c = getColorInfo(imageData, w, w12, h12),
    lb = getColorInfo(imageData, w, w14, h34),
    rb = getColorInfo(imageData, w, w34, h34);

    let color = [];

    for (let i = 0; i < 4; i++) {
        let aver = (lt[i] + rt[i] + c[i] + lb[i] + rb[i])/5
        color[i] = ~~aver;
    }

    return color;
}