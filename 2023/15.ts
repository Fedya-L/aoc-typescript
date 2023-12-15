import { count } from "console"


// Is this what clean code is?
function inputToSteps(input: string): string[] {
    return input.split(',')
}

function stepToValue(step: string): number {
    const chars = step.split('')

    let currentValue = 0

    for (const char of chars) {
        currentValue = (currentValue + char.charCodeAt(0)) * 17 % 256
    }

    return currentValue
}

function sumItUp(previous: number, current: number): number {
    return previous + current
}

export function solve1(input: string): number {
    return inputToSteps(input).map(stepToValue).reduce(sumItUp)
}

export function solve2(input: string): number {
    return -2
}