
class MapRange {
    sourceRangeStart: number
    // Not inclusive
    sourceRangeEnd: number
    destinationRangeStart: number
    // Not inclusive
    destinationRangeEnd: number
    rangeLength: number
    shiftValue: number

    constructor(rawRange: string) {
        const [st, sf, len] = rawRange.split(" ")
        this.sourceRangeStart = +sf
        this.destinationRangeStart = +st
        this.rangeLength = +len
        this.shiftValue = this.destinationRangeStart - this.sourceRangeStart

        this.sourceRangeEnd = this.sourceRangeStart + this.rangeLength
        this.destinationRangeEnd = this.destinationRangeStart + this.rangeLength
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
                rangeStart: seedRange.rangeStart,
                rangeEnd: this.sourceRangeStart,
                length: this.sourceRangeStart - seedRange.rangeStart,
            })
        }

        if (seedRange.rangeEnd > this.sourceRangeEnd) {
            const length = this.sourceRangeEnd - seedRange.rangeEnd
            untouchedRanges.push({
                rangeStart: this.sourceRangeEnd,
                rangeEnd: seedRange.rangeEnd,
                length,
            })
        }

        const start = Math.max(seedRange.rangeStart, this.sourceRangeStart) + this.shiftValue
        const end = Math.min(seedRange.rangeEnd, this.sourceRangeEnd) + this.shiftValue
        const length = end - start

        return {
            shiftedRange: {
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

        this.ranges = ranges.split("\n").map(r => new MapRange(r))
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

    

    return -1
}