

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

    *[Symbol.iterator](): Iterator<[number, number]> {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this. xSize; x++) {
                yield [x, y];
            }
        }
    }
}

type Coordinate2D = {
    x: number
    y: number
}

function* iterateXY(x: number, y: number): Generator<[number, number], void, unknown> {
    for (let yy = 0; yy < y; yy++) {
        for (let xx = 0; xx < x; xx++) {
            yield [xx, yy]
        }
    }
}

type MyIterator = Generator<[number, number], void, unknown>

export {
    ConvenientArray2D,
    Coordinate2D,
    iterateXY,
}
