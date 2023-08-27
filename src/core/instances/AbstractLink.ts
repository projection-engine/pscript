import Bend from "./Bend";
import AbstractSerializable from "./AbstractSerializable";


export default abstract class AbstractLink extends AbstractSerializable<{
    target: INodeDraggable,
    source: INodeDraggable,
    tR: IInput,
    sR: IOutput
}> implements ILink {
    input: IInput
    output: IOutput
    targetNode: INodeDraggable
    sourceNode: INodeDraggable
    bends: Bend[]

    from(props) {
        // TODO - REMOVE NODE REF
        this.targetNode = props.target
        this.sourceNode = props.source
        this.input = props.tR
        this.output = props.sR
    }
}
