import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors,} from "../javascript.enum";
import NodeType from "../../../core/instances/NodeType";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import {NodeTypes} from "../../../core/pscript.enum";
import AllTypes from "../all-types";

export default class NumberVal extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.VAR);

    getInitialProperties(): MutableObject {
        return {value: 0};
    }

    static of(props: NodeProps) {
        const instance = new NumberVal()
        instance.from({
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
                    type: AllTypes[Types.NUMBER],
                    disabled: false,
                    colorRGBA: Colors.NUMBER
                })
            ]
        });
        return instance
    }

}
