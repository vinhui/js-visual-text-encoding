export class Color {
    /** 0 - 255 */
    public r: number = 0
    /** 0 - 255 */
    public g: number = 0
    /** 0 - 255 */
    public b: number = 0

    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.r = r
        this.g = g
        this.b = b
    }

    toCss(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    toHsl() {
        let r = this.r
        let g = this.g
        let b = this.b
        r /= 255
        g /= 255
        b /= 255

        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h: number, s: number
        const l = (max + min) / 2

        if (max == min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / d + 2
                    break
                case b:
                    h = (r - g) / d + 4
                    break
            }

            h /= 6
        }

        return {h, s, l}
    }

    static* FromCanvasData(data: Uint8ClampedArray): Generator<Color> {
        for (let i = 0; i < data.length; i += 4) {
            yield new Color(
                data[i],
                data[i + 1],
                data[i + 2],
            )
        }
    }
}