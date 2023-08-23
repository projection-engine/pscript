import type NodeDraggable from "./NodeDraggable"
import Bend from "./Bend";

export default class Link implements ILink{
	input: IInput
	output: IOutput
	targetNode: NodeDraggable
	sourceNode: NodeDraggable
	bends: Bend[]

	constructor(target: NodeDraggable, source: NodeDraggable, tR: IInput, sR: IOutput) {
		this.targetNode = target
		this.sourceNode = source
		this.input = tR
		this.output = sR
	}
}
