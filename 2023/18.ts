import { Coordinate2D } from "../utils/data-things"

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

type Instruction = {
    direction: Direction
    distance: number
}

const lineToInstruction = (line: string): Instruction => {
    const [rawDirection, rawDistance, rawColor] = line.split(' ')

    let direction = Direction.Up

    switch (rawDirection) {
        case 'R':
            direction = Direction.Right
            break
        case 'D':
            direction = Direction.Down
            break
        case 'L':
            direction = Direction.Left
            break
    }

    return {
        distance: +rawDistance,
        direction,
    }
}

const inputToInstructions = (input: string): Instruction[] => {
    return input.split("\n").map(lineToInstruction)
}

const CoordinatesStorage = class {
    private data: Set<string>

    private _minEdgeCoordinate: Coordinate2D
    private _maxEdgeCoordinate: Coordinate2D

    constructor() {
        this.data = new Set()
        this._minEdgeCoordinate = {x: 0, y: 0}
        this._maxEdgeCoordinate = {x: 0, y: 0}
    }

    get minEdgeCoordinate(): Coordinate2D {
        return this._minEdgeCoordinate
    }

    get maxEdgeCoordinate(): Coordinate2D {
        return this._maxEdgeCoordinate
    }

    get count(): number {
        return this.data.size
    }

    addCoordinate(coordinate: Coordinate2D) {
        this.data.add(this.coordinateToString(coordinate))
        this._minEdgeCoordinate = {
            x: Math.min(this._minEdgeCoordinate.x, coordinate.x),
            y: Math.min(this._minEdgeCoordinate.y, coordinate.y),
        }
        this._maxEdgeCoordinate = {
            x: Math.max(this._maxEdgeCoordinate.x, coordinate.x),
            y: Math.max(this._maxEdgeCoordinate.y, coordinate.y),
        }
    }

    hasCoordinate(coordinate: Coordinate2D): boolean {
        return this.data.has(this.coordinateToString(coordinate))
    }


    private coordinateToString(coordinate: Coordinate2D): string {
        return `${coordinate.x},${coordinate.y}`
    }

}

const coordinatesInDirection = (coordinate: Coordinate2D, direction: Direction, distance: number): Coordinate2D[] => {
    let coordinates: Coordinate2D[] = []
    let x = 0, y = 0

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

    for (let i = 1; i <= distance; i++) {
        coordinates.push({
            x: coordinate.x + i * x,
            y: coordinate.y + i * y,
        })
    }

    return coordinates
}

const coordinatesMappingArray = [
              [0, -1],
    [-1, 0],           [1, 0],
              [0, 1],
]

const getNeighbours = (coordinate: Coordinate2D, minCoordinate: Coordinate2D, maxCoordinate: Coordinate2D): Coordinate2D[] => {
    let coordinates: Coordinate2D[] = []
    for (const coordinateShift of coordinatesMappingArray) {
        const neighbourCoordinate = {
            y: coordinate.y + coordinateShift[1],
        }
        
        const x = coordinate.x + coordinateShift[0]
        const y = coordinate.y + coordinateShift[1]

        if (
            minCoordinate.x <= x && x <= maxCoordinate.x &&
            minCoordinate.y <= y && y <= maxCoordinate.y
        ) {
            coordinates.push({x, y})
        }
    }
    return coordinates
}

const doSolve = (instructions: Instruction[]): number => {
    const cs = new CoordinatesStorage()

    let currentCoordinate: Coordinate2D = {x: 0, y: 0}
    cs.addCoordinate(currentCoordinate)

    for (const instruction of instructions) {
        const newCoordinates = coordinatesInDirection(
            currentCoordinate, 
            instruction.direction,
            instruction.distance
        )
        newCoordinates.forEach(c => cs.addCoordinate(c))
        currentCoordinate = newCoordinates[newCoordinates.length - 1]
    }

    const minC = {
        x: cs.minEdgeCoordinate.x - 1,
        y: cs.minEdgeCoordinate.y - 1,
    }
    const maxC = {
        x: cs.maxEdgeCoordinate.x + 1,
        y: cs.maxEdgeCoordinate.y + 1,
    }
    
    currentCoordinate = {
        ...minC
    }
    let searchQueue: Coordinate2D[] = [currentCoordinate]
    const checkedCoordinatesStorage = new CoordinatesStorage()

    while (searchQueue.length) {
        const searchCoordinate = searchQueue.pop()!
        if (
            checkedCoordinatesStorage.hasCoordinate(searchCoordinate) ||
            cs.hasCoordinate(searchCoordinate)
        ) {
            continue
        }

        checkedCoordinatesStorage.addCoordinate(searchCoordinate)
    
        const neighbours = getNeighbours(searchCoordinate, minC, maxC)
    

        for (const neighbour of neighbours) {
            if (
                !checkedCoordinatesStorage.hasCoordinate(neighbour) &&
                !cs.hasCoordinate(neighbour)
            ) {
                searchQueue.push(neighbour)
            }
        }

    }

    const searchSizeX = maxC.x - minC.x + 1
    const searchSizeY = maxC.y - minC.y + 1
    const storage = (searchSizeX * searchSizeY) - checkedCoordinatesStorage.count

    return storage
}

export const solve1 = (input: string): number => {
    return doSolve(inputToInstructions(input))
}

const lineToInstructionV2 = (line: string): Instruction => {
    const [,, rawColor] = line.split(' ')
    const notColor = rawColor.slice(1, rawColor.length - 1)

    const distance = parseInt(notColor.slice(1, 6), 16)
    const direction: Direction = +notColor.slice(notColor.length - 1)

    return {
        distance,
        direction,
    }
}

const inputToInstructionsV2 = (input: string): Instruction[] => {
    return input.split("\n").map(lineToInstructionV2)
}

export const solve2 = (input: string): number => {
    return doSolve(inputToInstructionsV2(input))
}