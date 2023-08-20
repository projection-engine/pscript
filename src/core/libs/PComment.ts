import type PNode from "./PNode"
import type PScriptCanvas from "./PScriptCanvas"
import CanvasRenderer from "./CanvasRenderer"
import AbstractPDraggable from "./AbstractPDraggable"


export default class PComment extends AbstractPDraggable {
	constructor(x: number, y: number, label: string, colorRGBA: [number, number, number, number]) {
		super(x, y, label, colorRGBA)
		this.height = 200
	}

	drawToCanvas(ctx: CanvasRenderingContext2D, canvasAPI: PScriptCanvas) {
		CanvasRenderer.drawRoundedRect(ctx, this, 3, canvasAPI.selectionMap.get(this.id) !== undefined, canvasAPI.lastSelection === this, `rgba(${[this.colorRGBA[0], this.colorRGBA[1], this.colorRGBA[2], .5]})`)
		CanvasRenderer.drawNodeHeader(ctx, this)
		this.drawScale(ctx)
	}
}
