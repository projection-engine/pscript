import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type AbstractDraggable from "../instances/AbstractDraggable"
import type NodeDraggable from "../instances/NodeDraggable"
import CanvasResources from "../libs/CanvasResources"
import {MaterialDataTypes} from "../pscript.enum";
import PScriptRendererState from "../libs/PScriptRendererState";

const types = {
    vec2: 0,
    vec3: 1,
    vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export default class IDraggableUtil {

    static getMinimalType(...typesToCompare): string | undefined {
        const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
        return typesInverted[min]
    }

    static getIOColor(attribute: IO, isSomeoneDisabled: boolean) {
        return `rgba(${attribute.getColor()},${isSomeoneDisabled ? .5 : 1})`
    }

    static getIOPosition(index: number, node: NodeDraggable, asOutput: boolean): {
        x: number,
        y: number,
        height: number,
        width: number,
        rowY: number
    } {
        const coord = node.getTransformedCoordinates()

        const xN = coord.x, yN = coord.y, w = node.width
        const H = HEADER_HEIGHT - 5
        const Y = yN + H * (index + 2)
        const xIO = !asOutput ? xN : xN + w
        const yIO = Y - IO_RADIUS


        return {x: xIO, y: yIO, height: H, width: w, rowY: Y}
    }

    static drag(
        event: MouseEvent,
        node: AbstractDraggable,
        parentBbox,
        asPositionChange: boolean): {
        onMouseMove: Function,
        node: AbstractDraggable
    } {
        const bounding = {
            x: !asPositionChange ? 0 : node.x * CanvasResources.scale - event.clientX,
            y: !asPositionChange ? 0 : node.y * CanvasResources.scale - event.clientY
        }
        if (!asPositionChange) {
            bounding.x -= parentBbox.left
            bounding.y -= parentBbox.top
        }
        const STATE = node.__canvas.getState()
        return {
            node: node,

            onMouseMove: ev => {
                let X = Math.round(((ev.clientX + bounding.x) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
                let Y = Math.round(((ev.clientY + bounding.y) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
                if (asPositionChange) {
                    node.x = X
                    node.y = Y
                } else {
                    X -= node.x
                    Y -= node.y
                    if (X > node.getMinWidth()) {
                        node.width = X - STATE.offsetX
                    }
                    if (Y > node.getMinHeight()) {
                        node.height = Y - STATE.offsetY
                    }
                }

            }
        }
    }
}
