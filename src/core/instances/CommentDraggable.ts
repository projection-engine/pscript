import type RenderEngine from "./RenderEngine"
import RendererUtil from "../util/RendererUtil"
import AbstractDraggable from "./AbstractDraggable"


export default class CommentDraggable extends AbstractDraggable implements ICommentDraggable{
    constructor(canvas: RenderEngine, x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        super(canvas, x, y, label, colorRGBA)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.ctx
        RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        RendererUtil.drawNodeHeader(ctx, this)
        this.drawScale()
    }
}
