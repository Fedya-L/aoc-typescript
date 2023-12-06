
type RaceRun = {
    time: number
    buttonPressedTime: number
    travelTime: number
    distance: number
}

function simulateRacesForTime(time: number): RaceRun[] {
    let simulatedRaces: RaceRun[] = []

    for (let i = 0; i <= time; i++) {
        const buttonPressedTime = time - i
        const travelTime = i
        const distance = buttonPressedTime * travelTime

        simulatedRaces.push({
            time,
            buttonPressedTime,
            travelTime,
            distance,
        })
    }

    return simulatedRaces
}

export function solve1(input: string): number {
    const [rawTimes, rawDistances] = input.split("\n")

    const times = rawTimes.split(":")[1].split(" ").filter(s => s !== '').map(s => +s)
    const distances = rawDistances.split(":")[1].split(" ").filter(s => s !== '').map(s => +s)

    const timesToSimulations = times.map(t => simulateRacesForTime(t))

    let answer = 1
    for (let i = 0; i < times.length; i++) {
        const distanceToBeat = distances[i]
        const wins = timesToSimulations[i].filter(s => s.distance > distanceToBeat).length
        answer *= wins
    }

    return answer
}

export function solve2(input: string): number {
    const [rawTimes, rawDistances] = input.split("\n")

    const time = +rawTimes.split(":")[1].split(" ").filter(s => s !== '').join('')
    const distance = +rawDistances.split(":")[1].split(" ").filter(s => s !== '').join('')

    const simulatedRaces = simulateRacesForTime(time)
    
    const answer = simulatedRaces.filter(s => s.distance > distance).length

    return answer
}