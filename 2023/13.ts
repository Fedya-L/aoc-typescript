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


function findMirrorSplitIndex(array: string[], startingAt: number): number {
    const i = startingAt
    const a = array[i]
    const b = array[i+1]

    if (a !== b) {
        return 0
    }
    // check mirroring
    let isMirror = true
    for (let ii = 1; ii <= i; ii++) {
        const ai = i-ii
        const bi = i+1+ii

        if (ai < 0 || bi >= array.length) {
            break
        }

        const aa = array[ai]
        const bb = array[bi]

        if (aa != bb) {
            isMirror = false
        }
    }
    if (isMirror) {
        return (i+1)
    }
    return 0
}
// column * 1
// row * 100
function patternToValue(pattern: Pattern): number {
    const {rows, columns} = pattern
    for (let i = 0; i < rows.length - 1; i++) {
        const result = findMirrorSplitIndex(rows, i)
        if (result !== 0) {
            return result * 100
        }
    }
    for (let i = 0; i < columns.length - 1; i++) {
        const result = findMirrorSplitIndex(columns, i)
        if (result !== 0) {
            return result
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

function patternToVariantValueV2(pattern: Pattern): number {
    const variantsCount = pattern.rows.length * pattern.columns.length

    const {rows, columns} = pattern

    let originValue = patternToValue(pattern) 
    let fallback = 0

    for (let i = 0; i < rows.length - 1; i++) {
        const variantStart = rows.length * i
        const variantStop = variantStart + rows.length * 2
        for (let ii = variantStart; ii < variantStop; ii++) {
            const variant = patternToPatternVariant(pattern, ii) 
            const result = findMirrorSplitIndex(variant.rows, i) * 100

            if (result !== 0 && result !== originValue) {
                return result
            }
            if (result === originValue) {
                fallback = originValue
            }
        }
    }
    for (let i = 0; i < columns.length - 1; i++) {
        const variantStart = rows.length * i
        const variantStop = variantStart + rows.length * 2
        for (let ii = variantStart; ii < variantStop; ii++) {
            const variant = patternToPatternVariant(pattern, ii) 
            const result = findMirrorSplitIndex(variant.columns, i)
            if (result !== 0 && result !== originValue) {
                return result
            }
            if (result === originValue) {
                fallback = originValue
            }
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
    const values = patterns.map(patternToVariantValueV2)
    return values.reduce((p,c) => p+c, 0)
}