import AbstractNode from "../../../core/instances/AbstractNode";
import AbstractInput from "../../../core/instances/AbstractInput";
import AbstractOutput from "../../../core/instances/AbstractOutput";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";

export default class NumberVal extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.VAR);

    getInitialProperties(): MutableObject {
        return {value: 0};
    }

    constructor(props) {
        super({
            ...props,
            inputs: [
                Input.of({
                    key: "value",
                    label: "Value",
                    accept: [],
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: [
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
