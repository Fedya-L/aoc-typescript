import { ConvenientArray2D } from "../utils/data-things"


type Tile = '.' | '#' | 'O'

function inputToMap(input: string): ConvenientArray2D<Tile> {
    const data = input.split("\n").map(line => line.split('') as Tile[])
    return new ConvenientArray2D(data)
}

function* iterateFromTop(size: number): Generator<[number, number], void, unknown> {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            yield [x, y]
        }
    }
}

type MyIterator = Generator<[number, number], void, unknown>

function* iterateFromBottom(size: number): MyIterator {
    for (let y = size - 1; y >= 0; y--) {
        for (let x = 0; x < size; x++) {
            yield [x, y]
        }
    }
}

function* iterateFromLeft(size: number): MyIterator {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            yield [x, y]
        }
    }
}
function* iterateFromRight(size: number): MyIterator {
    for (let x = size - 1; x >= 0; x--) {
        for (let y = 0; y < size; y++) {
            yield [x, y]
        }
    }
}

function tiltTheMap(map: ConvenientArray2D<Tile>, iterator: MyIterator,xx: number, yy: number) {

    for (const [x, y] of iterator) {
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

    tiltTheMap(map, iterateFromTop(map.xSize),0, -1)
    
    return calculateTheLoad(map)
}

export function solve2(input: string): number {
    const map = inputToMap(input)
    const size = map.xSize

    const tilts: [number, number, (size: number) => MyIterator][] = [
        [0, -1, iterateFromTop],
        [-1, 0, iterateFromLeft],
        [0, 1, iterateFromBottom],
        [1, 0, iterateFromRight],
    ]
    let loads: number[] = [calculateTheLoad(map)]
    for (let i = 0; i < 2000; i++) {
        for (const [x,y, iterator] of tilts) {
            tiltTheMap(map, iterator(size) ,x, y)
            loads.push(calculateTheLoad(map))
        }
    }


    const length = loads.length
    let pattern: number[] = []
    for (let i = 30; i < Math.floor(length / 2); i++) {
        
        const a = loads.slice(-i)
        const b = loads.slice(length - i*2, length-i)

        if (`${a}` === `${b}`) {
            const c = loads.slice(length - i*3, length - i*2)

            if (`${b}` === `${c}`) {
                pattern = c
                break
            }

        }
    }

    const patternStartIndex = length
    const patternItemIndex = (
        (1_000_000_000 - 1) // adjusted for index
        - (patternStartIndex)
        ) % pattern.length
    const result = pattern[patternItemIndex]

    // 400 - 28
    // 372, last index is 371
    // iterating 400 times
    // last index is 399, but I need to adjuct by 28
    // last 

    return result
}