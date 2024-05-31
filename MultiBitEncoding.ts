import {BaseEncoder} from './BaseEncoder.js'
import {Color} from './Color.js'
import {CharacterMap, GetMapCodeForChar} from './CharacterMap.js'
import {Utils} from './Utils.js'

export class MultiBitEncode extends BaseEncoder {
    encode(input: string): string[] {
        const output: string[] = []
        for (const char of input) {
            const code = GetMapCodeForChar(char)
            if (code > 64) {
                throw new Error('Char code is too high')
            }

            const firstPixel = new Color()
            const secondPixel = new Color()
            for (let i = 0; i < 6; i++) {
                const isFirstPixel = i < 3
                const pixelBitIndex = i % 3

                const bitValue = Utils.IsBitSet(code, i) ? 255 : 0
                switch (pixelBitIndex) {
                    case 0:
                        if (isFirstPixel) firstPixel.r = bitValue
                        else secondPixel.r = bitValue
                        break
                    case 1:
                        if (isFirstPixel) firstPixel.g = bitValue
                        else secondPixel.g = bitValue
                        break
                    case 2:
                        if (isFirstPixel) firstPixel.b = bitValue
                        else secondPixel.b = bitValue
                        break
                }
            }
            output.push(firstPixel.toCss(), secondPixel.toCss())
        }
        return output
    }

    decode(pixels: IterableIterator<Color>): string {
        let i = 0
        let code = 0
        let output = ''
        
        for (let pixel of pixels) {
            const isFirstPixel = i % 2 === 0
            
            if (pixel.r > 255 / 2) code |= 1 << (isFirstPixel ? 0 : 3)
            if (pixel.g > 255 / 2) code |= 1 << (isFirstPixel ? 1 : 4)
            if (pixel.b > 255 / 2) code |= 1 << (isFirstPixel ? 2 : 5)

            if (!isFirstPixel) {
                output += CharacterMap[code]
                code = 0
            }
            i++
        }
        return output
    }
}