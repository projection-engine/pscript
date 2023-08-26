import NodeDraggable from "../../../core/instances/NodeDraggable";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import Types, {Colors, NodeTypes} from "../javascript.enum";

import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";

export default class Add extends NodeDraggable {
    nodeType = NodeType.of(NodeTypes.FUNCTION);

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    constructor(props) {
        super({
            ...props,
            inputs: [
                new Input({
                    key: "a",
                    label: "A",
                    accept: [
                        PropertyType.of(Types.NUMBER)
                    ],
                    disabled: false,
                    visibleOnNode: true,
                    colorRGBA: Colors.NUMBER
                }),
                new Input({
                    key: "b",
                    label: "B",
                    accept: [
                        PropertyType.of(Types.NUMBER)
                    ],
                    disabled: false,
                    visibleOnNode: true,
                    colorRGBA: Colors.NUMBER
                })
            ],
            outputs: [
                new Output({
                    key: "sum",
                    label: "Sum",
                    type: PropertyType.of(Types.NUMBER),
                    disabled: false,
                    colorRGBA: Colors.NUMBER
                })
            ]
        });
    }
}
