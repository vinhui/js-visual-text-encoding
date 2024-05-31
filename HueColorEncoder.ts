import {BaseEncoder} from './BaseEncoder.js'
import {Color} from './Color.js'
import {CharacterMap, GetMapCodeForChar} from './CharacterMap.js'

export class HueColorEncoder extends BaseEncoder {
    encode(input: string): string[] {
        const output: string[] = []
        for (const char of input) {
            const code = GetMapCodeForChar(char)
            const hue = Math.round(code / CharacterMap.length * 360)
            output.push(`hsl(${hue}deg, 100%, 50%)`)
        }

        return output
    }

    decode(pixels: IterableIterator<Color>): string {
        let result = ''

        for (let pixel of pixels) {
            const hsl = pixel.toHsl()
            let code = Math.round(hsl.h * CharacterMap.length)
            code = Math.max(code, 0) % CharacterMap.length
            result += CharacterMap[code]
        }

        return result
    }
}