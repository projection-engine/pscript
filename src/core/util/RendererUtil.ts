import AbstractNode from "../instances/AbstractNode"
import type AbstractLink from "../instances/AbstractLink"
import IDraggableUtil from "./IDraggableUtil"
import AbstractDraggable from "../instances/AbstractDraggable";
import CanvasRenderEngine from "../CanvasRenderEngine";
import ExecutionInput from "../instances/ExecutionInput";
import ExecutionOutput from "../instances/ExecutionOutput";


export default class RendererUtil {
    static #OFFSET_Y_TITLE = 15
    static #EXECUTION_IO_SIZE = 7
    static #LABEL_OFFSET = 13
    static #HEADER_LABEL_HEIGHT = 23
    static #BORDER_RADIUS = [3, 3, 0, 0]

    static drawBezierCurve(ctx: CanvasRenderingContext2D, x1, x2, y1, y2) {
        const diff = Math.abs((x1 - x2) / 2)
        const pivot = Math.min(x1, x2) + diff

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(pivot, y1, pivot, y2, x2, y2)
        ctx.stroke()
    }

    static drawInput(node: INodeDraggable, index: number, attribute: IInput) {
        if (attribute instanceof ExecutionInput) {
            this.#drawExecutionIO(attribute, node, index)
        } else {
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
            ctx.arc(X, YA, AbstractNode.IO_RADIUS, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            X -= state.smallTextSize
            ctx.fillStyle = state.ioTextColor
            let X_P = X + this.#LABEL_OFFSET
            ctx.fillText(label, X_P, Y - state.smallTextSize / 2)
            ctx.closePath()
        }
    }

    static drawOutput(node: INodeDraggable, index: number, attribute: IOutput) {
        if (attribute instanceof ExecutionOutput) {
            this.#drawExecutionIO(attribute, node, index)
        } else {
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
            ctx.arc(X, YA, AbstractNode.IO_RADIUS, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            X -= state.smallTextSize * 2
            ctx.fillStyle = state.ioTextColor
            ctx.fillText(label, X - labelSize + this.#LABEL_OFFSET, Y - state.smallTextSize / 2)
            ctx.closePath()
        }
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

    static drawLink(ctx: CanvasRenderingContext2D, link: AbstractLink) {
        const T = link.targetNode, S = link.sourceNode
        const coordS = S.getTransformedCoordinates()
        const coordT = T.getTransformedCoordinates()
        const x1 = coordS.x + S.width, x2 = coordT.x,
            y1 = coordS.y + AbstractDraggable.HEADER_HEIGHT + AbstractNode.IO_RADIUS * 3 + S.outputs.indexOf(link.output) * 20,
            y2 = coordT.y + AbstractDraggable.HEADER_HEIGHT + AbstractNode.IO_RADIUS * 3 + T.inputs.indexOf(link.input) * 20

        const isSomeoneDisabled = link.output.disabled || link.input.disabled
        ctx.strokeStyle = IDraggableUtil.getIOColor(link.output, isSomeoneDisabled)

        RendererUtil.drawBezierCurve(ctx, x1, x2, y1, y2)
    }

    static drawTempLink(event: MouseEvent, parentElement, parentBBox: DOMRect, canvasAPI: CanvasRenderEngine) {
        const state = canvasAPI.getState()
        state.tempLinkCoords.x = (event.clientX - parentBBox.x + parentElement.scrollLeft) / state.scale
        state.tempLinkCoords.y = (event.clientY - parentBBox.y + parentElement.scrollTop) / state.scale
        state.drawTempLink = true
        state.needsUpdate = true
    }

    static drawDraggableHeader(ctx: CanvasRenderingContext2D, node: IDraggable) {
        const state = node.__canvas.getState()
        const name = node.label
        const color = node.colorRGBA
        const coord = node.getTransformedCoordinates()

        ctx.beginPath()
        ctx.fillStyle = `rgb(${color})`
        ctx.strokeStyle = node.__canvas.getState().borderColor
        ctx.lineWidth = .5
        ctx.roundRect(coord.x, coord.y, node.width, RendererUtil.#HEADER_LABEL_HEIGHT, RendererUtil.#BORDER_RADIUS)
        ctx.stroke()
        ctx.fill()
        ctx.font = state.defaultFont

        ctx.fillStyle = state.textColor
        ctx.fillText(name, coord.x + AbstractNode.IO_RADIUS, coord.y + RendererUtil.#OFFSET_Y_TITLE)
        ctx.closePath()
    }

    static #drawExecutionIO(io: IInput | IOutput, node: INodeDraggable, index: number) {
        const ctx = node.__canvas.ctx
        const state = node.__canvas.getState()
        const linePosition = IDraggableUtil.getIOPosition(index, node, false)

        ctx.strokeStyle = state.borderColor
        ctx.fillStyle = state.executionIOColor
        ctx.lineWidth = .5
        if (io instanceof ExecutionInput) {
            this.drawTriangleIOExecution(linePosition.y, linePosition.x + AbstractNode.IO_RADIUS * 3, ctx);
        } else {
            this.drawTriangleIOExecution(linePosition.y, linePosition.x + node.width - AbstractNode.IO_RADIUS, ctx);
        }
    }

    private static drawTriangleIOExecution(startY: number, startX: number, ctx: CanvasRenderingContext2D) {
        const X = startX - RendererUtil.#EXECUTION_IO_SIZE

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(X, startY + RendererUtil.#EXECUTION_IO_SIZE);
        ctx.lineTo(X, startY - RendererUtil.#EXECUTION_IO_SIZE);
        ctx.fill();
        ctx.closePath()
        ctx.stroke()

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
