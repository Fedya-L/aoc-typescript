const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export function solve1(input: string): number {
    return input
        .split('\n')
        .map((v) => {
            const vs = v.split('')
            const a = vs.slice(0, v.length / 2)
            const b = vs.slice(v.length / 2)

            const common = a.find((v) => b.includes(v) )!
        
            return priorities.indexOf(common) + 1
        })
        .reduce((p, c) => (p + c))
}

export function solve2(input: string): number {
    const rows = input.split('\n').map((v) => v.split(''))
    const groups = new Array(rows.length / 3) as number[]
    for (let i = 0, g = 0; i < rows.length; i += 3, g++) {
        const a = rows[i]
        const b = rows[i + 1]
        const c = rows[i + 2]

        for (const char of a) {
            const bc = b.some((v) => v === char)
            const cc = c.some((v) => v === char)
            
            if (bc && cc) {
                groups[g] = priorities.indexOf(char) + 1
                break
            }
        }
    }
    return groups.reduce((p, c) => p + c)
}
