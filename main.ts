import {HueColorEncoder} from './HueColorEncoder.js'
import {type BaseEncoder} from './BaseEncoder.js'
import {Color} from './Color.js'
import {BitEncode} from './BitEncode.js'
import {MultiBitEncode} from './MultiBitEncoding.js'
import {Utils} from './Utils.js'
import {ConvertStringToCharMap} from './CharacterMap.js'

let inputData = [
    ConvertStringToCharMap('Waltz, bad nymph, for quick jigs vex.'),
    ConvertStringToCharMap('Sphinx of black quartz, judge my vow.'),
    ConvertStringToCharMap('How vexingly quick daft zebras jump!'),
    ConvertStringToCharMap('Pack my box with five dozen liquor jugs.'),
]

const searchParams = new URLSearchParams(window.location.search)
const query = searchParams.get('q')
if (query && query.length > 0) {
    inputData = [query]
}

const encoders: BaseEncoder[] = [ new MultiBitEncode(),new BitEncode(), new HueColorEncoder(),]
const table = document.getElementById('results-table')

function test() {
    for (let encoder of encoders) {

        for (let data of inputData) {

            const pixels = encoder.encode(data)

            const canv = document.createElement('canvas')
            canv.width = pixels.length
            canv.height = 1
            const ctx = canv.getContext('2d')
            for (let i = 0; i < pixels.length; i++) {
                ctx.fillStyle = pixels[i]
                ctx.fillRect(i, 0, 1, 1)
            }
            canv.style.width = pixels.length * 10 + 'px'
            canv.style.height = '10px'

            for (let quality = 25; quality <= 100; quality += 25) {
                const row = document.createElement('tr')
                table.append(row)

                const cell = (content: string): HTMLTableCellElement => {
                    const cell = document.createElement('td')
                    cell.innerText = content
                    row.append(cell)
                    return cell
                }

                cell(encoder.constructor.name)
                cell(data)
                cell(pixels.length.toString())
                cell(quality.toString())

                const imgCell = cell('')
                const resultCell = cell('')
                const levenshteinCell = cell('')
                canv.toBlob(blob => {
                    const img = new Image()
                    img.src = URL.createObjectURL(blob)
                    img.onload = () => {
                        // URL.revokeObjectURL(img.src)
                        const canv2 = document.createElement('canvas')
                        canv2.width = canv.width
                        canv2.height = canv.height
                        const ctx2 = canv2.getContext('2d')
                        ctx2.drawImage(img, 0, 0, canv2.width, canv2.height)
                        const pixels = ctx2.getImageData(0, 0, canv2.width, canv2.height).data
                        const pixelColors = Color.FromCanvasData(pixels)
                        const decodedText = encoder.decode(pixelColors)
                        resultCell.innerText = decodedText
                        
                        levenshteinCell.innerText = Utils.Levenshtein(data, decodedText).toString()
                    }
                    imgCell.append(img)


                }, 'image/jpeg', quality)
            }
        }
    }
}
test()