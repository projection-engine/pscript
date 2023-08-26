import type AbstractNode from "./AbstractNode"
import Bend from "./Bend";

export default class Link implements ILink{
	input: IInput
	output: IOutput
	targetNode: AbstractNode
	sourceNode: AbstractNode
	bends: Bend[]

	constructor(target: AbstractNode, source: AbstractNode, tR: IInput, sR: IOutput) {
		this.targetNode = target
		this.sourceNode = source
		this.input = tR
		this.output = sR
	}

}
