import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type PScriptCanvas from "./PScriptCanvas"
import AbstractPDraggable from "./AbstractPDraggable"
import CanvasRenderer from "./CanvasRenderer"
import DraggableNodeUtils from "./DraggableNodeUtils"
import CanvasResources from "./CanvasResources"

export default class PNode extends AbstractPDraggable {
    static signature = "PNode"

    getSignature(): string {
        return PNode.signature
    }

    minWidth = 150
    uniform = false
    targetCommentID: string | undefined
    uniformName: string
    output: Output[] = []
    inputs: Input[] = []

    constructor(x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        super(x, y, label, colorRGBA)
        this.uniformName = "DYNAMIC_" + this.id.replaceAll("-", "_")
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

    drawToCanvas(ctx: CanvasRenderingContext2D, canvasAPI: PScriptCanvas) {
        CanvasRenderer.drawRoundedRect(ctx, this, 3, canvasAPI.selectionMap.get(this.id) !== undefined, canvasAPI.lastSelection === this, CanvasResources.rectColor)
        CanvasRenderer.drawNodeHeader(ctx, this)

        for (let j = 0; j < this.output.length; j++) {
            const C = this.output[j]
            CanvasRenderer.drawIO(ctx, true, this, j, C)
        }

        for (let j = 0; j < this.inputs.length; j++) {
            const C = this.inputs[j]
            CanvasRenderer.drawIO(ctx, false, this, j, C)
        }
        this.drawScale(ctx)
    }
}
