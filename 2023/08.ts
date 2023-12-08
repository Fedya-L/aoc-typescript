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
        }
    })

    const gcd = (a, b) => b == 0 ? a : gcd(b, a % b)
    const lcm = (a, b) => a / gcd(a, b) * b
    const leastCommonMultiplier = startOfCycle.map(j => j.length).reduce(lcm, 1)
    
    return leastCommonMultiplier
}   
