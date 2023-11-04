import AbstractStateful from "./AbstractStateful";
import uuid from "uuidv4"
import MathUtil from "../util/MathUtil";
import GlobalStyles from "../resources/GlobalStyles";

export default abstract class AbstractDraggable extends AbstractStateful<AbstractDraggableProps> implements IDraggable {
    id = uuid()
    isOnDrag = false
    width = 200
    height = GlobalStyles.HEADER_HEIGHT
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
        const XI = coord.x + this.width - GlobalStyles.SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - GlobalStyles.SCALE_BUTTON_SIZE
        return MathUtil.isPointInsideRect(x, y, XI, YI, GlobalStyles.SCALE_BUTTON_SIZE, GlobalStyles.SCALE_BUTTON_SIZE)
    }

    getMinHeight() {
        return GlobalStyles.HEADER_HEIGHT
    }

    getMinWidth() {
        return 10
    }

    checkHeaderClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return MathUtil.isPointInsideRect(x, y, coord.x, coord.y, this.width,  GlobalStyles.HEADER_HEIGHT)
    }

    checkBodyClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return MathUtil.isPointInsideRect(x, y, coord.x, coord.y + GlobalStyles.HEADER_HEIGHT, this.width, this.height - GlobalStyles.HEADER_HEIGHT)
    }

    drawScale() {
        if (!this.resizable)
            return
        const coord = this.getTransformedCoordinates()
        const ctx = this.__canvas.__ctx

        const XI = coord.x + this.width - GlobalStyles.SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - GlobalStyles.SCALE_BUTTON_SIZE
        ctx.beginPath()
        ctx.roundRect(XI, YI, GlobalStyles.SCALE_BUTTON_SIZE, GlobalStyles.SCALE_BUTTON_SIZE, [0, 0, 3, 0])
        ctx.fillStyle = GlobalStyles.borderColor
        ctx.fill()
    }

    abstract drawToCanvas()
}
