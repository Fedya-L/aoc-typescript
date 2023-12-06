import { o } from "vitest/dist/types-198fd1d9"

class MapRange {
    sourceRangeStart: number
    // Not inclusive
    sourceRangeEnd: number
    // destinationRangeStart: number
    // Not inclusive
    // destinationRangeEnd: number
    // rangeLength: number
    shiftValue: number

    sourceType: string
    destinationType: string

    constructor(rawRange: string, sourceType: string, destinationType: string) {
        const [st, sf, len] = rawRange.split(" ")
        this.sourceRangeStart = +sf
        this.sourceRangeEnd = this.sourceRangeStart + +len
        this.shiftValue = +st - this.sourceRangeStart
        // this.destinationRangeStart = +st
        // this.rangeLength = +len
        // this.shiftValue = this.destinationRangeStart - this.sourceRangeStart

        this.sourceType = sourceType
        this.destinationType = destinationType

        // this.sourceRangeEnd = this.sourceRangeStart + this.rangeLength
        // this.destinationRangeEnd = this.destinationRangeStart + this.rangeLength
    }

    isNumberInRange(number: number): boolean {
        return this.sourceRangeStart <= number && number < this.sourceRangeEnd
    }

    mapRanges(seedRange: SeedRange): MapRangeResult {


        if (seedRange.rangeEnd <= this.sourceRangeStart ||
            seedRange.rangeStart >= this.sourceRangeEnd
        ) {
            return {
                shiftedRange: undefined,
                untouchedRanges: [seedRange]
            }
        }

        if (seedRange.rangeStart >= this.sourceRangeStart &&
            seedRange.rangeEnd <= this.sourceRangeEnd
        ) {

            return {
                shiftedRange: {
                    type: this.destinationType,
                    rangeStart: seedRange.rangeStart + this.shiftValue,
                    rangeEnd: seedRange.rangeEnd + this.shiftValue,
                    length: seedRange.length
                },
                untouchedRanges: []
            }
        }
        
        let untouchedRanges: SeedRange[] = []

        if (seedRange.rangeStart < this.sourceRangeStart) {
            untouchedRanges.push({
                type: this.destinationType,
                rangeStart: seedRange.rangeStart,
                rangeEnd: this.sourceRangeStart,
                length: this.sourceRangeStart - seedRange.rangeStart,
            })
        }

        if (seedRange.rangeEnd > this.sourceRangeEnd) {
            untouchedRanges.push({
                type: this.destinationType,
                rangeStart: this.sourceRangeEnd,
                rangeEnd: seedRange.rangeEnd,
                length: seedRange.rangeEnd - this.sourceRangeEnd,
            })
        }

        const start = Math.max(seedRange.rangeStart, this.sourceRangeStart) + this.shiftValue
        const end = Math.min(seedRange.rangeEnd, this.sourceRangeEnd) + this.shiftValue
        const length = end - start

        return {
            shiftedRange: {
                type: this.destinationType,
                rangeStart: start,
                rangeEnd: end,
                length
            },
            untouchedRanges
        }        
        
    }
}

type MapRangeResult = {
    shiftedRange: SeedRange | undefined
    untouchedRanges: SeedRange[]
}


type SeedRange = {
    type: string
    rangeStart: number
    // Not inclusive
    rangeEnd: number
    length: number
}

function CreateSeedRange(rawStart: string, rawLength: string) {
    const rangeStart = +rawStart
    const length = +rawLength
    const rangeEnd = rangeStart + length
    return {
        type: 'seed',
        rangeStart,
        rangeEnd,
        length
    }
}


class TheMappingThing {
    fromType: string
    toType: string

    ranges: MapRange[]

    constructor(rawMap: string) {
        const [mappingInfo, ranges] = rawMap.split(" map:\n")

        const types = mappingInfo.split("-to-")
        this.fromType = types[0]
        this.toType = types[1]

        this.ranges = ranges.split("\n").map(r => new MapRange(r, this.fromType, this.toType)).sort((a, b) => a.sourceRangeStart - b.sourceRangeStart)
    }

    mapNumber(number: number): number {
        const range = this.ranges.find((r) => r.isNumberInRange(number))
        if (range) {
            return number + range.shiftValue
        }
        return number
    }
}

export function solve1(input: string): number {
    const rawSections = input.split("\n\n")

    const seeds = rawSections.shift()!.split(": ")[1].split(" ").map(s => +s)

    const maps = rawSections.map(r => new TheMappingThing(r))

    const mapsByToType = maps.reduce((acc, map) => {
        acc[map.fromType] = map;
        return acc;
    }, {} as { [key: string]: TheMappingThing });

    const locations = seeds.map(seed => {
        let nextFromType: string | undefined = "seed"
        let number = seed
        while(nextFromType) {
            const mappingThing = mapsByToType[nextFromType]
            if (!mappingThing) {
                nextFromType = undefined
                continue
            }
            const mappedNumber = mappingThing.mapNumber(number)
            number = mappedNumber
            nextFromType = mappingThing.toType
        }
        return number
    })

    return Math.min(...locations)
}

export function solve2(input: string): number {
    const rawSections = input.split("\n\n")

    const rawSeedRanges = rawSections.shift()!.split(": ")[1].split(" ")
    let seedRanges: SeedRange[] = []
    for (let i = 0; i < rawSeedRanges.length; i += 2) {
        seedRanges.push(CreateSeedRange(rawSeedRanges[i], rawSeedRanges[i+1]))
    }
    seedRanges.sort((a,b) => a.rangeStart - b.rangeStart)


    const maps = rawSections.map(r => new TheMappingThing(r))
    const mapsByFromType = maps.reduce((acc, map) => {
        acc[map.fromType] = map;
        return acc;
    }, {} as { [key: string]: TheMappingThing });
    const mapFromTypeList = maps.map(m => m.fromType)
    
    let mapUnprocessedSeeds = [...seedRanges]
    for (const mapFromType of mapFromTypeList) {
        const map = mapsByFromType[mapFromType]
        let processedSeeds: SeedRange[] = []
        let unprocessedSeeds: SeedRange[] = [...mapUnprocessedSeeds]
        
        for (const mapRange of map.ranges) {
            
            let mapRangeProcessQueue = [...unprocessedSeeds]
            unprocessedSeeds = []
            while (mapRangeProcessQueue.length) {
                const seedToProcess = mapRangeProcessQueue.pop()!

                const mappingResult = mapRange.mapRanges(seedToProcess)
                if (mappingResult.shiftedRange) {
                    processedSeeds.push(mappingResult.shiftedRange)
                }
                if (mappingResult.untouchedRanges.length) {
                    mappingResult.untouchedRanges.forEach(s => unprocessedSeeds.push(s))
                }
            }

            
        }

        mapUnprocessedSeeds = [
            ...processedSeeds,
            ...unprocessedSeeds.map(s => ({...s, type: map.toType}))
        ]

        console.log('mapping processed')
    }



    const result = mapUnprocessedSeeds.sort((a,b) => (a.rangeStart - b.rangeStart))[0].rangeStart
    return result

}