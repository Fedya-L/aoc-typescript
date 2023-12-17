import { timeStamp } from "console"
import { Coordinate2D, ConvenientArray2D, iterateXY } from "../utils/data-things"
import { appendFile } from "fs"

type Block = {
    coordinates: Coordinate2D
    heatLoss: number
}

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

type Path = {
    currentCoordinate: Coordinate2D
    totalHeatLoss: number
    lastDirection: Direction
    lastDirectionRepeatedCount: number
}


function getNextCoordinate(coordinate: Coordinate2D, direction: Direction): Coordinate2D {
    let {x,y} = coordinate

    switch (direction) {
        case Direction.Up:
            y--
            break
        case Direction.Right:
            x++
            break
        case Direction.Down:
            y++
            break
        case Direction.Left:
            x--
            break
    }

    return {x, y}
}

function getNextPathInDirection(path: Path, cityMap: CityMap, direction: Direction): Path | undefined {
    const nextCoordinate = getNextCoordinate(path.currentCoordinate, direction)
    const nextBlock = cityMap.getXY(nextCoordinate)
    if (nextBlock === undefined) {
        return undefined
    }

    return {
        currentCoordinate: nextCoordinate,
        totalHeatLoss: path.totalHeatLoss + nextBlock.heatLoss,
        lastDirection: direction,
        lastDirectionRepeatedCount: path.lastDirection === direction ? path.lastDirectionRepeatedCount + 1 : 1
    }
}

function getNextPaths(path: Path, cityMap: CityMap): Path[] {
    let paths: Path[] = []

    const lastDirection = path.lastDirection
    if (path.lastDirectionRepeatedCount < 3) {
        const pathForward = getNextPathInDirection(path, cityMap, lastDirection)
        if (pathForward) {
            paths.push(pathForward)
        }
    }

    const directionToTheLeft: Direction = (4 + lastDirection - 1) % 4
    const pathToTheLeft = getNextPathInDirection(path, cityMap, directionToTheLeft)
    if (pathToTheLeft) {
        paths.push(pathToTheLeft)
    }

    const directionToTheRight = (lastDirection + 1) % 4
    const pathToTheRight = getNextPathInDirection(path, cityMap, directionToTheRight)
    if (pathToTheRight) {
        paths.push(pathToTheRight)
    }

    return paths
}

type CityMap = ConvenientArray2D<Block>

function inputToCityMap(input: string): CityMap {
    const rawMap = input.split("\n").map(line => line.split(''))

    const ySize = rawMap.length
    const xSize = rawMap[0].length


    const cityMapData: Block[][] = Array(ySize)
    for (let y = 0; y < ySize; y++) {
        let rowData: Block[] = Array(xSize)

        for (let x = 0; x < xSize; x++) {
            rowData[x] = {
                coordinates: {x,y},
                heatLoss: +rawMap[y][x]
            }
        }

        cityMapData[y] = rowData
    }

    return new ConvenientArray2D<Block>(cityMapData)
}
function pathToMapKey(path: Path): string {
    return `${path.currentCoordinate.x},${path.currentCoordinate.y},${path.lastDirection},${path.lastDirectionRepeatedCount}`
}

export function solve1(input: string): number {
    const cityMap = inputToCityMap(input)

    const startingPath: Path = {
        currentCoordinate: {x: 0, y: 0},
        totalHeatLoss: 0,
        lastDirection: Direction.Right,
        lastDirectionRepeatedCount: 0
    }

    const endCoordinate: Coordinate2D = {
        x: cityMap.xSize - 1,
        y: cityMap.ySize - 1,
    }


    let searchQueue: Path[] = [
        startingPath
    ]

    const searchedMap = new Map<string, number>()

    while (searchQueue.length) {
        const searchPath = searchQueue.pop()!
        searchedMap

    }

    return -1
}

export function solve2(input: string): number {
    return -2
}

