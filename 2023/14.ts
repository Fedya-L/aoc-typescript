import { ConvenientArray2D } from "../utils/data-things"


type Tile = '.' | '#' | 'O'

function inputToMap(input: string): ConvenientArray2D<Tile> {
    const data = input.split("\n").map(line => line.split('') as Tile[])
    return new ConvenientArray2D(data)
}

export function solve1(input: string): number {
    const map = inputToMap(input)

    let result = 0
    for (const [x, y] of map) {
        const tile = map.get(x, y)
        if (tile !== 'O') {
            continue
        }
        let lastValidY = y
        let prevY = y - 1
        let tileAbove = map.get(x, prevY)

        while (tileAbove === '.') {
            lastValidY = prevY
            prevY--

            tileAbove = map.get(x, prevY)
        }

        if (lastValidY !== y) {
            map.set(x, lastValidY, 'O')
            map.set(x, y, '.')
        }

        result += map.ySize - lastValidY
    }

    return result 
}

export function solve2(input: string): number {
    return -2
}