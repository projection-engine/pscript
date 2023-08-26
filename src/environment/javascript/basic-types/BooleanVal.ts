import AbstractNode from "../../../core/instances/AbstractNode";
import AbstractInput from "../../../core/instances/AbstractInput";
import AbstractOutput from "../../../core/instances/AbstractOutput";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";

export default class BooleanVal extends AbstractNode {

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    nodeType = NodeType.of(NodeTypes.VAR);

    constructor(props) {
        super({
            ...props,
            inputs: [
                Input.of({
                    key: "truthy",
                    label: "Truthy",
                    accept: [],
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: [
                Output.of({
                    key: "truthy",
                    label: "isTruthy",
                    type: PropertyType.of(Types.BOOLEAN),
                    disabled: false,
                    colorRGBA: Colors.BOOLEAN
                })
            ]
        });
    }
}
