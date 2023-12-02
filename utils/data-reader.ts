import { readFileSync, readSync } from "fs"

export function readInput(year: number, day: number, sample: boolean): string {
    const path = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/${sample ? 'sample_' : ''}input.txt`
    return readFileSync(path).toString().trimEnd()
}

export function readAnswer(year: number, day: number, task: number, sample: boolean): number {
    const path = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/${sample ? 'sample_' : ''}answer_${task}.txt`
    return parseInt(readFileSync(path).toString().trimEnd())
}

class Reader {
    year: number
    day: number

    private folderPath: string

    constructor(year: number, day: number) {
        this.year = year
        this.day = day

        this.folderPath = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/`
    }

    readSampleInput2(): string {
        const filePath = `${this.folderPath}sample_input_2.txt`
        return readFileSync(filePath).toString().trimEnd()
    }
}

export { Reader }
