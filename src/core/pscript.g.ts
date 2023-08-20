interface Action {
    toRemove: string[]
    toAdd: MutableObject[]
}

interface Output {
    [key: string]: any

    label: string
    key: string
    type: string
}

interface Input {
    [key: string]: any

    onChange?: Function
    label: string
    key: string
    accept?: string[]
    type?: string
    disabled?: boolean
}
