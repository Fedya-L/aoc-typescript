
type Galaxy = {
    x: number
    y: number
}

export function solve1(input: string): number {

    let skyMap = input.split("\n").map(line => line.split(''))

    const skyMapSize = skyMap.length

    let emptyColumns: number[] = []
    for (let x = 0; x < skyMapSize; x++) {
        let emptyColumn = true
        for (let y = 0; y < skyMapSize; y++) {
            const something = skyMap[y][x]!
            if (something == '#') {
                emptyColumn = false
                break
            }
        }
        if (emptyColumn) {
            emptyColumns.push(x)
        }
    }

    let emptyRows: number[] = []
    for (let y = 0; y < skyMapSize; y++) {
        let emptyRow = true
        for (let x = 0; x < skyMapSize; x++) {
            const something = skyMap[y][x]!
            if (something == '#') {
                emptyRow = false
                break
            }
        }
        if (emptyRow) {
            emptyRows.push(y)
        }
    }


    for (const x of emptyColumns.reverse()) {
        for (let y = 0; y < skyMapSize; y++) {
            skyMap[y].splice(x, 0, '.')
        }
    }
    const newColumnCount = skyMapSize + emptyColumns.length

    for (const y of emptyRows.reverse()) {
        skyMap.splice(y, 0, Array(newColumnCount).fill('.'))
    }
    const newRowCount = skyMapSize + emptyRows.length

    let galaxies: Galaxy[] = []

    for (let y = 0; y < newRowCount; y++) {
        for (let x = 0; x < newColumnCount; x++) {
            const something = skyMap[y][x]
            if (something === '#') {
                galaxies.push({x,y})
            }
        }
    }

    let distances: number[] = []
    for (let i = 0; i < galaxies.length - 1; i++) {
        for (let ii = i + 1; ii < galaxies.length; ii++) {
            const a = galaxies[i]
            const b = galaxies[ii]

            const distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

            distances.push(distance)
        }
    }

    return distances.reduce((p, c) => p + c, 0)
}

export function solve2(input: string): number {
    return -2
}