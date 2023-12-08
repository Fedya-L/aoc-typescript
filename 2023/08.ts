
function inputToStepsAndAndJunctions(input: string): [string[], { [key: string]: string[] }] {

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

    let currentStep = 'AAA'
    let stepCount = 0 
    while (true) {
        const junction = junctions[currentStep]!
        const nextStep = steps[stepCount % steps.length]
        const nextJunction = junction[nextStep]
        stepCount++

        if (nextJunction === 'ZZZ') {
            return stepCount
        }

        currentStep = nextJunction
    }
    return -1
}

export function solve2(input: string): number {
    return -2
}
