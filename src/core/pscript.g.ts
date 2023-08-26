interface IRenderEngine {
    observer: ResizeObserver,
    stop: VoidFunction,

    getState(): RendererState<any>
}

interface IDraggable {
    y: number;
    x: number;
    height: number;
    width: number;
    __canvas: IRenderEngine;
    id: string;
    isOnDrag: boolean;

    drawToCanvas(): void;

    getTransformedCoordinates(): { x: number, y: number };

    getMinWidth(): number;

    getMinHeight(): number;
}

interface INodeDraggable extends IDraggable {
}

interface ICommentDraggable extends IDraggable {
}

interface IFunctionDraggable extends IDraggable {
}

interface IBend {
    x: number,
    y: number
}

interface ILink {
    input: IInput,
    output: IOutput,
    targetNode: INodeDraggable,
    sourceNode: INodeDraggable,
    bends: IBend[]
}

interface Action {
    toRemove: string[]
    toAdd: MutableObject[]
}

interface IOType {
    getType: () => string
}

interface IO {
    __properties: Map<string, any>,
    setProperty: (key: string, value: any) => void,
    getProperty: <T>(key: string) => T,
    getColor: () => [number, number, number]
}

interface IOutput extends IO {
    type: IOType;
    disabled: boolean;
    label: string
    key: string
}

interface IInput extends IO {
    onChange?: Function,
    label: string,
    key: string,
    accept: IOType[],
    disabled: boolean
}


interface RendererState<T> {
    getId: GenericNonVoidFunction<string>,
    links: ILink[],
    nodes: INodeDraggable[],
    functions: IFunctionDraggable[],
    comments: ICommentDraggable[],

    needsUpdate: boolean,
    getInstance: () => T,
    offsetX: number,
    offsetY: number,
    grid: number,
    scale: number,
    backgroundColor: string,
    rectColor: string,
    borderColor: string,
    defaultTextSize: number,
    smallTextSize: number,
    defaultFont: string,
    smallFont: string,
    textColor: string,
    firstSelectionColor: string,
    multiSelectionColor: string,
    ioTextColor: string,
}

