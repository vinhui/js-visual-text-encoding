import {BaseEncoder} from './BaseEncoder.js'
import {Color} from './Color.js'
import {CharacterMap, GetMapCodeForChar} from './CharacterMap.js'
import {Utils} from './Utils.js'

export class BitEncode extends BaseEncoder {
    encode(input: string): string[] {
        const output: string[] = []
        for (const char of input) {
            const code = GetMapCodeForChar(char)
            for (let i = 0; i < 8; i++) {
                if (Utils.IsBitSet(code, i)) {
                    output.push('white')
                } else {
                    output.push('black')
                }
            }
        }
        return output
    }

    decode(pixels: IterableIterator<Color>): string {
        let i = 0
        let code = 0
        let output = ''
        for (let pixel of pixels) {
            const bitIndex = (i % 8)
            if (pixel.r + pixel.g + pixel.b >= 255) {
                const mask = 1 << bitIndex
                code |= mask
            }
            if (bitIndex === 8 - 1) {
                output += CharacterMap[code]
                code = 0
            }
            i++
        }
        return output
    }
}