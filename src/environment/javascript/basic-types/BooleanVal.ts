import AbstractNode from "../../../core/instances/AbstractNode";
import Input from "../../../core/instances/Input";
import Output from "../../../core/instances/Output";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";

export default class BooleanVal extends AbstractNode {

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    nodeType = NodeType.of(NodeTypes.VAR);

    constructor(props) {
        super({
            ...props,
            inputs: [
                new Input({
                    key: "truthy",
                    label: "Truthy",
                    accept: [],
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: [
                new Output({
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
