type Node<T> = {
    value: T
    nextNode: Node<T> | undefined
    previousNode: Node<T> | undefined
}

type Lens = {
    label: string
    value: number
}

type LensNode = Node<Lens>

class Box {
    labelToLensNodeMap: Map<string, LensNode>
    firstNode: LensNode | undefined
    lastNode: LensNode | undefined

    constructor() {
        this.labelToLensNodeMap = new Map()
    }

    processLens(lens: Lens) {
        if (lens.value == 0) {
            return this.removeLens(lens.label)
        }

        const node = this.labelToLensNodeMap.get(lens.label)
        if (node === undefined) {
            return this.addLens(lens)
        }

        // Update the lens
        node.value = lens
    }

    private removeLens(lensLabel: string) {
        const node = this.labelToLensNodeMap.get(lensLabel)
        if (node === undefined) {
            return
        }

        let firstNode = this.firstNode
        let lastNode = this.lastNode

        if (node.previousNode === undefined) {
            firstNode = node.nextNode
            if (firstNode) {
                firstNode.previousNode = undefined
            }
        }

        if (node.nextNode === undefined) {
            lastNode = node.previousNode
            if (lastNode) {
                lastNode.nextNode = undefined
            }
        }

        if (node.previousNode !== undefined && node.nextNode !== undefined) {
            node.previousNode.nextNode = node.nextNode
            node.nextNode.previousNode = node.previousNode
        }

        this.labelToLensNodeMap.delete(lensLabel)

        this.firstNode = firstNode
        this.lastNode = lastNode
    }

    private addLens(lens: Lens) {
        const newNode: LensNode = {
            value: lens,
            previousNode: undefined,
            nextNode: undefined
        }

        this.labelToLensNodeMap.set(lens.label, newNode)
        if (this.lastNode === undefined) {
            this.firstNode = newNode
            this.lastNode = newNode
            return
        }

        this.lastNode.nextNode = newNode
        newNode.previousNode = this.lastNode
        this.lastNode = newNode
    }

    calculateValue(): number {
        let lensCount = 0
        let boxValue = 0

        let nextNode = this.firstNode
        while (nextNode) {
            lensCount++
            boxValue += lensCount * nextNode.value.value

            nextNode = nextNode.nextNode
        }

        return boxValue
    }
}

// Is this what clean code is?
function inputToSteps(input: string): string[] {
    return input.split(',')
}

function inputToBoxNumberAndLens(input: string): [number, Lens][] {
    const steps = inputToSteps(input)

    const output: [number, Lens][] = Array(steps.length)

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        const lens = stepToLens(step)
        output[i] = [theHASH(lens.label), lens]
    }

    return output
}

function theHASH(step: string): number {
    const chars = step.split('')

    let currentValue = 0

    for (const char of chars) {
        currentValue = (currentValue + char.charCodeAt(0)) * 17 % 256
    }

    return currentValue
}

function stepToLens(step: string): Lens {
    if (step.charAt(step.length - 1) === '-') {
        return {
            label: step.substring(0, step.length - 1),
            value: 0
        }
    } 

    const [label, rawValue] = step.split('=')
    
    return {
        label,
        value: +rawValue
    }
}

function sumItUp(previous: number, current: number): number {
    return previous + current
}

function createAllBoxes(): Box[] {
    const boxes = Array<Box>(256)
    for (let i = 0; i < boxes.length; i++) {
        boxes[i] = new Box()
    }
    return boxes
}

export function solve1(input: string): number {
    return inputToSteps(input).map(theHASH).reduce(sumItUp)
}

export function solve2(input: string): number {
    const boxes = createAllBoxes()
    const boxNumbersAndLenses = inputToBoxNumberAndLens(input)

    for (const [boxNumber, lens] of boxNumbersAndLenses) {
        boxes[boxNumber].processLens(lens)
    }

    let result = 0
    for (let i = 0; i < boxes.length; i++) {
        result += boxes[i].calculateValue() * (i + 1) 
    }
    return result
}