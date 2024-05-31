import {Color} from './Color'

export abstract class BaseEncoder {
    abstract encode(input: string): string[]
    abstract decode(pixels: IterableIterator<Color>): string
}