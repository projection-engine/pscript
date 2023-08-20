import type PNode from "./PNode"
import type PScriptCanvas from "./PScriptCanvas"
import CanvasRenderer from "./CanvasRenderer"
import AbstractPDraggable from "./AbstractPDraggable"


export default class PComment extends AbstractPDraggable {
    constructor(canvas: PScriptCanvas, x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        super(canvas, x, y, label, colorRGBA)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.ctx
        CanvasRenderer.drawRoundedRect(ctx, this, 3, this.__canvas.selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        CanvasRenderer.drawNodeHeader(ctx, this)
        this.drawScale()
    }
}
