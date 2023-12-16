import { ConvenientArray2D } from "../utils/data-things"

class CoordinateSet {

    private set: Set<string>

    constructor() {
        this.set = new Set()
    }

    addCoordinate(coordinate: Coordinate2D) {
        const key = `${coordinate.x},${coordinate.y}`
        this.set.add(key)
    }

    getSize(): number {
        return this.set.size
    }
}

type Coordinate2D = {
    x: number
    y: number
}

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

type Beam = {
    coordinate: Coordinate2D
    direction: Direction
}

type Tile = '.' | '\\' | '|' | '/' | '-'

type Layout = ConvenientArray2D<Tile>

function inputToLayout(input: string): Layout {
    return new ConvenientArray2D<Tile>(
        input.split("\n").map(line => line.split('')) as Tile[][]
    )
}

function calculateNextBeams(tile: Tile, beam: Beam): [Beam, Beam | undefined] {
    let newDirection: Direction

    if (
        (tile === '-' && (beam.direction === Direction.Left || beam.direction === Direction.Right)) ||
        (tile === '|' && (beam.direction === Direction.Up || beam.direction === Direction.Down))
    ) {
        tile = '.'
    }

    switch (tile) {
        case '.':
            return [
                {
                    coordinate: nextCoordinate(beam.coordinate, beam.direction),
                    direction: beam.direction
                }, 
                undefined
            ]
        case '\\':
            switch (beam.direction) {
                case Direction.Up:
                    newDirection = Direction.Left
                    break
                case Direction.Down:
                    newDirection = Direction.Right
                    break
                case Direction.Left:
                    newDirection = Direction.Up
                    break
                case Direction.Right:
                    newDirection = Direction.Down
                    break
            }
            return [
                {
                    coordinate: nextCoordinate(beam.coordinate, newDirection),
                    direction: newDirection
                },
                undefined
            ]
        case '/':
            switch (beam.direction) {
                case Direction.Up:
                    newDirection = Direction.Right
                    break
                case Direction.Down:
                    newDirection = Direction.Left
                    break
                case Direction.Left:
                    newDirection = Direction.Down
                    break
                case Direction.Right:
                    newDirection = Direction.Up
                    break
            }
            return [
                {
                    coordinate: nextCoordinate(beam.coordinate, newDirection),
                    direction: newDirection
                },
                undefined
            ]
        case '-':
            return [
                {
                    coordinate: nextCoordinate(beam.coordinate, Direction.Left),
                    direction: Direction.Left
                },
                {
                    coordinate: nextCoordinate(beam.coordinate, Direction.Right),
                    direction: Direction.Right
                }
            ]
        case '|':
            return [
                {
                    coordinate: nextCoordinate(beam.coordinate, Direction.Up),
                    direction: Direction.Up
                },
                {
                    coordinate: nextCoordinate(beam.coordinate, Direction.Down),
                    direction: Direction.Down
                }
            ]
                
    }
}

function nextCoordinate(coordinate: Coordinate2D, direction: Direction): Coordinate2D {
    let {x,y} = coordinate
    switch (direction) {
        case Direction.Up:
            y -= 1
            break
        case Direction.Down:
            y += 1
            break
        case Direction.Left: 
            x -= 1
            break
        case Direction.Right:
            x += 1
            break
    }
    return { x, y }
}

export function solve1(input: string): number {

    let beams: Beam[] = [
        {
            coordinate: {x: 0, y: 0},
            direction: Direction.Right
        }
    ]

    const layout = inputToLayout(input)
    const coordinateSet = new CoordinateSet()
    const processedSet = new Set<string>()

    
    while (beams.length) {
        let beam = beams.pop()!
        const tile = layout.getXY(beam.coordinate)
        if (tile === undefined) {
            continue
        }
        const processedKey = `${beam.coordinate.x},${beam.coordinate.y},${beam.direction}`
        if (processedSet.has(processedKey)) {
            continue
        }
        processedSet.add(processedKey)
        coordinateSet.addCoordinate(beam.coordinate)

        const [b1, b2] = calculateNextBeams(tile, beam)        
        beams.push(b1)
        if (b2) {
            beams.push(b2)
        }
    }

    return coordinateSet.getSize()
}

export function solve2(input: string): number {
    return -2
}