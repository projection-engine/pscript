import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type RenderEngine from "./RenderEngine"
import AbstractDraggable from "./AbstractDraggable"
import RendererUtil from "../util/RendererUtil"
import IDraggableUtil from "../util/IDraggableUtil"
import Output from "./Output";
import Input from "./Input";

export default abstract class NodeDraggable extends AbstractDraggable implements INodeDraggable {
    minWidth = 150
    targetCommentID: string | undefined
    outputs: Output[] = []
    inputs: Input[] = []

    constructor(canvas: RenderEngine, x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        super(canvas, x, y, label, colorRGBA)
        this.height = this.getMinHeight()
    }

    getMinHeight(): number {
        const q = Math.max(
            this.outputs.length,
            this.inputs.length
        ) + .5
        return HEADER_HEIGHT + q * (HEADER_HEIGHT - 5)
    }

    checkAgainstIO<T>(x: number, y: number, asInput?: boolean): T {
        const R2 = IO_RADIUS ** 2
        const data = asInput ? this.inputs : this.outputs


        for (let i = 0; i < data.length; i++) {
            let io = data[i];
            if (asInput && (io as Input).disabled) {
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
        RendererUtil.drawNodeHeader(ctx, this)

        for (let j = 0; j < this.outputs.length; j++) {
            const C = this.outputs[j]
            RendererUtil.drawOutput(this, j, C)
        }

        for (let j = 0; j < this.inputs.length; j++) {
            const C = this.inputs[j]
            RendererUtil.drawInput(this, j, C)
        }
        this.drawScale()
    }
}
