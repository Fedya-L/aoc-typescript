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

function getNextPaths(path: Path, cityMap: CityMap, minLength: number, maxLength: number): Path[] {
    let paths: Path[] = []

    const lastDirection = path.lastDirection

    const directionToTheLeft: Direction = (4 + lastDirection - 1) % 4
    const directionToTheRight = (lastDirection + 1) % 4

    let pathToTheLeft: Path | undefined = path
    let pathToTheRight: Path | undefined = path
    for (let i = 1; i <= maxLength; i++){
        // const pathForward = getNextPathInDirection(path, cityMap, lastDirection, i)
        // if (pathForward) {
        //     paths.push(pathForward)
        // }

        if (pathToTheLeft) {
            pathToTheLeft = getNextPathInDirection(pathToTheLeft, cityMap, directionToTheLeft)
        }
        if (pathToTheLeft && i >= minLength) {
            paths.push(pathToTheLeft)
        }

        if (pathToTheRight) {
            pathToTheRight = getNextPathInDirection(pathToTheRight, cityMap, directionToTheRight)   
        }
        if (pathToTheRight && i >= minLength) {
            paths.push(pathToTheRight)
        }
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
        startingPath,
        {...startingPath, lastDirection: Direction.Down}
    ]

    let finishedPaths: Path[] = []
    let minPathValue = (cityMap.xSize + cityMap.ySize) * 20

    const searchedMap = new Map<string, number>()

    while (searchQueue.length) {
        const searchPath = searchQueue.pop()!
        if (searchPath.totalHeatLoss >= minPathValue) {
            continue
        }
        const key = pathToMapKey(searchPath)
        const totalHeatLossForKey = searchedMap.get(key)
        if (
            totalHeatLossForKey !== undefined && 
            searchPath.totalHeatLoss >= totalHeatLossForKey
        ) {
            // There is already a better value
            continue
        }
        searchedMap.set(key, searchPath.totalHeatLoss)

        if (
            searchPath.currentCoordinate.x === endCoordinate.x &&
            searchPath.currentCoordinate.y === endCoordinate.y
        ) {
            finishedPaths.push(searchPath)
            minPathValue = Math.min(minPathValue, searchPath.totalHeatLoss)
            continue
        }

        const paths = getNextPaths(searchPath, cityMap, 1, 3)

        for (const p of paths) {
            const key = pathToMapKey(p)
            if (p.totalHeatLoss >= minPathValue) {
                continue
            }
            const totalHeatLossForKey = searchedMap.get(key)
            if (
                totalHeatLossForKey !== undefined && 
                searchPath.totalHeatLoss > totalHeatLossForKey
            ) {
                // There is already a better value
                continue
            }
            searchQueue.push(p)
        }
        searchQueue = searchQueue.sort((a, b) => b.totalHeatLoss - a.totalHeatLoss)
    }

    return minPathValue
}


class Node {
    public value: Path;
    public left: Node | null;
    public right: Node | null;
    
    constructor(value: Path) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    private root: Node | null;
    length: number;

    constructor() {
        this.root = null;
        this.length = 0
    }

    insert(value: Path): void {
        const newNode = new Node(value);
        this.length++
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    private insertNode(node: Node, newNode: Node): void {
        let diff = newNode.value.totalHeatLoss - node.value.totalHeatLoss
        if (diff === 0) {
            diff = (node.value.currentCoordinate.x + node.value.currentCoordinate.y) - 
            (newNode.value.currentCoordinate.x + newNode.value.currentCoordinate.y)
        }
        if (diff < 0) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    popMin(): Path | null {
        if (!this.root) {
            return null;
        }

        let current = this.root;
        let parent: Node | null = null;

        while (current.left !== null) {
            parent = current;
            current = current.left;
        }

        if (parent === null) {
            this.root = current.right;
        } else {
            parent.left = current.right;
        }

        this.length--;
        return current.value;
    }
}

export function solve2(input: string): number {
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


    // let searchQueue: Path[] = [
    //     startingPath,
    //     {...startingPath, lastDirection: Direction.Down}
    // ]

    let searchQueue = new BinarySearchTree()
    searchQueue.insert(startingPath)
    searchQueue.insert({...startingPath, lastDirection: Direction.Down})

    let finishedPaths: Path[] = []
    let minPathValue = Number.MAX_SAFE_INTEGER

    const searchedMap = new Map<string, number>()

    while (searchQueue.length) {
        const searchPath = searchQueue.popMin()!
        if (searchPath.totalHeatLoss >= minPathValue) {
            continue
        }
        const key = pathToMapKey(searchPath)
        const totalHeatLossForKey = searchedMap.get(key)
        if (
            totalHeatLossForKey !== undefined && 
            searchPath.totalHeatLoss >= totalHeatLossForKey
        ) {
            // There is already a better value
            continue
        }
        searchedMap.set(key, searchPath.totalHeatLoss)

        if (
            searchPath.currentCoordinate.x === endCoordinate.x &&
            searchPath.currentCoordinate.y === endCoordinate.y
        ) {
            finishedPaths.push(searchPath)
            minPathValue = Math.min(minPathValue, searchPath.totalHeatLoss)
            continue
        }

        const paths = getNextPaths(searchPath, cityMap, 4, 10)

        for (const p of paths) {
            const key = pathToMapKey(p)
            if (p.totalHeatLoss >= minPathValue) {
                continue
            }
            const totalHeatLossForKey = searchedMap.get(key)
            if (
                totalHeatLossForKey !== undefined && 
                searchPath.totalHeatLoss > totalHeatLossForKey
            ) {
                // There is already a better value
                continue
            }
            searchQueue.insert(p)
        }
    }

    return minPathValue
}

