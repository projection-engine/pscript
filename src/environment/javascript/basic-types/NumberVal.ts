import NodeDraggable from "../../../core/instances/NodeDraggable";
import Input from "../../../core/instances/Input";
import Output from "../../../core/instances/Output";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";

export default class NumberVal extends NodeDraggable {
    nodeType = NodeType.of(NodeTypes.VAR);

    getInitialProperties(): MutableObject {
        return {value: 0};
    }

    constructor(props) {
        super({
            ...props,
            inputs: [
                new Input({
                    key: "value",
                    label: "Value",
                    accept: [],
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: [
                new Output({
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
