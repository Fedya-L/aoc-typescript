

type Coordinate3d = {
    x: number,
    y: number,
    z: number,
    asString: string,
}

type Brick = {
    id: number,
    coordinates: Coordinate3d[],
    maxZ: number,
    minZ: number,
    underBrickIds: Set<number>
    aboveBrickIds: Set<number>
}

function stringToBrick(s: string, id: number): Brick {
    const [c1, c2] = s.split('~').map(stringToCoordinate)
    const coordinates = fillCoordinatesBetweenCoordiantes(c1,c2)
    const maxZ  = coordinates.map(c => c.z).reduce((p,c) => Math.max(p,c), 0)
    const minZ  = coordinates.map(c => c.z).reduce((p,c) => Math.min(p,c), Number.MAX_SAFE_INTEGER)
    return {
        id,
        coordinates,
        maxZ,
        minZ,
        underBrickIds: new Set<number>(),
        aboveBrickIds: new Set<number>(),
    }
}

function stringToCoordinate(s: string): Coordinate3d {
    const [x,y,z] = s.split(',').map(s => +s)
    return createCoordinate(x,y,z)
}

function createCoordinate(x:number,y: number, z: number): Coordinate3d {
    return {
        x,y,z,
        asString: `${x},${y},${z}`
    }
}

function fillCoordinatesBetweenCoordiantes(c1: Coordinate3d, c2: Coordinate3d): Coordinate3d[] {
    let cs: Coordinate3d[] = []
    for (let x = Math.min(c1.x, c2.x); x <= Math.max(c1.x, c2.x); x++) {
        for (let y = Math.min(c1.y, c2.y); y <= Math.max(c1.y, c2.y); y++) {
            for (let z = Math.min(c1.z, c2.z); z <= Math.max(c1.z, c2.z); z++) {
                cs.push(createCoordinate(x,y,z))
            }
        }
    }
    return cs
}

function getLowestPossibleZ(b: Brick, ctb: Map<string, Brick>): number {
    let z = b.minZ - 1
    const bottomCoords = b.coordinates.filter(c => c.z === b.minZ)
    while (z > 0) {
        for (const {x,y} of bottomCoords) {
            const c = createCoordinate(x,y,z)
            const bb = ctb.get(c.asString)
            if (bb !== undefined) {
                return z + 1
            } 
        }
        z--
    }
    return z + 1
}

function unsupportingBrickIds(b: Brick, ctb: Map<string, Brick>): number[] {

    const set = new Set<number>()

    const bottomCoords = b.coordinates.filter(c => c.z === b.minZ)
    const underZ = b.minZ - 1
    for (const bc of bottomCoords) {
        const ctc = createCoordinate(bc.x, bc.y, underZ)
        const brickBelow = ctb.get(ctc.asString)
        if (brickBelow !== undefined) {
            set.add(brickBelow.id)
        } 
    }
    if (set.size < 2) {
        set.clear()
    }

    const upperCoords = b.coordinates.filter(c => c.z === b.maxZ)
    const upperZ = b.maxZ + 1
    let hasBrickAbove = false
    for (const uc of upperCoords) {
        const ctc = createCoordinate(uc.x, uc.y, upperZ)
        const brickAbove = ctb.get(ctc.asString)
        if (brickAbove !== undefined) {
            hasBrickAbove = true
            break
        }
    }
    if (!hasBrickAbove) {
        set.add(b.id)
    }
    return [...set.values()]
}

function calculateBrickSupport(b: Brick, ctb: Map<string, Brick>) {
    const upperCoords = b.coordinates.filter(c => c.z === b.maxZ)
    const upperZ = b.maxZ + 1
    for (const uc of upperCoords) {
        const ctc = createCoordinate(uc.x, uc.y, upperZ)
        const brickAbove = ctb.get(ctc.asString)
        if (brickAbove !== undefined) {
            b.aboveBrickIds.add(brickAbove.id)
            brickAbove.underBrickIds.add(b.id)
        }
    } 
}

export function solve1(i: string): number {

    const idToBrick = new Map<number, Brick>()
    const coordinateToBrick = new Map<string, Brick>() 

    const bricks = i.split("\n").map(stringToBrick).sort((a, b) => a.maxZ - b.maxZ)

    for (const b of bricks) {
        idToBrick.set(b.id, b)
        for (const c of b.coordinates) {
            coordinateToBrick.set(c.asString, b)
        }
    }

    const coordinatesCount = bricks.reduce((p, b) => p + b.coordinates.length, 0)

    for (let b of bricks) {
        const minZ = getLowestPossibleZ(b, coordinateToBrick)
        const zDiff = minZ - b.minZ
        if (zDiff === 0) {
            continue
        }
        b.coordinates.forEach(c => coordinateToBrick.delete(c.asString))
        b.coordinates = b.coordinates.map(c => createCoordinate(c.x, c.y, c.z + zDiff))
        b.maxZ = b.maxZ + zDiff
        b.minZ = minZ
        b.coordinates.forEach(c => coordinateToBrick.set(c.asString, b))
    }

    const removableBrickIds = new Set<number>()

    // for (const b of bricks) {
    //     const bb = unsupportingBrickIds(b, coordinateToBrick)
    //     bb.forEach(id => removableBrickIds.add(id))
    // }

    bricks.forEach(b => calculateBrickSupport(b, coordinateToBrick))


    for (const b of bricks) {
        if (b.aboveBrickIds.size === 0) {
            removableBrickIds.add(b.id)
            continue
        }
        
        let isTheOnlySupport = false
        for (const abi of b.aboveBrickIds) {
            const ab = idToBrick.get(abi)!
            if (ab.underBrickIds.size == 1) {
                isTheOnlySupport = true
                break
            }
        }
        if (isTheOnlySupport == false) {
            removableBrickIds.add(b.id)
        }
    }
    

    return removableBrickIds.size
}



export function solve2(i: string): number {
    return -2
}