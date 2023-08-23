interface IRenderEngine {
    observer: MutationObserver,
    stop: VoidFunction
}

interface IDraggable {
    id: string;
    isOnDrag: boolean;

}

interface IBend {
    x: number,
    y: number
}

interface ILink {
    input: IInput,
    output: IOutput,
    targetNode: IDraggable,
    sourceNode: IDraggable,
    bends: IBend[]
}

interface Action {
    toRemove: string[]
    toAdd: MutableObject[]
}

interface IO {
    __properties: Map<string, any>,
    setProperty: (key: string, value: any) => void,
    getProperty: <T>(key: string) => T,
    getColor: () => [number, number, number]
}

interface IOutput extends IO {
    disabled: boolean;
    label: string
    key: string
}

interface IInput extends IO {
    onChange?: Function
    label: string
    key: string
    accept?: string[]
    type?: string
    disabled?: boolean,
}

interface RendererState<T> {
    getId: GenericNonVoidFunction<string>,
    links: ILink[],
    nodes: IDraggable[],
    needsUpdate: boolean,
    getInstance: () => T,
    offsetX: number,
    offsetY: number,
    grid: number,
    scale: number,
    backgroundColor: string,
    rectColor: string,
    borderColor: string
}

