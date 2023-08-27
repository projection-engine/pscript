import AbstractStateful from "./AbstractStateful";
import uuid from "uuidv4"
import MathUtil from "../util/MathUtil";

export default abstract class AbstractDraggable extends AbstractStateful<AbstractDraggableProps> implements IDraggable {
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
        return MathUtil.isPointInsideRect(x, y, XI, YI, AbstractDraggable.SCALE_BUTTON_SIZE, AbstractDraggable.SCALE_BUTTON_SIZE)
    }

    getMinHeight() {
        return AbstractDraggable.HEADER_HEIGHT
    }

    getMinWidth() {
        return 10
    }

    checkHeaderClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return MathUtil.isPointInsideRect(x, y, coord.x, coord.y, this.width,  AbstractDraggable.HEADER_HEIGHT)
    }

    checkBodyClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return MathUtil.isPointInsideRect(x, y, coord.x, coord.y + AbstractDraggable.HEADER_HEIGHT, this.width, this.height - AbstractDraggable.HEADER_HEIGHT)
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
