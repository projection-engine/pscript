import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import NodeType from "../../../core/instances/NodeType";
import ExecutionOutput from "../../../core/instances/ExecutionOutput";

export default class Do extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.FUNCTION);
    width = 50
    resizable = false

    constructor(props) {
        super({
            ...props,
            inputs: [],
            outputs: [
                ExecutionOutput.of("run", "Start"),
            ]
        });
    }

}
