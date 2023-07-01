function inputToCalloriesOnElf(input: string): number[] {
    return input.split("\n\n").map((rawBackpack) => {
        return rawBackpack.split("\n")
        .map((v) => parseInt(v) )
        .reduce((prev, curr) => (prev + curr))
    }).sort((a, b) => (b - a))
}

export function solve1(input: string): number {
    const coe = inputToCalloriesOnElf(input)
    return coe[0]
}


export function solve2(input: string): number {
    const coe = inputToCalloriesOnElf(input)
    return coe.slice(0, 3).reduce((prev, curr) => (prev + curr))
}
