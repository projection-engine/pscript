import type CanvasRenderEngine from "../CanvasRenderEngine"
import RendererUtil from "../util/RendererUtil"
import AbstractDraggable from "./AbstractDraggable"


export default class Comment extends AbstractDraggable implements ICommentDraggable{
    constructor(props: {
        canvas: CanvasRenderEngine,
        x: number,
        y: number,
        label: string,
        colorRGBA: [number, number, number, number]
    }) {
        super(props)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.ctx
        RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        RendererUtil.drawDraggableHeader(ctx, this)
        this.drawScale()
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
