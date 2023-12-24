import { ConvenientArray2D, Coordinate2D } from "../utils/data-things"

type Tile = '#' | '.' | '>' | '<' | 'v' | '^'
type HikingMap = ConvenientArray2D<Tile>




function inputToHikingMap(i: string): HikingMap {
    return new ConvenientArray2D<Tile>(i.split("\n").map(l => l.split('') as Tile[]))
}

class CoordinateSet {
    data: Set<string>

    constructor(data: Set<string> | undefined = undefined) {
        this.data = data ?? new Set()
    }

    add(c: Coordinate2D) {
        this.data.add(this.coordinateToKey(c))
    }

    has(c: Coordinate2D) {
        return this.data.has(this.coordinateToKey(c))
    }

    coordinateToKey(c: Coordinate2D): string {
        return `${c.x},${c.y}`
    }

    copy(): CoordinateSet {
        return new CoordinateSet(new Set([...this.data]))
    }
}

const possibleCoordinates: {[key: string]: [number, number][]} = {
    '#': [],
    '.': [
        [-1,0],
        [1, 0],
        [0,-1],
        [0,1],
    ],
    '>': [[1,0]],
    '<': [[-1,0]],
    'v': [[0,1]],
    '^': [[0,-1]],
}

function getNextCoordinates(c: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): Coordinate2D[] {
    const currentTile = hikingMap.getXY(c)!
    const ps = possibleCoordinates[currentTile].map(([x,y]) => ({x: c.x + x, y: c.y + y})).filter(c => !visitedCoordinates.has(c))
    if (ps.length === 0) {
        return []
    }

    let nextCoordinates: Coordinate2D[] = []
    for (const cc of ps) {
        const tile = hikingMap.getXY(cc) ?? '#'
        if (tile === '#') {
            continue
        }
        if (tile === '.') {
            nextCoordinates.push(cc)
            continue
        }
        if (tile === '>') {
            if (cc.x - c.x !== -1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === '<') {
            if (cc.x - c.x !== 1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === 'v') {
            if (cc.y - c.y !== -1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === '^') {
            if (cc.y - c.y !== 1) {
                nextCoordinates.push(cc)
            }
            continue
        }
    }

    return nextCoordinates
}

// Returns possible paths (lenghts)
function traversePath(currentPoint: Coordinate2D, finishPoint: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): number[] {
    if (currentPoint.x === finishPoint.x && currentPoint.y === finishPoint.y) {
        return [visitedCoordinates.data.size]
    }
    visitedCoordinates.add(currentPoint)
    const nextCoordinates = getNextCoordinates(currentPoint, hikingMap, visitedCoordinates)
    if (nextCoordinates.length === 0) {
        return []
    }
    if (nextCoordinates.length === 1) {
        return traversePath(nextCoordinates[0], finishPoint, hikingMap, visitedCoordinates)
    }

    return nextCoordinates.flatMap(c => traversePath(c, finishPoint, hikingMap, new CoordinateSet(new Set([...visitedCoordinates.data]))))
}

export function solve1(i: string): number {

    const hikingMap = inputToHikingMap(i)
    const startingPoint: Coordinate2D = {x: 1, y: 0}
    const finishPoint: Coordinate2D = {x: hikingMap.xSize - 2, y: hikingMap.ySize - 1}


    const possiblePaths = traversePath(startingPoint, finishPoint, hikingMap, new CoordinateSet())

    return possiblePaths.sort((a,b) => b - a)[0]
}

function getNextCoordinatesV2(c: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): Coordinate2D[] {
    const ps = possibleCoordinates['.'].map(([x,y]) => ({x: c.x + x, y: c.y + y})).filter(c => !visitedCoordinates.has(c))
    if (ps.length === 0) {
        return []
    }

    let nextCoordinates: Coordinate2D[] = []
    for (const cc of ps) {
        const tile = hikingMap.getXY(cc) ?? '#'
        if (tile === '#') {
            continue
        }
        nextCoordinates.push(cc)
    }

    return nextCoordinates
}

// Returns possible paths (lenghts)
function traversePathV2(currentPoint: Coordinate2D, finishPoint: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): number[] {
    if (currentPoint.x === finishPoint.x && currentPoint.y === finishPoint.y) {
        return [visitedCoordinates.data.size]
    }
    visitedCoordinates.add(currentPoint)
    const nextCoordinates = getNextCoordinatesV2(currentPoint, hikingMap, visitedCoordinates)
    if (nextCoordinates.length === 0) {
        return []
    }
    if (nextCoordinates.length === 1) {
        return traversePathV2(nextCoordinates[0], finishPoint, hikingMap, visitedCoordinates)
    }

    return nextCoordinates.flatMap(c => traversePathV2(c, finishPoint, hikingMap, visitedCoordinates.copy()))
}

type GraphNode = {
    id: string,
    connectedTo: {[key: string]: number}
}

class GraphManager {
    data: Map<string, GraphNode>

    constructor() {
        this.data = new Map()
    }

    add(c: Coordinate2D): GraphNode {
        const id = this.coordinateToKey(c)
        let gn = this.data.get(id)
        if (gn) {
            return gn
        }
        gn = {
            id,
            connectedTo: {}
        }
        this.data.set(gn.id, gn) 
        return gn
    }

    connect(c1: Coordinate2D, c2: Coordinate2D, value: number) {
        const gn1 = this.add(c1)
        const gn2 = this.add(c2)

        gn1.connectedTo[gn2.id] = value
        gn2.connectedTo[gn1.id] = value
    }

    getById(id: string): GraphNode {
        return this.data.get(id)!
    }

    private coordinateToKey(c: Coordinate2D): string {
        return `${c.x},${c.y}`
    }
}

type PathState = {
    lastIntersectionCoordinate: Coordinate2D
    currentCoordinate: Coordinate2D
    visitedCoordinates: CoordinateSet
}

enum TileType {
    wall,
    path,
    intersection,
}

function coordinateToKey(c: Coordinate2D): string {
    return `${c.x},${c.y}`
}

export function solve2(i: string): number {
    const hikingMap = inputToHikingMap(i)
    const startingPoint: Coordinate2D = {x: 1, y: 0}
    const finishPoint: Coordinate2D = {x: hikingMap.xSize - 2, y: hikingMap.ySize - 1}

    // Todo: Flatten the Graph
    const gm = new GraphManager()
    const coordinateToTileType = new Map<string, TileType>()
    const visitedCoordinates = new CoordinateSet()

    for (const [x,y] of hikingMap) {
        const tile = hikingMap.get(x,y) ?? '#'
        const coordinate = {x,y}
        const coordinateId = coordinateToKey(coordinate)

        let tileType = TileType.wall
        if (tile === '#') {
            coordinateToTileType.set(coordinateId, tileType)
            continue
        }

        const nextCoordinates = getNextCoordinatesV2(coordinate, hikingMap, visitedCoordinates)
        if (x === 3 && y === 5) {
            console.log()
        }
        tileType = nextCoordinates.length > 2 ? TileType.intersection : TileType.path
        coordinateToTileType.set(coordinateId, tileType)
    }


    visitedCoordinates.add(startingPoint)
    let pathStatesToProcess: PathState[] = [{
        lastIntersectionCoordinate: startingPoint,
        currentCoordinate: {x: 1, y: 1},
        visitedCoordinates: visitedCoordinates,
    }]

    let processedIntersection: string[] = []
    while (pathStatesToProcess.length) {
        let pathState = pathStatesToProcess.pop()!
        processedIntersection.push(coordinateToKey(pathState.lastIntersectionCoordinate))
        let cc = pathState.currentCoordinate

        let currentTileType = coordinateToTileType.get(coordinateToKey(pathState.currentCoordinate))

        let deadEnd = false
        while (currentTileType === TileType.path) {
            // We expect one way or no ways
            const ncs = getNextCoordinatesV2(
                cc,
                hikingMap,
                pathState.visitedCoordinates
            )
            if (ncs.length === 0) {
                // This is a dead end
                if (cc.x === finishPoint.x && cc.y == finishPoint.y) {
                    gm.connect(pathState.lastIntersectionCoordinate, cc, pathState.visitedCoordinates.data.size)
                }
                deadEnd = true
                break
            }
            if (ncs.length !== 1) {
                throw 'There should be only one path!'
            }
            const nc = ncs[0]

            pathState.visitedCoordinates.add(cc)
            cc = nc
            currentTileType = coordinateToTileType.get(coordinateToKey(cc))
        }

        if (deadEnd) {
            continue
        }

        // If we got here - we got to an intersection.
        // Time to creat new Graph node and explore further
        
        // cc is an interection at this point
        gm.connect(pathState.lastIntersectionCoordinate, cc, pathState.visitedCoordinates.data.size)

        if (processedIntersection.includes(coordinateToKey(cc))) {
            continue 
        }
        const ncs = getNextCoordinatesV2(
            cc,
            hikingMap,
            visitedCoordinates
        ) 

        for (const nc of ncs) {
            let visitedCoordinates = new CoordinateSet()
            visitedCoordinates.add(cc)
            pathStatesToProcess.push({
                lastIntersectionCoordinate: cc,
                currentCoordinate: nc,
                visitedCoordinates: visitedCoordinates,
            })
        }
    }




    let nodePathsToProcess: {path: string[], value: number}[] = [
        {
            path: [coordinateToKey(startingPoint)], 
            value: 0,
        },
    ]

    const finalNodeId = coordinateToKey(finishPoint)
    let usablePaths: {path: string[], value: number}[] = []
    while (nodePathsToProcess.length) {
        const nodePath = nodePathsToProcess.pop()!

        const lastNodeId = nodePath.path[nodePath.path.length -1]
        if (lastNodeId === finalNodeId) {
            usablePaths.push(nodePath)
            continue
        }
        const graphNode = gm.getById(lastNodeId)

        for (const nextNodeId of Object.keys(graphNode.connectedTo)) {
            if (nodePath.path.includes(nextNodeId)) {
                continue
            }
            nodePathsToProcess.push({
                path: [...nodePath.path, nextNodeId],
                value: nodePath.value + graphNode.connectedTo[nextNodeId]
            })
        }
    }

    return usablePaths.sort((a,b) => b.value - a.value)[0].value
}