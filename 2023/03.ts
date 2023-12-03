import { strict } from "assert"

class ConvenientArray2D<T> {

    private data: T[][]
    xSize: number
    ySize: number

    constructor(data: T[][]) {
        this.data = data
        if (data.length === 0) {
            this.xSize, this.ySize = 0
            return
        }
        this.ySize = data.length
        this.xSize = data[0].length
    }

    get(x: number, y: number): T | undefined {
        if (
            y < 0 ||
            x < 0 ||
            this.data.length <= y ||
            this.data[y].length <= x
        ) {
            return undefined
        }
        return this.data[y][x]
    }

}

type Coordinate2d = {
    x: number
    y: number
}

type SchemeNumber = {
    value: number
    coordinates: Coordinate2d[]
    boundaryCoordinates: Coordinate2d[]
}

function parseRawSchemeToSymbolsMap(rawScheme: string): ConvenientArray2D<boolean> {
    const lines = rawScheme.split("\n")
    const rowsOfCharacters = lines.map(l => l.split(''))

    let symbolsMap: boolean[][] = []
    for (const [y, chars] of rowsOfCharacters.entries()) {
        let xa: boolean[] = []
        for (const [x, char] of chars.entries()) {
            xa[x] = (char !== '.' && !isNumber(char))
        }
        symbolsMap[y] = xa
    }

    return new ConvenientArray2D(symbolsMap)
}


function getSurroundingCoordinates2DForCoordinates2D(inputCoordinates: Coordinate2d[]): Coordinate2d[] {
    let outCoordinates: Coordinate2d[] = []
    let coordinatesMappingArray = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0],           [1, 0],
        [-1, 1],  [0, 1],  [1, 1],
    ]
    for (const coordinate of inputCoordinates) {
        for (const [x, y] of coordinatesMappingArray) {
            const sc = {
                x: coordinate.x + x,
                y: coordinate.y + y,
            }
            if (
                outCoordinates.some((c) => c.x == sc.x && c.y == sc.y) ||
                inputCoordinates.some((c) => c.x == sc.x && c.y == sc.y) 
            ) { 
                continue
            }
            outCoordinates.push(sc)
        }
    }


    return outCoordinates
}

function isNumber(possibleNumberOrNot: string): boolean {
    return !isNaN(+possibleNumberOrNot)
}

function parseRawSchemeToSchemeNumbers(rawScheme: string): SchemeNumber[] {
    const lines = rawScheme.split("\n")
    const rowsOfCharacters = lines.map(l => l.split(''))


    let schemeNumbers: SchemeNumber[] = []
    for (const [y, chars] of rowsOfCharacters.entries()) {
        let digits: string[] = []
        let coordinates: Coordinate2d[] = []
        for (const [x, char] of chars.entries()) {
            if (isNumber(char)) {
                digits.push(char)
                coordinates.push({x, y})
            } else if (digits.length > 0) {
                schemeNumbers.push({
                    value: +digits.join(''),
                    coordinates,
                    boundaryCoordinates: getSurroundingCoordinates2DForCoordinates2D(coordinates),
                })
                digits = []
                coordinates = []
            }
        }
        if (digits.length > 0) {
            schemeNumbers.push({
                value: +digits.join(''),
                coordinates,
                boundaryCoordinates: getSurroundingCoordinates2DForCoordinates2D(coordinates),
            })
        }
    } 

    return schemeNumbers
}

function findWaldoErrPartNumbers(schemeNumbers: SchemeNumber[], symbolsMap: ConvenientArray2D<boolean>): SchemeNumber[] {

    return schemeNumbers.filter((schemeNumbers) => {
        for (const boundaryCoordinates of schemeNumbers.boundaryCoordinates) {
            const isSymbol = symbolsMap.get(boundaryCoordinates.x, boundaryCoordinates.y)
            if (isSymbol) {
                return true
            }
        }
        return false
    })
    
}


export function solve1(input: string): number {
    const symbolsMap = parseRawSchemeToSymbolsMap(input)
    const schemeNumbers = parseRawSchemeToSchemeNumbers(input)
    const partNumbers = findWaldoErrPartNumbers(schemeNumbers, symbolsMap)
    return partNumbers.reduce((p, c) => p + c.value, 0)
}

export function solve2(): number {
    return -2
}

export { ConvenientArray2D as FakeArray2D }