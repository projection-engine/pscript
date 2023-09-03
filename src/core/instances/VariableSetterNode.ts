import AbstractNode from "./AbstractNode";
import NodeType from "./NodeType";
import {NodeTypes} from "../pscript.enum";
import Input from "./Input";
import Output from "./Output";
import ExecutionInput from "./ExecutionInput";
import ExecutionOutput from "./ExecutionOutput";

export default class VariableSetterNode extends AbstractNode implements IVariableNode {
    _variable: IVariable
    nodeType = NodeType.of(NodeTypes.VAR);

    getVariable() {
        return this._variable
    }

    from(props: VariableProps) {
        super.from(props)
        this._variable = props.variable
    }


    getInitialProperties(): MutableObject {
        return {truthy: false};
    }


    static of(props: VariableProps) {
        const instance = new VariableSetterNode()
        instance._variable = props.variable
        instance.from({
            ...props,
            inputs: [
                ExecutionInput.of("run", "Continue"),
                Input.of({
                    key: "value",
                    label: "Value",
                    accept: [props.variable.getType()],
                    colorRGBA: props.variable.getType().getColor(),
                    disabled: false,
                    visibleOnNode: true
                })
            ],
            outputs: [
                ExecutionOutput.of("run", "Continue"),
                Output.of({
                    key: "value",
                    label: "Value",
                    type: props.variable.getType(),
                    disabled: false,
                    colorRGBA: props.variable.getType().getColor()
                })
            ]
        });
        return instance
    }
}
