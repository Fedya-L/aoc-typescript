import { count } from "console"
import { runInContext } from "vm"

type Pattern = {
    rows: string[]
    columns: string[]
}

function splitToPattern(split: string): Pattern {
    const rows = split
        .split("\n")
        .map(l => l.trimEnd())

    const columns = Array<string>(rows[0].length).fill('')

    for (const row of rows) {
        for (let i = 0; i < row.length; i++) {
            columns[i] += row.charAt(i)
        }
    }

    return { rows, columns}
}

// column * 1
// row * 100
function patternToValue(pattern: Pattern): number {
    const {rows, columns} = pattern
    for (let i = 0; i < rows.length - 1; i++) {
        const a = rows[i]
        const b = rows[i+1]

        if (a === b) {
            // check mirroring
            let isMirror = true
            for (let ii = 1; ii <= i; ii++) {
                const ai = i-ii
                const bi = i+1+ii

                if (ai < 0 || bi >= rows.length) {
                    break
                }

                const aa = rows[ai]
                const bb = rows[bi]

                if (aa != bb) {
                    isMirror = false
                }
            }
            if (isMirror) {
                return (i+1) * 100
            }
        }
    }
    for (let i = 0; i < columns.length - 1; i++) {
        const a = columns[i]
        const b = columns[i+1]

        if (a === b) {
            // check mirroring
            let isMirror = true
            for (let ii = 1; ii <= i; ii++) {
                const ai = i-ii
                const bi = i+1+ii

                if (ai < 0 || bi >= columns.length) {
                    break
                }

                const aa = columns[ai]
                const bb = columns[bi]

                if (aa != bb) {
                    isMirror = false
                }
            }
            if (isMirror) {
                return i+1
            }
        }
    }
    return 0
}

// 0 is a variant, not an original
function patternToPatternVariant(pattern: Pattern, variant: number): Pattern {
    const row = Math.floor(variant / pattern.columns.length)
    const column = variant % pattern.columns.length

    const rows = [...pattern.rows]

    const tempRow = rows[row].split('')
    tempRow[column] = tempRow[column] === '.' ? '#' : '.' 

    rows[row] = tempRow.join('')

    const columns = [...pattern.columns]

    const tempColumn = columns[column].split('')
    tempColumn[row] = tempColumn[row] === '.' ? '#' : '.'

    columns[column] = tempColumn.join('')

    return {
        rows,
        columns
    }
}

function patternToVariantValue(pattern: Pattern): number {
    const variantsCount = pattern.rows.length * pattern.columns.length

    let originValue = patternToValue(pattern)
    let fallback = 0
    for (let i = 0; i < variantsCount; i++) {
        const variant = patternToPatternVariant(pattern, i)

        const value = patternToValue(variant)
        if (value > 0 && originValue !== value) {
            return value
        }
        if (originValue == value) {
            fallback = value
        }
    }

    return fallback
}

export function solve1(input: string): number {
    const patterns = input.split("\n\n").map(splitToPattern)
    const values = patterns.map(patternToValue)
    return values.reduce((p,c) => p+c, 0)
}

export function solve2(input: string): number {
    const patterns = input.split("\n\n").map(splitToPattern)
    const values = patterns.map(patternToVariantValue)
    return values.reduce((p,c) => p+c, 0)
}