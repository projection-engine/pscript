import AbstractNode from "../../../core/instances/AbstractNode";
import AbstractOutput from "../../../core/instances/AbstractOutput";
import AbstractInput from "../../../core/instances/AbstractInput";
import Types, {Colors, NodeTypes} from "../javascript.enum";

import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";

export default class Add extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.FUNCTION);

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    constructor(props) {
        super({
            ...props,
            inputs: [
                Input.of({
                    key: "a",
                    label: "A",
                    accept: [
                        PropertyType.of(Types.NUMBER)
                    ],
                    disabled: false,
                    visibleOnNode: true,
                    colorRGBA: Colors.NUMBER
                }),
                Input.of({
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
                Output.of({
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
