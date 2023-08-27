import AbstractStateful from "./AbstractStateful";
import uuid from "uuidv4"

export default abstract class AbstractDraggable extends AbstractStateful<{
    canvas: IRenderEngine,
    x: number,
    y: number,
    label: string,
    colorRGBA: [number, number, number, number]
}> implements IDraggable {
    static HEADER_HEIGHT = 25
    static SCALE_BUTTON_SIZE = 10

    id = uuid()
    isOnDrag = false
    width = 200
    height = AbstractDraggable.HEADER_HEIGHT
    x: number
    y: number
    label: string
    __canvas: IRenderEngine
    resizable = true

    from(props) {
        super.fromValue(props.colorRGBA);
        this.__canvas = props.canvas
        this.label = props.label
        this.x = props.x
        this.y = props.y
    }

    getTransformedCoordinates(): { x: number, y: number } {
        const state = this.__canvas.getState()
        return {x: this.x + state.offsetX, y: this.y + state.offsetY}
    }

    checkAgainstScale(x: number, y: number): boolean {
        if (!this.resizable)
            return false
        const coord = this.getTransformedCoordinates()
        const XI = coord.x + this.width - AbstractDraggable.SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - AbstractDraggable.SCALE_BUTTON_SIZE

        const XF = XI + AbstractDraggable.SCALE_BUTTON_SIZE
        const YF = YI + AbstractDraggable.SCALE_BUTTON_SIZE

        return x >= XI && x < XF && y >= YI && y < YF
    }

    getMinHeight() {
        return AbstractDraggable.HEADER_HEIGHT
    }

    getMinWidth() {
        return 10
    }

    checkHeaderClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return x >= coord.x && x < coord.x + this.width && y >= coord.y && y < coord.y + AbstractDraggable.HEADER_HEIGHT
    }

    checkBodyClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        const XI = coord.x - 4, XF = coord.x + 4 + this.width
        const YI = coord.y + AbstractDraggable.HEADER_HEIGHT, YF = YI + this.height - AbstractDraggable.HEADER_HEIGHT
        return x >= XI && x < XF && y >= YI && y < YF
    }

    drawScale() {
        if (!this.resizable)
            return
        const coord = this.getTransformedCoordinates()
        const state = this.__canvas.getState()
        const ctx = this.__canvas.__ctx

        const XI = coord.x + this.width - AbstractDraggable.SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - AbstractDraggable.SCALE_BUTTON_SIZE
        ctx.beginPath()
        ctx.roundRect(XI, YI, AbstractDraggable.SCALE_BUTTON_SIZE, AbstractDraggable.SCALE_BUTTON_SIZE, [0, 0, 3, 0])
        ctx.fillStyle = state.borderColor
        ctx.fill()
    }

    abstract drawToCanvas()
}
