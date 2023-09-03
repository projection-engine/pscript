import RendererUtil from "../util/RendererUtil"
import AbstractDraggable from "./AbstractDraggable"


export default class CommentDraggable extends AbstractDraggable implements ICommentDraggable {
    static of(props: AbstractDraggableProps) {
        const instance = new CommentDraggable()
        instance.from(props)
        return instance
    }

    from(props: AbstractDraggableProps) {
        super.from(props)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        const state = this.__canvas.getState()
        RendererUtil.drawDraggableBody(ctx, this, 3, state.selected.get(this.id) !== undefined, state.lastSelection === this, `rgba(${this.colorRGBA[0]}, ${this.colorRGBA[1]}, ${this.colorRGBA[2]}, .5)`)
        RendererUtil.drawDraggableHeader(ctx, this)
        this.drawScale()
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
