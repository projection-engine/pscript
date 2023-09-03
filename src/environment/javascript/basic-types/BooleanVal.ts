import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors} from "../javascript.enum";
import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import {NodeTypes} from "../../../core/pscript.enum";

export default class BooleanVal extends AbstractNode {

    getInitialProperties(): MutableObject {
        return {truthy: false};
    }

    nodeType = NodeType.of(NodeTypes.VAR);

    static of(props: NodeProps) {
        const instance = new BooleanVal()
        instance.from({
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
                    type: PropertyType.of(Types.BOOLEAN, Colors.BOOLEAN),
                    disabled: false,
                    colorRGBA: Colors.BOOLEAN
                })
            ]
        });
        return instance
    }
}
