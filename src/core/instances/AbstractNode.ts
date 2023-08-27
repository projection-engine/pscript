import AbstractDraggable from "./AbstractDraggable"
import RendererUtil from "../util/RendererUtil"
import IDraggableUtil from "../util/IDraggableUtil"
import NodeType from "./NodeType";
import ExecutionOutput from "./ExecutionOutput";
import ExecutionInput from "./ExecutionInput";
import MathUtil from "../util/MathUtil";
import SelectionStore from "../libs/SelectionStore";

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


    from(props: NodeProps) {
        super.from(props)
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
            let isValid = false
            const linePosition = IDraggableUtil.getIOPosition(i, this, !asInput)
            if (io instanceof ExecutionInput) {
                const startX = linePosition.x + AbstractNode.IO_RADIUS * 3
                const positions = AbstractNode.#getTrianglePoints(startX, linePosition.y)
                isValid = MathUtil.isPointInsideTriangle(x, y, positions)
            } else if (io instanceof ExecutionOutput) {
                const positions = AbstractNode.#getTrianglePoints(linePosition.x - AbstractNode.IO_RADIUS, linePosition.y)
                isValid = MathUtil.isPointInsideTriangle(x, y, positions)
            } else {
                isValid = MathUtil.isPointInsideCircle(x, y, linePosition.x, linePosition.y, R2)
            }
            if (isValid)
                return <T>io
        }
    }

    static #getTrianglePoints(startX: number, startY: number): [number, number, number, number, number, number] {
        const X = startX - RendererUtil.EXECUTION_IO_SIZE
        return [startX, startY, X, startY + RendererUtil.EXECUTION_IO_SIZE, X, startY - RendererUtil.EXECUTION_IO_SIZE]
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        RendererUtil.drawDraggableBody(ctx, this, 3, SelectionStore.getSelectionMap().get(this.id) !== undefined, SelectionStore.getLastSelection() === this, this.__canvas.getState().rectColor)
        RendererUtil.drawDraggableHeader(ctx, this)

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
