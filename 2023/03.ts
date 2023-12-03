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
            this.data.length <= x ||
            this.data[x].length <= y
        ) {
            return undefined
        }
        return this.data[x][y]
    }

}

function parseMapToSymbolsMap(input: string): ConvenientArray2D<boolean> {
    const lines = input.split("\n")
    const rowsOfCharacters = lines.map(l => l.split(''))

    let symbolsMap: boolean[][] = []
    for (const [y, chars] of rowsOfCharacters.entries()) {
        let xa: boolean[] = []
        for (const [x, char] of chars.entries()) {
            xa[x] = char !== '.'
        }
        symbolsMap[y] = xa
    }

    return new ConvenientArray2D(symbolsMap)
}


export function solve1(input: string): number {
    const symbolsMap = parseMapToSymbolsMap(input)
    const res = symbolsMap.get(0,0)
    return -1
}

export function solve2(): number {
    return -2
}

export { ConvenientArray2D as FakeArray2D }