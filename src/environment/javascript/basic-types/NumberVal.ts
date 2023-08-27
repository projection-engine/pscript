import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import ExecutionInput from "../../../core/instances/ExecutionInput";
import ExecutionOutput from "../../../core/instances/ExecutionOutput";

export default class NumberVal extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.VAR);

    getInitialProperties(): MutableObject {
        return {value: 0};
    }

    constructor(props) {
        super({
            ...props,
            inputs: [
                ExecutionInput.of("run", "Continue"),
                Input.of({
                    key: "value",
                    label: "Value",
                    accept: [],
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: [
                ExecutionOutput.of("run", "Continue"),
                Output.of({
                    key: "value",
                    label: "Value",
                    type: PropertyType.of(Types.NUMBER),
                    disabled: false,
                    colorRGBA: Colors.NUMBER
                })
            ]
        });

    }

}
