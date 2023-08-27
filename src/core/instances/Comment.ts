import type CanvasRenderEngine from "../CanvasRenderEngine"
import RendererUtil from "../util/RendererUtil"
import AbstractDraggable from "./AbstractDraggable"


export default class Comment extends AbstractDraggable implements ICommentDraggable {
    static of(props: CommentProps) {
        const instance = new Comment()
        instance.from(props)
        return instance
    }

    from(props: CommentProps) {
        super.from(props)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.__selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        RendererUtil.drawDraggableHeader(ctx, this)
        this.drawScale()
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
