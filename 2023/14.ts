import { ConvenientArray2D } from "../utils/data-things"


type Tile = '.' | '#' | 'O'

function inputToMap(input: string): ConvenientArray2D<Tile> {
    const data = input.split("\n").map(line => line.split('') as Tile[])
    return new ConvenientArray2D(data)
}

function tiltTheMap(map: ConvenientArray2D<Tile>, xx: number, yy: number) {
    for (const [x, y] of map) {
        const tile = map.get(x, y)
        if (tile !== 'O') {
            continue
        }
        let lastValidX = x
        let prevX = x + xx
        let lastValidY = y
        let prevY = y + yy
        let tileAbove = map.get(prevX, prevY)

        while (tileAbove === '.') {
            lastValidX = prevX
            lastValidY = prevY
            prevX += xx
            prevY += yy

            tileAbove = map.get(prevX, prevY)
        }

        if (lastValidX !== x || lastValidY !== y) {
            map.set(lastValidX, lastValidY, 'O')
            map.set(x, y, '.')
        }
    } 
}

function calculateTheLoad(map: ConvenientArray2D<Tile>): number {

    let result = 0

    for (const [x, y] of map) {
        const tile = map.get(x, y)
        if (tile !== 'O') {
            continue
        }
        result += map.ySize - y
    }

    return result 
}

export function solve1(input: string): number {
    const map = inputToMap(input)

    tiltTheMap(map, 0, -1)
    
    return calculateTheLoad(map)
}

export function solve2(input: string): number {
    const map = inputToMap(input)

    const tilts = [
        [0, -1],
        [-1, 0],
        [0, 1],
        [1, 0],
    ]
    let loads: number[] = []
    for (let i = 0; i < 10; i++) {
        for (const [x,y] of tilts) {
            tiltTheMap(map, x, y)
            loads.push(calculateTheLoad(map))
        }
    }
    return loads[loads.length - 1]
}