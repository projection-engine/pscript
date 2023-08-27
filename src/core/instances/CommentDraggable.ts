import type CanvasRenderEngine from "../CanvasRenderEngine"
import RendererUtil from "../util/RendererUtil"
import AbstractDraggable from "./AbstractDraggable"
import SelectionStore from "../libs/SelectionStore";


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
        RendererUtil.drawDraggableBody(ctx, this, 3, SelectionStore.getSelectionMap().get(this.id) !== undefined, SelectionStore.getLastSelection() === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        RendererUtil.drawDraggableHeader(ctx, this)
        this.drawScale()
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
