

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
    }
}

function stringToCoordinate(s: string): Coordinate3d {
    const [x,y,z] = s.split(',').map(s => +s)
    return {
        x,y,z,
        asString: s
    }
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
    if (b.minZ <= 1) {
        return b.minZ
    }
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
    if (b.minZ <= 1) {
        return []
    }
    const bottomCoords = b.coordinates.filter(c => c.z === b.minZ)
    const underZ = b.minZ - 1

    const set = new Set<number>()

    for (const bc of bottomCoords) {
        const ctc = createCoordinate(bc.x, bc.y, underZ)
        const brickBelow = ctb.get(ctc.asString)
        if (brickBelow !== undefined) {
            set.add(brickBelow.id)
        } 
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
    if (set.size < 2) {
        set.clear()
    }
    if (!hasBrickAbove) {
        set.add(b.id)
    }
    return [...set.values()]
}

export function solve1(i: string): number {

    // let brickIdToBrick = new Map<number, Brick>()
    let coordinateToBrick = new Map<string, Brick>() 

    const bricks = i.split("\n").map(stringToBrick).sort((a, b) => a.minZ - b.minZ)

    for (const b of bricks) {
        // brickIdToBrick.set(b.id, b)
        for (const c of b.coordinates) {
            coordinateToBrick.set(c.asString, b)
        }
    }

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

    for (const b of bricks) {
        const bb = unsupportingBrickIds(b, coordinateToBrick)
        bb.forEach(id => removableBrickIds.add(id))
    }
    

    return removableBrickIds.size
}



export function solve2(i: string): number {
    return -2
}