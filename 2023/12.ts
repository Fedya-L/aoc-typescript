import { validateHeaderValue } from "http"

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
    cache = new Map<string, number>()
    const minDamageGroupSize = damagedRecord.damagedGroups.reduce((p,c) => p+c, damagedRecord.damagedGroups.length - 1)
    const result = doCount(damagedRecord.condition, damagedRecord.damagedGroups, minDamageGroupSize)

    return result
}


let cache = new Map<string, number>()
function doCount(condition: string, damagedGroups: number[], minDamageGroupSize: number): number {
    const cacheKey = condition + damagedGroups.join(',')
    const cachedValue = cache.get(cacheKey)
    if (cachedValue !== undefined) {
        return cachedValue
    }
    if (condition.length === 0) {
        const result = damagedGroups.length === 0 ? 1 : 0
        cache.set(cacheKey, result)
        return result
    } 

    if (damagedGroups.length === 0) {
        const result =  condition.includes('#') ? 0 : 1
        cache.set(cacheKey, result)
        return result
    }


    let result = 0

    if (condition.charAt(0) !== '#') { // .?
        if (condition.length >= minDamageGroupSize) {
            result += doCount(condition.substring(1), damagedGroups, minDamageGroupSize)
        }
    }

    if (condition.charAt(0) !== '.') { // #?
        const firstGroup = damagedGroups[0]

        // ???.### 1,1,3
        if (
            firstGroup <= condition.length &&
            condition.substring(0, firstGroup).includes('.') === false &&
            (firstGroup == condition.length || condition.charAt(firstGroup) !== '#')
            ) {
            const newDamageGroups = damagedGroups.slice(1)
            const newMinDamageGroupSize = newDamageGroups.reduce((p,c) => p + c, newDamageGroups.length - 1)
            result += doCount(condition.substring(firstGroup + 1), newDamageGroups, newMinDamageGroupSize)
        }
    }

    cache.set(cacheKey, result)
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
    const something = input.split("\n")
    .map(lineToDamagedRecord)
    .map(dr => {
        dr.condition = Array(5).fill(dr.condition).join('?')
        dr.damagedGroups = Array(5).fill([...dr.damagedGroups])
            .reduce<number[]>((p,c) => p.concat(c), [])
        return dr
    })
    .map(damagedRecordToArrangementsCount)
    .reduce((p, c) => p + c, 0)
    return something
}