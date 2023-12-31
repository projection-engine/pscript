import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors, NodeTypes} from "../javascript.enum";

import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import ExecutionInput from "../../../core/instances/ExecutionInput";
import ExecutionOutput from "../../../core/instances/ExecutionOutput";

export default class Add extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.FUNCTION);

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    static of(props: NodeProps) {
        const instance = new Add()
        instance.from({
            ...props,
            inputs: [
                ExecutionInput.of("run", "Continue"),
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
                ExecutionOutput.of("run", "Continue"),
                Output.of({
                    key: "sum",
                    label: "Sum",
                    type: PropertyType.of(Types.NUMBER),
                    disabled: false,
                    colorRGBA: Colors.NUMBER
                })
            ]
        });
        return instance
    }
}
