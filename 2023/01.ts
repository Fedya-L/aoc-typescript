

export function solve1(input: string): number {
    const lines = input.split("\n")
    const arrayOfNumbericCharactersArrays = lines.map((line) => {
        return [...line].filter((char) => {
            return !isNaN(+char)
        })
    })
    const arrayOfNumbers = arrayOfNumbericCharactersArrays.map((aonca) => {
        return +(aonca[0] + aonca[aonca.length - 1])
    })

    return arrayOfNumbers.reduce((p, c) => p + c)
}


export function solve2(input: string): number {
    const fixedInput = fixTheInput(input)

    return solve1(fixedInput)
}

export function fixTheInput(input: string): string {
    const mapForFixing = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
    }
    
    const regex = new RegExp(`(${Object.keys(mapForFixing).join('|')})`, 'g')
    const fixedInput = input.replace(regex, (match) => {
        return mapForFixing[match]
    })
    return fixedInput
}