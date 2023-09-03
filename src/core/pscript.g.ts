interface IFunctionNode {

}

type ColorRGBA = [number, number, number, number]

interface IVariableNode extends INodeDraggable {
    _variable: IVariable;
    getVariable: () => IVariable
}

interface ISerializable<T> {
    from(props: T)
}

interface VariableProps extends NodeProps {
    variable: IVariable
}

type NodeProps = {
    canvas: IRenderEngine;
    x: number;
    y: number;
    label: string;
    colorRGBA: ColorRGBA;
    outputs?: IOutput[];
    inputs?: IInput[];
}

type AbstractDraggableProps = {
    canvas: IRenderEngine;
    x: number;
    y: number;
    label: string;
    colorRGBA: ColorRGBA;
}

interface IRenderEngine {
    __observer: ResizeObserver;
    stop: VoidFunction;
    __ctx: CanvasRenderingContext2D;

    getState(): RendererState<any>;
}

interface IStateful extends ISerializable<any> {
    __properties: Map<string, any>;
    setProperty: (key: string, value: any) => void;
    getProperty: <T>(key: string) => T;
    colorRGBA: ColorRGBA;
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

interface ILink extends ISerializable<any> {
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
    getType(): string

    getColor(): ColorRGBA
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

interface IVariable {
    _name: string;
    _type: IType;

    getName(): string

    getType(): IType
}

/**
 * Should act like a function scope
 */
type RendererState<T> = {
    getId: GenericNonVoidFunction<string>,
    links: ILink[],
    nodes: INodeDraggable[],
    functions: IFunctionDraggable[],
    comments: ICommentDraggable[],
    variables: IVariable[],

    needsUpdate: boolean,
    getInstance: () => T,
    offsetX: number,
    offsetY: number,
    grid: number,
    scale: number,
    defaultTextSize: number,
    smallTextSize: number,
    tempLinkCoords: {
        x: number,
        y: number,
        startX: number,
        startY: number,
        color: string
    },
    drawTempLink: boolean,

    selected: Map<string, IDraggable>,
    lastSelection: IDraggable,
    variableNames: { [key: string]: boolean }
}

