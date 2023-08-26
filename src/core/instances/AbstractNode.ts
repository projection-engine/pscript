import type CanvasRenderEngine from "../CanvasRenderEngine"
import AbstractDraggable from "./AbstractDraggable"
import RendererUtil from "../util/RendererUtil"
import IDraggableUtil from "../util/IDraggableUtil"
import NodeType from "./NodeType";

export default abstract class AbstractNode extends AbstractDraggable implements INodeDraggable {
    static IO_RADIUS = 4


    /**
     * IO will query this map
     */
    __properties = new Map<string, any>()
    #minHeight = AbstractDraggable.HEADER_HEIGHT
    outputs: IOutput[] = []
    inputs: IInput[] = []
    abstract nodeType: NodeType


    constructor(props: {
        canvas: IRenderEngine,
        x: number,
        y: number,
        label: string,
        colorRGBA: [number, number, number, number],
        outputs?: IOutput[]
        inputs?: IInput[]
    }) {
        super(props)
        this.outputs = props.outputs ?? this.outputs
        this.inputs = props.inputs ?? this.inputs
        this.height = this.getMinHeight()
        const q = Math.max(
            this.outputs.length,
            this.inputs.length
        ) + .5
        this.#minHeight = this.height = AbstractDraggable.HEADER_HEIGHT + q * (AbstractDraggable.HEADER_HEIGHT - 5)
    }

    getProperty<T>(key): T {
        return this.__properties.get(key) as T
    }

    setProperty(key: string, value: any) {
        this.__properties.set(key, value)
    }

    getMinHeight(): number {
        return this.#minHeight
    }

    checkAgainstIO<T>(x: number, y: number, asInput?: boolean): T {
        const R2 = AbstractNode.IO_RADIUS ** 2
        const data = asInput ? this.inputs : this.outputs


        for (let i = 0; i < data.length; i++) {
            let io = data[i];
            if (io.disabled || asInput && !(io as IInput).visibleOnNode) {
                continue
            }
            const linePosition = IDraggableUtil.getIOPosition(i, this, !asInput)
            const xIO = linePosition.x
            const yIO = linePosition.y

            if ((x - xIO) ** 2 + (y - yIO) ** 2 < R2) {
                return <T>io
            }
        }
    }

    drawToCanvas() {
        const ctx = this.__canvas.ctx
        RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, this.__canvas.getState().rectColor)
        RendererUtil.drawNodeHeader(ctx, <INodeDraggable>this)

        for (let j = 0; j < this.outputs.length; j++) {
            const C = this.outputs[j]
            RendererUtil.drawOutput(<INodeDraggable>this, j, C)
        }

        for (let j = 0; j < this.inputs.length; j++) {
            const C = this.inputs[j]
            if (!C.visibleOnNode)
                continue
            RendererUtil.drawInput(<INodeDraggable>this, j, C)
        }
        this.drawScale()
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
