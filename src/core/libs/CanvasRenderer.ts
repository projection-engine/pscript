import type PNode from "./PNode"
import IO_RADIUS from "../resources/IO_RADIUS"
import type PLink from "./PLink"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type PComment from "./PComment"
import NODE_TYPES from "../resources/NODE_TYPES"
import DraggableNodeUtils from "./DraggableNodeUtils"
import CanvasResources from "./CanvasResources"
import {MaterialDataTypes} from "../pscript.enum";
import AbstractPDraggable from "./AbstractPDraggable";
import PScriptCanvas from "./PScriptCanvas";

const INVERSE_MATERIAL_RENDERING_TYPES = {
    0: "Unlit",
    1: "Isotropic",
    2: "Anisotropic",
    3: "Sheen",
    4: "Clear coat",
    5: "Transparency",
    6: "Sky"
}
export default class CanvasRenderer {


    static drawBezierCurve(ctx: CanvasRenderingContext2D, x1, x2, y1, y2) {
        const diff = Math.abs((x1 - x2) / 2)
        const pivot = Math.min(x1, x2) + diff

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(pivot, y1, pivot, y2, x2, y2)
        ctx.stroke()
    }

    static drawIO(ctx: CanvasRenderingContext2D, asOutput: boolean, node: PNode, index: number, attribute: Input | Output) {
        ctx.font = "8px Roboto"
        ctx.strokeStyle = CanvasResources.borderColor

        const isColor = attribute.type === MaterialDataTypes.COLOR
        const isTexture = attribute.type === MaterialDataTypes.TEXTURE

        const isDisabled = attribute.disabled
        let label = attribute.label

        const linePosition = DraggableNodeUtils.getIOPosition(index, node, asOutput)

        let X = linePosition.x
        const LABEL_OFFSET = 13
        const H = linePosition.height
        const W = linePosition.width
        const Y = linePosition.rowY
        const YA = linePosition.y
        const labelSize = ctx.measureText(label).width + LABEL_OFFSET
        const T_SIZE = ctx.measureText("T").width

        ctx.beginPath()

        if (isColor && !attribute.accept) {
            const data = node[attribute.key]
            if (!data)
                return
            ctx.fillStyle = `rgb(${data[0] * 255},${data[1] * 255},${data[2] * 255})`
            ctx.roundRect(X + IO_RADIUS, Y - H / 2, W / 2, H, 3)
            ctx.fill()
            return
        }

        // if (isTexture && !asOutput) {
        // 	ctx.fillStyle = CanvasResources.backgroundColor
        // 	ctx.roundRect(X + IO_RADIUS, Y - H / 2, W / 2, H, 3)
        // 	ctx.fill()
        // 	ctx.stroke()
        //
        // 	const N = node._texture?.name
        // 	ctx.fillStyle = N !== undefined ? "#d7d7d7" : "red"
        // 	const S = N || "No texture selected"
        // 	ctx.fillText(S.length > 20 ? S.substring(0, 20) + "..." : S, X + T_SIZE * 1.5, Y + T_SIZE / 2)
        // 	return
        // }

        if (attribute.accept || asOutput) {
            ctx.fillStyle = DraggableNodeUtils.getIOColor(attribute, isDisabled)

            ctx.lineWidth = .5

            ctx.arc(X, YA, IO_RADIUS, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
        }

        if (asOutput) {
            X -= T_SIZE * 2
        } else
            X -= T_SIZE

        const isOption = !attribute.accept && !asOutput
        ctx.fillStyle = !isDisabled && !isOption ? "#d7d7d7" : "#999"


        if (asOutput)
            ctx.fillText(label, X - labelSize + LABEL_OFFSET, Y - T_SIZE / 2)
        else {
            let X_P = X + LABEL_OFFSET
            if (isOption) {
                let value = node[attribute.key]
                if (typeof value === "object") {
                    label = label + " -Dynamic Property-"
                } else {
                    if (attribute.key === "renderingMode")
                        value = INVERSE_MATERIAL_RENDERING_TYPES[value]
                    label = label + ` (${value})`
                }
                X_P -= 5
            }
            ctx.fillText(label, X_P, Y - T_SIZE / 2)
        }

        ctx.closePath()
    }

    static drawNodePosition(ctx: CanvasRenderingContext2D, node: AbstractPDraggable) {
        ctx.font = "10px Roboto"
        const coord = node.getTransformedCoordinates()
        const TEXT = `X ${coord.x} Y ${coord.y} W ${node.width} H ${node.height}`
        let Y = coord.y - 10
        if (Y < 0)
            Y = coord.y + node.height + 10
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.fillText(TEXT, coord.x, Y)

    }

    static drawLink(ctx: CanvasRenderingContext2D, link: PLink) {

        const T = link.targetNode, S = link.sourceNode
        const coordS = S.getTransformedCoordinates()
        const coordT = T.getTransformedCoordinates()
        const x1 = coordS.x + S.width, x2 = coordT.x,
            y1 = coordS.y + HEADER_HEIGHT + IO_RADIUS * 3 + S.output.indexOf(link.sourceRef) * 20,
            y2 = coordT.y + HEADER_HEIGHT + IO_RADIUS * 3 + T.inputs.indexOf(link.targetRef) * 20

        const isSomeoneDisabled = link.sourceRef.disabled || link.targetRef.disabled
        ctx.strokeStyle = DraggableNodeUtils.getIOColor(link.sourceRef, isSomeoneDisabled)

        CanvasRenderer.drawBezierCurve(ctx, x1, x2, y1, y2)
    }

    static drawTempLink(event: MouseEvent, parentElement, parentBBox, tempLink, canvasAPI: PScriptCanvas) {
        tempLink.x1 = (event.clientX - parentBBox.x + parentElement.scrollLeft) / CanvasResources.scale
        tempLink.y1 = (event.clientY - parentBBox.y + parentElement.scrollTop) / CanvasResources.scale

        canvasAPI.clear()
        canvasAPI.ctx.strokeStyle = "#0095ff"
        CanvasRenderer.drawBezierCurve(canvasAPI.ctx, tempLink.x, tempLink.x1, tempLink.y, tempLink.y1)
    }

    static drawNodeHeader(ctx: CanvasRenderingContext2D, node: AbstractPDraggable) {
        const name = node.label
        const color = node.colorRGBA
        const coord = node.getTransformedCoordinates()

        ctx.beginPath()
        const fontFill = "#f0f0f0"
        ctx.fillStyle = `rgb(${color})`
        ctx.strokeStyle = CanvasResources.borderColor
        ctx.lineWidth = .5
        ctx.roundRect(coord.x, coord.y, node.width, 23, [3, 3, 0, 0])
        ctx.stroke()
        ctx.fill()

        ctx.font = "10px Roboto"

        ctx.fillStyle = fontFill
        ctx.fillText(name, coord.x + IO_RADIUS, coord.y + 15)
        ctx.closePath()

    }

    static drawRoundedRect(ctx: CanvasRenderingContext2D, node: AbstractPDraggable, r: number, isSelected: boolean, isFirstSelected: boolean, color: string) {
        const coord = node.getTransformedCoordinates()
        const w = node.width, h = node.height, x = coord.x, y = coord.y
        if (w < 2 * r) r = w / 2
        if (h < 2 * r) r = h / 2
        let outlineColor = CanvasResources.borderColor
        if (isSelected)
            outlineColor = isFirstSelected ? "white" : "darkorange"

        ctx.fillStyle = color
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.strokeStyle = outlineColor

        ctx.beginPath()
        ctx.roundRect(x, y, w, h, r)
        ctx.stroke()
        ctx.fill()
    }
}
