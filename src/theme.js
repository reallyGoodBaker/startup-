export const DefaultBasicTheme = {
    background: '#fff',
    main: '#eef',
    mainText: '#222',
    translucent: 'rgba(255,255,255,0.5)'
}

function rgbToHsv(arr) {
    var h = 0, s = 0, v = 0;
    var r = arr[0], g = arr[1], b = arr[2];
    arr.sort(function (a, b) {
        return a - b;
    })
    var max = arr[2]
    var min = arr[0];
    v = max / 255;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - (min / max);
    }
    if (max === min) {
        h = 0;//事实上，max===min的时候，h无论为多少都无所谓
    } else if (max === r && g >= b) {
        h = 60 * ((g - b) / (max - min)) + 0;
    } else if (max === r && g < b) {
        h = 60 * ((g - b) / (max - min)) + 360
    } else if (max === g) {
        h = 60 * ((b - r) / (max - min)) + 120
    } else if (max === b) {
        h = 60 * ((r - g) / (max - min)) + 240
    }
    h = ~~(h);
    s = ~~(s * 100);
    v = ~~(v * 100);
    return [h, s, v]
}
function hsvToRgb(arr) {
    var h = arr[0], s = arr[1], v = arr[2];
    s = s / 100;
    v = v / 100;
    var r = 0, g = 0, b = 0;
    var i = ~~((h / 60) % 6);
    var f = h / 60 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i) {
        case 0:
            r = v; g = t; b = p;
            break;
        case 1:
            r = q; g = v; b = p;
            break;
        case 2:
            r = p; g = v; b = t;
            break;
        case 3:
            r = p; g = q; b = v;
            break;
        case 4:
            r = t; g = p; b = v;
            break;
        case 5:
            r = v; g = p; b = q;
            break;
        default:
            break;
    }
    r = ~~(r * 255)
    g = ~~(g * 255)
    b = ~~(b * 255)
    return [r, g, b];
}

function getPrimaryColor(rgb) {
    let [h] = rgbToHsv(rgb)

    return {
        primary: `rgb(${hsvToRgb([h, 40, 100]).join(',')})`,
        primaryLight: `rgb(${hsvToRgb([h, 8, 100]).join(',')})`,
        primaryDeepDark: `rgb(${hsvToRgb([h, 30, 20]).join(',')})`,
        primaryDark: `rgb(${hsvToRgb([h, 30, 40]).join(',')})`,
        primaryAccent: `rgb(${hsvToRgb([h, 24, 100]).join(',')})`,
    }
}
function getSecondaryColor(rgb) {
    let [h] = rgbToHsv(rgb)

    h = h - 100 < 0
        ? 260 + h
        : h - 100

    return {
        secondary: `rgb(${hsvToRgb([h, 40, 100]).join(',')})`,
        secondaryLight: `rgb(${hsvToRgb([h, 8, 100]).join(',')})`,
        secondaryDark: `rgb(${hsvToRgb([h, 30, 40]).join(',')})`,
        secondaryDeepDark: `rgb(${hsvToRgb([h, 30, 20]).join(',')})`,
        secondaryAccent: `rgb(${hsvToRgb([h, 24, 100]).join(',')})`,
    }
}
function getTertiaryColor(rgb) {
    let [h] = rgbToHsv(rgb)

    h = h + 100 > 360
        ? 100 - h
        : h + 100

    return {
        tertiary: `rgb(${hsvToRgb([h, 40, 100]).join(',')})`,
        tertiaryLight: `rgb(${hsvToRgb([h, 8, 100]).join(',')})`,
        tertiaryDark: `rgb(${hsvToRgb([h, 30, 40]).join(',')})`,
        tertiaryDeepDark: `rgb(${hsvToRgb([h, 30, 20]).join(',')})`,
        tertiaryAccent: `rgb(${hsvToRgb([h, 24, 100]).join(',')})`,
    }
}

function getColorsInfo(r, g, b) {
    r = +r
    g = +g
    b = +b

    const color = [r, g, b]

    return Object.assign(
        getPrimaryColor(color),
        Object.assign(
            getSecondaryColor(color),
            getTertiaryColor(color)
        )
    )
}


export class Theme {
    static themeNode = document.createElement('style')
    static init() {
        document.body.appendChild(this.themeNode)

        new Theme(DefaultBasicTheme).useColor(240, 240, 255).apply()
    }


    theme = null

    constructor(opt=DefaultBasicTheme) {
        if (typeof opt === 'object' && opt) {
            this.theme = opt
        } else {
            this.theme = {}
        }
    }

    useColor(r, g, b) {
        this.theme = Object.assign(this.theme, getColorsInfo(r, g, b))

        return this
    }

    getThemeStr() {
        const theme = this.theme
        let styleStr = ''

        Object.keys(theme).forEach(k => {
            styleStr += `--${k}: ${theme[k]};\n`
        })

        return styleStr
    }

    apply() {
        Theme.themeNode.innerHTML = `:root{${this.getThemeStr()}}`
    }
}
