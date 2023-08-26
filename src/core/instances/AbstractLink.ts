import type AbstractNode from "./AbstractNode"
import Bend from "./Bend";

export default abstract class AbstractLink implements ILink {
    input: IInput
    output: IOutput
    targetNode: INodeDraggable
    sourceNode: INodeDraggable
    bends: Bend[]

    protected constructor(target: INodeDraggable, source: INodeDraggable, tR: IInput, sR: IOutput) {
        this.targetNode = target
        this.sourceNode = source
        this.input = tR
        this.output = sR
    }

}
