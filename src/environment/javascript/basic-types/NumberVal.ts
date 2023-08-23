import NodeDraggable from "../../../core/instances/NodeDraggable";
import Input from "../../../core/instances/Input";
import Output from "../../../core/instances/Output";
import Types from "../types.enum";

export default class NumberVal extends NodeDraggable {
    inputs = [
        new Input("value", "Value", {type: Types.NUMBER})
    ]
    outputs = [
        new Output("value", "Value", {type: Types.NUMBER})
    ]
}
