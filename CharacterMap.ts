export const CharacterMap: readonly string[] = [
    '.', '-',
    'a', 'b', 'c',
    '1',
    'd', 'e', 'f',
    '2',
    'g', 'h', 'i',
    '3',
    'j', 'l', 'k',
    '4',
    'm', 'n', 'o',
    '5', ' ',
    'p', 'q', 'r',
    '6',
    's', 't', 'u',
    '7',
    'v', 'w', 'x',
    '8',
    'y', 'z', '9',
    '_', ':', ',',
]

export function GetMapCodeForChar(char: string): number {
    return Math.max(CharacterMap.indexOf(char.toLowerCase()), 0)
}

export function ConvertStringToCharMap(str: string): string {
    let s = ''
    for (const char of str) {
        s += CharacterMap[GetMapCodeForChar(char)]
    }
    return s
}