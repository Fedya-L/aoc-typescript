
type DamagedRecord = {
    condition: string
    damagedGroups: number[]
}

function lineToDamagedRecord(line: string): DamagedRecord {

    const [condition, rawGroups] = line.split(' ')

    const damagedGroups = rawGroups.split(',').map(n => +n)

    return {
        condition,
        damagedGroups
    }
}

function damagedRecordToArrangementsCount(damagedRecord: DamagedRecord): number {
    const result = doCount(damagedRecord.condition, damagedRecord.damagedGroups)

    return result
}

function doCount(condition: string, damagedGroups: number[]): number {
    if (condition.length === 0) {
        return damagedGroups.length === 0 ? 1 : 0
    } 

    if (damagedGroups.length === 0) {
        return condition.includes('#') ? 0 : 1
    }



    let result = 0

    if (condition.charAt(0) !== '#') { // .?
        result += doCount(condition.substring(1), damagedGroups)
    }

    if (condition.charAt(0) !== '.') { // #?
        const firstGroup = damagedGroups[0]

        // ???.### 1,1,3
        if (
            firstGroup <= condition.length &&
            condition.substring(0, firstGroup).includes('.') === false &&
            (firstGroup == condition.length || condition.charAt(firstGroup) !== '#')
            ) {
            result += doCount(condition.substring(firstGroup + 1), damagedGroups.slice(1))
        } else {
            return result
        }
    }

    return result
}

export function solve1(input: string): number {
    const something = input.split("\n")
        .map(lineToDamagedRecord)
        .map(damagedRecordToArrangementsCount)
        .reduce((p, c) => p + c, 0)
    return something
}

export function solve2(input: string): number {
    return -2
}