
export function lineToHistoryEntry(line: string): number[] {
    return line.split(" ").map(n => +n)
}

export function historyEntryToExpendedSet(historyEntry: number[]): number[][] {
    let output: number[][] = [
        historyEntry
    ]

    let currentSet = historyEntry


    while(currentSet.some(v => v !== 0)) {
        let newSet: number[] = []
        for (let i = 1; i < currentSet.length; i++) {
            const prev = currentSet[i-1]
            const curr = currentSet[i]

            newSet.push(curr - prev)
        }
        output.push(newSet)
        currentSet = newSet
    }

    return output
}

export function expendedSetToExpendedSetWithPredictions(expendedSet: number[][]): number[][] {


    let output: number[][] = expendedSet.map(a => [...a])
    output[output.length-1].push(0)

    for (let i = output.length - 2; i >= 0; i--) {
        let curr = output[i]
        let next = output[i+1]

        curr.push(curr[curr.length - 1] + next[next.length -1])
    }
    return output
}

export function solve1(input: string): number {
    return input.split("\n")
        .map(lineToHistoryEntry)
        .map(historyEntryToExpendedSet)
        .map(expendedSetToExpendedSetWithPredictions)
        .reduce((p, c) => p + c[0][c[0].length - 1], 0)
}

export function solve2(input: string): number {
    return -2
}
