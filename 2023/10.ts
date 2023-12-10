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

    getXY(xy: {x: number, y: number}): T | undefined {
        return this.get(xy.x, xy.y)
    }

    set(x: number,y: number, value: T): boolean {
        if (
            y < 0 ||
            x < 0 ||
            this.data.length <= y ||
            this.data[y].length <= x
        ) {
            return false
        }
        this.data[y][x] = value
        return true
    }

    setXY(xy: {x: number, y: number}, value: T): boolean {
        return this.set(xy.x, xy.y, value)
    }
}

type Coordinate2D = {
    x: number
    y: number
}

export function diffCoordinates(a: Coordinate2D, b: Coordinate2D): Coordinate2D {
    return {x: b.x - a.x, y: b.y - a.y}
}

export function moveCoordinate(target: Coordinate2D, vector: Coordinate2D): Coordinate2D {
    return {
        x: target.x + vector.x,
        y: target.y + vector.y,
    }
}

function coordinatesMatch(a: Coordinate2D, b: Coordinate2D): boolean {
    return a.x === b.x && a.y === b.y
}

class PipeProcessor {
    
    identifier: string
    relativeEntryPoints: Coordinate2D[]

    constructor(identifier: string, relativeEntryPoints) {
        this.identifier = identifier
        this.relativeEntryPoints = relativeEntryPoints
    }

    passTrough(pipeCoordinate: Coordinate2D, fromCoordinate: Coordinate2D): Coordinate2D | undefined {
        const diff = diffCoordinates(pipeCoordinate, fromCoordinate)

        const unmatched = this.relativeEntryPoints.filter(c => !coordinatesMatch(c, diff))

        if (unmatched.length != 1) {
            return undefined
        }

        return moveCoordinate(pipeCoordinate, unmatched[0])
    }
}
export const pipeProcessors: {[key: string]: PipeProcessor} = {
    '|': new PipeProcessor('|', [{x: 0, y: -1}, {x: 0, y: 1}]),
    '-': new PipeProcessor('-', [{x: -1, y: 0}, {x: 1, y: 0}]),
    'L': new PipeProcessor('L', [{x: 0, y: -1}, {x: 1, y: 0}]),
    'J': new PipeProcessor('J', [{x: 0, y: -1}, {x: -1, y: 0}]),
    '7': new PipeProcessor('7', [{x: -1, y: 0}, {x: 0, y: 1}]),
    'F': new PipeProcessor('F', [{x: 1, y: 0}, {x: 0, y: 1}]),
}

function inputToStringsArray2D(input: string): ConvenientArray2D<string> {
    return new ConvenientArray2D(input.split("\n").map(l => l.split('')))
}

function findStart(haystack: ConvenientArray2D<string>): Coordinate2D | undefined {
    for (let x = 0; x < haystack.xSize; x++) {
        for (let y = 0; y < haystack.ySize; y++) {
            const tile = haystack.get(x, y)
            if (tile === 'S') {
                return {x: x, y: y}
            }
        }
    }
    return undefined
}

const adjacentRelativeCoordinatesMap2D: Coordinate2D[] = [
                    {x:  0, y: -1},                
    {x: -1, y:  0},                 {x:  1, y:  0},
                    {x:  0, y:  1},                
]
function findFirstConnection(haystack: ConvenientArray2D<string>, pipeProcessors: {[key: string]: PipeProcessor},start: Coordinate2D): Coordinate2D | undefined {
    for (const adjacentRelativeCoordinate of adjacentRelativeCoordinatesMap2D) {
        const coordinateToCheck = moveCoordinate(start, adjacentRelativeCoordinate)
        const {x, y} = coordinateToCheck
        const pipeToCheck = haystack.get(x, y)
        if (pipeToCheck === undefined || pipeToCheck === '.') {
            continue
        }
        const pipeProcessor = pipeProcessors[pipeToCheck]!
        if (pipeProcessor.passTrough(coordinateToCheck, start)) {
            return coordinateToCheck
        }
    }

    return undefined
}

function findPipeType(haystack: ConvenientArray2D<string>, pipeProcessors: {[key: string]: PipeProcessor}, pipeCoordinate: Coordinate2D): string | undefined {
    const connections = adjacentRelativeCoordinatesMap2D.map(arc => {
        const testCoordinate = moveCoordinate(pipeCoordinate, arc)
        const testPipeType = haystack.getXY(testCoordinate)
        if (testPipeType === '.' || testPipeType === undefined) {
            return 0
        }
        return pipeProcessors[testPipeType]!.passTrough(testCoordinate, pipeCoordinate) ? 1 : 0
    })
    const connectionsAsString = connections.join(',')
    switch (connectionsAsString) {
        case '0,1,1,0':
            return '-'
        case '1,0,0,1':
            return '|'
        case '1,1,0,0':
            return 'J'
        case '0,0,1,1':
            return 'F'
        case '0,1,0,1':
            return '7'
        case '1,0,1,0':
            return 'L'    
    }
    return undefined
}

export function solve1(input: string): number {

    const stringArray2D = inputToStringsArray2D(input)
    const startCoordinate = findStart(stringArray2D)

    if (startCoordinate === undefined) {
        return -25
    }

    const firstConnection = findFirstConnection(
        stringArray2D,
        pipeProcessors,
        startCoordinate
    )
    if (firstConnection === undefined) {
        return -154
    }

    let path: Coordinate2D[] = getPath(startCoordinate, stringArray2D)

    return Math.ceil(path.length / 2)
}

function getPath(startCoordinate: Coordinate2D, map: ConvenientArray2D<string>): Coordinate2D[] {
    const firstConnection = findFirstConnection(
        map,
        pipeProcessors,
        startCoordinate
    )
    if (firstConnection === undefined) {
        return []
    }

    let path: Coordinate2D[] = []
    let currentCoordinate = startCoordinate
    let nextCoordinate: Coordinate2D | undefined = firstConnection

    while (nextCoordinate) {

        path.push(currentCoordinate)
        const pipe = map.getXY(nextCoordinate)

        if (pipe === undefined || pipe === '.') {
            return []
        }

        const pipeProcessor = pipeProcessors[pipe]!

        const nextNextCoordinate = pipeProcessor.passTrough(nextCoordinate, currentCoordinate)

        if (nextNextCoordinate === undefined) {
            return []
        }

        if (coordinatesMatch(nextNextCoordinate, startCoordinate)) {
            return path
        }

        currentCoordinate = nextCoordinate
        nextCoordinate = nextNextCoordinate
    }
    return path
}

export function solve2(input: string): number {
    const stringArray2D = inputToStringsArray2D(input)
    const startCoordinate = findStart(stringArray2D)!
    const startType = findPipeType(stringArray2D, pipeProcessors, startCoordinate)!
    
    stringArray2D.setXY(startCoordinate, startType)


    const path = getPath(startCoordinate, stringArray2D)

    const clearMap = Array(stringArray2D.ySize).fill([]).map(c => {
        return Array(stringArray2D.xSize).fill('.')
    })
    const mapArray2D = new ConvenientArray2D<string>(clearMap)
    
    for (const c of path) {
        mapArray2D.setXY(c, stringArray2D.getXY(c)!)
    }

    

    return -2
}