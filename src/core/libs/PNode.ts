import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type PScriptCanvas from "./PScriptCanvas"
import AbstractPDraggable from "./AbstractPDraggable"
import CanvasRenderer from "./CanvasRenderer"
import DraggableNodeUtils from "./DraggableNodeUtils"
import CanvasResources from "./CanvasResources"

export default class PNode extends AbstractPDraggable {
    minWidth = 150
    targetCommentID: string | undefined
    output: Output[] = []
    inputs: Input[] = []

    constructor(canvas: PScriptCanvas, x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        super(canvas, x, y, label, colorRGBA)
        const q = Math.max(
            this.output.length,
            this.inputs.length
        ) + .5
        this.minHeight = this.height = HEADER_HEIGHT + q * (HEADER_HEIGHT - 5)
    }

    checkAgainstIO<T>(x: number, y: number, asInput?: boolean): T {
        const R2 = IO_RADIUS ** 2
        const data = asInput ? this.inputs : this.output


        for (let i = 0; i < data.length; i++) {
            if (data[i].disabled)
                continue
            const linePosition = DraggableNodeUtils.getIOPosition(i, this, !asInput)
            const xIO = linePosition.x
            const yIO = linePosition.y

            if ((x - xIO) ** 2 + (y - yIO) ** 2 < R2)
                return <T>data[i]
        }
    }

    drawToCanvas() {
        const ctx = this.__canvas.ctx
        CanvasRenderer.drawRoundedRect(ctx, this, 3, this.__canvas.selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, CanvasResources.rectColor)
        CanvasRenderer.drawNodeHeader(ctx, this)

        for (let j = 0; j < this.output.length; j++) {
            const C = this.output[j]
            CanvasRenderer.drawIO(ctx, true, this, j, C)
        }

        for (let j = 0; j < this.inputs.length; j++) {
            const C = this.inputs[j]
            CanvasRenderer.drawIO(ctx, false, this, j, C)
        }
        this.drawScale()
    }
}
