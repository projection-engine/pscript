interface IRenderEngine {
    lastSelection: IDraggable;
    selectionMap: Map<string, IDraggable>;
    observer: ResizeObserver;
    stop: VoidFunction;
    ctx: CanvasRenderingContext2D;

    getState(): RendererState<any>;
}

interface IStateful {
    __properties: Map<string, any>;
    setProperty: (key: string, value: any) => void;
    getProperty: <T>(key: string) => T;
    colorRGBA: [number, number, number, number];
}

interface IDraggable extends IStateful {

    y: number;
    x: number;
    height: number;
    width: number;
    __canvas: IRenderEngine;
    id: string;
    isOnDrag: boolean;
    label: string;

    drawToCanvas(): void;

    getTransformedCoordinates(): { x: number, y: number };

    getMinWidth(): number;

    getMinHeight(): number;
}

interface INodeDraggable extends IDraggable {
    outputs: IOutput[]
    inputs: IInput[]
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

interface IAction {
    toRemove: string[]
    toAdd: MutableObject[]
}

interface IType {
    getType: () => string
}


interface IOutput extends IStateful {
    type: IType;
    disabled: boolean;
    label: string
    key: string
    hideLabel: boolean;
}

interface IInput extends IStateful {
    hideLabel: boolean;
    label: string,
    key: string,
    accept: IType[],
    disabled: boolean,
    visibleOnNode: boolean

    acceptsType(type: IType): boolean;
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
    tempLinkCoords: {
        x: number,
        y: number,
        startX: number,
        startY: number,
        color: string
    },
    drawTempLink: boolean
    executionIOColor: string
}

