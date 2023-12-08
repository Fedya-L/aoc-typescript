
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

export function solve2(input: string): number {

    const [steps, junction] = inputToStepsAndAndJunctions(input)

    let currentJunctions = Object.keys(junction).filter(j => j.endsWith('A'))
    let stepCount = 0
    while (true) { 
        const nextStep = steps[stepCount % steps.length]
        stepCount++

        for (let i = 0; i < currentJunctions.length; i++) {
            currentJunctions[i] = junction[currentJunctions[i]][nextStep]            
        }

        if (currentJunctions.length === currentJunctions.filter(j => j.endsWith('Z')).length) {
            return stepCount
        }
    }

    return -2
}
