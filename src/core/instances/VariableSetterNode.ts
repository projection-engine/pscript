import AbstractNode from "./AbstractNode";
import NodeType from "./NodeType";
import {NodeTypes} from "../pscript.enum";
import Input from "./Input";

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
                Input.of({
                    key: "value",
                    label: "Value",
                    accept: [props.variable.getType()],
                    colorRGBA: props.variable.getType().getColor(),
                    disabled: false,
                    visibleOnNode: false
                })
            ],
            outputs: []
        });
        return instance
    }
}
