import { Z_STREAM_END } from "zlib";

function inputToStepsAndAndJunctions(input: string): [number[], { [key: string]: string[] }] {

    const [rawSteps, rawJunctions] = input.split("\n\n")

    const steps = rawSteps.split('').map(s => s == 'R' ? 1 : 0)

    let map: { [key: string]: string[] } = {}
    rawJunctions.split("\n").forEach(line => {
        const [junction, rawPaths] = line.split(' = ')

        const paths = rawPaths.substring(1,rawPaths.length - 1).split(', ')
        
        map[junction] = paths
    });

    return [steps, map]
}

export function solve1(input: string): number {
    const [steps, junctions] = inputToStepsAndAndJunctions(input)

    let currentJunction = 'AAA'
    let stepCount = 0 
    while (true) {
        const junction = junctions[currentJunction]!
        const nextStep = steps[stepCount % steps.length]
        const nextJunction = junction[nextStep]
        stepCount++

        if (nextJunction === 'ZZZ') {
            return stepCount
        }

        currentJunction = nextJunction
    }
    return -1
}

type State = {
    stepCount: number
    stepIndex: number
    junction: string
}

type StateWithDiff = State & {
    diffToPrev: number
}

export function solve2(input: string): number {

    const [steps, junctions] = inputToStepsAndAndJunctions(input)

    const startingJunctions = Object.keys(junctions).filter(j => j.endsWith('A'))

    let zStateByStartingJunction: { [key: string]: StateWithDiff[] } = {}

    for (const startingJunction of startingJunctions) {
        let currentJunction = startingJunction
        let zEntries: State[] = []


        let stepCount = 0
        while (zEntries.length < 10) {
            let stepIndex = stepCount % steps.length
            let stepInstruction = steps[stepIndex]
            stepCount++
    
            currentJunction = junctions[currentJunction][stepInstruction]
            
            if (currentJunction.endsWith('A')) {
                console.log('breakpoint')
            }
            if (currentJunction.endsWith('Z')) {
                zEntries.push({
                    stepIndex,
                    stepCount,
                    junction: currentJunction,
                })
            }

        }

        let zEntriesWithDiff: StateWithDiff[] = [
            {...zEntries[0], diffToPrev: zEntries[0].stepCount}
        ]
        for (let i = 1; i < zEntries.length; i++) {
            const prev = zEntries[i-1]
            const curr = zEntries[i]

            zEntriesWithDiff.push({
                ...curr,
                diffToPrev: curr.stepCount - prev.stepCount
            })
        }

        zStateByStartingJunction[startingJunction] = zEntriesWithDiff

    }

    const startOfCycle = Object.entries(zStateByStartingJunction).map(([sj, ze]) => {
        return {
            junction: sj,
            lastPreCycle: ze[0].diffToPrev - ze[1].diffToPrev,
            start: ze[0].diffToPrev - ze[1].diffToPrev + 1,
            end: ze[0],
            length: ze[1].diffToPrev,
            div: (ze[0].diffToPrev - ze[1].diffToPrev) / 13019,

        }
    })

    // let numToCount: {[key: number]: number} = {}
    let numToCount: number[] = []

    let junctionsCount = startingJunctions.length
    let countCompare = startingJunctions.length - 1
    for (let i = 1; i < 1_000_000_000; i++) {
        
        // for (onst cycle of startOfCycle) {
            const newEnd = cycle.lastPreCycle + cycle.length * i

            let checkPassed = startOfCycle.filter(j => {
                return newEnd % j.length == j.lastPreCycle 
            }).length
            if (checkPassed != junctionsCount) {
                continue
            }
            let count = numToCount[newEnd]
            if (count) {
                if (count == countCompare) {
                    return newEnd
                }
                numToCount[newEnd] = count + 1
            } else {
                numToCount[newEnd] = 1
            }
        // }


    }


    return -2
}   
