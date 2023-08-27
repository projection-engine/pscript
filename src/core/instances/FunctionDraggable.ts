import AbstractDraggable from "./AbstractDraggable";
import CanvasRenderEngine from "../CanvasRenderEngine";
import RendererUtil from "../util/RendererUtil";

export default class FunctionDraggable extends AbstractDraggable implements IFunctionDraggable {
    collapsed = false

    static of(props: AbstractDraggableProps) {
        const instance = new FunctionDraggable()
        instance.from(props)
        return instance
    }

    from(props: AbstractDraggableProps) {
        super.from(props)
        this.height = 200
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        if(!this.collapsed) {
            RendererUtil.drawRoundedRect(ctx, this, 3, this.__canvas.__selectionMap.get(this.id) !== undefined, this.__canvas.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
        }
        RendererUtil.drawDraggableHeader(ctx, this)
        this.#drawCollapseButton()
        this.drawScale()
    }

    #drawCollapseButton(){
        const ctx = this.__canvas.__ctx
        const state = this.__canvas.getState()


    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
