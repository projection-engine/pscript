import AbstractNode from "./AbstractNode";
import Output from "./Output";
import NodeType from "./NodeType";
import {NodeTypes} from "../pscript.enum";

export default class VariableGetterNode extends AbstractNode implements IVariableNode{
    _variable: IVariable
    nodeType = NodeType.of(NodeTypes.VAR);

    getVariable(){
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
        const instance = new VariableGetterNode()
        instance._variable = props.variable
        instance.from({
            ...props,
            inputs: [],
            outputs: [
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
