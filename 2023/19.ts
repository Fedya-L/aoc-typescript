type Part = {
    x: number
    s: number
    a: number
    m: number
}

type Workflow = {
    identifier: string
    rules: Rule[]
}

type Workflows = Map<string, Workflow>

type Rule = {
    category: string
    shouldBeBigger: boolean
    value: number
    target: string
}

const rawPartToPart = (rawPart: string): Part => {
    const trimmed = rawPart.slice(1, rawPart.length - 1)
    const rawCategories = trimmed.split(',')
    
    let part = {}

    for (const rawCategory of rawCategories) {
        const [category, rawValue] = rawCategory.split('=')

        part[category] = +rawValue
    }

    return part as Part
}

const rawRuleToRule = (rawRule: string): Rule => {
    
    let split = rawRule.split(':')

    if (split.length == 1) {
        return {
            category: 'a',
            shouldBeBigger: true,
            value: 0,
            target: split[0]   
        }
    }

    const target = split[1]

    split = split[0].split('>')
    let shouldBeBigger = split.length == 2

    if (split.length == 1) {
        split = split[0].split('<')
    }

    return {
        category: split[0],
        shouldBeBigger,
        value: +split[1],
        target,
    }
  
}

const rawWorkflowToWorkflow = (rawWorkflow: string): Workflow => {
    const [identifier, rawRules] = rawWorkflow.slice(0, rawWorkflow.length - 1).split('{')

    const rules = rawRules.split(',').map(rawRuleToRule)

    return {
        identifier,
        rules,
    }
}

const inputToWorkflowsAndParts = (input: string): [Map<string, Workflow>, Part[]] => {
    let workflows = new Map<string, Workflow>()
    let parts: Part[] = []

    const [rawWorkflows, rawParts] = input.split("\n\n")

    parts = rawParts.split("\n").map(rawPartToPart)
    
    const workflowsArray = rawWorkflows.split("\n").map(rawWorkflowToWorkflow)
    for (const w of workflowsArray) {
        workflows.set(w.identifier, w)
    }

    return [workflows, parts]
}

export const solve1 = (input: string): number => {
    const [workflows, parts] = inputToWorkflowsAndParts(input)

    let acceptedParts: Part[] = []

    for (const p of parts) {
        let wId = 'in'
        let inProgress = true

        while (inProgress) {
            let workflow = workflows.get(wId)!
            for (const r of workflow.rules) {
                if (r.shouldBeBigger && p[r.category] > r.value) {
                    wId = r.target
                    break
                } 
                if (!r.shouldBeBigger && p[r.category] < r.value) {
                    wId = r.target
                    break
                }
            }

            if (wId === 'A') {
                inProgress = false   
                acceptedParts.push(p)
            }
            if (wId === 'R') {
                inProgress = false
            }
        }
    }


    const result = acceptedParts.map(p => p.x + p.m + p.a + p.s).reduce((p,c) => p + c, 0)
    return result
}

export const solve2 = (input: string): number => {
    return -2
}