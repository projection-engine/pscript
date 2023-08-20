import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type AbstractPDraggable from "./AbstractPDraggable"
import type PNode from "./PNode"
import CanvasResources from "./CanvasResources"
import {MaterialDataTypes} from "../pscript.enum";

const types = {
	vec2: 0,
	vec3: 1,
	vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export default class DraggableNodeUtils {

	static getMinimalType(...typesToCompare): string | undefined {
		const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
		return typesInverted[min]
	}

	static getIOColor(attribute: Output | Input, isSomeoneDisabled: boolean) {
		const type = attribute.type || attribute.accept?.[0]
		switch (type) {
		case MaterialDataTypes.VEC2:
		case MaterialDataTypes.COLOR:
		case MaterialDataTypes.VEC3:
		case MaterialDataTypes.VEC4:
			return `rgba(255,165,0,${isSomeoneDisabled ? .5 : 1})`
		case MaterialDataTypes.TEXTURE:
			return `rgba(138,43,226, ${isSomeoneDisabled ? .5 : 1})`
		case MaterialDataTypes.ANY:
			return `rgba(255,255,255, ${isSomeoneDisabled ? .5 : 1})`
		default:
			return `rgba(153,153,153, ${isSomeoneDisabled ? .5 : 1})`
		}
	}

	static getIOPosition(index: number, node: PNode, asOutput: boolean): { x: number, y: number, height: number, width: number, rowY: number } {
		const xN = node.x, yN = node.y, w = node.width
		const H = HEADER_HEIGHT - 5
		const Y = yN + H * (index + 2)
		const xIO = !asOutput ? xN : xN + w
		const yIO = Y - IO_RADIUS


		return {x: xIO, y: yIO, height: H, width: w, rowY: Y}
	}

	static drag(event: MouseEvent, node: AbstractPDraggable, parentBbox, asPositionChange: boolean): { onMouseUp: Function, onMouseMove: Function, node: AbstractPDraggable } {
		const bounding = {
			x: !asPositionChange ? 0 : node.x * CanvasResources.scale - event.clientX,
			y: !asPositionChange ? 0 : node.y * CanvasResources.scale - event.clientY
		}
		if (!asPositionChange) {
			bounding.x -= parentBbox.left
			bounding.y -= parentBbox.top
		}

		return {
			node: node,
			onMouseUp: () => {
				if (!asPositionChange)
					return
				if (node.y < 0)
					node.y = 0
				if (node.x < 0)
					node.x = 0
				if (node.y > CanvasResources.height)
					node.y = CanvasResources.height - node.height
				if (node.x > CanvasResources.width)
					node.x = CanvasResources.width - node.width
			},
			onMouseMove: ev => {
				let X = Math.round(((ev.clientX + bounding.x) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
				let Y = Math.round(((ev.clientY + bounding.y) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
				if (asPositionChange) {
					node.x = X
					node.y = Y
				} else {
					X -= node.x
					Y -= node.y
					if (X > node.minWidth)
						node.width = X
					if (Y > node.minHeight)
						node.height = Y

				}

			}
		}
	}
}
