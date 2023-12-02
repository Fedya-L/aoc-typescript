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

    readInput(): string {
        const filePath = `${this.folderPath}input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readAnswer1(): number {
        const filePath = `${this.folderPath}answer_1.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readAnswer2(): number {
        const filePath = `${this.folderPath}answer_2.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readSampleInput(): string {
        const filePath = `${this.folderPath}sample_input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readSampleInput2(): string {
        const filePath = `${this.folderPath}sample_input_2.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readSampleAnswer1(): number {
        const filePath = `${this.folderPath}sample_answer_1.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readSampleAnswer2(): number {
        const filePath = `${this.folderPath}sample_answer_2.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }
}

export { Reader }
