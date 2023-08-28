import AbstractDraggable from "./AbstractDraggable";
import CanvasRenderEngine from "../CanvasRenderEngine";
import RendererUtil from "../util/RendererUtil";
import MathUtil from "../util/MathUtil";
import SelectionStore from "../libs/SelectionStore";

export default class FunctionDraggable extends AbstractDraggable implements IFunctionDraggable {
    collapsed = false
    #darkerColor: string;

    static of(props: AbstractDraggableProps) {
        const instance = new FunctionDraggable()
        instance.from(props)
        return instance
    }

    from(props: AbstractDraggableProps) {
        super.from(props)
        this.height = 200
        this.#darkerColor = `rgba(${this.colorRGBA[0] * .85},${this.colorRGBA[1] * .85},${this.colorRGBA[2] * .85},1)`
    }

    drawToCanvas() {
        const ctx = this.__canvas.__ctx
        if (!this.collapsed) {
            RendererUtil.drawDraggableBody(
                ctx,
                this,
                3,
                SelectionStore.getFocusedFunction() === this.id || SelectionStore.getSelectionMap().get(this.id) !== undefined,
                SelectionStore.getLastSelection() === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
            this.drawScale()
        }
        RendererUtil.drawDraggableHeader(ctx, this, this.collapsed ? 3 : undefined)
        this.#drawCollapseButton()
    }

    #drawCollapseButton() {
        const ctx = this.__canvas.__ctx

        const coord = this.getTransformedCoordinates()
        const offset = AbstractDraggable.HEADER_HEIGHT * .1
        const size = AbstractDraggable.HEADER_HEIGHT * .75
        const XI = coord.x + this.width - size - offset
        const YI = coord.y + offset

        ctx.fillStyle = this.#darkerColor
        RendererUtil.drawRoundedRect(ctx, XI, YI, size, size, 3)
    }

    checkAgainstCollapse(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        const offset = AbstractDraggable.HEADER_HEIGHT * .1
        const size = AbstractDraggable.HEADER_HEIGHT * .75
        const XI = coord.x + this.width - size - offset
        const YI = coord.y + offset
        return MathUtil.isPointInsideRect(x, y, XI, YI, size, size)
    }

    getInitialProperties(): MutableObject | undefined {
        return undefined;
    }
}
