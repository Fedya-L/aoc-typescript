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
function damagedRecordToArrangementsCountV2(damagedRecord: DamagedRecord): number {
    cache = new Map<string, number>()
    const result = doCountV2(damagedRecord.condition, damagedRecord.damagedGroups)

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
            const newCondition = condition.substring(firstGroup + 1)
            const newDamageGroups = damagedGroups.slice(1)
            const newMinDamageGroupSize = newDamageGroups.reduce((p,c) => p + c, newDamageGroups.length - 1)
            result += doCount(newCondition, newDamageGroups, newMinDamageGroupSize)
        }
    }

    cache.set(cacheKey, result)
    return result
}

function doCountV2(condition: string, groups: number[]): number {
    const cacheKey = condition + groups.join(',')
    const cacheValue = cache.get(cacheKey)
    if (cacheValue !== undefined) {
        return cacheValue
    }

    // '' [1,1,3]
    // '' []
    if (condition.length === 0) {
        const result = groups.length === 0 ? 1 : 0
        cache.set(cacheKey, result)
        return result
    }

    // '...' []
    // '???' [] => '...' []
    // '###' []
    if (groups.length === 0) {
        const result = condition.includes('#') ? 0 : 1
        cache.set(cacheKey, result)
        return result
    }

    const firstChar = condition.charAt(0)

    // '......???.###' [1,1,3]
    if (firstChar === '.') {
        // '???.###' [1,1,3]
        const result = doCountV2(condition.slice(1), groups)
        cache.set(cacheKey, result)
        return result
    }



    // '#?.?#' [2,2]
    if (firstChar === '#') {
        const firstGroup = groups[0]

        // '#'
        const groupString = condition.slice(0, firstGroup)
        // This check also puts an assumption that '?' is '#'
        const isFirstGroupPossible = groupString.includes('.') === false
        // This check also puts an assumtion that '?' is '.'
        const isFirstGroupReallyPossible = isFirstGroupPossible && condition.charAt(firstGroup) !== '#'

        if (isFirstGroupReallyPossible) {
            // Then we need to go deeper and check the next group
            // Trim the group size + the '.' (or '?' which is assumed to be '.')
            const newCondition = condition.slice(firstGroup + 1)
            // Remove the group we just checked
            const newGroup = groups.slice(1)
            
            // There is only one path, so we will return this result right away
            const result = doCountV2(newCondition, newGroup)
            cache.set(cacheKey, result)
            return result
        } 

        // If first group is not possible, then there is no reason to go deeper.
        const result = 0
        cache.set(cacheKey, result)
        return result        
    }

    // At this stage firstChar can only be '?', so we will create 2 paths
    let result = 0
    
    // '???.###' [1,1,3]
    // Test as if first '?' is '.'
    // '.??.###' [1,1,3] => '??.###' [1,1,3]
    result += doCountV2(condition.slice(1), groups)

    // '???.###' [1,1,3]
    // Test as if first '?' is '#'
    // '#??.###' [1,1,3]
    //
    // '?.###' [1,3]
    // Test as if first '?' is '#'
    // '#.###' [1,3]
    const newCondition = '#' + condition.slice(1)
    result += doCountV2(newCondition, groups)

    cache.set(cacheKey, result)
    return result
}

export function solve1(input: string): number {
    const something = input.split("\n")
        .map(lineToDamagedRecord)
        .map(damagedRecordToArrangementsCountV2)
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
    .map(damagedRecordToArrangementsCountV2)
    .reduce((p, c) => p + c, 0)
    return something
}