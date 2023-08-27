import AbstractDraggable from "./AbstractDraggable"
import RendererUtil from "../util/RendererUtil"
import IDraggableUtil from "../util/IDraggableUtil"
import NodeType from "./NodeType";
import ExecutionOutput from "./ExecutionOutput";
import ExecutionInput from "./ExecutionInput";

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
                isValid = AbstractNode.#isPointInsideTriangle(x, y, positions)
            } else if (io instanceof ExecutionOutput) {
                const positions = AbstractNode.#getTrianglePoints(linePosition.x - AbstractNode.IO_RADIUS, linePosition.y)
                isValid = AbstractNode.#isPointInsideTriangle(x, y, positions)
            } else {
                isValid = ((x - linePosition.x) ** 2 + (y - linePosition.y) ** 2 < R2)
            }
            if (isValid)
                return <T>io
        }
    }

    static #areaOfTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }

    static #isPointInsideTriangle(x: number, y: number, positions: [number, number, number, number, number, number]): boolean {
        const x1 = positions[0], y1 = positions[1],
            x2 = positions[2], y2 = positions[3],
            x3 = positions[4], y3 = positions[5]

        const A = AbstractNode.#areaOfTriangle(x1, y1, x2, y2, x3, y3);
        const A1 = AbstractNode.#areaOfTriangle(x, y, x2, y2, x3, y3);
        const A2 = AbstractNode.#areaOfTriangle(x1, y1, x, y, x3, y3);
        const A3 = AbstractNode.#areaOfTriangle(x1, y1, x2, y2, x, y);
        return (A === A1 + A2 + A3);
    }

    static #getTrianglePoints(startX: number, startY: number): [number, number, number, number, number, number] {
        const X = startX - RendererUtil.EXECUTION_IO_SIZE
        return [startX, startY, X, startY + RendererUtil.EXECUTION_IO_SIZE, X, startY - RendererUtil.EXECUTION_IO_SIZE]
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.__selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, this.__canvas.getState().rectColor)
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
