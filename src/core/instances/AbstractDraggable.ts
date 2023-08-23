import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import SCALE_BUTTON_SIZE from "../resources/SCALE_BUTTON_SIZE"
import CanvasResources from "../libs/CanvasResources"
import RenderEngine from "./RenderEngine";
import PScriptRendererState from "../libs/PScriptRendererState";

export default abstract class AbstractDraggable implements IDraggable {
    id = crypto.randomUUID()
    isOnDrag = false
    width = 200
    height = HEADER_HEIGHT
    x: number
    y: number
    label: string
    colorRGBA: [number, number, number, number]
    __canvas: RenderEngine

    protected constructor(canvas: RenderEngine, x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
        this.__canvas = canvas
        this.label = label
        this.colorRGBA = colorRGBA
        this.x = x
        this.y = y
    }

    getTransformedCoordinates(): { x: number, y: number } {
        const state = this.__canvas.getState()
        return {x: this.x + state.offsetX, y: this.y + state.offsetY}
    }

    checkAgainstScale(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        const XI = coord.x + this.width - SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - SCALE_BUTTON_SIZE

        const XF = XI + SCALE_BUTTON_SIZE
        const YF = YI + SCALE_BUTTON_SIZE

        return x >= XI && x < XF && y >= YI && y < YF
    }

    getMinHeight() {
        return HEADER_HEIGHT
    }

    getMinWidth() {
        return 10
    }

    checkHeaderClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        return x >= coord.x && x < coord.x + this.width && y >= coord.y && y < coord.y + HEADER_HEIGHT
    }

    checkBodyClick(x: number, y: number): boolean {
        const coord = this.getTransformedCoordinates()
        const XI = coord.x - 4, XF = coord.x + 4 + this.width
        const YI = coord.y + HEADER_HEIGHT, YF = YI + this.height - HEADER_HEIGHT
        return x >= XI && x < XF && y >= YI && y < YF
    }

    drawScale() {
        const coord = this.getTransformedCoordinates()
        const state = this.__canvas.getState()
        const ctx = this.__canvas.ctx

        const XI = coord.x + this.width - SCALE_BUTTON_SIZE
        const YI = coord.y + this.height - SCALE_BUTTON_SIZE
        ctx.beginPath()
        ctx.roundRect(XI, YI, SCALE_BUTTON_SIZE, SCALE_BUTTON_SIZE, [0, 0, 3, 0])
        ctx.fillStyle = state.borderColor
        ctx.fill()
    }

    abstract drawToCanvas()
}
