import type NodeDraggable from "../instances/NodeDraggable"
import IO_RADIUS from "../resources/IO_RADIUS"
import type Link from "../instances/Link"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import IDraggableUtil from "./IDraggableUtil"
import AbstractDraggable from "../instances/AbstractDraggable";
import RenderEngine from "../instances/RenderEngine";
import Output from "../instances/Output";
import Input from "../instances/Input";


export default class RendererUtil {

    static #LABEL_OFFSET = 13

    static drawBezierCurve(ctx: CanvasRenderingContext2D, x1, x2, y1, y2) {
        const diff = Math.abs((x1 - x2) / 2)
        const pivot = Math.min(x1, x2) + diff

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(pivot, y1, pivot, y2, x2, y2)
        ctx.stroke()
    }

    static drawInput(node: NodeDraggable, index: number, attribute: IInput) {
        const ctx = node.__canvas.ctx
        const state = node.__canvas.getState()

        ctx.font = state.smallFont
        ctx.strokeStyle = state.borderColor

        let label = attribute.label
        const linePosition = IDraggableUtil.getIOPosition(index, node, false)

        let X = linePosition.x
        const Y = linePosition.rowY
        const YA = linePosition.y

        ctx.beginPath()
        ctx.fillStyle = IDraggableUtil.getIOColor(attribute, attribute.disabled)
        ctx.lineWidth = .5
        ctx.arc(X, YA, IO_RADIUS, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        X -= state.smallTextSize
        ctx.fillStyle = state.ioTextColor
        let X_P = X + this.#LABEL_OFFSET
        ctx.fillText(label, X_P, Y - state.smallTextSize / 2)
        ctx.closePath()
    }

    static drawOutput(node: NodeDraggable, index: number, attribute: IOutput) {
        const ctx = node.__canvas.ctx
        const state = node.__canvas.getState()

        ctx.font = state.smallFont
        ctx.strokeStyle = state.borderColor

        let label = attribute.label
        const linePosition = IDraggableUtil.getIOPosition(index, node, true)

        let X = linePosition.x
        const Y = linePosition.rowY
        const YA = linePosition.y
        const labelSize = state.smallTextSize * label.length + this.#LABEL_OFFSET

        ctx.beginPath()
        ctx.fillStyle = IDraggableUtil.getIOColor(attribute, false)
        ctx.lineWidth = .5
        ctx.arc(X, YA, IO_RADIUS, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        X -= state.smallTextSize * 2
        ctx.fillStyle = state.ioTextColor
        ctx.fillText(label, X - labelSize + this.#LABEL_OFFSET, Y - state.smallTextSize / 2)
        ctx.closePath()
    }

    static drawDraggablePosition(ctx: CanvasRenderingContext2D, draggable: IDraggable) {
        const state = draggable.__canvas.getState()

        ctx.font = state.defaultFont
        const coord = draggable.getTransformedCoordinates()
        const TEXT = `X ${coord.x} Y ${coord.y} W ${draggable.width} H ${draggable.height}`
        let Y = coord.y - 10
        if (Y < 0)
            Y = coord.y + draggable.height + 10
        ctx.beginPath()
        ctx.fillStyle = state.textColor
        ctx.fillText(TEXT, coord.x, Y)

    }

    static drawLink(ctx: CanvasRenderingContext2D, link: Link) {

        const T = link.targetNode, S = link.sourceNode
        const coordS = S.getTransformedCoordinates()
        const coordT = T.getTransformedCoordinates()
        const x1 = coordS.x + S.width, x2 = coordT.x,
            y1 = coordS.y + HEADER_HEIGHT + IO_RADIUS * 3 + S.outputs.indexOf(link.output) * 20,
            y2 = coordT.y + HEADER_HEIGHT + IO_RADIUS * 3 + T.inputs.indexOf(link.input) * 20

        const isSomeoneDisabled = link.output.disabled || link.input.disabled
        ctx.strokeStyle = IDraggableUtil.getIOColor(link.output, isSomeoneDisabled)

        RendererUtil.drawBezierCurve(ctx, x1, x2, y1, y2)
    }

    static drawTempLink(event: MouseEvent, parentElement, parentBBox: DOMRect, canvasAPI: RenderEngine) {
        const state = canvasAPI.getState()
        state.tempLinkCoords.x = (event.clientX - parentBBox.x + parentElement.scrollLeft) / state.scale
        state.tempLinkCoords.y = (event.clientY - parentBBox.y + parentElement.scrollTop) / state.scale
        state.drawTempLink = true
        state.needsUpdate = true
    }

    static drawNodeHeader(ctx: CanvasRenderingContext2D, node: AbstractDraggable) {
        const state = node.__canvas.getState()

        const name = node.label
        const color = node.colorRGBA
        const coord = node.getTransformedCoordinates()

        ctx.beginPath()
        ctx.fillStyle = `rgb(${color})`
        ctx.strokeStyle = node.__canvas.getState().borderColor
        ctx.lineWidth = .5
        ctx.roundRect(coord.x, coord.y, node.width, 23, [3, 3, 0, 0])
        ctx.stroke()
        ctx.fill()
        ctx.font = state.defaultFont

        ctx.fillStyle = state.textColor
        ctx.fillText(name, coord.x + IO_RADIUS, coord.y + 15)
        ctx.closePath()

    }

    static drawRoundedRect(ctx: CanvasRenderingContext2D, node: AbstractDraggable, r: number, isSelected: boolean, isFirstSelected: boolean, color: string) {
        const coord = node.getTransformedCoordinates()
        const state = node.__canvas.getState()
        const w = node.width, h = node.height, x = coord.x, y = coord.y
        if (w < 2 * r) r = w / 2
        if (h < 2 * r) r = h / 2
        let outlineColor = state.borderColor
        if (isSelected) {
            outlineColor = isFirstSelected ? state.firstSelectionColor : state.multiSelectionColor
        }
        ctx.fillStyle = color
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.strokeStyle = outlineColor

        ctx.beginPath()
        ctx.roundRect(x, y, w, h, r)
        ctx.stroke()
        ctx.fill()
    }
}
